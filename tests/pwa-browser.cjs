'use strict';
const {chromium,webkit}=require('playwright'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),{execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve('usa-work-kit'),out=path.resolve('qa-output/pwa-browser'),previous='c48a66570fddef060a505a6e0217eb57d4aa4937',files=new Map();let old=true,networkDown=false;
(async()=>{
 await fs.mkdir(out,{recursive:true});
 const server=http.createServer(async(req,res)=>{if(networkDown){req.socket.destroy();return;}try{
  const url=new URL(req.url,'http://local');
  if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(url.pathname==='/api/activate'?'{"ok":true,"license":"002","generation":0,"token":null}':'{"ok":true}');return;}
  // Cloudflare's default HTML handling redirects this legacy PWA start URL.
  if(url.pathname==='/index.html'){res.writeHead(307,{Location:'/'+url.search,'Cache-Control':'no-store'});res.end();return;}
  const relative=url.pathname.slice(1)||'index.html';if(relative.includes('..'))throw Error('path');
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'})[path.extname(relative)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');
  if(old){if(!files.has(relative))files.set(relative,execFileSync('git',['show',previous+':usa-work-kit/'+relative]));res.end(files.get(relative));}else res.end(await fs.readFile(path.join(root,relative)));
 }catch{res.statusCode=404;res.end('Not found');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 try{for(const[label,engine]of [['webkit',webkit],['chromium',chromium]])for(let round=1;round<=3;round++){
  old=true;const browser=await engine.launch({headless:true});
  try{
   const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});let page=await context.newPage();
   await page.goto(origin+'/');await page.locator('#accessPassword').fill('UW-0123456789ABCDEF');await page.locator('#accessForm button').click();await page.locator('.protection-hero').waitFor();await page.locator('#permissionLater').click();await page.locator('.protection-hero button').click();await page.locator('#createVault').click();const key=await page.locator('.recovery-key').innerText();await page.locator('#confirmKey').click();
   await page.locator('#addIncident').click();await page.locator('#incidentDescription').fill('FICTITIOUS PWA reopen evidence');await page.locator('#incidentForm button[type=submit]').click();await page.locator('[data-edit]').waitFor({state:'attached'});
   await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   const legacy=await page.evaluate(async()=>{const r=await caches.match('./index.html');return {redirected:r.redirected,status:r.status};});assert.equal(legacy.redirected,true);assert.equal(legacy.status,200);
   await page.close();page=await context.newPage();let legacyError='';try{await page.goto(origin+'/index.html',{timeout:15000});}catch(e){legacyError=e.message.split('\n')[0];}
   console.log('BASELINE '+label+' '+round+': redirected cached start URL; '+(legacyError||'engine accepted legacy navigation'));
   // Close the failed document: Chromium may still be committing its internal
   // error page when goto rejects. Keep the same storage context for recovery.
   await page.close();page=await context.newPage();
   // Same origin, query misses the old cached redirect; does not clear storage.
   await page.goto(origin+'/?pwa-recovery=2.3.0-rc1');await page.locator('.protection-hero').waitFor();
   // Finish any update initiated by the recovery document while the old server
   // is still in place, then observe the actual controller change explicitly.
   await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();await navigator.serviceWorker.ready;window.__beforeUpdateController=navigator.serviceWorker.controller;});
   old=false;
   await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
   await page.waitForFunction(()=>navigator.serviceWorker.controller&&navigator.serviceWorker.controller!==window.__beforeUpdateController);
   await page.waitForFunction(async()=>{const names=await caches.keys();const registration=await navigator.serviceWorker.getRegistration();return names.includes('usa-work-kit-v2.3.0-rc1')&&!names.includes('usa-work-kit-v2.2.4-r1')&&registration?.active?.state==='activated'&&navigator.serviceWorker.controller===registration.active;});
   await page.close();page=await context.newPage();await page.goto(origin+'/');await page.locator('.protection-hero').waitFor();const versions={app:await page.locator('.sidefoot').textContent(),footer:await page.locator('.bottom').textContent()};console.log('VERSION '+label+' '+JSON.stringify(versions));assert.match(versions.app,/v2\.3\.0-rc1/);assert.match(versions.footer,/v2\.3\.0-rc1/);
   const fixed=await page.evaluate(async()=>{const r=await caches.match('./index.html');return {redirected:r.redirected,status:r.status};});assert.equal(fixed.redirected,false);assert.equal(fixed.status,200);
   for(const url of ['/index.html','/','/?reopen=1']){
    await page.close();page=await context.newPage();const r=await page.goto(origin+url);assert.equal(r.status(),200);await page.locator('.protection-hero button').click();await page.locator('#vaultKey').fill(key);await page.locator('#unlockVault').click();await page.locator('#lockVault').waitFor();assert.ok((await page.locator('#incidentList').innerText()).includes('FICTITIOUS PWA reopen evidence'));
   }
   networkDown=true;try{await page.goto(origin+'/index.html');assert.ok(await page.locator('#app').count());}finally{networkDown=false;}
   await page.reload();await page.locator('.protection-hero button').click();await page.locator('#vaultKey').fill(key);await page.locator('#unlockVault').click();await page.locator('#lockVault').waitFor();
   await page.screenshot({path:path.join(out,label+'-'+round+'.png'),fullPage:true});
   // A separate browser storage context starts without this vault. Keys and
   // records must not silently synchronize or be confused with another vault.
   const isolated=await browser.newContext({viewport:{width:390,height:844}}),other=await isolated.newPage();await other.goto(origin+'/');await other.locator('#accessPassword').fill('UW-0123456789ABCDEF');await other.locator('#accessForm button').click();await other.locator('#permissionLater').click();await other.locator('.protection-hero button').click();await other.locator('#createVault').waitFor();assert.equal(await other.locator('#unlockVault').count(),0);await isolated.close();
   await context.close();console.log('PASS PWA '+label+' round '+round+': legacy redirect, safe recovery URL, update, three reopens, original key and evidence, HTML with server unavailable, isolated storage');
  }finally{await browser.close();}
 }}finally{server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
