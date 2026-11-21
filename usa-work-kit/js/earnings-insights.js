/* Derived personal insights only. No network, storage writes or external AI. */
(function(root){'use strict';
const E=root.Earnings||(typeof require==='function'?require('./earnings.js'):null);
const LIMITS=Object.freeze({total:10,window:10,platform:10,storeWait:10,week:5,recent:5,recentSize:20,maxCards:3,highWaitMinutes:10,minPlatformDifference:5});
const sum=(rows,key)=>rows.reduce((n,r)=>n+r[key],0),hourly=rows=>sum(rows,'net')*60/sum(rows,'minutes');
function groups(rows,key){const map=new Map();for(const r of rows){const k=key(r);if(!map.has(k))map.set(k,[]);map.get(k).push(r);}return [...map.values()];}
function day(date,zone){const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return {date:p.year+'-'+p.month+'-'+p.day,hour:Number(p.hour)};}
const iso=d=>d.toISOString().slice(0,10);
// Store already validates financial snapshots on load/save. Keep this derived
// layer linear and avoid repeating vehicle calculations or per-order Intl work.
function checkRows(records){
 if(!Array.isArray(records)||records.length>10000)throw Error('invalidRecord');const ids=new Set(),zones=new Set();
 for(const r of records){if(!r||typeof r.id!=='string'||ids.has(r.id)||typeof r.at!=='string'||!Number.isFinite(Date.parse(r.at))||typeof r.localDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(r.localDate)||!Number.isInteger(r.weekday)||r.weekday<0||r.weekday>6||!Number.isInteger(r.window)||r.window<0||r.window>21||r.window%3||typeof r.waitKnown!=='boolean')throw Error('invalidRecord');ids.add(r.id);
  for(const k of ['net','gross','minutes','hourly','fuel','wear','waiting'])if(!Number.isFinite(r[k])||Math.abs(r[k])>1e12)throw Error('invalidRecord');
  if(r.minutes<=0||r.gross<0||r.fuel<0||r.wear<0||r.waiting<0||r.waiting>r.minutes)throw Error('invalidRecord');
  for(const k of ['platform','store','region','timeZone'])if(typeof r[k]!=='string'||r[k].length>160||k!=='region'&&!r[k])throw Error('invalidRecord');
  if(!zones.has(r.timeZone)){new Intl.DateTimeFormat('en',{timeZone:r.timeZone});zones.add(r.timeZone);}
 }
}

function analyze(records,config,options={}){
 const settings=E.settings(config);checkRows(records);const now=new Date(options.now??Date.now()),zone=options.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';if(!Number.isFinite(now.getTime()))throw Error('invalidRecord');const local=day(now,zone);
 const rows=records.filter(r=>Date.parse(r.at)<=now).slice().sort((a,b)=>b.at.localeCompare(a.at)||a.id.localeCompare(b.id));
 const make=(type,priority,key,numbers={},params={})=>({type,priority,key,numbers,params,source:'personal-records',guaranteed:false});
 if(rows.length<LIMITS.total)return [make('insufficient',0,'more',{needed:LIMITS.total-rows.length})];
 const out=[],windows=groups(rows.filter(r=>r.timeZone===zone),r=>r.weekday+'|'+r.window).filter(g=>g.length>=LIMITS.window).map(g=>({weekday:g[0].weekday,start:g[0].window,end:g[0].window+3,hourly:hourly(g),count:g.length})).sort((a,b)=>b.hourly-a.hourly||a.weekday-b.weekday||a.start-b.start);
 if(windows.length>=2&&windows[0].hourly>windows.at(-1).hourly){const a=windows[0],b=windows.at(-1);out.push(make('windows',70,'windows',{bestHourly:a.hourly,worstHourly:b.hourly,bestCount:a.count,worstCount:b.count},{best:a,worst:b,timeZone:zone}));}
 const platforms=groups(rows,r=>r.platform).filter(g=>g.length>=LIMITS.platform).map(g=>({platform:g[0].platform,hourly:hourly(g),count:g.length})).sort((a,b)=>b.hourly-a.hourly||a.platform.localeCompare(b.platform));
 if(platforms.length>=2){const a=platforms[0],b=platforms.at(-1);if(b.hourly>0){const percent=(a.hourly/b.hourly-1)*100;if(percent>=LIMITS.minPlatformDifference)out.push(make('platform',65,'platform',{percent,bestHourly:a.hourly,otherHourly:b.hourly,bestCount:a.count,otherCount:b.count},{best:a.platform,other:b.platform}));}}
 const stores=groups(rows.filter(r=>r.waitKnown),r=>JSON.stringify([r.store,r.region])).filter(g=>g.length>=LIMITS.storeWait).map(g=>({store:g[0].store,region:g[0].region,wait:sum(g,'waiting')/g.length,hourly:hourly(g),count:g.length})).filter(g=>g.wait>=LIMITS.highWaitMinutes).sort((a,b)=>b.wait-a.wait||a.store.localeCompare(b.store));
 if(stores.length){const a=stores[0];out.push(make('waiting',80,'waiting',{minutes:a.wait,hourly:a.hourly,count:a.count},{store:a.store,region:a.region}));}
 const recent=rows.slice(0,LIMITS.recentSize),below=recent.filter(r=>r.hourly<settings.minHourly);if(recent.length>=LIMITS.recent&&below.length)out.push(make('belowMinimum',100,'below',{count:below.length,sample:recent.length,minHourly:settings.minHourly,targetGap:below.reduce((s,r)=>s+Math.max(0,settings.minHourly*r.minutes/60-r.net),0)}));
 const date=new Date(local.date+'T00:00Z'),weekday=date.getUTCDay(),week=new Date(date);week.setUTCDate(week.getUTCDate()-((weekday+6)%7));const previous=new Date(week);previous.setUTCDate(previous.getUTCDate()-7);const zoned=rows.filter(r=>r.timeZone===zone),current=zoned.filter(r=>r.localDate>=iso(week)&&r.localDate<=local.date),prior=zoned.filter(r=>r.localDate>=iso(previous)&&r.localDate<iso(week));
 const today=zoned.filter(r=>r.localDate===local.date),remaining=Math.max(0,settings.dailyGoal-sum(today,'net')),available=windows.filter(w=>w.weekday===weekday&&w.end>local.hour);
 if(settings.dailyGoal>0&&remaining>0&&today.length)out.push(make('goal',95,available.length?'goalWindow':'goal',{remaining,count:today.length},available.length?{window:available[0],timeZone:zone}:{}));
 if(current.length>=LIMITS.week&&prior.length>=LIMITS.week){const before=hourly(prior),after=hourly(current);if(before>0&&after!==before){const change=(after/before-1)*100;out.push(make('trend',75,change>0?'trendUp':'trendDown',{percent:Math.abs(change),currentHourly:after,previousHourly:before,currentCount:current.length,previousCount:prior.length}));}}
 if(current.length>=LIMITS.week&&sum(current,'gross')>0){const fuel=sum(current,'fuel'),wear=sum(current,'wear');if(fuel+wear>0)out.push(make('costs',85,'costs',{percent:(fuel+wear)/sum(current,'gross')*100,fuel,wear,gross:sum(current,'gross'),count:current.length}));}
 if(!out.length){const n=Math.max(0,LIMITS.window-Math.max(0,...groups(zoned,r=>r.weekday+'|'+r.window).map(g=>g.length)));out.push(make('insufficient',0,n?'moreWindow':'noContrast',{needed:n}));}
 return out.sort((a,b)=>b.priority-a.priority||a.type.localeCompare(b.type));
}
function generate(records,settings,options={}){return analyze(records,settings,options).slice(0,LIMITS.maxCards);}
const api={LIMITS,analyze,generate};root.EarningsInsights=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
