import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {digest} from '../server/worker.mjs';
test('Cloudflare workerd + D1: concurrency, reuse, test password and reset',async()=>{
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:(await build({entryPoints:[new URL('../server/worker.mjs',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'browser'})).outputFiles[0].text,compatibilityDate:'2026-11-17',d1Databases:['DB'],bindings:{RATE_SECRET:'r'.repeat(64),ADMIN_TOKEN:'t'.repeat(64)}}));
 try{
 const db=await mf.getD1Database('DB');
 await db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8').replace(/\n/g,' '));
 for(const [id,pw,flag] of [['002','UW-0123456789ABCDEF',0],['001','UW-FEDCBA9876543210',1]])await db.prepare('INSERT INTO licenses(id,password_hash,is_test) VALUES(?,?,?)').bind(id,await digest(pw),flag).run();
 const request=(path,data,ip='192.0.2.1',admin=false)=>mf.dispatchFetch('https://kit.example/api/'+path,{method:'POST',headers:{Origin:'https://kit.example','Content-Type':'application/json','CF-Connecting-IP':ip,...(admin?{Authorization:'Bearer '+'t'.repeat(64)}:{})},body:JSON.stringify(data)});
 const results=await Promise.all(Array.from({length:20},(_,i)=>request('activate',{password:'UW-0123456789ABCDEF',installation:String(i).padStart(43,'a')},'192.0.2.'+i)));
 assert.equal(results.filter(r=>r.status===200).length,1);assert.equal(results.filter(r=>r.status===409).length,19);
 const index=results.findIndex(r=>r.status===200),grant=await results[index].json(),installation=String(index).padStart(43,'a');
 assert.equal((await request('validate',{...grant,installation})).status,200);
 assert.equal((await request('activate',{password:'UW-0123456789ABCDEF',installation:'z'.repeat(43)})).status,409);
 for(const installation of ['x'.repeat(43),'y'.repeat(43)])assert.equal((await request('activate',{password:'UW-FEDCBA9876543210',installation})).status,200);
 assert.equal((await request('admin/reset',{id:'002',reason:'Troca solicitada'},'192.0.2.1',true)).status,200);
 assert.equal((await request('validate',{...grant,installation})).status,401);
 assert.equal((await request('activate',{password:'UW-0123456789ABCDEF',installation:'z'.repeat(43)})).status,200);
 }finally{await mf.dispose();}
});
