import test from 'node:test';import assert from 'node:assert/strict';
import {adminRuntime} from './helpers/admin-runtime.mjs';
for(const chosenPassword of [false,true])test('real workerd/D1 '+(chosenPassword?'chosen password':'legacy verifier')+': local login, batches 1/50/500/2000, idempotency and 50 unchanged legacy rows',async()=>{
 const {mf,db,before,call,login}=await adminRuntime(undefined,{chosenPassword});try{
 const entry=await call('/');assert.equal(entry.status,303);assert.equal(entry.headers.get('Location'),'/login');
 for(let round=0;round<3;round++){const page=await call('/login');assert.equal(page.status,200);assert.equal(page.headers.get('Location'),null);assert.match(await page.text(),/id="loginTitle"/);}
 const canonical=await call('/login.html');assert.equal(canonical.status,307);assert.equal(canonical.headers.get('Location'),'/login');
 assert.equal((await call('/admin.js')).status,303);assert.equal((await call('/api/overview')).status,401);const headers=await login();let allKeys=[];
 for(const quantity of [1,50,500,2000]){
 const operation={requestId:crypto.randomUUID(),quantity,label:'FICTITIOUS '+quantity};let response=await call('/api/batches',operation,headers);assert.equal(response.status,200);let batch=await response.json();const repeated=await(await call('/api/batches',operation,headers)).json();assert.equal(repeated.id,batch.id);
 while(batch.status!=='ready') {const cursor=batch.completed;response=await call('/api/batches/'+batch.id+'/step',{cursor},headers);assert.equal(response.status,200);batch=await response.json();if(cursor===0){const resumed=await(await call('/api/batches/'+batch.id+'/step',{cursor},headers)).json();assert.equal(resumed.completed,batch.completed);}}
 let cursor=0,keys=[];do{response=await call('/api/batches/'+batch.id+'/export',{cursor},headers);assert.equal(response.status,200);const exported=await response.json();keys.push(...exported.keys);cursor=exported.next;}while(cursor!==null);assert.equal(keys.length,quantity);assert.equal(new Set(keys).size,quantity);assert.ok(keys.every(k=>/^UW-[A-F0-9]{32}$/.test(k)));allKeys.push(...keys);
 }
 assert.equal(allKeys.length,2551);assert.equal(new Set(allKeys).size,2551);assert.deepEqual((await db.prepare("SELECT * FROM licenses WHERE id NOT LIKE 'T-%' ORDER BY id").all()).results,before);
 assert.equal((await call('/api/revoke',{id:'001',reason:'FICTITIOUS operation',requestId:crypto.randomUUID()},headers)).status,403);
 assert.equal((await call('/api/logout',{},headers)).status,200);assert.equal((await call('/api/overview',undefined,headers)).status,401);
 }finally{await mf.dispose();}
});
