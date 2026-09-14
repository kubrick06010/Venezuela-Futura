import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const output = 'artifacts/visual-qa';
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true});

async function ready(page){
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

const desktop = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const browserErrors = [];
desktop.on('pageerror',error => browserErrors.push(error.message));
desktop.on('console',message => { if(message.type()==='error') browserErrors.push(message.text()); });
await ready(desktop);
const bodyWidths = await desktop.evaluate(() => [document.body.scrollWidth,document.body.clientWidth]);
if(bodyWidths[0] > bodyWidths[1] + 1) throw new Error(`Horizontal overflow: ${bodyWidths.join(' > ')}`);
await desktop.screenshot({path:`${output}/01-home-desktop.png`,fullPage:false});

const relationSection = desktop.locator('#relaciones');
await relationSection.scrollIntoViewIfNeeded();
await desktop.waitForTimeout(300);
const domainCards = await desktop.locator('#domain-overview .domain-card').count();
if(domainCards < 2) throw new Error('Relations index did not render');
await relationSection.screenshot({path:`${output}/02-relations-desktop.png`});

await desktop.locator('.route').first().click();
await desktop.locator('#reader-body h2').first().waitFor({state:'visible'});
await desktop.waitForTimeout(400);
const readerText = await desktop.locator('#reader-body').innerText();
if(readerText.trimStart().startsWith('---') || readerText.includes('relations:')) throw new Error('Reader exposes front matter');
await desktop.screenshot({path:`${output}/03-reader-desktop.png`,fullPage:false});
await desktop.locator('#reader-close').click();

const mobile = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
mobile.on('pageerror',error => browserErrors.push(error.message));
await ready(mobile);
const mobileWidths = await mobile.evaluate(() => [document.body.scrollWidth,document.body.clientWidth]);
if(mobileWidths[0] > mobileWidths[1] + 1) throw new Error(`Mobile horizontal overflow: ${mobileWidths.join(' > ')}`);
await mobile.screenshot({path:`${output}/04-home-mobile.png`,fullPage:false});
await mobile.locator('#relaciones').scrollIntoViewIfNeeded();
await mobile.evaluate(() => window.scrollBy(0,-100));
await mobile.waitForTimeout(300);
await mobile.screenshot({path:`${output}/05-relations-mobile.png`,fullPage:false});

if(browserErrors.length) throw new Error(`Browser errors:\n${browserErrors.join('\n')}`);
await browser.close();
console.log('Visual QA captured desktop and mobile states.');
