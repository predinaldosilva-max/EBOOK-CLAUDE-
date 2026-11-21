import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Model the production host's /index.html -> / redirect. Preserve the Fetch
// redirected flag across Cache API reads, just as native browser caches do.
function response(body, redirected=false) {
 const r=new Response(body,{headers:{'Content-Type':'text/html;charset=utf-8'}});
 Object.defineProperties(r,{redirected:{value:redirected},url:{value:'https://example.test/kit/'}});
 r.clone=()=>response(body,redirected); return r;
}
async function harness(source=fs.readFileSync('usa-work-kit/sw.js','utf8')) {
 const handlers={},stores=new Map();let online=true,claimed=false,skipped=false,networkCalls=0;const requests=[];
 const absolute=req=>new URL(typeof req==='string'||req instanceof URL?String(req):req.url,'https://example.test/kit/').href;
 const open=async name=>{if(!stores.has(name))stores.set(name,new Map());const rows=stores.get(name);return {
  async addAll(requests){for(const req of requests){if(!online)throw Error('offline');rows.set(absolute(req),response('<html>fixture</html>',absolute(req).endsWith('/index.html')));}},
  async match(req){return rows.get(absolute(req))?.clone();},
  async put(req,r){rows.set(absolute(req),r);}
 };};
 const caches={open,keys:async()=>[...stores.keys()],delete:async k=>stores.delete(k),match:async req=>{for(const name of stores.keys()){const r=await(await open(name)).match(req);if(r)return r;}}};
 const self={location:{origin:'https://example.test',href:'https://example.test/kit/sw.js'},registration:{scope:'https://example.test/kit/'},addEventListener:(n,f)=>handlers[n]=f,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}};
 vm.runInNewContext(source,{self,caches,URL,Request:class{constructor(url,options){this.url=absolute(url);Object.assign(this,options);}},Response,fetch:async req=>{networkCalls++;requests.push(absolute(req));if(!online)throw Error('offline');return response('<html>network</html>',new URL(absolute(req)).pathname.endsWith('/index.html'));}});
 const life=async name=>{let pending;handlers[name]({waitUntil:p=>pending=p});await pending;};
 const request=async(url,mode='navigate',method='GET')=>{let pending;handlers.fetch({request:{url:new URL(url,'https://example.test/kit/').href,method,mode},respondWith:p=>pending=p});return pending;};
 return {life,request,stores,requests,setOnline:value=>online=value,get networkCalls(){return networkCalls;},get claimed(){return claimed;},get skipped(){return skipped;}};
}
for(let round=1;round<=3;round++)test(`PWA navigation round ${round}: index redirect, reopen, offline, unrelated cache and API isolation`,async()=>{
 const h=await harness();await h.life('install');assert.equal(h.skipped,true);assert.ok(h.requests.length>20);assert.ok(h.requests.every(url=>new URL(url).searchParams.get('__uwk_release')==='usa-work-kit-v2.3.0-rc1'));
 h.stores.set('unrelated-cache',new Map());h.stores.set('usa-work-kit-old',new Map());await h.life('activate');assert.equal(h.claimed,true);assert.ok(h.stores.has('unrelated-cache'));assert.ok(!h.stores.has('usa-work-kit-old'));
 for(const online of [true,false]){h.setOnline(online);for(const url of ['./','./index.html','./?reopen=1','./unknown']){
  const r=await h.request(url);assert.ok(r?.ok,url);assert.equal(r.redirected,false,`Safari rejects redirected navigation: ${url}`);assert.match(await r.text(),/html/);
 }}
 assert.equal(await h.request('/api/validate'),undefined);assert.equal(await h.request('https://other.test/'),undefined);assert.equal(await h.request('./','navigate','POST'),undefined);
});
test('PWA manifest launches the canonical directory without an HTML redirect',()=>{
 const manifest=JSON.parse(fs.readFileSync('usa-work-kit/manifest.webmanifest'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.id,'./index.html');assert.equal(manifest.display,'standalone');
});

test('An unavailable asset cannot activate a partial release or remove the old cache',async()=>{
 const h=await harness();h.stores.set('usa-work-kit-old',new Map());h.setOnline(false);await assert.rejects(h.life('install'));assert.equal(h.skipped,false);assert.equal(h.claimed,false);assert.ok(h.stores.has('usa-work-kit-old'));
});
