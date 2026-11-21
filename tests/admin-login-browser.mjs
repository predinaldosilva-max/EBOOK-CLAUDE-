import assert from 'node:assert/strict';import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
import {adminRuntime,adminOrigin,fixturePassword,fixtureTotp} from './helpers/admin-runtime.mjs';
import {totpCode} from '../server/licensing/local-admin-auth.mjs';
const {mf,db,before}=await adminRuntime(),report=[];
try {
 for(const [name,engine,viewport,ua]of [
  ['iPhone-WebKit',webkit,{width:390,height:844},'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'],
  ['Android-Chromium',chromium,{width:393,height:851},'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36'],
  ['desktop-Chromium',chromium,{width:1280,height:900},undefined]
 ]) {
 const browser=await engine.launch({headless:true});try {for(let round=0;round<3;round++) {
  // Isolated fictional DB only: allow each browser to test the current TOTP step.
  await db.prepare('DELETE FROM admin_auth_state').run();await db.prepare('DELETE FROM admin_login_limits').run();
  const context=await browser.newContext({viewport,userAgent:ua,acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.route(adminOrigin+'/**',async route=>{const req=route.request(),response=await mf.dispatchFetch(req.url(),{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.1'},body:['GET','HEAD'].includes(req.method())?undefined:req.postDataBuffer()});await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});});
  try {
   await page.goto(adminOrigin+'/');await page.waitForURL('**/login');await page.locator('#language').selectOption(['pt','es','en'][round]);
   await page.locator('#user').fill('owner');await page.locator('#password').fill('wrong');await page.locator('#code').fill('000000');await page.locator('#loginButton').click();await page.waitForFunction(()=>!document.querySelector('#loginButton').disabled&&document.querySelector('#status').textContent.length>0);assert.equal(await page.locator('#password').inputValue(),'');
   await page.locator('#password').fill(fixturePassword);await page.locator('#code').fill(await totpCode(fixtureTotp,Math.floor(Date.now()/30000)));await page.locator('#loginButton').click();await page.waitForURL(adminOrigin+'/');await page.waitForFunction(()=>document.querySelector('#refresh')&&!document.querySelector('#refresh').disabled&&document.querySelector('#stats').textContent.includes('50'));
   const cookies=await context.cookies();const cookie=cookies.find(c=>c.name==='__Host-uwk_admin');assert.ok(cookie?.secure&&cookie.httpOnly&&cookie.sameSite==='Strict');assert.equal(await page.evaluate(()=>localStorage.getItem('__Host-uwk_admin')),null);
   page.on('dialog',d=>d.accept());await page.locator('#generate button').click();await page.waitForSelector('#keyValue');await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.match(await page.locator('#keyValue').textContent(),/^UW-[A-F0-9]{32}$/);
   await page.locator('#filter').selectOption('legacy');await page.locator('#search button').click();await page.waitForSelector('#results tbody tr');assert.equal(await page.locator('#results tbody tr').count(),50);assert.equal(await page.locator('#results [data-revoke]').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow');
   if(round===1){await db.prepare('UPDATE admin_sessions SET expires_at=0').run();await page.locator('#refresh').click();await page.waitForURL('**/login');}
   else{await page.locator('#signOut').click();await page.waitForURL('**/login');}
   assert.deepEqual(errors,[]);report.push({engine:name,language:['pt','es','en'][round],round:round+1,result:'PASS'});console.log('PASS',name,'round',round+1);
  }finally{await context.close();}
 }}finally{await browser.close();}
 }
 assert.deepEqual((await db.prepare("SELECT * FROM licenses WHERE id NOT LIKE 'T-%' ORDER BY id").all()).results,before);
 mkdirSync('qa-output/admin-login-browser',{recursive:true});writeFileSync('qa-output/admin-login-browser/report.json',JSON.stringify(report,null,2));
}finally{await mf.dispose();}
