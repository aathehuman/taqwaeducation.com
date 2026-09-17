/* =========================================================
   Taqwa Education — site interactions
   - Mobile navigation
   - Active nav state
   - Programme slider (autoplay, controls, dots, swipe, keyboard)
   - Netlify form submission (AJAX) with inline status
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Slider ---------- */
  const slider = document.querySelector('[data-slider]');
  if (slider) {
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

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.slider-dot'));

    function goTo(i, userTriggered) {
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => {
        d.classList.toggle('active', di === index);
        d.setAttribute('aria-selected', di === index ? 'true' : 'false');
      });
      slides.forEach((s, si) => {
        s.setAttribute('aria-hidden', si === index ? 'false' : 'true');
      });
      if (userTriggered) restartAutoplay();
    }

    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    // Keyboard
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Touch swipe
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

    // Autoplay
    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(index + 1, false), AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Init
    slides.forEach((s, si) => s.setAttribute('aria-hidden', si === 0 ? 'false' : 'true'));
    startAutoplay();
  }

  /* ---------- Netlify form submission ---------- */
  const form = document.querySelector('form[data-netlify]');
  if (form) {
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
        
        // Post to the current page URL (Netlify requirement for AJAX forms)
        const res = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body,
        });
        
        if (!res.ok) throw new Error('Bad response');

        // Success
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
            '<p>Please try again, or call <a href="tel:07846252413">07846 252413</a>.</p>';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || 'Submit';
        }
      }
    });
  }
})();
