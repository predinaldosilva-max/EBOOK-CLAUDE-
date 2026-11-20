const {JSDOM,VirtualConsole}=require('jsdom');
const {Miniflare,convertV4MiniflareOptions}=require('miniflare');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{webcrypto,createHash}=require('node:crypto');
const root=path.resolve('usa-work-kit'),results=[],failures=[];
const check=(n,a,e)=>{try{assert.deepEqual(a,e,n);results.push(n);console.log('PASS',n);}catch(error){failures.push({name:n,actual:a,expected:e});console.log('FAIL',n,JSON.stringify(a),JSON.stringify(e));}};
const pause=()=>new Promise(r=>setImmediate(r));
async function main(){
 fs.mkdirSync('qa-output',{recursive:true});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,scriptPath:path.resolve('server/worker.mjs'),compatibilityDate:'2026-11-17',d1Databases:['DB'],bindings:{RATE_SECRET:'qa-rate-secret-not-production',ADMIN_TOKEN:'qa-admin-secret-not-production-123456'}}));
 try{
 const db=await mf.getD1Database('DB');await db.exec(fs.readFileSync('schema.sql','utf8').replace(/\n/g,' '));await db.prepare('INSERT INTO licenses(id,password_hash,is_test) VALUES(?,?,0)').bind('002',createHash('sha256').update('UW-0123456789ABCDEF').digest('hex')).run();
 for(const label of ['Android-DOM','iPhone-DOM']){
 await db.prepare("UPDATE licenses SET installation_hash=NULL,generation=generation+1 WHERE id='002'").run();
 const base='https://qa.example',errors=[],downloads=[],blobmap=new Map(),api=[];let printed=0,clipboard='';const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:base,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;
 Object.defineProperty(w.navigator,'userAgent',{value:label.startsWith('Android')?'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/130.0':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Mobile Safari/604.1'});
 Object.defineProperty(w,'crypto',{value:webcrypto});Object.defineProperty(w,'isSecureContext',{value:true});Object.assign(w,{TextEncoder,TextDecoder,AbortController,Blob,scrollTo:()=>{},confirm:()=>true,print:()=>printed++,setInterval:()=>0,setTimeout:()=>0,clearTimeout:()=>{}});
 w.URL.createObjectURL=blob=>{const id='blob:'+blobmap.size;blobmap.set(id,blob);return id;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobmap.get(this.href)});};
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async value=>{clipboard=value;}}});
 w.fetch=async(url,opt)=>{const response=await mf.dispatchFetch(new URL(url,base).href,{...opt,headers:{...opt.headers,Origin:base,'CF-Connecting-IP':label}});api.push({path:url,status:response.status});return response;};
 for(const file of ['translations','calculators','storage','reports','protection-i18n','protection-daily-i18n','protection-preventive','vault','protection-reports','protection-daily-ui','protection-ui','app'])w.eval(fs.readFileSync(root+'/js/'+file+'.js','utf8'));
 const $=s=>w.document.querySelector(s),click=s=>{const el=$(s);assert.ok(el,'Missing '+s);el.click();},fill=values=>{for(const[k,v]of Object.entries(values)){const e=$('#'+k);assert.ok(e,'Missing field '+k);e.value=String(v);e.dispatchEvent(new w.Event('input',{bubbles:true}));e.dispatchEvent(new w.Event('change',{bubbles:true}));}},nav=name=>{if(!$('[data-page="'+name+'"]'))click('[data-page="more"]');click('[data-page="'+name+'"]');},state=()=>JSON.parse(w.localStorage.getItem('usa-work-kit-finance-v2:002')),test=(n,a,e)=>check(label+': '+n,a,e),txt=s=>$(s)?.textContent.replace(/\u00a0/g,' ')||'',has=(s,value)=>test(s+' contains '+value,txt(s).includes(value),true);
 const login=async password=>{fill({accessPassword:password});$('#accessForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));for(let i=0;i<200&&!$('.shell')&&$('#accessForm button')?.disabled;i++)await new Promise(r=>setTimeout(r,5));};
 await login('001');has('#accessError','Senha inválida');await login('UW-0123456789ABCDEF');console.log('LOGIN_DIAGNOSTIC',txt('#accessError'),JSON.stringify(api));test('real worker/D1 login',!!$('.shell'),true);$('#permissionLater')?.click();
 nav('delivery');fill({offer:20,tip:5,miles:10,cost:.5,minutes:25,wait:5,minimum:30,date:'2026-11-17'});has('#result .big','20,00');has('#result','40,00');has('#result','2,50');click('[data-action="saveDelivery"]');test('save delivery gross',state().incomes[0].amount,25);test('save delivery cost',state().incomes[0].cost,5);
 click('[data-action="compare"]');fill({offer:40,tip:10,miles:20,cost:.5,minutes:50,wait:10});has('#comparison','20,00');has('#comparison','40,00');click('[data-action="clearCompare"]');test('clear comparison',txt('#comparison'),'');fill({platform:'DoorDash'});click('[data-action="saveDelivery"]');test('second delivery saved',state().incomes.length,2);
 for(const platform of ['Instacart','DoorDash','Uber Eats','Grubhub','Amazon Flex','Uber','Lyft','other']){fill({platform});has('#result .big','40,00');}
 fill({offer:1,tip:0,miles:10,cost:2,minutes:25,wait:5});test('negative net displayed',txt('#result .big').includes('19,00')&&txt('#result .big').includes('-'),true);fill({miles:0});has('#result','Não calculável');fill({minutes:0});click('[data-action="saveDelivery"]');test('zero time cannot save',state().incomes.length,2);fill({minutes:25,offer:40,tip:10,miles:20});nav('home');nav('delivery');test('delivery draft persists',$('#offer').value,'40');
 nav('work');fill({source:'Serviço QA',mode:'hour',rate:20,hours:40,days:5,quantity:3,expense:100,weekDays:5,date:'2026-11-17'});has('#result .big','700,00');has('#result','3.033,33');click('[data-action="saveWork"]');test('work saved',state().incomes.length,3);
 for(const[mode,rate,expected]of [['day',100,'400,00'],['service',50,'50,00'],['week',1000,'900,00'],['project',2000,'1.900,00']]){fill({mode,rate});has('#result .big',expected);}
 nav('goals');fill({target:1200,received:750,days:3,hours:20,hourly:25});for(const value of ['450,00','150,00','62,5%','1.250,00'])has('#result',value);fill({days:0,hourly:0});has('#result','Não calculável');fill({received:1300});has('#result .big','0,00');test('progress accessibility capped',$('[role="progressbar"]').getAttribute('aria-valuenow'),'100');
 nav('expenses');fill({name:'Combustível QA',amount:30,date:'2026-11-17',category:0,scope:'business'});click('[data-action="saveExpense"]');test('expense saved',state().expenses[0].amount,30);click('[data-expense="edit"]');fill({amount:35});click('[data-action="saveExpense"]');test('expense edited',state().expenses[0].amount,35);click('[data-expense="paid"]');test('paid toggled',state().expenses[0].paid,true);click('[data-expense="edit"]');fill({amount:99});click('[data-action="cancelEdit"]');test('cancel edit',state().expenses[0].amount,35);
 fill({name:'Excluir QA',amount:5,date:'2026-11-17'});click('[data-action="saveExpense"]');w.document.querySelectorAll('[data-expense="delete"]')[1].click();test('delete expense',state().expenses.length,1);
 // Draft and edit survive changing interface language without changing saved records.
 click('[data-expense="edit"]');fill({amount:37});fill({language:'es'});test('unsaved edit preserved across language',$('#amount').value,'37');fill({language:'pt'});click('[data-action="cancelEdit"]');test('cancel bilingual edit preserves amount',state().expenses[0].amount,35);
 nav('pricing');fill({provider:'QA Nome',service:'Serviço QA',description:'Serviço de teste',conditions:'Condições QA',date:'2026-11-17',hours:2,rate:50,material:40,transport:10,other:10,margin:20});has('#result .big','200,00');has('#result','40,00');click('[data-action="quote"]');has('#printArea','200,00');test('quote invokes print',printed,1);fill({margin:100});has('#formError','menor que 100');fill({margin:20});
 nav('messages');fill({name:'Maria',amount:125.5,service:'limpeza',date:'amanhã às 10h'});
 for(const lang of ['en','pt','es'])for(let i=0;i<10;i++){fill({lang,template:i});const msg=txt('#messageText');test('message '+lang+'/'+i+' substitutions',!/{(?:name|amount|service|date)}/.test(msg),true);test('message '+lang+'/'+i+' text',msg.length>30,true);}
 click('[data-action="copy"]');await pause();test('copy clipboard exact',clipboard,txt('#messageText'));
 nav('reports');fill({from:'2026-11-01',to:'2026-11-30'});for(const value of ['875,00','35,00','725,00'])has('#reportSummary',value);click('[data-action="report"]');has('#printArea','725,00');test('report invokes print',printed,2);
 click('[data-action="csv"]');const csv=await downloads.at(-1).blob.text();test('CSV records',csv.includes('Serviço QA'),true);test('CSV totals',csv.includes('725'),true);
 click('[data-action="backup"]');const backupText=await downloads.at(-1).blob.text(),backup=JSON.parse(backupText);test('backup incomes',backup.incomes.length,3);test('backup expenses',backup.expenses.length,1);test('backup excludes authorization',!/installation|password|token|generation/.test(backupText),true);
 async function importFile(text,name='qa.json'){const input=$('#importFile');Object.defineProperty(input,'files',{value:[{name,size:Buffer.byteLength(text),text:async()=>text}],configurable:true});input.dispatchEvent(new w.Event('change',{bubbles:true}));await pause();await pause();}
 await importFile('{broken');test('invalid backup preserves data',state().incomes.length,3);nav('delivery');click('[data-delete-income]');test('delete income',state().incomes.length,2);nav('reports');await importFile(backupText);test('restore deleted income',state().incomes.length,3);
 fill({language:'es'});test('Spanish html language',w.document.documentElement.lang,'es');test('Spanish persisted',state().lang,'es');has('.hero h1','Informes');fill({language:'pt'});
 nav('reports');fill({from:'2026-12-01',to:'2026-12-31'});has('#reportSummary','0,00');fill({from:'2026-12-31',to:'2026-12-01'});test('reversed date range warning',txt('#reportSummary').length>5&&!txt('#reportSummary').includes('725,00'),true);
 // Reload with the exact same storage, application scripts and real server validation.
 const saved=w.localStorage.getItem('usa-work-kit-finance-v2:002');test('saved records before reload',JSON.parse(saved).incomes.length,3);
 nav('delivery');const before=state().incomes.length;fill({offer:'',tip:0,minutes:20,wait:0,miles:5,cost:.2,minimum:20});click('[data-action="saveDelivery"]');test('empty amount not saved',state().incomes.length,before);
 nav('expenses');fill({name:'',amount:10,date:'2026-11-17'});click('[data-action="saveExpense"]');test('empty expense name not saved',state().expenses.length,1);
 nav('pricing');fill({hours:2,rate:50,material:40,transport:10,other:10,margin:20,provider:'<script>window.XSS=1</script>',service:'<img src=x onerror="window.XSS=1">',description:'<b>QA</b>',conditions:'ok',date:'2026-11-17'});click('[data-action="quote"]');test('quote escapes untrusted HTML',!$('#printArea').querySelector('script,img'),true);test('quote does not execute XSS',w.XSS,undefined);
 for(const name of ['home','delivery','work','goals','expenses','pricing','messages','reports']){nav(name);test('navigation '+name,!!$('#content')&&txt('h1').length>0,true);}
 test('uncaught DOM errors',errors,[]);test('authorization requests successful',api.filter(x=>x.status===200).length>=1,true);
 // Fresh DOM instance simulates a new load, preserving only the saved localStorage.
 const reloadErrors=[],reloadConsole=new VirtualConsole();reloadConsole.on('jsdomError',e=>reloadErrors.push(e.message));
 const reloaded=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:base,runScripts:'outside-only',virtualConsole:reloadConsole});const r=reloaded.window;
 Object.defineProperty(r.navigator,'userAgent',{value:w.navigator.userAgent});Object.defineProperty(r,'crypto',{value:webcrypto});Object.assign(r,{TextEncoder,TextDecoder,AbortController,Blob,scrollTo:()=>{},confirm:()=>true,setInterval:()=>0,setTimeout:()=>0,clearTimeout:()=>{},fetch:w.fetch});
 for(let i=0;i<w.localStorage.length;i++){const key=w.localStorage.key(i);r.localStorage.setItem(key,w.localStorage.getItem(key));}
 for(const file of ['translations','calculators','storage','reports','protection-i18n','protection-daily-i18n','protection-preventive','vault','protection-reports','protection-daily-ui','protection-ui','app'])r.eval(fs.readFileSync(root+'/js/'+file+'.js','utf8'));
 for(let i=0;i<100&&!r.document.querySelector('.shell');i++)await new Promise(resolve=>setTimeout(resolve,5));
 test('fresh load validates remembered server grant',!!r.document.querySelector('.shell'),true);
 test('fresh load restores income records',JSON.parse(r.localStorage.getItem('usa-work-kit-finance-v2:002')).incomes.length,3);
 test('fresh load restores expense records',JSON.parse(r.localStorage.getItem('usa-work-kit-finance-v2:002')).expenses[0].amount,35);
 test('fresh load has no JavaScript errors',reloadErrors,[]);reloaded.window.close();
 // Local access state must survive blocking, while business records remain untouched.
 click('#lockAccess');test('lock removes grant',w.localStorage.getItem('usa-work-kit-server-access-v1'),null);test('lock preserves installation',w.localStorage.getItem('usa-work-kit-installation-v1').length,43);test('lock preserves records',state().incomes.length,3);
 dom.window.close();
 }
 }finally{await mf.dispose();fs.writeFileSync('qa-output/finance-integration-results.json',JSON.stringify({passed:results.length,failed:failures.length,results,failures},null,2));}
 if(failures.length)process.exitCode=1;
}
main().catch(e=>{console.error(e);fs.writeFileSync('qa-output/finance-integration-results.json',JSON.stringify({passed:results.length,failed:failures.length,results,failures,exception:e.stack},null,2));process.exitCode=1;});
