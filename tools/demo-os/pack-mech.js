/* Kestrel Mechanical — industrial & commercial mechanical contractor, two yards.
   All prices come from one rate sheet (below). Sources for the ranges:
   - Labor: mechanical contractors' published T&M billing rates — journeyman pipefitter $65–$88 straight time,
     $97–$119 overtime, $124–$146 double time; apprentice $43–$70; refrigeration specialist $70–$103 (2022 sheet,
     priced up for 2026); material markup 10–20%, subcontract markup 10–13%.
   - Welding: Texas pressure-vessel / boiler welders $160–$200+/hr with rig; rig truck costs ≈ $45/hr.
   - Cranes: Texas operated crane rates — 40-ton $205/hr, 100-ton $355/hr, 4-hr minimum, portal to portal,
     rigger $95/hr, 7% fuel surcharge.
   - Mileage $1–$2/mi beyond a 20–30 mi radius. Per diem: GSA FY2027 San Antonio, $149 lodging + $74 meals. */
var RT={gf:["General foreman",125],fm:["Foreman",110],jp:["Journeyman pipefitter",95],wd:["Certified pressure welder",105],rt:["HVAC / refrigeration tech",105],hp:["Helper",62]};
var TRUCK=35, RIG=45, CR40=205, CR100=355, RIGGER=95, FUELPCT=0.07, SUBPCT=0.10, MATPCT=0.15, PERDIEM=223, MILE=1.5;
var CALLOUT=4*1.5*(RT.jp[1]+RT.hp[1])+4*TRUCK;   /* emergency: 4-hr minimum, journeyman + helper on overtime, service truck = $1,082 */
var SERVICE=5.5*RT.jp[1]+5.5*TRUCK;              /* repair: 4 hr on site + 1.5 hr travel at straight time, truck = $715 */
var NOHEAT=SERVICE;
function LN(d,q,u,r,x){ var o={d:d,q:q,u:u,r:r,a:Math.round(q*r*100)}; if(x) for(var k in x) o[k]=x[k]; return o; }
function crew(lines,key,n,hrs,mult,tag){ lines.push(LN(RT[key][0]+" — "+tag+(n>1?" ("+n+" workers)":""), n*hrs, "hr", RT[key][1]*mult)); }
var TM={
  month:function(m, plan, out){
    var day = m===0 ? ri(1,16) : ri(1,28), x=rnd(), ps=K.tmShutP[plan[0]];
    if(x<ps) out.push(TM.shutdown(m,day));
    else if(x<ps+0.08) out.push(TM.emergency(m,day));
    else if(x<ps+0.43) out.push(TM.repair(m,day));
  },
  repairs:["Repair — condensate pump replaced","Repair — steam trap survey and replacements","Repair — RTU compressor diagnostic","Repair — leaking flange, gasket replaced","Repair — pump seal replaced","Repair — PRV station rebuild","Repair — glycol loop leak","Repair — chiller refrigerant leak"],
  emergencies:["Emergency call-out — walk-in cooler down","Emergency call-out — steam leak at header","Emergency call-out — chiller tripped","Emergency call-out — boiler low-water lockout","Emergency call-out — air compressor down"],
  shutdowns:["Planned shutdown — boiler retube","Planned shutdown — steam header replacement","Planned shutdown — chiller tie-in","Planned shutdown — process piping reroute","Planned shutdown — heat exchanger swap"],
  repair:function(m,day){
    var t=pick(TM.repairs), key=/RTU|chiller|glycol/i.test(t)?"rt":"jp", h=ri(3,9), tr=pick([1,1.5,2]), help=rnd()<0.5, lines=[];
    crew(lines,key,1,h,1,"straight time");
    if(help) crew(lines,"hp",1,h,1,"straight time");
    lines.push(LN("Travel time, portal to portal — "+RT[key][0].toLowerCase(),tr,"hr",RT[key][1]));
    if(help) lines.push(LN("Travel time, portal to portal — helper",tr,"hr",RT.hp[1]));
    lines.push(LN("Service truck",h+tr,"hr",TRUCK));
    TM.mat(lines, ri(15,220)*10, "parts and fittings");
    return TM.tk(m,day,t,lines);
  },
  emergency:function(m,day){
    var t=pick(TM.emergencies), h=Math.max(4,ri(2,7)), lines=[], tag="overtime, after hours"+(h===4?", 4-hr minimum":"");
    lines.push(LN(RT.jp[0]+" — "+tag,h,"hr",RT.jp[1]*1.5,{min4:1}));
    lines.push(LN(RT.hp[0]+" — "+tag,h,"hr",RT.hp[1]*1.5,{min4:1}));
    lines.push(LN("Service truck",h,"hr",TRUCK));
    TM.mat(lines, ri(8,90)*10, "parts");
    return TM.tk(m,day,t,lines);
  },
  shutdown:function(m,day){
    var t=pick(TM.shutdowns), d=ri(3,6), away=rnd()<0.35, cw={fm:1,jp:ri(3,4),wd:2,hp:2}, lines=[], n=0, k;
    for(k in cw){ n+=cw[k]; crew(lines,k,cw[k],d*8,1,"straight time, "+d+" days × 8 hr"); crew(lines,k,cw[k],d*2,1.5,"overtime, "+d+" days × 2 hr"); }
    lines.push(LN("Welding rig — truck and machine (2 rigs, "+d+" days × 10 hr)",2*d*10,"hr",RIG));
    lines.push(LN("Crew truck ("+d+" days × 10 hr)",d*10,"hr",TRUCK));
    var c=rnd();
    if(c<0.8){ var big=c<0.3, ch=ri(5,9);
      var a1=LN("Crane — "+(big?"100":"40")+"-ton, operated (subcontract), portal to portal",ch,"hr",big?CR100:CR40), a2=LN("Rigger / signal person (subcontract)",ch,"hr",RIGGER);
      lines.push(a1,a2);
      var base=a1.a+a2.a, f=Math.round(base*FUELPCT);
      lines.push({d:"Crane fuel surcharge — 7%",q:null,u:"",r:null,a:f,baseC:base,pct:FUELPCT});
      lines.push({d:"Subcontract markup — 10%",q:null,u:"",r:null,a:Math.round((base+f)*SUBPCT),baseC:base+f,pct:SUBPCT}); }
    TM.mat(lines, ri(60,240)*100, "pipe, fittings, valves, gaskets");
    if(away){ var mi=ri(12,24)*10;
      for(k in cw) lines.push(LN("Travel time — "+RT[k][0].toLowerCase()+" ("+cw[k]+" × 4 hr, 2 each way)",cw[k]*4,"hr",RT[k][1]));
      lines.push(LN("Mileage — 3 vehicles × "+mi+" mi beyond the 30-mi radius",3*mi,"mi",MILE));
      lines.push(LN("Per diem — "+n+" workers × "+d+" days (GSA rate)",n*d,"day",PERDIEM)); }
    return TM.tk(m,day,t+(away?" (out of town)":""),lines);
  },
  mat:function(lines,costD,what){ var c=costD*100; lines.push({d:"Materials — "+what+" (cost "+m2(c)+" + 15%)",q:null,u:"",r:null,a:Math.round(c*(1+MATPCT)),costC:c}); },
  tk:function(m,day,title,lines){ var a=0; lines.forEach(function(l){ a+=l.a; }); return {m:m,day:day,title:title,lines:lines,a:a}; }
};
/* demo video: open a customer whose recent ticket is the biggest */
function __pickRow(){ var rows=$$('tr.click').slice(0,12), best=-1, bestA=0;
  rows.forEach(function(tr,i){ var p=P.filter(function(q){ return q.id===tr.getAttribute('data-id'); })[0];
    if(!/plant/i.test(p.plan)) return; p.led.forEach(function(l){ if(l.kind==="tm" && l.m<=3 && l.amt>bestA){ bestA=l.amt; best=i; } }); });
  return best<0 ? 6 : best; }
var K={
  seed:20261118, brand:"Kestrel Mechanical", title:"Kestrel Mechanical OS", persona:"Marcus", N:150,
  biz:["Logistics","Foods","Plastics","Chemical","Distribution","Metal Works","Packaging","Cold Storage","Brewing","Paper","Fabrication","Water Treatment","Power","Medical Center","Office Park","Hotel","Apartments","Markets"],
  locs:["San Antonio Yard","Austin Yard"], locW:[55,45],
  statusW:[["active",82],["past_due",7],["paused",3],["cancelled",8]],
  plans:[["Quarterly HVAC PM",280,34],["Quarterly boiler & steam PM",512,24],["Monthly plant PM",1536,30],["Multi-site plant PM",3020,12]],
  /* each agreement = visits × hours × (crew rates + truck) ÷ 12, straight off the rate sheet */
  planCalc:{"Quarterly HVAC PM":[4,6,["rt"]],"Quarterly boiler & steam PM":[4,8,["jp","hp"]],"Monthly plant PM":[12,8,["jp","hp"]],"Multi-site plant PM":[12,10,["fm","jp","hp"]]},
  planInfo:{"Quarterly HVAC PM":"4 visits a year · 1 HVAC tech · 6 hr a visit · priced at rate-sheet hours","Quarterly boiler & steam PM":"4 visits a year · journeyman + helper · 8 hr a visit · priced at rate-sheet hours","Monthly plant PM":"12 visits a year · journeyman + helper · 8 hr a visit · priced at rate-sheet hours","Multi-site plant PM":"12 visits a year · foreman, journeyman + helper · 10 hr a visit · priced at rate-sheet hours"},
  tmShutP:{"Quarterly HVAC PM":0.01,"Quarterly boiler & steam PM":0.02,"Monthly plant PM":0.035,"Multi-site plant PM":0.06},
  tm:TM,
  rateSheet:{ laborSub:"Billing rates per worker-hour. Overtime after 8 hours a day and on Saturdays; double time on Sundays and holidays.",
    labor:[RT.gf,RT.fm,RT.jp,RT.wd,RT.rt,RT.hp],
    equip:[["Service or crew truck",TRUCK,"hr","Billed with the crew's hours"],["Welding rig — truck and machine",RIG,"hr","Per rig; welder billed separately"],["Crane — 40-ton, operated",CR40,"hr","Subcontract · 4-hr minimum · portal to portal"],["Crane — 100-ton, operated",CR100,"hr","Subcontract · 4-hr minimum · portal to portal"],["Rigger / signal person",RIGGER,"hr","Subcontract · 4-hr minimum"],["Mileage",MILE,"mi","Beyond a 30-mile radius of the yard"],["Per diem",PERDIEM,"day","Per worker, out-of-town jobs: GSA lodging $149 + meals $74"]],
    terms:[["Travel time","Portal to portal, straight time"],["Emergency call-outs","4-hr minimum, overtime rates after hours"],["Materials","Cost + 15%"],["Subcontracted equipment","Cost + 10%, plus the crane company's 7% fuel surcharge"],["Invoices","Due on receipt, PO on file"]] },
  olderShare:0.22, olderDeltaC:[1500,2500,4000], olderDeltaFn:function(c){ return Math.round(c*pick([0.04,0.06,0.08])/100)*100; },
  sources:["Referral","Phone-in","Website","Google","LinkedIn","Other"],
  srcW:[["Referral",28],["Phone-in",24],["Website",18],["Google",14],["LinkedIn",6],["Other",10]],
  reasons:[["Sold the building or moved",31],["Took maintenance in-house",25],["Cost",22],["Switched contractor",14],["Other",8]],
  vis:{byEng:false,nMin:1,nMax:5,min:1,max:200,win:90,risk:90},
  visitTypes:["Quarterly PM","Repair call","Inspection","Filter change","Emergency call-out"],
  flagFn:function(pl){ return pl.indexOf("Multi")>-1; }, flagShare:0.12,
  runDays:[1], dr:0.09, rr:0.82,
  nextRun:{day:1,label:"Tue, Dec 1"}, lastRun:{day:1,label:"Sun, Nov 1"},
  st:{paid:"Paid", rec:"Paid late", wo:"Written off", open:"Past due"},
  t:{People:"Customers", people:"customers", Person:"Customer", person:"customer", accts:"accounts", paused:"On hold", pausedV:"on hold", cancelled:"Closed",
     book:"account book", allLoc:"Both yards", planCol:"Agreement", LocWord:"Yard", LocWords:"Yards", locWord:"yard"},
  L:{
    navOps:"Operations", navDesk:"Dispatch", navPos:"Parts & counter", navLeads:"Quotes & leads",
    tActive:"Agreement accounts", tDues:"Monthly agreement dues", tDuesSub:"from active and past-due agreements",
    tCollected:"Collected this month", recBy:"paid late after reminders",
    tCheck:"Jobs on the board today", tCheckSub:function(fd){ return fd.later+" still to go"; },
    recTile:"Collected by reminders", memChartSub:"Agreement accounts at each month end.",
    colChart:"Collected by month", colChartSub:"Agreement invoices and T&M tickets paid, including those paid late after reminders. This month is to date.",
    visPer:"Site visits / account, 90 d", lastCol:"Last site visit", visCol:"Site visits, 90 d", noVisit:"No site visits on file",
    pausedNext:"On hold — no invoice scheduled",
    pdBanner:"Open invoices past due. The next reminder goes out on their AP day — Fri, Nov 20 — with the invoice and PO attached.",
    pdBtns:[["⟳ Remind now","Demo — reminder queued"],["Resend invoice","Demo — invoice and PO resent"],["Send pay link","Demo — payment link sent"]],
    billDay:"Invoice day", nextCharge:"Next invoice", payMethod:"Terms", payVal:function(){ return "Due on receipt · PO on file"; },
    ledgerSub:"Agreement invoices and T&M tickets, newest first.", ledgerCol:"Terms", ledgerDesc:"— monthly", ledgerVal:function(){ return "Due on receipt"; },
    visTitle:"Service history", visSub:"Site visits from both yards.", homeLoc:"Home yard", visType:"Visit", visBy:"Logged by", visByVal:"Tech on site",
    consentTitle:"Contact consent", flagLabel:"Multi-site account",
    bPaid:"paid on time", bRec:"paid late after reminders", bNext:"Next invoice run", bOpen:"Invoices past due", bOpenSub:"invoices · next reminders Fri, Nov 20 — AP day",
    bRate:"Late invoices collected", bRateSub:"paid after reminders, Jul–Sep (the last 3 closed months)", bPausedSub:"back within 7 days",
    colChart12:"Collected, last 12 months", bRecOf:"paid late after reminders", sPaid:"Paid on time", sRec:"Paid late after reminders",
    runWord:"Invoice run", runUnit:"invoices", retryRow:"Next reminders Fri, Nov 20, 6:00 AM", retryRowSub:"on the AP-day reminder cycle",
    runsTitle:"Invoice runs", runsSub:"Agreement invoices go out on the 1st, due on receipt, with the PO attached.", runDec:"went past due", runsTab:"Invoice runs",
    decTab:"Past due", decTitle:"Invoices past due", decSub:"Reminders go out on each account's AP day with the invoice and PO attached; anything past 45 days is escalated to a person.",
    decCol:"Status", decNext:"Next reminder", decReason:"Awaiting AP run", decNextVal:"Fri, Nov 20 — AP day", decChip:"Reminding",
    billSub:"Agreement dues, invoice runs, holds and past-due accounts.",
    joins:"New agreements", joinsV:"new agreements", cancels:"Closed agreements", cancel1:"closed agreement",
    riskLabel:"PM overdue", riskSub:"active, no site visit in 90+ days",
    riskNote:"Active accounts nobody has visited in over 90 days — the sites that lapse. PM scheduling works this list.",
    rec12:"Paid late after reminders, 12 months", rec12Sub:"invoices that went past due and were collected",
    collTitle:"What happened to invoices that went past due", collSub:"Every invoice that went past due, by month: paid late after reminders, written off, or still open.", sWo:"Written off", sOpen:"Still open",
    agentSub:"The repetitive billing, dispatch and follow-up work the agent does, and the calls it leaves to you.",
    recTileMonth:"Collected by reminders, this month", waitSub:"purchase orders, reminders and sign-offs",
    safety:"It never sends an invoice reminder, commits a crew or orders parts without a person. Each decision carries the agent's recommendation — you approve or decline."
  },
  fd:{ who:"patient", n:11, start:6*60+15, step:[30,45,60], now:11*60+20, nowWin:110, done:"Done", nowSt:["On site","En route"], later:"Scheduled",
    types:["Quarterly PM","Quarterly PM","Repair call","Repair call","Emergency","Equipment install","Inspection"], walk:[0,0],
    sub:"Today's board, crews and holds", listTitle:"The board", head:["Window","Account","Job","Status"],
    checkins:function(f){ return f.n; },
    tiles:function(f,F){ return [["Jobs on the board",String(f.n),Object.keys(f.byType).map(function(k){return f.byType[k]+" "+k;}).join(" · ")],["On site now",String(f.inNow),(f.checked-f.inNow-f.doneN)+" en route"],["Completed so far",String(f.doneN),f.later+" still to go"],["Accounts on billing hold",String(K.fd.holds(F).filter(function(x){return x[3]==="Billing hold";}).length),"work done, new work held","bad"]]; },
    holds:function(F){ var out=[]; if(PDROW && (LOC==="all"||PDROW.loc===LOC)) out.push([shortName(PD0)+" — invoices past due","Today's "+PDROW.type.toLowerCase()+" went ahead · new work on hold until the balance clears","bad","Billing hold"]);
      out.push(["Gate code changed at a site on today's board","Caught on the confirmation text · ticket updated before roll-out","warn","Fixed"]);
      out.push(["After-hours emergency taken by the AI receptionist","On-call tech dispatched with the site details already written down","good","Handled"]); return out; },
    src:"Job files for today's board were prepared before roll-out: equipment history, warranty status and gate codes on every ticket."
  },
  pos:{ n:6, rPrefix:"PT-", pays:["Job #2214","Job #2208","Counter — cash","Job #2217"],
    products:[["Filters 20x20 — case",89.00,41,12],["Belt A-42",18.50,6,10],["Welding rod 7018 — 10 lb",42.00,4,6],["Igniter kit",42.00,34,8],["Contactor 40A",28.00,48,10],["Condensate pump",96.00,15,5],["Thermostat — commercial",148.00,22,6],["Pump seal kit",64.00,19,6],["Damper actuator",112.00,3,4],["Gauge set",139.00,11,3]],
    month:[3890,4120,3560,4480,4210,3980,4650,4390,4020,4310,4580], mtd:2260, po:{amt:812},
    sub:"Truck stock and counter sales, tied to the jobs on the board.", tToday:"Parts billed today", tTodaySub:"parts tickets", tMonth:"Parts billed this month", tAvg:"Average ticket",
    stockTitle:"Stock", salesTitle:"Today's parts tickets", rCol:"Ticket", payCol:"Billed to", chartTitle:"Parts billed by month"
  },
  roles:[["General foreman",1,48],["Foreman",2,40],["Journeyman pipefitter",8,36],["Certified welder",4,38],["HVAC tech",4,34],["Helper",6,21],["Dispatcher",2,24],["Estimator",2,40],["Office & billing",3,23]], staffExc:2,
  lead:{ stages:[["new","New","#8a8f98",4],["contacted","Contacted","var(--c2)",6],["booked","Walkthrough booked","var(--c1)",4],["showed","Quote sent","var(--c4)",5],["joined","Signed","var(--c3)",4]],
    srcW:[["Referral",26],["AI receptionist",24],["Phone-in",16],["Google",14],["Website",12],["Other",8]], owners:["Marcus T.","Elena Ruiz","Dmitri Volkov"], waiting:2,
    next:{"new":["Send the capabilities sheet"],contacted:["Book the site walkthrough","Send the certificate of insurance"],booked:["Walk the site with the estimator"],showed:["Follow up on the quote"],joined:["Schedule the first PM visit"]},
    sub:"Every prospect from first call to a signed agreement — including the ones the AI receptionist captured after hours.", wonWord:"signed"
  },
  calls:function(H){ var rk=P.filter(isRisk); return [
    {t:"6:41 AM",w:H.pt(8),c:[["bad","Urgent → dispatched"]],x:"Walk-in cooler down before opening — on-call tech dispatched with the site details",v:d0(CALLOUT)+" min.",vn:CALLOUT,booked:true,off:true,d:"2:12",tr:"<b>Caller:</b> Our walk-in is at 50 degrees and we open at 7. <b>AI:</b> That's a same-day emergency. I'm dispatching the on-call tech now and texting you his ETA."},
    {t:"8:12 AM",w:"María G. · Casa Verde Apartments",c:[["acc","Español"],["good","Booked"]],x:"Boiler inspection booked Thu 2:00 — switched to Spanish mid-call",v:d0(SERVICE)+" est.",vn:SERVICE,booked:true,d:"2:51",tr:"<b>Caller:</b> ¿Pueden revisar la caldera del edificio B? <b>AI:</b> Claro — el jueves a las 2:00. ¿El acceso es por la oficina? <b>Caller:</b> Sí. <b>AI:</b> Confirmada."},
    {t:"12:34 PM",w:H.pt(9),c:[["warn","Lunch"],["good","Booked"]],x:"Rooftop unit making noise — repair call booked while the office was at lunch",v:d0(SERVICE)+" est.",vn:SERVICE,booked:true,off:true,d:"3:12",tr:"<b>AI:</b> The office is out on a job, but I can get you on the board — Tuesday 10:15 for a rooftop unit diagnostic?"},
    {t:"12:41 PM",w:"Unknown caller",c:[["warn","Lunch"],["info","Answered"]],x:"Service area, hours and insurance certificate — no person needed",v:"—",off:true,d:"0:58",tr:"<b>AI:</b> We cover the San Antonio and Austin metros. I can email our certificate of insurance to your property manager today."},
    {t:"3:05 PM",w:H.pt(10),c:[["good","Quote saved"]],x:"Called to pass on a 12-day-old quote — estimator callback booked for 4:00 instead",v:"quote kept open",saved:true,d:"1:47",tr:"<b>Caller:</b> We were going to pass on the quote. <b>AI:</b> Before you do — the estimator can rework the phasing. Can he call you at 4? <b>Caller:</b> Sure."},
    {t:"6:48 PM",w:H.pt(11),c:[["acc","After hours"],["good","Booked"]],x:"No heat in one wing — first slot tomorrow morning booked after close",v:d0(NOHEAT)+" est.",vn:NOHEAT,booked:true,off:true,d:"2:05",tr:"<b>AI:</b> I've put you first on the morning board, 7:30 arrival, and flagged it for the dispatcher."},
    {t:"9:17 PM",w:H.pt(12),c:[["acc","After hours"],["bad","Urgent → routed"]],x:"Gas smell near the mechanical room — told to follow their emergency procedure and call the gas utility; routed to on-call",v:"—",off:true,d:"1:21",tr:"<b>AI:</b> A gas smell is an emergency — please follow your evacuation procedure and call the gas utility now. I'm connecting our on-call lead."},
    {t:"10:52 PM",w:shortName(rk[0]),c:[["acc","After hours"],["good","Booked"]],x:"Overdue quarterly PM booked — Thursday 9:00, covered by the agreement",v:"on agreement",booked:true,off:true,d:"1:12",tr:"<b>AI:</b> Thursday 9:00 for the quarterly maintenance. Is the roof access still through the north stairwell?"}
  ]; },
  rx:{ sub:"Every call answered, recorded and transcribed. Emergencies go straight to the on-call tech; anything uncertain goes to a person.", offSub:"before open, after close or at lunch",
    bookedLabel:"Jobs captured on the call", bookedSub:"in call-outs and repair calls", saveLabel:"Quotes kept open", saveSub:"estimator callback booked",
    sim:{ from:"Warehouse account · (210) 555-0164", toast:"Dispatched — "+d0(CALLOUT)+" emergency minimum captured",
      lines:[["AI","Thank you for calling Kestrel Mechanical — how can I help?"],["Caller","Our rooftop unit is down at the warehouse. It's about 85 degrees inside."],["AI","That's a same-day emergency. Can I confirm the site — is this the Binz-Engleman Road location?"],["Caller","Yes, dock side."],["AI","Got it. I'm dispatching the on-call tech now and texting you his ETA. Is roof access still through the north stairwell?"],["Caller","Yes."],["AI","He's on the way. You'll have a text in under a minute."]],
      row:{t:"Just now",w:"Warehouse account · (210) 555-0164",c:[["bad","Urgent → dispatched"]],x:"Rooftop unit down — on-call tech dispatched, ETA texted",v:d0(CALLOUT)+" min.",vn:CALLOUT,booked:true,d:"1:12"} }
  },
  jobs:[
    {n:"After-hours & lunch answering",m:0,each:5,runs:function(b){ return b.offCalls*30*b.share; },w:"Answers nights, weekends and lunch, writes down site, contact, scope and urgency, books routine work onto the board.",b:"Overnight voicemails waited for the office; emergency callers dialed the next contractor on the list."},
    {n:"Emergency dispatch routing",m:0,each:9,runs:8,w:"Down-equipment calls go straight to the on-call tech with the details already taken. Routine requests wait for morning.",b:"The on-call phone got every call, including the ones that could have waited."},
    {n:"Quote follow-up",m:0,each:8,runs:18,w:"Follows up every open quote on a schedule until it's answered, and flags the ones going cold to the estimator.",b:"Quotes sat in the estimator's sent folder; whoever called back got worked."},
    {n:"Invoice reminders",m:1,each:7,runs:function(b){ return b.declines; },w:"Reminds past-due accounts on their AP day and resends the invoice with the PO attached.",b:"Billing printed an aging report monthly and called when there was time."},
    {n:"PM scheduling",m:0,each:8,runs:function(b){ return b.bill/3; },w:"Books due preventive-maintenance visits into open tech windows and confirms access with the site contact.",b:"PM lists were worked off a spreadsheet when the board was slow."},
    {n:"Parts reorder",m:1,each:10,runs:4,w:"Drafts purchase orders when stock drops under the reorder point, matched to the jobs on next week's board.",b:"Techs discovered missing parts on site and drove to the supply house mid-job."},
    {n:"Missed-call text-back",m:0,each:4,runs:9,w:"If a call ever slips, the caller gets a text in seconds with a booking link.",b:"A missed call was just gone."},
    {n:"Clean campaign lists",m:0,each:9,runs:function(b){ return b.sends; },w:"Removes closed accounts and opted-out contacts from every campaign before it sends.",b:"Lists were exported, cleaned by hand and re-imported before each send."},
    {n:"T&M ticket assembly",m:0,each:12,runs:function(){ var n=0; P.forEach(function(q){ if(inLoc(q)) q.led.forEach(function(l){ if(l.kind==="tm" && l.m===0) n++; }); }); return n; },w:"Builds each T&M ticket from crew time, rig and crane hours, and material receipts, priced off the rate sheet.",b:"The office keyed tickets in from paper timesheets at the end of the week."},
    {n:"Job-file prep",m:0,each:4,runs:function(b){ return b.appts*22; },w:"Pulls site history, equipment list, warranty status and gate codes into the ticket before each visit.",b:"Techs called the office from the parking lot asking which unit they were there for."}
  ],
  att:function(F){ var rows=[
    ["urgent","Invoices",F.pdN+" accounts with invoices past due",F.pdSum+" open — AP-day reminders queued; "+F.recMonth+" paid late so far this month","#billing", F.pdN],
    ["urgent","Dispatch",PD0?shortName(PD0)+" is on today's board with invoices past due":"","Today's job went ahead — new work on hold until the balance clears","#frontdesk", PDROW&&(LOC==="all"||PDROW.loc===LOC)?1:0],
    ["urgent","Quotes",F.waitN+" new leads still waiting on a first reply",F.waitNames.join(", ")+(F.waitN>2?" + "+(F.waitN-2)+" more":""),"#leads", F.waitN],
    ["warn","PM",F.riskN+" accounts with no site visit in 90+ days","Friday's open tech window offered to the next batch — waiting on your approval","#agent", F.riskN],
    ["warn","Parts","Compressor for Thursday's job is not in stock","PO drafted to Alamo Supply — $1,284, waiting on your approval","#agent", 1],
    ["warn","Staff",F.excN+" payroll exceptions to resolve","Missed punches","#staff", F.excN],
    ["info","Counter",F.lowN+" items under reorder point","PO drafted to Alamo Supply — $812","#optical", F.lowN]
  ]; return rows.filter(function(r){ return r[5]>0; }); },
  waiting:function(F){ var n=Math.min(4,F.riskN), out=[];
    if(F.pdN) out.push({t:"Send AP-day reminders to "+F.pdN+" past-due accounts",s:"“Hi [name], invoice [#] is attached with your PO. Reply here with any questions.”",c:["warn","Invoices"],m:F.pdSum,rec:"<b>Agent recommends: Approve.</b> "+F.pdSum+" is everything currently past due. Each reminder goes out on that account's AP day.",done:"Sent AP-day reminders to "+F.pdN+" past-due accounts"});
    out.push({t:"Send PO to Alamo Supply — compressor and driers",s:"For Thursday's install on the board",c:["bad","Parts"],m:"$1,284",rec:"<b>Agent recommends: Approve.</b> Without it Thursday's job slips. The price matches the last order for the same parts.",done:"Sent PO to Alamo Supply — compressor and driers, $1,284"});
    if(n) out.push({t:"Offer Friday's open tech window to "+n+" PM-overdue accounts",s:"Sites with no visit in 90+ days and matching access hours",c:["warn","Schedule"],m:"on agreement",rec:"<b>Agent recommends: Approve.</b> First come, first served; the offer closes itself when the window fills.",done:"Offered Friday's open tech window to "+n+" PM-overdue accounts"});
    return out; },
  decided:function(H){ var rk=P.filter(isRisk); return [
    {t:"Confirmed today's "+FD.length+" jobs with the site contacts",s:"Access, gate codes and arrival windows",time:"Today 6:00 AM"},
    {t:"Dispatched the on-call tech to "+H.pt(8),s:"Walk-in cooler down — call taken by the AI receptionist at 6:41 AM",time:"Today 6:43 AM"},
    {t:"Rebuilt Friday's board after a tech called out",s:"Two PM visits moved; both sites confirmed the new window",time:"Nov 16, 7:13 PM"},
    {t:"Drafted PO-1147 to Alamo Supply — $812.00",s:"Belts, welding rod and damper actuators under reorder point",time:"Nov 16, 5:52 PM"},
    {t:"Booked "+shortName(rk[0])+"'s overdue quarterly PM",s:"Thursday 9:00 · covered by the agreement",time:"Nov 16, 10:52 PM"}
  ]; },
  camp:{ winLabel:"Booked from campaigns, last 30 days", winVal:"12 visits", winSub:"plus 5 past-due invoices paid", segSub:"Closed accounts are never counted.",
    rows:[
      {n:"Agreement renewal window",s:"Agreement renews in 60 days",st:["info","Scheduled"],ch:"Email",sent:"Goes out Nov 20, 9:00 AM",a:21},
      {n:"Quotes gone quiet",s:"Quote sent · no reply in 14+ days",st:["warn","Draft"],ch:"Email + SMS",sent:"Edited Nov 13, 2:20 PM"},
      {n:"Invoice and PO resend",s:"Status is Past due",st:["good","Sent"],ch:"Email",sent:"Nov 10, 10:00 AM",a:9,d:9,cl:6,res:"5 invoices paid",thisMonth:true,sent30:true},
      {n:"Winter heating check",s:"Active · no site visit in 90+ days",st:["good","Sent"],ch:"Email + SMS",sent:"Nov 3, 9:00 AM",a:27,d:26,cl:14,res:"12 visits booked",thisMonth:true,sent30:true},
      {n:"Come back to a PM agreement",s:"Closed · reason was Cost",st:["good","Sent"],ch:"Email",sent:"Oct 15, 10:00 AM",a:3,d:3,cl:1,res:"1 re-signed"},
      {n:"Refer a property manager",s:"Active · multi-site account",st:["good","Sent"],ch:"Email",sent:"Oct 4, 12:00 PM",a:16,d:16,cl:5,res:"2 referrals"}
    ],
    segs:function(F){ return [["Past due",F.a.pd],["PM overdue · no site visit in 90+ days",F.a.risk],["Multi-site accounts",F.a.cur.filter(function(p){return p.flag;})],["Full Mechanical PM",F.a.cur.filter(function(p){return p.plan==="Full Mechanical PM";})]]; },
    builder:{ title:"PM overdue: no site visit in 90 days", text:"Active accounts nobody has visited in over 90 days", hint:"Agreement type, billing, last site visit and yard all work.",
      rules:[["WHERE","Status","is","Active"],["AND","Last site visit","is over","90 days ago"]], match:function(p){ return isRisk(p); },
      exclNote:"Never messaged: contacts who opted out of texts. Closed accounts are never in an audience. Nobody has to filter these by hand.",
      rowSub:function(p){ return "Active · "+p.plan+" · last site visit "+lastVText(p).toLowerCase(); } }
  }
};
