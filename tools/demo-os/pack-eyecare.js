/* Summit Eye Care — a two-location practice running an in-office vision membership plan.
   Prices sit inside published ranges: in-office vision plans about $35 / $50 / $90 a month;
   comprehensive exam without insurance $100–$250; contact lens fitting $100–$250. */
var EXAM=175, FIT=150, KIDS=150;
var K={
  seed:20261117, brand:"Summit Eye Care", title:"Summit Eye Care OS", persona:"Dana", N:820, biz:null,
  locs:["Stone Oak","Medical Center"], locW:[54,46],
  statusW:[["active",80],["past_due",5],["paused",4],["cancelled",11]],
  plans:[["Essential Vision",35,46],["Premium Vision",50,36],["Family Vision",90,18]],
  olderShare:0.2, olderDeltaC:[300,500],
  sources:["Walk-in","Website","Referral","Google","Instagram","Other"],
  srcW:[["Walk-in",24],["Website",23],["Referral",20],["Google",14],["Instagram",9],["Other",10]],
  reasons:[["Not using it",27],["Moved away",25],["Cost",21],["Switched provider",14],["Other",13]],
  vis:{byEng:false,nMin:1,nMax:3,min:1,max:540,win:365,risk:365},
  visitTypes:["Comprehensive exam","Contact lens check","Frame pickup","Adjustment","Visual field test"],
  flagFn:function(){ return false; }, flagShare:0.3,
  runDays:[1,15], dr:0.06, rr:0.65,
  nextRun:{day:1,label:"Tue, Dec 1"}, lastRun:{day:15,label:"Sun, Nov 15"},
  st:{paid:"Paid", rec:"Recovered", wo:"Written off", open:"Declined"},
  t:{People:"Patients", people:"patients", Person:"Patient", person:"patient", accts:"accounts", paused:"Paused", pausedV:"paused", cancelled:"Cancelled",
     book:"patient book", allLoc:"All locations", planCol:"Plan", LocWord:"Location", LocWords:"Locations", locWord:"location"},
  L:{
    navOps:"Operations", navDesk:"Front desk", navPos:"Optical sales", navLeads:"Leads",
    tActive:"Patients on a plan", tDues:"Monthly plan dues", tDuesSub:"from active and past-due plan members",
    tCollected:"Dues collected this month", recBy:"recovered by retries",
    tCheck:"Check-ins today", tCheckSub:function(fd){ return fd.checked+" appointments + "+fd.walk+" walk-ins"; },
    recTile:"Recovered this month", memChartSub:"Patients on a plan at each month end.",
    colChart:"Dues collected by month", colChartSub:"Drafts that cleared plus declines recovered by retries. This month is to date.",
    visPer:"Visits / patient, 12 mo", lastCol:"Last visit", visCol:"Visits, 12 mo", noVisit:"No visits on file",
    pausedNext:"On hold — no draft scheduled",
    pdBanner:"Owes declined drafts. Billing retries them on payday — Fri, Nov 20 at 6:00 AM.",
    pdBtns:[["⟳ Retry now","Demo — retry queued"],["Send link","Demo — secure update link sent by text"],["Take payment","Demo — card reader ready"]],
    billDay:"Billing day", nextCharge:"Next draft", payMethod:"Payment method", payVal:function(p){ return p.card+" · exp "+p.cardExp; },
    ledgerSub:"Monthly drafts, newest first.", ledgerCol:"Method", ledgerDesc:"dues", ledgerVal:function(p){ return p.card; },
    visTitle:"Visits", visSub:"Appointments and pickups at both locations.", homeLoc:"Home location", visType:"Visit", visBy:"Checked in", visByVal:"Front desk",
    consentTitle:"Marketing consent", flagLabel:"Contact-lens wearer",
    bPaid:"drafted", bRec:"recovered by retries", bNext:"Next draft", bOpen:"Declines being retried", bOpenSub:"drafts · next try Fri, Nov 20 — payday",
    bRate:"Recovery rate", bRateSub:"won back by retries, Jul–Sep (the last 3 closed months)", bPausedSub:"back within 7 days",
    colChart12:"Dues collected, last 12 months", bRecOf:"recovered from declined drafts", sPaid:"Drafts cleared", sRec:"Recovered by retries",
    runWord:"Draft run", runUnit:"drafts", retryRow:"Next retry Fri, Nov 20, 6:00 AM", retryRowSub:"on the payday retry",
    runsTitle:"Draft runs", runsSub:"Dues draft at 4:00 AM on the 1st or the 15th, depending on each patient's billing day.", runDec:"declined", runsTab:"Draft runs",
    decTab:"Declines", decTitle:"Declines in the retry window", decSub:"Retries run on each patient's payday, then a card-update link goes out.",
    decCol:"Reason", decNext:"Next try", decReason:"Insufficient funds", decNextVal:"Fri, Nov 20 — payday", decChip:"Retrying",
    billSub:"Dues, draft runs, holds and declined payments.",
    joins:"Joins", joinsV:"joins", cancels:"Cancellations", cancel1:"cancellation",
    riskLabel:"Overdue for an annual exam", riskSub:"active, no visit in 12+ months",
    riskNote:"Active patients with no visit in over a year. The recall outreach works this list.",
    rec12:"Recovered by retries, 12 months", rec12Sub:"declined drafts won back",
    collTitle:"What happened to declined drafts", collSub:"Every draft that declined, by month: recovered by retries, written off, or still open.", sWo:"Written off", sOpen:"Still open",
    agentSub:"The repetitive billing, front-desk and follow-up work the agent does, and the calls it leaves to you.",
    recTileMonth:"Recovered by retries, this month", waitSub:"charges, patient texts and sign-offs",
    safety:"It never charges a card, cancels an appointment or texts a patient list without a person. Each decision carries the agent's recommendation — you approve or decline."
  },
  fd:{ who:"patient", n:44, start:8*60, step:[10,10,15,15,20], now:11*60+20, done:"Done", nowSt:["Checked in","Roomed"], later:"Scheduled",
    types:["Comprehensive exam","Comprehensive exam","Contact lens check","Frame pickup","Adjustment","Visual field test"], walk:[4,2], show:18,
    sub:"Today's schedule, check-ins and holds", listTitle:"Schedule", head:["Time","Patient","Visit","Status"],
    checkins:function(f){ return f.checked+f.walk; },
    tiles:function(f,F){ return [["Appointments today",String(f.n),f.later+" still to come"],["Checked in so far",String(f.checked),f.inNow+" in the lobby now"],["Walk-ins",String(f.walk),"seen between appointments"],["Balance holds at check-in",String(K.fd.holds(F).filter(function(x){return x[3]==="Billing hold";}).length),"visit went ahead, retry queued","bad"]]; },
    holds:function(F){ var out=[]; if(PDROW && (LOC==="all"||PDROW.loc===LOC)) out.push([shortName(PD0)+" — card on file declined at check-in, "+PDROW.tm,"Visit went ahead · payday retry queued for the open balance","bad","Billing hold"]);
      out.push(["Insurance card didn't match the record at check-in","Desk updated the record and re-verified","warn","Fixed"]);
      out.push(["Walk-in asked for an exam in Spanish","Routed to the desk · exam booked","good","Booked"]); return out; },
    src:"Insurance for today's schedule was checked before the doors opened."
  },
  pos:{ n:14, rPrefix:"SPR-", pays:["Visa •3433","Card on file","Cash","MC •7565"],
    products:[["Daily contacts — 90 pack",64.99,41,20],["Monthly contacts — 6 pack",48.99,11,15],["Contact lens solution 12 oz",12.49,14,30],["Lens cleaning kit",9.99,9,25],["Frames — Hartley",139.00,34,10],["Frames — Mesa",119.00,31,10],["Readers +1.50",24.99,45,15],["Polarized clip-ons",34.99,38,10],["Blue-light coating",49.00,0,0,true]],
    month:[3120,2840,2960,3310,3180,3420,3260,3390,3540,3480,3610], mtd:1890, po:{amt:258},
    sub:"Register: contact lenses, frames and accessories.", tToday:"Sales today", tTodaySub:"sales", tMonth:"Optical sales this month", tAvg:"Average sale",
    stockTitle:"Products", salesTitle:"Today's sales", rCol:"Receipt", payCol:"Paid with", chartTitle:"Optical sales by month"
  },
  roles:[["Optometrist",4,62],["Optician",5,26],["Front desk",6,19],["Technician",4,22],["Billing",2,24]], staffExc:2,
  lead:{ stages:[["new","New","#8a8f98",7],["contacted","Contacted","var(--c2)",9],["booked","Exam booked","var(--c1)",5],["showed","Showed","var(--c4)",6],["joined","Joined a plan","var(--c3)",6]],
    srcW:[["Website",26],["AI receptionist",24],["Walk-in",14],["Google",14],["Instagram",10],["Referral",12]], owners:["Grace Amaral","Steven Santiago","Dana R."], waiting:4,
    next:{"new":["Send the plan overview"],contacted:["Follow up on booking","Answer an insurance question"],booked:["Confirm the exam by text"],showed:["Follow up on joining a plan"],joined:["Send the welcome kit"]},
    sub:"Every prospect from first touch to joining a plan — including the ones the AI receptionist booked after hours.", wonWord:"joined a plan"
  },
  calls:function(H){ var rk=P.filter(isRisk); return [
    {t:"7:02 AM",w:H.pt(8),c:[["info","Message"]],x:"Asked whether their glasses were ready — task logged for the optical desk",v:"—",d:"0:49",off:true,tr:"<b>AI:</b> The optical team confirms orders after 9. I've left them a note to call you first thing."},
    {t:"8:12 AM",w:"María G. · new patient",c:[["acc","Español"],["good","Booked"]],x:"New patient exam Thu 2:40 — switched to Spanish mid-call",v:"$"+EXAM,vn:EXAM,booked:true,d:"2:51",tr:"<b>Caller:</b> ¿Puedo hacer una cita para un examen? <b>AI:</b> Claro que sí — el jueves a las 2:40. <b>Caller:</b> Perfecto. <b>AI:</b> Confirmada."},
    {t:"12:34 PM",w:H.pt(9),c:[["warn","Lunch"],["good","Booked"]],x:"Annual exam + contact lens fitting booked while the desk was at lunch",v:"$"+(EXAM+FIT),vn:EXAM+FIT,booked:true,off:true,d:"3:12",tr:"<b>AI:</b> The front desk is with patients, but I can book you now — Tuesday 10:15 for an exam and fitting?"},
    {t:"12:41 PM",w:"Unknown caller",c:[["warn","Lunch"],["info","Answered"]],x:"Hours, parking and directions — no person needed",v:"—",off:true,d:"0:58",tr:"<b>AI:</b> Open until 6 today. Parking is behind the building."},
    {t:"3:05 PM",w:H.pt(10),c:[["good","Cancel saved"]],x:"Called to cancel Friday — moved to Friday 9:20 instead",v:"$"+EXAM+" kept",saved:true,d:"1:47",tr:"<b>Caller:</b> I need to cancel Friday. <b>AI:</b> Before I do — Friday 9:20 just opened. Would that work? <b>Caller:</b> Actually, yes."},
    {t:"6:48 PM",w:"K. Alvarez · new patient",c:[["acc","After hours"],["good","Booked"]],x:"Child's exam Saturday 11:00 — booked after close",v:"$"+KIDS,vn:KIDS,booked:true,off:true,d:"2:05",tr:"<b>AI:</b> Saturday 11:00 or 11:40 for a child's exam? <b>Caller:</b> 11. <b>AI:</b> Booked — confirmation text on the way."},
    {t:"9:17 PM",w:H.pt(11),c:[["acc","After hours"],["bad","Urgent → routed"]],x:"Flashes and floaters — urgent protocol, routed to the on-call doctor",v:"—",off:true,d:"1:21",tr:"<b>AI:</b> Sudden flashes and new floaters need same-day attention. Connecting you to the on-call line now."},
    {t:"10:52 PM",w:shortName(rk[0]),c:[["acc","After hours"],["good","Booked"]],x:"Overdue for an exam — booked from the recall list, Thursday 9:00",v:"$"+EXAM,vn:EXAM,booked:true,off:true,d:"1:12",tr:"<b>AI:</b> Welcome back — Thursday 9:00 for your annual exam. See you then."}
  ]; },
  rx:{ sub:"Every call answered, recorded and transcribed. Anything uncertain is transferred to a person.", offSub:"before open, after close or at lunch",
    bookedLabel:"Booked on the call", bookedSub:"in visits booked", saveLabel:"Cancellations saved", saveSub:"moved instead of cancelled",
    sim:{ from:"New caller · (210) 555-0164", toast:"Booked — $"+EXAM+" exam added to Friday",
      lines:[["AI","Thank you for calling Summit Eye Care — how can I help?"],["Caller","I'd like to schedule an eye exam. I'm a new patient."],["AI","Happy to help. Thursday 2:40 or Friday 10:15 — which works better?"],["Caller","Friday at 10:15."],["AI","And which insurance will you be using?"],["Caller","VSP."],["AI","Got it — you're booked for Friday at 10:15, and I've noted VSP for the desk. Confirmation text on the way."]],
      row:{t:"Just now",w:"New patient · (210) 555-0164",c:[["good","Booked"]],x:"New patient exam Friday 10:15 — insurance noted for the desk",v:"$"+EXAM,vn:EXAM,booked:true,d:"1:12"} }
  },
  jobs:[
    {n:"After-hours & lunch answering",m:0,each:5,runs:function(b){ return b.offCalls*30*b.share; },w:"Answers before open, after close and over lunch, books exams into open slots, routes urgent symptoms to on-call.",b:"Overnight voicemails waited for the desk; most callers had already booked elsewhere."},
    {n:"Cancel-save offers",m:0,each:6,runs:9,w:"When someone calls to cancel, offers the next opening before releasing the slot.",b:"The desk took the cancellation and the chair sat empty."},
    {n:"Recall outreach",m:0,each:8,runs:function(b){ return b.risk*0.4; },w:"Works the overdue-exam list by text and call until patients rebook or opt out.",b:"Recall reports were printed monthly and worked when the desk had time."},
    {n:"Payday retries",m:1,each:6,runs:function(b){ return b.declines; },w:"Retries declined dues on the patient's payday.",b:"Billing re-ran declined drafts by hand the next morning."},
    {n:"Card-update links",m:1,each:6,runs:function(b){ return b.declines*0.2; },w:"When a card is expired or dead, texts a secure link to update it instead of retrying.",b:"The desk called each patient and typed the new number over the phone."},
    {n:"Waitlist backfill",m:0,each:10,runs:7,w:"When a cancellation sticks, offers the slot to matching waitlist patients, first-come.",b:"The desk called down the waitlist between check-ins — when there was time."},
    {n:"Reorder reminders",m:0,each:5,runs:26,w:"Texts contact-lens wearers a reorder link when their supply window lapses.",b:"Reorders happened only when the patient remembered."},
    {n:"Clean campaign lists",m:0,each:9,runs:function(b){ return b.sends; },w:"Removes cancelled and opted-out patients from every campaign before it sends.",b:"Lists were exported, cleaned by hand and re-imported before each send."},
    {n:"Insurance verification prep",m:0,each:4,runs:function(b){ return b.appts*22; },w:"Checks the next day's schedule against insurance eligibility and flags mismatches.",b:"The desk verified each patient at check-in while the lobby queued."}
  ],
  att:function(F){ var rows=[
    ["urgent","Billing",F.pdN+" accounts in the retry window",F.pdSum+" still open — payday retries running; "+F.recMonth+" recovered so far this month","#billing", F.pdN],
    ["urgent","Front desk",PD0?shortName(PD0)+"'s card on file declined at check-in":"","Balance hold — visit went ahead, retry queued for payday","#frontdesk", PDROW&&(LOC==="all"||PDROW.loc===LOC)?1:0],
    ["urgent","Leads",F.waitN+" new leads still waiting on a first reply",F.waitNames.join(", ")+(F.waitN>2?" + "+(F.waitN-2)+" more":""),"#leads", F.waitN],
    ["warn","Recalls",F.riskN+" patients overdue for an annual exam","Recall texts drafted for the next batch — waiting on your approval","#agent", F.riskN],
    ["warn","Schedule","Tomorrow has two open exam slots — 9:20 and 2:40","Waitlist offer drafted — waiting on your approval","#agent", 1],
    ["warn","Staff",F.excN+" payroll exceptions to resolve","Missed punches","#staff", F.excN],
    ["info","Optical",F.lowN+" items under reorder point","PO drafted to Alamo Optical Supply — $258","#optical", F.lowN]
  ]; return rows.filter(function(r){ return r[5]>0; }); },
  waiting:function(F){ var ok=F.a.risk.filter(function(p){return p.smsOk;}), n=Math.min(14,ok.length), k=F.pdNames.length, out=[];
    if(n) out.push({t:"Send recall texts to "+n+" overdue patients",s:"“Hi [name], it's been over a year since your last eye exam at Summit. Tap to pick a time.”",c:["warn","Recalls"],m:d0(n*EXAM),rec:"<b>Agent recommends: Approve.</b> All "+n+" are overdue for an exam and have texting consent. "+d0(n*EXAM)+" is "+n+" exams at $"+EXAM+" if every one books.",done:"Sent recall texts to "+n+" overdue patients"});
    if(k) out.push({t:"Retry "+k+" failed payments and notify the patients",s:F.pdNames.join(", ")+" — card declined on the last draft",c:["bad","Billing"],m:m2(F.pd3C),rec:"<b>Agent recommends: Approve.</b> One month of dues each; retries are timed to each patient's payday.",done:"Retried "+k+" failed payments and notified the patients"});
    out.push({t:"Offer tomorrow's 2 open exam slots to the waitlist",s:"9:20 and 2:40 · first come, first served",c:["warn","Schedule"],m:d0(2*EXAM),rec:"<b>Agent recommends: Approve.</b> The offer closes itself when a slot fills. "+d0(2*EXAM)+" is 2 exams at $"+EXAM+".",done:"Offered tomorrow's 2 open slots to the waitlist"});
    return out; },
  decided:function(H){ var rk=P.filter(isRisk); return [
    {t:"Confirmed tomorrow's appointments by text",s:"Reminder chain for Wed, Nov 18",time:"Today 6:00 AM"},
    {t:"Checked insurance for today's "+FD.length+" appointments",s:"Mismatches flagged for the desk before open",time:"Today 5:30 AM"},
    {t:"Sent "+H.pt(3)+" a card-update link",s:"Card on file expired — link sent instead of a retry",time:"Nov 16, 4:12 PM"},
    {t:"Drafted PO-2231 to Alamo Optical Supply — $258.00",s:"Monthly contacts, lens solution and cleaning kits under reorder point",time:"Nov 16, 2:05 PM"},
    {t:"Booked "+shortName(rk[0])+" from the recall list",s:"Thursday 9:00 · comprehensive exam",time:"Nov 16, 10:52 PM"}
  ]; },
  camp:{ winLabel:"Booked from campaigns, last 30 days", winVal:"17 exams", winSub:"plus 9 reorders and 6 cards updated", segSub:"Cancelled patients are never counted.",
    rows:[
      {n:"November birthdays",s:"Status is Active · birthday this month",st:["info","Scheduled"],ch:"SMS",sent:"Goes out Nov 18, 10:00 AM",a:58},
      {n:"Upgrade to Premium offer",s:"Plan is Essential Vision · 2+ visits in 12 months",st:["warn","Draft"],ch:"Email",sent:"Edited Nov 13, 2:20 PM"},
      {n:"Card update reminder",s:"Status is Past due",st:["good","Sent"],ch:"SMS",sent:"Nov 10, 10:00 AM",a:34,d:33,cl:9,res:"6 cards updated",thisMonth:true,sent30:true},
      {n:"Summer's over — your eyes miss you",s:"No exam in 12+ months",st:["good","Sent"],ch:"Email + SMS",sent:"Nov 3, 9:00 AM",a:96,d:92,cl:21,res:"17 exams booked",thisMonth:true,sent30:true},
      {n:"Contact lens reorder window",s:"Contact-lens wearers · supply lapsed",st:["good","Sent"],ch:"SMS",sent:"Oct 26, 11:00 AM",a:41,d:40,cl:12,res:"9 reorders",sent30:true},
      {n:"Come back — first month on us",s:"Cancelled · reason was Cost",st:["good","Sent"],ch:"Email + SMS",sent:"Oct 15, 10:00 AM",a:17,d:16,cl:3,res:"2 rejoined"},
      {n:"Kids' Saturday clinic",s:"Family Vision members",st:["good","Sent"],ch:"Email",sent:"Oct 4, 12:00 PM",a:88,d:85,cl:14,res:"11 booked"}
    ],
    segs:function(F){ return [["Past due",F.a.pd],["Overdue for an annual exam · 12+ months",F.a.risk],["Contact-lens wearers",F.a.cur.filter(function(p){return p.flag;})],["Family Vision members",F.a.cur.filter(function(p){return p.plan==="Family Vision";})]]; },
    builder:{ title:"Recall: overdue for an annual exam", text:"Active patients who haven't had an exam in over a year", hint:"Visits, plan, billing, contact lens status and location all work.",
      rules:[["WHERE","Status","is","Active"],["AND","Last visit","is over","12 months ago"]], match:function(p){ return isRisk(p); },
      exclNote:"Never messaged: anyone who opted out of texts. Cancelled patients are never in an audience. Nobody has to filter these by hand.",
      rowSub:function(p){ return "Active · "+p.plan+" · last visit "+lastVText(p).toLowerCase(); } }
  }
};
