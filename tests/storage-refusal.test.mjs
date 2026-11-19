import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {IDBFactory,IDBObjectStore} from 'fake-indexeddb';
const root=new URL('../usa-work-kit/',import.meta.url),pause=()=>new Promise(r=>setTimeout(r,10));
async function wait(fn){for(let i=0;i<150;i++){if(fn())return;await pause();}throw Error('UI timed out');}
async function setup(label){const errors=[],downloads=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(readFileSync(new URL('index.html',root),'utf8'),{url:'https://test.example/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;Object.defineProperty(w.navigator,'userAgent',{value:label==='iPhone'?'Mozilla/5.0 (iPhone) Mobile Safari':'Mozilla/5.0 (Linux; Android 14) Mobile Chrome'});Object.defineProperty(w,'crypto',{value:webcrypto});Object.defineProperty(w,'indexedDB',{value:new IDBFactory()});Object.assign(w,{TextEncoder,TextDecoder,Blob,File,structuredClone,AbortController,confirm:()=>true,scrollTo:()=>{}});w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};w.localStorage.setItem('usa-work-kit-installation-v1','a'.repeat(43));w.localStorage.setItem('usa-work-kit-server-access-v1',JSON.stringify({license:'002',generation:0}));w.fetch=async(url)=>{assert.equal(url,'/api/validate');return {ok:true,json:async()=>({ok:true})};};for(const f of ['translations','calculators','storage','reports','protection-i18n','vault','protection-reports','protection-ui','app'])w.eval(readFileSync(new URL('js/'+f+'.js',root),'utf8'));await wait(()=>w.document.querySelector('.protection-hero'));w.document.querySelector('#permissionLater')?.click();return {w,dom,errors,downloads};}

async function opened(label='iPhone'){
 const x=await setup(label),q=s=>x.w.document.querySelector(s);
 q('.protection-hero button').click();await wait(()=>q('#createVault'));q('#createVault').click();await wait(()=>q('.recovery-key'));
 x.key=q('.recovery-key').textContent;q('#confirmKey').click();x.q=q;return x;
}
function attach(x,files){Object.defineProperty(x.q('#incidentFiles'),'files',{value:files,configurable:true});x.q('#incidentFiles').dispatchEvent(new x.w.Event('change',{bubbles:true}));}
function png(){return new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf1cAAAAASUVORK5CYII=','base64')],'FICTITIOUS-delivery.png',{type:'image/png'});}

for(const label of ['iPhone','Android'])test(label+' simulated storage refusal: no partial save, previous evidence intact, inline warning and successful retry',async()=>{
 const x=await opened(label),q=x.q,originalPut=IDBObjectStore.prototype.put;let refused=0;
 try{
 q('#addIncident').click();q('#incidentDescription').value='FICTITIOUS preserved before failure';attach(x,[png()]);q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>q('[data-file]'));
 const reader=new x.w.ProtectionVault.Vault('002');await reader.unlock(x.key);const before=reader.snapshot();
 q('#addIncident').click();q('#incidentDescription').value='FICTITIOUS write refused';attach(x,[png()]);const oldSuccess=q('#incidentResult').textContent;
 IDBObjectStore.prototype.put=function(...args){const request=originalPut.apply(this,args);if(this.name==='vaults'){refused++;this.transaction.abort();}return request;};
 q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>q('#incidentFeedback').textContent===x.w.I18N.pt.storageError);
 assert.ok(refused>=1);assert.equal(q('#incidentDescription').value,'FICTITIOUS write refused');assert.equal(x.w.document.querySelectorAll('[data-remove-pending]').length,1);assert.equal(q('#incidentForm button[type=submit]').disabled,false);assert.equal(q('#incidentResult').textContent,oldSuccess,'no new success indication on refused write');
 const afterFailure=new x.w.ProtectionVault.Vault('002');await afterFailure.unlock(x.key);assert.deepEqual(afterFailure.snapshot(),before,'database retains exact previous evidence and revision state');
 IDBObjectStore.prototype.put=originalPut;
 q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.w.document.querySelectorAll('.incident-card').length===2);assert.equal(q('#incidentResult').textContent,x.w.I18N.pt.incidentSaved);
 const afterRetry=new x.w.ProtectionVault.Vault('002');await afterRetry.unlock(x.key);const d=afterRetry.snapshot();assert.equal(d.records.length,2);assert.equal(Object.keys(d.files).length,2);assert.deepEqual(d.records[0],before.records[0]);for(const [id,file]of Object.entries(before.files))assert.deepEqual(d.files[id],file);assert.equal(d.records[1].revisions[0].data.description,'FICTITIOUS write refused');assert.deepEqual(x.errors,[]);
 }finally{IDBObjectStore.prototype.put=originalPut;x.w.Protection.leave();x.dom.window.close();}
});
