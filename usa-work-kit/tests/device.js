const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/app.js'),'utf8');
const definition=source.slice(source.indexOf('function isPhone('),source.indexOf('if(!isPhone('));
const ctx={};vm.createContext(ctx);vm.runInContext(definition,ctx);
const cases=[
 ['iPhone Safari','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',true],
 ['iPhone Chrome','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) CriOS/130.0 Mobile/15E148 Safari/604.1',true],
 ['Android Chrome','Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36',true],
 ['Samsung Internet','Mozilla/5.0 (Linux; Android 14; SM-S921B) SamsungBrowser/26.0 Chrome/122.0 Mobile Safari/537.36',true],
 ['Windows Chrome','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',false],
 ['Mac Safari','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',false],
 ['Linux Firefox','Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',false],
 ['iPad','Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1',false],
 ['Android tablet','Mozilla/5.0 (Linux; Android 14; SM-X700) Chrome/130.0 Safari/537.36',false],
 ['Unknown','',false]
];
for(const [name,ua,expected] of cases){assert.equal(ctx.isPhone(ua),expected,name);console.log('PASS '+name);}
let accessed=false;const host={innerHTML:''};const desktop={navigator:{userAgent:cases[4][1]},document:{getElementById:id=>{assert.equal(id,'app');return host;}},get Store(){accessed=true;throw Error('Storage must not be loaded');}};
vm.runInNewContext(source,desktop);assert.equal(accessed,false);assert.ok(host.innerHTML.includes('Disponível somente no celular'));assert.ok(host.innerHTML.includes('Disponible solo en el celular'));console.log('PASS Desktop exits before storage and app initialization');
console.log('11 device checks passed');
