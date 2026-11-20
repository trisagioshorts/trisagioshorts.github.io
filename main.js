/* TRISAGIO SHORTS — script mínimo: menú móvil, aparición suave y fondo de estrellas.
   No usa cookies, almacenamiento local, analítica ni recursos externos. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // Año en el pie
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Aparición al hacer scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  // Fondo de estrellas (canvas ligero)
  var c = document.getElementById("starfield");
  if (!c || !c.getContext) return;
  var ctx = c.getContext("2d");
  var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function build() {
    w = window.innerWidth; h = window.innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round((w * h) / 5200);
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.7 + 0.2,
        s: Math.random() * 0.015 + 0.004,
        p: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? "196,181,253" : "125,211,252") : "255,255,255"
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = reduce ? s.a : s.a * (0.6 + 0.4 * Math.sin(s.p + t * s.s * 0.06));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + s.hue + "," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  var raf;
  function loop(t) { draw(t); raf = window.requestAnimationFrame(loop); }

  build();
  if (reduce) { draw(0); } else { raf = window.requestAnimationFrame(loop); }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (reduce) draw(0); }, 150);
  });
  document.addEventListener("visibilitychange", function () {
    if (reduce) return;
    if (document.hidden) { window.cancelAnimationFrame(raf); }
    else { raf = window.requestAnimationFrame(loop); }
  });
})();
