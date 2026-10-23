"""Capture the actual publicly sourced NeuroSim Pygame viewer in manual mode, if runnable.
No trained policy is loaded or claimed; the frame sequence is a manual no-input run.
"""
import os,sys,json,subprocess
from datetime import datetime,timezone
from pathlib import Path
from tempfile import TemporaryDirectory
root=Path(__file__).resolve().parents[1]
source=root/'source-neurosim'/'viewer.py'
dest=root/'assets'/'project-media'
if not source.is_file():
 print('SKIP NeuroSim: source unavailable');sys.exit(0)
os.environ['SDL_VIDEODRIVER']='dummy'
os.environ['SDL_AUDIODRIVER']='dummy'
try:
 import pygame
 from PIL import Image
except Exception as exc:
 print('SKIP NeuroSim dependencies:',str(exc));sys.exit(0)
with TemporaryDirectory() as temporary:
 frames=Path(temporary)/'frames';frames.mkdir()
 code=source.read_text(encoding='utf8')
 marker='        pygame.display.flip()'
 if marker not in code:
  print('SKIP NeuroSim: viewer changed');sys.exit(0)
 injection=f"""
        if env.steps % 3 == 0:
            pygame.image.save(screen, {str(frames)!r} + '/frame_' + str(env.steps).zfill(4) + '.png')
        pygame.display.flip()
        if env.steps >= 54:
            running = False
"""
 code=code.replace(marker,injection)
 sys.path.insert(0,str(source.parent))
 sys.argv=[str(source),'--mode','manual','--seed','17','--record-dir',str(Path(temporary)/'demonstrations')]
 try:
  ns={'__file__':str(source),'__name__':'__main__'}
  exec(compile(code,str(source),'exec'),ns,ns)
 except Exception as exc:
  print('SKIP NeuroSim: viewer failed:',type(exc).__name__,str(exc)[:150]);sys.exit(0)
 files=sorted(frames.glob('frame_*.png'))
 if len(files)<7:
  print('SKIP NeuroSim: too few frames');sys.exit(0)
 with Image.open(files[len(files)//2]) as img:img.convert('RGB').save(dest/'neurosim.jpg',quality=83,optimize=True)
 video=dest/'neurosim.webm'
 ff=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','12','-pattern_type','glob','-i',str(frames/'frame_*.png'),'-an','-vf','scale=960:-2','-c:v','libvpx-vp9','-b:v','0','-crf','43','-deadline','realtime','-cpu-used','6',str(video)],capture_output=True)
 manifest_path=dest/'manifest.json'
 manifest=json.loads(manifest_path.read_text())
 item={'kind':'simulator-render','image':'assets/project-media/neurosim.jpg','description':'Captured from the actual Pygame source viewer in untrained manual mode with no controls pressed. Not evidence of autonomous landing success.','source':'https://github.com/Tophacks/NeuroSim-2.0','recorded_at':datetime.now(timezone.utc).isoformat()}
 if ff.returncode==0 and video.exists() and video.stat().st_size<12000000:item['video']='assets/project-media/neurosim.webm'
 else:video.unlink(missing_ok=True)
 manifest['projects']['neurosim']=item
 manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
 print('CAPTURED NeuroSim actual viewer',len(files),'frames')
