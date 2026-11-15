// Cross-screen number audit for the demo consoles.
// For each niche and each location filter: recompute the key figures straight from the raw records,
// then compare with what every screen displays, and compare screens with each other.
const { chromium } = require('playwright');
const BASE = 'file:///tmp/claude-0/-home-claude/bbb9bd7d-52f7-5bac-b3f5-507037caea20/scratchpad/';
const NICHES = [['eye care', 'sh-os-test.html'], ['mechanical', 'sh-os-mech-test.html'], ['gym', 'sh-os-gym-test.html']];
const num = s => { if (s == null) return NaN; const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
const nums = s => (String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/g) || []).map(Number);

(async () => {
  const b = await chromium.launch();
  let total = 0, failed = 0; const fails = [];
  for (const [niche, file] of NICHES) {
    const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + file); await p.waitForTimeout(400);
    const locs = await p.evaluate(() => ['all'].concat(LOCS));
    for (const loc of locs) {
      const tag = `${niche} / ${loc === 'all' ? 'all locations' : loc}`;
      const ck = (name, a, b2, tol = 0) => { total++; const ok = Number.isFinite(a) && Number.isFinite(b2) && Math.abs(a - b2) <= tol; if (!ok) { failed++; fails.push(`${tag}: ${name} — ${a} vs ${b2}`); } };
      const go = async h => { await p.evaluate(x => { location.hash = x; }, h); await p.waitForTimeout(120); };
      const tiles = () => p.evaluate(() => { const box = document.querySelector('main > .tiles, main > #rxtiles > .tiles'); return box ? [...box.querySelectorAll(':scope > .tile')].map(e => ({ v: e.querySelector('.v').innerText, s: (e.querySelector('.s') || {}).innerText || '' })) : []; });
      const tab = async (attr, v) => { await p.click(`.seg button[${attr}="${v}"]`); await p.waitForTimeout(100); };
      await p.selectOption('#loc', loc); await p.waitForTimeout(150);

      // ---- independent recomputation from the raw records ----
      const T = await p.evaluate(() => {
        const ps = P.filter(q => LOC === 'all' || q.loc === LOC);
        const cur = ps.filter(q => q.status !== 'cancelled'), bill = cur.filter(q => q.status !== 'paused'), pd = cur.filter(q => q.status === 'past_due');
        const canc = ps.filter(q => q.status === 'cancelled');
        let paid0 = 0, rec0 = 0, open = 0, openN = 0, nrec0 = 0, agr0 = 0;
        const paid = Array(12).fill(0), rec = Array(12).fill(0), wo = Array(12).fill(0), op = Array(12).fill(0);
        ps.forEach(q => q.led.forEach(l => { const k = 11 - l.m; if (l.st === 'paid') paid[k] += l.amt; else if (l.st === 'rec') rec[k] += l.amt; else if (l.st === 'wo') wo[k] += l.amt; else { op[k] += l.amt; open += l.amt; openN++; }
          if (l.m === 0 && l.kind !== 'tm' && (l.st === 'paid' || l.st === 'rec')) agr0 += l.amt;
          if (l.m === 0) { if (l.st === 'paid') paid0 += l.amt; if (l.st === 'rec') { rec0 += l.amt; nrec0++; } } }));
        const joins = Array(12).fill(0), cancels = Array(12).fill(0);
        ps.forEach(q => { if (q.monthsIn <= 11) joins[11 - q.monthsIn]++; if (q.status === 'cancelled') cancels[11 - q.cAgo]++; });
        const mem = Array(12).fill(0); mem[11] = cur.length; for (let i = 11; i > 0; i--) mem[i - 1] = mem[i] - joins[i] + cancels[i];
        const risk = cur.filter(q => q.status === 'active' && (!q.vis.length || q.vis[0].d > K.vis.risk));
        const older = bill.filter(q => q.rateC < q.priceC);
        return {
          cur: cur.length, active: cur.filter(q => q.status === 'active').length, paused: cur.length - bill.length, pd: pd.length, canc: canc.length, bill: bill.length,
          duesC: bill.reduce((t, q) => t + q.rateC, 0), paid0, rec0, nrec0, agr0, open, openN, joins, cancels, mem, paid, rec, wo, op,
          risk: risk.length, riskC: risk.reduce((t, q) => t + q.rateC, 0), riskSms: risk.filter(q => q.smsOk).length,
          older: older.length, gapC: older.reduce((t, q) => t + q.priceC - q.rateC, 0),
          today: cur.filter(q => q.vis.length && q.vis[0].d === 0).length,
          // record-level integrity
          pdMismatch: pd.filter(q => q.openC !== q.led.filter(l => l.st === 'open').reduce((t, l) => t + l.amt, 0)).length,
          strayOpen: ps.filter(q => q.status !== 'past_due' && q.led.some(l => l.st === 'open')).length,
          chargedAfterLeaving: canc.filter(q => q.led.some(l => l.m < q.cAgo)).length,
          chargedWhilePaused: cur.filter(q => q.status === 'paused' && q.led.some(l => l.m < q.pausedM)).length,
          joinedAfterLeaving: canc.filter(q => q.monthsIn < q.cAgo).length,
          rateAbovePrice: ps.filter(q => q.rateC > q.priceC).length,
          reasons: K.reasons.map(r => canc.filter(q => q.reason === r[0]).length),
          fd: (() => { const rows = FD.filter(r => LOC === 'all' || r.loc === LOC); return { n: rows.length, checked: rows.filter(r => r.st !== K.fd.later).length, inNow: rows.filter(r => r.st === K.fd.nowSt[0]).length, done: rows.filter(r => r.st === K.fd.done).length, walk: LOC === 'all' ? K.fd.walk[0] + K.fd.walk[1] : K.fd.walk[LOCS.indexOf(LOC)], staff: K.fd.who === 'staff', notVisited: rows.filter(r => r.p && r.st !== K.fd.later && !(r.p.vis.length && r.p.vis[0].d === 0)).length }; })(),
          pos: (() => { const s = POS.filter(x => LOC === 'all' || x.loc === LOC); return { n: s.length, totC: s.reduce((t, x) => t + x.amtC, 0), low: K.pos.products.filter(q => q[2] < q[3]).length }; })(),
          staff: (() => { const s = STAFF.filter(x => LOC === 'all' || x.loc === LOC); return { n: s.length, pay: s.reduce((t, x) => t + x.hrs * x.rate, 0), hrs: s.reduce((t, x) => t + x.hrs, 0), exc: s.filter(x => x.exc).length, ot: s.reduce((t, x) => t + Math.max(0, x.hrs - 80), 0) }; })(),
          leads: (() => { const l = LEADS.filter(x => LOC === 'all' || x.loc === LOC); return { n: l.length, wait: l.filter(x => x.wait).length, won: l.filter(x => x.stage === 'joined').length, valC: l.reduce((t, x) => t + x.valC, 0) }; })(),
          calls: { n: CALLS.length, off: CALLS.filter(c => c.off).length, booked: CALLS.filter(c => c.booked).length, val: CALLS.filter(c => c.booked).reduce((t, c) => t + (c.vn || 0), 0), saved: CALLS.filter(c => c.saved).length },
          camp: { n: K.camp.rows.length, msgs: K.camp.rows.filter(r => r.thisMonth).reduce((t, r) => t + r.d, 0) },
          tk: (() => { if (!K.tm) return null; const rs = K.rateSheet, ok = new Set();
            rs.labor.forEach(x => { ok.add(x[1]); ok.add(x[1] * 1.5); ok.add(x[1] * 2); }); rs.equip.forEach(x => ok.add(x[1]));
            let n = 0, sumBad = 0, qrBad = 0, rateBad = 0, matBad = 0, pctBad = 0, minBad = 0, big = 0;
            ps.forEach(q => q.led.forEach(l => { if (l.kind !== 'tm') return; n++; big = Math.max(big, l.amt);
              if (l.tk.lines.reduce((t, x) => t + x.a, 0) !== l.amt || l.tk.a !== l.amt) sumBad++;
              l.tk.lines.forEach(x => {
                if (x.q != null && x.r != null) { if (Math.round(x.q * x.r * 100) !== x.a) qrBad++; if (!ok.has(x.r)) rateBad++; }
                if (x.costC != null && Math.round(x.costC * 1.15) !== x.a) matBad++;
                if (x.pct != null && Math.round(x.baseC * x.pct) !== x.a) pctBad++;
                if (x.min4 && x.q < 4) minBad++; }); }));
            const planBad = K.plans.filter(pl => { const c = K.planCalc[pl[0]], rate = c[2].reduce((t, k) => t + RT[k][1], 0) + TRUCK; return Math.round(c[0] * c[1] * rate * 100 / 12) !== Math.round(pl[1] * 100); }).length;
            return { n, sumBad, qrBad, rateBad, matBad, pctBad, minBad, planBad, big }; })(),
          ids: { pd: (pd[0] || {}).id, paused: (cur.find(q => q.status === 'paused') || {}).id, canc: (canc[0] || {}).id, busy: (cur.slice().sort((x, y) => y.vis.length - x.vis.length)[0] || {}).id, seen: ((FD.find(r => r.p && r.st !== K.fd.later && (LOC === 'all' || r.loc === LOC)) || {}).p || {}).id },
          win: K.vis.win, openLabel: K.st.open
        };
      });
      // records themselves must make sense
      ck('past-due balance = their open ledger rows', T.pdMismatch, 0);
      ck('nobody else has open charges', T.strayOpen, 0);
      ck('nobody charged after leaving', T.chargedAfterLeaving, 0);
      ck('nobody charged while paused', T.chargedWhilePaused, 0);
      ck('nobody joined after they left', T.joinedAfterLeaving, 0);
      ck('no rate above today\'s price', T.rateAbovePrice, 0);
      ck('everyone seen today has a visit dated today', T.fd.notVisited, 0);
      if (T.tk) {
        ck('tickets: there are T&M tickets', T.tk.n > 0 ? 0 : 1, 0);
        ck('tickets: lines add up to the ticket total and the ledger row', T.tk.sumBad, 0);
        ck('tickets: every line = qty × rate', T.tk.qrBad, 0);
        ck('tickets: every rate is on the rate sheet (straight, 1.5×, 2×, equipment)', T.tk.rateBad, 0);
        ck('tickets: materials = cost + 15%', T.tk.matBad, 0);
        ck('tickets: fuel surcharge and subcontract markup computed', T.tk.pctBad, 0);
        ck('tickets: emergency call-outs bill at least the 4-hr minimum', T.tk.minBad, 0);
        ck('agreements: each price = visits × hours × (crew + truck) ÷ 12', T.tk.planBad, 0);
      }
      const col0 = Math.round((T.paid0 + T.rec0) / 100), paid0D = Math.round(T.paid0 / 100);

      // ---- OVERVIEW ----
      await go('#overview');
      const ov = await tiles();
      ck('overview: current count', num(ov[0].v), T.cur);
      ck('overview: net this month', nums(ov[0].s)[0], T.joins[11] - T.cancels[11]);
      ck('overview: paused count', nums(ov[0].s)[1], T.paused);
      ck('overview: monthly dues', num(ov[1].v), Math.round(T.duesC / 100));
      ck('overview: collected this month', num(ov[2].v), col0);
      ck('overview: recovered this month', num(ov[2].s), col0 - paid0D);
      ck('overview: past due $', num(ov[3].v), Math.round(T.open / 100));
      ck('overview: past due count', nums(ov[3].s)[0], T.pd);
      ck('overview: past due % of paying', nums(ov[3].s)[1], Math.round(1000 * T.pd / Math.max(1, T.bill)) / 10, 0.05);
      ck('overview: check-ins today', num(ov[4].v), T.fd.staff ? T.today : niche === 'mechanical' ? T.fd.n : T.fd.checked + T.fd.walk);
      const ends = await p.$$eval('main .chart svg text[font-weight="600"]', els => els.map(e => e.textContent));
      ck('overview: members chart ends at the current count', num(ends[0]), T.cur);
      ck('overview: dues chart last bar = collected this month', num(ends[1]), col0);
      const yr = await p.$$eval('main section.block .panel-sub', els => els.map(e => e.innerText).find(t => /over the year/.test(t)) || '');
      ck('overview: growth over the year', nums(yr.split('.').slice(-2)[0])[0], T.mem[11] - T.mem[0]);
      const attTxt = await p.$eval('main', e => e.innerText);
      const attN = k => { const m = attTxt.match(k); return m ? num(m[1]) : NaN; };
      if (T.pd) ck('overview: needs-attention past-due count', attN(/\n(\d[\d,]*) (?:accounts|members)[^\n]*(?:retry window|past due)/), T.pd);
      if (T.risk) ck('overview: needs-attention at-risk count', attN(/\n(\d[\d,]*) (?:patients overdue|accounts with no site visit|active members haven)/), T.risk);
      if (T.leads.wait) ck('overview: needs-attention leads waiting', attN(/\n(\d+) new leads still waiting/), T.leads.wait);
      if (T.pos.low) ck('overview: needs-attention low stock', attN(/\n(\d+) items under reorder point/), T.pos.low);
      if (T.staff.exc) ck('overview: needs-attention payroll exceptions', attN(/\n(\d+) payroll exceptions/), T.staff.exc);
      if (loc === 'all') {
        const rows = await p.$$eval('main section.block:last-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
        ck('locations: counts add up to the total', rows.reduce((t, r) => t + num(r[1]), 0), T.cur);
        ck('locations: net this month adds up', rows.reduce((t, r) => t + num(r[2]), 0), T.joins[11] - T.cancels[11]);
        ck('locations: dues add up', rows.reduce((t, r) => t + num(r[3]), 0), T.duesC / 100, 0.005);
        ck('locations: collected adds up', rows.reduce((t, r) => t + num(r[4]), 0), (T.paid0 + T.rec0) / 100, 0.005);
      }

      // ---- PEOPLE LIST ----
      await go('#patients');
      const chips = await p.$$eval('.seg button span', els => els.map(e => Number(e.innerText.replace(/,/g, ''))));
      ck('list: Current chip', chips[0], T.cur); ck('list: Active chip', chips[1], T.active); ck('list: Paused chip', chips[2], T.paused);
      ck('list: Past due chip', chips[3], T.pd); ck('list: Cancelled chip', chips[4], T.canc);
      ck('list: Current = Active + Paused + Past due', chips[0], chips[1] + chips[2] + chips[3]);

      // ---- BILLING ----
      await go('#billing'); await tab('data-t', 'overview');
      const bi = await tiles();
      ck('billing: collected this month', num(bi[0].v), col0);
      ck('billing: paid + recovered = collected', nums(bi[0].s)[0] + nums(bi[0].s)[1], col0);
      ck('billing: open balance = overview past due', num(bi[2].v), Math.round(T.open / 100));
      ck('billing: open charge count', nums(bi[2].s)[0], T.openN);
      const r3 = [7, 8, 9].reduce((t, k) => t + Math.round((T.paid[k] + T.rec[k]) / 100) - Math.round(T.paid[k] / 100), 0), w3 = [7, 8, 9].reduce((t, k) => t + Math.round(T.wo[k] / 100), 0);
      ck('billing: recovery rate', num(bi[3].v), Math.round(100 * r3 / Math.max(1, r3 + w3)));
      ck('billing: recovered in those months', num(bi[3].s), r3);
      ck('billing: paused count', num(bi[4].v), T.paused);
      ck('billing: past-due accounts', num(bi[5].v), T.pd);
      const expTile = nums(bi[1].s);
      const sub12 = await p.$$eval('main section.block .panel-sub', els => els.map(e => e.innerText)[0]);
      ck('billing: 12-month collected', nums(sub12)[0], T.paid.reduce((t, v, k) => t + Math.round((v + T.rec[k]) / 100), 0));
      const week = await p.$$eval('main .cols2 section.block:last-of-type .rowlist .r', els => els.map(e => e.innerText));
      await tab('data-t', 'drafts');
      const runs = await p.$$eval('main table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const sched = runs.filter(r => r[4] === 'Scheduled'), done = runs.filter(r => r[4] === 'Completed');
      ck('billing: next run expected $ = scheduled rows', expTile[0], sched.reduce((t, r) => t + num(r[3]), 0), 0.005);
      ck('billing: next run count = scheduled rows', expTile[1], sched.reduce((t, r) => t + num(r[2]), 0));
      const thisMonth = done.filter(r => /Nov/.test(r[0]));
      ck('billing: this month\'s runs add up to agreement invoices collected this month', thisMonth.reduce((t, r) => t + num(r[3]), 0), T.agr0 / 100, 0.005);
      const lastDate = thisMonth[0] ? thisMonth[0][0] : '';
      const lastRows = thisMonth.filter(r => r[0] === lastDate);
      ck('billing: "this week" last run count', nums(week[0].split('\n')[1])[0], lastRows.reduce((t, r) => t + num(r[2]), 0));
      ck('billing: "this week" last run $', num(week[0].split('\n').slice(-1)[0]), lastRows.reduce((t, r) => t + num(r[3]), 0), 0.005);
      ck('billing: "this week" retry row count', nums(week[1].split('\n')[1])[0], T.pd);
      await tab('data-t', 'declines');
      const src = await p.$eval('main .srcline', e => e.innerText);
      ck('billing: declines tab total count', nums(src)[1], T.pd);
      ck('billing: declines tab total $', nums(src)[2], Math.round(T.open / 100));
      await tab('data-t', 'plans');
      const plans = await p.$$eval('main table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const all = plans.pop();
      ck('billing: plan rows add up to the total dues', plans.reduce((t, r) => t + num(r[3]), 0), num(all[3]), 0.005);
      ck('billing: plans total = monthly dues', num(all[3]), T.duesC / 100, 0.005);
      ck('billing: plans paying count', num(all[2]), T.bill);
      if (await p.$('.seg button[data-t="rates"]')) {
        await tab('data-t', 'rates');
        const lab = await p.$$eval('main > section.block:first-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
        ck('rate sheet: overtime = 1.5× straight time', lab.filter(r => Math.abs(num(r[2]) - 1.5 * num(r[1])) > 0.005).length, 0);
        ck('rate sheet: double time = 2× straight time', lab.filter(r => Math.abs(num(r[3]) - 2 * num(r[1])) > 0.005).length, 0);
      }
      await tab('data-t', 'overview');

      // ---- FRONT DESK / DISPATCH ----
      await go('#frontdesk');
      const fd = await tiles();
      ck('desk: first tile = rows on the schedule', num(fd[0].v), T.fd.n);
      if (niche === 'eye care') { ck('desk: checked in', num(fd[1].v), T.fd.checked); ck('desk: in the lobby', num(fd[1].s), T.fd.inNow); ck('desk: still to come', num(fd[0].s), T.fd.n - T.fd.checked); ck('desk: walk-ins', num(fd[2].v), T.fd.walk); }
      if (niche === 'gym') { ck('desk: scanned in today', num(fd[1].v), T.today); ck('desk: day passes', num(fd[2].v), T.fd.walk); }
      if (niche === 'mechanical') { ck('desk: on site now', num(fd[1].v), T.fd.inNow); ck('desk: completed', num(fd[2].v), T.fd.done); ck('desk: job types add up', nums(fd[0].s).reduce((t, v) => t + v, 0), T.fd.n); }
      const holdRows = await p.$$eval('main .cols2 section.block:last-of-type .rowlist .chip', els => els.filter(e => e.innerText === 'Billing hold').length);
      ck('desk: billing-hold tile = hold rows listed', num(fd[3].v), holdRows);

      // ---- REGISTER ----
      await go('#optical');
      const po = await tiles();
      ck('register: today $', num(po[0].v), Math.round(T.pos.totC / 100)); ck('register: today count', num(po[0].s), T.pos.n);
      const sales = await p.$$eval('main .cols2 section.block:last-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const totalRow = sales.pop();
      ck('register: rows add up to the total row', sales.reduce((t, r) => t + num(r[4]), 0), num(totalRow[totalRow.length - 1]), 0.005);
      ck('register: total row = tile', Math.round(num(totalRow[totalRow.length - 1])), num(po[0].v));
      ck('register: low-stock tile = Low chips', num(po[2].v), await p.$$eval('main .chip.bad', els => els.filter(e => e.innerText === 'Low').length));
      ck('register: low-stock = stock below reorder point', num(po[2].v), T.pos.low);
      const mEnd = await p.$$eval('main .chart svg text[font-weight="600"]', els => els.map(e => e.textContent));
      ck('register: month tile = chart last bar', num(po[1].v), num(mEnd[0]));
      if (T.pos.n) ck('register: average = total / count', num(po[3].v), Math.round(T.pos.totC / T.pos.n) / 100, 0.005);

      // ---- STAFF ----
      await go('#staff');
      const st = await tiles();
      const srows = await p.$$eval('main table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      ck('staff: payroll = sum of pay column', num(st[0].v), srows.reduce((t, r) => t + num(r[5]), 0));
      ck('staff: each pay = hours × rate', srows.filter(r => num(r[3]) * num(r[4]) !== num(r[5])).length, 0);
      ck('staff: people count', num(st[0].s), srows.length); ck('staff: hours', num(st[1].v), srows.reduce((t, r) => t + num(r[3]), 0));
      ck('staff: exceptions = flagged rows', num(st[2].v), srows.filter(r => /Missed punch/.test(r[6])).length);
      ck('staff: overtime', num(st[3].v), srows.reduce((t, r) => t + Math.max(0, num(r[3]) - 80), 0));

      // ---- LEADS ----
      await go('#leads');
      const cols = await p.$$eval('.board .col', els => els.map(e => ({ n: Number(e.querySelector('.head .n').innerText), sum: e.querySelector('.head .sum').innerText, cards: e.querySelectorAll('.cardk').length, vals: [...e.querySelectorAll('.cardk .sub')].map(x => x.innerText) })));
      ck('leads: column counts = cards shown', cols.filter(c => c.n !== c.cards).length, 0);
      ck('leads: column $ = sum of its cards', cols.filter(c => Math.abs(num(c.sum) - c.vals.reduce((t, v) => t + num(v.split('·')[1]), 0)) > 0.005).length, 0);
      const ls = await p.$eval('main .srcline', e => e.innerText);
      ck('leads: total on the board', nums(ls)[0], T.leads.n); ck('leads: won count', nums(ls)[1], T.leads.won); ck('leads: waiting count', nums(ls)[3], T.leads.wait);

      // ---- RECEPTIONIST ----
      await go('#receptionist');
      const rx = await tiles();
      const rowsRx = await p.$$eval('#calls .callrow', els => els.length);
      ck('receptionist: calls tile = rows in the log', num(rx[0].v), rowsRx); ck('receptionist: off-hours count', num(rx[0].s), T.calls.off);
      ck('receptionist: booked count', num(rx[1].v), T.calls.booked); ck('receptionist: booked $', num(rx[1].s), Math.round(T.calls.val));
      ck('receptionist: saves', num(rx[3].v), T.calls.saved);

      // ---- CAMPAIGNS ----
      await go('#campaigns');
      const ca = await tiles();
      const crow = await p.$$eval('main section.block:first-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      ck('campaigns: count = rows', num(ca[0].v), crow.length); ck('campaigns: sent count', num(ca[0].s), crow.filter(r => /Sent/.test(r[1])).length);
      ck('campaigns: messages this month', num(ca[1].v), T.camp.msgs);
      ck('campaigns: delivered never exceeds audience', crow.filter(r => num(r[5]) > num(r[4])).length, 0);
      ck('campaigns: clicks never exceed delivered', crow.filter(r => num(r[6]) > num(r[5])).length, 0);
      const segs = await p.$$eval('main section.block:last-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      ck('campaigns: past-due segment = past-due count', num(segs[0][1]), T.pd);
      ck('campaigns: at-risk segment = at-risk count', num(segs[1][1]), T.risk);
      ck('campaigns: reachable never exceeds segment', segs.filter(r => num(r[2]) > num(r[1]) || num(r[3]) > num(r[1])).length, 0);
      await go('#newcampaign');
      const aud = await p.$eval('#audn', e => Number(e.innerText)), audsub = await p.$eval('#audsub', e => e.innerText), excl = await p.$eval('.excl b', e => e.innerText);
      ck('builder: audience = at-risk with text consent', aud, T.riskSms);
      ck('builder: matches = at-risk count', nums(audsub)[0], T.risk);
      ck('builder: audience + left out = matches', aud + num(excl), nums(audsub)[0]);

      // ---- REPORTS ----
      await go('#reports'); await tab('data-t', 'growth');
      const gr = await tiles();
      const j3 = T.joins[9] + T.joins[10] + T.joins[11];
      ck('growth: joins in 3 months', num(gr[0].v), j3); ck('growth: joins in 12 months', num(gr[0].s), T.joins.reduce((t, v) => t + v, 0));
      const srcRows = await p.$$eval('main section.block:last-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const srcAll = srcRows.pop();
      ck('growth: source rows add up', srcRows.reduce((t, r) => t + num(r[1]), 0), j3); ck('growth: total row', num(srcAll[1]), j3);
      ck('growth: shares add up to 100%', srcRows.reduce((t, r) => t + num(r[2]), 0), j3 ? 100 : 0, 0.35);
      ck('growth: dues by source add up', srcRows.reduce((t, r) => t + num(r[3]), 0), num(srcAll[3]), 0.005);
      ck('growth: dues tile = table total', num(gr[1].v), num(srcAll[3]), 0.005);
      await tab('data-t', 'retention');
      const re = await tiles();
      const c12 = T.cancels.reduce((t, v) => t + v, 0);
      ck('retention: cancellations this month', num(re[0].v), T.cancels[11]); ck('retention: 12-month cancellations', num(re[0].s), c12);
      ck('retention: 12-month cancellations = Cancelled chip', c12, T.canc);
      ck('retention: at-risk count', num(re[2].v), T.risk); ck('retention: dues at risk', num(re[3].v), Math.round(T.riskC / 100));
      const reas = await p.$$eval('main .cols2 section.block:last-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const reasAll = reas.pop();
      ck('retention: reasons add up to all cancellations', reas.reduce((t, r) => t + num(r[1]), 0), c12); ck('retention: reasons total row', num(reasAll[1]), c12);
      ck('retention: net this month = joins − cancellations', T.joins[11] - T.cancels[11], T.mem[11] - T.mem[10]);
      await tab('data-t', 'revenue');
      const rv = await tiles();
      ck('revenue: dues on the book', num(rv[0].v), Math.round(T.duesC / 100)); ck('revenue: paying count', num(rv[0].s), T.bill);
      ck('revenue: average dues', num(rv[1].v), Math.round(T.duesC / Math.max(1, T.bill)) / 100, 0.005);
      ck('revenue: recovered in 12 months', num(rv[2].v), T.paid.reduce((t, v, k) => t + Math.round((v + T.rec[k]) / 100) - Math.round(v / 100), 0));
      ck('revenue: on an older rate', num(rv[3].v), T.older); ck('revenue: gap to today\'s prices', num(rv[3].s), T.gapC / 100, 0.005);
      const pl = await p.$$eval('main section.block:first-of-type table.tbl tr', trs => trs.slice(1).map(tr => [...tr.children].map(td => td.innerText)));
      const plAll = pl.pop();
      ck('revenue: plan dues add up', pl.reduce((t, r) => t + num(r[2]), 0), T.duesC / 100, 0.005); ck('revenue: plan counts add up', pl.reduce((t, r) => t + num(r[1]), 0), T.bill);
      ck('revenue: each average = dues / count', pl.filter(r => num(r[1]) && Math.abs(num(r[4]) - Math.round(100 * num(r[2]) / num(r[1])) / 100) > 0.011).length, 0);
      ck('revenue: no average above today\'s rate', pl.filter(r => num(r[1]) && num(r[4]) > num(r[5]) + 0.001).length, 0);
      ck('revenue: older-rate column adds up', pl.reduce((t, r) => t + num(r[6]), 0), T.older);
      ck('revenue: shares add up to 100%', pl.reduce((t, r) => t + num(r[3]), 0), 100, 0.35);
      await tab('data-t', 'growth');

      // ---- AGENT ----
      await p.evaluate(() => { VIEWS.agent._w = null; VIEWS.agent._d = null; });
      await go('#agent');
      const ag = await tiles();
      const jobs = await p.$$eval('.jobs .job', els => els.map(e => [...e.querySelectorAll('.stats .v')].map(v => v.innerText)));
      ck('agent: tasks = sum of job runs', num(ag[0].v), jobs.reduce((t, j) => t + num(j[0]), 0));
      ck('agent: hours = sum of job hours', num(ag[1].v), Math.round(10 * jobs.reduce((t, j) => t + num(j[1]), 0)) / 10, 0.001);
      ck('agent: each job\'s hours = runs × minutes each', jobs.filter(j => Math.abs(num(j[1]) - Math.round(num(j[0]) * num(j[2]) / 6) / 10) > 0.001).length, 0);
      ck('agent: recovered this month', num(ag[2].v), col0 - paid0D); ck('agent: recovered count', num(ag[2].s), T.nrec0);
      const wq = await p.$$eval('#waiting > div', els => els.length);
      ck('agent: waiting tile = rows in the queue', num(ag[3].v), wq);
      await go('#overview');
      const small = await p.$$eval('main .cols2 .tiles .tile .v', els => els.map(e => e.innerText));
      ck('overview: agent card tasks = 7/30 of the 30-day total', num(small[0]), Math.round(num(ag[0].v) * 7 / 30));
      ck('overview: agent card recovered = billing', num(small[2]), col0 - paid0D);

      // ---- PROFILES ----
      for (const [kind, id] of Object.entries(T.ids)) {
        if (!id) continue;
        await go('#patient-' + id);
        const pr = await p.evaluate(({ id, win, openLabel }) => {
          const sec = h => [...document.querySelectorAll('main section.block')].find(s => (s.querySelector('h3') || {}).innerText === h); const q = P.find(x => x.id === id), rows = [...sec('Ledger').querySelectorAll('table.tbl tr')].slice(1).map(tr => [...tr.children].map(td => td.innerText));
          const banner = document.querySelector('.banner .amt'), t = [...sec(L.visTitle).querySelectorAll('.tiles .tile .v')].map(e => e.innerText);
          const vrows = [...sec(L.visTitle).querySelectorAll('table.tbl tr')].slice(1).map(tr => tr.children[0].innerText);
          return { led: q.led.length, ledRows: rows.filter(r => r.length === 5).length, openRows: rows.filter(r => r[3] === openLabel).reduce((s, r) => s + Number(r[4].replace(/[$,]/g, '')), 0), banner: banner ? Number(banner.innerText.replace(/[$,]/g, '')) : null, openC: q.openC / 100, status: q.status,
            vwin: q.vis.filter(v => v.d <= win).length, tileV: Number(t[0]), first: vrows[0] || '', last: q.vis.length ? q.vis[0].d : null, shown: vrows.length, all: q.vis.length, dues: document.querySelector('main .facts > div:nth-child(2) .v').innerText, rateC: q.rateC };
        }, { id, win: T.win, openLabel: T.openLabel });
        ck(`profile (${kind}): ledger rows shown = ledger entries`, pr.ledRows, pr.led);
        ck(`profile (${kind}): monthly dues shown`, num(pr.dues), pr.rateC / 100, 0.005);
        if (pr.status === 'past_due') { ck(`profile (${kind}): banner = open ledger rows`, pr.banner, pr.openRows, 0.005); ck(`profile (${kind}): banner = balance`, pr.banner, pr.openC, 0.005); }
        else ck(`profile (${kind}): no banner unless past due`, pr.banner === null ? 0 : 1, 0);
        ck(`profile (${kind}): visit-count tile`, pr.tileV, pr.vwin);
        if (pr.all) ck(`profile (${kind}): first visit row = most recent visit`, pr.last === 0 ? (pr.first === 'Today' ? 0 : 1) : num(pr.first) === pr.last ? 0 : 1, 0);
        ck(`profile (${kind}): visit rows shown`, pr.shown, Math.max(1, Math.min(10, pr.all)));
      }

      // ---- hand-written rows agree with each other ----
      const nar = await p.evaluate(() => {
        const F = FACTS(), po = K.pos.po.amt, att = K.att(F).map(r => r[2] + ' ' + r[3]).join(' | '), dec = K.decided(H).map(r => r.t + ' ' + r.s).join(' | ');
        const poInAtt = (att.match(/PO drafted to [^$|]*\$([\d,]+)/g) || []).map(x => Number(x.replace(/.*\$/, '').replace(/,/g, '')));
        const poInDec = (dec.match(/Drafted PO-\d+[^$|]*\$([\d,.]+)/g) || []).map(x => Number(x.replace(/.*\$/, '').replace(/,/g, '')));
        const win = (K.camp.winVal + ' ' + K.camp.winSub).match(/\d+/g).map(Number);
        const res = K.camp.rows.filter(r => r.sent30).map(r => (r.res || '').match(/\d+/g) || []).flat().map(Number);
        const lowNames = K.pos.products.filter(q => q[2] < q[3]).length;
        return { po, poInAtt, poInDec, winMissing: win.filter(n => !res.includes(n)).length, lowNames, attLow: F.lowN };
      });
      if (nar.attLow) ck('purchase order: register amount = needs-attention row', nar.poInAtt.includes(nar.po) ? 0 : 1, 0);
      ck('purchase order: register amount = decided feed', nar.poInDec.includes(nar.po) ? 0 : 1, 0);
      ck('campaigns: headline results all come from rows sent in the last 30 days', nar.winMissing, 0);

      // ---- STABILITY: every screen shows the same thing each time it is opened ----
      for (const r of ['overview', 'patients', 'billing', 'frontdesk', 'optical', 'staff', 'leads', 'receptionist', 'campaigns', 'newcampaign', 'reports', 'agent', 'patient-' + (T.ids.busy || '')]) {
        await go('#' + r); const a = await p.$eval('main', e => e.innerText);
        await go('#staff'); await go('#' + r); const c = await p.$eval('main', e => e.innerText);
        ck(`stable on reopen: ${r.split('-')[0]}`, a === c ? 0 : 1, 0);
      }
    }
    // ---- interactions change the numbers consistently (all locations) ----
    await p.selectOption('#loc', 'all'); await p.waitForTimeout(150);
    const tag2 = `${niche} / interactions`;
    const ck2 = (name, a, b2) => { total++; if (a !== b2) { failed++; fails.push(`${tag2}: ${name} — ${a} vs ${b2}`); } };
    await p.evaluate(() => { VIEWS.agent._w = null; VIEWS.agent._d = null; location.hash = '#agent'; }); await p.waitForTimeout(150);
    const before = await p.$$eval('#waiting > div', e => e.length);
    await p.click('[data-app="0"]'); await p.waitForTimeout(150);
    ck2('agent: approving removes one from the queue', await p.$$eval('#waiting > div', e => e.length), before - 1);
    ck2('agent: waiting tile follows the queue', num(await p.$$eval('main > .tiles .tile .v', e => e[3].innerText)), before - 1);
    await p.evaluate(() => { location.hash = '#receptionist'; }); await p.waitForTimeout(150);
    const c0 = num(await p.$$eval('main .tiles .tile .v', e => e[0].innerText)), b0 = num(await p.$$eval('main .tiles .tile .v', e => e[1].innerText));
    await p.click('#simcall'); await p.waitForTimeout(8600);
    ck2('receptionist: simulated call adds one call', num(await p.$$eval('main .tiles .tile .v', e => e[0].innerText)), c0 + 1);
    ck2('receptionist: simulated call adds one booking', num(await p.$$eval('main .tiles .tile .v', e => e[1].innerText)), b0 + 1);
    ck2('receptionist: log grows by one row', await p.$$eval('#calls .callrow', e => e.length), c0 + 1);
    total++; if (errs.length) { failed++; fails.push(`${niche}: page errors — ${errs.join(' | ')}`); }
    await p.close();
  }
  console.log(`\nCHECKS RUN: ${total}   PASSED: ${total - failed}   FAILED: ${failed}`);
  fails.forEach(f => console.log('  FAIL  ' + f));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
