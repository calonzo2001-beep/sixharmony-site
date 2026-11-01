#!/usr/bin/env python3
"""Assemble Six Harmony pages from one shell. Run from /home/claude/build."""
import json, os, re, datetime
NET = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_network.html")).read()
SITE = "https://sixharmony.net"
DEMO_EYE = "https://sixharmony.luminasales.io/eye-care-demo"
DEMO_IND = "https://sixharmony.luminasales.io/industrial-services"
BOOK = "https://cal.com/sixharmony/leak-map-call"   # Cal.com event: rename its title to "Free Strategy Call"
AUDIT = "audit.html"
# Lumina live-demo embeds. Keys are public. Paste exactly as Lumina gives them.
EMBED_EYE = "emb_ysz4amwrf506jshnvf0fm0"        # Eye Care Call: receptionist + chat only (landing page, eye care page)
EMBED_EYE_FULL = "emb_78f25pyk9a3nss31c3ry7f"   # Eye Care Demo: full demo (Demos page)
EMBED_IND = "emb_9j2ebed2w30txz3w720cfy"   # Industrial Call: receptionist + chat only
EMBED_JS = "https://sixharmony.luminasales.io/embed.js"
V = "20261101k"
COMPANY_LI = "https://www.linkedin.com/company/six-harmony"
FOUNDER_LI = "https://www.linkedin.com/in/cristian-alonzo-24589a21b"
NET = NET.replace("{FOUNDER_LI}", FOUNDER_LI)

def head(title, desc, path, extra_schema=None, noindex=False, dark=False):
    org = {"@context":"https://schema.org","@type":"ProfessionalService","name":"Six Harmony","url":SITE,
           "logo":SITE+"/img/logo-navy.svg","image":SITE+"/img/og.png","email":"cristian@sixharmony.net",
           "description":"AI answering, booking, and follow-up systems that help Eye Care Practices and Industrial Service Companies capture the revenue they lose to missed calls and missed follow-up.",
           "address":{"@type":"PostalAddress","addressLocality":"San Antonio","addressRegion":"TX","addressCountry":"US"},
           "areaServed":["San Antonio","Texas","United States"],
           "founder":{"@type":"Person","name":"Cristian Alonzo","jobTitle":"Founder","image":SITE+"/img/partners/cristian-alonzo.jpg","sameAs":[FOUNDER_LI]},
           "sameAs":[COMPANY_LI]}
    schemas=[org]+(extra_schema or [])
    robots='<meta name="robots" content="noindex,nofollow">' if noindex else ''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<script>document.documentElement.className="js"</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{path}">
{robots}
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{path}">
<meta property="og:image" content="{SITE}/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="color-scheme" content="light">
<meta name="darkreader-lock">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/Oranienbaum-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="css/site.css?v={V}">
<script type="application/ld+json">{json.dumps(schemas,ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-head{' on-dark' if dark else ''}">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Six Harmony home"><img src="img/logo-navy.svg" alt="Six Harmony" width="160" height="46"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      <a href="ai-receptionist-eye-care.html"{' aria-current="page"' if path.startswith('ai-receptionist-eye-care') else ''}>Eye Care</a>
      <a href="ai-back-office-industrial-services.html"{' aria-current="page"' if path.startswith('ai-back-office') else ''}>Industrial Services</a>
      <a href="demos.html"{' aria-current="page"' if path.startswith('demos') else ''}>Live Demos</a>
      <a href="about.html"{' aria-current="page"' if path.startswith('about') else ''}>About Us</a>
      <a class="btn btn-gold" href="{AUDIT}"{' aria-current="page"' if path.startswith('audit') else ''}>Free Audit</a>
    </nav>
  </div>
</header>
<main id="main">
'''

def foot():
    return f'''
</main>
<footer class="site-foot">
  <div class="wrap">
    <div>
      <img src="img/logo-navy.svg" alt="Six Harmony" width="140" height="40">
      <p>Where people, processes, and technology work in harmony.</p>
      <p>Helping businesses keep more of the revenue they earn.<br>A family business in San Antonio, Texas.</p>
    </div>
    <div>
      <ul>
        <li><a href="ai-receptionist-eye-care.html">Eye Care</a></li>
        <li><a href="ai-back-office-industrial-services.html">Industrial Services</a></li>
        <li><a href="demos.html">Live Demos</a></li>
        <li><a href="blog/index.html">Blog</a></li>
      </ul>
    </div>
    <div>
      <ul>
        <li><a href="{AUDIT}">Free Revenue Audit</a></li>
        <li><a data-book href="{BOOK}">Book a strategy call</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="{COMPANY_LI}" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></li>
      </ul>
    </div>
    <p class="legal">&copy; <span data-year>{datetime.date.today().year}</span> Six Harmony. Demos on this site use fictional businesses and fictional callers. Please don't send patient or customer information through this site.</p>
  </div>
</footer>
<script src="js/site.js?v={V}" defer></script>
<script src="js/marquee.js?v={V}" defer></script>
'''

def faq_schema(qa):
    return {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in qa]}

def faq_html(qa, dark=False):
    items=''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q,a in qa)
    return f'<div class="faq">{items}</div>'

def cta(h, sub=None, demo=None, demo_label="Try the live demo", audit=None):
    s=f'<p class="lede" style="margin:14px 0 0;color:var(--on-navy)">{sub}</p>' if sub else ''
    a=audit or AUDIT
    return f'''<section class="band band-navy cta-band"><div class="wrap" data-reveal><div><h2>{h}</h2>{s}</div><div class="cta-actions"><a class="btn btn-gold" href="{a}">Take the free audit</a><a class="btn btn-line" data-book href="{BOOK}">Book a strategy call</a></div></div></section>'''

PREVIEW_SAMPLES = {
  "eye": ("Sample · fictional practice", 58, "Leaking", [("Call Coverage",62),("After-Hours Calls",21),("Callback Speed",55),("Inquiry Follow-Up",48),("Patient Recall",71)], "After-Hours Calls", "$7,850"),
  "ind": ("Sample · fictional contractor", 54, "Leaking", [("Call Coverage",60),("After-Hours Emergencies",40),("Quote Speed",30),("Quote Follow-Up",38),("Payment Follow-Up",65)], "Quote Speed", "$12,400"),
}
def preview(kind="eye"):
    lab, score, grade, cats, gap, est = PREVIEW_SAMPLES[kind]
    r=54; c=2*3.14159*r; off=c*(1-score/100)
    bars=''.join(f'<li class="{"ok" if v>=70 else "mid" if v>=40 else "low"}"><span>{n}</span><div class="au-track"><i style="width:{max(4,v)}%"></i></div><b>{v}</b></li>' for n,v in cats)
    return f'''<figure class="au-preview" aria-label="A sample Revenue Assessment">
  <div class="pv-top"><span>Revenue Assessment</span><span>{lab}</span></div>
  <div class="pv-body">
    <div class="au-score"><svg viewBox="0 0 140 140" class="au-dial" aria-hidden="true"><circle cx="70" cy="70" r="{r}" class="au-dial-bg"/><circle cx="70" cy="70" r="{r}" class="au-dial-fg" stroke-dasharray="{c:.1f}" stroke-dashoffset="{off:.1f}" transform="rotate(-90 70 70)"/><text x="70" y="78" text-anchor="middle" class="au-dial-n">{score}</text><text x="70" y="98" text-anchor="middle" class="au-dial-of">/ 100</text></svg>
    <div><p class="au-grade">{grade}</p><p class="pv-sub">Revenue Score across five parts</p></div></div>
    <ul class="au-bars">{bars}</ul>
    <div class="pv-row"><div><span>#1 gap</span><b>{gap}</b></div><div><span>Estimated cost</span><b>{est}<small> / mo</small></b></div></div>
    <ol class="pv-plan"><li>Week 1</li><li>Weeks 2 and 3</li><li>Week 4</li></ol>
  </div>
  <figcaption>Your score · Your #1 gap · What it may cost · Your 30-day plan</figcaption>
</figure>'''

def write(path, html):
    depth = path.count("/")
    if depth:
        pre = "../" * depth
        html = re.sub(r'(href|src|poster)="(?!https?:|/|#|mailto:|tel:|data:)', lambda m: m.group(1)+'="'+pre, html)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path,"w").write(html)
    print("wrote", path, len(html)//1024, "KB")


def embed_band(kind, h, sub, paper=False, key=None, extra=""):
    """Live demo band. Sits outside .hero (which clips) with no fixed height."""
    key = key or (EMBED_EYE if kind == "eye" else EMBED_IND)
    if not key:
        return ""
    url = DEMO_EYE if kind == "eye" else DEMO_IND
    return f'''
<section class="band{' band-paper' if paper else ''} lp-demo" id="demo">
  <div class="wrap">
    <div class="section-head"><p class="kicker">Live demo</p><h2>{h}</h2><p>{sub}</p></div>
    <div class="lp-embed">
<div data-lumina-embed="{key}"
     data-lumina-mode="inline"
     data-lumina-theme="auto"></div>
    </div>
    <p class="small lp-embed-alt">{extra + " " if extra else ""}Demo not loading? <a href="{url}" target="_blank" rel="noopener">Open it in a new tab</a>.</p>
  </div>
</section>
<script src="{EMBED_JS}" async></script>
'''


TEAM = [("cristian-alonzo.jpg","Cristian Alonzo","Founder, Six Harmony",FOUNDER_LI),
        ("tim-chao.jpg","Tim Chao","Strategic Partner","https://www.linkedin.com/in/tim-chao"),
        ("joe-brennan.jpg","Joe Brennan","Lead Developer","https://www.linkedin.com/in/joebren")]

def net_compact(about_link="about.html#network", paper=False):
    """Short, always-visible look at the team, with a link to the full network on About Us."""
    people = "".join(f'<a class="nc-p" href="{li}" target="_blank" rel="noopener"><img src="img/partners/{img}" alt="" width="96" height="96" loading="lazy"><b>{n}</b><span>{r}</span></a>' for img,n,r,li in TEAM)
    return f'''
<section class="band nc{' band-paper' if paper else ''}" aria-labelledby="nc-h">
  <div class="wrap">
    <p class="kicker">Our network</p>
    <h2 id="nc-h">Real people behind every install.</h2>
    <p class="nc-sub">Family-run in San Antonio, built with our strategic partners and a bench of 25 vetted developers.</p>
    <div class="nc-row">{people}</div>
    <a class="nc-more" href="{about_link}">See our full network &rarr;</a>
  </div>
</section>
'''

def founder_note(kind="eye"):
    who = "practice" if kind == "eye" else "company"
    return f'''<div class="fn"><img src="img/partners/cristian-alonzo.jpg" alt="Cristian Alonzo" width="72" height="72"><p>\u201cI'm Cristian, founder of Six Harmony, a family business in San Antonio. Take the audit and I'll walk you through your {who}'s results personally.\u201d<span>Cristian Alonzo, Founder</span></p></div>'''
