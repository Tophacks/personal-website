(() => {
  const video = document.getElementById('kinora-trailer');
  const pending = document.getElementById('trailer-pending');
  if (!video || !pending) return;
  const show = () => { video.hidden = false; pending.hidden = true; };
  const fallback = () => { video.hidden = true; pending.hidden = false; };
  video.addEventListener('loadedmetadata', show);
  video.addEventListener('error', fallback);
  video.src = '../assets/project-media/kinora_15s_vertical_hook_captioned.mp4';
})();
