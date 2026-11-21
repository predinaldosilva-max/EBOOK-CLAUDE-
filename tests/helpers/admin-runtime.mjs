import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {passwordRecord,totpCode} from '../../server/licensing/local-admin-auth.mjs';
export const adminOrigin='https://admin.fixture.test',fixturePassword='FICTITIOUS-password-for-tests-123456789',fixtureTotp='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
export async function adminRuntime(origin=adminOrigin,options={}){
 const bundle=await build({entryPoints:['admin/worker.mjs'],bundle:true,format:'esm',platform:'browser',write:false});
 const bindings={ADMIN_AUTH_MODE:'local',ADMIN_ORIGIN:origin,ADMIN_USER:'owner',ADMIN_PASSWORD_RECORD:await passwordRecord(fixturePassword),ADMIN_TOTP_SECRET:fixtureTotp,ADMIN_SESSION_SECRET:btoa('s'.repeat(32)),BATCH_EXPORT_KEY:btoa('b'.repeat(32)),GENERATION_ENABLED:'true'};
 if(options.chosenPassword){bindings.ADMIN_PASSWORD=fixturePassword;delete bindings.ADMIN_PASSWORD_RECORD;}
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-11-17',d1Databases:['DB'],bindings,assets:{directory:'./admin/public',binding:'ASSETS',run_worker_first:true,routerConfig:{has_user_worker:true}}}));
 const db=await mf.getD1Database('DB');
 for(const file of ['schema.sql','migrations/0001_temporary_licenses.sql','migrations/0002_admin_auth.sql'])await db.exec(readFileSync(file,'utf8').replace(/^\s*--.*$/gm,'').replace(/\n/g,' '));
 await db.batch(Array.from({length:50},(_,i)=>db.prepare('INSERT INTO licenses(id,password_hash,is_test) VALUES(?,?,?)').bind(String(i+1).padStart(3,'0'),'FICTITIOUS-legacy-'+i,i===0?1:0)));
 const before=(await db.prepare('SELECT * FROM licenses ORDER BY id').all()).results;
 const call=(path,data,headers={})=>mf.dispatchFetch(origin+path,{redirect:'manual',method:data===undefined?'GET':'POST',headers:{Origin:adminOrigin,'Content-Type':'application/json','X-UWK-Admin':'1','CF-Connecting-IP':'192.0.2.1',...headers},body:data===undefined?undefined:JSON.stringify(data)});
 const login=async()=>{const response=await call('/auth/login',{user:'owner',password:fixturePassword,code:await totpCode(fixtureTotp,Math.floor(Date.now()/30000))});if(response.status!==200)throw Error('Runtime login failed: '+response.status+' '+await response.text());const cookie=response.headers.get('Set-Cookie').split(';')[0],session=await(await call('/api/session',undefined,{Cookie:cookie})).json();return {Cookie:cookie,'X-UWK-CSRF':session.csrf};};
 return {mf,db,before,call,login};
}
