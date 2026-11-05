const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || "/usr/bin/chromium",args:["--no-sandbox"]});
 const errors=[];const failures=[];
 const page=await browser.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
 await page.goto(base,{waitUntil:'networkidle'});
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('.program details').count(),12);
 assert.equal(await page.locator('[data-checkout]:disabled').count(),2);
 for(const size of [{width:1440,height:1000},{width:390,height:844},{width:320,height:740},{width:768,height:1024}]){
  await page.setViewportSize(size);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${size.width}`);
  assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
 }
 const broken=await page.locator('a[href^="#"]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1))));assert.deepEqual(broken,[]);
 await page.locator('.program summary').first().click();assert(await page.locator('.program details').first().getAttribute('open')!==null);
 await page.locator('footer a[href="#privacidade"]').click();await page.waitForTimeout(200);assert(await page.locator('#privacidade').getAttribute('open')!==null);
 await page.goto(base + '#termos');assert(await page.locator('#termos').getAttribute('open')!==null);
 await page.goto(base + '#%E0%A4%A');
 for (const summary of await page.locator('.faq summary').all()) { await summary.click(); assert(await summary.evaluate(s=>s.parentElement.open)); }
 await page.goto(base);
 await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');
 assert.equal(await page.locator('link[rel=canonical]').count(),1);
 assert.equal(await page.locator('meta[property="og:image"]').count(),1);
 await page.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.CLAUDE_CHECKOUT={salesEnabled:true,hotmart:"https://example.com/invalido",kiwify:"javascript:alert(1)"}'}));
 await page.reload();assert.equal(await page.locator('[data-checkout]:disabled').count(),2);
 await page.unroute('**/config.js');await page.goto(base,{waitUntil:'networkidle'});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'docs/previa-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/previa-celular.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 console.log('PASS: 4 viewports sem overflow; imagens carregadas; 12 módulos; navegação e FAQ; links legais abrem; checkout sem URL e URL inválida bloqueados; zero erros JS/HTTP. Capturas geradas.');
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
