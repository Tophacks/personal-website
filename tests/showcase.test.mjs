import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';import {join,resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(join(root,'index.html'),'utf8');
test('flagship project launch links point to real demos and verified assets',()=>{
 assert.match(html,/id="flagship"/);
 assert.match(html,/https:\/\/transitops-phi\.vercel\.app\//);
 assert.match(html,/href="neurosim-mission\.html"/);
 for(const path of ['assets/project-media/transitops.jpg','assets/project-media/neurosim-diagram.svg'])assert.ok(existsSync(join(root,path)),path);
 assert.match(html,/SOURCE-BASED VISUAL \/ NOT FLIGHT FOOTAGE/);
 assert.match(html,/Simulated corridor, not live GRT data/);
});
