// Torch Reviews: Kopfleiste, Einblenden, Zähler und Rechner. Ohne JavaScript bleibt alles sichtbar.
(function () {
  var root = document.documentElement;
  var hasIO = "IntersectionObserver" in window;
  var calm = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (hasIO) root.classList.add("js");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function fmt(x) { return x.toFixed(1).replace(".", ","); }
  function $(id) { return document.getElementById(id); }

  function countUp(el, delay) {
    var from = parseFloat(el.getAttribute("data-from"));
    var to = parseFloat(el.getAttribute("data-to"));
    setTimeout(function () {
      var t0 = null;
      requestAnimationFrame(function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / 900);
        el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    }, delay);
  }

  function calculator() {
    var avg = $("c-avg"), n = $("c-n"), k = $("c-k");
    if (!avg || !n || !k) return;
    var inputs = document.querySelector(".calc-inputs");
    if (inputs) inputs.hidden = false;

    function fill(el) {
      var min = +el.min, max = +el.max;
      var p = max > min ? ((+el.value - min) / (max - min)) * 100 : 0;
      el.style.setProperty("--p", p + "%");
    }
    function update() {
      var a = +avg.value / 10, total = +n.value;
      // Mehr Ein-Stern-Bewertungen, als der Schnitt hergibt, kann es nicht geben.
      var maxK = Math.max(0, Math.min(total - 1, 60, Math.floor((total * (5 - a)) / 4 + 1e-9)));
      var bad = Math.min(+k.value, maxK);
      if (maxK >= 1 && bad < 1) bad = 1;
      k.min = maxK >= 1 ? 1 : 0;
      k.max = Math.max(1, maxK);
      k.disabled = maxK < 1;
      k.value = bad;
      var next = bad > 0 ? Math.min(5, (a * total - bad) / (total - bad)) : a;

      $("o-avg").textContent = fmt(a);
      $("o-n").textContent = total;
      $("o-k").textContent = bad;
      $("r-new").textContent = fmt(next);
      $("r-stars").style.setProperty("--fill", (next / 5) * 100 + "%");
      $("r-gain").textContent = "+" + fmt(Math.max(0, next - a)) + " Sterne";
      $("r-cost").textContent = bad * 5 + " €";
      $("r-note").textContent = bad === 1 ? "für 1 gelöschte Bewertung" : "für " + bad + " gelöschte Bewertungen";
      [avg, n, k].forEach(fill);
    }
    [avg, n, k].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  ready(function () {
    var header = document.querySelector(".header");
    if (header && !header.classList.contains("is-stuck")) {
      var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    calculator();

    var score = document.querySelector("[data-from]");
    var animate = hasIO && !calm;
    if (score && animate) score.textContent = fmt(parseFloat(score.getAttribute("data-from")));

    if (!hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains("mock")) {
          el.classList.add("play");
          if (animate && score && el.contains(score)) countUp(score, 1700);
        } else {
          el.classList.add("in");
        }
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.15 });
    document.querySelectorAll(".reveal, .mock").forEach(function (el) { io.observe(el); });
  });
})();
