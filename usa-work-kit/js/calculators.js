/* Pure calculation functions. USD, miles and hours. No network or dependencies. */
(function(root){
'use strict';
function number(v,positive=false){if(v===''||v===null||v===undefined||typeof v==='boolean')throw Error('invalid');const n=Number(v);if(!Number.isFinite(n)||n<0||n>1e9||(positive&&n===0))throw Error('invalid');return n;}
function checked(o){if(Object.values(o).some(v=>typeof v==='number'&&(!Number.isFinite(v)||Math.abs(v)>1e12)))throw Error('invalid');return o;}
const C={number,
 delivery(d){const gross=number(d.offer)+number(d.tip),cost=number(d.miles)*number(d.cost),hours=(number(d.minutes,true)+number(d.wait))/60;return checked({gross,cost,net:gross-cost,hourly:(gross-cost)/hours,perMile:number(d.miles)>0?gross/number(d.miles):null,hours});},
 work(d){const rate=number(d.rate),hours=number(d.hours,true),days=number(d.days,true),quantity=number(d.quantity,true),expense=number(d.expense),weekDays=number(d.weekDays,true);if(days>366||weekDays>7)throw Error('invalid');const factors={hour:hours,day:days,service:quantity,week:1,project:1};if(!(d.mode in factors))throw Error('invalid');const gross=rate*factors[d.mode],net=gross-expense,weekly=net/days*weekDays;return checked({gross,cost:expense,net,hourly:net/hours,weekly,monthly:weekly*52/12,hours});},
 goals(d){const target=number(d.target,true),received=number(d.received),days=number(d.days),hours=number(d.hours),hourly=number(d.hourly),remaining=Math.max(0,target-received);if(days>7)throw Error('invalid');return checked({remaining,daily:days>0?remaining/days:null,neededHours:hourly>0?remaining/hourly:(remaining===0?0:null),progress:received/target*100,projected:received+hours*hourly,possible:received+hours*hourly>=target});},
 pricing(d){const labor=number(d.hours,true)*number(d.rate),cost=labor+number(d.material)+number(d.transport)+number(d.other),margin=number(d.margin);if(margin>=100)throw Error('invalidMargin');const price=cost/(1-margin/100);return checked({labor,cost,price,profit:price-cost,margin});}
};root.Calc=C;if(typeof module!=='undefined')module.exports=C;
})(typeof window!=='undefined'?window:globalThis);
