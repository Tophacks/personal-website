(function(){
'use strict';
const lib=window.NeurosimEngine;const $=id=>document.getElementById(id);
if(!lib){$('message').textContent='Physics engine failed to load.';return;}
let state,history=[],lastRun=[],timer=null,replayTimer=null,replayIndex=0;
const fg=$('flight-canvas'),ctx=fg.getContext('2d'),chart=$('chart-canvas'),cx=chart.getContext('2d');
const points=[];
for(let i=0;i<45;i++)points.push({x:(i*71+37)%1000,y:(i*123+39)%460+30});
const fix=(n,d=1)=>Number(n).toFixed(d);
function input(){return[Number($('throttle').value)/100,Number($('gimbal').value)/100,Number($('rcs').value)];}
function controls(){
 $('throttle-value').textContent=$('throttle').value+'%';
 $('gimbal-value').textContent=$('gimbal').value+'%';
 $('rcs-value').textContent=$('rcs').value;
}
function snapshot(){
 return{t:state.steps/10,x:state.x,z:state.z,vx:state.vx,vz:state.vz,theta:state.theta,omega:state.omega,fuel:state.fuel,reward:state.reward,status:state.status,action:[...state.lastAction]};
}
function stop(){
 if(timer!==null){clearInterval(timer);timer=null;}
 if(replayTimer!==null){clearInterval(replayTimer);replayTimer=null;}
 $('start').textContent='▶ Start';
}
function reset(){
 stop();state=lib.create({planet:$('planet').value,vehicle:$('vehicle').value,seed:17});
 history=[snapshot()];$('message').textContent='Ready. Use manual controls, or step the simulation in one-second increments.';
 draw();
}
function step(frames=1){
 if(state.status!=='flying'){stop();return;}
 for(let i=0;i<frames&&state.status==='flying';i++){
  lib.step(state,input());history.push(snapshot());
 }
 if(state.status!=='flying'){
  lastRun=history.map(x=>({...x}));
  stop();
  $('message').textContent='Episode ended: '+state.status+'. Landing criteria are checked on touchdown; a high reward alone does not count as success.';
 }
 draw();
}
function world(){
 const w=fg.width,h=fg.height,ground=584;
 ctx.clearRect(0,0,w,h);
 ctx.fillStyle='#091625';ctx.fillRect(0,0,w,h);
 for(const dot of points){ctx.fillStyle='#29415b';ctx.fillRect(dot.x,dot.y,2,2);}
 ctx.strokeStyle='#1c364d';ctx.lineWidth=1;
 for(let x=30;x<w;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
 for(let y=46;y<h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
 const scale=2.4,px=w/2+state.x*scale;
 // Camera follows rocket at high altitudes so the vehicle never disappears at reset.
 const targetY=ground-state.z*scale;
 const camera=Math.max(0,78-targetY);
 const gy=ground+camera,py=targetY+camera;
 ctx.fillStyle='#1f3441';ctx.fillRect(0,gy,w,Math.max(0,h-gy));
 ctx.fillStyle='#466d79';ctx.fillRect(w/2-44,gy-5,88,5);
 ctx.strokeStyle='#deb46d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(w/2,gy-9,70,10,0,0,Math.PI*2);ctx.stroke();
 ctx.save();ctx.translate(px,py);ctx.rotate(state.theta);
 const v=lib.VEHICLES[state.vehicle],rh=Math.max(62,v.height*2.3),rw=Math.max(9,rh*.105);
 const body=(x,y)=>{ctx.fillStyle='#e2e9ed';ctx.fillRect(x,y,rw*2,rh);};
 body(-rw,-rh/2);ctx.fillStyle='#364d5e';ctx.fillRect(-rw,rh*.19,rw*2,rh*.31);
 ctx.fillStyle='#bfd7df';ctx.beginPath();ctx.moveTo(-rw,-rh/2);ctx.lineTo(0,-rh/2-14);ctx.lineTo(rw,-rh/2);ctx.fill();
 ctx.strokeStyle='#aabfc6';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-rw,rh*.26);ctx.lineTo(-rw*2,rh*.57);ctx.moveTo(rw,rh*.26);ctx.lineTo(rw*2,rh*.57);ctx.stroke();
 const [th,,rcs]=input();
 if(state.status==='flying'&&th>0&&state.fuel>0){
  ctx.fillStyle='#f7ac57';ctx.beginPath();ctx.moveTo(-rw*.5,rh*.5);ctx.lineTo(0,rh*.5+th*45);ctx.lineTo(rw*.5,rh*.5);ctx.fill();
 }
 if(rcs){
  ctx.strokeStyle='#75d6f7';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(rcs*rw,-rh*.3);ctx.lineTo(rcs*(rw+26),-rh*.4);ctx.moveTo(-rcs*rw,rh*.3);ctx.lineTo(-rcs*(rw+26),rh*.4);ctx.stroke();
 }
 ctx.restore();
 ctx.fillStyle='#8cadc1';ctx.font='15px monospace';ctx.fillText(state.planet.toUpperCase()+' / '+state.vehicle.replace('_',' ').toUpperCase(),28,37);
 ctx.fillStyle='#92bbd8';ctx.font='13px monospace';ctx.fillText('TARGET X = 0 M',w/2-55,Math.min(h-18,gy+37));
}
function plot(){
 const w=chart.width,h=chart.height;
 cx.clearRect(0,0,w,h);cx.fillStyle='#0b1829';cx.fillRect(0,0,w,h);
 const pad=36,cw=w-2*pad,ch=h-2*pad;
 cx.strokeStyle='#264255';cx.lineWidth=1;
 for(let i=0;i<=4;i++){let y=pad+i*ch/4;cx.beginPath();cx.moveTo(pad,y);cx.lineTo(w-pad,y);cx.stroke();}
 const data=history.filter((_,i)=>i%5===0||i===history.length-1);
 const total=Math.max(10,data[data.length-1]?.t||10);
 const altitudeMax=Math.max(180,...data.map(x=>x.z));
 const speedMax=Math.max(25,...data.map(x=>Math.abs(x.vz)));
 for(const [getter,max,color] of [[x=>x.z,altitudeMax,'#80dfb5'],[x=>x.vz,speedMax,'#e9ba78']]){
  cx.beginPath();data.forEach((d,i)=>{
   const x=pad+d.t/total*cw,y=pad+ch/2-(getter(d)/max)*ch/2;
   if(!i)cx.moveTo(x,y);else cx.lineTo(x,y);
  });cx.strokeStyle=color;cx.lineWidth=2.5;cx.stroke();
 }
 cx.fillStyle='#94abb8';cx.font='13px monospace';cx.fillText('0s',pad,h-9);cx.fillText(fix(total,0)+'s',w-pad-48,h-9);
}
function draw(){
 world();plot();
 $('altitude').textContent=fix(Math.max(0,state.z))+' m';
 $('vz').textContent=fix(state.vz,2)+' m/s';
 $('offset').textContent=fix(state.x)+' m';
 $('pitch').textContent=fix(state.theta*180/Math.PI,2)+'°';
 $('fuel').textContent=fix(state.fuel)+' kg';
 $('reward').textContent=fix(state.reward,1);
 $('sim-clock').textContent='T+ '+fix(state.steps/10)+' s';
 $('mission-state').textContent=state.status.toUpperCase();
}
function exportCsv(){
 const rows=history.length>1?history:lastRun;
 if(rows.length<2){$('message').textContent='Run a flight before exporting telemetry.';return;}
 const headers=['time_s','x_m','z_m','vx_m_s','vz_m_s','theta_rad','omega_rad_s','fuel_kg','total_reward','throttle','gimbal','rcs','status'];
 const csv=[headers.join(','),...rows.map(s=>[s.t,s.x,s.z,s.vx,s.vz,s.theta,s.omega,s.fuel,s.reward,...s.action,s.status].join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='neurosim-manual-flight.csv';a.click();URL.revokeObjectURL(url);
}
function replay(){
 if(history.length>1)lastRun=history.map(x=>({...x}));
 if(lastRun.length<2){$('message').textContent='Run a flight first to create a replay.';return;}
 stop();replayIndex=0;$('message').textContent='Replaying recorded simulated state; manual controls are paused.';
 replayTimer=setInterval(()=>{
  if(replayIndex>=lastRun.length){stop();$('message').textContent='Replay complete.';return;}
  const s=lastRun[replayIndex++];Object.assign(state,s,{steps:Math.round(s.t*10),lastAction:s.action});
  history=lastRun.slice(0,replayIndex);draw();
 },35);
}
$('start').addEventListener('click',()=>{
 if(timer){stop();return;}
 if(state.status!=='flying')reset();
 if(replayTimer)stop();
 $('start').textContent='Ⅱ Pause';
 timer=setInterval(()=>step(Number($('speed').value)),100);
});
$('step').addEventListener('click',()=>{if(timer)stop();step(10);});
$('reset').addEventListener('click',reset);
$('export').addEventListener('click',exportCsv);
$('replay').addEventListener('click',replay);
['planet','vehicle'].forEach(id=>$(id).addEventListener('change',reset));
['throttle','gimbal','rcs'].forEach(id=>$(id).addEventListener('input',controls));
document.addEventListener('keydown',e=>{
 if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
 const change=(id,d,min,max)=>{$(id).value=Math.min(max,Math.max(min,Number($(id).value)+d));controls();};
 if(e.code==='Space'){e.preventDefault();$('start').click();}
 if(e.key==='w'||e.key==='ArrowUp')change('throttle',2,0,100);
 if(e.key==='s'||e.key==='ArrowDown')change('throttle',-2,0,100);
 if(e.key==='a'||e.key==='ArrowLeft')change('gimbal',-5,-100,100);
 if(e.key==='d'||e.key==='ArrowRight')change('gimbal',5,-100,100);
 if(e.key==='q'){$('rcs').value=-1;controls();}
 if(e.key==='e'){$('rcs').value=1;controls();}
});
document.addEventListener('keyup',e=>{if(e.target instanceof HTMLInputElement)return;if(e.key==='q'||e.key==='e'){$('rcs').value=0;controls();}});
window.addEventListener('pagehide',stop);
controls();reset();
})();