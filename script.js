/* =========================================================
   Taqwa Education — shared site logic
   - Navbar, mobile nav & footer rendered from SITE_CONFIG
     (pages just contain empty placeholders)
   - Active page auto-detection
   - data-cfg config injection for page body content
   - Programme slider
   - Netlify form submission
   - Open Graph meta fallback
   ========================================================= */

(function () {
  'use strict';

  const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};

  /* ---------- Icons ---------- */
  const ICON_PHONE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  const ICON_OPEN = '<svg class="icon-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const ICON_CLOSE = '<svg class="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const DEFAULT_NAV = [
    { href: "/", label: "Home", key: "index" },
    { href: "/about", label: "About", key: "about" },
    { href: "/services", label: "Tuition", key: "services" },
    { href: "/activities/", label: "Activities", key: "activities" },
    { href: "/enrolment", label: "Enrolment", key: "enrolment" },
    { href: "/contact", label: "Contact", key: "contact" }
  ];

  /* ---------- Page key (for active nav highlighting) ---------- */
  function getPageKey() {
    const path = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    if (path === "/" || path === "/index.html") return "index";
    if (path.startsWith("/activities")) return "activities";
    const file = path.split("/").pop() || "index.html";
    return file.replace(/\.html$/, "") || "index";
  }

  /* ---------- Shared layout rendering ---------- */
  function renderSharedLayout() {
    const page = getPageKey();
    const items = cfg.navItems && cfg.navItems.length ? cfg.navItems : DEFAULT_NAV;
    const logo = cfg.logoUrl || "/assets/images/logo.png";
    const enrolHref = "/enrolment";
    const enrolLabel = cfg.enrolCta || "Enrol Now";

    const desktopLinks = items.map(item => {
      const active = item.key === page;
      return `<a href="${item.href}"${active ? ' class="active" aria-current="page"' : ""}>${item.label}</a>`;
    }).join("");

    const mobileLinks = items.map(item => {
      const active = item.key === page;
      return `<a href="${item.href}"${active ? ' class="active"' : ""}>${item.label}</a>`;
    }).join("");

    const headerAndMobileNav = `
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Taqwa Education — Home">
      <img src="${logo}" alt="Taqwa Education logo">
    </a>
    <nav class="nav" aria-label="Main navigation">${desktopLinks}</nav>
    <div class="nav-cta">
      <a class="nav-phone" href="tel:${cfg.phoneAdminRaw || ""}">${ICON_PHONE}<span>${cfg.phoneAdmin || ""}</span></a>
      <a class="btn btn-primary" href="${enrolHref}">${enrolLabel}</a>
      <button class="hamburger" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Toggle menu">${ICON_OPEN}${ICON_CLOSE}</button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
  ${mobileLinks}
  <a class="btn btn-primary btn-block" href="${enrolHref}">${enrolLabel}</a>
  <div class="mobile-contact">
    <a href="tel:${cfg.phoneAdminRaw || ""}">${ICON_PHONE}<span>${cfg.phoneAdmin || ""}</span></a>
  </div>
</nav>`;

    const footerHTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="${logo}" alt="Taqwa Education logo">
        <p class="tagline">${cfg.tagline || ""}</p>
        <p>Birmingham-based tuition centre operating from the Yardley Muslim Centre (YMC) Building.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>${items.map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join("")}</ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a class="phone-link" href="tel:${cfg.phoneAdminRaw || ""}">${cfg.phoneAdmin || ""} — Admin</a></li>
          <li><a class="phone-link" href="tel:${cfg.phoneCurriculumRaw || ""}">${cfg.phoneCurriculum || ""} — Curriculum</a></li>
          <li>${cfg.addressLine1 || ""}</li>
          <li>${cfg.addressLine2 || ""}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${cfg.year || new Date().getFullYear()} Taqwa Education. Operating from the YMC Building, Birmingham.</p>
      <p>${cfg.tagline || ""}</p>
    </div>
  </div>
</footer>`;

    /* Only fill EMPTY placeholders — pages that still have their old
       static header/footer markup are left untouched (graceful migration). */
    const headerEl = document.querySelector("header.site-header");
    if (headerEl && headerEl.children.length === 0) {
      headerEl.outerHTML = headerAndMobileNav;
    }

    const footerEl = document.querySelector("footer.site-footer");
    if (footerEl && footerEl.children.length === 0) {
      footerEl.outerHTML = footerHTML;
    }
  }

  /* ---------- Config injection for page body content ---------- */
  function applyConfig() {
    if (typeof SITE_CONFIG === 'undefined') return;

    document.querySelectorAll('[data-cfg]').forEach(el => {
      const key = el.getAttribute('data-cfg');
      if (SITE_CONFIG[key] !== undefined) el.textContent = SITE_CONFIG[key];
    });
    document.querySelectorAll('[data-cfg-phone]').forEach(el => {
      const key = el.getAttribute('data-cfg-phone');
      if (SITE_CONFIG[key] !== undefined) el.href = 'tel:' + SITE_CONFIG[key];
    });
    document.querySelectorAll('[data-cfg-href]').forEach(el => {
      const key = el.getAttribute('data-cfg-href');
      if (SITE_CONFIG[key] !== undefined) el.href = SITE_CONFIG[key];
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Open Graph meta fallback (YMC-style) ---------- */
  function ensureOpenGraph() {
    const descriptions = {
      index: "Taqwa Education — friendly, focused weekend tuition in English, Maths and Science at the Yardley Muslim Centre, Birmingham.",
      about: "About Taqwa Education — academic support with a community feel, from KS1 through to A Level.",
      services: "Weekend tuition in English, Maths and Science — KS1, KS2 SATs, KS3, GCSE and A Level.",
      activities: "Activities and classes at the YMC Building — karate classes, weekend tuition and community programmes.",
      enrolment: "Start your enrolment enquiry with Taqwa Education.",
      contact: "Get in touch with Taqwa Education — Birmingham tuition centre at the YMC Building."
    };

    const values = {
      "og:title": document.title,
      "og:description": descriptions[getPageKey()] || descriptions.index,
      "og:type": "website",
      "og:image": location.origin + (cfg.ogImage || "/assets/images/hero-thumb.webp"),
      "og:url": location.href
    };

    Object.entries(values).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }

  /* ---------- Slider ---------- */
  function initSlider() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    const total = slides.length;
    let index = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 6500;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.slider-dot'));

    function goTo(i, userTriggered) {
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      if (userTriggered) restartAutoplay();
    }
    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    let startX = 0, startY = 0, tracking = false;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? next() : prev();
      }
    });

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(index + 1, false), AUTOPLAY_MS);
    }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    startAutoplay();
  }

  /* ---------- Netlify form submission ---------- */
  function initForm() {
    const form = document.querySelector('form[data-netlify]');
    if (!form) return;

    const statusBox = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (statusBox) {
        statusBox.innerHTML = '';
        statusBox.className = 'form-status';
        statusBox.setAttribute('aria-live', 'polite');
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const formData = new FormData(form);
        const body = new URLSearchParams(formData).toString();

        const res = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body,
        });

        if (!res.ok) throw new Error('Bad response');

        form.style.display = 'none';
        if (statusBox) {
          statusBox.className = 'form-status success';
          statusBox.setAttribute('role', 'status');
          statusBox.innerHTML =
            '<h3>JazakAllahu khayran — your enquiry has been sent.</h3>' +
            '<p>The Taqwa Education team can now review your details and get back to you.</p>';
          statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.setAttribute('role', 'alert');
          statusBox.innerHTML =
            '<h3>We couldn\'t send that just now.</h3>' +
            '<p>Please try again, or call <a href="tel:' + (cfg.phoneAdminRaw || '') + '">' + (cfg.phoneAdmin || '') + '</a>.</p>';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || 'Submit';
        }
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderSharedLayout();  // nav + mobile nav + footer first
    applyConfig();         // then inject data-cfg values into page bodies
    initNavbar();          // needs #mobileNav to exist
    ensureOpenGraph();
    initSlider();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
