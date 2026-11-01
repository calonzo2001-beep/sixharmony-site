// Logo bands, built for iPhone Safari.
// Every logo is its own small element sliding on a CSS animation (smooth, runs off the main thread),
// spaced around one loop with negative delays so the band is always full.
// Sizes come from each logo's width/height attributes, so nothing waits on images loading,
// and there is no single wide moving strip for Safari to drop.
(function () {
  var bands = [].slice.call(document.querySelectorAll(".mq"));
  if (!bands.length) return;
  var style = document.createElement("style"); document.head.appendChild(style);
  var lastW = 0;

  function logoWidth(img, h) {
    var w = +img.getAttribute("width"), hh = +img.getAttribute("height");
    return w && hh ? h * w / hh : (img.getBoundingClientRect().width || h * 3);
  }

  function build() {
    var css = "";
    bands.forEach(function (mq, n) {
      var set = mq.querySelector(".set"), track = mq.querySelector(".track");
      if (!set || !track) return;
      if (!mq._src) mq._src = [].slice.call(set.querySelectorAll("img")).map(function (i) { return i.cloneNode(true); });
      // logo height set here, not read from the stylesheet (iPhone Safari could read the image's full size)
      var vw = innerWidth, cl = mq.classList;
      var clampH = function (min, vwPct, max) { return Math.max(min, Math.min(max, vw * vwPct)); };
      var h = cl.contains("big") ? clampH(28, 0.032, 40) : cl.contains("mid") ? clampH(24, 0.026, 32) : clampH(20, 0.021, 26);
      var gap = parseFloat(getComputedStyle(set).columnGap) || 64;
      var cw = mq.clientWidth;
      var dur = parseFloat(getComputedStyle(mq).getPropertyValue("--dur")) || 60;
      // widths of one set, then repeat the set until the loop is wider than the band plus a logo
      // each logo has a weight value (data-k) so wide wordmarks and square emblems look equally heavy
      var ks = mq._src.map(function (img) { return +img.getAttribute("data-k") || 1; });
      var kmax;
      var one = mq._src.map(function (img, i) { return logoWidth(img, h * ks[i]); });
      // never let one logo take more than ~40% of the band
      var maxW = Math.max(120, mq.clientWidth * 0.4);
      one = one.map(function (w, i) { if (w > maxW) { ks[i] *= maxW / w; return maxW; } return w; });
      kmax = Math.max.apply(null, ks);
      var setW = one.reduce(function (a, w) { return a + w + gap; }, 0);
      var reps = Math.max(1, Math.ceil((cw + Math.max.apply(null, one) + gap) / setW));
      var L = setW * reps, speed = setW / dur, loop = L / speed;
      var rev = mq.classList.contains("rev");
      var name = "mqi" + n;
      // each logo travels from just past the right edge to one loop-length to the left
      css += "@keyframes " + name + "{from{transform:translate3d(" + cw.toFixed(1) + "px,0,0)}to{transform:translate3d(" + (cw - L).toFixed(1) + "px,0,0)}}";
      track.innerHTML = "";
      mq.classList.add("live");
      mq.style.height = Math.ceil(h * kmax) + "px";
      var x = 0;
      for (var r = 0; r < reps; r++) for (var i = 0; i < mq._src.length; i++) {
        var w = one[i], el = document.createElement("div"), img = mq._src[i].cloneNode(true);
        if (r) { img.alt = ""; el.setAttribute("aria-hidden", "true"); }
        img.style.setProperty("height", (h * ks[i]).toFixed(1) + "px", "important");
        img.style.setProperty("width", w.toFixed(1) + "px", "important");
        img.style.setProperty("max-width", "none", "important");
        el.className = "mq-i"; el.appendChild(img);
        // start position x (from the left of the band) -> how far into its loop this logo already is
        var into = ((cw - x) % L + L) % L;
        var delay = -(into / speed);
        if (rev) delay = -((loop - into / speed) % loop);
        // !important so the site-wide reduced-motion rule doesn't freeze the band
        el.style.setProperty("animation", name + " " + loop.toFixed(2) + "s linear " + delay.toFixed(2) + "s infinite" + (rev ? " reverse" : ""), "important");
        track.appendChild(el);
        x += w + gap;
      }
    });
    style.textContent = css;
    lastW = innerWidth;
  }

  build();
  // rebuild only when the width really changes (iOS fires resize when its toolbar hides on scroll)
  var t; addEventListener("resize", function () { if (innerWidth === lastW) return; clearTimeout(t); t = setTimeout(build, 200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (innerWidth !== lastW) build(); });
})();
