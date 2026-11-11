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
 assert.equal(await page.locator('.launch-card').count(), 6);
 const quadmates = page.getByRole('article').filter({ hasText: 'Quadmates' });
 assert.equal(await quadmates.getByRole('link', { name: 'Open Quadmates' }).getAttribute('href'), 'https://quadmates.ca');
 await quadmates.getByRole('link', { name: 'How I built it' }).click();
 assert.equal(await page.getByRole('link', { name: 'Open Quadmates' }).getAttribute('href'), 'https://quadmates.ca');
 assert.equal(await page.locator('iframe, .secondary-demo').count(), 0);

 // Exercise the linked mission control in the browser.
 const neurosim = await browser.newPage({viewport:{width:1220,height:900}});
 neurosim.on('pageerror',e=>errors.push(e.message));
 await neurosim.goto(pathToFileURL(resolve('neurosim-mission.html')).href);
 const initialAltitude=await neurosim.locator('#altitude').innerText();
 await neurosim.locator('#step').click();
 assert.notEqual(await neurosim.locator('#altitude').innerText(),initialAltitude);
 await neurosim.locator('#planet').selectOption('mars');
 await neurosim.locator('#vehicle').selectOption('custom');
 assert.deepEqual(errors, []);
 console.log('PASS: project launcher, Quadmates links, and NeuroSim controls.');
} finally {
 await browser.close();
}
