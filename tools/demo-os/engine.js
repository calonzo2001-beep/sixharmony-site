"use strict";
/* Six Harmony demo OS engine. One book of records (P); every figure on every screen is worked out from it.
   Niche wording and narrative rows come from the pack (K). */
var $ = function(s, el){ return (el||document).querySelector(s); };
var $$ = function(s, el){ return Array.prototype.slice.call((el||document).querySelectorAll(s)); };
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"})[c];}); }
function m0(c){ return "$" + Math.round(c/100).toLocaleString("en-US"); }                 /* cents -> whole dollars */
function m2(c){ return "$" + (c/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function d0(n){ return "$" + Math.round(n).toLocaleString("en-US"); }                    /* dollars */
function pc(n,d){ return n.toFixed(d==null?1:d) + "%"; }
function toast(m){ var t=$('#toast'); t.textContent=m; t.hidden=false; clearTimeout(toast._x); toast._x=setTimeout(function(){t.hidden=true;},2400); }
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
var rnd = mulberry32(K.seed);
function ri(a,b){ return a + Math.floor(rnd()*(b-a+1)); }
function pick(arr){ return arr[Math.floor(rnd()*arr.length)]; }
function wpick(pairs){ var t=0,i; for(i=0;i<pairs.length;i++) t+=pairs[i][1]; var x=rnd()*t; for(i=0;i<pairs.length;i++){ x-=pairs[i][1]; if(x<=0) return pairs[i][0]; } return pairs[pairs.length-1][0]; }
function withSeed(seed, fn){ var save=rnd; rnd=mulberry32(seed); var out=fn(); rnd=save; return out; }

var FIRST=["Ana","Anthony","Ashley","Brianna","Cameron","Courtney","Erin","Francesca","Gabriela","Hannah","James","Jose","Olivia","Morgan","Kevin","Camila","Sophia","Zachary","Austin","Melissa","Ava","Ryan","Joseph","Brian","Emma","Luis","Madison","Allison","Megan","Steven","Paul","Carlos","Evan","Connor","Nathan","Sokha","Shannon","Rafael","Nicholas","Colleen","Gianna","Molly","Marco","Priya","Wei","Dmitri","Fatima","Noor","Elena","Tariq","Ines","Mateo","Lucia","Diego","Rosa","Hector","Marisol","Tomas","Alondra"];
var LAST=["Allen","Garcia","Smith","Johnson","Martinez","Lee","Nguyen","Patel","Brown","Davis","Rodriguez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Perez","Thompson","White","Sanchez","Ramirez","Torres","Flores","Rivera","Gomez","Diaz","Reyes","Cruz","Ortiz","Morales","Gutierrez","Chavez","Ramos","Herrera","Medina","Castillo","Vargas","Soto","Delgado","Pena","Rios","Alvarado","Sandoval","Fuentes","Maldonado","Salazar"];
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], DAYN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
/* demo clock: Tuesday, Nov 17, 2026 */
var NOWLAB="Tue, Nov 17";
var M12=[]; (function(){ for(var i=0;i<12;i++) M12.push(MON[(10-(11-i)+24)%12]); })();          /* Dec … Nov */
function dateOf(m,day){ return new Date(2026,10-m,day); }
function dlab(m,day){ var d=dateOf(m,day); return DAYN[d.getDay()]+", "+MON[d.getMonth()]+" "+d.getDate(); }
function mlab(m,day){ var d=dateOf(m,day); return MON[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear(); }

var T=K.t, L=K.L, LOCS=K.locs, LOC="all";
function locName(){ return LOC==="all" ? T.allLoc : LOC; }

/* ============ the book ============ */
var P=[];
(function gen(){
  var used={};
  for(var i=0;i<K.N;i++){
    var fn=pick(FIRST), ln=pick(LAST), nm, g=0;
    if(K.biz){ nm=pick(LAST)+" "+pick(K.biz); while(used[nm] && g++<30){ nm=pick(LAST)+"-"+pick(LAST)+" "+pick(K.biz); } }
    else { nm=fn+" "+ln; while(used[nm] && g++<30){ ln=pick(LAST)+"-"+pick(LAST); nm=fn+" "+ln; } }
    used[nm]=1;
    var plan=wpick(K.plans.map(function(p){return [p,p[2]];}));
    var status=wpick(K.statusW);
    var monthsIn=ri(0,36);
    var loc=wpick([[LOCS[0],K.locW[0]],[LOCS[1],K.locW[1]]]);
    var src=wpick(K.srcW);
    var cAgo=null, reason=null, pausedM=0, resumeIn=null;
    if(status==="cancelled"){ cAgo=ri(0,11); if(monthsIn<cAgo+1) monthsIn=cAgo+1+ri(0,18); reason=wpick(K.reasons); }
    if(status==="paused"){ pausedM=ri(1,3); if(monthsIn<pausedM+1) monthsIn=pausedM+1+ri(0,12); resumeIn=ri(1,45); }
    var priceC=Math.round(plan[1]*100);
    var older = monthsIn>=12 && rnd()<K.olderShare;
    var rateC = older ? priceC - (K.olderDeltaFn ? K.olderDeltaFn(priceC) : pick(K.olderDeltaC)) : priceC;
    /* visits: days-ago list */
    var seen={}, vis=[], eng=rnd(), n, a, d;
    if(status==="active"||status==="past_due"){
      n = K.vis.byEng ? Math.round(eng*K.vis.nMax) : ri(K.vis.nMin,K.vis.nMax);
      for(a=0;a<n;a++){ d=ri(K.vis.min,K.vis.max); if(!seen[d]){ seen[d]=1; vis.push(d); } }
    } else {
      n = ri(0,2);
      for(a=0;a<n;a++){ d=ri(Math.round(K.vis.max*0.4),K.vis.max); if(!seen[d]){ seen[d]=1; vis.push(d); } }
    }
    vis.sort(function(x,y){return x-y;});
    var visits=vis.map(function(dd){ return {d:dd, type:pick(K.visitTypes)}; });
    /* ledger: one charge a month on the billing day */
    var billDay = K.runDays.length===2 ? (i%2 ? K.runDays[1] : K.runDays[0]) : K.runDays[0];
    var led=[], open=0, maxM=Math.min(11,monthsIn), m, st, x;
    for(m=0;m<=maxM;m++){
      if(status==="cancelled" && m<cAgo) continue;      /* nothing charged after they left */
      if(status==="paused" && m<pausedM) continue;      /* nothing charged while on hold */
      st="paid";
      if(status==="past_due" && m<2){ st="open"; open+=rateC; }
      else { x=rnd(); if(m===0){ if(x<K.dr*K.rr) st="rec"; } else if(x<K.dr){ st = rnd()<K.rr ? "rec" : "wo"; } }
      led.push({m:m, amt:rateC, st:st, day:billDay});
    }
    if(K.tm){
      var tix=[];
      for(m=0;m<=maxM;m++){ if(status==="cancelled" && m<cAgo) continue; if(status==="paused" && m<pausedM) continue; K.tm.month(m, plan, tix); }
      tix.forEach(function(tk){
        var s2="paid", y=rnd();
        if(status==="past_due" && tk.m<2){ s2="open"; open+=tk.a; }
        else if(tk.m===0){ if(y<K.dr*K.rr) s2="rec"; } else if(y<K.dr){ s2 = rnd()<K.rr ? "rec" : "wo"; }
        led.push({m:tk.m, amt:tk.a, st:s2, day:tk.day, kind:"tm", desc:tk.title, tk:tk});
      });
      led.sort(function(a2,b2){ return a2.m-b2.m || b2.day-a2.day; });
    }
    P.push({id:"p"+(1000+i), name:nm, contact:fn+" "+ln,
      email:(fn+"."+ln).toLowerCase().replace(/[^a-z.]/g,"")+ri(1,99)+"@"+pick(["gmail.com","yahoo.com","icloud.com","hotmail.com","comcast.net"]),
      phone:"(210) 555-0"+String(ri(100,199)), plan:plan[0], priceC:priceC, rateC:rateC, status:status, monthsIn:monthsIn, loc:loc, src:src,
      vis:visits, flag: K.flagFn(plan[0]) || rnd()<K.flagShare, led:led, openC:open,
      agree:"#"+ri(100000,119999), card:pick(["Visa","Amex","MC"])+" •"+ri(1000,9999), cardExp:"0"+ri(1,9)+"/2"+ri(7,9),
      billDay:billDay, cAgo:cAgo, reason:reason, pausedM:pausedM, resumeIn:resumeIn, smsOk:rnd()<0.84, emailOk:rnd()<0.93});
  }
})();
function shortName(p){ if(K.biz) return p.name; var a=p.name.split(" "); return a[0].charAt(0)+". "+a.slice(1).join(" "); }
function lastV(p){ return p.vis.length ? p.vis[0].d : null; }
function vwin(p){ var n=0; p.vis.forEach(function(v){ if(v.d<=K.vis.win) n++; }); return n; }
function lastVText(p){ var d=lastV(p); return d==null ? L.noVisit : d===0 ? "Today" : d===1 ? "1 day ago" : d+" days ago"; }
function mo(n){ return n===0 ? "Under a month" : n===1 ? "1 month" : n+" months"; }
function isRisk(p){ if(p.status!=="active") return false; var d=lastV(p); return d==null || d>K.vis.risk; }
function inLoc(p){ return LOC==="all" || p.loc===LOC; }
function withLoc(loc, fn){ var s=LOC; LOC=loc; var out=fn(); LOC=s; return out; }

/* ---- the numbers every screen reads ---- */
function AG(){
  var ps=P.filter(inLoc), cur=[], bill=[], pd=[], paused=[], canc=[], risk=[];
  ps.forEach(function(p){
    if(p.status==="cancelled"){ canc.push(p); return; }
    cur.push(p);
    if(p.status==="paused") paused.push(p); else { bill.push(p); if(p.status==="past_due") pd.push(p); }
    if(isRisk(p)) risk.push(p);
  });
  var duesC=0, pdC=0, pdDrafts=0, riskC=0, vsum=0;
  bill.forEach(function(p){ duesC+=p.rateC; });
  pd.forEach(function(p){ pdC+=p.openC; p.led.forEach(function(l){ if(l.st==="open") pdDrafts++; }); });
  risk.forEach(function(p){ riskC+=p.rateC; });
  cur.forEach(function(p){ vsum+=vwin(p); });
  return {ps:ps, cur:cur, bill:bill, pd:pd, paused:paused, canc:canc, risk:risk, duesC:duesC, pdC:pdC, pdDrafts:pdDrafts, riskC:riskC, vsum:vsum};
}
function SER(){
  var z=function(){ var a=[]; for(var i=0;i<12;i++) a.push(0); return a; };
  var ps=P.filter(inLoc), j=z(), c=z(), paid=z(), rec=z(), wo=z(), op=z(), nrec=z(), bySrc=[], cur=0, i;
  for(i=0;i<12;i++){ var o={}; K.sources.forEach(function(s){ o[s]=0; }); bySrc.push(o); }
  ps.forEach(function(p){
    if(p.monthsIn<=11){ j[11-p.monthsIn]++; bySrc[11-p.monthsIn][p.src]++; }
    if(p.status==="cancelled") c[11-p.cAgo]++; else cur++;
    p.led.forEach(function(l){ var k=11-l.m; if(l.st==="paid") paid[k]+=l.amt; else if(l.st==="rec"){ rec[k]+=l.amt; nrec[k]++; } else if(l.st==="wo") wo[k]+=l.amt; else op[k]+=l.amt; });
  });
  var mem=z(); mem[11]=cur; for(i=11;i>0;i--) mem[i-1]=mem[i]-j[i]+c[i];
  var D=function(a){ return a.map(function(v){ return Math.round(v/100); }); };
  var paidD=D(paid), woD=D(wo), opD=D(op);
  var colD=paid.map(function(v,k){ return Math.round((v+rec[k])/100); });        /* collected = paid + recovered, rounded once */
  var recD=colD.map(function(v,k){ return v-paidD[k]; });                         /* so the two parts always add up to the total */
  return {j:j, c:c, bySrc:bySrc, mem:mem, paidD:paidD, recD:recD, woD:woD, opD:opD, nrec:nrec, colD:colD, colC:paid.map(function(v,k){ return v+rec[k]; })};
}
function sum(a){ var t=0; a.forEach(function(v){ t+=v; }); return t; }

/* ---- today at the front desk / dispatch board (built once) ---- */
var ACTIVE=P.filter(function(p){ return p.status==="active"; });
var H={ pt:function(i){ return shortName(ACTIVE[i % ACTIVE.length]); }, m0:m0, d0:d0 };
/* first past-due person: on today's schedule, hits the balance hold at check-in */
var PD0=P.filter(function(p){ return p.status==="past_due"; })[0];
var PDROW=null;
var FD=withSeed(K.seed+77, function(){
  var c=K.fd, rows=[], t=c.start, i, used={};
  for(i=0;i<c.n;i++){
    t += pick(c.step);
    var hh=Math.floor(t/60), mm=t%60, st, p=null, who, loc, extra="";
    st = t < c.now-(c.nowWin||45) ? c.done : t <= c.now ? pick(c.nowSt) : c.later;
    if(c.who==="staff"){ who=null; loc=LOCS[i%2]; var cap=pick(c.caps), bk=Math.max(3,cap-ri(0,7)); extra={cap:cap, booked:bk}; }
    else {
      if(i===1 && PD0){ p=PD0; st=c.done; } else { do { p=ACTIVE[ri(0,ACTIVE.length-1)]; } while(used[p.id]); }
      used[p.id]=1; who=p.name; loc=p.loc;
      if(st!==c.later) p.vis.unshift({d:0, type:"__TODAY__"});
    }
    var row={t:t, tm:((hh+11)%12+1)+":"+String(mm).padStart(2,"0")+(hh<12?" AM":" PM"), p:p, who:who, loc:loc, type:pick(c.types), st:st, extra:extra};
    if(p && p===PD0) PDROW=row;
    rows.push(row);
  }
  rows.forEach(function(r){ if(r.p && r.p.vis.length && r.p.vis[0].type==="__TODAY__") r.p.vis[0].type=r.type; });
  return rows;
});
if(PD0 && K.fd.who==="staff" && !(PD0.vis.length && PD0.vis[0].d===0)) PD0.vis.unshift({d:0, type:K.visitTypes[0]});
function FDF(){
  var rows=FD.filter(function(r){ return LOC==="all" || r.loc===LOC; });
  var walk=LOC==="all" ? K.fd.walk[0]+K.fd.walk[1] : K.fd.walk[LOCS.indexOf(LOC)];
  var checked=0, inNow=0, doneN=0, byType={}, open=0, todayN=0;
  rows.forEach(function(r){ if(r.st!==K.fd.later) checked++; if(r.st===K.fd.nowSt[0]) inNow++; if(r.st===K.fd.done) doneN++; byType[r.type]=(byType[r.type]||0)+1; if(r.extra) open+=r.extra.cap-r.extra.booked; });
  P.forEach(function(p){ if(inLoc(p) && p.status!=="cancelled" && p.vis.length && p.vis[0].d===0) todayN++; });
  var f={rows:rows, n:rows.length, checked:checked, inNow:inNow, doneN:doneN, later:rows.length-checked, byType:byType, walk:walk, open:open, todayN:todayN};
  f.checkins=K.fd.checkins(f);
  return f;
}

/* ---- register (built once) ---- */
var POS=withSeed(K.seed+99, function(){
  var sell=K.pos.products.filter(function(p){ return p[1]>0 && !p[4]; }), sales=[], t=K.fd.now-8, i;
  for(i=0;i<K.pos.n;i++){
    var pr=pick(sell), q=rnd()<.22?2:1, p=ACTIVE[ri(0,ACTIVE.length-1)], hh=Math.floor(t/60), mm=t%60;
    sales.push({tm:((hh+11)%12+1)+":"+String(mm).padStart(2,"0")+(hh<12?" AM":" PM"), r:K.pos.rPrefix+(1061-i), it:(q>1?q+" × ":"")+pr[0], who:p.name, pay:pick(K.pos.pays), amtC:Math.round(pr[1]*100)*q, loc:p.loc});
    t -= ri(6,22);
  }
  return sales;
});
function POSF(){
  var sales=POS.filter(function(s){ return LOC==="all" || s.loc===LOC; }), tot=0;
  sales.forEach(function(s){ tot+=s.amtC; });
  var share=LOC==="all" ? 1 : K.locW[LOCS.indexOf(LOC)]/(K.locW[0]+K.locW[1]);
  var month=K.pos.month.map(function(v){ return Math.round(v*share); });
  month.push(Math.round(K.pos.mtd*share)+Math.round(tot/100));
  var low=K.pos.products.filter(function(p){ return p[2]<p[3]; });
  return {sales:sales, totC:tot, month:month, low:low};
}

/* ---- staff (built once) ---- */
var STAFF=withSeed(K.seed+55, function(){
  var out=[];
  K.roles.forEach(function(r){ for(var i=0;i<r[1];i++){ out.push({name:pick(FIRST)+" "+pick(LAST), role:r[0], rate:r[2], loc:LOCS[out.length%2], hrs:ri(52,84), exc:false}); } });
  var flagged=0; out.forEach(function(s){ if(flagged<K.staffExc && s.loc===LOCS[1]){ s.exc=true; flagged++; } });
  return out;
});
function STF(){ var st=STAFF.filter(function(s){ return LOC==="all"||s.loc===LOC; }), pay=0, ot=0, exc=0; st.forEach(function(s){ pay+=s.hrs*s.rate; ot+=Math.max(0,s.hrs-80); if(s.exc) exc++; }); return {st:st, pay:pay, ot:ot, exc:exc}; }

/* ---- leads (built once) ---- */
var LEADS=withSeed(K.seed+33, function(){
  var out=[], waiting=0;
  K.lead.stages.forEach(function(sg){
    for(var i=0;i<sg[3];i++){
      var pl=wpick(K.plans.map(function(p){return [p,p[2]];}));
      var nm=K.biz ? pick(LAST)+" "+pick(K.biz) : pick(FIRST)+" "+pick(LAST);
      var isNew=sg[0]==="new", wait=isNew && waiting<K.lead.waiting;
      if(wait) waiting++;
      out.push({name:nm, stage:sg[0], src:wpick(K.lead.srcW), ah:rnd()<0.4, days:isNew?ri(0,1):ri(1,13), owner:pick(K.lead.owners),
        valC:Math.round(pl[1]*100), plan:pl[0], loc:LOCS[out.length%2], wait:wait, next: wait ? "Call back: first reply not sent yet" : pick(K.lead.next[sg[0]])});
    }
  });
  return out;
});
function LEADF(){ return LEADS.filter(function(l){ return LOC==="all"||l.loc===LOC; }); }

/* ---- receptionist log + agent jobs ---- */
var CALLS=K.calls(H);
var JOBS=K.jobs.map(function(j){ return {n:j.n, m:j.m, w:j.w, b:j.b, each:j.each, runsF:j.runs}; });
function JF(){
  var a=AG(), s=SER(), base={bill:a.bill.length, cur:a.cur.length, appts:FDF().n, share: a.cur.length/Math.max(1,P.filter(function(p){return p.status!=="cancelled";}).length),
    declines:a.pdDrafts+s.nrec[11]+s.nrec[10], calls:CALLS.length, offCalls:CALLS.filter(function(c){return c.off;}).length, sends:K.camp.rows.filter(function(r){return r.sent30;}).length, risk:a.risk.length};
  var tasks=0, hours=0, list=JOBS.map(function(j){
    var r=Math.max(0,Math.round(typeof j.runsF==="function" ? j.runsF(base) : j.runsF*base.share));
    var h=Math.round(r*j.each/6)/10; tasks+=r; hours+=h;
    return {n:j.n, m:j.m, w:j.w, b:j.b, each:j.each, r:r, h:h};
  });
  return {list:list, tasks:tasks, hours:Math.round(hours*10)/10};
}
function FACTS(){
  var a=AG(), s=SER(), lf=LEADF(), wait=lf.filter(function(l){return l.wait;}), pf=POSF(), sf=STF(), fd=FDF();
  return {a:a, s:s, pdN:a.pd.length, pdSum:m0(a.pdC), pdNames:a.pd.slice(0,3).map(shortName), pd3C:a.pd.slice(0,3).reduce(function(t,p){return t+p.rateC;},0),
    recMonth:d0(s.recD[11]), riskN:a.risk.length, riskYear:m0(a.riskC*12), waitN:wait.length, waitNames:wait.slice(0,2).map(function(l){return l.name;}),
    lowN:pf.low.length, excN:sf.exc, fd:fd, cur:a.cur.length, pt:H.pt, m0:m0, d0:d0};
}

/* ============ charts ============ */
var tip=$('#tip');
function showTip(e,html){ tip.innerHTML=html; tip.hidden=false; var x=e.clientX+12,y=e.clientY-10; var r=tip.getBoundingClientRect(); if(x+r.width>window.innerWidth-8)x=e.clientX-r.width-12; tip.style.left=x+"px"; tip.style.top=y+"px"; }
function hideTip(){ tip.hidden=true; }
document.addEventListener('scroll',hideTip,true);
document.addEventListener('mousemove',function(e){ var t=e.target.closest && e.target.closest('[data-tip]'); if(t) showTip(e,esc(t.getAttribute('data-tip'))); else hideTip(); });
function barSVG(o){
  var vals=o.values, labels=o.labels, W=600, H2=170, padL=8, padB=18, padT=14, max=Math.max.apply(null,vals)*1.08||1, bw=(W-padL*2)/vals.length, g='';
  [0.5,1].forEach(function(f){ var y=padT+(H2-padB-padT)*(1-f); g+='<line x1="'+padL+'" x2="'+(W-padL)+'" y1="'+y+'" y2="'+y+'" stroke="var(--line)" stroke-width="1"/>'; });
  var bars=vals.map(function(v,i){ var h=Math.max(2,(H2-padB-padT)*v/max), x=padL+i*bw+bw*0.14, y=H2-padB-h;
    return '<rect x="'+x+'" y="'+y+'" width="'+(bw*0.72)+'" height="'+h+'" rx="3" fill="'+(o.color||'var(--c2)')+'" data-tip="'+esc(labels[i]+': '+(o.fmt?o.fmt(v):v))+'"/>'; }).join('');
  var xl=labels.map(function(l,i){ if(vals.length>8 && i%2) return ''; return '<text x="'+(padL+i*bw+bw*0.5)+'" y="'+(H2-4)+'" text-anchor="middle" font-size="9.5" fill="var(--mut)">'+esc(l)+'</text>'; }).join('');
  var li=vals.length-1;
  var ml='<text x="'+(padL+li*bw+bw*0.5)+'" y="'+(H2-padB-(H2-padB-padT)*vals[li]/max-5)+'" text-anchor="middle" font-size="9.5" font-weight="600" fill="var(--mut)">'+esc(o.fmt?o.fmt(vals[li]):vals[li])+'</text>';
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H2+'" role="img">'+g+bars+ml+xl+'</svg></div>';
}
function stackSVG(o){
  var W=600,H2=190,padL=8,padB=18,padT=10,n=o.labels.length;
  var totals=o.labels.map(function(_,i){ return o.series.reduce(function(s,se){return s+se.values[i];},0); });
  var max=Math.max.apply(null,totals)*1.08||1, bw=(W-padL*2)/n, g='', bars='', i, s2;
  [0.5,1].forEach(function(f){ var y=padT+(H2-padB-padT)*(1-f); g+='<line x1="'+padL+'" x2="'+(W-padL)+'" y1="'+y+'" y2="'+y+'" stroke="var(--line)"/>'; });
  for(i=0;i<n;i++){ var y=H2-padB;
    for(s2=0;s2<o.series.length;s2++){ var se=o.series[s2], v=se.values[i]; if(!v) continue; var h=(H2-padB-padT)*v/max; y-=h;
      bars+='<rect x="'+(padL+i*bw+bw*0.16)+'" y="'+(y+1)+'" width="'+(bw*0.68)+'" height="'+Math.max(1,h-2)+'" rx="2" fill="'+se.color+'" data-tip="'+esc(o.labels[i]+' · '+se.name+': '+(o.fmt?o.fmt(v):v))+'"/>'; } }
  var xl=o.labels.map(function(l,k){ if(n>8&&k%2)return ''; return '<text x="'+(padL+k*bw+bw*0.5)+'" y="'+(H2-4)+'" text-anchor="middle" font-size="9.5" fill="var(--mut)">'+esc(l)+'</text>'; }).join('');
  var legend='<div class="legend">'+o.series.map(function(se){ return '<span><i style="background:'+se.color+'"></i>'+esc(se.name)+'</span>'; }).join('')+'</div>';
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H2+'">'+g+bars+xl+'</svg>'+legend+'</div>';
}
function lineSVG(o){
  var vals=o.values,labels=o.labels,W=600,H2=170,padL=8,padB=18,padT=12, min=Math.min.apply(null,vals), max=Math.max.apply(null,vals), span=(max-min)||1; min-=span*0.15; max+=span*0.1;
  function X(i){return padL+(W-2*padL)*i/(vals.length-1);} function Y(v){return padT+(H2-padB-padT)*(1-(v-min)/(max-min));}
  var d=vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' ');
  var area=d+' L'+X(vals.length-1)+' '+(H2-padB)+' L'+X(0)+' '+(H2-padB)+' Z', g='';
  [0.5,1].forEach(function(f){var y=padT+(H2-padB-padT)*(1-f); g+='<line x1="'+padL+'" x2="'+(W-padL)+'" y1="'+y+'" y2="'+y+'" stroke="var(--line)"/>';});
  var dots=vals.map(function(v,i){ return '<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="7" fill="transparent" data-tip="'+esc(labels[i]+': '+(o.fmt?o.fmt(v):v))+'"/>'; }).join('');
  var endLab='<text x="'+(X(vals.length-1)-4)+'" y="'+(Y(vals[vals.length-1])-8)+'" text-anchor="end" font-size="10" font-weight="600" fill="var(--mut)">'+esc(o.fmt?o.fmt(vals[vals.length-1]):vals[vals.length-1])+'</text>';
  var xl=labels.map(function(l,i){ if(labels.length>8&&i%2)return ''; return '<text x="'+X(i)+'" y="'+(H2-4)+'" text-anchor="middle" font-size="9.5" fill="var(--mut)">'+esc(l)+'</text>'; }).join('');
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H2+'"><path d="'+area+'" fill="'+(o.color||'var(--c2)')+'" opacity="0.14"/><path d="'+d+'" fill="none" stroke="'+(o.color||'var(--c2)')+'" stroke-width="2"/>'+g+dots+endLab+xl+'</svg></div>';
}

/* ============ shell ============ */
var NAV=[[L.navOps,[["overview","Overview"],["patients",T.People],["billing","Billing"],["frontdesk",L.navDesk],["optical",L.navPos],["staff","Staff & payroll"]]],
         ["Growth",[["leads",L.navLeads],["receptionist","AI receptionist"],["campaigns","Campaigns"],["reports","Reports"]]],
         ["Automation",[["agent","Back-office agent"]]]];
function drawNav(route){
  var on = route.indexOf('patient-')===0 ? 'patients' : route==='newcampaign' ? 'campaigns' : route;
  $('#nav').innerHTML=NAV.map(function(g){ return '<div class="grp">'+g[0]+'</div>'+g[1].map(function(it){ return '<a href="#'+it[0]+'" class="'+(on===it[0]?'on':'')+'">'+it[1]+'</a>'; }).join(''); }).join('');
}
var VIEWS={};
function route(){
  var h=(location.hash||'#overview').slice(1);
  var view = h.indexOf('patient-')===0 ? 'profile' : (VIEWS[h]?h:'overview');
  drawNav(view==='overview' && h!=='overview' ? 'overview' : h);
  VIEWS[view](h);
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
function foot(){ return '<footer>'+esc(K.brand)+' OS — demo by Six Harmony. Every figure on this page is worked out from the sample '+T.book+' and billing, so it matches what each screen shows. Sample data only.</footer>'; }
function tilesHTML(arr){ return '<div class="tiles">'+arr.map(function(t){ return '<div class="tile"><div class="k">'+t[0]+'</div><div class="v">'+t[1]+'</div>'+(t[2]?'<div class="s '+(t[3]||'')+'">'+t[2]+'</div>':'')+'</div>'; }).join('')+'</div>'; }
function rowClicks(){ $$('tr.click').forEach(function(tr){ tr.addEventListener('click',function(){ location.hash='patient-'+tr.getAttribute('data-id'); }); }); }
function stChip(p){ var c=p.status==="active"?"good":p.status==="past_due"?"bad":p.status==="paused"?"info":""; var t=p.status==="paused"?T.paused:p.status==="past_due"?"Past due":p.status==="cancelled"?T.cancelled:"Active"; return '<span class="chip '+c+'">'+t+'</span>'; }

/* ============ views ============ */
VIEWS.overview=function(){
  var F=FACTS(), a=F.a, s=F.s, jf=JF(), net=s.j[11]-s.c[11];
  var att=K.att(F);
  var urgent=att.filter(function(x){return x[0]==='urgent';}).length;
  $('#main').innerHTML =
    '<h2>Overview</h2><p class="panel-sub">'+NOWLAB+' · '+locName()+'</p>'
    + tilesHTML([
      [L.tActive, a.cur.length.toLocaleString(), (net>=0?"+":"")+net+" net this month · "+a.paused.length+" "+T.pausedV, "good"],
      [L.tDues, m0(a.duesC), L.tDuesSub],
      [L.tCollected, d0(s.colD[11]), d0(s.recD[11])+" "+L.recBy, "good"],
      ["Past due", m0(a.pdC), a.pd.length+" "+T.accts+" · "+pc(100*a.pd.length/Math.max(1,a.bill.length),1)+" of paying "+T.people, "bad"],
      [L.tCheck, F.fd.checkins.toLocaleString(), L.tCheckSub(F.fd)]
    ])
    + '<div class="cols2"><section class="block"><h3>Needs attention</h3><p class="panel-sub">'+att.length+' items to look at, '+urgent+' urgent.</p><div class="rowlist">'
    + att.map(function(x){ return '<a href="'+x[4]+'" style="color:inherit;text-decoration:none"><div class="r"><span class="chip '+(x[0]==='urgent'?'bad':x[0])+'">'+(x[0]==='urgent'?'Urgent':x[1])+'</span><div class="grow"><div class="ttl">'+esc(x[2])+'</div><div class="sub">'+esc(x[3])+'</div></div><span class="meta">'+x[1]+' ›</span></div></a>'; }).join('')
    + '</div></section>'
    + '<section class="block"><div class="between"><h3>Back-office agent, last 7 days</h3><a href="#agent" class="act" style="text-decoration:none">Open</a></div><p class="panel-sub">Work nobody on staff had to do.</p>'
    + '<div class="tiles" style="grid-template-columns:repeat(3,1fr)">'
    + [["Tasks done",Math.round(jf.tasks*7/30).toLocaleString()],["Hours saved",(Math.round(jf.hours*70/30)/10).toFixed(1)],[L.recTile,d0(s.recD[11])]].map(function(t){return '<div class="tile"><div class="k">'+t[0]+'</div><div class="v" style="font-size:20px">'+t[1]+'</div></div>';}).join('')
    + '</div><div class="rowlist">'+K.decided(H).slice(0,4).map(function(x){return '<div class="r"><div class="grow"><div class="ttl">'+esc(x.t)+'</div><div class="sub">'+esc(x.s)+'</div></div><span class="decided-time">'+esc(x.time)+'</span></div>';}).join('')+'</div></section></div>'
    + '<div class="cols2" style="grid-template-columns:1fr 1fr"><section class="block"><h3>'+T.People+', last 12 months</h3><p class="panel-sub">'+L.memChartSub+' '+(s.mem[11]-s.mem[0]>=0?'+':'')+(s.mem[11]-s.mem[0]).toLocaleString()+' over the year.</p>'
    + lineSVG({values:s.mem,labels:M12,color:'var(--c2)',fmt:function(v){return v.toLocaleString();}})
    + '</section><section class="block"><h3>'+L.colChart+'</h3><p class="panel-sub">'+L.colChartSub+'</p>'
    + barSVG({values:s.colD,labels:M12,color:'var(--c3)',fmt:function(v){return d0(v);}})
    + '</section></div>'
    + '<section class="block"><h3>'+T.LocWords+'</h3><p class="panel-sub">Select a '+T.locWord+' in the top bar to see the OS for that '+T.locWord+' only.</p><div class="tscroll"><table class="tbl"><tr><th>'+T.LocWord+'</th><th class="num">'+L.tActive+'</th><th class="num">Net this month</th><th class="num">Monthly dues</th><th class="num">Collected this month</th><th class="num">Past due</th><th class="num">'+L.visPer+'</th></tr>'
    + LOCS.map(function(l){ return withLoc(l,function(){ var b=AG(), q=SER(), n2=q.j[11]-q.c[11];
        return '<tr><td><b>'+l+'</b></td><td class="num">'+b.cur.length.toLocaleString()+'</td><td class="num" style="color:var(--good)">'+(n2>=0?'+':'')+n2+'</td><td class="num">'+m2(b.duesC)+'</td><td class="num">'+m2(q.colC[11])+'</td><td class="num">'+pc(100*b.pd.length/Math.max(1,b.bill.length),1)+'</td><td class="num">'+(b.vsum/Math.max(1,b.cur.length)).toFixed(1)+'</td></tr>'; }); }).join('')
    + '</table></div></section>' + foot();
};

VIEWS.patients=function(){
  var a=AG(), f=VIEWS.patients._f||"current";
  var sets={current:a.cur, active:a.cur.filter(function(p){return p.status==="active";}), paused:a.paused, past_due:a.pd, cancelled:a.canc};
  var list=sets[f]||a.cur, rows=list.slice(0,60);
  $('#main').innerHTML = '<div class="between"><div><h2>'+T.People+'</h2><p class="panel-sub">'+a.cur.length.toLocaleString()+' current '+T.people+' · '+locName()+'</p></div><button class="act primary" id="newp">+ New '+T.person+'</button></div>'
    + '<div class="seg">'+[["current","Current"],["active","Active"],["paused",T.paused],["past_due","Past due"],["cancelled",T.cancelled]].map(function(sg){
        return '<button type="button" data-f="'+sg[0]+'" aria-pressed="'+(f===sg[0])+'">'+sg[1]+' <span style="opacity:.6">'+sets[sg[0]].length+'</span></button>'; }).join('')+'</div>'
    + '<section class="block"><div class="tscroll"><table class="tbl"><tr><th>'+T.Person+'</th><th>Agreement</th><th>'+T.planCol+'</th><th>Status</th><th class="num">Dues/mo</th><th>'+L.lastCol+'</th><th class="num">'+L.visCol+'</th></tr>'
    + rows.map(function(p){ return '<tr class="click" data-id="'+p.id+'"><td><b>'+esc(p.name)+'</b><div class="sub" style="color:var(--mut);font-size:11px">'+esc(p.email)+'</div></td><td>'+p.agree+'</td><td>'+p.plan+'</td><td>'+stChip(p)+'</td><td class="num">'+m2(p.rateC)+'</td><td>'+lastVText(p)+'</td><td class="num">'+vwin(p)+'</td></tr>'; }).join('')
    + '</table></div><p class="srcline">Showing '+rows.length+' of '+list.length.toLocaleString()+' — search in the top bar jumps straight to any '+T.person+'.</p></section>' + foot();
  $('#newp').addEventListener('click',function(){ toast('Demo — new '+T.people+' come in through the receptionist and the leads board'); });
  $$('.seg button').forEach(function(b){ b.addEventListener('click',function(){ VIEWS.patients._f=b.getAttribute('data-f'); VIEWS.patients(); }); });
  rowClicks();
};

VIEWS.profile=function(h){
  var id=h.replace('patient-',''), p=P.filter(function(x){return x.id===id;})[0];
  if(!p){ location.hash='patients'; return; }
  var S2=K.st, nextM = p.billDay>17 ? 0 : -1;   /* next charge: this month if the day hasn't come, else next month */
  var nextLab = p.status==="cancelled" ? "—" : p.status==="paused" ? L.pausedNext : mlab(nextM,p.billDay)+" · "+m2(p.rateC);
  var older = p.rateC<p.priceC;
  $('#main').innerHTML = '<div class="crumb"><a href="#patients">'+T.People+'</a> › '+esc(p.name)+'</div>'
    + (p.status==="past_due" ? '<div class="banner"><div class="r"><div class="grow"><b>'+esc(p.name)+'</b> <span class="chip bad">Past due</span><div class="sub">'+L.pdBanner+'</div></div><b class="amt">'+m2(p.openC)+'</b>'+L.pdBtns.map(function(b,i){ return '<button class="act'+(i===2?' primary':'')+'" data-toast="'+esc(b[1])+'">'+b[0]+'</button>'; }).join('')+'</div></div>' : '')
    + '<div class="cols2"><div>'
    + '<section class="block"><div class="between"><h3>Billing</h3>'+stChip(p)+'</div><p class="panel-sub">Agreement '+p.agree+' · '+p.loc+'</p><div class="facts">'
    + [[T.planCol,p.plan],["Monthly dues",m2(p.rateC)+(older?' <span class="chip warn">older rate</span>':'')],["Today's rate for this "+T.planCol.toLowerCase(),m2(p.priceC)]].concat(K.planInfo?[["Covers",K.planInfo[p.plan]]]:[]).concat([[L.billDay,"The "+(p.billDay===1?"1st":p.billDay+"th")+" of each month"],[L.nextCharge,nextLab],[L.payMethod,L.payVal(p)]]).map(function(x){return '<div><span class="k">'+x[0]+'</span><span class="v">'+x[1]+'</span></div>';}).join('')
    + '</div></section>'
    + ticketsHTML(p)
    + '<section class="block"><h3>Ledger</h3><p class="panel-sub">'+L.ledgerSub+'</p><div class="tscroll"><table class="tbl"><tr><th>Date</th><th>Description</th><th>'+L.ledgerCol+'</th><th>Status</th><th class="num">Amount</th></tr>'
    + (p.led.length ? p.led.map(function(l){ var stc=l.st==="paid"?"good":l.st==="rec"?"info":"bad";
        return '<tr><td>'+mlab(l.m,l.day)+'</td><td>'+(l.desc?esc(l.desc):esc(p.plan)+' '+L.ledgerDesc)+'</td><td>'+L.ledgerVal(p)+'</td><td><span class="chip '+stc+'">'+S2[l.st]+'</span></td><td class="num">'+m2(l.amt)+'</td></tr>'; }).join('') : '<tr><td colspan="5" class="empty">No charges in the last 12 months.</td></tr>')
    + '</table></div></section>'
    + '<section class="block"><h3>'+L.visTitle+'</h3><p class="panel-sub">'+L.visSub+'</p>'
    + tilesHTML([[L.visCol,vwin(p)],[L.lastCol,lastVText(p)],[L.homeLoc,p.loc],[T.Person+" for",mo(p.monthsIn)]])
    + '<div class="tscroll"><table class="tbl"><tr><th>When</th><th>'+L.visType+'</th><th>'+T.LocWord+'</th><th>'+L.visBy+'</th></tr>'
    + (p.vis.length ? p.vis.slice(0,10).map(function(v){ return '<tr><td>'+(v.d===0?"Today":v.d===1?"1 day ago":v.d+" days ago")+'</td><td>'+v.type+'</td><td>'+p.loc+'</td><td>'+L.visByVal+'</td></tr>'; }).join('') : '<tr><td colspan="4" class="empty">'+L.noVisit+'</td></tr>')
    + '</table></div>'+(p.vis.length>10?'<p class="srcline">Showing the 10 most recent of '+p.vis.length+'.</p>':'')+'</section>'
    + '</div><div><section class="block"><h3>Contact</h3><div class="facts">'
    + [[K.biz?"Contact":"Name",esc(K.biz?p.contact:p.name)],["Email",'<span style="word-break:break-all">'+esc(p.email)+'</span>'],["Phone",p.phone],[L.homeLoc,p.loc],["Source",p.src]].map(function(x){return '<div><span class="k">'+x[0]+'</span><span class="v">'+x[1]+'</span></div>';}).join('')
    + '</div></section>'
    + '<section class="block"><h3>'+L.consentTitle+'</h3><p class="panel-sub">Campaigns only reach '+T.people+' with consent on.</p><div class="facts">'
    + '<div><span class="k">Email</span><input type="checkbox" class="toggle" '+(p.emailOk?'checked':'')+' data-consent></div>'
    + '<div><span class="k">SMS</span><input type="checkbox" class="toggle" '+(p.smsOk?'checked':'')+' data-consent></div>'
    + '</div></section>'
    + '<section class="block"><h3>Profile</h3><div class="facts">'
    + [["Agreement",p.agree],[L.flagLabel,p.flag?"Yes":"No"],["Status",stChip(p)]].concat(p.status==="cancelled"?[["Left",p.cAgo===0?"This month":mo(p.cAgo)+" ago"],["Reason",p.reason]]:[]).concat(p.status==="paused"?[[T.paused+" for",mo(p.pausedM)],["Back in",p.resumeIn+(p.resumeIn===1?" day":" days")]]:[]).map(function(x){return '<div><span class="k">'+x[0]+'</span><span class="v">'+x[1]+'</span></div>';}).join('')
    + '</div></section>'
    + '</div></div>' + foot();
  $$('[data-toast]').forEach(function(b){ b.addEventListener('click',function(){ toast(b.getAttribute('data-toast')); }); });
  $$('[data-consent]').forEach(function(b){ b.addEventListener('change',function(){ toast('Demo — consent saved'); }); });
};

function tkTable(tk){
  return '<div class="tscroll"><table class="tbl"><tr><th>Line</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr>'
    + tk.lines.map(function(l){ return '<tr><td>'+esc(l.d)+'</td><td class="num">'+(l.q!=null?(l.q%1?l.q.toFixed(1):l.q)+(l.u?' '+l.u:''):'')+'</td><td class="num">'+(l.r!=null?m2(Math.round(l.r*100)):'')+'</td><td class="num">'+m2(l.a)+'</td></tr>'; }).join('')
    + '<tr><td colspan="3"><b>Ticket total</b></td><td class="num"><b>'+m2(tk.a)+'</b></td></tr></table></div>';
}
function ticketsHTML(p){
  if(!K.tm) return '';
  var rows=p.led.filter(function(l){ return l.kind==="tm"; });
  if(!rows.length) return '<section class="block"><h3>Job tickets</h3><p class="empty">No T&amp;M tickets in the last 12 months.</p></section>';
  var big=rows.slice().sort(function(a,b){ return b.amt-a.amt; })[0], tot=sum(rows.map(function(l){ return l.amt; }));
  var list=[big].concat(rows.filter(function(l){ return l!==big; })).slice(0,6);
  return '<section class="block"><h3>Job tickets</h3><p class="panel-sub">'+rows.length+' T&amp;M ticket'+(rows.length>1?'s':'')+' in the last 12 months · '+m2(tot)+' billed. Every line is priced off the rate sheet.</p>'
    + list.map(function(l,i){ var c=l.st==="paid"?"good":l.st==="rec"?"info":"bad";
        return '<details class="callrow"'+(i===0?' open':'')+'><summary tabindex="0"><div class="r"><span class="meta">'+mlab(l.m,l.day)+'</span><div class="grow"><div class="ttl">'+esc(l.desc)+'</div><div class="sub">'+l.tk.lines.length+' lines</div></div><span class="chip '+c+'">'+K.st[l.st]+'</span><span class="money">'+m2(l.amt)+'</span></div></summary>'+tkTable(l.tk)+'</details>'; }).join('')
    + (rows.length>6?'<p class="srcline">Showing 6 of '+rows.length+' tickets. Every ticket is also a line in the ledger below.</p>':'<p class="srcline">Every ticket is also a line in the ledger below.</p>')
    + '</section>';
}
VIEWS.billing=function(){
  var a=AG(), s=SER(), tab=VIEWS.billing._t||"overview", body='';
  var nd=K.nextRun, next=a.bill.filter(function(p){ return p.billDay===nd.day; }), nextC=sum(next.map(function(p){return p.rateC;}));
  function runRows(m, day, loc){ var n=0, col=0, dec=0; P.forEach(function(p){ if(p.loc!==loc) return; p.led.forEach(function(l){ if(l.m===m && l.day===day && l.kind!=='tm'){ n++; if(l.st==="paid"||l.st==="rec") col+=l.amt; if(l.st!=="paid") dec++; } }); }); return {n:n, colC:col, dec:dec}; }
  if(tab==="overview"){
    var r3=s.recD[7]+s.recD[8]+s.recD[9], w3=s.woD[7]+s.woD[8]+s.woD[9], rate=r3+w3 ? 100*r3/(r3+w3) : 0;
    var soon=a.paused.filter(function(p){return p.resumeIn<=7;});
    var lr=K.lastRun, lastN=0, lastC=0;
    (LOC==="all"?LOCS:[LOC]).forEach(function(l){ var q=runRows(0,lr.day,l); lastN+=q.n; lastC+=q.colC; });
    body = tilesHTML([
      [L.tCollected, d0(s.colD[11]), d0(s.paidD[11])+" "+L.bPaid+" · "+d0(s.recD[11])+" "+L.bRec, "good"],
      [L.bNext, nd.label, m2(nextC)+" expected from "+next.length.toLocaleString()+" "+T.people],
      [L.bOpen, m0(a.pdC), a.pdDrafts+" "+L.bOpenSub],
      [L.bRate, pc(rate,0), d0(r3)+" "+L.bRateSub, "good"],
      [T.paused+" "+T.people, String(a.paused.length), soon.length+" "+L.bPausedSub],
      ["Past-due "+T.accts, String(a.pd.length), pc(100*a.pd.length/Math.max(1,a.bill.length),1)+" of paying "+T.people, "bad"]
    ])
    + '<div class="cols2"><section class="block"><h3>'+L.colChart12+'</h3><p class="panel-sub">'+d0(sum(s.colD))+' collected, '+d0(sum(s.recD))+' of it '+L.bRecOf+'.</p>'
    + stackSVG({labels:M12,fmt:function(v){return d0(v);},series:[{name:L.sPaid,color:"var(--c2)",values:s.paidD},{name:L.sRec,color:"var(--c3)",values:s.recD}]})
    + '</section><section class="block"><h3>This week</h3><div class="rowlist">'
    + [[L.runWord+" "+lr.label+" — completed",lastN.toLocaleString()+" "+L.runUnit+" attempted",m2(lastC)],
       [L.retryRow, a.pd.length+" "+T.accts+" "+L.retryRowSub, m0(a.pdC)],
       [T.paused+" ending this week", soon.length ? soon.slice(0,2).map(shortName).join(", ")+(soon.length>2?" + "+(soon.length-2)+" more":"") : "None this week", "—"]
      ].map(function(x){return '<div class="r"><div class="grow"><div class="ttl">'+x[0]+'</div><div class="sub">'+x[1]+'</div></div><span class="money">'+x[2]+'</span></div>';}).join('')
    + '</div></section></div>';
  } else if(tab==="drafts"){
    var rows=[], locs=LOC==="all"?LOCS:[LOC];
    locs.forEach(function(l){ var nx=a.bill.filter(function(p){return p.loc===l && p.billDay===nd.day;}); rows.push([nd.label,l,nx.length,m2(sum(nx.map(function(p){return p.rateC;})))+" expected","Scheduled"]); });
    [0,1,2].forEach(function(m){ K.runDays.slice().reverse().forEach(function(day){ locs.forEach(function(l){ var q=runRows(m,day,l); rows.push([dlab(m,day),l,q.n,m2(q.colC)+" collected · "+q.dec+" "+L.runDec,"Completed"]); }); }); });
    body='<section class="block"><h3>'+L.runsTitle+'</h3><p class="panel-sub">'+L.runsSub+'</p><div class="tscroll"><table class="tbl"><tr><th>Date</th><th>'+T.LocWord+'</th><th class="num">Attempted</th><th>Result</th><th>Status</th></tr>'
      + rows.map(function(r){ return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td class="num">'+r[2].toLocaleString()+'</td><td>'+r[3]+'</td><td><span class="chip '+(r[4]==="Scheduled"?"info":"good")+'">'+r[4]+'</span></td></tr>'; }).join('')+'</table></div></section>';
  } else if(tab==="declines"){
    var dp=a.pd.slice(0,12);
    body='<section class="block"><h3>'+L.decTitle+'</h3><p class="panel-sub">'+L.decSub+'</p><div class="tscroll"><table class="tbl"><tr><th>'+T.Person+'</th><th>'+T.LocWord+'</th><th>'+L.decCol+'</th><th class="num">Owed</th><th>'+L.decNext+'</th><th></th></tr>'
      + dp.map(function(p){ return '<tr class="click" data-id="'+p.id+'"><td><b>'+esc(p.name)+'</b></td><td>'+p.loc+'</td><td>'+L.decReason+'</td><td class="num">'+m2(p.openC)+'</td><td>'+L.decNextVal+'</td><td><span class="chip bad">'+L.decChip+'</span></td></tr>'; }).join('')
      + '</table></div><p class="srcline">Showing '+dp.length+' of '+a.pd.length+' · '+m0(a.pdC)+' owed in total.</p></section>';
  } else if(tab==="rates" && K.rateSheet){
    var rs=K.rateSheet;
    body='<section class="block"><h3>Labor</h3><p class="panel-sub">'+rs.laborSub+'</p><div class="tscroll"><table class="tbl"><tr><th>Craft</th><th class="num">Straight time</th><th class="num">Overtime (1.5×)</th><th class="num">Double time (2×)</th></tr>'
      + rs.labor.map(function(x){ return '<tr><td><b>'+x[0]+'</b></td><td class="num">'+m2(Math.round(x[1]*100))+'/hr</td><td class="num">'+m2(Math.round(x[1]*150))+'/hr</td><td class="num">'+m2(Math.round(x[1]*200))+'/hr</td></tr>'; }).join('')
      + '</table></div></section>'
      + '<div class="cols2" style="grid-template-columns:1.3fr 1fr"><section class="block"><h3>Equipment, travel &amp; subcontract</h3><div class="tscroll"><table class="tbl"><tr><th>Item</th><th class="num">Rate</th><th>Terms</th></tr>'
      + rs.equip.map(function(x){ return '<tr><td><b>'+x[0]+'</b></td><td class="num">'+m2(Math.round(x[1]*100))+'/'+x[2]+'</td><td>'+x[3]+'</td></tr>'; }).join('')
      + '</table></div></section><section class="block"><h3>Terms</h3><div class="facts">'
      + rs.terms.map(function(x){ return '<div><span class="k">'+x[0]+'</span><span class="v">'+x[1]+'</span></div>'; }).join('')
      + '</div></section></div>';
  } else {
    var tot=0, cnt=0;
    body='<section class="block"><h3>'+T.planCol+'s</h3><div class="tscroll"><table class="tbl"><tr><th>'+T.planCol+'</th><th class="num">Today\'s rate</th><th class="num">Paying '+T.people+'</th><th class="num">Monthly dues</th></tr>'
      + K.plans.map(function(pl){ var ps=a.bill.filter(function(p){return p.plan===pl[0];}), dC=sum(ps.map(function(p){return p.rateC;})); tot+=dC; cnt+=ps.length; return '<tr><td><b>'+pl[0]+'</b></td><td class="num">'+m2(Math.round(pl[1]*100))+'</td><td class="num">'+ps.length.toLocaleString()+'</td><td class="num">'+m2(dC)+'</td></tr>'; }).join('')
      + '<tr><td><b>All</b></td><td class="num">–</td><td class="num"><b>'+cnt.toLocaleString()+'</b></td><td class="num"><b>'+m2(tot)+'</b></td></tr></table></div></section>';
  }
  $('#main').innerHTML='<h2>Billing</h2><p class="panel-sub">'+L.billSub+'</p>'
    + '<div class="seg">'+[["overview","Overview"],["drafts",L.runsTab],["declines",L.decTab],["plans",T.planCol+"s"]].concat(K.rateSheet?[["rates","Rate sheet"]]:[]).map(function(sg){return '<button data-t="'+sg[0]+'" aria-pressed="'+(tab===sg[0])+'">'+sg[1]+'</button>';}).join('')+'</div>'
    + body + foot();
  $$('.seg button').forEach(function(b){ b.addEventListener('click',function(){ VIEWS.billing._t=b.getAttribute('data-t'); VIEWS.billing(); }); });
  rowClicks();
};

VIEWS.frontdesk=function(){
  var f=FDF(), c=K.fd, show=f.rows.slice(0,c.show||f.rows.length);
  $('#main').innerHTML='<h2>'+L.navDesk+'</h2><p class="panel-sub">'+c.sub+' · '+locName()+'</p>'
    + tilesHTML(c.tiles(f, FACTS()))
    + '<div class="cols2"><section class="block"><h3>'+c.listTitle+'</h3><div class="tscroll"><table class="tbl"><tr>'+c.head.map(function(h2){return '<th>'+h2+'</th>';}).join('')+'</tr>'
    + show.map(function(r){ var cls=r.st===c.done?"":r.st===c.later?"info":"good";
        return '<tr'+(r.p?' class="click" data-id="'+r.p.id+'"':'')+'><td>'+r.tm+'</td><td><b>'+esc(r.who||c.staffName(r))+'</b></td><td>'+r.type+(r.extra?' <span style="color:var(--mut)">· '+r.extra.booked+'/'+r.extra.cap+' booked</span>':'')+'</td><td><span class="chip '+cls+'">'+r.st+'</span></td></tr>'; }).join('')
    + '</table></div>'+(show.length<f.rows.length?'<p class="srcline">Showing '+show.length+' of '+f.rows.length+', sorted by time.</p>':'')+'</section>'
    + '<section class="block"><h3>Holds & flags</h3><div class="rowlist">'
    + c.holds(FACTS()).map(function(x){return '<div class="r"><div class="grow"><div class="ttl">'+esc(x[0])+'</div><div class="sub">'+esc(x[1])+'</div></div><span class="chip '+x[2]+'">'+x[3]+'</span></div>';}).join('')
    + '</div><p class="srcline">'+c.src+'</p></section></div>' + foot();
  rowClicks();
};

VIEWS.optical=function(){
  var f=POSF(), c=K.pos;
  $('#main').innerHTML='<h2>'+L.navPos+'</h2><p class="panel-sub">'+c.sub+'</p>'
    + tilesHTML([[c.tToday, m0(f.totC), f.sales.length+" "+c.tTodaySub],[c.tMonth, d0(f.month[11]), "month to date, before tax"],["Under reorder point", String(f.low.length), c.po ? "PO drafted — "+d0(c.po.amt) : "", "bad"],[c.tAvg, f.sales.length ? m2(Math.round(f.totC/f.sales.length)) : "—", "today"]])
    + '<div class="cols2"><section class="block"><h3>'+c.stockTitle+'</h3><div class="tscroll"><table class="tbl"><tr><th>Item</th><th class="num">Price</th><th class="num">On hand</th><th class="num">Reorder at</th></tr>'
    + c.products.map(function(p){ var low=p[2]<p[3]; return '<tr><td><b>'+p[0]+'</b>'+(low?' <span class="chip bad">Low</span>':'')+'</td><td class="num">'+(p[1]?m2(Math.round(p[1]*100)):"Free")+'</td><td class="num">'+(p[4]?"—":p[2])+'</td><td class="num">'+(p[4]?"—":p[3])+'</td></tr>'; }).join('')
    + '</table></div></section>'
    + '<section class="block"><h3>'+c.salesTitle+'</h3><div class="tscroll"><table class="tbl"><tr><th>Time</th><th>'+c.rCol+'</th><th>Items</th><th>'+c.payCol+'</th><th class="num">Total</th></tr>'
    + f.sales.map(function(s){ return '<tr><td>'+s.tm+'</td><td>'+s.r+'</td><td>'+esc(s.it)+'<div class="sub" style="color:var(--mut);font-size:11px">'+esc(s.who)+'</div></td><td>'+s.pay+'</td><td class="num">'+m2(s.amtC)+'</td></tr>'; }).join('')
    + '<tr><td colspan="4"><b>'+f.sales.length+' '+c.tTodaySub+'</b></td><td class="num"><b>'+m2(f.totC)+'</b></td></tr></table></div>'
    + '<h3 style="margin-top:14px">'+c.chartTitle+'</h3>'+barSVG({values:f.month,labels:M12,color:'var(--c2)',fmt:function(v){return d0(v);}})+'</section></div>' + foot();
};

VIEWS.staff=function(){
  var f=STF();
  $('#main').innerHTML='<h2>Staff & payroll</h2><p class="panel-sub">'+locName()+' · pay period Nov 1 – Nov 14</p>'
    + tilesHTML([["Payroll this period",d0(f.pay),f.st.length+" people"],["Hours this period",sum(f.st.map(function(s){return s.hrs;})).toLocaleString(),"all roles"],["Payroll exceptions",String(f.exc),f.exc?"missed punches to resolve":"none","bad"],["Overtime hours",String(f.ot),"over 80 in the period"]])
    + '<section class="block"><h3>Team</h3><div class="tscroll"><table class="tbl"><tr><th>Name</th><th>Role</th><th>'+T.LocWord+'</th><th class="num">Hours</th><th class="num">Rate</th><th class="num">Pay (period)</th><th></th></tr>'
    + f.st.map(function(s){ return '<tr><td><b>'+esc(s.name)+'</b></td><td>'+s.role+'</td><td>'+s.loc+'</td><td class="num">'+s.hrs+'</td><td class="num">'+d0(s.rate)+'/hr</td><td class="num">'+d0(s.hrs*s.rate)+'</td><td>'+(s.exc?'<span class="chip bad">Missed punch</span>':'')+'</td></tr>'; }).join('')
    + '</table></div></section>' + foot();
};

VIEWS.leads=function(){
  var lf=LEADF(), won=lf.filter(function(l){return l.stage==="joined";}).length;
  $('#main').innerHTML='<div class="between"><div><h2>'+L.navLeads+'</h2><p class="panel-sub">'+K.lead.sub+'</p></div><button class="act primary" id="addlead">+ Add lead</button></div>'
    + '<div class="board">'+K.lead.stages.map(function(sg){
      var items=lf.filter(function(l){return l.stage===sg[0];}), v=sum(items.map(function(l){return l.valC;}));
      return '<div class="col"><div class="head"><span class="sdot" style="background:'+sg[2]+'"></span><b>'+sg[1]+'</b><span class="n">'+items.length+'</span><span class="sum">'+m2(v)+'/mo</span></div><div class="cards">'
        + items.map(function(l){ return '<div class="cardk"><div class="who">'+esc(l.name)+'</div><div class="sub">'+l.plan+' · '+m2(l.valC)+'/mo · '+l.loc+'</div><div class="chips"><span class="chip '+(l.src==="AI receptionist"?"acc":l.src==="Website"?"info":"")+'">'+l.src+'</span>'+(l.ah?'<span class="chip acc">After hours</span>':'')+'</div><div class="next">Added '+(l.days===0?'today':l.days+'d ago')+'<br><b>Next:</b> '+esc(l.next)+'<br>'+esc(l.owner)+'</div></div>'; }).join('')
        + '</div></div>'; }).join('')+'</div>'
    + '<p class="srcline">'+lf.length+' leads on the board · '+won+' '+K.lead.wonWord+' ('+pc(100*won/Math.max(1,lf.length),0)+') · '+lf.filter(function(l){return l.wait;}).length+' still waiting on a first reply.</p>' + foot();
  $('#addlead').addEventListener('click',function(){ toast('Demo'); });
};

VIEWS.receptionist=function(){
  var c=K.rx;
  function tiles(){ var off=CALLS.filter(function(x){return x.off;}).length, bk=CALLS.filter(function(x){return x.booked;}), val=sum(bk.map(function(x){return x.vn||0;}));
    return tilesHTML([["AI-handled calls, last 24 hours",String(CALLS.length),off+" "+c.offSub,"good"],[c.bookedLabel,String(bk.length),d0(val)+" "+c.bookedSub],["Median pickup","4 sec","the AI answers on the first ring","good"],[c.saveLabel,String(CALLS.filter(function(x){return x.saved;}).length),c.saveSub]]); }
  function rowHTML(x, open){ return '<details class="callrow"'+(open?' open':'')+'><summary tabindex="0"><div class="r"><span class="meta">'+x.t+'</span><div class="grow"><div class="ttl">'+esc(x.w)+'</div><div class="sub">'+esc(x.x)+'</div></div>'+x.c.map(function(ch){return '<span class="chip '+ch[0]+'">'+ch[1]+'</span>';}).join('')+'<span class="money">'+x.v+'</span><span class="meta">'+x.d+'</span></div></summary><div class="transcript">'+x.tr+'</div></details>'; }
  $('#main').innerHTML='<div class="between"><div><h2>AI receptionist</h2><p class="panel-sub">'+c.sub+'</p></div><button class="act primary" id="simcall">▶ Simulate incoming call</button></div>'
    + '<div id="rxtiles">'+tiles()+'</div>'
    + '<section class="block"><h3>Call log — last 24 hours</h3><p class="panel-sub">Every call the AI handled. Tap any call for the transcript.</p><div id="livecall"></div><div id="calls">'
    + CALLS.map(function(x){ return rowHTML(x,false); }).join('')
    + '</div></section>' + foot();
  var running=false, reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#simcall').addEventListener('click',function(){
    if(running) return; running=true;
    var lines=c.sim.lines, box=$('#livecall'), i=0;
    box.innerHTML='<div class="ringing"><div class="r"><span><span class="pulse"></span><b>Incoming call</b></span><span class="meta">'+c.sim.from+'</span></div><div id="simlines"></div></div>';
    var lv=$('#simlines');
    (function next(){ if(i<lines.length){ var l=lines[i++]; lv.innerHTML+='<div class="tline"><b>'+l[0]+':</b> '+esc(l[1])+'</div>'; setTimeout(next, reduced?60:1050); }
      else { box.innerHTML=''; var row=JSON.parse(JSON.stringify(c.sim.row)); row.tr=lines.map(function(l){return '<b>'+l[0]+':</b> '+esc(l[1]);}).join(' ');
        CALLS.unshift(row); $('#calls').insertAdjacentHTML('afterbegin',rowHTML(row,true)); $('#rxtiles').innerHTML=tiles(); toast(c.sim.toast); running=false; } })();
  });
};

VIEWS.campaigns=function(){
  var c=K.camp, F=FACTS(), rows=c.rows, sent=rows.filter(function(r){return r.st[1]==="Sent";});
  var msgs=sum(rows.filter(function(r){return r.thisMonth;}).map(function(r){return r.d;}));
  var segs=c.segs(F);
  $('#main').innerHTML='<div class="between"><div><h2>Campaigns</h2><p class="panel-sub">Every send, with what it actually did.</p></div><a class="act primary" href="#newcampaign" style="text-decoration:none">+ New campaign</a></div>'
    + tilesHTML([["Campaigns",String(rows.length),sent.length+" sent"],["Messages delivered this month",msgs.toLocaleString(),rows.filter(function(r){return r.thisMonth;}).length+" campaigns"],[c.winLabel,c.winVal,c.winSub,"good"],["Scheduled · drafts",rows.filter(function(r){return r.st[1]==="Scheduled";}).length+" · "+rows.filter(function(r){return r.st[1]==="Draft";}).length]])
    + '<section class="block"><div class="tscroll"><table class="tbl"><tr><th>Campaign</th><th>Status</th><th>Channel</th><th>Sent</th><th class="num">Audience</th><th class="num">Delivered</th><th class="num">Clicks</th><th>Result</th></tr>'
    + rows.map(function(r){ return '<tr><td><b>'+esc(r.n)+'</b><div class="sub" style="color:var(--mut);font-size:11px">'+esc(r.s)+'</div></td><td><span class="chip '+r.st[0]+'">'+r.st[1]+'</span></td><td>'+r.ch+'</td><td>'+r.sent+'</td><td class="num">'+(r.a||"–")+'</td><td class="num">'+(r.d||"–")+'</td><td class="num">'+(r.cl||"–")+'</td><td><b>'+(r.res||"–")+'</b></td></tr>'; }).join('')
    + '</table></div></section>'
    + '<section class="block"><h3>Segments</h3><p class="panel-sub">Saved audiences with live counts, worked out from the '+T.book+'. '+c.segSub+'</p><div class="tscroll"><table class="tbl"><tr><th>Segment</th><th class="num">'+T.People+'</th><th class="num">Reachable by email</th><th class="num">Reachable by SMS</th></tr>'
    + segs.map(function(sg){ return '<tr><td><b>'+sg[0]+'</b></td><td class="num">'+sg[1].length+'</td><td class="num">'+sg[1].filter(function(p){return p.emailOk;}).length+'</td><td class="num">'+sg[1].filter(function(p){return p.smsOk;}).length+'</td></tr>'; }).join('')
    + '</table></div></section>' + foot();
};

VIEWS.newcampaign=function(){
  var c=K.camp.builder, a=AG();
  var match=a.cur.filter(c.match), out=match.filter(function(p){return !p.smsOk;}), get=match.length-out.length;
  $('#main').innerHTML='<div class="crumb"><a href="#campaigns">Campaigns</a> › New campaign</div>'
    + '<h2>'+c.title+'</h2><p class="panel-sub">Pick who it\'s for from live data, write the message, then send or schedule it.</p>'
    + '<div class="cols2"><div><section class="block"><h3>Describe who you want</h3><p class="panel-sub">In your own words. It becomes rules you can check and change below.</p>'
    + '<textarea class="aud" id="audtxt">'+esc(c.text)+'</textarea>'
    + '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="act primary" id="buildaud">⚡ Build audience</button><span style="color:var(--mut);font-size:12px;align-self:center">'+c.hint+'</span></div>'
    + '<div style="margin-top:14px"><h3>Rules</h3><p class="panel-sub">'+T.People+' must match every rule.</p><div id="rules">'
    + c.rules.map(function(r){ return '<div class="rule"><span class="chip">'+r[0]+'</span><span class="pillbox">'+r[1]+'</span><span>'+r[2]+'</span><span class="pillbox">'+r[3]+'</span></div>'; }).join('')
    + '</div></div></section></div>'
    + '<div><section class="block"><h3>Audience</h3><p class="panel-sub">'+locName()+'</p><div class="v" style="font-family:var(--display);font-size:34px;font-weight:700" id="audn">'+get+'</div><p class="panel-sub" id="audsub">'+T.people+' get it · '+match.length+' match the rules · '+get+' messages</p>'
    + '<div class="excl"><b>Left out automatically — '+out.length+'</b><br>Opted out of SMS: '+out.length+'<br><br>'+c.exclNote+'</div>'
    + '<div style="margin-top:14px;font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-weight:700">A few of them</div><div class="rowlist">'
    + match.filter(function(p){return p.smsOk;}).slice(0,4).map(function(p){ return '<div class="r"><div class="grow"><div class="ttl">'+esc(p.name)+'</div><div class="sub">'+c.rowSub(p)+'</div></div></div>'; }).join('')
    + '</div><button class="act primary" style="width:100%;margin-top:12px" id="contmsg">Continue to message</button></section></div></div>' + foot();
  $('#buildaud').addEventListener('click',function(){ toast('Audience built — '+get+' '+T.people+' match'); });
  $('#contmsg').addEventListener('click',function(){ toast('Demo — continue to message'); });
};

VIEWS.reports=function(){
  var tab=VIEWS.reports._t||"growth", body='', a=AG(), s=SER();
  if(tab==="growth"){
    var src=K.sources.map(function(nm){ var n=s.bySrc[9][nm]+s.bySrc[10][nm]+s.bySrc[11][nm];
      var joiners=a.ps.filter(function(p){return p.src===nm && p.monthsIn<=2 && p.status!=="cancelled" && p.status!=="paused";}), dC=sum(joiners.map(function(p){return p.rateC;}));
      var coh=a.ps.filter(function(p){return p.src===nm && p.monthsIn>=3 && p.monthsIn<=15;}), stay=coh.filter(function(p){return p.status!=="cancelled";}).length;
      return {s:nm, n:n, dC:dC, coh:coh.length, stay:stay}; });
    var tot90=sum(src.map(function(x){return x.n;})), tot12=sum(s.j), dTot=sum(src.map(function(x){return x.dC;}));
    var top=src.slice().sort(function(x,y){return y.n-x.n;})[0], cohT=sum(src.map(function(x){return x.coh;})), stayT=sum(src.map(function(x){return x.stay;}));
    var best=src.filter(function(x){return x.coh>=10;}).sort(function(x,y){return y.stay/y.coh-x.stay/x.coh;})[0]||src[0];
    body = tilesHTML([[L.joins+", last 3 months",String(tot90),tot12+" in 12 months"],["Monthly dues from those "+L.joinsV,m2(dTot),"from "+T.people+" still paying"],["Top source",top.s,pc(100*top.n/Math.max(1,tot90),0)+" of "+L.joinsV+" in 3 months"],["Still a "+T.person+" today",pc(100*stayT/Math.max(1,cohT),1),"of those who joined 3–15 months ago · best: "+best.s+", "+pc(100*best.stay/Math.max(1,best.coh),1),"good"]])
    + '<section class="block"><h3>'+L.joins+' by source</h3><p class="panel-sub">New agreements each month, by where the '+T.person+' first came from.</p>'
    + stackSVG({labels:M12,series:K.sources.map(function(nm,i){ return {name:nm,color:'var(--c'+(i+1)+')',values:s.bySrc.map(function(m){return m[nm];})}; })})
    + '</section>'
    + '<section class="block"><h3>Sources</h3><p class="panel-sub">'+L.joins+' in the last 3 months and what they\'re worth. Retention looks at '+T.people+' who joined 3 to 15 months ago.</p><div class="tscroll"><table class="tbl"><tr><th>Source</th><th class="num">'+L.joins+', 3 months</th><th class="num">Share</th><th class="num">Monthly dues they bring</th><th class="num">Still here today</th></tr>'
    + src.map(function(x,i){ return '<tr><td><span style="display:inline-flex;align-items:center;gap:7px"><i style="width:9px;height:9px;border-radius:3px;background:var(--c'+(i+1)+');display:inline-block"></i><b>'+x.s+'</b></span></td><td class="num">'+x.n+'</td><td class="num">'+pc(100*x.n/Math.max(1,tot90),1)+'</td><td class="num">'+m2(x.dC)+'</td><td class="num">'+(x.coh?pc(100*x.stay/x.coh,1):"–")+'</td></tr>'; }).join('')
    + '<tr><td><b>All sources</b></td><td class="num"><b>'+tot90+'</b></td><td class="num"><b>100.0%</b></td><td class="num"><b>'+m2(dTot)+'</b></td><td class="num"><b>'+pc(100*stayT/Math.max(1,cohT),1)+'</b></td></tr></table></div></section>';
  } else if(tab==="retention"){
    var c12=sum(s.c), churn=0, k; for(k=1;k<11;k++) churn+=s.c[k]/Math.max(1,s.mem[k-1]); churn=100*churn/10;
    var reasons=K.reasons.map(function(r){ return [r[0], a.canc.filter(function(p){return p.reason===r[0];}).length]; });
    body = tilesHTML([[L.cancels+", this month",String(s.c[11]),c12+" in 12 months"],["Average monthly churn",pc(churn,2),"last 10 full months","good"],[L.riskLabel,String(a.risk.length),L.riskSub,"bad"],["Monthly dues at risk",m0(a.riskC),"what those "+T.people+" pay each month","bad"]])
    + '<div class="cols2" style="grid-template-columns:1fr 1fr"><section class="block"><h3>'+L.cancels+' by month</h3>'
    + barSVG({values:s.c,labels:M12,color:'var(--c5)'})
    + '</section><section class="block"><h3>Why '+T.people+' leave</h3><p class="panel-sub">Every '+L.cancel1+' in the last 12 months.</p><div class="tscroll"><table class="tbl"><tr><th>Reason</th><th class="num">'+L.cancels+'</th><th class="num">Share</th></tr>'
    + reasons.map(function(r){ return '<tr><td>'+r[0]+'</td><td class="num">'+r[1]+'</td><td class="num">'+pc(100*r[1]/Math.max(1,c12),1)+'</td></tr>'; }).join('')
    + '<tr><td><b>All</b></td><td class="num"><b>'+c12+'</b></td><td class="num"><b>100.0%</b></td></tr></table></div></section></div>'
    + '<section class="block"><h3>At-risk '+T.people+'</h3><p class="panel-sub">'+L.riskNote+'</p><div class="rowlist">'
    + a.risk.slice(0,5).map(function(p){ return '<a href="#patient-'+p.id+'" style="color:inherit;text-decoration:none"><div class="r"><div class="grow"><div class="ttl">'+esc(p.name)+'</div><div class="sub">'+p.plan+' · '+L.lastCol.toLowerCase()+': '+lastVText(p).toLowerCase()+'</div></div><span class="money">'+m2(p.rateC*12)+'/yr</span><span class="chip warn">At risk</span></div></a>'; }).join('')
    + '</div><p class="srcline">Showing 5 of '+a.risk.length+'.</p></section>';
  } else {
    var older=a.bill.filter(function(p){return p.rateC<p.priceC;}), gapC=sum(older.map(function(p){return p.priceC-p.rateC;})), totC=0, cnt2=0;
    body = tilesHTML([["Monthly dues on the book",m0(a.duesC),a.bill.length.toLocaleString()+" paying "+T.people],["Average dues",m2(Math.round(a.duesC/Math.max(1,a.bill.length))),"per "+T.person+" per month"],[L.rec12,d0(sum(s.recD)),L.rec12Sub,"good"],[T.People+" on an older rate",String(older.length),m2(gapC)+" a month below today's prices","bad"]])
    + '<section class="block"><h3>Dues by '+T.planCol.toLowerCase()+'</h3><p class="panel-sub">What paying '+T.people+' are charged each month. Average rate is below today\'s rate where long-standing '+T.people+' are still on older pricing.</p><div class="tscroll"><table class="tbl"><tr><th>'+T.planCol+'</th><th class="num">Paying '+T.people+'</th><th class="num">Monthly dues</th><th class="num">Share</th><th class="num">Average rate</th><th class="num">Today\'s rate</th><th class="num">On an older rate</th></tr>'
    + K.plans.map(function(pl){ var ps=a.bill.filter(function(p){return p.plan===pl[0];}), dC=sum(ps.map(function(p){return p.rateC;})); totC+=dC; cnt2+=ps.length;
        return '<tr><td><b>'+pl[0]+'</b></td><td class="num">'+ps.length.toLocaleString()+'</td><td class="num">'+m2(dC)+'</td><td class="num">'+pc(100*dC/Math.max(1,a.duesC),1)+'</td><td class="num">'+(ps.length?m2(Math.round(dC/ps.length)):"–")+'</td><td class="num">'+m2(Math.round(pl[1]*100))+'</td><td class="num">'+ps.filter(function(p){return p.rateC<p.priceC;}).length+'</td></tr>'; }).join('')
    + '<tr><td><b>All</b></td><td class="num"><b>'+cnt2.toLocaleString()+'</b></td><td class="num"><b>'+m2(totC)+'</b></td><td class="num"><b>100.0%</b></td><td class="num">'+m2(Math.round(totC/Math.max(1,cnt2)))+'</td><td class="num">–</td><td class="num"><b>'+older.length+'</b></td></tr></table></div></section>'
    + '<section class="block"><h3>'+L.collTitle+'</h3><p class="panel-sub">'+L.collSub+'</p>'
    + stackSVG({labels:M12,fmt:function(v){return d0(v);},series:[{name:L.sRec,color:"var(--c3)",values:s.recD},{name:L.sWo,color:"var(--c5)",values:s.woD},{name:L.sOpen,color:"var(--c1)",values:s.opD}]})
    + '</section>';
  }
  $('#main').innerHTML='<h2>Reports</h2><p class="panel-sub">'+locName()+'. Every figure is worked out from the '+T.book+' and billing, so it matches what each screen shows.</p>'
    + '<div class="seg">'+[["growth","Growth & attribution"],["retention","Retention"],["revenue","Revenue"]].map(function(sg){return '<button data-t="'+sg[0]+'" aria-pressed="'+(tab===sg[0])+'">'+sg[1]+'</button>';}).join('')+'</div>'
    + body + foot();
  $$('.seg button').forEach(function(b){ b.addEventListener('click',function(){ VIEWS.reports._t=b.getAttribute('data-t'); VIEWS.reports(); }); });
};

VIEWS.agent=function(){
  var F=FACTS(), jf=JF(), s=F.s;
  var w=VIEWS.agent._w || (VIEWS.agent._w=K.waiting(F));
  var dec=VIEWS.agent._d || (VIEWS.agent._d=K.decided(H));
  $('#main').innerHTML='<h2>Back-office agent</h2><p class="panel-sub">'+L.agentSub+'</p>'
    + tilesHTML([["Tasks completed, 30 days",jf.tasks.toLocaleString(),"across "+jf.list.length+" jobs"],["Staff hours saved, 30 days",jf.hours.toFixed(1),"about "+(jf.hours/160).toFixed(1)+" of a full-time person"],[L.recTileMonth,d0(s.recD[11]),s.nrec[11]+" "+T.people,"good"],["Decisions waiting on you",String(w.length),L.waitSub]])
    + '<section class="block"><div class="between"><h3>Waiting on you <span class="q-count">'+(w.length||'')+'</span></h3></div><p class="panel-sub">'+L.safety+'</p><div class="rowlist" id="waiting">'
    + (w.length ? w.map(function(x,i){ return '<div><div class="r"><div class="grow"><div class="ttl">'+esc(x.t)+'</div><div class="sub">'+esc(x.s)+'</div></div><span class="chip '+x.c[0]+'">'+x.c[1]+'</span><span class="money">'+x.m+'</span><button class="act ghostbad" data-dec="'+i+'">✕ Decline</button><button class="act primary" data-app="'+i+'">✓ Approve</button></div><div class="rec">'+x.rec+'</div></div>'; }).join('') : '<div class="empty">Queue clear — nothing is waiting on you.</div>')
    + '</div></section>'
    + '<section class="block"><h3>What the agent does</h3><p class="panel-sub">'+jf.list.length+' of '+jf.list.length+' jobs are on. Hours saved = runs × the time each one took by hand.</p><div class="jobs">'
    + jf.list.map(function(j){ return '<div class="job"><div class="head"><b>'+j.n+'</b><span class="tog" title="On"></span></div><span class="chip '+(j.m?'good':'')+'" style="align-self:flex-start">'+(j.m?'On · moves money':'On')+'</span><div class="what">'+j.w+'</div><div class="before"><b>Before:</b> '+j.b+'</div><div class="stats"><div><div class="k">Runs, 30 days</div><div class="v">'+j.r.toLocaleString()+'</div></div><div><div class="k">Staff time saved</div><div class="v">'+j.h.toFixed(1)+' hr</div></div><div><div class="k">By hand, each</div><div class="v">'+j.each+' min</div></div></div></div>'; }).join('')
    + '</div></section>'
    + '<section class="block"><h3>Decided</h3><p class="panel-sub">What was handled after approval, most recent first.</p><div class="rowlist">'
    + dec.map(function(x){ return '<div class="r"><div class="grow"><div class="ttl">'+esc(x.t)+'</div><div class="sub">'+esc(x.s)+'</div></div><span class="decided-time">'+esc(x.time)+'</span></div>'; }).join('')
    + '</div></section>' + foot();
  $('#waiting').addEventListener('click',function(e){
    var ap=e.target.closest('[data-app]'), dc=e.target.closest('[data-dec]'); if(!ap&&!dc) return;
    var i=Number((ap||dc).getAttribute(ap?'data-app':'data-dec')), item=w.splice(i,1)[0];
    dec.unshift(ap ? {t:item.done, s:item.s, time:"Just now"} : {t:"Declined: "+item.t.charAt(0).toLowerCase()+item.t.slice(1), s:"Nothing was sent or charged. The agent re-raises it only if the numbers change.", time:"Just now"});
    VIEWS.agent();
  });
};

/* ============ search, location, tab pill ============ */
var sd=$('#searchdrop');
$('#search').addEventListener('input',function(){
  var q=this.value.trim().toLowerCase();
  if(q.length<2){ sd.hidden=true; return; }
  var hits=P.filter(function(p){return p.name.toLowerCase().indexOf(q)>-1;}).slice(0,8);
  sd.innerHTML=hits.length ? hits.map(function(p){return '<button data-id="'+p.id+'"><b>'+esc(p.name)+'</b> <span class="m">· '+p.plan+' · '+p.loc+'</span></button>';}).join('') : '<button disabled><span class="m">No '+T.people+' match</span></button>';
  sd.hidden=false;
});
sd.addEventListener('click',function(e){ var b=e.target.closest('button[data-id]'); if(!b)return; sd.hidden=true; $('#search').value=''; location.hash='patient-'+b.getAttribute('data-id'); });
document.addEventListener('click',function(e){ if(!e.target.closest('#searchwrap')) sd.hidden=true; });
document.addEventListener('keydown',function(e){ if((e.metaKey||e.ctrlKey)&&e.key==='k'){ e.preventDefault(); $('#search').focus(); } });
$('#loc').addEventListener('change',function(){ LOC=this.value; VIEWS.agent._w=null; route(); });

var __segFrom=null;
document.addEventListener('click',function(e){ var b=e.target.closest('.seg button'); if(!b) return; var cur=b.closest('.seg').querySelector('button[aria-pressed="true"]'); if(cur) __segFrom={l:cur.offsetLeft,w:cur.offsetWidth}; },true);
function decorateSegs(){ $$('.seg').forEach(function(seg){ if(seg.querySelector('.thumb')) return; var on=seg.querySelector('button[aria-pressed="true"]'); if(!on) return;
  var th=document.createElement('span'); th.className='thumb'; seg.insertBefore(th,seg.firstChild);
  var from=__segFrom||{l:on.offsetLeft,w:on.offsetWidth}; th.style.left=from.l+'px'; th.style.width=from.w+'px';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ th.style.left=on.offsetLeft+'px'; th.style.width=on.offsetWidth+'px'; }); }); __segFrom=null; }); }
new MutationObserver(decorateSegs).observe($('#main'),{childList:true});

/* shell text from the pack */
$('#brandname').textContent=K.brand;
$('#search').placeholder="Search "+T.people+"…  ⌘K";
$('#loc').innerHTML='<option value="all">'+T.allLoc+'</option>'+LOCS.map(function(l){return '<option value="'+l+'">'+l+'</option>';}).join('');
$('#me').innerHTML='<span class="av">'+K.persona.charAt(0)+'</span>'+K.persona+' · Operations';
route();
decorateSegs();
