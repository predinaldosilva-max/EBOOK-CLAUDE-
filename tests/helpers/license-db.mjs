import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';
export const schema=readFileSync(new URL('../../schema.sql',import.meta.url),'utf8'),migration=readFileSync(new URL('../../migrations/0001_temporary_licenses.sql',import.meta.url),'utf8');
export class DB{
 constructor(migrate=true){this.db=new DatabaseSync(':memory:');this.db.exec(schema);if(migrate)this.db.exec(migration);}
 prepare(sql){const db=this.db;let values=[];return {bind(...v){values=v;return this;},async first(){return db.prepare(sql).get(...values)||null;},async run(){return {results:db.prepare(sql).all(...values)};},async all(){return {results:db.prepare(sql).all(...values)};}};}
 async batch(statements){this.db.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());this.db.exec('COMMIT');return r;}catch(e){this.db.exec('ROLLBACK');throw e;}}
}
