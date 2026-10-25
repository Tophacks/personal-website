(()=>{
'use strict';
const $=id=>document.getElementById(id),video=$('camera'),still=$('still'),canvas=$('view-canvas'),ctx=canvas.getContext('2d',{alpha:false});
let model=null,loading=null,stream=null,photoUrl=null,image=null,source=null,active=false,busy=false,raf=null,generation=0,results=[],analyzed=0,skipped=0;
const confidence=()=>Number($('confidence').value)/100;
function message(s){$('message').textContent=s;}
function buttons(){ $('camera-start').disabled=active;$('camera-stop').disabled=!active;$('analyze').disabled=!image||active; }
async function detector(){
 if(model)return model;if(loading)return loading;
 if(!window.tf||!window.cocoSsd)throw Error('Detector libraries are unavailable. Disable your content blocker for the model CDN or check your connection.');
 $('detector-status').textContent='Downloading pretrained model…';
 loading=window.cocoSsd.load({base:'lite_mobilenet_v2'}).then(m=>{model=m;$('detector-status').textContent='COCO-SSD ready';return m;}).catch(e=>{loading=null;$('detector-status').textContent='Model unavailable';throw e;});
 return loading;
}
function dimensions(src){
 const w=src.videoWidth||src.naturalWidth||src.width,h=src.videoHeight||src.naturalHeight||src.height;
 if(!w||!h)return false;const scale=Math.min(1,640/w);
 canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));return true;
}
function draw(predictions=results){
 if(!source||!dimensions(source))return;
 $('empty-state').hidden=true;canvas.hidden=false;ctx.drawImage(source,0,0,canvas.width,canvas.height);
 const boxes=(predictions||[]).filter(d=>d.class==='person'&&d.score>=confidence());
 const fontSize=Math.max(12,Math.round(canvas.width/36)),labelHeight=Math.max(18,canvas.width/28);
 ctx.lineWidth=Math.max(2,canvas.width/235);ctx.font='bold '+fontSize+'px monospace';ctx.textBaseline='top';
 for(const obj of boxes){
  const [x,y,w,h]=obj.bbox;
  ctx.strokeStyle='#6cf7b6';ctx.strokeRect(x,y,w,h);
  const label='PERSON '+Math.round(obj.score*100)+'%';
  const width=ctx.measureText(label).width;
  ctx.fillStyle='#11392f';ctx.fillRect(Math.max(0,x),Math.max(0,y-labelHeight),width+12,labelHeight);
  ctx.fillStyle='#e4fff1';ctx.fillText(label,Math.max(2,x+6),Math.max(0,y-labelHeight)+2);
 }
 $('people-count').textContent=String(boxes.length);
 $('processing-status').textContent=boxes.length+' people detected';
}
async function infer(expected=generation){
 if(!model||!source||busy||expected!==generation||!dimensions(source))return;
 busy=true;const start=performance.now();
 try{
  ctx.drawImage(source,0,0,canvas.width,canvas.height);
  const found=await model.detect(canvas);
  if(expected!==generation)return;
  results=found;analyzed++;
  $('inference-time').textContent=Math.round(performance.now()-start)+' ms';
  $('frame-count').textContent=analyzed;
  draw();
 }catch(e){if(expected===generation)message('Detection failed: '+(e.message||'inference error'));}
 finally{busy=false;}
}
function removePhoto(){
 if(photoUrl)URL.revokeObjectURL(photoUrl);
 photoUrl=null;image=null;still.removeAttribute('src');still.hidden=true;$('photo').value='';
}
function stopCamera(announce=true){
 generation++;active=false;
 if(raf!==null){cancelAnimationFrame(raf);raf=null;}
 if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;
 video.pause();video.srcObject=null;video.hidden=true;
 source=image||null;results=[];
 if(source)draw();else{canvas.hidden=true;$('empty-state').hidden=false;}
 $('frame-status').textContent=source?'IMAGE READY':'NO INPUT';buttons();
 if(announce)message('Camera stopped and its track released.');
}
async function cameraStart(){
 if(active)return;const id=++generation;
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera requires HTTPS and a supported browser.');
  message('Requesting optional camera permission…');
  const opened=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:960},height:{ideal:720}}});
  if(id!==generation){opened.getTracks().forEach(t=>t.stop());return;}
  stream=opened;video.srcObject=opened;await video.play();await detector();
  if(id!==generation)return;
  active=true;source=video;results=[];analyzed=skipped=0;
  $('frame-count').textContent='0';$('skipped-count').textContent='0';
  $('frame-status').textContent='CAMERA ACTIVE';buttons();
  message('Camera active. Person detection runs locally with a skipped-frame budget.');
  let frame=0;
  const loop=()=>{
   if(!active||generation!==id)return;
   frame++;
   if(frame%3===0&&!busy)void infer(id);else skipped++;
   $('skipped-count').textContent=String(skipped);
   if(!busy)draw();
   raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);
  opened.getVideoTracks()[0]?.addEventListener('ended',()=>stopCamera());
 }catch(e){if(id===generation){stopCamera(false);message('Camera unavailable: '+(e.message||'permission denied')+'. You can upload a photo instead.');}}
}
async function photoChange(e){
 const file=e.target.files?.[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){
  e.target.value='';message('Choose a JPEG, PNG or WebP under 10 MB.');return;
 }
 if(active)stopCamera(false);
 generation++;removePhoto();
 const id=generation;photoUrl=URL.createObjectURL(file);const img=new Image();
 img.onload=async()=>{
  if(id!==generation)return;
  image=img;source=img;results=[];draw();
  $('frame-status').textContent='IMAGE READY';buttons();
  try{message('Loading model and analyzing your photo locally…');await detector();if(id!==generation)return;await infer(id);message('Photo analyzed. Adjust confidence to filter boxes.');}
  catch(err){if(id===generation)message('Could not analyze photo: '+err.message);}
 };
 img.onerror=()=>{if(id===generation)message('Image could not be decoded.');};
 img.src=photoUrl;
}
function clear(){
 stopCamera(false);generation++;removePhoto();source=null;results=[];canvas.hidden=true;$('empty-state').hidden=false;
 analyzed=skipped=0;$('frame-count').textContent='0';$('skipped-count').textContent='0';
 $('people-count').textContent='—';$('inference-time').textContent='—';$('processing-status').textContent='Inference idle';
 $('frame-status').textContent='NO INPUT';buttons();message('Cleared. Images and video frames were not uploaded.');
}
$('camera-start').addEventListener('click',()=>void cameraStart());
$('camera-stop').addEventListener('click',()=>stopCamera());
$('photo').addEventListener('change',e=>void photoChange(e));
$('analyze').addEventListener('click',async()=>{if(!image)return;try{await detector();await infer();message('Photo re-analyzed locally.');}catch(e){message(e.message);}});
$('confidence').addEventListener('input',e=>{$('confidence-value').textContent=e.target.value+'%';if(source)draw();});
$('clear').addEventListener('click',clear);
window.addEventListener('pagehide',()=>stopCamera(false));buttons();
})();