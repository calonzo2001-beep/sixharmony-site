from _build import *

FAQ_ALL = [
 ("What does Six Harmony actually install?", "An AI phone receptionist that answers every call, books and reschedules, and routes anything urgent to your team, plus follow-up: texts and emails to the people who inquired and never booked. For Industrial Service Companies, the same system handles quotes, follow-up, and after-hours calls. Every install is scoped to how your business already runs."),
 ("How long does setup take?", "Most installs are live in about a week after the scoping call. We test it with your team before it touches a real caller."),
 ("Does it sound like a robot?", "No. You can call the live demo and judge for yourself. The voice is natural, it handles interruptions, and callers can ask things the way they normally would."),
 ("What happens when it can't answer something?", "It hands off. Clinical questions, pricing it isn't allowed to quote, or anything outside its lane goes to a person on your team with a written summary. It never guesses."),
 ("Do I keep my phone number?", "Yes. Your number stays yours. The system sits behind it, so patients and customers call the same number they always have."),
]

FAQ = [q for q in FAQ_ALL if q[0].startswith(("Does it sound","What happens when","Do I keep"))]

html = head("Six Harmony | AI Answering for Eye Care Practices and Industrial Service Companies",
            "Six Harmony installs AI receptionists, booking, and follow-up systems for Eye Care Practices and Industrial Service Companies in Texas. Call the live demo yourself.",
            "", [faq_schema(FAQ)]) + f'''
<section class="hero-garden" id="top">
  <div class="bg" aria-hidden="true"></div>
  <img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364">
  <div class="wrap">
    <p class="eyebrow">Every call answered. Every inquiry followed up.</p>
    <h1>Where people, processes, and technology work in <em>harmony.</em></h1>
    <p class="lede">AI answering, booking, and follow-up, built for two industries:</p>
    <div class="niche-links">
      <a href="ai-receptionist-eye-care.html"><span>Eye Care Practices</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/></svg></a>
      <a href="ai-back-office-industrial-services.html"><span>Industrial Service Companies</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/></svg></a>
    </div>
    <div class="cta-actions">
      <a class="btn btn-gold" href="{AUDIT}">Take the free 3-minute audit</a>
      <a class="btn btn-line" href="demos.html">Call the live demo</a>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <h2>Two kinds of teams, one problem</h2>
      <p>Calls and requests arrive faster than people can handle them. The ones that slip through cost the most, because someone already wanted to do business with you.</p>
    </div>
    <div class="industries" data-reveal data-stagger>
      <article class="industry">
        <div class="num">01</div>
        <h3>Eye Care Practices</h3>
        <p>An AI front desk that answers every patient call, books exams, follows up on LASIK inquiries, and brings back patients overdue for an exam.</p>
        <div class="links"><a class="btn btn-gold" href="ai-receptionist-eye-care.html">See how it works</a></div>
      </article>
      <article class="industry">
        <div class="num">02</div>
        <h3>Industrial Service Companies</h3>
        <p>An AI back office that triages emergency calls, turns inspection findings into same-day quotes, and follows up on every open quote.</p>
        <div class="links"><a class="btn btn-gold" href="ai-back-office-industrial-services.html">See how it works</a></div>
      </article>
    </div>
  </div>
</section>

<section class="band band-navy">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <h2>How working with us goes</h2>
      <p>No long contracts before we understand your operation. Each step stands on its own.</p>
    </div>
    <ol class="steps" data-reveal data-stagger>
      <li><h3>Free Revenue Audit</h3><p>Three minutes, online. Answer 12 quick questions and get your Revenue Score, your #1 gap, what it may be costing you, and a 30-day plan.</p></li>
      <li><h3>Free strategy call</h3><p>Twenty minutes. We walk through your assessment, check the numbers with you, and build a working demo around your own workflow so you can hear it before deciding.</p></li>
      <li><h3>Install, test, report</h3><p>We set it up with your tools, test it with your team, and send a monthly report on calls answered and follow-ups done.</p></li>
    </ol>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="section-head" data-reveal><h2>Questions owners ask first</h2></div>
    {faq_html(FAQ)}
  </div>
</section>

{net_compact()}
{cta("Find out where your revenue slips through.", "Take the free 3-minute audit. Your Revenue Assessment shows up on screen as soon as you finish.")}
''' + foot() + '</body>\n</html>\n'
write("index.html", html)
