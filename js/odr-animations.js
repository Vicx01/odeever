(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scope = document.querySelector("main") || document;
  const selectors = [
    ".elementor-widget-text-editor",
    ".elementor-widget-heading",
    ".elementor-widget-image",
    ".elementor-widget-image-box",
    ".elementor-widget-icon",
    ".elementor-widget-icon-list",
    ".elementor-column.elementor-inner-column",
    "img"
  ];

  const targets = scope.querySelectorAll(selectors.join(","));
  targets.forEach((el) => {
    if (el.hasAttribute("data-aos")) return;
    if (el.closest("[data-aos]")) return;
    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-duration", "700");
    el.setAttribute("data-aos-easing", "ease-out-cubic");
    el.setAttribute("data-aos-once", "true");
  });

  if (!prefersReduced && window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80,
      once: true,
      anchorPlacement: "top-bottom"
    });
  }

  const heroes = document.querySelectorAll(".odr-page-hero");
  if (prefersReduced || !heroes.length) return;

  const speed = 0.25;
  let ticking = false;

  const updateParallax = () => {
    heroes.forEach((hero) => {
      const rect = hero.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const yPos = (window.pageYOffset - absoluteTop) * speed;
      hero.style.backgroundPosition = `center ${Math.round(yPos)}px`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
