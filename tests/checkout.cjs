const {chromium,devices}=require('playwright');const assert=require('node:assert/strict');
const url=process.env.SITE_URL||'http://127.0.0.1:8001/EBOOK-CLAUDE-/';
const checkout='https://pay.kiwify.com.br/hFxie8I';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
for(const [name,options] of [['computador local',{}],['celular',devices['Pixel 7']]]){
 const page=await browser.newPage(options);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Interceptar apenas o destino: comprova navegação sem iniciar compra ou enviar dados.
 await page.route(checkout,r=>r.fulfill({contentType:'text/html',body:'<p>Destino oficial interceptado pelo teste</p>'}));
 await page.goto(url);const count=await page.locator('[data-checkout]').count();assert.equal(count,4);
 for(let i=0;i<count;i++){
  await page.goto(url);const target=page.locator('[data-checkout]').nth(i);assert(await target.isEnabled());
  await Promise.all([page.waitForURL(checkout),target.click()]);assert.equal(page.url(),checkout);
 }
 await page.goto(url);assert.equal(await page.locator('.price').innerText(),'R$ 97,00');
 assert.deepEqual(errors,[]);console.log('PASS',name,': quatro CTAs direcionam exatamente ao checkout oficial; preço preservado.');await page.close();
}await browser.close();})().catch(e=>{console.error(e);process.exitCode=1});
