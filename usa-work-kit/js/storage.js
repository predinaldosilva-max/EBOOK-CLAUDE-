(function(root){'use strict';
let KEY='usa-work-kit-v1';const LEGACY='usa-work-kit-v1';const blank=()=>({version:1,lang:'pt',drafts:{},incomes:[],expenses:[]});
const isText=(v,max=500)=>typeof v==='string'&&v.length<=max;
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T12:00:00Z'))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
const num=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1e12;
function validate(s){
 if(!s||s.version!==1||!['pt','es','en'].includes(s.lang)||!Array.isArray(s.incomes)||!Array.isArray(s.expenses)||s.incomes.length+s.expenses.length>20000)throw Error('backupInvalid');
 const ids=new Set();for(const r of [...s.incomes,...s.expenses]){if(!r||!isText(r.id,100)||!r.id.trim()||ids.has(r.id)||!date(r.date)||!isText(r.name,160)||!r.name.trim()||!num(r.amount))throw Error('backupInvalid');ids.add(r.id);}
 for(const r of s.incomes)if(!['delivery','work'].includes(r.kind)||!num(r.cost)||!num(r.hours))throw Error('backupInvalid');
 for(const r of s.expenses)if(!Number.isInteger(r.category)||r.category<0||r.category>9||!['personal','business'].includes(r.scope)||typeof r.paid!=='boolean')throw Error('backupInvalid');
 if(!s.drafts||typeof s.drafts!=='object'||Array.isArray(s.drafts))throw Error('backupInvalid');
 // Allow only plain, shallow form values. Never merge imported keys into prototypes.
 const drafts={};for(const [k,v]of Object.entries(s.drafts)){if(!['delivery','work','goals','pricing','messages','expenses'].includes(k))throw Error('backupInvalid');if(!v||typeof v!=='object'||Array.isArray(v))throw Error('backupInvalid');drafts[k]={};for(const [a,b]of Object.entries(v)){if(!/^[a-zA-Z][a-zA-Z0-9]{0,30}$/.test(a)||['constructor','prototype','__proto__'].includes(a)||!isText(b,2000))throw Error('backupInvalid');drafts[k][a]=b;}}
 return {version:1,lang:s.lang,drafts,incomes:s.incomes.map(r=>({id:r.id,date:r.date,name:r.name,amount:r.amount,cost:r.cost,hours:r.hours,kind:r.kind})),expenses:s.expenses.map(r=>({id:r.id,date:r.date,name:r.name,amount:r.amount,category:r.category,scope:r.scope,paid:r.paid}))};
}
const S={blank,validate,date,error:null,key:()=>KEY,setOwner(owner){if(typeof owner!=='string'||!owner||owner.length>200)throw Error('owner');KEY='usa-work-kit-finance-v2:'+encodeURIComponent(owner);S.error=null;},legacy(){try{const raw=localStorage.getItem(LEGACY);return raw?validate(JSON.parse(raw)):null;}catch{throw Error('backupInvalid');}},claimLegacy(){const current=localStorage.getItem(KEY);if(KEY===LEGACY)throw Error('claimConflict');if(current){const saved=validate(JSON.parse(current));if(saved.incomes.length||saved.expenses.length||Object.keys(saved.drafts).length)throw Error('claimConflict');}const old=S.legacy();if(!old)throw Error('backupInvalid');if(!S.save(old))throw Error('storageError');return old;},load(){try{const raw=localStorage.getItem(KEY);return raw?validate(JSON.parse(raw)):blank();}catch(e){S.error='storageRead';return blank();}},save(s){try{const data=JSON.stringify(validate(s));if(new Blob([data]).size>5*1024*1024)throw Error('backupInvalid');localStorage.setItem(KEY,data);S.error=null;return true;}catch(e){S.error='storageError';return false;}},id(){return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}};
root.Store=S;if(typeof module!=='undefined')module.exports=S;
})(typeof window!=='undefined'?window:globalThis);
