import {authorize} from '../server/licensing/admin-auth.mjs';
import {createBatch,batchStep,exportPage,changeLicense,authorizeRecovery} from '../server/licensing/batches.mjs';
import {digest} from '../server/worker.mjs';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"};
const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{...headers,'Content-Type':'application/json'}});
const q=(db,sql,...v)=>db.prepare(sql).bind(...v);
const columns=`l.id,l.is_test,l.disabled,l.activated_at,t.batch_id,t.created_at,t.first_activated_at,t.expires_at,CASE WHEN t.license_id IS NULL THEN 'legacy' WHEN l.disabled=1 THEN 'revoked' WHEN t.first_activated_at IS NULL THEN 'available' WHEN t.expires_at<=? THEN 'expired' ELSE 'active' END AS status`;
async function input(request){
 if(request.headers.get('Content-Type')!=='application/json')throw Error('input');
 if(Number(request.headers.get('Content-Length')||0)>4096)throw Error('size');
 const reader=request.body?.getReader();if(!reader)throw Error('input');let length=0,chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>4096){await reader.cancel();throw Error('size');}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 let x;try{x=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw Error('input');}if(!x||Array.isArray(x)||typeof x!=='object')throw Error('input');return x;
}
export default {async fetch(request,env){
 try{
  const actor=await authorize(request,env),url=new URL(request.url),db=env.DB;if(!db)throw Error('configuration');
  if(!url.pathname.startsWith('/api/')){if(!['GET','HEAD'].includes(request.method))return json({error:'method'},405);const asset=await env.ASSETS.fetch(request);return new Response(asset.body,{status:asset.status,headers:{...Object.fromEntries(asset.headers),...headers}});}
  if(!['GET','POST'].includes(request.method))return json({error:'method'},405);
  if(request.method==='POST'&&(request.headers.get('Origin')!==env.ADMIN_ORIGIN||request.headers.get('X-UWK-Admin')!=='1'))return json({error:'origin'},403);
  const time=Date.now(),rate=await q(db,`INSERT INTO attempts(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING count`,'admin:'+await digest(actor.sub),Math.floor(time/1000)+900,Math.floor(time/1000),Math.floor(time/1000)).first();if(rate.count>600)return json({error:'rate'},429);
  if(url.pathname==='/api/overview'&&request.method==='GET'){
   const rows=await db.prepare(`SELECT COUNT(*) total,SUM(CASE WHEN t.license_id IS NULL THEN 1 ELSE 0 END) legacy,SUM(CASE WHEN t.license_id IS NOT NULL AND l.disabled=1 THEN 1 ELSE 0 END) revoked,SUM(CASE WHEN t.license_id IS NOT NULL AND l.disabled=0 AND t.first_activated_at IS NULL THEN 1 ELSE 0 END) available,SUM(CASE WHEN t.license_id IS NOT NULL AND l.disabled=0 AND t.expires_at>${time} THEN 1 ELSE 0 END) active,SUM(CASE WHEN t.license_id IS NOT NULL AND l.disabled=0 AND t.expires_at<=${time} THEN 1 ELSE 0 END) expired FROM licenses l LEFT JOIN license_terms t ON t.license_id=l.id`).first();
   const batches=await db.prepare('SELECT COUNT(*) n FROM license_batches').first();return json({...rows,batches:batches.n});
  }
  if(url.pathname==='/api/batches'&&request.method==='GET'){const rows=await db.prepare('SELECT id,label,requested_count AS quantity,next_index AS completed,status,created_at AS createdAt FROM license_batches ORDER BY created_at DESC LIMIT 100').all();return json({batches:rows.results});}
  if(url.pathname==='/api/audit'&&request.method==='GET'){const r=await db.prepare('SELECT action,target,reason,created_at FROM admin_events ORDER BY id DESC LIMIT 100').all();return json({events:r.results});}
  if(request.method!=='POST')return json({error:'not_found'},404);const data=await input(request),actorId=await digest(actor.sub);
  if((url.pathname==='/api/batches'||/\/step$/.test(url.pathname))&&env.GENERATION_ENABLED!=='true')return json({error:'generation_paused'},503);
  if(url.pathname==='/api/batches')return json(await createBatch(db,env.BATCH_EXPORT_KEY,data,actorId));
  const match=url.pathname.match(/^\/api\/batches\/([0-9a-f-]{36})\/(step|export)$/i);if(match)return json(await (match[2]==='step'?batchStep:exportPage)(db,env.BATCH_EXPORT_KEY,match[1],data.cursor,actorId));
  if(url.pathname==='/api/recovery')return json(await authorizeRecovery(db,data,actorId));
  if(['/api/revoke','/api/reset'].includes(url.pathname))return json(await changeLicense(db,data,actorId,url.pathname.slice(5)));
  if(url.pathname==='/api/search'){
   const search=typeof data.query==='string'?data.query.trim():'',batch=typeof data.batch==='string'?data.batch:'',status=data.status||'',page=data.page??0;if(search.length>100||batch.length>36||!Number.isInteger(page)||page<0||page>100000||!['','legacy','available','active','expired','revoked'].includes(status))throw Error('input');
   const isKey=/^UW-(?:[A-F0-9]{16}|[A-F0-9]{32})$/i.test(search),value=isKey?await digest(search.toUpperCase()):search;
   const r=await q(db,`SELECT * FROM (SELECT ${columns} FROM licenses l LEFT JOIN license_terms t ON t.license_id=l.id WHERE (?='' OR ${isKey?'l.password_hash':'l.id'}=?) AND (?='' OR t.batch_id=?)) WHERE (?='' OR status=?) ORDER BY id LIMIT 50 OFFSET ?`,time,value,value,batch,batch,status,status,page*50).all();return json({licenses:r.results,page});
  }
  return json({error:'not_found'},404);
 }catch(e){const known=['configuration','unauthorized','input','size','conflict','missing','not_ready','legacy_readonly'];const code=known.includes(e.message)?e.message:'unavailable';return json({error:code},{configuration:503,unauthorized:401,input:400,size:413,conflict:409,missing:404,not_ready:409,legacy_readonly:403,unavailable:503}[code]);}
}};
