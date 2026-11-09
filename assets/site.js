// Torch Reviews: nur Bedienung. Ohne JavaScript bleibt alles sichtbar.
(function () {
  if (!("IntersectionObserver" in window)) return;
  var root = document.documentElement;
  root.classList.add("js");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var header = document.querySelector(".header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.classList.contains("mock") ? "play" : "in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });

    document.querySelectorAll(".reveal, .mock").forEach(function (el) { io.observe(el); });
  });
})();
