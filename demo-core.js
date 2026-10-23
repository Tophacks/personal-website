/* Source-inspired, side-effect-free portfolio lab models. No network, accounts or persistence.
 * Source references: TransitOps/backend/simulation_engine.py,
 * NeuroSim-2.0/neurosim/{env,config}.py, TransitOps-M/transitops_m/core.py.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.PortfolioDemoCore=api;
})(typeof window!=="undefined"?window:null,function(){
 "use strict";
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function lcg(state){state.seed=(1664525*state.seed+1013904223)>>>0;return state.seed/4294967296}
 const baseSegment=[5,5,5,8];
 function createTransit({policy="adaptive",traffic=1,seed=17}={}){
  const st={policy,traffic:clamp(Number(traffic)||1,.5,3),seed:seed>>>0,time:0,queues:[[],[],[],[]],buses:[],
    trains:[{at:18,count:60},{at:42,count:45},{at:65,count:52}],arrived:0,boarded:0,completed:0,wait:0,staged:0};
  for(let i=0;i<4;i++)st.buses.push({id:"BUS-"+(i+1),state:"YARD",from:-1,to:3,elapsed:0,duration:1,dwell:0,onboard:[]});
  [12,8,0,20].forEach((n,i)=>transitSpawn(st,i,n));
  return st;
 }
 function transitSpawn(s,stop,count){
  for(let k=0;k<count;k++){
   // Destination preference from TransitOps: 72% forward when forward stops exist.
   const forward=[0,1,2,3].filter(i=>i>stop),backward=[0,1,2,3].filter(i=>i<stop);
   let pool=forward.length&&lcg(s)<.72?forward:backward.length?backward:forward;
   const dest=pool[Math.floor(lcg(s)*pool.length)]??(stop+1)%4;
   s.queues[stop].push({dest,arrived:s.time});s.arrived++;
  }
 }
 function travelMinutes(s,b){let base=b.from===-1?6:baseSegment[b.from%4];return Math.max(2,Math.round(base*s.traffic))}
 function transitDispatch(s,staged=false){
  const bus=s.buses.find(b=>b.state==="YARD");if(!bus)return false;
  bus.state="EN_ROUTE";bus.from=-1;bus.to=3;bus.elapsed=0;bus.duration=Math.max(3,Math.round(6*s.traffic));bus.dwell=0;
  if(staged)s.staged++;return true;
 }
 function stepTransit(s,minutes=1){
  for(let n=0;n<minutes;n++){
   s.time++;
   const rates=[1.35,1,.9,1.15];
   rates.forEach((rate,i)=>{const expected=rate*(.8+.3*s.traffic);const integer=Math.floor(expected);transitSpawn(s,i,integer+(lcg(s)<expected-integer?1:0));});
   for(const t of s.trains)if(t.at===s.time)transitSpawn(s,3,t.count);
   if(s.time%10===0)transitDispatch(s,false);
   if(s.policy==="adaptive"){
    const demand=s.queues[0].length+s.queues[1].length+s.queues[3].length+
      s.trains.filter(t=>t.at>s.time&&t.at-s.time<=10).reduce((acc,t)=>acc+t.count,0);
    const arrivingCapacity=s.buses.filter(b=>b.state!=="YARD"&&[0,1,3].includes(b.to))
      .reduce((acc,b)=>acc+Math.max(0,35-b.onboard.length),0);
    if(demand>Math.max(70,arrivingCapacity+25))transitDispatch(s,true);
   }
   for(const b of s.buses){
    if(b.state==="YARD")continue;
    if(b.state==="DWELLING"){
     if(--b.dwell<=0){b.from=b.to;b.to=(b.from+1)%4;b.state="EN_ROUTE";b.elapsed=0;b.duration=travelMinutes(s,b);}
     continue;
    }
    b.elapsed++;
    if(b.elapsed<b.duration)continue;
    b.onboard=b.onboard.filter(p=>{if(p.dest===b.to){s.completed++;return false}return true});
    const q=s.queues[b.to];const boarding=q.splice(0,Math.max(0,35-b.onboard.length));
    for(const p of boarding){s.boarded++;s.wait+=Math.max(0,s.time-p.arrived);}
    b.onboard.push(...boarding);b.state="DWELLING";b.dwell=1;
   }
  }
  return s;
 }
 function transitSummary(s){return{time:s.time,waiting:s.queues.reduce((a,q)=>a+q.length,0),boarded:s.boarded,completed:s.completed,staged:s.staged,mean:s.boarded?(s.wait/s.boarded):null,queues:s.queues.map(q=>q.length)}}
 function compareTransit(traffic=1,minutes=90){
  const baseline=createTransit({policy:"baseline",traffic});const adaptive=createTransit({policy:"adaptive",traffic});
  stepTransit(baseline,minutes);stepTransit(adaptive,minutes);
  return{baseline:transitSummary(baseline),adaptive:transitSummary(adaptive)};
 }
 const PLANETS={earth:{gravity:9.81,airDensity:1.225},mars:{gravity:3.71,airDensity:.020},moon:{gravity:1.62,airDensity:0}};
 const ROCKET={dryMass:22000,fuelMass:8500,maxThrust:750000,burnRate:210,height:35,diameter:3.6,maxGimbalDeg:8,dragCoefficient:.5};
 function createRocket(planet="earth"){if(!PLANETS[planet])planet="earth";return{planet,x:16,z:160,vx:-2,vz:-14,theta:.05,omega:0,fuel:8500,time:0,status:"flying"}}
 function stepRocket(s,{throttle=0,gimbal=0,rcs=0}={},steps=1){
  for(let i=0;i<steps&&s.status==="flying";i++){
   const p=PLANETS[s.planet],dt=.1,T=ROCKET,th=clamp(Number(throttle),0,1),g=clamp(Number(gimbal),-1,1),r=clamp(Number(rcs),-1,1);
   const actual=s.fuel>0?th:0,fuelUsed=Math.min(s.fuel,T.burnRate*actual*dt);
   s.fuel=Math.max(0,s.fuel-fuelUsed);
   const mass=T.dryMass+s.fuel+.5*fuelUsed,thrust=T.maxThrust*fuelUsed/(T.burnRate*dt);
   const angle=s.theta+g*T.maxGimbalDeg*Math.PI/180;
   // Browser demo adds 0.55*RCS torque: current Python env.py records/penalizes RCS
   // but does not yet apply RCS in angular acceleration. Explicit demo-only extension.
   const angularAccel=-2*(thrust/T.maxThrust)*g-.12*s.omega+.55*r;
   s.omega+=angularAccel*dt;s.theta+=s.omega*dt;
   const crossArea=Math.PI*(T.diameter/2)**2;
   const dragX=-.5*p.airDensity*T.dragCoefficient*crossArea*s.vx*Math.abs(s.vx)/mass;
   const dragZ=-.5*p.airDensity*T.dragCoefficient*crossArea*s.vz*Math.abs(s.vz)/mass;
   const ax=thrust*Math.sin(angle)/mass+dragX,az=thrust*Math.cos(angle)/mass-p.gravity+dragZ;
   s.vx+=ax*dt;s.vz+=az*dt;s.x+=s.vx*dt;s.z+=s.vz*dt;s.time+=dt;
   const touchdown=s.z<=T.height/2;
   const bounds=Math.abs(s.x)>300||s.z>450||Math.abs(s.theta)>1.4;
   const safe=touchdown&&Math.abs(s.x)<=8&&Math.abs(s.vx)<2&&Math.abs(s.vz)<3&&Math.abs(s.theta)<.12&&Math.abs(s.omega)<.12;
   if(touchdown)s.status=safe?"success":"crash";
   else if(bounds)s.status="out_of_bounds";
   else if(s.time>=80)s.status="timeout";
  }
  return s;
 }
 function createDepot(){return{tick:0,fault:false,bus:{id:"BUS-01",state:"IN_SERVICE",distance:0,battery:100,bay:null,trips:0,dwell:0},bay:{reserved:null,occupied:null},events:[{tick:0,type:"SIMULATION_READY"}]}}
 function depotEvent(s,type){s.events.unshift({tick:s.tick,type});s.events=s.events.slice(0,12)}
 function depotAction(s,action){
  const b=s.bus,bay=s.bay;
  switch(action){
   case "reserve":
    if(!["IN_SERVICE","HOLDING"].includes(b.state))throw Error("Bus is not operating.");
    if(bay.occupied||bay.reserved||s.fault)throw Error("Automated bay unavailable.");
    bay.reserved=b.id;b.state="RETURNING";b.dwell=0;depotEvent(s,"DEPOT_RESERVED");break;
   case "dock":
    if(b.state!=="RETURNING"||bay.reserved!==b.id)throw Error("No matching depot reservation.");
    if(bay.occupied||s.fault)throw Error("Docking interlock active.");
    b.state="PARKED";b.bay="DEPOT-1";bay.occupied=b.id;bay.reserved=null;depotEvent(s,"DOCK_CONFIRMED");break;
   case "dispatch":
    if(!["PARKED","READY"].includes(b.state))throw Error("Vehicle is not parked or ready.");
    if(s.fault)throw Error("Depot interlock active.");
    if(b.bay&&bay.occupied!==b.id)throw Error("Bay occupancy mismatch.");
    bay.occupied=null;b.bay=null;b.state="IN_SERVICE";b.dwell=0;depotEvent(s,"VEHICLE_RELEASED");break;
   case "stop":
    s.fault=true;
    if(["IN_SERVICE","HOLDING","RETURNING","DOCKING"].includes(b.state))b.state="FAULT";
    bay.reserved=null;depotEvent(s,"EMERGENCY_STOP");break;
   case "clear":
    s.fault=false;depotEvent(s,"INTERLOCK_CLEARED");break;
   case "fault-reset":
    if(b.state!=="FAULT"||s.fault)throw Error("Reset requires fault state and cleared interlock.");
    b.state="HOLDING";depotEvent(s,"BUS_RESET_TO_HOLD");break;
   case "tick":
    for(let t=0;t<10;t++){
     s.tick++;
     if(b.state!=="IN_SERVICE"||s.fault)continue;
     if(b.dwell){b.dwell--;continue}
     const prev=b.distance;b.distance=(b.distance+.025)%1;b.battery=Math.max(0,+(b.battery-.05).toFixed(3));
     for(const station of [.2,.7])if((prev<=station&&station<b.distance)||(b.distance<prev&&(station>=prev||station<b.distance))){
      b.dwell=3;depotEvent(s,station===.2?"STATION_A_ARRIVAL":"STATION_B_ARRIVAL");
     }
     if(b.distance<prev)b.trips++;
     if(b.battery===0){b.state="HOLDING";depotEvent(s,"BATTERY_EMPTY_SIM");}
    }break;
   default:throw Error("Unknown depot action.");
  }
  return s;
 }
 function createVision(){return{tick:0,captured:0,processed:0,skipped:0,dropped:0,consumed:0,queue:[]}}
 function stepVision(s,camera=3,worker=2){
  s.tick++;for(let i=0;i<camera;i++){s.captured++;if(s.queue.length<5)s.queue.push(s.captured);else s.dropped++;}
  for(let i=0;i<worker&&s.queue.length;i++){s.queue.shift();s.consumed++;if(s.consumed%3===0)s.processed++;else s.skipped++;}
  return s;
 }
 return{createTransit,stepTransit,transitSummary,compareTransit,createRocket,stepRocket,createDepot,depotAction,createVision,stepVision,PLANETS,ROCKET};
});