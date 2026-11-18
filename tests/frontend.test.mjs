import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
const source=readFileSync(new URL('../usa-work-kit/js/app.js',import.meta.url),'utf8').split('// BEGIN ACCESS:')[1].split('\n').slice(1).join('\n').split('// END ACCESS')[0];
function setup(saved={},responses=[]){
 const store=new Map(Object.entries(saved)),calls=[];
 const elements={app:{innerHTML:''},accessPassword:{value:''},accessError:{textContent:''},accessForm:{querySelector:()=>({disabled:false})}};
 const ctx=vm.createContext({crypto:webcrypto,TextEncoder,Uint8Array,btoa,AbortController,setTimeout,clearTimeout,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{getElementById:k=>elements[k]},fetch:async(url,opt)=>{calls.push({url,data:JSON.parse(opt.body)});const r=responses.shift()||{ok:false,error:'invalid_or_bound'};return {ok:r.ok,json:async()=>r};}});
 vm.runInContext(source,ctx);return {ctx,elements,store,calls};
}
test('legacy hash cannot unlock; activation saves installation and server grant',async()=>{
 const c=setup({'usa-work-kit-access-v1':'old-trusted-hash'},[{ok:true,license:'002',generation:0,token:null}]);let opened=false;
 const pending=c.ctx.requireAccess().then(()=>opened=true);await new Promise(r=>setImmediate(r));assert.equal(opened,false);assert.ok(c.elements.app.innerHTML.includes('accessForm'));assert.ok(!c.store.has('usa-work-kit-access-v1'));
 c.elements.accessPassword.value='UW-0123456789ABCDEF';await c.elements.accessForm.onsubmit({preventDefault(){}});await pending;
 assert.equal(opened,true);assert.equal(c.calls[0].url,'/api/activate');assert.equal(c.calls[0].data.installation.length,43);assert.ok(!c.store.get('usa-work-kit-server-access-v1').includes('UW-'));
});
test('stored grant always goes to server; revoked grant does not unlock',async()=>{
 const c=setup({'usa-work-kit-installation-v1':'a'.repeat(43),'usa-work-kit-server-access-v1':JSON.stringify({license:'002',generation:0})},[{ok:false,error:'revoked'}]);let opened=false;c.ctx.requireAccess().then(()=>opened=true);await new Promise(r=>setImmediate(r));assert.equal(opened,false);assert.equal(c.calls[0].url,'/api/validate');assert.ok(c.elements.app.innerHTML.includes('accessForm'));
 c.elements.accessPassword.value='UW-0123456789ABCDEF';await c.elements.accessForm.onsubmit({preventDefault(){}});assert.equal(opened,false);assert.ok(c.elements.accessError.textContent.includes('ou já ativada'));
});
test('invalid format is identified locally instead of reporting internet failure',async()=>{
 const c=setup();c.ctx.requireAccess();await new Promise(r=>setImmediate(r));
 c.elements.accessPassword.value='002';await c.elements.accessForm.onsubmit({preventDefault(){}});
 assert.equal(c.calls.length,0);assert.ok(c.elements.accessError.textContent.includes('[invalid]'));
});
test('configuration, database and origin failures are distinguished from network errors',async()=>{
 for(const code of ['configuration','unavailable','origin','rate']){
  const c=setup({},[{ok:false,error:code}]);c.ctx.requireAccess();await new Promise(r=>setImmediate(r));
  c.elements.accessPassword.value='UW-0123456789ABCDEF';await c.elements.accessForm.onsubmit({preventDefault(){}});
  assert.ok(c.elements.accessError.textContent.includes('['+code+']'));
 }
});
