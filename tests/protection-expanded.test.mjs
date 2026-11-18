import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});
const P=require('../usa-work-kit/js/vault.js');
globalThis.PDFLib=require('pdf-lib');globalThis.fontkit=require('@pdf-lib/fontkit');globalThis.fflate=require('fflate');
const R=require('../usa-work-kit/js/protection-reports.js');
globalThis.fetch=async()=>({arrayBuffer:async()=>readFileSync(new URL('../usa-work-kit/assets/DejaVuSans.ttf',import.meta.url))});
const record=(extra={})=>({platform:'Instacart',type:'tip',occurredAt:'2026-11-18T13:20',timeZone:'America/New_York',description:'Gorjeta reduzida. Não sei o motivo. Español: revisión.',place:'Store A',order:'order-123',...extra});
const file=()=>new File([new Uint8Array([137,80,78,71,13,10,26,10,1,2,3])],'original.png',{type:'image/png'});
beforeEach(()=>{globalThis.indexedDB=new IDBFactory();});

const cases=[
 ['tip','Displayed tip changed; initial and final screenshots were saved. Cause unknown.'],
 ['cancel','Order was cancelled; support contact and cancellation screen saved.'],
 ['customer','Customer instructions conflicted with displayed address; saved support messages.'],
 ['store','Requested item unavailable; recorded stock issue and substitution instructions.'],
 ['technical','App displayed an error; recorded error time and support reference.'],
 ['delivery','Customer reported non-delivery; saved my delivery photo and reported drop-off time.'],
 ['accusation','Received an allegation; recorded the exact notice without asserting its cause.'],
 ['accident','Safety incident reported; recorded facts observed and support contact.'],
 ['deactivation','Access disabled; saved platform notice and stated appeal instructions.'],
 ['other','Unusual delay at store; recorded start and end times as reported.']
];
const pngBytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf1cAAAAASUVORK5CYII=','base64');
function wav(){const b=Buffer.alloc(44+1600);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(8000,24);b.writeUInt32LE(16000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(1600,40);return b;}
const output=process.env.UWK_QA_OUTPUT;
test('20 fictitious Instacart/DoorDash incident scenarios: originals, audit history, private selection, three PDF/ZIP languages and manual device recovery',async()=>{
 const a=new P.Vault('QA-CUSTOMER-A'),key=await a.create();const originalPDF=await PDFLib.PDFDocument.create();originalPDF.addPage();const pdfBytes=await originalPDF.save();
 for(const platform of ['Instacart','DoorDash'])for(const [i,[type,description]] of cases.entries()){
  const originals=[new File([pngBytes],`FICTITIOUS-${type}.png`,{type:'image/png'}),new File([wav()],'FICTITIOUS-note.wav',{type:'audio/wav'}),new File([pdfBytes],'FICTITIOUS-notice.pdf',{type:'application/pdf'})];
  const id=await a.saveRecord(record({platform,type,description:'FICTITIOUS '+description,order:'QA-ORDER-'+platform+'-'+i,occurredAt:`2026-11-${String(i+1).padStart(2,'0')}T14:30`,location:{authorized:true,latitude:25.7617,longitude:-80.1918,accuracy:80,capturedAt:'2026-11-18T14:30:00Z'}}),null,originals);
  const saved=a.snapshot().records.find(r=>r.id===id),attachments=saved.revisions[0].data.attachments;
  await a.saveRecord({...saved.revisions[0].data,description:'FICTITIOUS correction: '+description},id);
  const d=a.snapshot(),revised=d.records.find(r=>r.id===id);assert.equal(revised.revisions.length,2);assert.equal(revised.revisions[0].data.description,'FICTITIOUS '+description);
  for(const [j,fid]of attachments.entries()){assert.equal(d.files[fid].sha256,await P.hash(await originals[j].arrayBuffer()));assert.deepEqual(Buffer.from(P.unb64(d.files[fid].bytes)),Buffer.from(await originals[j].arrayBuffer()));}
 }
 assert.equal(a.snapshot().records.length,20);const d=a.snapshot(),ids=d.records.slice(0,2).map(r=>r.id),fid=d.records[0].revisions.at(-1).data.attachments[0],sel=R.selected(d,ids,[fid]);
 for(const l of ['pt','es','en']){const draft=R.template(l,'Instacart','FICTITIOUS: notice of disputed delivery; reason supplied by user'),body=R.body(l,draft,sel);assert.ok(body.includes(d.records[0].revisions.at(-1).data.description));assert.ok(!body.includes('QA-ORDER-DoorDash'));assert.ok(!body.includes('FICTITIOUS-note.wav'));assert.ok(!/guaranteed|garantido|garantizado/i.test(draft));
  const pdf=await R.pdf(l,draft,sel),loaded=await PDFLib.PDFDocument.load(pdf);assert.ok(loaded.getPageCount()>=1);const zip=await R.pack(l,draft,sel),z=fflate.unzipSync(zip);assert.equal(Object.keys(z).filter(k=>k.startsWith('originals/')).length,1);assert.deepEqual(Buffer.from(Object.values(z).find((_,i)=>Object.keys(z)[i].startsWith('originals/'))),pngBytes);const manifest=JSON.parse(fflate.strFromU8(z['manifest.json']));assert.equal(manifest.unverified,true);assert.equal(manifest.files.length,1);assert.equal(manifest.records.length,2);
  if(output){mkdirSync(output,{recursive:true});writeFileSync(output+'/FICTITIOUS-appeal-'+l+'.pdf',pdf);writeFileSync(output+'/FICTITIOUS-evidence-'+l+'.zip',zip);}
 }
 const all=R.selected(d,d.records.map(r=>r.id),[]);assert.ok((await PDFLib.PDFDocument.load(await R.pdf('en',R.template('en','DoorDash','FICTITIOUS notice'),all))).getPageCount()>=2);
 const backup=await a.exportBackup(),expected=a.snapshot();a.lock();globalThis.indexedDB=new IDBFactory();const fresh=new P.Vault('QA-CUSTOMER-A');await fresh.importBackup(backup,key);assert.deepEqual(fresh.snapshot(),expected);await assert.rejects(new P.Vault('QA-CUSTOMER-B').importBackup(backup,key),/invalidBackup/);const bad=JSON.parse(backup);bad.owner='QA-CUSTOMER-B';await assert.rejects(new P.Vault('QA-CUSTOMER-B').importBackup(JSON.stringify(bad),key));
 await fresh.deleteRecord(ids[0]);assert.equal(fresh.snapshot().records.length,19);assert.equal(Object.keys(fresh.snapshot().files).length,57);await fresh.remove();assert.equal(await fresh.exists(),false);
});
test('limits: 200 incidents, 100 revisions, 20 attachments and atomic refusal of overflow',async()=>{
 const a=new P.Vault('QA-LIMITS');await a.create();for(let i=0;i<200;i++)await a.saveRecord(record({order:'QA-'+i}));await assert.rejects(a.saveRecord(record()),/quota/);assert.equal(a.snapshot().records.length,200);
 const id=a.snapshot().records[0].id;for(let i=1;i<100;i++)await a.saveRecord(record({description:'revision '+i}),id);await assert.rejects(a.saveRecord(record(),id),/quota/);assert.equal(a.snapshot().records[0].revisions.length,100);
 const b=new P.Vault('QA-ATTACHMENTS');await b.create();await assert.rejects(b.saveRecord(record(),null,Array.from({length:21},()=>new File([pngBytes],'a.png'))),/invalidRecord/);assert.equal(Object.keys(b.snapshot().files).length,0);await b.saveRecord(record(),null,Array.from({length:20},()=>new File([pngBytes],'a.png')));assert.equal(Object.keys(b.snapshot().files).length,20);
});
test('20 MiB raw attachment limit, 5 MiB per file and rejection preserve last valid state',async()=>{
 const a=new P.Vault('QA-SIZE');await a.create();const bytes=new Uint8Array(P.MAX_FILE);bytes.set(pngBytes);const file=new File([bytes],'large-synthetic.png');for(let i=0;i<4;i++)await a.saveRecord(record(),null,[file]);assert.equal(Object.keys(a.snapshot().files).length,4);await assert.rejects(a.saveRecord(record(),null,[new File([pngBytes],'extra.png')]),/quota/);assert.equal(a.snapshot().records.length,4);await assert.rejects(a.saveRecord(record(),null,[new File([new Uint8Array(P.MAX_FILE+1)],'oversize.png')]),/fileSize/);assert.equal(a.snapshot().records.length,4);
});
test('date/GPS bounds, executable file formats, empty appeal reason and unrelated evidence rejected',async()=>{
 const a=new P.Vault('QA-INVALID');await a.create();for(const extra of [{occurredAt:'2026-02-30T14:30'},{occurredAt:'2026-11-18T99:00'},{location:{authorized:true,latitude:91,longitude:0,accuracy:1,capturedAt:'2026-11-18T14:30Z'}},{description:'x'.repeat(10001)}])await assert.rejects(a.saveRecord(record(extra)));
 for(const content of ['<html><script>alert(1)</script></html>','<svg onload="bad()"/>','#!/bin/sh'])await assert.rejects(a.saveRecord(record(),null,[new File([content],'fake.png',{type:'image/png'})]),/fileType/);
 for(const l of ['pt','es','en'])assert.throws(()=>R.template(l,'DoorDash',''),/invalidRecord/);assert.equal(a.snapshot().records.length,0);
});
