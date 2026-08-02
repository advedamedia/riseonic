/**
 * RISEONIC — Ultra-Premium Landing Page JavaScript
 */

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const PHONE = '+919878249224';
const WHATSAPP_BASE = `https://wa.me/${PHONE}`;

/* ─── Sticky Header ─── */
const siteHeader = $('#siteHeader');

function handleHeaderScroll() {
  const y = window.scrollY;
  if (y > 40) {
    siteHeader.classList.add('is-scrolled');
  } else {
    siteHeader.classList.remove('is-scrolled');
  }
}

window.addEventListener('scroll', debounce(handleHeaderScroll, 10), { passive: true });
handleHeaderScroll();

/* ─── Mobile Nav Toggle ─── */
const navToggle = $('#navToggle');
const siteNav = $('#siteNav');

function closeNav() {
  siteNav?.classList.remove('is-open');
  navToggle?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openNav() {
  siteNav?.classList.add('is-open');
  navToggle?.classList.add('is-open');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.classList.contains('is-open');
  isOpen ? closeNav() : openNav();
});

$$('.site-nav a').forEach(link => link.addEventListener('click', closeNav));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNav();
    closeModal();
    closeVideoModal();
    closeMasterplanModal();
  }
});

/* ─── Hero Carousel ─── */
const carouselSlides = $$('.carousel-slide');
const carouselDots = $$('.carousel-dot');
let currentSlide = 0;
let carouselTimer = null;

function goToSlide(index) {
  if (!carouselSlides.length) return;
  carouselSlides[currentSlide].classList.remove('active');
  carouselDots[currentSlide]?.classList.remove('active');
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselSlides[currentSlide].classList.add('active');
  carouselDots[currentSlide]?.classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function startCarousel() { carouselTimer = setInterval(nextSlide, 5000); }

carouselDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    clearInterval(carouselTimer);
    startCarousel();
  });
});

if (carouselSlides.length) startCarousel();

/* ─── Configuration Tabs ─── */
const configTabs = $$('.config-tab');
const configPanels = $$('.config-panel');

configTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const configKey = tab.dataset.config;
    const targetPanel = $(`#panel-${configKey}`);

    configTabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });

    configPanels.forEach(p => {
      p.classList.remove('is-active');
      p.hidden = true;
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    if (targetPanel) {
      targetPanel.classList.add('is-active');
      targetPanel.hidden = false;
    }
  });
});

/* ─── Enquiry Modal ─── */
const modalOverlay = $('#modalOverlay');
const modalClose = $('#modalClose');
const modalTitle = $('#modalTitle');
const modalConfigSelect = $('#modalConfigSelect');

function openModal(unitType = '', customTitle = 'Schedule a VIP Site Visit') {
  if (modalTitle) modalTitle.textContent = customTitle;

  if (modalConfigSelect) {
    if (unitType) {
      const match = [...modalConfigSelect.options].find(o =>
        o.value && (unitType.toLowerCase().includes(o.value.toLowerCase()) || o.value.toLowerCase().includes(unitType.toLowerCase()))
      );
      if (match) modalConfigSelect.value = match.value;
    } else {
      modalConfigSelect.value = '';
    }
  }

  if (modalOverlay) {
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#modalName')?.focus(), 100);
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Triggers for Enquiry Modal
$('#heroSiteVisitBtn')?.addEventListener('click', () => openModal('', 'Schedule a VIP Site Visit'));
$('#headerEnquireBtn')?.addEventListener('click', () => openModal('', 'Enquire About RISEONIC'));
$('#mobileEnquireBtn')?.addEventListener('click', () => openModal('', 'Book a Site Visit'));

$$('[data-action="enquire"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const unitType = btn.dataset.unitType || '';
    openModal(unitType, 'Get Price & Configuration Details');
  });
});

/* ─── Video Lead Modal ─── */
const videoModal = $('#videoModal');
const videoModalClose = $('#videoModalClose');
const videoThumb = $('#videoThumb');
const videoPlayBtn = $('#videoPlayBtn');
const videoIframeWrapper = $('#videoIframeWrapper');
const youtubeIframe = $('#youtubeIframe');

function openVideoModal() {
  if (videoModal) {
    videoModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#videoLeadName')?.focus(), 100);
  }
}

function closeVideoModal() {
  if (videoModal) {
    videoModal.hidden = true;
    document.body.style.overflow = '';
  }
}

videoPlayBtn?.addEventListener('click', openVideoModal);
videoThumb?.addEventListener('click', openVideoModal);
videoModalClose?.addEventListener('click', closeVideoModal);
videoModal?.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideoModal();
});

function playVideo() {
  if (videoThumb) videoThumb.style.display = 'none';
  if (videoIframeWrapper) videoIframeWrapper.hidden = false;
  if (youtubeIframe) youtubeIframe.src = youtubeIframe.dataset.src;
}

$('#videoLeadForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#videoLeadName')?.value.trim();
  const phone = $('#videoLeadPhone')?.value.trim();

  if (!name || !phone || phone.replace(/\D/g, '').length < 10) {
    alert('Please enter a valid Name and 10-digit Mobile Number.');
    return;
  }

  // Route lead to WhatsApp
  const msg = encodeURIComponent(
    `Hi! I watched the RISEONIC Walkthrough Video.\n\nName: ${name}\nPhone: +91 ${phone}\n\nPlease share price list.`
  );
  window.open(`${WHATSAPP_BASE}?text=${msg}`, '_blank', 'noopener,noreferrer');

  closeVideoModal();
  playVideo();
  showToast('✓ Access granted! Enjoy the walkthrough video.');
});

/* ─── Master Plan Modal ─── */
const masterplanModal = $('#masterplanModal');
const masterplanZoom = $('#masterplanZoom');
const masterplanClose = $('#masterplanClose');

masterplanZoom?.addEventListener('click', () => {
  if (masterplanModal) {
    masterplanModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
});

function closeMasterplanModal() {
  if (masterplanModal) {
    masterplanModal.hidden = true;
    document.body.style.overflow = '';
  }
}

masterplanClose?.addEventListener('click', closeMasterplanModal);
masterplanModal?.addEventListener('click', (e) => {
  if (e.target === masterplanModal) closeMasterplanModal();
});

/* ─── FAQ Accordion ─── */
const faqItems = $$('.faq-item');

faqItems.forEach(item => {
  const btn = $('.faq-question', item);
  const answer = $('.faq-answer', item);

  btn?.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    faqItems.forEach(other => {
      if (other !== item) {
        $('.faq-question', other)?.setAttribute('aria-expanded', 'false');
        $('.faq-answer', other)?.classList.remove('is-open');
      }
    });

    btn.setAttribute('aria-expanded', String(!isOpen));
    answer?.classList.toggle('is-open', !isOpen);
  });
});

/* ─── Toast Notification ─── */
const toast = $('#toast');
const toastMessage = $('#toastMessage');
let toastTimeout = null;

function showToast(message = 'Thank you! We\'ll be in touch shortly.') {
  if (!toast) return;
  clearTimeout(toastTimeout);
  if (toastMessage) toastMessage.textContent = message;
  toast.classList.add('is-visible');
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 4000);
}

/* ─── Form Submission Handler ─── */
function handleFormSubmit(form) {
  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const configInput = form.querySelector('select[name="config"]');

  const name = nameInput?.value.trim() || '';
  const phone = phoneInput?.value.trim() || '';
  const config = configInput?.value || '';

  if (!name) {
    nameInput?.focus();
    return;
  }

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    phoneInput?.focus();
    return;
  }

  const msg = encodeURIComponent(
    `Hi! I'm interested in RISEONIC New Chandigarh.\n\nName: ${name}\nPhone: +91 ${phone}${config ? `\nConfiguration: ${config}` : ''}\n\nPlease share price & site visit details.`
  );

  window.open(`${WHATSAPP_BASE}?text=${msg}`, '_blank', 'noopener,noreferrer');

  form.reset();
  if (form.id === 'modalForm') closeModal();
  showToast('✓ Thank you! Our team will contact you shortly.');
}

['heroForm', 'modalForm', 'contactForm'].forEach(id => {
  const form = $(`#${id}`);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form);
  });
});

/* ─── Scroll Reveal ─── */
const revealEls = $$('.reveal-left, .reveal-right, .reveal-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Smooth Scroll ─── */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

console.log('RISEONIC Landing Page JS Initialized.');
