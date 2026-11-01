from _build import *
import re

LP = {
 "eye": dict(path="eye-care-audit.html", kind="eye", eyebrow="For Eye Care Practices",
   a="Who answers your practice's phones at lunch?",
   b="Every patient call answered and booked, even at lunch and after hours.",
   sub="We install an AI front desk for Eye Care Practices that answers every call on the first ring, books exams into your schedule, and sends anything clinical to your staff.",
   demo=DEMO_EYE, demo_label="Call the live demo receptionist", demo_who="Elise, our demo receptionist for a fictional practice",
   stat=("36%", "of medical practices say more than one in ten calls goes unanswered or to voicemail at peak times.", "MGMA 2026 Phone and Fax Solutions Survey, 302 medical groups"),
   title="Free Revenue Audit for Eye Care Practices | Six Harmony"),
 "ind": dict(path="industrial-audit.html", kind="industrial", eyebrow="For Industrial Service Companies",
   a="Who answers your emergency calls at 11 p.m.?",
   b="Every call triaged. Every quote followed up.",
   sub="We install an AI back office for Industrial Service Companies that answers and triages every call, turns field findings into same-day quotes, and follows up until the customer answers.",
   demo=DEMO_IND, demo_label="Try the live Industrial demo", demo_who="Ava, our demo dispatcher for a fictional contractor",
   stat=("12%", "of construction companies say they always get paid on time. One in four never send a reminder when payment is late.", "Levelset 2022 Cash Flow and Payment Report, 519 US construction companies"),
   title="Free Revenue Audit for Industrial Service Companies | Six Harmony"),
}

def strip_nav(html):
    html = re.sub(r'<button class="menu-btn".*?</button>\s*', '', html, flags=re.S)
    html = re.sub(r'<nav class="nav".*?</nav>', '<span class="lp-tag">Free Revenue Audit</span>', html, flags=re.S)
    return html

def lp_foot():
    return '''
</main>
<footer class="site-foot lp-foot">
  <div class="wrap">
    <img src="img/logo-navy.svg" alt="Six Harmony" width="140" height="40">
    <p>A family business in San Antonio, Texas.</p>
    <p class="lp-links"><a href="about.html">About Us</a> · <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></p>
    <p class="legal">&copy; <span data-year>2026</span> Six Harmony. Demos use fictional businesses and fictional callers. Estimates are not guarantees. Please don't send patient or customer information through this site.</p>
  </div>
</footer>
<script src="js/site.js?v=''' + V + '''" defer></script>
<script src="js/marquee.js?v=''' + V + '''" defer></script>
'''

for key, c in LP.items():
    vsl_file = f"media/vsl-{key}.mp4"
    if os.path.exists(vsl_file):
        vsl = f'<video class="lp-video" src="{vsl_file}" controls playsinline preload="metadata"></video>'
    elif (EMBED_EYE if key == "eye" else EMBED_IND):
        vsl = ""
    else:
        vsl = f'''<div class="lp-video lp-video-slot"><div><p class="lp-k">Hear it yourself</p><p class="lp-vt">Call the demo before you take the audit.</p><p>Call {c["demo_who"]}. Ask what your {"patients" if key=="eye" else "customers"} ask.</p><a class="btn btn-gold" href="{c["demo"]}" target="_blank" rel="noopener">{c["demo_label"]}</a></div></div>'''
    page = strip_nav(head(c["title"], c["sub"], c["path"], noindex=True)) + f'''
<section class="hero lp-hero">
  <div class="wrap">
    <p class="eyebrow-dark">{c["eyebrow"]}</p>
    <h1 id="lp-h" data-a="{c["a"]}" data-b="{c["b"]}">{c["a"]}</h1>
    <p class="lede">{c["sub"]}</p>
    {vsl}
    <p class="lp-down">{"Talk to the live demo, then take the free 3-minute audit below" if not vsl else "Take the free 3-minute audit below"}</p>
  </div>
  <img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364">
</section>
{embed_band(key if key == "eye" else "ind", "Hear it answer a call", "Tap start and talk to it like a " + ("patient" if key == "eye" else "customer") + ". It runs on a fictional business, so test it freely.") if not vsl else ""}

<section class="band lp-app" id="apply">
  <div class="wrap">
    <div class="au-wrap" id="audit" data-mode="lead-first" data-type="{c["kind"]}" data-book="{BOOK}" data-demo-eye="{DEMO_EYE}" data-demo-ind="{DEMO_IND}" aria-live="polite">
      <noscript><p class="au-card">The audit needs JavaScript. You can <a href="{BOOK}">book a free strategy call</a> instead.</p></noscript>
    </div>
    <ul class="lp-gets"><li>Your Revenue Score</li><li>Your #1 gap</li><li>What it may cost you</li><li>Your 30-day plan</li></ul>
  </div>
</section>
{net_compact()}

<script>
(function(){{var h=document.getElementById("lp-h"),a=document.getElementById("audit"),v;
try{{v=localStorage.getItem("sh_lp_{key}");}}catch(e){{}}
if(v!=="a"&&v!=="b"){{v=Math.random()<.5?"a":"b";try{{localStorage.setItem("sh_lp_{key}",v);}}catch(e){{}}}}
var q=new URLSearchParams(location.search).get("v");if(q==="a"||q==="b")v=q;
h.textContent=h.getAttribute("data-"+v);a.setAttribute("data-variant","{key}-"+v);}})();
</script>
''' + lp_foot() + f'<script src="js/audit.js?v={V}" defer></script>\n</body>\n</html>\n'
    write(c["path"], page)

# ---------- Terms ----------
html = head("Terms | Six Harmony", "Terms for using the Six Harmony website, demos, and free Revenue Audit.", "terms.html") + '''
<section class="band">
  <div class="wrap measure">
    <h1 style="font-size:52px">Terms</h1>
    <p class="small" style="margin:16px 0 32px">Last updated October 2026</p>
    <h3>Using this site</h3>
    <p>This website, its live demos, and the free Revenue Audit are provided by Six Harmony, San Antonio, Texas, for general information about our services.</p>
    <h3>Demos</h3>
    <p>Our demos run on fictional businesses with fictional callers. They show how a system can work and are not a finished install for your business. Please don't share real patient or customer information with a demo.</p>
    <h3>Audit results are estimates</h3>
    <p>The Revenue Assessment is an estimate built from your answers and the averages shown on the results page. It is not a guarantee of results, revenue, or savings, and it is not financial, legal, or medical advice.</p>
    <h3>Services</h3>
    <p>Any work we do for you is covered by a separate written agreement that sets out the scope, price, and timeline. Nothing on this site is an offer to provide services on those terms.</p>
    <h3>Liability</h3>
    <p>This site is provided as is. To the extent the law allows, Six Harmony is not liable for decisions made based on the website, demos, or audit results.</p>
    <h3>Contact</h3>
    <p>Questions about these terms: cristian@sixharmony.net.</p>
  </div>
</section>
''' + foot() + '</body>\n</html>\n'
write("terms.html", html)
