// Six Harmony · Free Revenue Audit
// Branching quiz (Eye Care Practices / Industrial Service Companies) -> contact steps -> on-screen Revenue Assessment.
// Answers are sent to the Netlify form "revenue-audit" so every finished audit lands in Cristian's inbox.
(function () {
  "use strict";
  var root = document.getElementById("audit");
  if (!root) return;
  var BOOK = root.getAttribute("data-book") || "";
  var DEMO = { eye: root.getAttribute("data-demo-eye"), ind: root.getAttribute("data-demo-ind") };

  // ---------------- question sets ----------------
  var TIMING = { id: "timing", sec: "Timing", q: "{name}, if the plan makes sense, when would you want to start?",
    help: "This only changes the next step we suggest. You get the full assessment either way.",
    opts: [{ t: "Right away, if the plan and numbers make sense", v: "now" }, { t: "Within 30 days", v: "30" },
           { t: "We need to fix some basics first", v: "later" }, { t: "Just looking for now", v: "looking" }] };

  var SETS = {
    eye: {
      label: "Eye Care Practice", org: "practice", orgLabel: "Practice name",
      cats: { cov: "Call Coverage", ah: "After-Hours Calls", cb: "Callback Speed", fu: "Inquiry Follow-Up", rc: "Patient Recall" },
      qs: [
        { id: "role", sec: "About you", q: "{name}, what is your role at the practice?", help: "So the assessment speaks to the decisions you can make.",
          opts: [{ t: "Owner or doctor", v: "Owner or doctor" }, { t: "Practice administrator or manager", v: "Practice administrator or manager" },
                 { t: "Office or front desk lead", v: "Office or front desk lead" }, { t: "Something else", v: "Other" }] },
        { id: "size", sec: "Practice", q: "How many doctors see patients at your practice?", help: "Count optometrists and ophthalmologists, full or part time.",
          opts: [{ t: "1", v: "1", n: 1 }, { t: "2 to 3", v: "2-3", n: 2 }, { t: "4 to 6", v: "4-6", n: 4 }, { t: "7 or more", v: "7+", n: 7 }] },
        { id: "calls", sec: "Phones", q: "About how many calls does the front desk get on a normal day?", help: "A rough guess is fine. Answer for a normal day, not your busiest.",
          opts: [{ t: "Under 30", v: "<30", n: 20 }, { t: "30 to 60", v: "30-60", n: 45 }, { t: "60 to 100", v: "60-100", n: 80 }, { t: "More than 100", v: "100+", n: 130 }] },
        { id: "cov", sec: "Call coverage", q: "When the front desk is busy or at lunch, what happens to new calls?", help: "Think about a Monday morning, not a quiet afternoon.",
          opts: [{ t: "Someone always answers live", v: "live", s: { cov: 100 }, m: 0.02 },
                 { t: "Callers wait on hold until someone is free", v: "hold", s: { cov: 55 }, m: 0.07 },
                 { t: "Another staff member picks up when they can", v: "other", s: { cov: 45 }, m: 0.09 },
                 { t: "They go to voicemail", v: "voicemail", s: { cov: 15 }, m: 0.15 },
                 { t: "Honestly, not sure", v: "unsure", s: { cov: 25 }, m: 0.12 }] },
        { id: "ah", sec: "After hours", q: "What happens when a patient calls after hours or on the weekend?", help: "Evenings and weekends are when many new patients finally have time to call.",
          opts: [{ t: "They can book an appointment right then", v: "book", s: { ah: 100 }, m: 0, l: 0.05 },
                 { t: "An answering service takes a message", v: "service", s: { ah: 50 }, m: 0.02, l: 0.3 },
                 { t: "An emergency line only", v: "emergency", s: { ah: 35 }, m: 0.04, l: 0.5 },
                 { t: "Voicemail until we open", v: "voicemail", s: { ah: 15 }, m: 0.05, l: 0.6 }] },
        { id: "cb", sec: "Callback speed", q: "How fast do voicemails and messages get returned?", help: "New patients who reach voicemail often call the next practice on the list.",
          opts: [{ t: "Within the hour", v: "hour", s: { cb: 100 }, l: 0.25 }, { t: "The same day", v: "same day", s: { cb: 65 }, l: 0.4 },
                 { t: "The next business day", v: "next day", s: { cb: 30 }, l: 0.6 }, { t: "It depends on who is working", v: "depends", s: { cb: 15 }, l: 0.6 }] },
        { id: "inq", sec: "Follow-up", q: "{name}, about how many LASIK, cataract, or premium-lens inquiries does the practice get a month?", help: "Calls or forms from people asking about these procedures. A rough guess is fine.",
          opts: [{ t: "We don't offer these", v: "none", n: 0 }, { t: "Under 5", v: "<5", n: 3 }, { t: "5 to 15", v: "5-15", n: 10 }, { t: "More than 15", v: "15+", n: 20 }] },
        { id: "fu", sec: "Follow-up", q: "When someone asks about LASIK or premium lenses and doesn't book, what happens next?", help: "These are some of the highest-value calls a practice gets.",
          opts: [{ t: "They get follow-up over several days, automatically", v: "automatic", s: { fu: 100 }, f: 0 },
                 { t: "Staff follows up a few times", v: "few", s: { fu: 65 }, f: 0.35 },
                 { t: "One call or email", v: "once", s: { fu: 35 }, f: 0.65 },
                 { t: "Usually nothing", v: "none", s: { fu: 10 }, f: 0.9 }] },
        { id: "rc", sec: "Recall", q: "How do patients who are overdue for their annual exam get brought back?", help: "An overdue patient is the easiest appointment a practice can fill.",
          opts: [{ t: "Automatic texts, emails, or calls", v: "automatic", s: { rc: 100 }, r: 0.1 }, { t: "Postcards or a list staff works through", v: "list", s: { rc: 55 }, r: 0.5 },
                 { t: "When staff have time", v: "when time", s: { rc: 25 }, r: 0.7 }, { t: "We don't have a recall process", v: "none", s: { rc: 5 }, r: 0.9 }] },
        { id: "mkt", sec: "Growth", q: "Is the practice paying for marketing right now?", help: "Google Ads, SEO, social ads, or an agency.",
          opts: [{ t: "Yes, with an agency or monthly ad budget", v: "agency" }, { t: "Some ads we run ourselves", v: "some" },
                 { t: "Mostly referrals and word of mouth", v: "referrals" }] },
        TIMING
      ]
    },
    ind: {
      label: "Industrial Service Company", org: "company", orgLabel: "Company name",
      cats: { cov: "Call Coverage", ah: "After-Hours Emergencies", qs: "Quote Speed", qf: "Quote Follow-Up", pay: "Payment Follow-Up" },
      qs: [
        { id: "role", sec: "About you", q: "{name}, what is your role at the company?", help: "So the assessment speaks to the decisions you can make.",
          opts: [{ t: "Owner or president", v: "Owner or president" }, { t: "Operations or general manager", v: "Operations or general manager" },
                 { t: "Office manager", v: "Office manager" }, { t: "Something else", v: "Other" }] },
        { id: "size", sec: "Company", q: "How many people work at the company, including field techs?", help: "Full and part time.",
          opts: [{ t: "1 to 10", v: "1-10", n: 5 }, { t: "11 to 50", v: "11-50", n: 25 }, { t: "51 to 200", v: "51-200", n: 100 }, { t: "More than 200", v: "200+", n: 250 }] },
        { id: "calls", sec: "Phones", q: "About how many calls does the office get on a normal day?", help: "Customers, vendors, and techs calling in. A rough guess is fine.",
          opts: [{ t: "Under 15", v: "<15", n: 10 }, { t: "15 to 40", v: "15-40", n: 25 }, { t: "40 to 80", v: "40-80", n: 60 }, { t: "More than 80", v: "80+", n: 100 }] },
        { id: "quotes", sec: "Quotes", q: "About how many quotes does the company send in a normal month?", help: "A rough guess is fine.",
          opts: [{ t: "Under 10", v: "<10", n: 6 }, { t: "10 to 30", v: "10-30", n: 20 }, { t: "30 to 75", v: "30-75", n: 50 }, { t: "More than 75", v: "75+", n: 100 }] },
        { id: "qval", sec: "Quotes", q: "What is a typical quote worth?", help: "The middle of the road, not your biggest job.",
          opts: [{ t: "Under $2,500", v: "<2.5k", n: 1500 }, { t: "$2,500 to $10,000", v: "2.5-10k", n: 6000 },
                 { t: "$10,000 to $50,000", v: "10-50k", n: 25000 }, { t: "More than $50,000", v: "50k+", n: 75000 }] },
        { id: "cov", sec: "Call coverage", q: "When the office is busy, what happens to incoming calls?", help: "Think about your busiest morning.",
          opts: [{ t: "Someone always answers live", v: "live", s: { cov: 100 }, m: 0.02 }, { t: "Callers wait on hold", v: "hold", s: { cov: 55 }, m: 0.07 },
                 { t: "Whoever is free picks up when they can", v: "other", s: { cov: 45 }, m: 0.09 }, { t: "They go to voicemail", v: "voicemail", s: { cov: 15 }, m: 0.15 },
                 { t: "Honestly, not sure", v: "unsure", s: { cov: 25 }, m: 0.12 }] },
        { id: "ah", sec: "After hours", q: "{name}, when a customer calls with an emergency after hours, what happens?", help: "A burst line at 11 p.m. goes to whoever answers first.",
          opts: [{ t: "It reaches an on-call tech right away", v: "on-call", s: { ah: 100 }, l: 0.05 }, { t: "It rings the owner's cell phone", v: "owner cell", s: { ah: 40 }, l: 0.3 },
                 { t: "An answering service takes a message", v: "service", s: { ah: 50 }, l: 0.5 }, { t: "Voicemail until morning", v: "voicemail", s: { ah: 15 }, l: 0.7 }] },
        { id: "qs", sec: "Quote speed", q: "How long from a tech finding a problem on site to the customer getting a quote?", help: "Think about deficiencies and repairs found during inspections or service calls.",
          opts: [{ t: "The same day", v: "same day", s: { qs: 100 }, u: 0 }, { t: "Two or three days", v: "2-3 days", s: { qs: 60 }, u: 0.25 },
                 { t: "About a week", v: "a week", s: { qs: 30 }, u: 0.75 }, { t: "Findings often never become a quote", v: "never", s: { qs: 5 }, u: 2 }] },
        { id: "qf", sec: "Quote follow-up", q: "After a quote goes out, how many times does someone follow up?", help: "Most open quotes aren't a no. Nobody asked again.",
          opts: [{ t: "Until they answer, on a set schedule", v: "scheduled", s: { qf: 100 }, f: 0.05 }, { t: "Two or three times", v: "2-3", s: { qf: 65 }, f: 0.2 },
                 { t: "Once", v: "once", s: { qf: 30 }, f: 0.45 }, { t: "Usually never", v: "never", s: { qf: 10 }, f: 0.7 }] },
        { id: "pay", sec: "Payments", q: "When an invoice is late, what happens?", help: "Be honest. Most companies are somewhere in the middle.",
          opts: [{ t: "Automatic reminders go out on a schedule", v: "automatic", s: { pay: 100 }, p: 0.1 }, { t: "Someone calls when they notice", v: "notice", s: { pay: 50 }, p: 0.25 },
                 { t: "Only when it gets really late", v: "really late", s: { pay: 25 }, p: 0.4 }, { t: "We rarely send reminders", v: "rarely", s: { pay: 10 }, p: 0.5 }] },
TIMING
      ]
    }
  };

  var PLANS = {
    eye: {
      cov: ["Pull one week of call logs and count calls that went to voicemail or were abandoned. That number is your starting point.",
            "Cover lunch and the morning rush first: those two windows hold most of the missed calls in a typical practice.",
            "Set a simple rule: no new-patient call waits more than a few rings, with overflow going to a system that books, not a voicemail box."],
      ah: ["Count last week's after-hours calls and voicemails, and how many were new patients.",
           "Let after-hours callers book routine exams themselves, and route urgent eye problems to your on-call doctor.",
           "Review Monday mornings for two weeks: the voicemail pile should shrink to near zero."],
      cb: ["Time ten voicemail callbacks this week and note who booked and who had already gone elsewhere.",
           "Set a same-hour callback rule for new-patient and consult messages, with one person responsible each day.",
           "Move routine callbacks (confirmations, reschedules) to automatic texts so staff time goes to new patients."],
      fu: ["List every LASIK and premium-lens inquiry from the last 60 days that didn't book.",
           "Set up a three-touch follow-up by text and email over ten days, with a direct link to book a consult.",
           "Have your coordinator call the warmest replies personally, and track consults booked from follow-up."],
      rc: ["Pull the list of patients more than 12 months past their last exam.",
           "Send an automatic recall sequence by text and email, with online booking in every message.",
           "Track how many recalled patients book each week and keep the sequence running every month."]
    },
    ind: {
      cov: ["Pull one week of call logs and count missed and abandoned calls during business hours.",
            "Cover the morning dispatch rush first, when calls stack up while the office is assigning crews.",
            "Make sure every overflow call is answered, triaged, and logged with a written summary, not left as a voicemail."],
      ah: ["Count last month's after-hours calls and how many were real emergencies.",
           "Route real emergencies to the on-call tech in minutes, with a summary of the address, problem, and contact.",
           "Log routine after-hours requests and book them first thing in the morning."],
      qs: ["Count inspection findings from the last 30 days and how many became a quote.",
           "Have findings turned into a draft quote the same day, with a person approving it before it goes out.",
           "Track the time from finding to quote every week until same-day is the normal."],
      qf: ["List every open quote from the last 60 days and how many times anyone followed up.",
           "Put every open quote on an automatic follow-up schedule until the customer approves, declines, or asks a question.",
           "Review open quotes weekly: what's waiting, what it's worth, and what needs a personal call."],
      pay: ["List every invoice past due and how many reminders each one got.",
           "Start automatic, polite payment reminders at 3, 10, and 20 days past due.",
           "Escalate anything past 30 days to a personal call, and track days-to-paid every month."]
    }
  };

  var GAP_LINES = {
    eye: { cov: "New patients who can't get through during busy hours usually call the next practice on their list.",
           ah: "Evenings and weekends are when many new patients finally have time to call, and voicemail doesn't book them.",
           cb: "The longer a message waits, the more likely the patient has already booked somewhere else.",
           fu: "LASIK and premium-lens inquiries are high value and often need two or three touches before they book.",
           rc: "Overdue patients are the cheapest appointments to fill, and without recall most of them drift away." },
    ind: { cov: "Calls that go unanswered during the day are often work your competitor picks up instead.",
           ah: "Emergency calls go to whoever answers first, and that's often the customer's next call.",
           qs: "Findings that sit for days lose urgency, and some never become a quote at all.",
           qf: "Most open quotes aren't a no. Nobody asked again.",
           pay: "Late invoices without reminders stretch your cash and your crew's patience." }
  };

  // ---------------- state ----------------
  var params = new URLSearchParams(location.search);
  var tp = root.getAttribute("data-type") || params.get("type");
  var preset = tp === "eye" ? "eye" : (tp === "industrial" || tp === "ind") ? "ind" : null;
  var leadFirst = root.getAttribute("data-mode") === "lead-first";   // landing pages: name, email, phone first (Tim's application order)
  function variant() { return root.getAttribute("data-variant") || ""; }
  var S = { step: "start", first: "", last: "", type: preset, ans: {}, qi: 0, email: "", company: "", phone: "", sent: false };

  function set() { return SETS[S.type]; }
  function flow() {
    var list = [];
    if (!preset) list.push({ id: "type", sec: "Industry", q: "{name}, which best describes your business?", help: "Your questions change to match your industry.",
      opts: [{ t: "Eye Care Practice", v: "eye" }, { t: "Industrial Service Company", v: "ind" }] });
    if (S.type) list = list.concat(set().qs);
    else list = list.concat(SETS.eye.qs); // length placeholder until type is chosen
    return list;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nameIn(s) { return s.replace("{name}, ", S.first ? esc(S.first) + ", " : "").replace(/^(\w)/, function (m) { return m.toUpperCase(); }); }

  // ---------------- rendering ----------------
  function render() {
    var html;
    if (S.step === "start") html = startView();
    else if (S.step === "q") html = questionView();
    else if (S.step === "contact") html = contactView();
    else html = resultView();
    root.innerHTML = html;
    root.setAttribute("data-step", S.step);
    var host = root.closest("[data-audit-host]");
    if (host) host.classList.toggle("au-active", S.step !== "start");
    var h = root.querySelector("[data-focus]");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    var top = root.getBoundingClientRect().top + window.scrollY - 90;
    if (S.step !== "start" && window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    bind();
  }

  function startView() {
    if (leadFirst) return '<form class="au-card au-start" data-form="start" novalidate>' +
      '<h2 data-focus>Start your free audit</h2>' +
      '<p class="au-help">Three quick details, then ' + (preset ? "11" : "12") + ' one-tap questions. Your Revenue Assessment shows on screen when you finish.</p>' +
      '<div class="au-row"><div><label for="au-first">First name</label><input id="au-first" name="first" type="text" autocomplete="given-name" required value="' + esc(S.first) + '"></div>' +
      '<div><label for="au-last">Last name</label><input id="au-last" name="last" type="text" autocomplete="family-name" value="' + esc(S.last) + '"></div></div>' +
      '<div class="au-row au-row1"><div><label for="au-email">Work email</label><input id="au-email" name="email" type="email" inputmode="email" autocomplete="email" required value="' + esc(S.email) + '"></div></div>' +
      '<div class="au-row au-row1"><div><label for="au-phone">Phone</label><input id="au-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(210) 555-0123" required value="' + esc(S.phone) + '"></div></div>' +
      '<p class="au-err" role="alert" hidden></p>' +
      '<button class="btn btn-gold au-go" type="submit">Start my free audit <span aria-hidden="true">&rarr;</span></button>' +
      '<p class="au-meta">Free · About 3 minutes · We never share your details. Please don\'t include patient or customer information.</p></form>';
    return '<form class="au-card au-start" data-form="start" novalidate>' +
      '<h2 data-focus>Start your free audit</h2>' +
      '<p class="au-help">We use your first name to personalize the questions and your assessment.</p>' +
      '<div class="au-row"><div><label for="au-first">First name</label><input id="au-first" name="first" type="text" autocomplete="given-name" required value="' + esc(S.first) + '"></div>' +
      '<div><label for="au-last">Last name</label><input id="au-last" name="last" type="text" autocomplete="family-name" value="' + esc(S.last) + '"></div></div>' +
      '<p class="au-err" role="alert" hidden>Please add your first name.</p>' +
      '<button class="btn btn-gold au-go" type="submit">Start my audit <span aria-hidden="true">&rarr;</span></button>' +
      '<p class="au-meta">' + (preset ? "11" : "12") + ' quick questions · About 3 minutes · Results on screen</p></form>';
  }

  function questionView() {
    var list = flow(), q = list[S.qi], total = list.length, pct = Math.round((S.qi) / total * 100);
    var chosen = S.ans[q.id];
    var opts = q.opts.map(function (o, i) {
      var on = chosen && chosen.v === o.v;
      return '<li><button type="button" class="au-opt' + (on ? " on" : "") + '" data-i="' + i + '" aria-pressed="' + (on ? "true" : "false") + '"><span class="au-box" aria-hidden="true"></span><span>' + esc(o.t) + '</span></button></li>';
    }).join("");
    return '<div class="au-card au-q">' +
      '<div class="au-prog"><div class="au-bar"><i style="width:' + pct + '%"></i></div><div class="au-count"><span>Question ' + (S.qi + 1) + ' of ' + total + '</span><span>' + pct + '%</span></div></div>' +
      '<p class="au-sec"><span>' + esc(q.sec) + '</span><i></i><span>Building your assessment</span></p>' +
      '<h2 data-focus>' + nameIn(q.q) + '</h2>' +
      (q.help ? '<p class="au-help">' + esc(q.help) + '</p>' : "") +
      '<ul class="au-opts" role="list">' + opts + '</ul>' +
      '<div class="au-foot"><button type="button" class="au-back" data-back>&larr; Back</button><span class="au-note">Your answers shape the assessment</span></div></div>';
  }

  var CSTEPS = leadFirst ? ["company"] : ["email", "company", "phone"];
  function contactView() {
    var k = S.cstep || "email", idx = CSTEPS.indexOf(k);
    var tabs = CSTEPS.map(function (c, i) {
      var lbl = c === "email" ? "Email" : c === "company" ? (set().org === "practice" ? "Practice" : "Company") : "Phone";
      return '<li class="' + (i === idx ? "on" : i < idx ? "done" : "") + '"><b>' + (i + 1) + '</b>' + lbl + '</li>';
    }).join("");
    var field;
    if (k === "email") field = '<label for="au-c">Where should we reach you about your assessment?</label><input id="au-c" type="email" autocomplete="email" inputmode="email" placeholder="you@yourpractice.com" required value="' + esc(S.email) + '">';
    else if (k === "company") field = '<label for="au-c">' + set().orgLabel + '</label><input id="au-c" type="text" autocomplete="organization" required value="' + esc(S.company) + '">';
    else field = '<label for="au-c">Best phone number <span class="au-opt-tag">optional</span></label><input id="au-c" type="tel" autocomplete="tel" inputmode="tel" placeholder="(210) 555-0123" value="' + esc(S.phone) + '">';
    return '<form class="au-card au-contact" data-form="contact" novalidate>' +
      '<p class="au-sec"><span>Questions complete</span><i></i><span>Assessment ready</span></p>' +
      '<h2 data-focus>' + (S.first ? esc(S.first) + ", your" : "Your") + ' Revenue Assessment is ready.</h2>' +
      '<p class="au-help">' + (leadFirst ? 'Last step. Your score, your #1 gap, the monthly estimate, and your 30-day plan are on the next screen.' : 'Add your details one step at a time. Your score, your #1 gap, the monthly estimate, and your 30-day plan are on the next screen.') + '</p>' +
      (CSTEPS.length > 1 ? '<ol class="au-tabs">' + tabs + '</ol>' : '') + field +
      '<p class="au-err" role="alert" hidden></p>' +
      '<button class="btn btn-gold au-go" type="submit">' + (k === CSTEPS[CSTEPS.length - 1] ? "See my assessment" : "Continue") + ' <span aria-hidden="true">&rarr;</span></button>' +
      (k === "phone" ? '<button type="button" class="au-skip" data-skip>Skip and see my assessment</button>' : "") +
      '<p class="au-meta">We only use this to follow up about your assessment. No spam, and we never share it. Please don\'t include patient or customer information.</p>' +
      '<div class="au-foot"><button type="button" class="au-back" data-back>&larr; ' + (idx ? "Back" : "Review my answers") + '</button></div></form>';
  }

  // ---------------- scoring ----------------
  function compute() {
    var st = set(), sums = {}, cnt = {};
    Object.keys(st.cats).forEach(function (c) { sums[c] = 0; cnt[c] = 0; });
    st.qs.forEach(function (q) {
      var a = S.ans[q.id]; if (!a || !a.s) return;
      Object.keys(a.s).forEach(function (c) { sums[c] += a.s[c]; cnt[c] += 1; });
    });
    var cats = Object.keys(st.cats).map(function (c) { return { k: c, name: st.cats[c], v: cnt[c] ? Math.round(sums[c] / cnt[c]) : 50 }; });
    var score = Math.round(cats.reduce(function (t, c) { return t + c.v; }, 0) / cats.length);
    var gap = cats.slice().sort(function (a, b) { return a.v - b.v; })[0];
    var est, A = S.ans;
    if (S.type === "eye") {
      var calls = A.calls.n, docs = A.size.n, NP = 0.30, VAL = 300;
      var busy = calls * (A.cov.m || 0.1) * 21 * NP * (A.cb.l || 0.5) * VAL;           // missed at busy times, share lost depends on callback speed
      var after = calls * 0.10 * 21 * NP * (A.ah.l || 0.5) * VAL;                      // about 10% of calls come after hours
      var lasik = (A.inq.n || 0) * (A.fu.f || 0) * 0.2 * 4000;                         // 1 in 5 unfollowed inquiries won back, $4,000 a case
      var recall = docs * 1500 * 0.25 / 12 * (A.rc.r || 0.5) * 0.25 * 150;             // ~1,500 active patients per doctor, a quarter come due each year
      est = { month: busy + after + lasik + recall,
        lines: [["Missed calls at busy times", busy, "AI answers every call on the first ring"],
                ["After-hours and weekend calls", after, "Books appointments 24/7"],
                ["LASIK and premium-lens inquiries with no follow-up", lasik, "Automatic follow-up by text and email"],
                ["Overdue patients not brought back", recall, "Automatic recall"]],
        note: "Estimated from your answers using conservative averages: 30% of calls are new patients or booking requests at a $300 first-year value, about 10% of calls come after hours, 21 working days a month, 1 in 5 unbooked LASIK or premium-lens inquiries won back at $4,000 a case, and about 1,500 active patients per doctor with a quarter due each year at $150 a visit. Your real numbers will differ. We work them out with you on the strategy call." };
    } else {
      var c2 = A.calls.n, qn = A.quotes.n, qv = A.qval.n, win = 0.30;
      var missed = c2 * (A.cov.m || 0.1) * 21 * 0.2 * 0.5 * win * qv * 0.5;            // 1 in 5 calls is new work, half of missed ones lost, service jobs at half a typical quote
      var emerg = c2 * 21 * 0.015 * (A.ah.l || 0.5) * qv * 0.25;                         // about 1.5% of call volume is after-hours emergencies, worth a quarter of a typical quote
      var unq = (A.qs.u || 0) * Math.max(1, qn / 20) * win * 0.5 * qv;                  // findings never quoted, closed at half the normal win rate
      var cold = qn * (A.qf.f || 0.2) * win * 0.5 * qv;                                // quotes with no follow-up, closed at half the normal win rate
      var late = qn * win * qv * (A.pay.p || 0.25);                                    // cash tied up, shown separately
      est = { month: missed + emerg + unq + cold,
        lines: [["Missed calls during the day", missed, "Every call answered and triaged"],
                ["After-hours emergencies", emerg, "On-call tech paged in minutes"],
                ["Field findings never quoted", unq, "Same-day quotes from findings"],
                ["Quotes gone cold", cold, "Automatic quote follow-up"]],
        extra: ["Cash tied up in late invoices", late, "Automatic payment reminders"],
        note: "Estimated from your answers using conservative averages: a 30% normal win rate, missed and cold work closing at half that rate, 1 in 5 calls being new work, about 1.5% of calls being after-hours emergencies worth a quarter of a typical quote, and other service jobs worth half a typical quote. Late invoices are cash you're waiting on, not lost revenue, so they aren't in the total. Your real numbers will differ. We work them out with you on the strategy call." };
    }
    var grade = score >= 80 ? "Strong" : score >= 60 ? "Solid, with gaps" : score >= 40 ? "Leaking" : "Leaking badly";
    return { cats: cats, score: score, gap: gap, est: est, grade: grade };
  }

  function dial(score) {
    var r = 54, c = 2 * Math.PI * r, off = c * (1 - score / 100);
    return '<svg viewBox="0 0 140 140" class="au-dial" role="img" aria-label="Revenue score ' + score + ' out of 100">' +
      '<circle cx="70" cy="70" r="' + r + '" class="au-dial-bg"/>' +
      '<circle cx="70" cy="70" r="' + r + '" class="au-dial-fg" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 70 70)"/>' +
      '<text x="70" y="78" text-anchor="middle" class="au-dial-n">' + score + '</text><text x="70" y="98" text-anchor="middle" class="au-dial-of">/ 100</text></svg>';
  }
  function money0(n) { return "$" + (Math.round(n / 50) * 50).toLocaleString("en-US"); }

  function resultView() {
    var R = compute(), st = set(), plan = PLANS[S.type][R.gap.k];
    var bars = R.cats.map(function (c) {
      var cls = c.v >= 70 ? "ok" : c.v >= 40 ? "mid" : "low";
      return '<li class="' + cls + '"><span>' + esc(c.name) + '</span><div class="au-track"><i style="width:' + Math.max(4, c.v) + '%"></i></div><b>' + c.v + '</b></li>';
    }).join("");
    var lines = R.est.lines.map(function (l) { return '<div><dt>' + esc(l[0]) + '<small>' + esc(l[2]) + '</small></dt><dd>' + money0(l[1]) + ' / mo</dd></div>'; }).join("");
    if (R.est.extra) lines += '<div class="co-extra"><dt>' + esc(R.est.extra[0]) + ' (not counted above)<small>' + esc(R.est.extra[2]) + '</small></dt><dd>' + money0(R.est.extra[1]) + '</dd></div>';
    var qualifies = S.type === "eye" ? (S.ans.size.n >= 2 || (S.ans.mkt && S.ans.mkt.v === "agency")) : S.ans.size.n >= 11;
    var book = BOOK + (BOOK.indexOf("?") > -1 ? "&" : "?") + "name=" + encodeURIComponent((S.first + " " + S.last).trim()) + "&email=" + encodeURIComponent(S.email) +
      "&notes=" + encodeURIComponent("Revenue Audit: score " + R.score + "/100, #1 gap " + R.gap.name + ". " + (S.company || ""));
    var nextLine = S.ans.timing && (S.ans.timing.v === "now" || S.ans.timing.v === "30")
      ? "Book a free 20-minute strategy call. We'll walk through your assessment, check the numbers with you, and show you what fixing your #1 gap would look like."
      : "When you're ready, a free 20-minute strategy call walks through your assessment and the numbers. No pressure and no long contract.";
    return '<div class="au-result">' +
      '<div class="au-card au-r-head"><p class="au-sec"><span>Revenue Assessment</span><i></i><span>' + esc(st.label) + '</span></p>' +
      '<h2 data-focus>' + (S.first ? esc(S.first) + ", here" : "Here") + ' is your Revenue Assessment' + (S.company ? ' for ' + esc(S.company) : "") + '.</h2>' +
      '<div class="au-score">' + dial(R.score) + '<div><p class="au-grade">' + esc(R.grade) + '</p><p class="au-help">Your Revenue Score across five parts of how ' + (S.type === "eye" ? "patient calls and follow-up" : "calls, quotes, and payments") + ' move through your ' + st.org + '.</p></div></div>' +
      '<ul class="au-bars">' + bars + '</ul></div>' +
      '<div class="au-card au-gap"><p class="au-k">Your #1 gap</p><h3>' + esc(R.gap.name) + '</h3><p>' + esc(GAP_LINES[S.type][R.gap.k]) + '</p></div>' +
      '<div class="au-card au-est"><p class="au-k">What it may be costing you, by service</p><p class="co-big">' + money0(R.est.month) + '<small>a month</small></p>' +
      '<p class="co-year"><span>' + money0(R.est.month * 12) + '</span> a year</p><dl class="co-lines">' + lines + '</dl><p class="co-note">' + esc(R.est.note) + '</p></div>' +
      '<div class="au-card au-plan"><p class="au-k">Your 30-day plan for ' + esc(R.gap.name.toLowerCase()) + '</p><ol>' +
      '<li><b>Week 1</b><span>' + esc(plan[0]) + '</span></li><li><b>Weeks 2 and 3</b><span>' + esc(plan[1]) + '</span></li><li><b>Week 4</b><span>' + esc(plan[2]) + '</span></li></ol></div>' +
      '<div class="au-card au-next"><h3>What to do next</h3><p>' + nextLine + '</p>' +
      (qualifies ? '<p class="au-qual">Your ' + st.org + ' qualifies for a free demo built on your own ' + (S.type === "eye" ? "call flow" : "workflow") + '. Mention it on your strategy call.</p>' : "") +
      '<div class="cta-actions"><a class="btn btn-gold" href="' + esc(book) + '" target="_blank" rel="noopener">Book my free strategy call</a>' +
      '<a class="btn btn-line" href="' + esc(DEMO[S.type]) + '" target="_blank" rel="noopener">Call the live demo</a></div>' +
      '<p class="au-meta"><button type="button" class="au-link" data-print>Save or print this assessment</button> · <button type="button" class="au-link" data-restart>Start over</button></p></div></div>';
  }

  // ---------------- submit to Netlify Forms ----------------
  function submit() {
    if (S.sent) return; S.sent = true;
    var R = compute(), st = set();
    var answers = st.qs.map(function (q) { var a = S.ans[q.id]; return q.id + ": " + (a ? a.t : "-"); }).join(" | ");
    var data = {
      "form-name": "revenue-audit", first_name: S.first, last_name: S.last, email: S.email, company: S.company, phone: S.phone,
      business_type: st.label, role: (S.ans.role || {}).v || "", size: (S.ans.size || {}).v || "", timing: (S.ans.timing || {}).t || "",
      score: R.score + "/100 (" + R.grade + ")", top_gap: R.gap.name,
      category_scores: R.cats.map(function (c) { return c.name + " " + c.v; }).join(", "),
      estimate_month: money0(R.est.month), estimate_lines: R.est.lines.map(function (l) { return l[0] + " " + money0(l[1]); }).join("; "),
      marketing: (S.ans.mkt || {}).t || "", answers: answers, page: location.href, variant: variant()
    };
    var body = Object.keys(data).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); }).join("&");
    try {
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).catch(function () {});
    } catch (e) {}
    try { if (window.lintrk) window.lintrk("track", { conversion_id: window.LI_AUDIT_CONVERSION || 0 }); } catch (e) {}
  }

  // landing pages: send the lead as soon as name, email and phone are in, so unfinished audits still reach you
  function submitLead() {
    var data = { "form-name": "audit-lead", first_name: S.first, last_name: S.last, email: S.email, phone: S.phone,
      business_type: preset ? SETS[preset].label : "", page: location.href, variant: variant() };
    var body = Object.keys(data).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); }).join("&");
    try { fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).catch(function () {}); } catch (e) {}
  }

  // ---------------- events ----------------
  function bind() {
    var f = root.querySelector("form[data-form=start]");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      S.first = f.first.value.trim(); S.last = f.last.value.trim();
      var err = f.querySelector(".au-err");
      if (!S.first) { err.textContent = "Please add your first name."; err.hidden = false; f.first.focus(); return; }
      if (leadFirst) {
        var em = f.email.value.trim(), ph = f.phone.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { err.textContent = "Please enter a valid email address."; err.hidden = false; f.email.focus(); return; }
        if (ph.replace(/\D/g, "").length < 10) { err.textContent = "Please enter a phone number with area code."; err.hidden = false; f.phone.focus(); return; }
        S.email = em; S.phone = ph; submitLead();
      }
      S.step = "q"; S.qi = 0; render();
    });
    root.querySelectorAll(".au-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        var list = flow(), q = list[S.qi], o = q.opts[+b.getAttribute("data-i")];
        if (q.id === "type") { if (S.type !== o.v) { S.ans = {}; } S.type = o.v; }
        else S.ans[q.id] = o;
        root.querySelectorAll(".au-opt").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        setTimeout(function () {
          var l2 = flow();
          if (S.qi < l2.length - 1) { S.qi++; } else { S.step = "contact"; S.cstep = CSTEPS[0]; }
          render();
        }, 220);
      });
    });
    var back = root.querySelector("[data-back]");
    if (back) back.addEventListener("click", function () {
      if (S.step === "q") { if (S.qi === 0) S.step = "start"; else S.qi--; }
      else if (S.step === "contact") {
        var i = CSTEPS.indexOf(S.cstep);
        if (i > 0) S.cstep = CSTEPS[i - 1]; else { S.step = "q"; S.qi = flow().length - 1; }
      }
      render();
    });
    var cf = root.querySelector("form[data-form=contact]");
    if (cf) {
      var finish = function () { S.step = "result"; submit(); render(); };
      cf.addEventListener("submit", function (e) {
        e.preventDefault();
        var inp = cf.querySelector("input"), v = inp.value.trim(), err = cf.querySelector(".au-err");
        if (S.cstep === "email") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { err.textContent = "Please enter a valid email address."; err.hidden = false; inp.focus(); return; }
          S.email = v; S.cstep = "company"; render();
        } else if (S.cstep === "company") {
          if (!v) { err.textContent = "Please add your " + set().org + " name."; err.hidden = false; inp.focus(); return; }
          S.company = v;
          if (leadFirst) { finish(); return; }
          S.cstep = "phone"; render();
        } else { S.phone = v; finish(); }
      });
      var sk = cf.querySelector("[data-skip]");
      if (sk) sk.addEventListener("click", function () { S.phone = ""; finish(); });
    }
    var pr = root.querySelector("[data-print]");
    if (pr) pr.addEventListener("click", function () { window.print(); });
    var rs = root.querySelector("[data-restart]");
    if (rs) rs.addEventListener("click", function () { S = { step: leadFirst ? "q" : "start", first: S.first, last: S.last, type: preset, ans: {}, qi: 0, email: S.email, company: "", phone: S.phone, sent: false }; render(); });
  }

  // start buttons elsewhere on the page scroll to the audit
  document.querySelectorAll("[data-start-audit]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); root.scrollIntoView({ behavior: "smooth", block: "start" }); var i = root.querySelector("input"); if (i) setTimeout(function () { i.focus({ preventScroll: true }); }, 400); });
  });

  render();
})();
