/* Access timing only. No record writes, vault encryption or platform access. */
(function(root){'use strict';
class Lease{
 constructor({clock=()=>performance.now(),schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),onDue}){this.clock=clock;this.schedule=schedule;this.cancel=cancel;this.onDue=onDue;this.timer=null;this.deadline=null;this.expiration=null;}
 accept(grant,requestStarted){this.stop();if(grant.kind!=='temporary')return;if(!Number.isSafeInteger(grant.serverTime)||!Number.isSafeInteger(grant.expiresAt)||!Number.isFinite(grant.leaseMs)||grant.leaseMs<=0||grant.leaseMs>300000||grant.expiresAt<=grant.serverTime||typeof grant.owner!=='string'||!grant.owner||!Number.isFinite(requestStarted))throw Error('configuration');this.expiration=requestStarted+(grant.expiresAt-grant.serverTime);this.deadline=Math.min(requestStarted+grant.leaseMs,this.expiration);this.timer=this.schedule(()=>this.check(),Math.max(0,this.deadline-this.clock()));}
 check(){if(this.deadline===null)return false;if(this.clock()>=this.deadline){const expired=this.clock()>=this.expiration;this.stop();this.onDue(expired?'expired':'validate');return true;}return false;}
 stop(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;this.deadline=null;this.expiration=null;}
}
root.LicenseAccess={Lease};if(typeof module!=='undefined')module.exports=root.LicenseAccess;
})(typeof window!=='undefined'?window:globalThis);
