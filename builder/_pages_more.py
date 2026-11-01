from _build import *
import datetime
TODAY = datetime.date.today().isoformat()

def page_hero(eyebrow, h1, lede, actions=""):
    return f'''<section class="hero hero-slim"><div class="wrap"><div>
<p class="eyebrow-dark">{eyebrow}</p><h1>{h1}</h1><p class="lede">{lede}</p>{actions}</div></div>
<img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364"></section>'''

# ---------- Live demos ----------
DEMOS_FAQ = [
 ("Are these real businesses?", "No. Both demos run on fictional businesses with fictional customers, so you can test freely. Please don't share real patient or customer information on the demo pages."),
 ("Can I get a demo built around my own business?", "Yes. After the free strategy call, we build a working demo around your own workflow so your team can hear and test it before deciding."),
 ("Do I need to download anything?", "No. The demos run in your browser. Allow microphone access when the page asks, and talk the way your customers would."),
]
html = head("Live AI Receptionist Demos | Six Harmony",
  "Talk to a working AI receptionist for an Eye Care Practice or an Industrial Service Company. Book, reschedule, ask questions, and see the follow-up it sends.",
  "demos.html", [faq_schema(DEMOS_FAQ)]) + page_hero("Live demos",
  "Don't take our word for it. Talk to it.",
  "Two working demos, each on a fictional business. Call in, ask what your customers ask, and see the follow-up that goes out afterward.") + embed_band("eye", "Talk to Elise, the Eye Care demo", "Tap start and use your microphone. Book an exam, ask about vision plans, or ask about LASIK.", key=EMBED_EYE_FULL) + embed_band("ind", "Talk to Ava, the Industrial demo", "Tap start and report an emergency, request service, or ask where a quote stands.", paper=True, extra=f'Want the quote and dashboard pages too? <a href="{DEMO_IND}" target="_blank" rel="noopener">See the full Industrial demo</a>.') + f'''
{"" if EMBED_IND else f'''<section class="band">
  <div class="wrap">
    <div class="demo-list" data-reveal data-stagger>
      <article class="demo-card">
        <p class="kicker">Industrial Service Companies</p>
        <h3>Ava, dispatcher for a fictional service contractor</h3>
        <p>Things to try:</p>
        <ul>
          <li>Report an after-hours emergency</li>
          <li>Request routine service or an inspection</li>
          <li>Ask where your quote stands</li>
          <li>Look through the deficiency-to-quote and dashboard pages</li>
        </ul>
        <a class="btn btn-gold" href="{DEMO_IND}" target="_blank" rel="noopener">Open the Industrial demo</a>
        <a class="small-link" href="ai-back-office-industrial-services.html">How it works for Industrial Service Companies</a>
      </article>
    </div>
  </div>
</section>'''}
<section class="band band-paper">
  <div class="wrap">
    <div class="section-head" data-reveal><h2>About the demos</h2></div>
    {faq_html(DEMOS_FAQ)}
  </div>
</section>
{cta("Want one built around your business?", "Start with the free 3-minute audit. Then we build a demo on your own workflow.")}
''' + foot() + '</body>\n</html>\n'
write("demos.html", html)

# ---------- About ----------
html = head("About Six Harmony | Family-Built in San Antonio, Texas",
  "Six Harmony is a family business in San Antonio, Texas, installing AI answering, booking, and follow-up for Eye Care Practices and Industrial Service Companies.",
  "about.html") + page_hero("About Us",
  "Where people, processes, and technology work in harmony.",
  "A family business in San Antonio, Texas, started by a mother and son.") + f'''
<section class="band">
  <div class="wrap split" data-reveal data-stagger>
    <div class="who">
      <h2>Why we started</h2>
    </div>
    <div class="measure">
      <p>Most businesses don't lose customers because the work is bad. They lose them in the gaps: the call that rang out at lunch, the quote nobody followed up on, the patient who meant to book and forgot.</p>
      <p>We started Six Harmony to close those gaps and help businesses maximize the revenue they're already earning. We work with two kinds of businesses, Eye Care Practices and Industrial Service Companies, because we understand how their calls and requests move and where the money slips through.</p>
      <p>Our view is simple: one size fits none. Every practice and every shop runs differently, so every system starts with how your team already works. We take on a small number of installs at a time so each one gets built properly, tested with your staff, and reported on every month, with the calls answered, follow-ups sent, and the estimated revenue recovered laid out plainly. We do well when our clients do.</p>
    </div>
  </div>
</section>
{NET}
<section class="band band-paper">
  <div class="wrap split" data-reveal data-stagger>
    <div>
      <h2>How we work</h2>
      <ul class="ticks" style="margin-top:24px">
        <li>Scope and price in writing before anything is built</li>
        <li>Fictional data in every demo, never your customers'</li>
        <li>Everything outside the system's lane goes to a person</li>
        <li>A monthly report on what was answered and followed up</li>
      </ul>
    </div>
    <div>
      <h2>What we won't do</h2>
      <ul class="ticks no" style="margin-top:24px">
        <li>Give medical, legal, or technical advice</li>
        <li>Promise revenue or bookings</li>
        <li>Lock you into a long contract to get started</li>
      </ul>
    </div>
  </div>
</section>
{cta("Let's find where your revenue slips through.", "Take the free 3-minute audit. Your Revenue Assessment shows up on screen as soon as you finish.")}
''' + foot() + '</body>\n</html>\n'
write("about.html", html)

# ---------- Blog ----------
POSTS = [
 ("blog/missed-calls-eye-care-practice.html", "Eye Care Practices",
  "How many patient calls is your Eye Care Practice missing? A 15-minute self-check",
  "A simple way to measure the calls your practice misses at peak times, what each one is worth, and the three fixes that close most of the gap.",
  """
<p>Most practice owners can tell you their collections to the dollar. Very few can tell you how many calls went unanswered last Tuesday. That number is usually bigger than anyone expects, and every one of those calls was someone who already wanted to book.</p>
<div class="callout"><p>In the MGMA 2026 Phone and Fax Solutions Survey, 36% of medical practices said more than one in ten calls goes unanswered or to voicemail at peak times.</p></div>
<h2>Step 1: Pull one week of call data (5 minutes)</h2>
<p>Your phone system almost certainly keeps a call log. Export one normal week and count three things: total inbound calls, calls that went to voicemail or were abandoned, and calls that came in outside office hours.</p>
<p>If you can't export it, have the front desk keep a tally for two days: every time the phone rings while they're on another call or with a patient, make a mark.</p>
<h2>Step 2: Check what happened to the voicemails (5 minutes)</h2>
<p>Pick ten voicemails from that week and ask: was each one returned, how long did it take, and did the caller book? New patients who reach voicemail often just call the next practice on the list. A same-day callback helps; a next-day callback usually doesn't.</p>
<h2>Step 3: Put a number on it (5 minutes)</h2>
<p>Multiply missed calls per week by the share that were new patients or consult requests, then by your average first-year value of a new patient. Use your own numbers and be conservative. Even a cautious estimate tends to make the case on its own.</p>
<p>Our <a href="audit.html?type=eye">free Revenue Audit</a> does this math from your answers in about three minutes, along with your #1 gap and a 30-day plan.</p>
<h2>The three fixes that close most of the gap</h2>
<ul>
<li><strong>Answer every call, including lunch and after hours.</strong> Peak-time overflow and after-hours calls are where most of the loss sits.</li>
<li><strong>Follow up with everyone who asked and didn't book.</strong> LASIK and premium lens inquiries are high value and often need two or three touches.</li>
<li><strong>Recall patients who are overdue.</strong> An overdue annual exam is the cheapest appointment you'll ever fill.</li>
</ul>
<p>None of these require more staff. They require a system that doesn't get busy. That's what we install, and you can <a href="DEMO_EYE" target="_blank" rel="noopener">call the demo receptionist</a> to hear how it sounds.</p>
"""),
 ("blog/open-quotes-industrial-contractors.html", "Industrial Service Companies",
  "Where open quotes go cold: a follow-up check for Industrial Service Companies",
  "Why inspection findings sit unquoted, why sent quotes go quiet, and a simple check to find out how much work is waiting in your pipeline.",
  """
<p>Your techs find the work. A failed device, a corroded line, a code deficiency. Then it sits: in a notebook, in a photo on someone's phone, in an inspection report nobody turned into a quote. When the quote does go out, it often gets one email and no second touch.</p>
<div class="callout"><p>In the Levelset 2022 Cash Flow and Payment Report, only 12% of construction companies said they always get paid on time, and one in four never send a reminder when payment is late.</p></div>
<h2>Check 1: Findings without quotes</h2>
<p>Pull the last 30 days of inspection or service reports. Count the deficiencies your techs noted, then count how many became a quote. The gap between those two numbers is work your customers already need and haven't been asked to approve.</p>
<h2>Check 2: Quotes without a second touch</h2>
<p>List every quote sent in the last 60 days that hasn't been approved or declined. For each one, note how many times anyone followed up. Most open quotes aren't a "no". Nobody asked again.</p>
<h2>Check 3: Calls after 5 p.m.</h2>
<p>Look at your call log for evenings and weekends. Emergency calls that hit voicemail go to whoever answers first, and that's often the customer's next call.</p>
<h2>What closes the gap</h2>
<ul>
<li><strong>Same-day quotes from field findings.</strong> Findings become a draft quote before the tech leaves the site, and a person approves it.</li>
<li><strong>Automatic quote follow-up.</strong> Polite, persistent touches until the customer approves, declines, or asks a question.</li>
<li><strong>Every call answered and triaged.</strong> Real emergencies page your on-call tech; routine requests are booked for the morning.</li>
</ul>
<p>You can see each of these in our <a href="DEMO_IND" target="_blank" rel="noopener">live Industrial demo</a>, running on a fictional contractor.</p>
"""),
]

def article(path, kicker, title, desc, body):
    body = body.replace("DEMO_EYE", DEMO_EYE).replace("DEMO_IND", DEMO_IND)
    hub = "ai-receptionist-eye-care.html" if "Eye" in kicker else "ai-back-office-industrial-services.html"
    art = {"@context":"https://schema.org","@type":"Article","headline":title,"description":desc,
           "datePublished":TODAY,"dateModified":TODAY,"author":{"@type":"Person","name":"Cristian Alonzo"},
           "publisher":{"@type":"Organization","name":"Six Harmony","logo":{"@type":"ImageObject","url":SITE+"/img/logo-navy.svg"}},
           "mainEntityOfPage":SITE+"/"+path}
    return head(title + " | Six Harmony", desc, path, [art]) + f'''
<section class="band"><article class="wrap article">
<p class="kicker"><a href="blog/index.html">Blog</a> · {kicker}</p>
<h1>{title}</h1>
<p class="meta">By Cristian Alonzo · Six Harmony · <time datetime="{TODAY}">{datetime.date.today().strftime("%B %-d, %Y")}</time></p>
{body}
<p style="margin-top:40px"><a href="{hub}">See how Six Harmony works for {kicker}</a></p>
</article></section>
{cta("Want us to run this check with you?", "Take the free 3-minute audit, then walk through it with us on a free strategy call.")}
''' + foot() + '</body>\n</html>\n'

for p in POSTS: write(p[0], article(*p))

cards = ''.join(f'<a class="post" href="{p[0]}"><span class="kicker">{p[1]}</span><h3>{p[2]}</h3><p>{p[3]}</p></a>' for p in POSTS)
html = head("Blog | Six Harmony", "Practical checks for Eye Care Practices and Industrial Service Companies: missed calls, follow-up, quotes, and where revenue slips through.",
  "blog/index.html") + page_hero("Blog", "Find the leaks yourself.",
  "Short, practical checks you can run in your own business this week.") + f'''
<section class="band"><div class="wrap"><div class="post-list" data-reveal data-stagger>{cards}</div></div></section>
{cta("Would you rather we run the check with you?", "Take the free 3-minute audit and get your Revenue Assessment on the spot.")}
''' + foot() + '</body>\n</html>\n'
write("blog/index.html", html)
