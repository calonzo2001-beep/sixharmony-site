// ---- Settings: fill these in once they exist ----
// Your Cal.com link for the free 20-minute strategy call.
// Set the event's redirect-after-booking to https://YOURDOMAIN/thank-you-booked.html
var BOOKING_URL = "https://cal.com/sixharmony/leak-map-call";

// ---- Booking buttons ----
// Until BOOKING_URL is set, "Book" buttons send people to the free audit instead.
(function () {
  var links = document.querySelectorAll("[data-book]");
  links.forEach(function (a) {
    if (BOOKING_URL) { a.href = BOOKING_URL; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = "audit.html"; }
  });
})();

// ---- Mobile menu ----
(function () {
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Close" : "Menu";
  });
})();

// ---- Footer year ----
document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

// ---- Sticky header: blur once the page has scrolled ----
(function () {
  var head = document.querySelector(".site-head"); if (!head) return;
  var on = false;
  function check() { var s = window.scrollY > 8; if (s !== on) { on = s; head.classList.toggle("scrolled", s); } }
  window.addEventListener("scroll", check, { passive: true }); check();
})();

// ---- Scroll reveals and counters ----
(function () {
  var motion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  document.querySelectorAll("[data-stagger]").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", i); });
  });
  var targets = document.querySelectorAll("[data-reveal], [data-count]");
  if (!("IntersectionObserver" in window) || !motion) {
    targets.forEach(function (t) { t.classList.add("in"); if (t.dataset.count) t.textContent = t.dataset.count; });
    return;
  }
  function count(el) {
    var end = parseFloat(el.dataset.count), t0 = null, dur = 1100;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = "0"; requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.dataset.count !== undefined) count(el); else el.classList.add("in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  targets.forEach(function (t) { io.observe(t); });
})();
