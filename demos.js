/* Browser-only interactive exhibits. These never call production APIs or load user data. */
(function(){
"use strict";
const core=window.PortfolioDemoCore;
if(!core){document.body.textContent="Interactive models could not load.";return;}
const $=id=>document.getElementById(id);
const listen=(id,event,fn)=>{const e=$(id);if(e)e.addEventListener(event,fn)};
const num=n=>Number(n).toLocaleString('en-CA');
const fmt=(n,unit="")=>Number.isFinite(n)?n.toFixed(1)+unit:"—";
const tabs=[...document.querySelectorAll("[data-demo-tab]")];
const panels=[...document.querySelectorAll("[data-demo-panel]")];
let rocketTimer=null;
function pauseRocket(){if(rocketTimer){clearInterval(rocketTimer);rocketTimer=null;$("rocket-play").textContent="Resume flight";}}
function selectTab(name,focus=false){
 if(!tabs.some(t=>t.dataset.demoTab===name))name="transitops";
 tabs.forEach(t=>{
  const selected=t.dataset.demoTab===name;
  t.setAttribute("aria-selected",String(selected));t.tabIndex=selected?0:-1;
  if(selected&&focus)t.focus();
 });
 panels.forEach(p=>p.hidden=p.dataset.demoPanel!==name);
 if(name!=="neurosim")pauseRocket();
}
tabs.forEach((tab,index)=>{
 tab.addEventListener("click",()=>selectTab(tab.dataset.demoTab));
 tab.addEventListener("keydown",e=>{
  if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
  e.preventDefault();
  const next=e.key==="Home"?0:e.key==="End"?tabs.length-1:e.key==="ArrowRight"?(index+1)%tabs.length:(index+tabs.length-1)%tabs.length;
  selectTab(tabs[next].dataset.demoTab,true);
 });
});
const query=new URLSearchParams(window.location.search);
const embed=query.get("embed")==="1";
if(embed)document.body.classList.add("embedded");
selectTab(query.get("project")||"transitops");

// TRANSITOPS: the route and dispatch rule are adapted from simulation_engine.py.
const stations=["UW","Square","Hospital","Central"];
const points=[[75,245],[250,151],[430,198],[618,75]],yard=[665,290];
let transit=core.createTransit();
function busPosition(b){
 if(b.state==="YARD")return yard;
 const start=b.from===-1?yard:points[b.from],end=points[b.to];
 const alpha=b.state==="DWELLING"?1:Math.min(1,b.elapsed/Math.max(1,b.duration));
 return[start[0]+(end[0]-start[0])*alpha,start[1]+(end[1]-start[1])*alpha];
}
function renderTransit(){
 const stats=core.transitSummary(transit);
 $("transit-boarded").textContent=num(stats.boarded);
 $("transit-waiting").textContent=num(stats.waiting);
 $("transit-staged").textContent=String(stats.staged);
 $("transit-mean").textContent=stats.mean==null?"—":fmt(stats.mean," min");
 $("transit-stops").replaceChildren(...stations.map((name,i)=>{
  const span=document.createElement("span");
  span.textContent=name+": "+stats.queues[i]+" waiting";return span;
 }));
 const layer=$("transit-buses");
 layer.replaceChildren();
 transit.buses.forEach((b,i)=>{
  if(b.state==="YARD")return;
  const [x,y]=busPosition(b),circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
  circle.setAttribute("cx",x);circle.setAttribute("cy",y+(i%2)*9);circle.setAttribute("r",9);
  const label=document.createElementNS("http://www.w3.org/2000/svg","text");
  label.setAttribute("x",x+12);label.setAttribute("y",y+(i%2)*9-10);
  label.textContent=String(i+1);
  layer.append(circle,label);
 });
 $("transit-message").textContent="Minute "+stats.time+" · "+transit.policy+
  " policy · "+transit.buses.filter(b=>b.state!=="YARD").length+
  " active buses. This is a toy corridor model, not realtime service data.";
}
function resetTransit(){
 transit=core.createTransit({policy:$("transit-mode").value,traffic:Number($("transit-traffic").value)});
 renderTransit();
}
listen("transit-traffic","input",()=>{$("transit-traffic-value").textContent=$("transit-traffic").value+"×";resetTransit()});
listen("transit-mode","change",resetTransit);
listen("transit-step","click",()=>{core.stepTransit(transit);renderTransit()});
listen("transit-run","click",()=>{core.stepTransit(transit,30);renderTransit()});
listen("transit-reset","click",resetTransit);
listen("transit-compare","click",()=>{
 const {baseline,adaptive}=core.compareTransit(Number($("transit-traffic").value),90);
 const delta=adaptive.waiting-baseline.waiting,word=delta<0?"fewer":delta>0?"more":"the same number of";
 $("transit-message").textContent="Same initial conditions and seed, 90 simulated minutes: baseline "+
  baseline.waiting+" waiting / "+baseline.boarded+" boarded, adaptive "+
  adaptive.waiting+" waiting / "+adaptive.boarded+" boarded. Adaptive leaves "+
  Math.abs(delta)+" "+word+" passengers waiting. Compare the trade-off, not a guaranteed improvement.";
});
resetTransit();

// NEUROSIM: browser port of the public numerical environment and presets.
let rocket=core.createRocket();
const canvas=$("rocket-canvas"),ctx=canvas.getContext("2d");
const planetColors={earth:"#b8ebca",mars:"#eaba84",moon:"#b7bfca"};
function rocketInput(){return{throttle:Number($("rocket-throttle").value)/100,gimbal:Number($("rocket-gimbal").value)/100,rcs:Number($("rocket-rcs").value)}}
function rocketDraw(){
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);
 ctx.fillStyle="#102019";ctx.fillRect(0,0,w,h);
 ctx.strokeStyle="#294237";ctx.lineWidth=1;
 for(let x=0;x<w;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
 for(let y=0;y<h;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
 const ground=329,scale=1.5;
 ctx.fillStyle="#35483d";ctx.fillRect(0,ground,w,h-ground);
 ctx.fillStyle="#c5ef8c";ctx.fillRect(w/2-25,ground-5,50,5);
 ctx.strokeStyle="#d7eead";ctx.beginPath();ctx.moveTo(w/2,ground-18);ctx.lineTo(w/2,ground+2);ctx.stroke();
 const x=w/2+rocket.x*2.6,y=ground-rocket.z*scale;
 const angle=rocket.theta;
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 ctx.fillStyle="#e4efea";ctx.fillRect(-7,-34,14,62);
 ctx.fillStyle="#1a3330";ctx.fillRect(-7,12,14,13);
 ctx.fillStyle="#d4e9de";ctx.beginPath();ctx.moveTo(-7,-34);ctx.lineTo(0,-47);ctx.lineTo(7,-34);ctx.closePath();ctx.fill();
 ctx.strokeStyle="#b7ccc0";ctx.lineWidth=3;
 ctx.beginPath();ctx.moveTo(-7,19);ctx.lineTo(-21,37);ctx.moveTo(7,19);ctx.lineTo(21,37);ctx.stroke();
 const th=rocketInput().throttle;
 if(th>0&&rocket.fuel>0&&rocket.status==="flying"){
  ctx.fillStyle="#ffac56";ctx.beginPath();ctx.moveTo(-5,29);ctx.lineTo(0,29+33*th);ctx.lineTo(5,29);ctx.fill();
 }
 ctx.restore();
 ctx.fillStyle=planetColors[rocket.planet];ctx.font="12px monospace";ctx.fillText(rocket.planet.toUpperCase()+" / 2D RESEARCH MODEL",17,25);
 ctx.fillStyle="#d4e99c";ctx.fillText("TARGET: x=0 m",w/2-55,h-17);
 if(rocket.status!=="flying"){
  ctx.fillStyle=rocket.status==="success"?"#caed90":"#ffb49b";
  ctx.font="700 22px sans-serif";ctx.fillText(rocket.status.replace("_"," ").toUpperCase(),20,55);
 }
}
function renderRocket(){
 $("rocket-z").textContent=fmt(Math.max(0,rocket.z)," m");
 $("rocket-vz").textContent=fmt(rocket.vz," m/s");
 $("rocket-angle").textContent=fmt(rocket.theta*180/Math.PI,"°");
 $("rocket-fuel").textContent=fmt(rocket.fuel/85,"%");
 $("rocket-status").textContent=rocket.status.toUpperCase();
 $("rocket-position")?.replaceChildren(document.createTextNode("T + "+fmt(rocket.time," s")));
 $("rocket-message").textContent=rocket.status==="flying"?
  "Flight is manual. Landing needs |x| ≤ 8 m, |vx| < 2 m/s, |vz| < 3 m/s and small tilt.":
  rocket.status==="success"?"Successful simulated touchdown in the browser model.":
  "Flight ended: "+rocket.status.replace("_"," ")+". Reset and try a different control profile.";
 rocketDraw();
}
function stepRocket(n=1){
 core.stepRocket(rocket,rocketInput(),n);
 if(rocket.status!=="flying")pauseRocket();
 renderRocket();
}
function resetRocket(){
 pauseRocket();rocket=core.createRocket($("rocket-planet").value);
 $("rocket-play").textContent="Start flight";renderRocket();
}
listen("rocket-planet","change",resetRocket);
[["rocket-throttle","rocket-throttle-value","%"],["rocket-gimbal","rocket-gimbal-value","%"],["rocket-rcs","rocket-rcs-value",""]].forEach(([id,output,suffix])=>listen(id,"input",()=>{
 $(output).textContent=$(id).value+suffix;
 renderRocket();
}));
listen("rocket-play","click",()=>{
 if(rocket.status!=="flying")resetRocket();
 if(rocketTimer){pauseRocket();return}
 $("rocket-play").textContent="Pause flight";
 rocketTimer=setInterval(()=>stepRocket(1),45);
});
listen("rocket-step","click",()=>stepRocket(10));
listen("rocket-reset","click",resetRocket);
renderRocket();

// DEPOT-B: direct state-guard adaptation of public transitops_m/core.py.
let depot=core.createDepot();
function renderDepot(){
 const b=depot.bus;
 $("depot-state").textContent=b.state;
 $("depot-battery").textContent=fmt(b.battery,"%")+" BATTERY";
 $("depot-interlock").textContent=depot.fault?"INTERLOCK ACTIVE":"INTERLOCK CLEAR";
 $("depot-bay").textContent=depot.bay.occupied?"OCCUPIED / "+depot.bay.occupied:depot.bay.reserved?"RESERVED / "+depot.bay.reserved:"AVAILABLE";
 $("depot-bus-visual").style.transform="translateX("+Math.round((b.distance-.5)*130)+"px)";
 $("depot-log").replaceChildren(...depot.events.slice(0,5).map(e=>{
  const p=document.createElement("p");p.textContent="T+"+e.tick+" / "+e.type;return p;
 }));
}
function depotAct(a){
 try{
  if(a==="reset")depot=core.createDepot();else core.depotAction(depot,a);
  $("depot-message").textContent="Action completed: "+(a==="reset"?"SIMULATION_RESET":depot.events[0]?.type||a);
 }catch(e){$("depot-message").textContent="Blocked: "+e.message}
 renderDepot();
}
[["depot-tick","tick"],["depot-reserve","reserve"],["depot-dock","dock"],["depot-dispatch","dispatch"],
 ["depot-stop","stop"],["depot-clear","clear"],["depot-fault-reset","fault-reset"],["depot-reset","reset"]]
 .forEach(([id,action])=>listen(id,"click",()=>depotAct(action)));
renderDepot();

// QUADMATES: fictional data. Open discovery and guarded study requests.
const profiles=[
 {id:"a",name:"Sample Student A",program:"Computer Science",courses:["CS 135","MATH 137"],mode:"in_person"},
 {id:"b",name:"Sample Student B",program:"Economics",courses:["ECON 101","MATH 137"],mode:"online"},
 {id:"c",name:"Sample Student C",program:"Physics",courses:["PHYS 121","MATH 137"],mode:"in_person"},
 {id:"d",name:"Sample Student D",program:"Computing",courses:["CS 135","ECON 101"],mode:"online"}
];
let requests={},pending=null;
function renderQuad(){
 const course=$("quad-course").value,mode=$("quad-mode").value;
 const filtered=profiles.filter(p=>(!course||p.courses.includes(course))&&(!mode||p.mode===mode));
 const grid=$("quad-results");grid.replaceChildren();
 if(!filtered.length){const p=document.createElement("p");p.textContent="No students in this fictional sample match the filters.";grid.appendChild(p);}
 for(const p of filtered){
  const card=document.createElement("article");card.className="student-card";
  const header=document.createElement("header");
  const avatar=document.createElement("div");avatar.className="student-avatar";avatar.textContent=p.id.toUpperCase();
  const title=document.createElement("div"),name=document.createElement("h4"),desc=document.createElement("small");
  name.textContent=p.name;desc.textContent=p.program;title.append(name,desc);header.append(avatar,title);
  const info=document.createElement("p");info.textContent=p.courses.join(" · ")+" / "+p.mode.replace("_"," ");
  const btn=document.createElement("button");btn.textContent=requests[p.id]||"Send study request";
  btn.disabled=Boolean(requests[p.id]);
  btn.addEventListener("click",()=>quadRequest(p.id));
  card.append(header,info,btn);grid.appendChild(card);
 }
}
function quadRequest(id){
 const p=profiles.find(x=>x.id===id);
 if(!p)return;
 if(requests[id]){$("quad-message").textContent="Duplicate request blocked.";return}
 requests[id]="Pending";pending=id;
 $("quad-message").textContent="Mock study request sent to "+p.name+". Accept or decline it to test the lifecycle.";
 renderQuad();
}
function quadAnswer(status){
 if(!pending){$("quad-message").textContent="Select a sample student and send a request first.";return}
 const id=pending;
 requests[id]=status==="accepted"?"Matched":"Declined";
 $("quad-message").textContent=profiles.find(p=>p.id===id).name+": "+status+
  (status==="accepted"?". A demo conversation would now be available.":". No conversation was created.");
 pending=null;renderQuad();
}
["quad-course","quad-mode"].forEach(id=>listen(id,"change",renderQuad));
listen("quad-accept","click",()=>quadAnswer("accepted"));
listen("quad-decline","click",()=>quadAnswer("declined"));
listen("quad-reset","click",()=>{requests={};pending=null;$("quad-course").value="";$("quad-mode").value="";$("quad-message").textContent="Scenario reset.";renderQuad()});
renderQuad();

// STAFFFLOW: fictitious pipeline, non-executable objective assessment sample.
const stageOrder=["applied","in_review","assessment","interview","offer","hired"];
const initialStaff=[
 {id:"s1",name:"Example Applicant A",role:"Software Intern",stage:"applied"},
 {id:"s2",name:"Example Applicant B",role:"Operations Intern",stage:"assessment"},
 {id:"s3",name:"Example Applicant C",role:"UI Engineer",stage:"interview"}
];
let staff=initialStaff.map(s=>({...s}));
function renderStaff(){
 const selected=$("staff-person").value;
 $("staff-person").replaceChildren(...staff.map(s=>{const o=document.createElement("option");o.value=s.id;o.textContent=s.name;return o}));
 if(staff.some(s=>s.id===selected))$("staff-person").value=selected;
 const board=$("staff-board");board.replaceChildren();
 staff.forEach((s,i)=>{
  const row=document.createElement("div");row.className="candidate-row";
  const n=document.createElement("span");n.textContent="0"+(i+1);
  const name=document.createElement("div"),strong=document.createElement("strong"),small=document.createElement("small");
  strong.textContent=s.name;small.textContent=s.role;name.append(strong,small);
  const chip=document.createElement("span");chip.className="stage-chip";chip.textContent=s.stage.replace("_"," ").toUpperCase();
  row.append(n,name,chip);board.appendChild(row);
 });
}
function staffAction(action){
 const s=staff.find(x=>x.id===$("staff-person").value);
 if(!s)return;
 if(action==="reject"){
  if(s.stage==="hired"){$("staff-message").textContent="This demo does not permit rejecting an already hired applicant.";return}
  s.stage="rejected";
 }else{
  const i=stageOrder.indexOf(s.stage);
  if(i<0||i===stageOrder.length-1){$("staff-message").textContent="No further stage available.";return}
  s.stage=stageOrder[i+1];
 }
 $("staff-message").textContent=s.name+" moved to "+s.stage.replace("_"," ")+". Human review remains required for hiring decisions.";
 renderStaff();
}
listen("staff-advance","click",()=>staffAction("advance"));
listen("staff-reject","click",()=>staffAction("reject"));
listen("staff-reset","click",()=>{staff=initialStaff.map(s=>({...s}));$("staff-answer").value="";$("staff-message").textContent="Fictional hiring pipeline reset.";renderStaff()});
listen("staff-grade","click",()=>{
 const ans=$("staff-answer").value;
 $("staff-message").textContent=!ans?"Choose an answer before scoring.":
   ans==="[4, 6]"?"Objective answer correct (1/1). A human still reviews candidates.":
   "Objective answer incorrect (0/1). No automatic hiring decision occurs.";
});
renderStaff();

// VISION: bounded queue and every-third-frame detector scheduling.
let vision=core.createVision();
function renderVision(){
 $("vision-in").textContent=vision.captured+" captured";
 $("vision-queue").textContent=vision.queue.length+" queued";
 $("vision-detected").textContent=vision.processed+" detections scheduled";
 $("vision-tick").textContent="TICK "+vision.tick;
 $("vision-dropped").textContent="DROPPED "+vision.dropped;
 $("vision-skipped").textContent="SKIPPED "+vision.skipped;
 $("vision-dots").replaceChildren(...vision.queue.map(()=>{
  const dot=document.createElement("b");return dot;
 }));
}
function advanceVision(ticks=1){
 for(let i=0;i<ticks;i++)core.stepVision(vision,Number($("vision-rate").value),Number($("vision-worker").value));
 renderVision();
 $("vision-message").textContent="After "+vision.tick+" ticks, "+vision.dropped+" incoming frames dropped; "+
  vision.processed+" detection passes scheduled. No person detection actually runs in this demo.";
}
[["vision-rate","vision-rate-value"],["vision-worker","vision-worker-value"]].forEach(([id,output])=>listen(id,"input",()=>{$(output).textContent=$(id).value}));
listen("vision-step","click",()=>advanceVision());
listen("vision-run","click",()=>advanceVision(15));
listen("vision-reset","click",()=>{vision=core.createVision();renderVision();$("vision-message").textContent="Pipeline reset."});
renderVision();
window.addEventListener("pagehide",pauseRocket);
})();
