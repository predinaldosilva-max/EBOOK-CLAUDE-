import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
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
test('pending originals are not silently discarded by New incident or Edit',async()=>{
 const x=await opened();try{x.q('#addIncident').click();x.q('#incidentDescription').value='Saved first record';x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-edit]'));
 for(const selector of ['#addIncident','[data-edit]','#backupVault','#lockVault','[data-delete]']){x.q('#addIncident').click();x.q('#incidentDescription').value='Pending description';attach(x,[png()]);let prompts=0;x.w.confirm=()=>{prompts++;return false;};x.q(selector).click();assert.equal(prompts,1,'must ask before dropping original attachment');assert.ok(x.w.Protection.hasPending());assert.equal(x.q('#incidentDescription').value,'Pending description');x.w.confirm=()=>true;x.q('#discardDraft').click();await wait(()=>!x.w.Protection.hasPending());}
 }finally{x.w.Protection.leave();x.dom.window.close();}
});
test('UI: explicit GPS permission, file original download, backup restoration and denied microphone fallback',async()=>{
 const x=await opened('Android');try{x.q('#addIncident').click();x.q('#platform').value='DoorDash';x.q('#incidentType').value='delivery';x.q('#incidentDescription').value='FICTITIOUS: customer disputed delivery; user reports only known facts';let gpsCalls=0;
 Object.defineProperty(x.w.navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){gpsCalls++;ok({coords:{latitude:25.7617,longitude:-80.1918,accuracy:80},timestamp:Date.now()});}}});assert.equal(gpsCalls,0);x.q('#addGPS').click();await wait(()=>gpsCalls===1&&x.q('#gpsStatus').textContent);x.q('#voice').click();await wait(()=>x.q('#vaultStatus').className==='warning');assert.ok(x.q('#vaultStatus').textContent.includes(x.w.I18N.pt.mediaError));
 const f=png();attach(x,[f]);x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-file]'));assert.ok(x.q('.revision').textContent.includes('25.7617'));x.q('[data-file]').click();await wait(()=>x.downloads.length===1);assert.deepEqual(Buffer.from(await x.downloads[0].arrayBuffer()),Buffer.from(await f.arrayBuffer()));
 x.q('#backupVault').click();await wait(()=>x.downloads.length===2);const backup=await x.downloads[1].text();assert.ok(!backup.includes('customer disputed'));x.q('#removeVault').click();await wait(()=>x.q('#createVault'));assert.equal(x.q('.incident-card'),null);
 Object.defineProperty(x.q('#vaultFile'),'files',{value:[new File([backup],'backup.uwkv')],configurable:true});x.q('#restoreKey').value=x.key;x.q('#restoreVault').click();await wait(()=>x.q('[data-file]'));assert.ok(x.q('.incident-card').textContent.includes('customer disputed'));x.w.dispatchEvent(new x.w.Event('pagehide'));assert.equal(x.q('.incident-card'),null);assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});

test('UI: recorded audio survives later attachment selection; active appeal editing renews idle timer',async()=>{
 const x=await opened();try{
 let idle,clock=Date.now();x.w.Date.now=()=>clock;x.w.setInterval=fn=>{idle=fn;return 9999;};
 const track={stopped:false,stop(){this.stopped=true;}};Object.defineProperty(x.w.navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[track]})},configurable:true});
 x.w.MediaRecorder=class {static isTypeSupported(t){return t==='audio/webm';}constructor(stream,options){this.state='inactive';this.mimeType=options.mimeType;}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new Blob([new Uint8Array([26,69,223,163,0,1,2])],{type:this.mimeType})});this.onstop();}};
 x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS voice and photo';x.q('#voice').click();await wait(()=>x.q('#voice').textContent===x.w.I18N.pt.stopVoice);x.q('#voice').click();await wait(()=>x.q('#pendingFiles').textContent.includes('voice-'));assert.equal(track.stopped,true);attach(x,[png()]);assert.ok(x.q('#pendingFiles').textContent.includes('voice-'),'photo selection must retain pending voice original');x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.w.document.querySelectorAll('[data-file]').length===2);
 x.q('[data-record]').checked=true;x.q('#appealReason').value='FICTITIOUS disputed delivery';x.q('#generateAppeal').click();await wait(()=>x.q('#appealText'));clock+=9*60*1000;x.q('#appealText').dispatchEvent(new x.w.Event('input',{bubbles:true}));clock+=2*60*1000;idle();assert.ok(x.q('#appealText'),'active typing must postpone idle lock');clock+=11*60*1000;idle();await wait(()=>x.q('#unlockVault'));assert.equal(x.q('.incident-card'),null);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});

test('asynchronous recorder stop: Save cannot outrun final audio delivery or discard the recording',async()=>{
 const x=await opened();try{
 const tracks=[{stopped:false,stop(){this.stopped=true;}}];let finish;
 Object.defineProperty(x.w.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>tracks})}});
 x.w.MediaRecorder=class {static isTypeSupported(){return true;}constructor(s,o){this.state='inactive';this.mimeType=o.mimeType;}start(){this.state='recording';}stop(){this.state='inactive';finish=()=>{this.ondataavailable({data:new Blob([new Uint8Array([26,69,223,163,0,1])],{type:this.mimeType})});this.onstop();};}};
 x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS async audio';x.q('#voice').click();await wait(()=>x.q('#voice').textContent===x.w.I18N.pt.stopVoice);x.q('#voice').click();await wait(()=>finish);x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await pause();await pause();assert.ok(x.q('#incidentForm'),'form must remain open until final audio bytes arrive');assert.equal(x.q('[data-edit]'),null);assert.ok(x.w.Protection.hasPending());finish();await wait(()=>x.q('#pendingFiles').textContent.includes('voice-'));assert.equal(tracks[0].stopped,true);x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-file]'));assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});
test('late microphone permission resolution cannot stop a newer capture or leave tracks running',async()=>{
 const x=await opened();try{
 let resolveOld,calls=0;const oldTrack={stopped:false,stop(){this.stopped=true;}},newTrack={stopped:false,stop(){this.stopped=true;}};
 Object.defineProperty(x.w.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:()=>++calls===1?new Promise(resolve=>{resolveOld=resolve;}):Promise.resolve({getTracks:()=>[newTrack]})}});
 x.w.MediaRecorder=class {static isTypeSupported(){return true;}constructor(s,o){this.state='inactive';this.mimeType=o.mimeType;}start(){this.state='recording';}stop(){this.state='inactive';this.onstop?.();}};
 x.q('#addIncident').click();x.q('#voice').click();await wait(()=>resolveOld);assert.ok(x.w.Protection.hasPending(),'pending permission is pending work');x.q('[data-page="home"]').click();await wait(()=>x.q('.protection-hero'));x.q('.protection-hero button').click();await wait(()=>x.q('#unlockVault'));x.q('#vaultKey').value=x.key;x.q('#unlockVault').click();await wait(()=>x.q('#addIncident'));x.q('#addIncident').click();x.q('#voice').click();await wait(()=>x.q('#voice').textContent===x.w.I18N.pt.stopVoice);resolveOld({getTracks:()=>[oldTrack]});await pause();await pause();assert.equal(oldTrack.stopped,true);assert.equal(newTrack.stopped,false,'stale permission must not stop the new recording');x.w.Protection.leave();assert.equal(newTrack.stopped,true);assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});

test('GPS denial and late callback preserve text and never attach location to another incident',async()=>{
 const x=await opened();try{
 let success,denied=true;
 Object.defineProperty(x.w.navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok,fail){if(denied)fail({code:1});else success=ok;}}});
 x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS GPS refusal';x.q('#addGPS').click();await wait(()=>x.q('#vaultStatus').className==='warning');assert.equal(x.q('#incidentDescription').value,'FICTITIOUS GPS refusal');denied=false;x.q('#addGPS').click();await wait(()=>success);x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS different incident';success({coords:{latitude:25.7617,longitude:-80.1918,accuracy:10},timestamp:Date.now()});await pause();await pause();assert.equal(x.q('#gpsStatus').textContent,'');x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-edit]'));assert.ok(!x.q('.revision').textContent.includes('25.7617'));assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});
test('vault downloads attach a named anchor and retain a manual save link after asynchronous preparation',async()=>{
 const x=await opened();try{
 let connected,name,href;x.w.HTMLAnchorElement.prototype.click=function(){connected=this.isConnected;name=this.download;href=this.href;};x.q('#backupVault').click();await wait(()=>name);assert.equal(connected,true);assert.ok(name.endsWith('.uwkv'));const link=x.q('#vaultStatus a[download]');assert.ok(link,'manual save link remains available');assert.equal(link.href,href);assert.equal(link.download,name);assert.equal(await x.downloads[0].text().then(s=>JSON.parse(s).format),'UWKV1');assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});

test('Safari-compatible MP4/AAC and Android-compatible WebM/Opus originals survive save and download byte-for-byte',async()=>{
 const fixtures=JSON.parse(readFileSync(new URL('fixtures-media.json',import.meta.url),'utf8'));
 for(const [label,type,ext]of [['iPhone','audio/mp4','m4a'],['Android','audio/webm','webm']]){
  const x=await opened(label);try{const bytes=Buffer.from(fixtures[ext],'base64');const track={stop(){}};Object.defineProperty(x.w.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[track]})}});
   x.w.MediaRecorder=class {static isTypeSupported(t){return t===type;}constructor(s,o){assert.equal(o.mimeType,type);this.mimeType=type;this.state='inactive';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new Blob([bytes],{type})});this.onstop();}};
   x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS silence fixture';x.q('#voice').click();await wait(()=>x.q('#voice').textContent===x.w.I18N.pt.stopVoice);x.q('#voice').click();await wait(()=>x.q('#pendingFiles').textContent.includes('.'+ext));x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-file]'));x.q('[data-file]').click();await wait(()=>x.downloads.length===1);assert.deepEqual(Buffer.from(await x.downloads[0].arrayBuffer()),bytes);assert.deepEqual(x.errors,[]);
  }finally{x.w.Protection.leave();x.dom.window.close();}
 }
});

test('microphone permission denial releases pending state and keeps manual evidence entry usable',async()=>{
 const x=await opened();try{
 Object.defineProperty(x.w.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('NotAllowedError');}}});x.w.MediaRecorder=class {};
 x.q('#addIncident').click();x.q('#incidentDescription').value='FICTITIOUS permission denied';x.q('#voice').click();await wait(()=>x.q('#vaultStatus').className==='warning');assert.equal(x.w.Protection.hasPending(),false);assert.equal(x.q('#incidentDescription').value,'FICTITIOUS permission denied');attach(x,[png()]);x.q('#incidentForm').dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>x.q('[data-file]'));assert.deepEqual(x.errors,[]);
 }finally{x.w.Protection.leave();x.dom.window.close();}
});
