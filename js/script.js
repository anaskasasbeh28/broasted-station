/* بروستد ستيشن — interactions. No dependencies, progressive enhancement. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── mobile nav ─────────────────────────────────────────────────────── */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function setNav(open) {
    document.body.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) burger.focus();
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      setNav(!document.body.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && document.body.classList.contains("open")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("open")) setNav(false);
    });
  }

  /* ── menu tabs (WAI-ARIA tabs, RTL arrow keys) ──────────────────────── */
  var tabs = document.getElementById("tabs");
  if (tabs) {
    var list = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    function pick(tab) {
      list.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) { p.hidden = !on; p.classList.toggle("on", on); }
      });
    }
    list.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        /* RTL: ArrowLeft advances, ArrowRight goes back */
        if (e.key === "ArrowLeft")  n = (i + 1) % list.length;
        if (e.key === "ArrowRight") n = (i - 1 + list.length) % list.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End")  n = list.length - 1;
        if (n !== null) { e.preventDefault(); list[n].focus(); pick(list[n]); }
      });
    });
  }

  /* ── reveal on scroll, with a hard safety net ───────────────────────── */
  var rv = document.querySelectorAll("[data-rv]");
  function showAll() { rv.forEach(function (el) { el.classList.add("in"); }); }
  if (rv.length && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    rv.forEach(function (el) { io.observe(el); });
    /* if anything never fires (odd webviews, no-scroll viewports), force it */
    window.addEventListener("load", function () { setTimeout(showAll, 2200); });
  } else {
    showAll();
  }

  /* ── mobile action bar: show past the hero, hide over the footer ────── */
  var bar = document.getElementById("bar");
  var hero = document.getElementById("top");
  var foot = document.querySelector(".ft");
  if (bar && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      bar.classList.toggle("up", !e[0].isIntersecting);
    }, { rootMargin: "-65% 0px 0px 0px" }).observe(hero);
    if (foot) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) bar.classList.remove("up");
      }, { threshold: 0.18 }).observe(foot);
    }
  }
})();
