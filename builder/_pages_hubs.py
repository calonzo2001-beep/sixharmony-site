from _build import *

FIG_EYE = FIG_IND = ""

def hub(path, title, desc, eyebrow, h1, lede, demo_url, demo_label, demo_note, fig,
        video, poster, video_label, stat_num, stat_lead, stat_src, video_h, video_p,
        handles, hands_off, steps, demo_cards, faq, cta_h, crumb):
    bc = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":SITE+"/"},
        {"@type":"ListItem","position":2,"name":crumb,"item":SITE+"/"+path}]}
    svc = {"@context":"https://schema.org","@type":"Service","name":crumb,"serviceType":crumb,
           "provider":{"@type":"ProfessionalService","name":"Six Harmony","url":SITE},
           "areaServed":["San Antonio","Texas","United States"],"description":desc}
    cards = ''.join(f'<article class="demo-card"><h3>{h}</h3><p>{p}</p></article>' for h,p in demo_cards)
    st = ''.join(f'<li><h3>{h}</h3><p>{p}</p></li>' for h,p in steps)
    kind = "eye" if "eye-care" in path else "industrial"
    has_embed = bool(EMBED_EYE if kind == "eye" else EMBED_IND)
    return head(title, desc, path, [svc, bc, faq_schema(faq)]) + f'''
<section class="hero hero-slim">
  <div class="wrap">
    <div>
      <p class="eyebrow-dark">{eyebrow}</p>
      <h1>{h1}</h1>
      <p class="lede">{lede}</p>
      <div class="cta-actions">
        <a class="btn btn-gold" href="{AUDIT}?type={kind}">Take the free 3-minute audit</a>
        {f'<a class="btn btn-line" href="#demo">Talk to the live demo</a>' if has_embed else f'<a class="btn btn-line" href="{demo_url}" target="_blank" rel="noopener">{demo_label}</a>'}
      </div>
      {'' if has_embed else f'<p class="audit-note">{demo_note}</p>'}
    </div>
  </div>
  <img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364">
</section>
{embed_band("eye" if kind == "eye" else "ind", "Talk to it right here", "Tap start and ask what your " + ("patients" if kind == "eye" else "customers") + " ask. It runs on a fictional business.")}

<section class="band band-paper">
  <div class="wrap split" data-reveal data-stagger>
    <div>
      <h2>What it handles</h2>
      <ul class="ticks" style="margin-top:24px">{''.join(f"<li>{x}</li>" for x in handles)}</ul>
    </div>
    <div>
      <h2>What goes to your team</h2>
      <ul class="ticks" style="margin-top:24px">{''.join(f"<li>{x}</li>" for x in hands_off)}</ul>
      <p class="small" style="margin-top:18px">Every handoff arrives with a written summary, so nobody has to call back and start over.</p>
    </div>
  </div>
</section>

<section class="band band-navy">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <h2>How it gets installed</h2>
      <p>Each step stands on its own. You decide after each one whether to keep going.</p>
    </div>
    <ol class="steps" data-reveal data-stagger>{st}</ol>
  </div>
</section>

<section class="band band-paper">
  <div class="wrap">
    <div class="section-head" data-reveal><h2>Questions we get asked</h2></div>
    {faq_html(faq)}
  </div>
</section>

{net_compact()}
{cta(cta_h, "Take the free 3-minute audit. Your Revenue Assessment shows up on screen as soon as you finish.", audit=AUDIT + "?type=" + kind)}
''' + foot() + '</body>\n</html>\n'


EYE_FAQ = [
 ("Will patients know they're talking to AI?", "If they ask, it tells them. Most callers just want the appointment booked or the question answered, and the receptionist does that in a natural voice. You can call the live demo to hear it for yourself."),
 ("Can it book into our scheduling system?", "It books into the calendar you already use where that system allows outside booking. Where it doesn't, it collects the full request and your front desk confirms the slot, so nothing is lost either way. We check this on the strategy call."),
 ("What about clinical questions or eye emergencies?", "It never gives medical advice. Anything clinical goes to your team with a written summary. Callers describing sudden vision loss, flashes and floaters, eye injury, or chemical exposure are told to seek emergency care right away and your on-call contact is alerted."),
 ("Is it HIPAA compliant?", "HIPAA-ready configurations are available, including a Business Associate Agreement, for practices that need them. We scope this before anything touches real patient information. The public demo uses fictional patients only."),
 ("What does it cost?", "It depends on call volume and what you want handled. After the strategy call you get a written scope with a setup fee and a monthly price before anything is built. There's no long contract to start."),
]

INDUSTRIAL_FAQ = [
 ("What kinds of companies is this for?", "Industrial Service Companies: inspection, repair, maintenance, and field service teams working on commercial sites. If your techs find problems on site that become quotes, and your office chases paperwork, it fits."),
 ("Can it handle emergency calls after hours?", "Yes. It answers, asks the questions your dispatcher would ask, and pages your on-call tech for real emergencies with a written summary. Routine requests are booked or logged for the morning."),
 ("Does it work with our field service software?", "It works alongside the tools you already use. Where your system allows connections, quotes and jobs flow in directly. Where it doesn't, the system sends clean summaries your office can enter in seconds. We check this on the strategy call."),
 ("Will it send quotes to customers on its own?", "Only if you want it to. Most teams have it draft the quote from the tech's findings and a person approves it before it goes out. Follow-up on approved quotes then runs automatically until the customer answers."),
 ("What does it cost?", "It depends on call volume and which workflows you want handled. After the strategy call you get a written scope with a setup fee and monthly price before anything is built."),
]

STEPS = [
 ("Free audit and strategy call", "Take the 3-minute audit for your Revenue Score and #1 gap, then a free 20-minute strategy call to walk through it and check the numbers."),
 ("A demo built around you", "We build a working demo using your own workflow and fictional callers, so you can hear and test it before deciding anything."),
 ("Install, test, report", "We set it up with your tools, test it with your team, then send a monthly report on calls answered and follow-ups completed."),
]

write("ai-receptionist-eye-care.html", hub(
 "ai-receptionist-eye-care.html",
 "AI Receptionist for Eye Care Practices | Six Harmony",
 "An AI receptionist for optometry and ophthalmology practices: answers every patient call, books exams and LASIK consults, follows up, and recalls overdue patients. Call the live demo.",
 "AI receptionist for Eye Care Practices",
 "Every patient call answered, booked, and followed up.",
 "Six Harmony installs an AI front desk for optometry, ophthalmology, and LASIK practices. It answers day and night, books exams and consults into your calendar, follows up on the patients who don't book, and hands every clinical question to your team.",
 DEMO_EYE, "Call the live demo receptionist",
 "Meet Elise, the demo receptionist for a fictional practice. Ask her about exams, insurance, LASIK, or a same-day issue.",
 FIG_EYE, "media/clinics.mp4", "media/clinics-poster.jpg",
 "The two questions we hear most from practices, and what we put in place to answer them.",
 36, "of medical practices say more than one in ten calls goes unanswered or to voicemail at peak times.",
 "MGMA 2026 Phone and Fax Solutions Survey, 302 medical groups",
 "Thirty seconds on what we install", "The two questions we hear most from practices, and what we put in place to answer them.",
 ["Answers every call, including lunch, after hours, and weekends",
  "Books and reschedules routine exams, contact lens fittings, and consults",
  "Answers insurance and vision plan questions from your own rules",
  "Follows up by text and email with patients who asked and didn't book",
  "Recalls patients who are overdue for their annual exam",
  "Confirms appointments and fills cancellations from a waitlist"],
 ["Anything clinical: symptoms, prescriptions, post-op questions",
  "Urgent eye issues, with an immediate alert to your on-call contact",
  "Billing disputes and anything involving a patient's chart",
  "Callers who ask for a person"],
 STEPS,
 [("Elise, the receptionist", "Call or talk in the browser. Book an exam, reschedule, ask about insurance or LASIK, or describe an urgent problem and hear how she routes it."),
  ("Consult follow-up", "See the texts and emails a patient receives after asking about LASIK or premium lenses and not booking."),
  ("Recall and reactivation", "See how patients overdue for their annual exam are brought back without your staff dialing through a list."),
  ("Free Revenue Audit", "Answer 12 quick questions and see your Revenue Score, your #1 gap, and what missed calls may be costing your practice.")],
 EYE_FAQ, "Find out how many patient calls your practice is missing.", "AI Receptionist for Eye Care Practices"))

write("ai-back-office-industrial-services.html", hub(
 "ai-back-office-industrial-services.html",
 "AI Back Office for Industrial Service Companies | Six Harmony",
 "AI answering, quoting, and follow-up for Industrial Service Companies: emergency call triage, same-day quotes from inspection findings, quote and invoice follow-up. Try the live demo.",
 "AI back office for Industrial Service Companies",
 "Every call triaged. Every quote followed up.",
 "Six Harmony installs an AI back office for Industrial Service Companies. It answers and triages calls around the clock, turns findings from the field into quotes the same day, and follows up on every open quote and late invoice so your office isn't chasing paperwork.",
 DEMO_IND, "Try the live Industrial demo",
 "Meet Ava, the demo dispatcher for a fictional contractor. Report an emergency, request service, or ask about a quote.",
 FIG_IND, "media/industrial.mp4", "media/industrial-poster.jpg",
 "The two questions we hear most from Industrial Service Companies, and what we put in place to answer them.",
 12, "of construction companies say they always get paid on time. One in four never send a reminder when payment is late.",
 "Levelset 2022 Cash Flow and Payment Report, 519 US construction companies",
 "Thirty seconds on what we install", "The two questions we hear most from Industrial Service Companies, and what we put in place to answer them.",
 ["Answers and triages calls day and night, with missed-call text-back",
  "Pages your on-call tech for real emergencies with a written summary",
  "Turns inspection findings and deficiencies into draft quotes the same day",
  "Follows up on every open quote until the customer answers",
  "Sends payment reminders on late invoices",
  "Tracks permits, certificates, and change orders so jobs don't stall"],
 ["Pricing decisions and quote approval before anything is sent",
  "Technical and code questions",
  "Safety-critical calls, routed straight to a person",
  "Customers who ask for someone by name"],
 STEPS,
 [("Ava, the dispatcher", "Call in an emergency or a routine service request and hear how she triages it, books it, or pages the on-call tech."),
  ("Deficiency to quote", "See a list of findings from a site inspection become a clean, itemized quote ready for approval."),
  ("Quote follow-up and reactivation", "See the follow-up a customer gets on an open quote, and how past customers are brought back for annual work."),
  ("Operations dashboard", "See calls, open quotes, and overdue invoices in one view, the way your office would.")],
 INDUSTRIAL_FAQ, "Find out where your calls and quotes are slipping through.", "AI Back Office for Industrial Service Companies"))
