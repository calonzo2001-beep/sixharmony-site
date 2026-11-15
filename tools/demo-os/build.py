import sys, re
css = open('../os-style.html').read()
engine = open('engine.js').read()
SHELL = '''<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
{css}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap">

<div class="wrap">
  <header class="top">
    <span class="brand"><span class="dot"></span><span id="brandname"></span> <small>OS</small></span>
    <span class="demo-badge">Demo · sample data</span>
    <span class="spacer"></span>
    <span id="searchwrap"><input id="search" type="search" placeholder="Search…" autocomplete="off"><div id="searchdrop" hidden></div></span>
    <select class="loc" id="loc" aria-label="Location"></select>
    <span class="me" id="me"></span>
  </header>
  <div class="layout">
    <nav class="side" id="nav"></nav>
    <main id="main"></main>
  </div>
</div>
<div id="tip" hidden></div>
<div id="toast" hidden></div>

<script>
{pack}
{engine}
</script>
'''
def build(pack_file, out, title):
    pack = open(pack_file).read()
    html = SHELL.replace('{title}', title).replace('{css}', css).replace('{pack}', pack).replace('{engine}', engine)
    open('../' + out, 'w').write(html)
    wrapped = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
      '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
      '<style>[hidden]{display:none!important} html{color-scheme:light}</style></head><body>' + html + '</body></html>')
    open('../' + out.replace('.html', '-test.html'), 'w').write(wrapped)
    print('built', out, len(html))
targets = {'eyecare': ('pack-eyecare.js', 'sh-os.html', 'Summit Eye Care OS'),
           'mech': ('pack-mech.js', 'sh-os-mech.html', 'Kestrel Mechanical OS'),
           'gym': ('pack-gym.js', 'sh-os-gym.html', 'Ironline Fitness OS')}
for k in (sys.argv[1:] or targets.keys()):
    build(*targets[k])
