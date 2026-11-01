import json
I = {
 "cal": '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
 "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 "alert": '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
 "msg": '<path d="M4 5h16v11H9l-5 4z"/>',
 "doc": '<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3"/>',
 "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "phone": '<path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
}
def icon(n): return f'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{I[n]}</svg>'

def router(agent, title, chips, scenes, label):
    cfg = json.dumps({"agent": agent, "scenes": scenes})
    ch = ''.join(f'<li class="r-chip"><span class="r-ico">{icon(ic)}</span><span class="r-name">{name}</span></li>' for ic, name in chips)
    return f'''<figure class="router" aria-label="{label}">
  <script type="application/json">{cfg}</script>
  <div class="r-top"><span class="r-live"><i></i>Live</span><span class="r-title">{title}</span></div>
  <div class="r-caller">
    <span class="r-phone">{icon("phone")}<b></b><b></b></span>
    <span class="r-text"><span class="r-when"></span><span class="r-what"></span></span>
    <span class="r-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
  </div>
  <div class="r-stage">
    <svg class="r-lines" aria-hidden="true"></svg>
    <div class="r-hubrow"><div class="r-hub"><span class="r-hub-mark">{agent[0]}</span><span class="r-state">Incoming call</span></div></div>
    <ul class="r-chips">{ch}</ul>
  </div>
  <div class="r-toast" role="status" aria-live="off"><span class="r-ok">{icon("check")}</span><span class="r-msg"></span></div>
</figure>'''

EYE = router("Elise", "Front desk · Fictional practice",
 [("cal","New patient booked"),("eye","LASIK consult"),("shield","Insurance answered"),("alert","Urgent to on-call"),("msg","Message to team")],
 [{"when":"Tue 7:42 PM · After hours","caller":"New patient wants an annual eye exam","to":0,"result":"Booked Thu 9:40 AM · confirmation texted"},
  {"when":"Wed 12:18 PM · Lunch hour","caller":"Asking how a LASIK consult works","to":1,"result":"Consult booked · follow-up set for coordinator"},
  {"when":"Wed 10:05 AM","caller":"Does my vision plan cover contacts?","to":2,"result":"Coverage explained · fitting booked Fri 2:15 PM"},
  {"when":"Sat 2:14 AM · Weekend","caller":"Sudden flashes and floaters in one eye","to":3,"result":"Told to seek care now · on-call doctor paged"},
  {"when":"Mon 4:51 PM","caller":"Question for the doctor about a prescription","to":4,"result":"Written summary sent to the clinical team"}],
 "A live example: a patient call is answered and routed to booking, a LASIK consult, insurance, the on-call doctor, or the team.")

IND = router("Ava", "Dispatch · Fictional contractor",
 [("alert","Emergency to on-call"),("cal","Service booked"),("doc","Quote from findings"),("clock","Quote follow-up"),("msg","Message to office")],
 [{"when":"Fri 11:52 PM · After hours","caller":"Sprinkler line burst at a warehouse","to":0,"result":"On-call tech paged · ETA texted to the caller"},
  {"when":"Tue 8:06 AM","caller":"Annual fire inspection is due next month","to":1,"result":"Inspection booked Mon 8:00 AM · reminder set"},
  {"when":"Wed 3:30 PM · From the field","caller":"Tech logged 3 deficiencies on site","to":2,"result":"Itemized quote drafted · waiting for approval"},
  {"when":"Thu 10:12 AM","caller":"Customer asking where their quote stands","to":3,"result":"Quote resent · follow-up scheduled in 3 days"},
  {"when":"Mon 1:47 PM","caller":"Question about an invoice","to":4,"result":"Summary sent to billing with the invoice number"}],
 "A live example: a call or field report is answered and routed to the on-call tech, booking, a quote, quote follow-up, or the office.")
