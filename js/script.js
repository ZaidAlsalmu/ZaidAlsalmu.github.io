/* ═══════════════════════════════════════════════════
   ZAID ALSALMU — PORTFOLIO JS
   Features:
   - Mobile nav toggle
   - Scroll reveal with staggered delays
   - Active nav link spy
   - Skill bar animation on scroll
   - Counter animation (stat numbers count up)
   - Cursor glow (desktop)
   - Footer year
═══════════════════════════════════════════════════ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ── Mobile nav toggle ──────────────────────────── */
const toggleBtn = $(".nav-toggle");
const navLinks  = $("#navLinks");

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

/* ── Cursor glow ────────────────────────────────── */
const glow = $(".cursor-glow");
if (glow && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  });
}

/* ── Counter animation ──────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();
  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target) + (target === 250 ? "+" : "");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Skill bar fill ─────────────────────────────── */
function animateBar(bar) {
  const level = bar.dataset.level;
  bar.style.setProperty("--level", level);
  bar.classList.add("animated");
}

/* ── Intersection observer — reveal + extras ────── */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");

    // counter
    const counter = entry.target.querySelector(".counter");
    if (counter && !counter.dataset.animated) {
      counter.dataset.animated = "1";
      setTimeout(() => animateCounter(counter), 200);
    }

    // skill bars inside this element
    $$(  ".bar", entry.target).forEach(bar => {
      if (!bar.dataset.animated) {
        bar.dataset.animated = "1";
        setTimeout(() => animateBar(bar), 300);
      }
    });

    // if the element itself is a bar
    if (entry.target.classList.contains("bar") && !entry.target.dataset.animated) {
      entry.target.dataset.animated = "1";
      animateBar(entry.target);
    }

    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* Also observe skill bars that may not be inside .reveal */
const allBars = $$(".bar");
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (!entry.target.dataset.animated) {
      entry.target.dataset.animated = "1";
      animateBar(entry.target);
    }
    barIO.unobserve(entry.target);
  });
}, { threshold: 0.3 });
allBars.forEach(b => barIO.observe(b));

/* ── Active nav link spy ────────────────────────── */
const sectionIds = [
  "about","featured","quickfacts","education","experience","projects","skills","contact"
];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

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

/* ── Footer year ────────────────────────────────── */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ── Smooth parallax ambient on scroll ──────────── */
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const ambient = $(".ambient");
    if (ambient) {
      ambient.style.transform = `translateY(${y * 0.06}px)`;
    }
    ticking = false;
  });
  ticking = true;
});
