import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DB} from './helpers/license-db.mjs';
test('dashboard migration keeps a private baseline, compares all original values, and never overwrites its baseline on repeated execution',()=>{
 const db=new DB(false),sql=readFileSync(new URL('../docs/licensing/FINALIZAR-BANCO.sql',import.meta.url),'utf8');
 for(let i=1;i<=50;i++) db.db.prepare('INSERT INTO licenses(id,password_hash,is_test,generation,installation_hash,activated_at) VALUES(?,?,?,?,?,?)').run(String(i).padStart(3,'0'),'fixture-hash-'+i,i===1?1:0,i%4,i===2?'fixture-install':null,i===2?12345:null);
 const original=db.db.prepare('SELECT * FROM licenses ORDER BY id').all();db.db.exec(sql);db.db.exec(sql);
 assert.deepEqual(db.db.prepare('SELECT * FROM licenses ORDER BY id').all(),original);
 assert.deepEqual(db.db.prepare('SELECT * FROM uwk_legacy_before_30days_20261121 ORDER BY id').all(),original);
 const comparison='SELECT COUNT(*) n FROM (SELECT * FROM uwk_legacy_before_30days_20261121 EXCEPT SELECT * FROM licenses)';
 assert.equal(db.db.prepare(comparison).get().n,0);
 db.db.prepare("UPDATE licenses SET generation=generation+1 WHERE id='002'").run();db.db.exec(sql);
 assert.equal(db.db.prepare(comparison).get().n,1);
 assert.equal(db.db.prepare("SELECT generation FROM uwk_legacy_before_30days_20261121 WHERE id='002'").get().generation,2);
 db.db.close();
});
