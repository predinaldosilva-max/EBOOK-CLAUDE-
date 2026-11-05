const {chromium,devices}=require('playwright');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const host='https://predinaldosilva-max.github.io/EBOOK-CLAUDE-/';
 const cases=[
  ['iPhone Safari — identificação emulada',devices['iPhone 13'],true],
  ['Android Chrome — identificação emulada',devices['Pixel 7'],true],
  ['iPad — identificação emulada',devices['iPad (gen 7)'],true],
  ['Tablet Android',{userAgent:'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',hasTouch:true},true],
  ['Windows Chrome',{userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'},false],
  ['Windows Edge com toque',{userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',hasTouch:true},false],
  ['macOS Safari',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15'},false],
  ['macOS Chrome',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'},false],
  ['Desktop com janela estreita',{viewport:{width:390,height:844}},false],
  ['Desktop com parâmetro de URL',{suffix:'?admin=true'},false],
  ['Prévia local MacBook',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',local:true},true],
  ['iPadOS em modo desktop',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',hasTouch:true,ipad:true},true]
 ];
 for(const [name,settings,allowed] of cases){
  const {suffix='',local=false,ipad=false,...options}=settings;
  const context=await browser.newContext(options);const errors=[];
  if(ipad)await context.addInitScript(()=>Object.defineProperty(navigator,'maxTouchPoints',{get:()=>5}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  // Origem pública simulada; todos os recursos vêm do build local, sem alterar o site real.
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());const name=url.pathname.replace(/^\/EBOOK-CLAUDE-\//,'')||'index.html';
   const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
   if(!['index.html','styles.css','app.js','config.js','device-access.js','assets/capa.webp','assets/favicon.svg'].includes(name))return route.abort();
   await route.fulfill({body:readFileSync(path.join(__dirname,'../dist',name)),contentType:types[path.extname(name)]});
  });
  await page.goto((local?'http://127.0.0.1/EBOOK-CLAUDE-/':host)+suffix);
  assert.equal(await page.locator('#commercial-content').isVisible(),allowed,name);
  assert.equal(await page.locator('#device-notice').isVisible(),!allowed,name);
  if(allowed){assert.equal(await page.locator('[data-checkout]:disabled').count(),0);assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth)));}
  else{assert.equal(await page.locator('#device-notice').textContent().then(s=>s.includes('Esta página está disponível exclusivamente para dispositivos móveis. Acesse pelo seu smartphone para conhecer o Claude Masterclass.')),true);}
  assert.deepEqual(errors,[],name);
  if(name==='macOS Safari')await page.screenshot({path:'docs/previa-restricao-desktop.png'});
  await context.close();console.log('PASS:',name,allowed?'permitido':'restrito');
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
