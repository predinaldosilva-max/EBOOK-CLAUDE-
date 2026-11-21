export const DURATION_MS=30*24*60*60*1000,LEASE_MS=5*60*1000;
export const now=()=>Date.now();
const query=(db,sql,...args)=>db.prepare(sql).bind(...args);
export async function terms(db,id){
 const exists=await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='license_terms'").first();
 return exists?query(db,'SELECT * FROM license_terms WHERE license_id=?',id).first():null;
}
export async function previousOwner(db,proof,installationHash){
 if(proof===undefined||proof===null)return null;
 if(!proof||typeof proof.license!=='string'||proof.license.length>100||!Number.isSafeInteger(proof.generation)||proof.token)throw Error('owner_proof');
 const old=await query(db,'SELECT id,generation,is_test,installation_hash FROM licenses WHERE id=?',proof.license).first();
 if(!old||old.is_test||old.generation!==proof.generation||old.installation_hash!==installationHash)throw Error('owner_proof');
 const policy=await terms(db,old.id);return policy?.data_owner||old.id;
}
export function temporaryGrant(row,policy,time){return {ok:true,license:row.id,generation:row.generation,token:null,kind:'temporary',owner:policy.data_owner,expiresAt:policy.expires_at,serverTime:time,leaseMs:Math.min(LEASE_MS,policy.expires_at-time)};}
export async function activateTemporary(db,id,installationHash,proof,time=now()){
 const policy=await terms(db,id);if(!policy)throw Error('configuration');
 if(policy.expires_at!==null&&policy.expires_at<=time)throw Error('expired');
 const recovery=policy.data_owner?null:await query(db,'SELECT data_owner FROM license_recovery_links WHERE license_id=?',id).first();
 const owner=policy.data_owner||recovery?.data_owner||await previousOwner(db,proof,installationHash)||id;
 const out=await db.batch([
 query(db,`UPDATE licenses SET installation_hash=?,activated_at=COALESCE(activated_at,?)
 WHERE id=? AND is_test=0 AND disabled=0 AND (installation_hash IS NULL OR installation_hash=?)
 AND EXISTS(SELECT 1 FROM license_terms t WHERE t.license_id=licenses.id AND (t.expires_at IS NULL OR t.expires_at>?))
 RETURNING id,generation`,installationHash,time,id,installationHash,time),
 query(db,`UPDATE license_terms SET first_activated_at=COALESCE(first_activated_at,?),expires_at=COALESCE(expires_at,?),data_owner=COALESCE(data_owner,(SELECT r.data_owner FROM license_recovery_links r WHERE r.license_id=license_terms.license_id),?)
 WHERE license_id=? AND (expires_at IS NULL OR expires_at>?)
 AND EXISTS(SELECT 1 FROM licenses l WHERE l.id=license_terms.license_id AND l.installation_hash=? AND l.disabled=0 AND l.is_test=0)
 RETURNING *`,time,time+DURATION_MS,owner,id,time,installationHash)
 ]);
 const row=out[0].results?.[0],updated=out[1].results?.[0];if(!row||!updated)throw Error('invalid_or_bound');
 return temporaryGrant(row,updated,time);
}
export function checkTemporary(row,policy,time=now()){
 if(!Number.isSafeInteger(policy?.first_activated_at)||!Number.isSafeInteger(policy?.expires_at)||!policy?.data_owner)throw Error('revoked');
 if(policy.expires_at<=time)throw Error('expired');
 return temporaryGrant(row,policy,time);
}
