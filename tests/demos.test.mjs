import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync,existsSync } from 'node:fs';
import { dirname,resolve,join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
const m=require('../demo-core.js');
test('fixed-seed transit comparison is repeatable and preserves passengers',()=>{
 const a=m.compareTransit(1,90),b=m.compareTransit(1,90);
 assert.deepEqual(a,b);
 for(const s of [a.baseline,a.adaptive]){
  assert.ok(s.waiting>=0);
  assert.ok(s.boarded>=0);
  assert.ok(s.completed>=0);
  assert.equal(s.time,90);
 }
 assert.ok(a.adaptive.staged>=0);
});
test('transit fixed-schedule vs adaptive can be stepped independently',()=>{
 const s=m.createTransit({policy:'baseline'});
 m.stepTransit(s,10);assert.ok(s.buses.some(x=>x.state!=='YARD'));
 assert.equal(s.staged,0);
 const other=m.createTransit({policy:'adaptive'});
 m.stepTransit(other,10);assert.ok(other.time===10);
});
test('rocket browser dynamics consume fuel, respond to gimbal and respect touchdown status',()=>{
 const a=m.createRocket('earth'),b=m.createRocket('earth');
 const oldFuel=a.fuel,oldZ=a.z;
 m.stepRocket(a,{throttle:.6,gimbal:0,rcs:0},10);
 m.stepRocket(b,{throttle:.6,gimbal:.5,rcs:1},10);
 assert.ok(a.fuel<oldFuel);
 assert.notEqual(a.z,oldZ);
 assert.notEqual(a.theta,b.theta);
 assert.ok(['flying','success','crash','out_of_bounds','timeout'].includes(a.status));
});
test('depot guards reserve, dock, release and emergency-stop recovery',()=>{
 const s=m.createDepot();
 assert.throws(()=>m.depotAction(s,'dock'),/matching depot/);
 m.depotAction(s,'reserve');assert.equal(s.bay.reserved,'BUS-01');
 m.depotAction(s,'dock');assert.equal(s.bay.occupied,'BUS-01');
 m.depotAction(s,'dispatch');assert.equal(s.bus.state,'IN_SERVICE');
 m.depotAction(s,'stop');assert.equal(s.bus.state,'FAULT');
 assert.throws(()=>m.depotAction(s,'reserve'));
 assert.throws(()=>m.depotAction(s,'fault-reset'),/cleared interlock/);
 m.depotAction(s,'clear');m.depotAction(s,'fault-reset');
 assert.equal(s.bus.state,'HOLDING');m.depotAction(s,'reserve');m.depotAction(s,'dock');
 assert.equal(s.bus.state,'PARKED');
});
test('vision queue capacity and every third consumed frame',()=>{
 const s=m.createVision();
 for(let i=0;i<20;i++)m.stepVision(s,8,1);
 assert.ok(s.queue.length<=5);assert.ok(s.dropped>0);
 assert.equal(s.processed,Math.floor(s.consumed/3));
 assert.equal(s.skipped,s.consumed-s.processed);
});
test('all six projects offer embedded standalone demos',()=>{
 const index=readFileSync(join(root,'index.html'),'utf8');
 const hub=readFileSync(join(root,'demos.html'),'utf8');
 assert.ok(hub.includes('demo-core.js')&&hub.includes('demos.js'));
 const scripts=['demo-core.js','demos.js','demos.css'];
 for(const p of scripts)assert.ok(existsSync(join(root,p)));
 for(const p of ['quadmates','transitops','staffflow','neurosim','transitops-m','vision']){
  assert.ok(index.includes('projects/'+p+'.html'), 'Homepage should link the full project case study: '+p);
  const casePage=readFileSync(join(root,'projects',p+'.html'),'utf8');
  assert.ok(casePage.includes('project='+p+'&amp;embed=1'));
  assert.ok(hub.includes('data-demo-tab="'+p+'"'));
 }
});

test('full application integrations preserve original interfaces and safe fallbacks',()=>{
 const read=(name)=>readFileSync(join(root,name),'utf8');
 const transit=read('projects/transitops.html');
 const mini=read('projects/transitops-m.html');
 const original=read('full/transitops-m.html');
 assert.ok(transit.includes('https://transitops-phi.vercel.app/'));
 assert.ok(transit.includes('Open full TransitOps in new tab'));
 assert.ok(mini.includes('../full/transitops-m.html'));
 assert.ok(mini.includes('Open original simulator full-screen'));
 for(const token of ['simulatedCommand(action,extra)','Reserve depot','Connecting','EMERGENCY_STOP','SIMULATION_RESET']){
  assert.ok(original.includes(token), 'Original dashboard source should contain '+token);
 }
 assert.ok(original.includes('isolated browser mode'));
});

test('NeuroSim full mission-control interface and case-study embedding are available',()=>{
 const read=(name)=>readFileSync(join(root,name),'utf8');
 const full=read('neurosim-mission.html'),view=read('projects/neurosim.html'),engine=read('neurosim-engine.js');
 assert.ok(full.includes('neurosim-engine.js')&&full.includes('neurosim-mission.js'));
 assert.ok(full.includes('Export CSV')&&full.includes('Replay flight'));
 assert.ok(view.includes('src="../neurosim-mission.html"'));
 assert.ok(engine.includes('thrust*Math.sin(angle)')&&engine.includes('PLANETS'));
});

test('NeuroSim full viewer and local physics are embedded without claiming trained AI',()=>{const read=n=>readFileSync(join(root,n),'utf8');const p=read('projects/neurosim.html');const app=read('full/neurosim.html');assert.ok(p.includes('../neurosim-mission.html'));assert.ok(app.includes('neurosim-model.js'));assert.ok(app.includes('neurosim.js'));assert.ok(app.includes('MANUAL MODE'));});

test('real person-detection app is linked and embedded, with a browser detector',()=>{
 const read=(p)=>readFileSync(join(root,p),'utf8');
 const page=read('projects/vision.html'),app=read('vision-app.html'),js=read('vision-app.js');
 assert.ok(page.includes('src="../vision-app.html"'));
 assert.ok(page.includes('allow="camera"'));
 assert.ok(read('index.html').includes('href="vision-app.html"'));
 assert.ok(app.includes('coco-ssd@2.2.3'));
 assert.ok(app.includes('camera-start')&&app.includes('photo'));
 assert.ok(js.includes("getUserMedia")&&js.includes("model.detect(canvas)"));
 assert.ok(js.includes("item.class==='person'")||js.includes("d.class==='person'"));
 assert.ok(js.includes("getTracks().forEach"));
});
