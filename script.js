const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Reusable top-of-page advert slider.
const slides = [...document.querySelectorAll('.promo-slide')];
const dots = [...document.querySelectorAll('.promo-dots button')];
const slider = document.getElementById('promoSlider');
const prev = document.querySelector('.promo-prev');
const next = document.querySelector('.promo-next');
let currentSlide = 0;
let autoplay;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentSlide);
    dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
  });
}

function startAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => showSlide(currentSlide + 1), 6500);
}

if (slides.length) {
  prev?.addEventListener('click', () => { showSlide(currentSlide - 1); startAutoplay(); });
  next?.addEventListener('click', () => { showSlide(currentSlide + 1); startAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAutoplay(); }));
  slider?.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider?.addEventListener('mouseleave', startAutoplay);
  showSlide(0);
  startAutoplay();
}

// Native Netlify form submission without navigating away from the page.
const enrolForm = document.getElementById('enrolForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (enrolForm) {
  enrolForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formSuccess?.setAttribute('hidden', '');
    formError?.setAttribute('hidden', '');

    const submitButton = enrolForm.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || 'Send Enrolment Enquiry';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    try {
      const formData = new FormData(enrolForm);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
      enrolForm.reset();
      formSuccess?.removeAttribute('hidden');
      formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error(error);
      formError?.removeAttribute('hidden');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}
