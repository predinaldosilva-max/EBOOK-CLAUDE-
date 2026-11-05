const {chromium,devices}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const url=process.env.SITE_URL||'http://127.0.0.1:8001/EBOOK-CLAUDE-/';
 for(const device of ['iPhone 13','Pixel 7','iPad (gen 7)']){
  const context=await browser.newContext({...devices[device],browserName:undefined});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.nav-cta').tap();await page.waitForTimeout(200);assert(page.url().endsWith('#oferta'));
  assert.equal(await page.locator('[data-checkout]:disabled').count(),2);
  await context.close();assert.deepEqual(errors,[]);console.log('PASS Chromium/touch emulado:',device);
 }
 const page=await browser.newPage();const session=await page.context().newCDPSession(page);
 await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});
 await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
 const start=Date.now();await page.goto(url,{waitUntil:'networkidle',timeout:60000});
 assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth)));
 console.log(JSON.stringify({simulatedMobileLoadMs:Date.now()-start,resources:await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.encodedBodySize,durationMs:Math.round(r.duration)})))}));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
