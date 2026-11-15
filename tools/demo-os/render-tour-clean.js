// Deterministic frame-by-frame renderer: fake clock, fake cursor, VO-timed beats.
const { chromium } = require('playwright');
const fs = require('fs');
const [file, out, niche, maxBeatsArg] = process.argv.slice(2);
const MAXBEATS = maxBeatsArg ? Number(maxBeatsArg) : 99;
const FPS = 30;
const N = {
  gym: { title: ['Ironline Fitness OS', 'A demo of what we can build for your gym'], end: 'Built custom for your gym.  ·  sixharmony.net',
    caps: ['Everything runs from one screen — all of it live', 'Every member, every visit, every payment',
      'Collected this month — drafts, freezes, declines handled', 'Declined cards retried on payday',
      'Front desk and pro shop — same system', 'Describe an audience in plain English',
      'Growth, retention, revenue — traced to the books', 'AI agents do the busywork — a person approves the money'],
    typed: 'Early birds who hit the 6 AM class every week' },
  eyecare: { title: ['Summit Eye Care OS', 'A demo of what we can build for your practice'], end: 'Built custom for your practice.  ·  sixharmony.net',
    caps: ['Everything runs from one screen — all of it live', 'Every patient, every visit, every payment',
      'Collected this month — drafts, holds, declines handled', 'Declined cards retried on payday',
      'Front desk and optical — same system', 'Describe an audience in plain English',
      'Growth, retention, revenue — traced to the books', 'AI agents do the busywork — a person approves the money'],
    typed: 'Patients overdue for an exam who answer texts' },
  mechanical: { title: ['Kestrel Mechanical OS', 'A demo of what we can build for your business'], end: 'Built custom for your business.  ·  sixharmony.net',
    beat5: 'rates', caps: ['Everything runs from one screen — all of it live', 'Every account, every job ticket, every invoice',
      'Collected this month — agreements and T&M tickets', 'Every ticket priced off your rate sheet',
      'Dispatch and parts counter — same system', 'Describe an audience in plain English',
      'Growth, retention, revenue — traced to the books', 'AI agents do the busywork — a person approves the spend'],
    typed: 'Boiler accounts with no visit since summer' },
}[niche];
// beat lengths in seconds — the voiceover script is written to these
const BEATS = process.env.BEATS ? process.env.BEATS.split(',').map(Number) : [5.0, 7.0, 9.5, 7.5, 8.0, 6.0, 10.0, 8.0, 10.0, 8.0];
const SPEEDS = process.env.SPEEDS ? process.env.SPEEDS.split(',').map(Number) : [];
let SPD = SPEEDS[0] || 1;
const NOCAP = !!process.env.NOCAP;

(async () => {
  const dir = 'frames-' + out; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-11-15T10:00:00') });
  await p.goto('file:///tmp/claude-0/-home-claude/bbb9bd7d-52f7-5bac-b3f5-507037caea20/scratchpad/' + file);
  await p.clock.runFor(500);
  await p.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = `
#fcur,#frip{display:none!important}
.seg .thumb{transition:none!important}
#bchrome{position:fixed;top:0;left:0;right:0;height:46px;background:#e9eaed;border-bottom:1px solid #d3d5da;z-index:1500;display:flex;align-items:center;gap:8px;padding:0 16px;font:500 13px Inter,system-ui,sans-serif;color:#5b6068}
#bchrome i{width:12px;height:12px;border-radius:50%;display:inline-block}
#bchrome .url{margin-left:18px;flex:0 1 560px;background:#fff;border:1px solid #d3d5da;border-radius:8px;padding:6px 14px;color:#3b3f46}
#fcur{position:fixed;left:0;top:0;z-index:3000;pointer-events:none;width:24px;height:24px;margin:-2px 0 0 -4px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
#frip{position:fixed;z-index:2900;pointer-events:none;width:44px;height:44px;border-radius:50%;background:rgba(93,79,214,.45);display:none}
#capwrap{position:fixed;left:0;right:0;bottom:40px;display:flex;justify-content:center;z-index:2000;pointer-events:none}
#cap{max-width:940px;background:rgba(14,15,18,.9);border:1px solid rgba(255,255,255,.14);border-left:4px solid #E2C766;border-radius:12px;padding:15px 28px;font:600 25px/1.32 Inter,system-ui,sans-serif;color:#fff;opacity:0;text-align:center}
#cover{position:fixed;inset:0;background:rgba(12,13,16,.93);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2500;opacity:0;pointer-events:none;text-align:center}
#cover b{font:600 56px/1.12 Inter,system-ui;color:#fff;letter-spacing:-0.02em;max-width:1100px}
#cover span{font:500 25px/1.4 Inter,system-ui;color:#c6cad1;margin-top:16px;max-width:980px}
#cover .bar{width:58px;height:4px;background:#E2C766;border-radius:2px;margin-top:28px}`;
    document.head.appendChild(st);
    const add = (id, html) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html || ''; document.body.appendChild(d); return d; };
    add('fcur', '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 2l14 11h-7.2l4 8-2.8 1.4-4-8L5 19z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>');
    add('frip');
    add('capwrap', '<div id="cap"></div>');
    add('cover', '<b id="cvt"></b><span id="cvs"></span><div class="bar"></div>');
    window.__frame = s => {
      document.getElementById('fcur').style.transform = `translate(${s.cx}px,${s.cy}px)`;
      const c = document.getElementById('cap'); c.style.opacity = s.capA; c.style.transform = `translateY(${(1 - s.capA) * 18}px)`;
      if (s.capText != null && c.textContent !== s.capText) c.textContent = s.capText;
      document.getElementById('cover').style.opacity = s.covA;
      const r = document.getElementById('frip');
      if (s.rip >= 0) { const k = s.rip / 11; r.style.display = 'block'; r.style.left = s.rx + 'px'; r.style.top = s.ry + 'px'; r.style.transform = `translate(-50%,-50%) scale(${0.35 + k * 1.5})`; r.style.opacity = (1 - k) * 0.6; }
      else r.style.display = 'none';
      if (s.sy != null && Math.abs(window.scrollY - s.sy) > 0.5) window.scrollTo(0, s.sy);
    };
  });

  const s = { cx: 1180, cy: 520, capA: 0, capT: 0, capText: '', covA: 0, covT: 0, rip: -1, rx: 0, ry: 0, sy: 0 };
  let frame = 0;
  const t0 = Date.now();
  async function tick() {
    await p.clock.runFor(1000 / FPS);
    s.capA += (s.capT - s.capA) * 0.24; if (Math.abs(s.capT - s.capA) < 0.01) s.capA = s.capT;
    s.covA += (s.covT - s.covA) * 0.17; if (Math.abs(s.covT - s.covA) < 0.01) s.covA = s.covT;
    if (s.rip >= 0) { s.rip++; if (s.rip > 11) s.rip = -1; }
    await p.evaluate(x => window.__frame(x), s);
    await p.screenshot({ path: `${dir}/f${String(frame++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 });
  }
  const wait = async sec => { for (let i = 0, n = Math.round(sec / SPD * FPS); i < n; i++) await tick(); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  async function moveTo(x, y, sec) {
    const sx = s.cx, sy = s.cy, d = Math.hypot(x - sx, y - sy);
    const n = Math.max(4, Math.round((sec || Math.min(0.95, Math.max(0.4, d / 1300))) / SPD * FPS));
    for (let i = 1; i <= n; i++) { const e = ease(i / n); s.cx = sx + (x - sx) * e; s.cy = sy + (y - sy) * e; await p.mouse.move(s.cx, s.cy); await tick(); }
  }
  async function box(sel, nth) { const l = p.locator(sel).nth(nth || 0); return await l.boundingBox(); }
  async function moveToSel(sel, nth, fx, fy) { const bb = await box(sel, nth); await moveTo(bb.x + bb.width * (fx ?? 0.5), bb.y + bb.height * (fy ?? 0.5)); }
  async function click(sel, nth, fx, fy) {
    await moveToSel(sel, nth, fx, fy); await wait(0.12);
    s.rip = 0; s.rx = s.cx; s.ry = s.cy;
    await p.mouse.down(); await p.mouse.up();
    await wait(0.2);
  }
  async function nav(hash) { await click(`#nav a[href="${hash}"]`); s.sy = 0; await wait(0.25); }
  async function scrollTo(y, sec) { const a = s.sy, n = Math.max(1, Math.round(sec / SPD * FPS)); for (let i = 1; i <= n; i++) { s.sy = a + (y - a) * ease(i / n); await tick(); } }
  const getThumb = () => p.evaluate(() => { const t = document.querySelector('.seg .thumb'); return t ? { l: parseFloat(t.style.left), w: parseFloat(t.style.width) } : null; });
  async function clickTab(sel) {
    const old = await getThumb();
    await click(sel); await tick(); await tick();
    const fin = await getThumb();
    if (old && fin) for (let i = 1; i <= 11; i++) { const e = 1 - Math.pow(1 - i / 11, 3);
      await p.evaluate(v => { const t = document.querySelector('.seg .thumb'); if (t) { t.style.left = v.l + 'px'; t.style.width = v.w + 'px'; } }, { l: old.l + (fin.l - old.l) * e, w: old.w + (fin.w - old.w) * e });
      await tick(); }
  }
  const cap = i => { if (NOCAP) return; s.capText = N.caps[i]; s.capT = 1; };
  const capOff = () => { s.capT = 0; };
  let beatStart = 0, beatIdx = 0; const SNAP = [];
  async function endBeat() {
    SNAP.push(await p.evaluate(() => { const on = document.querySelector('.seg button[aria-pressed="true"]'); return { hash: location.hash, t: on ? (on.getAttribute('data-t') || '') : '', f: on ? (on.getAttribute('data-f') || '') : '', text: document.querySelector('main').innerText }; }));
    const target = beatStart + Math.round(BEATS[beatIdx] * FPS);
    if (frame > target) console.log(`  beat ${beatIdx + 1} OVERRAN by ${((frame - target) / FPS).toFixed(2)}s`);
    while (frame < target - 14) await tick();
    s.capT = 0;
    while (frame < target) await tick();
    console.log(`beat ${beatIdx + 1} done @ ${(frame / FPS).toFixed(2)}s (real ${(Date.now() - t0) / 1000 | 0}s)`);
    beatStart = frame; beatIdx++; SPD = SPEEDS[beatIdx] || 1;
    return beatIdx >= MAXBEATS;
  }

  // BEAT 1 — title card
  await p.evaluate(([t, s2]) => { document.getElementById('cvt').textContent = t; document.getElementById('cvs').textContent = s2; }, N.title);
  s.covA = 1; s.covT = 1; await wait(3.9); s.covT = 0;
  if (await endBeat()) return finish();
  // BEAT 2 — overview
  cap(0); await wait(0.6);
  await moveToSel('.tile', 3); await wait(0.7);
  await moveToSel('.tile', 1); await wait(0.5);
  await scrollTo(430, 1.9); await wait(0.9);
  if (await endBeat()) return finish();
  // BEAT 3 — book -> profile -> ledger
  await nav('#patients'); cap(1);
  await wait(0.7); await scrollTo(260, 1.1);
  const pickIdx = await p.evaluate(() => typeof __pickRow === 'function' ? __pickRow() : 6); await click('tr.click', pickIdx, 0.18, 0.5); s.sy = 0; await wait(0.9);
  await scrollTo(560, 1.7); await wait(0.5); await scrollTo(1080, 1.5);
  if (await endBeat()) return finish();
  // BEAT 4 — billing, hover the chart
  await nav('#billing'); cap(2); await wait(0.9);
  const bars = p.locator('.chart svg rect[data-tip]');
  const nb = await bars.count();
  for (const k of [Math.floor(nb * 0.25), Math.floor(nb * 0.6), nb - 2]) { const bb = await bars.nth(k).boundingBox(); if (bb) { await moveTo(bb.x + bb.width / 2, bb.y + Math.min(30, bb.height / 2)); await wait(0.55); } }
  if (await endBeat()) return finish();
  // BEAT 5 — declines tab
  if (N.beat5 === 'rates') { cap(3); await clickTab('.seg button[data-t="rates"]'); await wait(1.4); await scrollTo(330, 1.6); await wait(1.2); await scrollTo(0, 0.8); }
  else { cap(3); await clickTab('.seg button[data-t="declines"]'); await wait(0.6);
  await moveToSel('table.tbl tr.click', 1, 0.3); await wait(0.5);
  await moveToSel('table.tbl tr.click', 5, 0.55); await wait(0.6); }
  if (await endBeat()) return finish();
  // BEAT 6 — front desk + POS
  await nav('#frontdesk'); cap(4); await wait(1.5);
  await nav('#optical'); await wait(1.6);
  if (await endBeat()) return finish();
  // BEAT 7 — campaigns -> builder, typed live
  await nav('#campaigns'); cap(5); await wait(0.8);
  await click('a.act.primary[href="#newcampaign"]'); s.sy = 0; await wait(0.6);
  await click('#audtxt', 0, 0.3, 0.4);
  await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await tick();
  for (const ch of N.typed) { await p.keyboard.type(ch); await tick(); if (SPD < 1.4) await tick(); }
  await wait(0.3);
  await click('#buildaud'); await wait(1.2);
  if (await endBeat()) return finish();
  // BEAT 8 — reports: growth, retention, revenue
  await nav('#reports'); cap(6); await wait(1.2);
  await clickTab('.seg button[data-t="retention"]'); await wait(1.2);
  await clickTab('.seg button[data-t="revenue"]'); await wait(1.5);
  if (await endBeat()) return finish();
  // BEAT 9 — agent: approve on camera, then the job cards
  await nav('#agent'); cap(7); await wait(0.9);
  await scrollTo(330, 1.1);
  await click('[data-app="0"]'); await wait(1.4);
  await scrollTo(940, 1.9); await wait(1.0);
  if (await endBeat()) return finish();
  // BEAT 10 — back to billing, end card
  await nav('#billing'); await wait(1.3);
  await p.evaluate(e => { document.getElementById('cvt').textContent = 'Six Harmony'; document.getElementById('cvs').textContent = e; }, N.end);
  s.covT = 1;
  await endBeat();
  return finish();

  async function finish() {
    // video audit: rebuild every beat's screen in a fresh page and compare it with what was filmed
    const q = await b.newPage({ viewport: { width: 1600, height: 900 } });
    await q.goto('file:///tmp/claude-0/-home-claude/bbb9bd7d-52f7-5bac-b3f5-507037caea20/scratchpad/' + file); await q.waitForTimeout(300);
    let approved = false, mism = 0;
    for (let i = 0; i < SNAP.length; i++) { const sn = SNAP[i];
      await q.evaluate(h => { location.hash = h || '#overview'; }, sn.hash); await q.waitForTimeout(120);
      if (sn.t && await q.$('.seg button[data-t="' + sn.t + '"]')) { await q.click('.seg button[data-t="' + sn.t + '"]'); await q.waitForTimeout(80); }
      if (sn.f && await q.$('.seg button[data-f="' + sn.f + '"]')) { await q.click('.seg button[data-f="' + sn.f + '"]'); await q.waitForTimeout(80); }
      if (sn.hash === '#agent' && !approved) { await q.click('[data-app="0"]'); await q.waitForTimeout(100); approved = true; }
      const ref = await q.$eval('main', e => e.innerText);
      if (ref !== sn.text) { mism++; console.log('  VIDEO MISMATCH beat ' + (i + 1) + ' ' + sn.hash); }
    }
    console.log('video audit: ' + SNAP.length + ' beats compared with the audited build — ' + (mism ? mism + ' MISMATCH' : 'all match'));
    await b.close(); console.log(`frames: ${frame} (${(frame / FPS).toFixed(1)}s) in ${(Date.now() - t0) / 1000 | 0}s real`); }
})().catch(e => { console.error('FATAL', e); process.exit(1); });
