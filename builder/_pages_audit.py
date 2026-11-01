from _build import *

AUDIT_FAQ = [
 ("Is the audit really free?", "Yes. No credit card, no obligation. You answer 12 quick questions and your Revenue Assessment shows on screen right away."),
 ("What do I get at the end?", "Your Revenue Score out of 100 across five parts of your business, your #1 gap, an estimate of what that gap may be costing you each month, and a 30-day plan to close it. You can save or print it."),
 ("How accurate is the monthly estimate?", "It's an estimate, not a promise. It uses your answers plus conservative industry averages, and the page shows exactly which averages. On the strategy call we replace the averages with your real numbers."),
 ("What happens with my answers?", "They come to us so we can prepare for a strategy call if you book one. We don't sell or share them. Please don't include patient or customer information."),
 ("What is the strategy call?", "A free 20-minute call where we walk through your assessment with you, check the numbers, and show you what fixing your #1 gap would look like. No slides, no pressure, and no long contract."),
]

# Netlify reads this hidden copy at deploy time so it can accept the answers the audit script sends.
FIELDS = ["first_name","last_name","email","company","phone","business_type","role","size","timing","score","top_gap","category_scores","estimate_month","estimate_lines","marketing","variant","answers","page"]
hidden_form = '<form name="revenue-audit" data-netlify="true" netlify-honeypot="bot_field" hidden>' + \
  '<input type="hidden" name="form-name" value="revenue-audit"><input name="bot_field">' + \
  ''.join(f'<input name="{f}">' for f in FIELDS[:-2]) + '<textarea name="answers"></textarea><input name="page"></form>' + \
  '<form name="audit-lead" data-netlify="true" netlify-honeypot="bot_field" hidden><input type="hidden" name="form-name" value="audit-lead"><input name="bot_field">' + \
  ''.join(f'<input name="{f}">' for f in ["first_name","last_name","email","phone","business_type","page","variant"]) + '</form>'

html = head("Free Revenue Audit | Six Harmony",
  "A free 3-minute audit for Eye Care Practices and Industrial Service Companies. Get your Revenue Score, your #1 gap, what it may be costing you, and a 30-day plan.",
  "audit.html", [faq_schema(AUDIT_FAQ)]) + f'''
<section class="hero au-hero" data-audit-host>
  <div class="wrap">
    <div class="au-intro">
      <p class="eyebrow-dark">Free Revenue Audit</p>
      <h1>Where is your business losing revenue it already earned?</h1>
      <p class="lede">Answer 12 quick questions about your phones, follow-up, and quotes. Your Revenue Assessment shows up on screen as soon as you finish.</p>
      <ol class="au-gets">
        <li><b>01</b><span>Your Revenue Score</span><small>See what's working now</small></li>
        <li><b>02</b><span>Your #1 gap</span><small>Know where to start</small></li>
        <li><b>03</b><span>What it may cost you</span><small>A monthly estimate from your answers</small></li>
        <li><b>04</b><span>Your 30-day plan</span><small>Three steps to close the gap</small></li>
      </ol>
      <p class="au-for">Built for Eye Care Practices and Industrial Service Companies. Practices with 2 or more doctors and companies with 11 or more people may qualify for a free demo built on their own workflow.</p>
    </div>
    <div class="au-wrap" id="audit" data-book="{BOOK}" data-demo-eye="{DEMO_EYE}" data-demo-ind="{DEMO_IND}" aria-live="polite">
      <noscript><p class="au-card">The audit needs JavaScript. You can <a href="{BOOK}">book a free strategy call</a> instead.</p></noscript>
    </div>
  </div>
  <img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364">
</section>

<section class="band">
  <div class="wrap">
    <div class="section-head" data-reveal><h2>Questions about the audit</h2></div>
    {faq_html(AUDIT_FAQ)}
  </div>
</section>
{hidden_form}
''' + foot() + f'<script src="js/audit.js?v={V}" defer></script>\n</body>\n</html>\n'
write("audit.html", html)

# ---------- Booked thank-you page (Tim's model: one more step, short video or demo, why now, proof) ----------
TY_FAQ = [
 ("Do we keep our phone number?", "Yes. The system sits behind your current number, so patients and customers call the same number they always have."),
 ("What happens when it can't handle something?", "It hands the call to your team with a written summary. It never guesses, and it never gives medical, legal, or technical advice."),
 ("Does it work with our software?", "Where your scheduling or field service system allows outside booking, it books directly. Where it doesn't, it collects the full request and your team confirms it. We check this on the call."),
 ("What does it cost?", "It depends on scope, so we don't quote before the call. The main factors are your call volume, which workflows you want handled, and which systems it connects to. You get a written scope with a setup fee and a monthly price before anything is built."),
 ("How long does it take?", "Most installs are live about a week after the scope is agreed. We test it with your team before it handles a real caller."),
]
vsl_ty = "media/vsl-thank-you.mp4"
def ty_demo(kind, key, label):
    return f'''<div class="ty-demo" data-ty="{kind}"><div class="lp-embed">
<div data-lumina-embed="{key}"
     data-lumina-mode="inline"
     data-lumina-theme="auto"></div>
</div><p class="small lp-embed-alt">{label} not loading? <a href="{DEMO_EYE if kind=="eye" else DEMO_IND}" target="_blank" rel="noopener">Open it in a new tab</a>.</p></div>'''
TRANSCRIPT = """Hi, it's Cristian from Six Harmony. Thanks for booking a time with me. Before we talk, give me three minutes, because I want our call to be worth your time.
First, quick thing: open the calendar invite in your email and hit accept. That way I know you'll be there, and it'll remind you the day of.
So, why did I set up this call? We work with two kinds of businesses. Eye Care Practices, like optometry, ophthalmology, and LASIK practices. And Industrial Service Companies, like refractory, mechanical, HVAC, and electrical contractors. Different work, same problem. Most of them don't lose customers because their work is bad. They lose them in the gaps.
At a practice, the phone rings while the front desk is checking someone in. It rings at lunch, after five, on Saturday, and it goes to voicemail. A new patient who hits voicemail calls the next practice on the list. The patient who asked about LASIK gets one callback and never hears from you again.
At a contractor, the emergency call comes in at eleven at night and goes to voicemail or someone's cell phone. Your tech finds a problem on site, but the quote takes a week to go out. Then it goes out once and nobody follows up.
Those are people who already wanted to do business with you. They're the most expensive ones to lose.
Until recently, fixing that meant hiring another person, or paying an answering service that takes a message and nothing else. That's changed. AI voice can now hold a natural conversation, book straight into your schedule, answer the questions your team answers fifty times a week, and follow up by text and email, day and night, for a fraction of what another hire costs. Anything it shouldn't handle, anything clinical, technical, or about pricing, goes straight to your team with a written summary.
The businesses that set this up first are going to be the ones answering the calls their competitors miss. That's why I don't think this can wait a year.
Here's what we'll do on the call. If you took the Revenue Audit, we'll go through your results and check the numbers against what you see day to day. We'll find where calls, follow-ups, or quotes are slipping through. Then I'll show you what fixing your biggest gap would look like, step by step. And if it's not a fit, I'll tell you. No pressure, no long contract.
A few things that help: a rough idea of how many calls you get in a normal week, who answers the phone today and what happens after hours, and the names of the software you use for scheduling or quotes. If someone else would help make this decision, bring them along.
Last thing. Right below this message there's a live demo. Tap start and talk to it like one of your patients or customers would. Try to trip it up. That way, when we talk, you'll already know exactly what it sounds like.
Six Harmony is a family business here in San Antonio. My mom and I started it to help businesses keep the revenue they already earn. I'm looking forward to talking with you. See you on the call."""
def find_voice(kind):
    return next((f for f in (f"media/ty-voice-{kind}.m4a", f"media/ty-voice-{kind}.mp3", "media/ty-voice.m4a", "media/ty-voice.mp3") if os.path.exists(f)), None)
def voice_html(kind):
    v = find_voice(kind)
    if not v: return ""
    return f'''<div class="ty-voice" data-ty="{kind}"><img src="img/partners/cristian-alonzo.jpg" alt="Cristian Alonzo" width="96" height="96">
<div><p class="ty-vk">A 3-minute message from Cristian</p><p class="ty-vt">Listen before we talk.</p>
<audio controls preload="metadata" src="{v}">Your browser can't play this audio. <a href="{v}">Download it here</a>.</audio>
<details class="ty-tr"><summary>Read the transcript</summary>{"".join(f"<p>{x}</p>" for x in TRANSCRIPT.split(chr(10)))}</details></div></div>'''
VOICE = find_voice("eye")
voice_block = voice_html("eye") + voice_html("ind")
step_k = "Listen first" if VOICE else "Before the call"
step_h = "Hear why I set up this call, then try the system yourself." if VOICE else "Take 3 minutes and talk to the system yourself."
step_p = "It's short. When we talk, you'll already know what we do and what it sounds like." if VOICE else "Tap start and ask what your patients or customers ask. It runs on a fictional business, so test it freely. When we talk, you'll already know what it sounds like."
ty_media = voice_block + ty_demo("eye", EMBED_EYE, "Demo") + ty_demo("ind", EMBED_IND, "Demo")

html = head("One more step before your call | Six Harmony", "One more step before your free strategy call with Six Harmony.", "thank-you-booked.html", noindex=True) + f'''
<section class="band ty-top">
  <div class="wrap measure" style="text-align:center">
    <p class="kicker">You're booked. One more step.</p>
    <h1 class="ty-h">Your call is on the calendar. Here's how to make it worth your time.</h1>
    <p class="ty-lede">Your date, time, and video link are in your confirmation email. Please accept the calendar invite so we know you'll be there, then take the next 3 minutes below.</p>
  </div>
</section>

<section class="band band-paper ty-step" id="demo">
  <div class="wrap">
    <div class="section-head" style="text-align:center;margin:0 auto 28px;max-width:640px"><p class="kicker">{step_k}</p><h2>{step_h}</h2><p>{step_p}</p></div>
    {ty_media}
  </div>
</section>

<section class="band">
  <div class="wrap split" data-reveal data-stagger>
    <div>
      <h2>Why this matters now</h2>
      <p style="margin-top:18px;color:var(--slate)">Until recently, answering every call meant hiring more people or paying an answering service that takes a message and nothing else.</p>
      <p style="color:var(--slate)">That changed. AI voice now holds a natural conversation, books into real calendars, and follows up by text and email for a small fraction of what another hire costs. The businesses that set it up first answer the calls their competitors miss.</p>
      <p style="color:var(--slate)">Every week without it, the same calls ring out at lunch, after hours, and on weekends, and the same quotes and follow-ups sit unsent.</p>
    </div>
    <div>
      <h2>What we'll cover in 20 minutes</h2>
      <ol class="next-steps">
        <li><span>Your Revenue Assessment, if you took the audit, and whether the numbers match what you see day to day.</span></li>
        <li><span>Where calls and requests slip through today: busy hours, after hours, follow-up, or quotes.</span></li>
        <li><span>What fixing your biggest gap would look like, step by step, and what it takes from your team.</span></li>
        <li><span>Whether it's a fit. If it isn't, we'll tell you.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="band band-paper">
  <div class="wrap split" data-reveal data-stagger>
    <div>
      <h2>What to bring</h2>
      <ul class="ticks" style="margin-top:24px">
        <li>A rough count of calls or requests in a normal week, and when they peak</li>
        <li>Who answers the phone today, and what happens after hours</li>
        <li>The software you use for scheduling, quoting, or invoicing. Names are enough.</li>
        <li>Anyone else who would decide on this. They're welcome on the call.</li>
      </ul>
      <p class="small" style="margin-top:18px">Please don't bring patient or customer records to the call.</p>
    </div>
    <div>
      <h2>To be upfront</h2>
      <ul class="ticks" style="margin-top:24px">
        <li>We'll need access to your phone setup and the tools it connects to.</li>
        <li>What your current software allows can change how booking works.</li>
        <li>Results depend on more than the install: call volume, staffing, and how quickly your team follows up on handoffs.</li>
      </ul>
    </div>
  </div>
</section>
{net_compact()}
<section class="band">
  <div class="wrap">
    <div class="section-head" data-reveal><h2>Common questions</h2></div>
    {faq_html(TY_FAQ)}
  </div>
</section>
<script>
(function(){{var t=(new URLSearchParams(location.search).get("type")||"").toLowerCase();
var keep=(t==="ind"||t==="industrial")?"ind":"eye";
document.querySelectorAll(".ty-demo,.ty-voice").forEach(function(d){{if(d.getAttribute("data-ty")!==keep)d.remove();}});}})();
</script>
<script src="{EMBED_JS}" async></script>
''' + foot() + '</body>\n</html>\n'
write("thank-you-booked.html", html)

# ---------- Privacy ----------
html = head("Privacy | Six Harmony", "How Six Harmony handles the information you send through this website.", "privacy.html") + '''
<section class="band">
  <div class="wrap measure">
    <h1 style="font-size:52px">Privacy</h1>
    <p class="small" style="margin:16px 0 32px">Last updated October 2026</p>
    <h3>What we collect</h3>
    <p>When you take the free Revenue Audit, we keep your answers, your Revenue Assessment, and the contact details you type in: your name, email, business name, and phone if you give it. When you book a strategy call, we collect what you type into the booking form.</p>
    <h3>How we use it</h3>
    <p>Only to send you your assessment, prepare for your strategy call, contact you about it, and run the call if you book one. We don't sell or rent your information, and we don't add you to marketing lists without asking.</p>
    <h3>What not to send us</h3>
    <p>Please don't send patient records, health information, or customer data through this website. If we work together, we agree on how any sensitive information is handled before a system is built.</p>
    <h3>Where it's stored</h3>
    <p>Form submissions are stored by our website host and in our own email and scheduling tools, which keep them secure on our behalf.</p>
    <h3>Your choices</h3>
    <p>Ask us at any time to see or delete what you've sent us, and we will.</p>
  </div>
</section>
''' + foot() + '</body>\n</html>\n'
write("privacy.html", html)
