(() => {
  const mode = document.getElementById('replayMode');
  const play = document.getElementById('replayPlay');
  const reset = document.getElementById('replayReset');
  const slider = document.getElementById('replayTime');
  const minute = document.getElementById('replayMinute');
  const map = document.getElementById('replayMap');
  const stats = document.getElementById('replayStats');
  const status = document.getElementById('replayState');
  let data, timer;
  const ns = 'http://www.w3.org/2000/svg';
  function node(tag, attrs, text) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key,value]) => el.setAttribute(key,value));
    if (text !== undefined) el.textContent = text;
    map.append(el); return el;
  }
  function pause() { clearInterval(timer); timer = null; play.textContent = 'Play'; }
  function render() {
    if (!data) return;
    const run = data.runs[mode.value];
    const frame = run.timeline[Number(slider.value)];
    minute.value = frame.minute;
    map.replaceChildren();
    const xy = (x,y) => [40 + x*6.6, 30 + y*2.55];
    node('polyline',{points:frame.stops.map(s=>xy(s.x,s.y).join(',')).join(' '),fill:'none',stroke:'#aa9c85','stroke-width':12,'stroke-linecap':'round'});
    frame.stops.forEach(s=>{
      const [x,y]=xy(s.x,s.y);
      node('circle',{cx:x,cy:y,r:8,fill:'#315747'});
      node('text',{x:x+14,y:y-13,'font-size':12,fill:'#26231f'},s.name.replace('University of Waterloo','Waterloo').replace('Grand River Hospital','Hospital'));
      node('text',{x:x+14,y:y+5,'font-size':11,fill:'#534a40'},`${s.queue} waiting`);
    });
    frame.buses.forEach((bus,i)=>{
      const [x,y]=xy(bus.x,bus.y);const offset=(i-1.5)*12;
      node('rect',{x:x-12,y:y+offset-6,width:24,height:12,rx:3,fill:bus.state==='YARD'?'#8b8174':'#76533c',stroke:'#fbf7ef','stroke-width':1});
      node('text',{x:x-85,y:y+offset+4,'font-size':10,fill:'#26231f'},`${bus.id}: ${bus.occupancy}`);
    });
    stats.replaceChildren();
    [`Waiting now: ${frame.waiting}`,`Run average wait: ${run.average_wait.toFixed(2)} min`,`Left waiting at end: ${run.left_waiting}`].forEach(text=>{
      const el=document.createElement('span');el.textContent=text;stats.append(el);
    });
    if (Number(slider.value) === run.timeline.length-1) pause();
  }
  play.addEventListener('click',()=>{
    if(timer){pause();return;}
    if(Number(slider.value)>=Number(slider.max))slider.value=0;
    render();play.textContent='Pause';
    timer=setInterval(()=>{slider.value=Number(slider.value)+1;render();},600);
  });
  reset.addEventListener('click',()=>{pause();slider.value=0;render();});
  slider.addEventListener('input',()=>{pause();render();});
  mode.addEventListener('change',()=>{pause();render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  fetch('../assets/transitops-replay.json').then(response=>{
    if(!response.ok)throw new Error('Replay unavailable');return response.json();
  }).then(result=>{
    data=result;slider.max=data.runs.baseline.timeline.length-1;
    [play,reset,slider].forEach(el=>el.disabled=false);
    status.textContent='Recorded scenario ready. Play or drag the timeline to inspect a minute.';render();
  }).catch(()=>{status.textContent='The recorded replay could not load. Read the results table below or reload to retry.';});
})();
