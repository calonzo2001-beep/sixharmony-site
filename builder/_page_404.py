from _build import *
import re
html = head("Page not found | Six Harmony", "This page doesn't exist.", "404.html", noindex=True, dark=True) + f'''
<section class="hero-garden hero-404">
  <div class="bg" aria-hidden="true"></div>
  <img class="hero-wm" src="img/mark-navy.svg" alt="" width="380" height="364">
  <div class="wrap">
    <p class="eyebrow">Error 404</p>
    <h1>This path hasn't been <em>raked</em> yet.</h1>
    <p class="lede">The page you're looking for moved or never existed. Here's where most people are headed:</p>
    <div class="cta-actions">
      <a class="btn btn-gold" href="index.html">Back to home</a>
      <a class="btn btn-line" href="demos.html">Try a live demo</a>
    </div>
    <ul class="lost-links">
      <li><a href="ai-receptionist-eye-care.html">AI receptionist for Eye Care Practices</a></li>
      <li><a href="ai-back-office-industrial-services.html">AI back office for Industrial Service Companies</a></li>
      <li><a href="{AUDIT}">Take the free Revenue Audit</a></li>
    </ul>
  </div>
</section>
''' + foot() + '</body>\n</html>\n'
# Netlify serves this at any missing URL, so every local path must be root-absolute.
html = re.sub(r'(href|src)="(?!https?:|/|#|mailto:)', r'\1="/', html)
html = html.replace('<link rel="canonical" href="https://sixharmony.net/404.html">\n','')
write("404.html", html)
