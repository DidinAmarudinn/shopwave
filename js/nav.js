document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navWrap = document.querySelector(".site-nav-wrap");
  if (!toggle || !navWrap) return;

  toggle.addEventListener("click", () => {
    navWrap.classList.toggle("site-nav--open");
    const expanded = navWrap.classList.contains("site-nav--open");
    toggle.setAttribute("aria-expanded", expanded);
  });

  navWrap.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navWrap.classList.remove("site-nav--open"));
  });
});
