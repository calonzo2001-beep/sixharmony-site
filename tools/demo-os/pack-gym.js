/* Ironline Fitness — a two-location mid-tier gym.
   Prices sit inside published ranges: mid-tier gyms about $30–$50 a month standard,
   $40–$60 premium, family memberships about $55–$75. */
var COACHES=["Grace Amaral","Steven Santiago","Priya Nair","Marco Diaz","Elena Ruiz","Tariq Hassan"];
var K={
  seed:20261119, brand:"Ironline Fitness", title:"Ironline Fitness OS", persona:"Alex", N:1870, biz:null,
  locs:["Stone Oak","Downtown"], locW:[56,44],
  statusW:[["active",78],["past_due",5],["paused",5],["cancelled",12]],
  plans:[["Base",29.99,40],["Plus",49.99,32],["Family",69.99,14],["Student",19.99,14]],
  olderShare:0.2, olderDeltaC:[300,500,700],
  sources:["Walk-in","Website","Referral","Google","Instagram","Other"],
  srcW:[["Walk-in",24],["Website",23],["Referral",20],["Google",12],["Instagram",11],["Other",10]],
  reasons:[["Not using it",27],["Moved away",25],["Cost",21],["Switched gyms",14],["Other",13]],
  vis:{byEng:true,nMin:0,nMax:26,min:0,max:90,win:30,risk:21},
  visitTypes:["Open gym","Open gym","HIIT 45","Spin","Strength basics","Yoga flow"],
  flagFn:function(pl){ return pl==="Plus"; }, flagShare:0.12,
  runDays:[1,15], dr:0.06, rr:0.65,
  nextRun:{day:1,label:"Tue, Dec 1"}, lastRun:{day:15,label:"Sun, Nov 15"},
  st:{paid:"Paid", rec:"Recovered", wo:"Written off", open:"Declined"},
  t:{People:"Members", people:"members", Person:"Member", person:"member", accts:"members", paused:"Frozen", pausedV:"frozen", cancelled:"Cancelled",
     book:"member book", allLoc:"All locations", planCol:"Plan", LocWord:"Location", LocWords:"Locations", locWord:"location"},
  L:{
    navOps:"Club operations", navDesk:"Front desk", navPos:"Pro shop", navLeads:"Leads",
    tActive:"Active members", tDues:"Monthly dues", tDuesSub:"from active and past-due memberships",
    tCollected:"Dues collected this month", recBy:"recovered by retries",
    tCheck:"Check-ins today", tCheckSub:function(){ return "members scanned in so far"; },
    recTile:"Recovered this month", memChartSub:"Active, frozen and past-due memberships at each month end.",
    colChart:"Dues collected by month", colChartSub:"Drafts that cleared plus declines recovered by retries. This month is to date.",
    visPer:"Visits / member, 30 d", lastCol:"Last scan", visCol:"Visits, 30 d", noVisit:"No scans in 90 days",
    pausedNext:"Frozen — no draft scheduled",
    pdBanner:"Owes declined drafts. Billing retries them on payday — Fri, Nov 20 at 6:00 AM.",
    pdBtns:[["⟳ Retry now","Demo — retry queued"],["Send link","Demo — secure update link sent by text"],["Take payment","Demo — card reader ready"]],
    billDay:"Billing day", nextCharge:"Next draft", payMethod:"Payment method", payVal:function(p){ return p.card+" · exp "+p.cardExp; },
    ledgerSub:"Monthly drafts, newest first.", ledgerCol:"Method", ledgerDesc:"dues", ledgerVal:function(p){ return p.card; },
    visTitle:"Attendance", visSub:"Door scans and class check-ins at both locations, last 90 days.", homeLoc:"Home location", visType:"Visit", visBy:"Entry", visByVal:"Door scan",
    consentTitle:"Marketing consent", flagLabel:"Unlimited classes",
    bPaid:"drafted", bRec:"recovered by retries", bNext:"Next draft", bOpen:"Declines being retried", bOpenSub:"drafts · next try Fri, Nov 20 — payday",
    bRate:"Recovery rate", bRateSub:"won back by retries, Jul–Sep (the last 3 closed months)", bPausedSub:"freezes end within 7 days",
    colChart12:"Dues collected, last 12 months", bRecOf:"recovered from declined drafts", sPaid:"Drafts cleared", sRec:"Recovered by retries",
    runWord:"Draft run", runUnit:"drafts", retryRow:"Next retry Fri, Nov 20, 6:00 AM", retryRowSub:"on the payday retry",
    runsTitle:"Draft runs", runsSub:"Dues draft at 4:00 AM on the 1st or the 15th, depending on each member's billing day.", runDec:"declined", runsTab:"Draft runs",
    decTab:"Declines", decTitle:"Declines in the retry window", decSub:"Retries run on each member's payday, then a card-update link goes out.",
    decCol:"Reason", decNext:"Next try", decReason:"Insufficient funds", decNextVal:"Fri, Nov 20 — payday", decChip:"Retrying",
    billSub:"Dues, draft runs, freezes and declined payments.",
    joins:"Joins", joinsV:"joins", cancels:"Cancellations", cancel1:"cancellation",
    riskLabel:"Active, no scan in 21+ days", riskSub:"most likely to cancel next",
    riskNote:"Active members who haven't scanned in for three weeks — the ones who stop coming are the ones who cancel next. Win-back outreach works this list.",
    rec12:"Recovered by retries, 12 months", rec12Sub:"declined drafts won back",
    collTitle:"What happened to declined drafts", collSub:"Every draft that declined, by month: recovered by retries, written off, or still open.", sWo:"Written off", sOpen:"Still open",
    agentSub:"The repetitive billing, front-desk and follow-up work the agent does, and the calls it leaves to you.",
    recTileMonth:"Recovered by retries, this month", waitSub:"charges, member texts and sign-offs",
    safety:"It never refunds, waives, cancels or sends anyone to collections without a person. Each decision carries the agent's recommendation — you approve or decline."
  },
  fd:{ who:"staff", n:14, start:4*60+30, step:[45,60,60,75], now:11*60+20, done:"Done", nowSt:["In session","Checking in"], later:"Scheduled",
    types:["HIIT 45","Strength basics","Spin","Yoga flow","Open gym PT","Mobility"], caps:[16,20,24], walk:[4,2],
    sub:"Today's classes, check-ins and holds", listTitle:"Class schedule", head:["Time","Coach","Class","Status"],
    staffName:function(r){ return COACHES[Math.floor(r.t/15)%COACHES.length]; },
    checkins:function(f){ return f.todayN; },
    tiles:function(f,F){ return [["Classes today",String(f.n),f.open+" open spots across the day"],["Members scanned in",String(f.todayN),"so far today"],["Day passes sold",String(f.walk),"at the front desk"],["Balance holds at check-in",String(K.fd.holds(F).filter(function(x){return x[3]==="Billing hold";}).length),"let in, retry queued","bad"]]; },
    holds:function(F){ var out=[]; if(PD0 && (LOC==="all"||PD0.loc===LOC)) out.push([shortName(PD0)+" — card on file declined at check-in","Let in today · payday retry queued for the open balance","bad","Billing hold"]);
      out.push(["Guest signed in without a waiver","Desk caught it · waiver signed by text on the spot","warn","Fixed"]);
      out.push(["Walk-in asked about family plans in Spanish","Routed to the desk · tour booked","good","Booked"]); return out; },
    src:"Class reminders for today went out by text before the doors opened."
  },
  pos:{ n:23, rPrefix:"IF-", pays:["Visa •3433","Card on file","Cash","MC •7565"],
    products:[["Whey protein — 2 lb",39.99,28,10],["Shaker bottle",9.99,6,12],["Ironline tee",24.99,64,20],["Lifting chalk",7.99,5,10],["Pre-workout",34.99,31,10],["Wrist wraps",14.99,26,8],["Gym towel",11.99,42,15],["Water — case",12.00,4,6],["Resistance bands set",19.99,24,8],["Day pass",15.00,0,0,true]],
    month:[2840,3310,3120,2960,3080,2890,2760,2810,3020,3150,3240], mtd:1720, po:{amt:412},
    sub:"Register: supplements, apparel and gear.", tToday:"Sales today", tTodaySub:"sales", tMonth:"Pro shop this month", tAvg:"Average sale",
    stockTitle:"Products", salesTitle:"Today's sales", rCol:"Receipt", payCol:"Paid with", chartTitle:"Pro shop sales by month"
  },
  roles:[["Coach",6,24],["Front desk",6,16],["Trainer",4,28],["Billing",2,22],["Manager",2,32]], staffExc:2,
  lead:{ stages:[["new","New","#8a8f98",9],["contacted","Contacted","var(--c2)",13],["booked","Tour booked","var(--c1)",6],["showed","Toured","var(--c4)",8],["joined","Joined","var(--c3)",9]],
    srcW:[["Website",26],["AI receptionist",22],["Walk-in",14],["Google",14],["Instagram",12],["Referral",12]], owners:["Grace Amaral","Steven Santiago","Alex M."], waiting:4,
    next:{"new":["Send the class schedule"],contacted:["Book the tour","Answer a pricing question"],booked:["Confirm the tour by text"],showed:["Send the join offer","Day-5 trial check-in"],joined:["Check in after the first workout"]},
    sub:"Every prospect from first touch to a signed membership — including the tours the AI receptionist booked overnight.", wonWord:"joined"
  },
  calls:function(H){ return [
    {t:"5:48 AM",w:H.pt(8),c:[["info","Answered"]],x:"Asked whether the 6 AM class had space — added to the class and sent the waiver",v:"—",off:true,d:"0:52",tr:"<b>AI:</b> Two spots left in the 6 AM — you're in. The waiver link is on its way by text."},
    {t:"8:12 AM",w:"María G. · new lead",c:[["acc","Español"],["good","Tour booked"]],x:"Tour booked for Thursday 5:30 — switched to Spanish mid-call",v:"$69.99/mo",vn:69.99,booked:true,d:"2:51",tr:"<b>Caller:</b> ¿Puedo visitar el gimnasio esta semana? <b>AI:</b> Claro — el jueves a las 5:30. ¿Le interesa el plan familiar? <b>Caller:</b> Sí. <b>AI:</b> Confirmada."},
    {t:"12:34 PM",w:"R. Patel · new lead",c:[["warn","Peak"],["good","Trial booked"]],x:"7-day trial started while the desk was on the floor — waiver signed by text",v:"$49.99/mo",vn:49.99,booked:true,off:true,d:"3:12",tr:"<b>AI:</b> The desk is on the floor right now, but I can start your trial — first visit tomorrow at 6 PM?"},
    {t:"12:41 PM",w:"Unknown caller",c:[["warn","Peak"],["info","Answered"]],x:"Hours, day-pass price and parking — no person needed",v:"—",off:true,d:"0:58",tr:"<b>AI:</b> Open until 11 tonight. Day passes are $15, and parking is free behind the building."},
    {t:"3:05 PM",w:H.pt(10),c:[["good","Cancel saved"]],x:"Called to cancel — took a 60-day freeze instead",v:"membership kept",saved:true,d:"1:47",tr:"<b>Caller:</b> I need to cancel, work is crazy. <b>AI:</b> Before I do — I can freeze your membership for 60 days instead. Want that? <b>Caller:</b> Yeah, actually."},
    {t:"6:48 PM",w:"K. Alvarez · new lead",c:[["good","Tour booked"]],x:"Family tour Saturday 11:00 — booked for the whole family",v:"$69.99/mo",vn:69.99,booked:true,d:"2:05",tr:"<b>AI:</b> Saturday 11:00 works — I've booked the family tour. See you then."},
    {t:"9:17 PM",w:H.pt(11),c:[["acc","After hours"],["good","Card updated"]],x:"Called about a declined card — secure update link sent while still on the line",v:"—",off:true,d:"1:21",tr:"<b>AI:</b> I've texted you a secure link to update the card. Once it's updated the open balance clears on the next retry."},
    {t:"10:52 PM",w:"T. Okafor · new lead",c:[["acc","After hours"],["good","Tour booked"]],x:"Looking at gyms late at night — tour booked for tomorrow 7 PM",v:"$29.99/mo",vn:29.99,booked:true,off:true,d:"1:12",tr:"<b>AI:</b> Tomorrow 7 PM works — ask for the front desk. Want the class schedule by text?"}
  ]; },
  rx:{ sub:"Every call answered, recorded and transcribed — while your staff coaches. Anything uncertain goes to a person.", offSub:"before open, after close or at peak",
    bookedLabel:"Tours and trials booked", bookedSub:"a month in memberships in play", saveLabel:"Cancellations saved", saveSub:"frozen instead of cancelled",
    sim:{ from:"New caller · (210) 555-0164", toast:"Trial booked — $49.99/mo membership in play",
      lines:[["AI","Thanks for calling Ironline Fitness — how can I help?"],["Caller","I've been thinking about joining. Can I try it first?"],["AI","Absolutely — the trial is 7 days, every class included. Want to start tomorrow?"],["Caller","Yeah. Evenings work best."],["AI","Then come at 6 PM — I'll book you into Strength Basics and text you the waiver now."],["Caller","That easy?"],["AI","That easy. You're booked for tomorrow at 6 PM — see you then."]],
      row:{t:"Just now",w:"New lead · (210) 555-0164",c:[["good","Trial booked"]],x:"7-day trial starts tomorrow 6 PM — waiver sent by text",v:"$49.99/mo",vn:49.99,booked:true,d:"1:12"} }
  },
  jobs:[
    {n:"After-hours & peak answering",m:0,each:5,runs:function(b){ return b.offCalls*30*b.share; },w:"Answers when the desk is on the floor or the club is closed, books tours and trials, starts waivers by text.",b:"Night callers hit voicemail and joined whichever gym answered."},
    {n:"Cancel-saves",m:0,each:6,runs:14,w:"When someone calls to cancel, offers one honest alternative — a freeze or a plan change — before processing.",b:"The desk took the cancellation and the membership was gone."},
    {n:"Payday retries",m:1,each:6,runs:function(b){ return b.declines; },w:"Retries declined dues on the member's payday.",b:"Billing re-ran declined drafts by hand the next morning."},
    {n:"Card-update links",m:1,each:6,runs:function(b){ return b.declines*0.2; },w:"When a card is expired or dead, texts a secure link to update it instead of retrying.",b:"The desk called each member and typed the new number over the phone."},
    {n:"Win-back outreach",m:0,each:5,runs:function(b){ return b.risk; },w:"Members who stop scanning in get a friendly text before they get to the cancel call.",b:"Nobody noticed a member had gone quiet until the cancellation came in."},
    {n:"Trial follow-up",m:0,each:7,runs:27,w:"Follows every trial through day 2, day 5 and day 7 with the join offer.",b:"Trials expired silently; whoever remembered to follow up, followed up."},
    {n:"Class waitlist fill",m:0,each:5,runs:19,w:"When a spot opens, offers it to the waitlist first-come and closes it when filled.",b:"Open spots in full classes just went empty."},
    {n:"Clean campaign lists",m:0,each:9,runs:function(b){ return b.sends; },w:"Removes cancelled members and opted-out contacts from every campaign before it sends.",b:"Lists were exported, cleaned by hand and re-imported before each send."},
    {n:"Freeze processing",m:0,each:8,runs:function(b){ return b.cur*0.01; },w:"Handles freeze requests end to end — dates, proration, the return-date reminder.",b:"Freezes were sticky notes on the desk monitor."}
  ],
  att:function(F){ var rows=[
    ["urgent","Billing",F.pdN+" members in the retry window",F.pdSum+" still open — payday retries running; "+F.recMonth+" recovered so far this month","#billing", F.pdN],
    ["urgent","Front desk",PD0?shortName(PD0)+"'s card on file declined at check-in":"","Balance hold — let in today, retry queued for payday","#frontdesk", PD0&&(LOC==="all"||PD0.loc===LOC)?1:0],
    ["urgent","Leads",F.waitN+" new leads still waiting on a first reply",F.waitNames.join(", ")+(F.waitN>2?" + "+(F.waitN-2)+" more":""),"#leads", F.waitN],
    ["warn","Win-back",F.riskN+" active members haven't scanned in for 21+ days","Win-back texts drafted — waiting on your approval","#agent", F.riskN],
    ["warn","Classes","Tomorrow's 6 AM class has 4 open spots","Waitlist offer drafted — waiting on your approval","#agent", 1],
    ["warn","Staff",F.excN+" payroll exceptions to resolve","Missed punches","#staff", F.excN],
    ["info","Pro shop",F.lowN+" items under reorder point","PO drafted to TexFit Supply — $412","#optical", F.lowN]
  ]; return rows.filter(function(r){ return r[5]>0; }); },
  waiting:function(F){ var ok=F.a.risk.filter(function(p){return p.smsOk;}), yrC=0, k=F.pdNames.length, out=[];
    ok.forEach(function(p){ yrC+=p.rateC*12; });
    if(ok.length) out.push({t:"Send win-back texts to "+ok.length+" quiet members",s:"“Hi [name], we miss you at Ironline — your next class is on us.”",c:["warn","Win-back"],m:m0(yrC)+"/yr",rec:"<b>Agent recommends: Approve.</b> All "+ok.length+" are active, haven't scanned in for 21+ days, and have texting consent. "+m0(yrC)+" is what they pay in a year.",done:"Sent win-back texts to "+ok.length+" quiet members"});
    if(k) out.push({t:"Retry "+k+" failed payments and notify the members",s:F.pdNames.join(", ")+" — card declined on the last draft",c:["bad","Billing"],m:m2(F.pd3C),rec:"<b>Agent recommends: Approve.</b> One month of dues each; retries are timed to each member's payday.",done:"Retried "+k+" failed payments and notified the members"});
    out.push({t:"Offer tomorrow's 4 open 6 AM spots to the waitlist",s:"First come, first served",c:["warn","Classes"],m:"—",rec:"<b>Agent recommends: Approve.</b> The offer closes itself when the class fills.",done:"Offered tomorrow's 4 open 6 AM spots to the waitlist"});
    return out; },
  decided:function(H){ return [
    {t:"Sent class reminders for today's "+FD.length+" classes",s:"By text, before the doors opened",time:"Today 4:00 AM"},
    {t:"Froze "+H.pt(10)+"'s membership for 60 days",s:"Asked to cancel by phone — took the freeze instead",time:"Nov 16, 3:05 PM"},
    {t:"Sent "+H.pt(11)+" a card-update link",s:"Declined card — link sent while still on the call",time:"Nov 16, 9:17 PM"},
    {t:"Drafted PO-2231 to TexFit Supply — $412.00",s:"Shaker bottles, chalk and water under reorder point",time:"Nov 16, 5:52 PM"},
    {t:"Booked a tour for a late-night caller",s:"Tomorrow 7 PM · taken by the AI receptionist at 10:52 PM",time:"Nov 16, 10:52 PM"}
  ]; },
  camp:{ winLabel:"Came back from campaigns, last 30 days", winVal:"52 members", winSub:"plus 11 cards updated and 31 guest passes used", segSub:"Cancelled members are never counted.",
    rows:[
      {n:"November challenge kickoff",s:"Status is Active · opted in to challenges",st:["info","Scheduled"],ch:"SMS",sent:"Goes out Nov 18, 10:00 AM",a:412},
      {n:"Upgrade to Plus offer",s:"Base plan · 12+ visits in 30 days",st:["warn","Draft"],ch:"Email",sent:"Edited Nov 13, 2:20 PM"},
      {n:"Card update reminder",s:"Status is Past due",st:["good","Sent"],ch:"SMS",sent:"Nov 10, 10:00 AM",a:61,d:59,cl:14,res:"11 cards updated",thisMonth:true,sent30:true},
      {n:"We miss you",s:"Active · no scan in 21+ days",st:["good","Sent"],ch:"Email + SMS",sent:"Nov 3, 9:00 AM",a:214,d:205,cl:38,res:"52 came back",thisMonth:true,sent30:true},
      {n:"Bring-a-friend week",s:"Active · 6+ months as a member",st:["good","Sent"],ch:"SMS",sent:"Oct 26, 11:00 AM",a:488,d:471,cl:64,res:"31 guest passes used",sent30:true},
      {n:"Come back — no enrollment fee",s:"Cancelled · reason was Cost",st:["good","Sent"],ch:"Email + SMS",sent:"Oct 15, 10:00 AM",a:41,d:39,cl:6,res:"4 rejoined"},
      {n:"Frozen members coming back",s:"Frozen · freeze ends this month",st:["good","Sent"],ch:"Email",sent:"Oct 4, 9:00 AM",a:28,d:27,cl:9,res:"11 unfroze early"}
    ],
    segs:function(F){ return [["Past due",F.a.pd],["Active · no scan in 21+ days",F.a.risk],["Unlimited classes",F.a.cur.filter(function(p){return p.flag;})],["Family plan",F.a.cur.filter(function(p){return p.plan==="Family";})]]; },
    builder:{ title:"Win-back: quiet members", text:"Active members who haven't scanned in for three weeks", hint:"Scans, plan, billing, class history and location all work.",
      rules:[["WHERE","Status","is","Active"],["AND","Last scan","is over","21 days ago"]], match:function(p){ return isRisk(p); },
      exclNote:"Never messaged: anyone who opted out of texts. Cancelled members are never in an audience. Nobody has to filter these by hand.",
      rowSub:function(p){ return "Active · "+p.plan+" plan · last scan "+lastVText(p).toLowerCase(); } }
  }
};
