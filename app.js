/**
 * RISEONIC — Ultra-Premium Landing Page JavaScript
 * Handles: sticky header, carousel, modals, forms, lightbox, FAQ, gallery filter,
 *          video, scroll reveal, mobile nav, toast notifications.
 */

'use strict';

/* ─── Utility ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ─── Config ─── */
const PHONE = '+919878249224';
const WHATSAPP_BASE = `https://wa.me/${PHONE}`;

/* ─── Sticky Header ─── */
const siteHeader = $('#siteHeader');
let lastScrollY = 0;

function handleHeaderScroll() {
  const y = window.scrollY;
  if (y > 60) {
    siteHeader.classList.add('is-scrolled');
  } else {
    siteHeader.classList.remove('is-scrolled');
  }
  lastScrollY = y;
}

window.addEventListener('scroll', debounce(handleHeaderScroll, 10), { passive: true });
handleHeaderScroll();

/* ─── Mobile Nav Toggle ─── */
const navToggle = $('#navToggle');
const siteNav = $('#siteNav');

function closeNav() {
  siteNav.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openNav() {
  siteNav.classList.add('is-open');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.contains('is-open');
  isOpen ? closeNav() : openNav();
});

// Close nav on link click
$$('.site-nav a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close nav on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNav();
    closeModal();
    closeLightbox();
  }
});

/* ─── Hero Carousel ─── */
const carouselSlides = $$('.carousel-slide');
const carouselDots = $$('.carousel-dot');
let currentSlide = 0;
let carouselTimer = null;

function goToSlide(index) {
  carouselSlides[currentSlide].classList.remove('active');
  carouselDots[currentSlide]?.classList.remove('active');
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselSlides[currentSlide].classList.add('active');
  carouselDots[currentSlide]?.classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startCarousel() {
  if (carouselSlides.length > 1) {
    carouselTimer = setInterval(nextSlide, 5000);
  }
}

function resetCarousel() {
  clearInterval(carouselTimer);
  startCarousel();
}

carouselDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    resetCarousel();
  });
});

startCarousel();

/* ─── Configuration Tabs ─── */
const configTabs = $$('.config-tab');
const configPanels = $$('.config-panel');

configTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = `panel-${tab.dataset.config}`;
    const targetPanel = $(`#${targetId}`);

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

/* ─── Modal ─── */
const modalOverlay = $('#modalOverlay');
const modalClose = $('#modalClose');
let selectedUnitType = '';

function openModal(unitType = '', titleText = 'Request Project Brochure', buttonText = 'Request Brochure') {
  selectedUnitType = unitType;
  
  // Dynamically update modal headers and buttons
  const modalTitle = $('#modalTitle');
  const modalSubmitBtn = $('#modalSubmitBtn');
  const modalSub = $('#modalSub');
  
  if (modalTitle) modalTitle.textContent = titleText;
  if (modalSubmitBtn) modalSubmitBtn.textContent = buttonText;
  
  if (modalSub) {
    if (titleText.toLowerCase().includes('price') || titleText.toLowerCase().includes('pricing')) {
      modalSub.textContent = 'Enquire now to receive the complete price list and payment plans.';
    } else if (titleText.toLowerCase().includes('visit') || titleText.toLowerCase().includes('site')) {
      modalSub.textContent = 'Schedule your private site visit and experience RISEONIC firsthand.';
    } else if (titleText.toLowerCase().includes('brochure')) {
      modalSub.textContent = 'Receive the complete price list, floor plans & brochure instantly.';
    } else if (titleText.toLowerCase().includes('walkthrough')) {
      modalSub.textContent = 'Enquire now to receive the complete HD walkthrough video and virtual tour.';
    } else {
      modalSub.textContent = 'Receive full project details and layouts instantly.';
    }
  }

  if (unitType) {
    const select = $('#modalConfigSelect');
    if (select) {
      // Try to find matching option
      const opts = [...select.options];
      const match = opts.find(o => o.value && unitType.toLowerCase().includes(o.value.toLowerCase()));
      if (match) select.value = match.value;
    }
  }
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    $('#modalName')?.focus();
  });
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// All enquire triggers
$$('[data-action="enquire"]').forEach(el => {
  el.addEventListener('click', () => {
    const text = el.textContent.trim();
    if (text.toLowerCase().includes('price')) {
      openModal(el.dataset.unitType || '', 'Get Price Details', 'Get Price Details');
    } else {
      openModal(el.dataset.unitType || '', 'Request Project Brochure', 'Request Brochure');
    }
  });
});

// Header/hero/section CTAs
$('#heroSiteVisitBtn')?.addEventListener('click', () => openModal('', 'Book a Site Visit', 'Book Site Visit'));
$('#headerEnquireBtn')?.addEventListener('click', () => openModal('', 'Request Project Brochure', 'Request Brochure'));
$('#lifestyleEnquireBtn')?.addEventListener('click', () => openModal('Brochure Request', 'Request Project Brochure', 'Request Brochure'));
$('#mobileEnquireBtn')?.addEventListener('click', () => openModal('', 'Book a Site Visit', 'Book Site Visit'));

/* ─── Master Plan Modal ─── */
const masterplanModal = $('#masterplanModal');
const masterplanZoom = $('#masterplanZoom');
const masterplanClose = $('#masterplanClose');

masterplanZoom?.addEventListener('click', () => {
  masterplanModal.hidden = false;
  document.body.style.overflow = 'hidden';
});

masterplanClose?.addEventListener('click', () => {
  masterplanModal.hidden = true;
  document.body.style.overflow = '';
});

masterplanModal?.addEventListener('click', (e) => {
  if (e.target === masterplanModal) {
    masterplanModal.hidden = true;
    document.body.style.overflow = '';
  }
});

/* ─── Video Player Lead Form ─── */
const videoPlayBtn = $('#videoPlayBtn');

videoPlayBtn?.addEventListener('click', () => {
  openModal('Walkthrough Request', 'Request Walkthrough Video', 'Request Walkthrough');
});
videoPlayBtn?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openModal('Walkthrough Request', 'Request Walkthrough Video', 'Request Walkthrough');
  }
});

/* ─── Gallery Filter & Lightbox ─── */
const galleryFilterBtns = $$('.gallery-filter-btn');
const galleryItems = $$('.gallery-item');
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxCaption = $('#lightboxCaption');
const lightboxClose = $('#lightboxClose');
const lightboxOverlay = $('#lightboxOverlay');
const lightboxPrev = $('#lightboxPrev');
const lightboxNext = $('#lightboxNext');
let currentLightboxIndex = 0;
let visibleItems = [...galleryItems];

// Gallery Filter
galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryFilterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    visibleItems = [];

    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.hidden = false;
        visibleItems.push(item);
      } else {
        item.hidden = true;
      }
    });
  });
});

// Open Lightbox
function openLightbox(index) {
  const item = visibleItems[index];
  if (!item) return;
  const img = $('img', item);
  const cap = $('figcaption', item);
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = cap?.textContent || '';
  currentLightboxIndex = index;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function lightboxNavigate(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + visibleItems.length) % visibleItems.length;
  openLightbox(currentLightboxIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const vi = visibleItems.indexOf(item);
    if (vi !== -1) openLightbox(vi);
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => lightboxNavigate(-1));
lightboxNext?.addEventListener('click', () => lightboxNavigate(1));

document.addEventListener('keydown', (e) => {
  if (!lightbox.hidden) {
    if (e.key === 'ArrowLeft') lightboxNavigate(-1);
    if (e.key === 'ArrowRight') lightboxNavigate(1);
  }
});

// Touch swipe for lightbox
let touchStartX = 0;
lightbox?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lightbox?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) lightboxNavigate(dx < 0 ? 1 : -1);
});

/* ─── FAQ Accordion ─── */
const faqItems = $$('.faq-item');

faqItems.forEach(item => {
  const btn = $('.faq-question', item);
  const answer = $('.faq-answer', item);

  btn?.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    faqItems.forEach(other => {
      if (other !== item) {
        $('.faq-question', other)?.setAttribute('aria-expanded', 'false');
        $('.faq-answer', other)?.classList.remove('is-open');
      }
    });

    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.classList.toggle('is-open', !isOpen);
  });
});

/* ─── Toast Notification ─── */
const toast = $('#toast');
const toastMessage = $('#toastMessage');
let toastTimeout = null;

function showToast(message = "Thank you! We'll be in touch shortly.") {
  if (!toast) return;
  clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 4500);
}

/* ─── Form Submission ─── */
function handleFormSubmit(form) {
  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  const name = nameInput?.value.trim() || '';
  const phone = phoneInput?.value.trim() || '';

  // Basic validation
  if (!name) {
    nameInput?.focus();
    nameInput?.classList.add('input-error');
    setTimeout(() => nameInput?.classList.remove('input-error'), 2000);
    return;
  }

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    phoneInput?.focus();
    phoneInput?.classList.add('input-error');
    setTimeout(() => phoneInput?.classList.remove('input-error'), 2000);
    return;
  }

  // Disable button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  // Build WhatsApp message
  const configEl = form.querySelector('select[name="config"]');
  const config = configEl?.value || selectedUnitType || '';
  const budgetEl = form.querySelector('input[name="budget"]:checked');
  const budget = budgetEl?.value || '';
  const formId = form.id || 'lead';
  const msg = encodeURIComponent(
    `Hi! I'm interested in RISEONIC New Chandigarh.\n\nName: ${name}\nPhone: +91 ${phone}${config ? `\nInterested in: ${config}` : ''}${budget ? `\nBudget: ${budget}` : ''}\n\nPlease share details.`
  );

  // Send to WhatsApp
  window.open(`${WHATSAPP_BASE}?text=${msg}`, '_blank', 'noopener,noreferrer');

  // Reset
  form.reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
  }

  // Close modal if modal form
  if (form.id === 'modalForm') {
    setTimeout(closeModal, 400);
  }

  showToast('✓ Thank you! We\'ll be in touch within a few hours.');
}

// Store original button texts
$$('button[type="submit"]').forEach(btn => {
  btn.dataset.originalText = btn.textContent.trim();
});

// Attach form handlers
['heroForm', 'modalForm', 'contactForm'].forEach(id => {
  const form = $(`#${id}`);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form);
  });
});

// Input error style (inline)
const style = document.createElement('style');
style.textContent = `
  .input-error {
    border-color: #ff4444 !important;
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

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
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Animate Quick Fact Numbers ─── */
function animateCounter(el, target, duration = 1600) {
  const isFloat = target.toString().includes('.');
  const parts = target.toString().split('.');
  const decimals = isFloat ? parts[1].length : 0;
  const start = performance.now();
  const startVal = 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = startVal + (parseFloat(target) - startVal) * eased;
    el.textContent = isFloat ? val.toFixed(decimals) : Math.round(val);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const quickFactNums = $$('.quick-fact-num');
let factsAnimated = false;

const factsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !factsAnimated) {
      factsAnimated = true;
      quickFactNums.forEach(el => {
        const text = el.textContent.trim();
        const numMatch = text.match(/^[\d.]+/);
        if (numMatch) {
          const num = parseFloat(numMatch[0]);
          const suffix = text.replace(numMatch[0], '');
          animateCounter({ textContent: '' }, num, 1800); // temp
          // Real animation preserving suffix
          let startTime = null;
          function frame(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / 1800, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = num * eased;
            el.textContent = (num % 1 !== 0 ? val.toFixed(2) : Math.round(val)) + suffix;
            if (progress < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }
      });
      factsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

const quickFacts = $('#quick-facts');
if (quickFacts) factsObserver.observe(quickFacts);

/* ─── Active Nav Highlight on Scroll ─── */
const navLinks = $$('.site-nav a');
const sections = $$('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let active = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      active = section.id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
    const lastLink = navLinks[navLinks.length - 1];
    active = lastLink?.getAttribute('href')?.replace('#', '') || '';
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('nav-active', href === active);
  });
}

// Add active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `.site-nav a.nav-active { color: var(--gold-300) !important; }`;
document.head.appendChild(navStyle);

window.addEventListener('scroll', debounce(updateActiveNav, 50), { passive: true });

/* ─── Smooth Scroll Polyfill ─── */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Lazy Load Images (native + observer fallback) ─── */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading already applied via HTML attribute
} else {
  const lazyImages = $$('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ─── WhatsApp Float Button (hidden — using sticky bar instead on mobile) ─── */
// The mobile sticky bar handles WhatsApp on mobile.
// On desktop, the header button is always visible.

/* ─── Page Visibility / Pause Carousel ─── */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(carouselTimer);
  } else {
    startCarousel();
  }
});

/* ─── Configurations Gallery Slider ─── */
const galleries = $$('.config-gallery');
galleries.forEach(gallery => {
  const mainImg = gallery.querySelector('.gallery-main');
  const thumbs = gallery.querySelectorAll('.thumb-btn');
  let currentIndex = 0;
  let timer = null;

  function showImage(index) {
    if (index < 0 || index >= thumbs.length) return;
    currentIndex = index;
    const activeThumb = thumbs[index];
    const src = activeThumb.getAttribute('data-src');

    // Fade out transition
    mainImg.style.opacity = '0.3';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
    }, 150);

    thumbs.forEach(t => t.classList.remove('is-active'));
    activeThumb.classList.add('is-active');
  }

  function nextImage() {
    const nextIndex = (currentIndex + 1) % thumbs.length;
    showImage(nextIndex);
  }

  function startAutoPlay() {
    if (thumbs.length > 1) {
      timer = setInterval(nextImage, 5000);
    }
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      stopAutoPlay();
      showImage(idx);
      startAutoPlay();
    });
  });

  startAutoPlay();
});

/* ─── Init Complete Log ─── */
console.log(
  '%cRISEONIC%c | New Chandigarh\n%cTriCity\'s First Terrace Homes · G+35 Floors · Stadium Road PR-4',
  'color: #B8975A; font-size: 20px; font-weight: bold; font-family: serif;',
  'color: #888; font-size: 12px;',
  'color: #555; font-size: 11px;'
);
