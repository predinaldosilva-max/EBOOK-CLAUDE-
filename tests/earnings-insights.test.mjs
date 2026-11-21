import test from 'node:test';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{webcrypto}from'node:crypto';
const require=createRequire(import.meta.url);Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});
const E=require('../usa-work-kit/js/earnings.js'),I=require('../usa-work-kit/js/earnings-insights.js'),T=require('../usa-work-kit/js/earnings-insights-text.js');
const settings=E.settings({fuelPrice:3,wearPerMile:.1,minHourly:30,dailyGoal:300}),now='2026-11-21T16:00:00Z',options={now,timeZone:'UTC'};
function batch(count,changes={}){return Array.from({length:count},(_,i)=>E.record({id:crypto.randomUUID(),platform:'Instacart',store:'A',total:30,miles:10,minutes:60,waiting:15,at:'2026-11-17T18:00:00Z',timeZone:'UTC',...changes},settings));}
const find=(rows,type)=>I.analyze(rows,settings,options).find(i=>i.type===type);
for(let round=1;round<=3;round++)test(`insight ${round}: all types, sample limits, weighted rates, cost snapshots and no mutations`,()=>{
 const rows=[...batch(10),...batch(10,{platform:'DoorDash',store:'B',total:18,minutes:30,waiting:0,at:'2026-11-21T12:00:00Z'}),...batch(10,{total:20,at:'2026-11-10T18:00:00Z'})],before=JSON.stringify(rows),results=I.analyze(rows,settings,options),types=results.map(r=>r.type);
 for(const type of ['windows','platform','waiting','belowMinimum','goal','trend','costs'])assert.ok(types.includes(type),type);
 assert.equal(JSON.stringify(rows),before);assert.equal(I.generate(rows,settings,options).length,3);assert.ok(results.every(r=>r.source==='personal-records'&&r.guaranteed===false));
 const platform=find(rows,'platform');assert.equal(platform.params.best,'DoorDash');assert.ok(platform.numbers.percent>0);
 const waiting=find(rows,'waiting');assert.equal(waiting.numbers.minutes,15);assert.equal(waiting.numbers.count,20);
 const current=rows.filter(r=>r.localDate>='2026-11-16'),cost=find(rows,'costs');assert.ok(Math.abs(cost.numbers.percent-(current.reduce((n,r)=>n+r.fuel+r.wear,0)/current.reduce((n,r)=>n+r.gross,0))*100)<1e-9);
 assert.ok(find(rows,'belowMinimum').numbers.sample<=20);
 for(const lang of ['pt','es','en'])for(const result of results){const text=T.format(result,lang);assert.ok(text.endsWith(T.TEXT[lang].based));assert.ok(!/\{\w+\}/.test(text));if(['windows','platform','waiting','belowMinimum'].includes(result.type))assert.ok(text.includes('/h'));}
});
test('few orders never produce strong window/store/platform claims; unknown wait is not zero',()=>{
 assert.equal(I.generate(batch(9),settings,options)[0].numbers.needed,1);const rows=[...batch(9),...batch(1,{waiting:0,waitKnown:false})];assert.equal(find(rows,'waiting'),undefined);assert.equal(find(rows,'windows'),undefined);assert.equal(find(rows,'platform'),undefined);
 assert.equal(find(batch(10,{waiting:0,waitKnown:false}),'waiting'),undefined);
});
test('window recommendations do not mix time zones or recommend an elapsed window',()=>{
 const rows=[...batch(10,{at:'2026-11-21T12:00:00Z'}),...batch(10,{at:'2026-11-14T18:00:00Z'}),...batch(10,{timeZone:'America/New_York'})];
 const goal=find(rows,'goal');assert.equal(goal.params.window.start,18);assert.equal(goal.params.timeZone,'UTC');
 const foreign=I.analyze(rows,settings,{...options,timeZone:'Pacific/Honolulu'});assert.equal(foreign.some(i=>['goal','windows','trend','costs'].includes(i.type)),false);
});
test('gross includes tip once; settings changes never reprice historical orders',()=>{
 const rows=batch(10,{total:30,tip:100});assert.equal(rows[0].gross,30);const a=find(rows,'costs'),b=I.analyze(rows,{...settings,fuelPrice:100,wearPerMile:100},options).find(r=>r.type==='costs');assert.deepEqual(a,b);
 const untouched=JSON.stringify(rows);I.generate(rows,settings,options);assert.equal(JSON.stringify(rows),untouched);
});
test('invalid records, future-only samples, zero/negative comparison baselines and DST remain safe',()=>{
 assert.throws(()=>I.generate([{net:100}],settings,options));assert.equal(I.generate(batch(10,{at:'2026-12-01T18:00Z'}),settings,options)[0].numbers.needed,10);
 const rows=[...batch(10,{total:0}),...batch(10,{platform:'DoorDash'})];assert.equal(find(rows,'platform'),undefined);
 assert.doesNotThrow(()=>I.generate(batch(10,{timeZone:'America/New_York',at:'2026-11-01T06:30Z'}),settings,{now:'2026-11-02T12:00Z',timeZone:'America/New_York'}));
 assert.throws(()=>I.generate([],settings,{now:'invalid'}));
});
test('10,000 frozen observations remain local, unchanged and limited to three derived cards',()=>{
 const base=batch(1)[0],rows=Object.freeze(Array.from({length:10000},(_,i)=>Object.freeze({...base,id:'fixture-'+i}))),start=performance.now(),out=I.generate(rows,settings,options);assert.ok(out.length<=3);assert.equal(rows.length,10000);assert.equal(rows[0].net,base.net);assert.ok(out.every(i=>!Object.hasOwn(i,'records')));console.log('insight 10k-record generation: '+Math.round(performance.now()-start)+' ms');
});
