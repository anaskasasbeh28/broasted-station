/* ══════════════════════════════════════════════════════════════════════════
   ساعات الدوام — مكان واحد بس للتعديل.
   بدّل الأرقام تحت، وبتتغيّر شارة «مفتوح الآن» بكل الصفحات تلقائيًا.
   النصوص المطبوعة بالصفحات (١٠ صباحًا — ٢ بعد منتصف الليل) غيّرها يدويًا.
   ═════════════════════════════════════════════════════════════════════════ */
window.BS_HOURS = {
  open:  "10:00",      // ١٠ صباحًا
  close: "02:00",      // ٢ بعد منتصف الليل (اليوم اللي بعده)
  tz:    "Asia/Amman"
};

/* بيحدّث أي عنصر شارة كل دقيقة حسب الساعة الحقيقية بعمّان */
window.bsLiveHours = function (el, note) {
  if (!el) return;
  var H = window.BS_HOURS;

  function toMin(hhmm) {
    var p = String(hhmm).split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || 0, 10);
  }
  function nowMin() {
    try {
      var f = new Intl.DateTimeFormat("en-GB", {
        timeZone: H.tz, hour: "2-digit", minute: "2-digit", hour12: false
      }).format(new Date());
      return toMin(f.replace(/^24:/, "00:"));
    } catch (e) {
      var d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  function tick() {
    var o = toMin(H.open), c = toMin(H.close), n = nowMin();
    /* المحل بيسكّر بعد منتصف الليل، فوقت الإغلاق بيقع باليوم اللي بعده */
    var open = (c > o) ? (n >= o && n < c) : (n >= o || n < c);
    el.setAttribute("data-state", open ? "open" : "closed");
    el.textContent = open ? "مفتوح الآن" : "مسكّر حاليًا";
    if (note) note.textContent = open ? "يوميًا" : "بنفتح الساعة " + H.open;
  }
  tick();
  setInterval(tick, 60000);
};
