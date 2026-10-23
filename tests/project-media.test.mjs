import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import { join,resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(join(root,'assets/project-media/manifest.json'),'utf8'));
const projects=['quadmates','transitops','staffflow','neurosim','transitops-m','vision'];
test('every project has source-grounded or recorded visual evidence',()=>{
 assert.equal(manifest.version,1);
 for(const id of projects){
  const m=manifest.projects[id];
  assert.ok(m,id+' missing');
  assert.ok(['source-diagram','public-screen','simulator-render'].includes(m.kind));
  assert.ok(m.image?.startsWith('assets/'));
  assert.ok(existsSync(join(root,m.image)),m.image+' missing');
  assert.ok(m.description?.length>12);
  assert.ok(/^https:\/\//.test(m.source));
  if(m.video){
   assert.notEqual(m.kind,'source-diagram');
   assert.ok(existsSync(join(root,m.video)),m.video+' missing');
  }
 }
});
test('site has project-specific gallery slots',()=>{
 const html=readFileSync(join(root,'index.html'),'utf8');
 for(const id of projects)assert.ok(html.includes('data-media-project="'+id+'"'),id);
 assert.ok(html.includes('media.js'));
});
