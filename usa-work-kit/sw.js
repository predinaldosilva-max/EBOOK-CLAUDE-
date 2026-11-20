/* Same-origin static assets only. No analytics, APIs or record uploads. */
const CACHE='usa-work-kit-v2.2.5-r2';
const FILES=['./','./index.html','./css/style.css','./js/app.js','./js/protection-i18n.js','./js/protection-daily-i18n.js','./js/protection-preventive.js','./js/protection-daily-ui.js','./js/earnings.js','./js/earnings-ui.js','./js/v22-i18n.js','./css/tokens.css','./assets/brand-original.jpeg','./js/vault.js','./js/protection-ui.js','./js/protection-reports.js','./js/vendor/pdf-lib.min.js','./js/vendor/fontkit.umd.min.js','./js/vendor/fflate.js','./assets/DejaVuSans.ttf','./js/calculators.js','./js/storage.js','./js/reports.js','./js/translations.js','./assets/icon.svg','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest'];
// A cached /index.html may have followed the host's redirect to /. Safari
// refuses that Response for a navigation whose redirect mode is manual.
// Rebuild only successful, same-origin HTML responses; retain the bytes and
// headers, not the redirect history. No user storage is read or changed here.
function navigationResponse(response){
 if(!response||!response.redirected)return response;
 if(!response.ok||new URL(response.url).origin!==self.location.origin)return Response.error();
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers:response.headers});
}
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  // Use release-specific network URLs, then store under stable asset URLs.
  // cache:'reload' alone cannot bypass an older worker's Cache API response.
  // Do not activate until every required asset has been fetched successfully.
  await Promise.all(FILES.map(async file=>{
   const url=new URL(file,self.registration.scope);
   url.searchParams.set('__uwk_release',CACHE);
   const response=await fetch(new Request(url,{cache:'reload',redirect:'follow'}));
   if(!response.ok)throw Error('Static asset unavailable');
   await cache.put(file,(file==='./'||file==='./index.html')?navigationResponse(response):response);
  }));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('usa-work-kit-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(url.pathname.startsWith('/api/'))return;
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(event.request);
  if(hit)return event.request.mode==='navigate'?navigationResponse(hit):hit;
  try{
   const response=await fetch(event.request);
   return event.request.mode==='navigate'?navigationResponse(response):response;
  }catch{
   if(event.request.mode==='navigate')return navigationResponse(await cache.match('./index.html'))||Response.error();
   return Response.error();
  }
 })());
});
