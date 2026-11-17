const enc = new TextEncoder();
export async function digest(value) {
 return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail=(code,status)=>json({error:code},status);
async function limited(db,key,limit){
 const now=Math.floor(Date.now()/1000);
 const row=await db.prepare(`INSERT INTO attempts(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING count`).bind(key,now+900,now,now).first();
 return row.count>limit;
}
export default {
 async fetch(request,env){
  const url=new URL(request.url),path=url.pathname;
  if(!path.startsWith('/api/'))return env.ASSETS.fetch(request);
  try{
   if(request.method!=='POST')return fail('method',405);
   if(request.headers.get('Origin')!==url.origin)return fail('origin',403);
   if(!request.headers.get('Content-Type')?.startsWith('application/json'))return fail('content_type',415);
   if(Number(request.headers.get('Content-Length')||0)>2048)return fail('size',413);
   const raw=await request.text();if(raw.length>2048)return fail('size',413);
   let data;try{data=JSON.parse(raw);}catch{return fail('json',400);}
   if(!data||typeof data!=='object')return fail('input',400);
   if(!env.DB||!env.RATE_SECRET)return fail('configuration',503);
   if(path==='/api/admin/reset'){
    if(!env.ADMIN_TOKEN||env.ADMIN_TOKEN.length<32)return fail('configuration',503);
    if(await digest(request.headers.get('Authorization')||'')!==await digest('Bearer '+env.ADMIN_TOKEN))return fail('unauthorized',401);
    if(!/^\d{3,6}$/.test(data.id)||typeof data.reason!=='string'||data.reason.trim().length<5||data.reason.length>200)return fail('input',400);
    const result=await env.DB.batch([
     env.DB.prepare('UPDATE licenses SET installation_hash=NULL,generation=generation+1,activated_at=NULL WHERE id=? AND is_test=0 RETURNING id').bind(data.id),
     env.DB.prepare("INSERT INTO audit(license_id,action,reason,created_at) SELECT id,'reset',?,? FROM licenses WHERE id=? AND is_test=0").bind(data.reason.trim(),Date.now(),data.id)
    ]);
    return result[0].results.length?json({ok:true}):fail('not_found',404);
   }
   if(!['/api/activate','/api/validate'].includes(path))return fail('not_found',404);
   const ip=request.headers.get('CF-Connecting-IP')||'local';
   if(await limited(env.DB,await digest(env.RATE_SECRET+':ip:'+ip),path==='/api/activate'?30:240))return fail('rate',429);
   if(typeof data.installation!=='string'||!/^[-_A-Za-z0-9]{43}$/.test(data.installation))return fail('input',400);
   const install=await digest(data.installation);
   if(path==='/api/activate'){
    if(typeof data.password!=='string')return fail('input',400);
    const password=data.password.trim().toUpperCase();
    if(!/^UW-[A-F0-9]{16}$/.test(password))return fail('invalid',401);
    const hash=await digest(password);
    if(await limited(env.DB,await digest(env.RATE_SECRET+':code:'+hash),60))return fail('rate',429);
    // Atomic compare-and-set: two installations can never both claim a commercial license.
    const row=await env.DB.prepare(`UPDATE licenses SET installation_hash=CASE WHEN is_test=1 THEN NULL ELSE ? END, activated_at=COALESCE(activated_at,?) WHERE password_hash=? AND disabled=0 AND (is_test=1 OR installation_hash IS NULL OR installation_hash=?) RETURNING id,generation,is_test`).bind(install,Date.now(),hash,install).first();
    if(!row)return fail('invalid_or_bound',409);
    let token=null;
    if(row.is_test){
     token=crypto.randomUUID()+crypto.randomUUID();
     await env.DB.prepare('INSERT INTO test_sessions(token_hash,license_id,installation_hash,generation,expires) VALUES(?,?,?,?,?)').bind(await digest(token),row.id,install,row.generation,Date.now()+30*86400000).run();
    }
    return json({ok:true,license:row.id,generation:row.generation,token});
   }
   if(typeof data.license!=='string'||!Number.isSafeInteger(data.generation))return fail('input',400);
   const row=await env.DB.prepare(`SELECT l.id FROM licenses l WHERE l.id=? AND l.generation=? AND l.disabled=0 AND ((l.is_test=0 AND l.installation_hash=?) OR (l.is_test=1 AND EXISTS(SELECT 1 FROM test_sessions t WHERE t.license_id=l.id AND t.generation=l.generation AND t.installation_hash=? AND t.token_hash=? AND t.expires>?)))`).bind(data.license,data.generation,install,install,await digest(typeof data.token==='string'?data.token:''),Date.now()).first();
   return row?json({ok:true}):fail('revoked',401);
  }catch{return fail('unavailable',503);}
 },
 async scheduled(event,env){await env.DB.batch([env.DB.prepare('DELETE FROM attempts WHERE expires < ?').bind(Math.floor(Date.now()/1000)),env.DB.prepare('DELETE FROM test_sessions WHERE expires < ?').bind(Date.now())]);}
};
