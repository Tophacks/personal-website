import { chromium } from 'playwright';
import { readFile,writeFile,mkdir,stat,rm } from 'node:fs/promises';
import { join,resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
const dir=resolve('assets/project-media'), manifestPath=join(dir,'manifest.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
const sources=[
['quadmates','https://quadmates.ca/',/quadmates|study partner|study together/i,'Public Quadmates entry page; no authenticated student profiles or conversations.'],
['transitops','https://transitops-phi.vercel.app/',/transit.?ops|dispatch|simulat|passenger/i,'Public TransitOps simulator UI; not an operating transit-agency feed.'],
['staffflow','https://staff-management-app-da8r.vercel.app/',/staffflow|quadmates workspace|open workspace/i,'Public Staffflow entry page; no private employee or applicant records.'],
['transitops-m','https://transitops-m.vercel.app/',/transitops.?m|depot|miniature|fleet/i,'Public TransitOps-M project website, not footage of physical vehicles.']
];
const temp=join(tmpdir(),'visual-recording');await mkdir(temp,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
let success=0;
try {
for(const [id,url,expected,description] of sources){
 const ctx=await browser.newContext({viewport:{width:1365,height:768},deviceScaleFactor:1,recordVideo:{dir:temp,size:{width:1365,height:768}}});
 const page=await ctx.newPage();let verified=false,videoFile;
 try {
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:27000});
 await page.waitForTimeout(2600);
 const body=(await page.locator('body').innerText().catch(()=>'' )).slice(0,14000);
 const title=await page.title();
 const content=title+'\n'+body;
 const blocked=/Authentication Required|Deployment Protection|Vercel Authentication|Verify you are human|403 Forbidden/i.test(content);
 if(response && response.status()<400 && !blocked && body.length>80 && expected.test(content)){
  const imagePath=join(dir,id+'.jpg');
  await page.screenshot({path:imagePath,type:'jpeg',quality:82,animations:'disabled'});
  verified=(await stat(imagePath)).size>=10000;
  if(!verified) await rm(imagePath,{force:true});
  if(verified){
   await page.mouse.move(680,440);await page.waitForTimeout(650);
   await page.mouse.wheel(0,420);await page.waitForTimeout(1100);
   await page.mouse.wheel(0,370);await page.waitForTimeout(1100);
   await page.mouse.wheel(0,-620);await page.waitForTimeout(900);
  }
 }
 if(!verified) console.log('SKIP '+id+': unauthenticated content not accessible/verified. HTTP '+(response?.status()??'none')+', title '+JSON.stringify(title.slice(0,65)));
 } catch(e){console.warn('SKIP '+id+': '+String(e.message||e).slice(0,150));}
 try {videoFile=await page.video()?.path();}catch{}
 await ctx.close();
 if(!verified) continue;
 const entry={kind:'public-screen',image:'assets/project-media/'+id+'.jpg',description,source:url,recorded_at:new Date().toISOString()};
 if(videoFile){
  const out=join(dir,id+'.webm');
  const ff=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',videoFile,'-an','-vf','fps=12,scale=960:-2','-c:v','libvpx-vp9','-b:v','0','-crf','43','-deadline','realtime','-cpu-used','6',out],{timeout:90000});
  if(ff.status===0 && (await stat(out)).size<12000000) entry.video='assets/project-media/'+id+'.webm';
  else await rm(out,{force:true});
 }
 manifest.projects[id]=entry;success++;
 console.log('CAPTURED '+id+': screenshot'+(entry.video?' + video':''));
}
}finally {await browser.close();}
if(success)manifest.captured_at=new Date().toISOString();
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Successfully captured '+success+' public websites; untouched entries retain labeled source diagrams.');
