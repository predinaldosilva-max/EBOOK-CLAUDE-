const enc = new TextEncoder();
export const SESSION_MS = 30 * 60 * 1000;
export const COOKIE = '__Host-uwk_admin';
const WINDOW_MS = 15 * 60 * 1000;
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
 status, headers: {'Content-Type':'application/json', 'Cache-Control':'no-store', ...headers}
});
const b64 = bytes => btoa(String.fromCharCode(...bytes));
const un64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const random = () => b64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
export const sha = async value => hex(await crypto.subtle.digest('SHA-256',enc.encode(value)));
function equal(a,b) {if(typeof a!=='string'||typeof b!=='string')return false;let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return diff===0;}
function base32(value) {
 if(typeof value!=='string'||!/^[A-Z2-7]{32,104}$/.test(value))throw Error('configuration');
 let bits=0,acc=0,out=[];for(const c of value){acc=(acc<<5)|'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(c);bits+=5;if(bits>=8){bits-=8;out.push((acc>>>bits)&255);}}
 return new Uint8Array(out);
}
export async function passwordRecord(password, salt=crypto.getRandomValues(new Uint8Array(16))) {
 if(typeof password!=='string'||password.length<20||password.length>256)throw Error('input');
 const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const result=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256);
 return 'pbkdf2-sha256$100000$'+b64(salt)+'$'+b64(new Uint8Array(result));
}
async function config(env,request) {
 if(!env.DB||!/^https:\/\/[^/]+$/.test(env.ADMIN_ORIGIN||'')||new URL(request.url).origin!==env.ADMIN_ORIGIN)throw Error('configuration');
 const record=env.ADMIN_PASSWORD_RECORD,secret=env.ADMIN_SESSION_SECRET,user=env.ADMIN_USER;
 if(typeof record!=='string'||!/^pbkdf2-sha256\$100000\$[A-Za-z0-9+/]{22}==\$[A-Za-z0-9+/]{43}=$/.test(record)||typeof secret!=='string'||!/^[A-Za-z0-9+/]{43}=$/.test(secret)||typeof user!=='string'||user.length<3||user.length>100)throw Error('configuration');
 const totp=base32(env.ADMIN_TOTP_SECRET);
 // Changing any credential or the revocation secret immediately invalidates all sessions.
 const credential=await sha(record+'|'+env.ADMIN_TOTP_SECRET+'|'+secret+'|'+user);
 return {record,totp,user,credential};
}
export async function totpCode(secret,counter) {
 const raw=typeof secret==='string'?base32(secret):secret,bytes=new Uint8Array(8);let n=BigInt(counter);
 for(let i=7;i>=0;i--){bytes[i]=Number(n&255n);n>>=8n;}
 const key=await crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-1'},false,['sign']);
 const result=new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes)),o=result[19]&15;
 return String((((result[o]&127)<<24)|(result[o+1]<<16)|(result[o+2]<<8)|result[o+3])%1000000).padStart(6,'0');
}
const statement=(db,sql,...args)=>db.prepare(sql).bind(...args);
function cookieToken(request) {const matches=(request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).filter(s=>s.startsWith(COOKIE+'='));if(matches.length!==1)return null;const value=matches[0].slice(COOKIE.length+1);return /^[A-Za-z0-9_-]{43}$/.test(value)?value:null;}
export async function authorizeLocal(request,env) {
 const cfg=await config(env,request),token=cookieToken(request);if(!token)throw Error('unauthorized');
 const row=await statement(env.DB,'SELECT csrf,expires_at FROM admin_sessions WHERE token_hash=? AND credential_id=?',await sha(token),cfg.credential).first();
 if(!row||row.expires_at<=Date.now())throw Error('unauthorized');
 return {sub:'local:'+cfg.credential,csrf:row.csrf,local:true};
}
export function requireLocalMutation(request,env,actor) {
 if(request.headers.get('Origin')!==env.ADMIN_ORIGIN||request.headers.get('X-UWK-Admin')!=='1'||!equal(request.headers.get('X-UWK-CSRF'),actor.csrf))throw Error('unauthorized');
}
async function body(request) {
 if(request.headers.get('Content-Type')!=='application/json')throw Error('input');
 const reader=request.body?.getReader();if(!reader)throw Error('input');const chunks=[];let length=0;
 while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>2048){await reader.cancel();throw Error('size');}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!data||Array.isArray(data)||typeof data!=='object')throw Error();return data;}catch{throw Error('input');}
}
export async function localAuthRoute(request,env) {
 if(env.ADMIN_AUTH_MODE!=='local')return null;
 const url=new URL(request.url),path=url.pathname;
 if(['/login','/login.html','/login.js','/admin.css','/admin-i18n.js'].includes(path)&&['GET','HEAD'].includes(request.method)) {
  // Static login assets contain no credentials or administrative data.
  if(url.origin!==env.ADMIN_ORIGIN)throw Error('configuration');
  // Use the canonical URL. ASSETS redirects /login.html to /login by default;
  // rewriting /login back to /login.html would redirect to itself forever.
  return env.ASSETS.fetch(request);
 }
 if(path!=='/auth/login'&&path!=='/api/logout')return null;
 if(request.method!=='POST')return json({error:'method'},405);
 const cfg=await config(env,request);
 if(request.headers.get('Origin')!==env.ADMIN_ORIGIN||request.headers.get('X-UWK-Admin')!=='1')return json({error:'origin'},403);
 if(path==='/api/logout') {
  const actor=await authorizeLocal(request,env);requireLocalMutation(request,env,actor);
  await env.DB.batch([statement(env.DB,'DELETE FROM admin_sessions WHERE token_hash=?',await sha(cookieToken(request))),statement(env.DB,'INSERT INTO admin_auth_events(action,created_at) VALUES(?,?)','logout',Date.now())]);
  return json({ok:true},200,{'Set-Cookie':COOKIE+'=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'});
 }
 const now=Date.now(),ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const buckets=[['ip:'+await sha(ip),10],['global',50]];
 const counts=await env.DB.batch(buckets.map(([bucket])=>statement(env.DB,`INSERT INTO admin_login_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count`,bucket,now+WINDOW_MS,now,now)));
 if(counts.some((r,i)=>(r.results?.[0]?.count??Infinity)>buckets[i][1]))return json({error:'login_rate'},429,{'Retry-After':'900'});
 const data=await body(request);
 if(typeof data.user!=='string'||data.user.length>100||typeof data.password!=='string'||data.password.length<1||data.password.length>256||typeof data.code!=='string'||!/^\d{6}$/.test(data.code))return json({error:'login_failed'},401);
 // Always do the password derivation before comparing the supplied username.
 const parts=cfg.record.split('$'),key=await crypto.subtle.importKey('raw',enc.encode(data.password),'PBKDF2',false,['deriveBits']);
 const derived=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:un64(parts[2]),iterations:100000},key,256);
 let counter=-1,current=Math.floor(now/30000);for(const c of [current-1,current,current+1])if(equal(await totpCode(cfg.totp,c),data.code))counter=Math.max(counter,c);
 if(!equal(b64(new Uint8Array(derived)),parts[3])||!equal(data.user,cfg.user)||counter<0)return json({error:'login_failed'},401);
 await statement(env.DB,'INSERT INTO admin_auth_state(credential_id,last_counter) VALUES(?,-1) ON CONFLICT(credential_id) DO NOTHING',cfg.credential).run();
 const accepted=await statement(env.DB,'UPDATE admin_auth_state SET last_counter=? WHERE credential_id=? AND last_counter<? RETURNING last_counter',counter,cfg.credential,counter).first();
 if(!accepted)return json({error:'login_failed'},401);
 const token=random(),csrf=random();
 await env.DB.batch([
  statement(env.DB,'DELETE FROM admin_sessions WHERE expires_at<=?',now),
  statement(env.DB,'INSERT INTO admin_sessions(token_hash,credential_id,csrf,created_at,expires_at) VALUES(?,?,?,?,?)',await sha(token),cfg.credential,csrf,now,now+SESSION_MS),
  statement(env.DB,'DELETE FROM admin_login_limits WHERE expires_at<=?',now),
  statement(env.DB,'DELETE FROM admin_auth_events WHERE created_at<?',now-90*86400000),
  statement(env.DB,'INSERT INTO admin_auth_events(action,created_at) VALUES(?,?)','login',now)
 ]);
 return json({ok:true},200,{'Set-Cookie':COOKIE+'='+token+'; Path=/; Max-Age=1800; HttpOnly; Secure; SameSite=Strict'});
}
