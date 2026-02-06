const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Mobile nav toggle */
const toggleBtn = $(".nav-toggle");
const navLinks = $("#navLinks");

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-link", navLinks).forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* Reveal on scroll */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* Active nav link highlight */
const sections = ["about","quickfacts","education","experience","projects","skills","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map();
$$(".nav-link").forEach(a => {
  const href = a.getAttribute("href");
  if (href && href.startsWith("#")) navMap.set(href.slice(1), a);
});

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    $$(".nav-link").forEach(a => a.classList.remove("active"));
    const active = navMap.get(id);
    if (active) active.classList.add("active");
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

sections.forEach(s => spy.observe(s));

/* Footer year */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
