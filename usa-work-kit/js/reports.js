/* Escaping is applied at every HTML/CSV boundary. */
window.Reports={
 escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
 csv(rows){return '\uFEFF'+rows.map(row=>row.map(v=>{let s=String(v??'');if(typeof v!=='number'&&/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');},
 download(name,data,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);},
 totals(state,from,to){const incomes=state.incomes.filter(r=>r.date>=from&&r.date<=to),expenses=state.expenses.filter(r=>r.date>=from&&r.date<=to),sum=(a,k)=>a.reduce((s,r)=>s+r[k],0);const gross=sum(incomes,'amount'),cost=sum(incomes,'cost'),extra=sum(expenses,'amount');return {incomes,expenses,gross,cost,extra,net:gross-cost-extra};},
 print(html){document.getElementById('printArea').innerHTML=html;window.print();}
};
