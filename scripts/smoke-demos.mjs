import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(pathToFileURL(resolve('demos.html')).href);
 const activate = async name => page.locator('[data-demo-tab="'+name+'"]').click();
 const read = async id => page.locator('#'+id).innerText();

 assert.equal(await page.locator('[data-demo-tab]').count(), 6);
 assert.ok((await read('transit-waiting')).includes('40'));
 await page.locator('#transit-run').click();
 assert.notEqual(await read('transit-boarded'), '0');
 await page.locator('#transit-compare').click();
 assert.match(await read('transit-message'), /baseline/i);

 await activate('neurosim');
 const initial = await read('rocket-z');
 await page.locator('#rocket-step').click();
 assert.notEqual(await read('rocket-z'), initial);
 await page.locator('#rocket-reset').click();

 await activate('transitops-m');
 await page.locator('#depot-reserve').click();
 assert.match(await read('depot-bay'), /RESERVED/);
 await page.locator('#depot-dock').click();
 assert.match(await read('depot-bay'), /OCCUPIED/);
 await page.locator('#depot-dispatch').click();
 assert.equal(await read('depot-state'), 'IN_SERVICE');
 await page.locator('#depot-stop').click();
 assert.equal(await read('depot-state'), 'FAULT');

 await activate('quadmates');
 const student = page.locator('.student-card button').first();
 await student.click();
 assert.match(await read('quad-message'), /request sent/i);
 await page.locator('#quad-accept').click();
 assert.match(await read('quad-message'), /accepted/i);

 await activate('staffflow');
 await page.locator('#staff-advance').click();
 assert.match(await read('staff-message'), /moved to/i);
 await page.locator('#staff-answer').selectOption({ label: '[4, 6]' });
 await page.locator('#staff-grade').click();
 assert.match(await read('staff-message'), /correct/i);

 await activate('vision');
 await page.locator('#vision-run').click();
 assert.match(await read('vision-message'), /15 ticks/i);

 // The exact same interactive panel must also work in a sandbox-style embed.
 const embedded = await browser.newPage({ viewport: { width: 870, height: 900 } });
 embedded.on('pageerror', e => errors.push(e.message));
 await embedded.goto(pathToFileURL(resolve('demos.html')).href+'?project=transitops-m&embed=1');
 assert.equal(await embedded.locator('body').evaluate(el => el.classList.contains('embedded')), true);
 assert.equal(await embedded.locator('[data-demo-panel="transitops-m"]').isVisible(), true);
 assert.equal(await embedded.locator('[data-demo-panel="transitops"]').isVisible(), false);

 assert.deepEqual(errors, []);
 console.log('PASS: six interactive panels, workflow actions, and embedded mode.');
} finally {
 await browser.close();
}
