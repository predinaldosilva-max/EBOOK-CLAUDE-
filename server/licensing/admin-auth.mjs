const decoder=new TextDecoder(),encoder=new TextEncoder(),cache=new Map();
function bytes(s){if(typeof s!=='string'||!/^[A-Za-z0-9_-]+$/.test(s))throw Error('unauthorized');return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
export async function authorize(request,env){
 const issuer=env.ACCESS_TEAM_DOMAIN,aud=env.ACCESS_AUD,allowed=String(env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer||'')||typeof aud!=='string'||!aud||!allowed.length||!env.ADMIN_ORIGIN||new URL(request.url).origin!==env.ADMIN_ORIGIN)throw Error('configuration');
 const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token||token.length>16000)throw Error('unauthorized');
 const parts=token.split('.');if(parts.length!==3)throw Error('unauthorized');let header,payload;
 try{header=JSON.parse(decoder.decode(bytes(parts[0])));payload=JSON.parse(decoder.decode(bytes(parts[1])));}catch{throw Error('unauthorized');}
 const time=Math.floor(Date.now()/1000);
 if(header.alg!=='RS256'||typeof header.kid!=='string'||header.kid.length>128||payload.iss!==issuer||!Array.isArray(payload.aud)||!payload.aud.includes(aud)||!Number.isFinite(payload.exp)||payload.exp<=time||!Number.isFinite(payload.iat)||payload.iat>time+30||payload.nbf!==undefined&&(!Number.isFinite(payload.nbf)||payload.nbf>time)||typeof payload.email!=='string'||typeof payload.sub!=='string'||!payload.sub||!allowed.includes(payload.email.toLowerCase()))throw Error('unauthorized');
 let entry=cache.get(issuer);if(!entry||entry.until<=Date.now()){
  const r=await fetch(issuer+'/cdn-cgi/access/certs',{redirect:'manual',signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('unauthorized');const raw=await r.text();if(raw.length>100000)throw Error('unauthorized');const data=JSON.parse(raw);if(!Array.isArray(data.keys)||data.keys.length>20)throw Error('unauthorized');entry={keys:data.keys,until:Date.now()+300000};cache.set(issuer,entry);
 }
 const jwk=entry.keys.find(k=>k.kid===header.kid&&k.kty==='RSA'&&(!k.alg||k.alg==='RS256'));if(!jwk)throw Error('unauthorized');
 try{const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,bytes(parts[2]),encoder.encode(parts[0]+'.'+parts[1])))throw Error();}catch{throw Error('unauthorized');}
 return {email:payload.email.toLowerCase(),sub:payload.sub};
}
