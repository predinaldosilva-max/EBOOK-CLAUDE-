import {digest} from '../worker.mjs';
export const MAX_BATCH=2000,CHUNK=20;
const enc=new TextEncoder(),b64=b=>btoa(String.fromCharCode(...b)),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const q=(db,s,...v)=>db.prepare(s).bind(...v);
export const validOperation=id=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const safe=r=>({id:r.id,label:r.label,quantity:r.requested_count,completed:r.next_index,status:r.status,createdAt:r.created_at});
async function encryptionKey(secret){let b;try{b=unb64(secret);}catch{throw Error('configuration');}if(b.length!==32)throw Error('configuration');return crypto.subtle.importKey('raw',b,'AES-GCM',false,['encrypt','decrypt']);}
async function seedKey(row,secret){const key=await encryptionKey(secret);let seed;try{seed=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(row.seed_iv),additionalData:enc.encode('UWK-BATCH-1|'+row.id)},key,unb64(row.seed_cipher));}catch{throw Error('configuration');}return crypto.subtle.importKey('raw',seed,{name:'HMAC',hash:'SHA-256'},false,['sign']);}
async function code(key,index){const b=new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode('UWK-KEY-1|'+index)));return 'UW-'+Array.from(b.slice(0,16),v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();}
export async function createBatch(db,secret,input,actor){
 if(!validOperation(input.requestId)||!Number.isInteger(input.quantity)||input.quantity<1||input.quantity>MAX_BATCH||typeof input.label!=='string'||input.label.length>160)throw Error('input');
 let row=await q(db,'SELECT * FROM license_batches WHERE request_id=?',input.requestId).first();
 if(row){if(row.requested_count!==input.quantity||row.label!==input.label)throw Error('conflict');return safe(row);}
 const id=crypto.randomUUID(),iv=crypto.getRandomValues(new Uint8Array(12)),seed=crypto.getRandomValues(new Uint8Array(32)),key=await encryptionKey(secret),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('UWK-BATCH-1|'+id)},key,seed)),at=Date.now();
 await db.batch([
 q(db,'INSERT INTO license_batches(id,request_id,label,requested_count,created_at,created_by,seed_iv,seed_cipher) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING',id,input.requestId,input.label,input.quantity,at,actor,b64(iv),b64(cipher)),
 q(db,"INSERT INTO admin_events(operation_id,actor,action,target,created_at) SELECT ?,?,'batch-create',id,? FROM license_batches WHERE request_id=? ON CONFLICT(operation_id) DO NOTHING",'create:'+input.requestId,actor,at,input.requestId)
 ]);
 row=await q(db,'SELECT * FROM license_batches WHERE request_id=?',input.requestId).first();if(row.requested_count!==input.quantity||row.label!==input.label)throw Error('conflict');return safe(row);
}
export async function batchStep(db,secret,id,cursor,actor){
 if(!validOperation(id)||!Number.isInteger(cursor)||cursor<0)throw Error('input');const row=await q(db,'SELECT * FROM license_batches WHERE id=?',id).first();if(!row)throw Error('missing');if(cursor!==row.next_index||row.status==='ready')return safe(row);
 const key=await seedKey(row,secret),end=Math.min(row.requested_count,cursor+CHUNK),sql=[];
 for(let index=cursor;index<end;index++){
  const password=await code(key,index),hash=await digest(password),license='T-'+id+'-'+index;
  sql.push(q(db,'INSERT INTO licenses(id,password_hash,is_test) SELECT ?,?,0 WHERE EXISTS(SELECT 1 FROM license_batches WHERE id=? AND next_index=?)',license,hash,id,cursor));
  sql.push(q(db,'INSERT INTO license_terms(license_id,batch_id,batch_index,created_at) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM license_batches WHERE id=? AND next_index=?)',license,id,index,Date.now(),id,cursor));
 }
 sql.push(q(db,"UPDATE license_batches SET next_index=?,status=CASE WHEN ?=requested_count THEN 'ready' ELSE 'generating' END WHERE id=? AND next_index=?",end,end,id,cursor));
 sql.push(q(db,"INSERT INTO admin_events(operation_id,actor,action,target,created_at) VALUES(?,?,'batch-step',?,?) ON CONFLICT(operation_id) DO NOTHING",'step:'+id+':'+cursor,actor,id,Date.now()));
 await db.batch(sql);return safe(await q(db,'SELECT * FROM license_batches WHERE id=?',id).first());
}
export async function exportPage(db,secret,id,cursor,actor){
 if(!validOperation(id)||!Number.isInteger(cursor)||cursor<0)throw Error('input');const row=await q(db,'SELECT * FROM license_batches WHERE id=?',id).first();if(!row)throw Error('missing');if(row.status!=='ready')throw Error('not_ready');if(cursor>=row.requested_count)throw Error('input');
 const key=await seedKey(row,secret),end=Math.min(row.requested_count,cursor+CHUNK),keys=[];for(let i=cursor;i<end;i++)keys.push(await code(key,i));
 await q(db,"INSERT INTO admin_events(operation_id,actor,action,target,created_at) VALUES(?,?,'batch-export',?,?) ON CONFLICT(operation_id) DO NOTHING",'export:'+id+':'+cursor,actor,id,Date.now()).run();
 return {keys,next:end<row.requested_count?end:null,total:row.requested_count};
}
export async function changeLicense(db,input,actor,action){
 if(!['revoke','reset'].includes(action)||!validOperation(input.requestId)||typeof input.id!=='string'||input.id.length>100||typeof input.reason!=='string'||input.reason.trim().length<5||input.reason.length>200)throw Error('input');
 const target=await q(db,'SELECT l.id FROM licenses l JOIN license_terms t ON t.license_id=l.id WHERE l.id=?',input.id).first();if(!target)throw Error('legacy_readonly');
 const prior=await q(db,'SELECT * FROM admin_events WHERE operation_id=?',input.requestId).first();if(prior){if(prior.target!==input.id||prior.action!==action)throw Error('conflict');return {ok:true};}
 await db.batch([
 q(db,action==='revoke'?'UPDATE licenses SET disabled=1 WHERE id=? AND NOT EXISTS(SELECT 1 FROM admin_events WHERE operation_id=?)':'UPDATE licenses SET installation_hash=NULL,generation=generation+1 WHERE id=? AND NOT EXISTS(SELECT 1 FROM admin_events WHERE operation_id=?)',input.id,input.requestId),
 q(db,'INSERT INTO admin_events(operation_id,actor,action,target,reason,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(operation_id) DO NOTHING',input.requestId,actor,action,input.id,input.reason.trim(),Date.now())
 ]);const committed=await q(db,'SELECT target,action FROM admin_events WHERE operation_id=?',input.requestId).first();if(!committed||committed.target!==input.id||committed.action!==action)throw Error('conflict');return {ok:true};
}

export async function authorizeRecovery(db,input,actor){
 if(!validOperation(input.requestId)||typeof input.id!=='string'||input.id.length>100||typeof input.source!=='string'||!input.source.trim()||input.source.length>100||typeof input.reason!=='string'||input.reason.trim().length<5||input.reason.length>200)throw Error('input');
 const sourceText=input.source.trim(),source=await q(db,/^UW-(?:[A-F0-9]{16}|[A-F0-9]{32})$/i.test(sourceText)?'SELECT id,is_test FROM licenses WHERE password_hash=?':'SELECT id,is_test FROM licenses WHERE id=?',/^UW-/i.test(sourceText)?await digest(sourceText.toUpperCase()):sourceText).first();
 if(!source||source.is_test||source.id===input.id)throw Error('input');
 const sourceTerms=await q(db,'SELECT data_owner FROM license_terms WHERE license_id=?',source.id).first();
 if(source.id.startsWith('T-')&&!sourceTerms?.data_owner)throw Error('input');
 const owner=sourceTerms?.data_owner||source.id,prior=await q(db,'SELECT * FROM admin_events WHERE operation_id=?',input.requestId).first();
 if(prior){const link=await q(db,'SELECT * FROM license_recovery_links WHERE license_id=?',input.id).first();if(prior.target!==input.id||prior.action!=='recovery-link'||link?.source_license_id!==source.id)throw Error('conflict');return {ok:true};}
 const oldLink=await q(db,'SELECT * FROM license_recovery_links WHERE license_id=?',input.id).first();if(oldLink&&oldLink.source_license_id!==source.id)throw Error('conflict');
 const at=Date.now();await db.batch([
 q(db,`INSERT INTO license_recovery_links(license_id,source_license_id,data_owner,approved_at,approved_by,reason)
 SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM license_terms t JOIN licenses l ON l.id=t.license_id WHERE t.license_id=? AND t.first_activated_at IS NULL AND l.installation_hash IS NULL AND l.disabled=0)
 ON CONFLICT(license_id) DO NOTHING`,input.id,source.id,owner,at,actor,input.reason.trim(),input.id),
 q(db,"INSERT INTO admin_events(operation_id,actor,action,target,reason,created_at) SELECT ?,?,'recovery-link',?,?,? WHERE EXISTS(SELECT 1 FROM license_recovery_links WHERE license_id=? AND source_license_id=?) ON CONFLICT(operation_id) DO NOTHING",input.requestId,actor,input.id,input.reason.trim(),at,input.id,source.id)
 ]);
 const link=await q(db,'SELECT * FROM license_recovery_links WHERE license_id=?',input.id).first();if(!link||link.source_license_id!==source.id)throw Error('conflict');return {ok:true};
}
