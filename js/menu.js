/* بروستد ستيشن — المنيو الرقمي. بدون مكتبات. */
(function () {
  "use strict";

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* مفتوح / مسكّر — الساعات بملف js/hours.js */
  if (window.bsLiveHours) {
    window.bsLiveHours(
      document.getElementById("openState"),
      document.getElementById("openNote")
    );
  }

  var chips = Array.prototype.slice.call(document.querySelectorAll(".m-chip"));
  var secs  = Array.prototype.slice.call(document.querySelectorAll(".m-sec"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".m-item"));

  /* ── أي قسم إحنا فيه الآن: بيعلّم الشريحة المقابلة ────────────────────
     بنختار أقرب قسم لأعلى الشاشة، مش آخر قسم ظهر — لأنه أول ما تفتح
     الصفحة بيكون في أكثر من قسم ظاهر مع بعض. */
  function markActive() {
    if (!secs.length) return;
    var top = 90, best = secs[0], bestD = Infinity;
    secs.forEach(function (s) {
      if (s.style.display === "none") return;
      var r = s.getBoundingClientRect();
      if (r.bottom < top) return;
      var d = Math.abs(r.top - top);
      if (r.top <= top) d = 0;
      if (d < bestD) { bestD = d; best = s; }
    });
    chips.forEach(function (c) {
      c.setAttribute("aria-current",
        c.getAttribute("href") === "#" + best.id ? "true" : "false");
    });
  }
  var raf = 0;
  window.addEventListener("scroll", function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; markActive(); });
  }, { passive: true });
  markActive();

  /* ── البحث الفوري ──────────────────────────────────────────────────── */
  var q = document.getElementById("q");
  var empty = document.getElementById("empty");
  if (q) {
    var run = function () {
      var v = q.value.trim();
      document.body.classList.toggle("filtering", !!v);
      if (!v) {
        items.forEach(function (el) { el.style.display = ""; });
        secs.forEach(function (s) { s.style.display = ""; });
        if (empty) empty.style.display = "none";
        markActive();
        return;
      }
      var hits = 0;
      items.forEach(function (el) {
        var on = (el.getAttribute("data-s") || "").indexOf(v) !== -1;
        el.style.display = on ? "" : "none";
        if (on) hits++;
      });
      secs.forEach(function (s) {
        var any = s.querySelector('.m-item:not([style*="none"])');
        s.style.display = any ? "" : "none";
      });
      if (empty) empty.style.display = hits ? "none" : "block";
      markActive();
    };
    q.addEventListener("input", run);
    q.addEventListener("search", run);
  }
})();
