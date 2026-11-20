const assert=require('node:assert/strict');
const fs=require('node:fs');
const s=fs.readFileSync(require('node:path').join(__dirname,'../js/app.js'),'utf8');
assert.ok(!s.includes('Disponível somente no celular'));
assert.ok(s.includes("accessRequest('validate'"));
assert.ok(s.includes("accessRequest('activate'"));
console.log('PASS desktop and mobile share server activation and validation; no phone-only gate');
