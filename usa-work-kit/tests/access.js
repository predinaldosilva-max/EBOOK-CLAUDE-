const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8');
const segment=source.split('// BEGIN ACCESS:')[1].split('\n').slice(1).join('\n').split('// END ACCESS')[0];
let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
function context(initial=null,fail=false){
 let saved=initial;
 const button={disabled:false},input={value:''},error={textContent:''},form={querySelector:()=>button};
 const host={innerHTML:''};const elements={app:host,accessForm:form,accessPassword:input,accessError:error};
 const ctx={crypto:webcrypto,TextEncoder,Uint8Array,localStorage:{getItem:()=>{if(fail)throw Error('blocked');return saved;},setItem:(k,v)=>{if(fail)throw Error('quota');saved=v;}},document:{getElementById:id=>elements[id]}};
 vm.createContext(ctx);vm.runInContext(segment,ctx);return {ctx,elements,get saved(){return saved;}};
}
(async()=>{
 const c=context();const hashes=vm.runInContext('ACCESS_HASHES',c.ctx);
 check('50 distinct SHA256 entries',()=>{assert.equal(hashes.length,50);assert.equal(new Set(hashes).size,50);assert.ok(hashes.every(x=>/^[a-f0-9]{64}$/.test(x)));});
 check('No plaintext access codes in production script',()=>assert.equal(/UW-[A-F0-9]{16}/.test(source),false));
 const valid='UW-0123456789ABCDEF';const hash=await c.ctx.accessHash(valid);vm.runInContext('ACCESS_HASHES.push("'+hash+'")',c.ctx);
 check('Whitespace and case normalization',()=>{});assert.equal(await c.ctx.accessHash('  '+valid.toLowerCase()+'  '),hash);
 check('Malformed inputs rejected',()=>{});for(const value of ['',null,'password','<script>',valid+'X'])assert.equal(await c.ctx.accessHash(value),'');
 let opened=false;const waiting=c.ctx.requireAccess().then(()=>{opened=true;});
 check('Locked visitor sees access form',()=>{assert.ok(c.elements.app.innerHTML.includes('Acesso do comprador'));assert.equal(opened,false);});
 c.elements.accessPassword.value='wrong';await c.elements.accessForm.onsubmit({preventDefault(){}});
 check('Wrong password stays locked',()=>{assert.equal(opened,false);assert.ok(c.elements.accessError.textContent.includes('inválida'));});
 c.elements.accessPassword.value=valid;await c.elements.accessForm.onsubmit({preventDefault(){}});await waiting;
 check('Correct password unlocks and stores only hash',()=>{assert.equal(opened,true);assert.equal(c.saved,hash);assert.equal(c.elements.accessPassword.value,'');});
 const remembered=context(hashes[0]);assert.equal(await remembered.ctx.requireAccess(),true);check('Remembered approved entry unlocks',()=>assert.equal(remembered.elements.app.innerHTML,''));
 const invalid=context('tampered');invalid.ctx.requireAccess();check('Unknown remembered entry remains locked',()=>assert.ok(invalid.elements.app.innerHTML.includes('accessForm')));
 const noStore=context(null,true);vm.runInContext('ACCESS_HASHES.push("'+hash+'")',noStore.ctx);const session=noStore.ctx.requireAccess();noStore.elements.accessPassword.value=valid;await noStore.elements.accessForm.onsubmit({preventDefault(){}});assert.equal(await session,true);check('Unavailable storage permits current session',()=>{});
 console.log(checks+' access checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
