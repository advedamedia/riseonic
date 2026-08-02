/**
 * RISEONIC New Chandigarh — app.js
 * Handles: sticky header, mobile nav, modals, forms,
 *          virtual tour gate, gallery lightbox, gallery filter,
 *          config tabs, FAQ accordion, social proof toast
 */

// ======================================================
// YOUTUBE VIDEO ID — Replace with actual video ID
// ======================================================
const YOUTUBE_VIDEO_ID = 'Pvy_JEBclIM'; // Replace with your actual YouTube video ID

// ======================================================
// DOM REFERENCES
// ======================================================
const siteHeader    = document.getElementById('siteHeader');
const navToggle     = document.getElementById('navToggle');
const siteNav       = document.getElementById('siteNav');

const enquireModal      = document.getElementById('enquireModal');
const enquireModalClose = document.getElementById('enquireModalClose');
const enquireModalTitle = document.getElementById('enquireModalTitle');
const enquireModalSub   = document.getElementById('enquireModalSubtitle');
const enquireModalForm  = document.getElementById('enquireModalForm');
const modalSubmitBtn    = document.getElementById('modalSubmitBtn');
const modalUnitSelect   = document.getElementById('modalUnit');

const tourGateModal     = document.getElementById('tourGateModal');
const tourGateModalClose = document.getElementById('tourGateModalClose');
const tourGateForm      = document.getElementById('tourGateForm');

const videoModal     = document.getElementById('videoModal');
const videoModalClose = document.getElementById('videoModalClose');
const videoIframe    = document.getElementById('videoIframe');

const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

const socialToast = document.getElementById('socialToast');
const toastText   = document.getElementById('toastText');
const toastDot    = document.getElementById('toastDot');

const heroForm    = document.getElementById('heroForm');
const contactForm = document.getElementById('contactForm');

// Mobile hello bar buttons
const helloCallBtn    = document.getElementById('helloCallBtn');
const helloInquiryBtn = document.getElementById('helloInquiryBtn');
const headerCallBtn   = document.getElementById('headerCallBtn');
const headerEnquireBtn = document.getElementById('headerEnquireBtn');
const requestCallbackBtn = document.getElementById('requestCallbackBtn');

// Virtual tour buttons
const virtualTourThumb = document.getElementById('virtualTourThumb');
const openVirtualTourBtn = document.getElementById('openVirtualTourBtn');

// Set YouTube thumbnail as tour background
if (virtualTourThumb && YOUTUBE_VIDEO_ID) {
  virtualTourThumb.style.backgroundImage = `url('https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg')`;
}

// ======================================================
// STICKY HEADER
// ======================================================
const handleScroll = () => {
  if (window.scrollY > 60) {
    siteHeader?.classList.add('is-scrolled');
  } else {
    siteHeader?.classList.remove('is-scrolled');
  }
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ======================================================
// MOBILE NAV TOGGLE
// ======================================================
navToggle?.addEventListener('click', () => {
  const isOpen = siteNav?.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav on link click
siteNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ======================================================
// MODAL OPEN / CLOSE UTILITIES
// ======================================================
function openModal(el) {
  el?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal(el) {
  el?.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
[enquireModal, tourGateModal, videoModal, galleryLightbox].forEach(m => {
  m?.addEventListener('click', e => {
    if (e.target === m) {
      if (m === videoModal) stopVideo();
      closeModal(m);
    }
  });
});

// Close buttons
enquireModalClose?.addEventListener('click', () => closeModal(enquireModal));
tourGateModalClose?.addEventListener('click', () => closeModal(tourGateModal));
videoModalClose?.addEventListener('click', () => { stopVideo(); closeModal(videoModal); });
lightboxClose?.addEventListener('click', () => closeModal(galleryLightbox));

// ESC key to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    [enquireModal, tourGateModal, galleryLightbox].forEach(closeModal);
    stopVideo();
    closeModal(videoModal);
  }
});

// ======================================================
// ENQUIRE MODAL — open with context
// ======================================================
function openEnquireModal(config = {}) {
  const title    = config.title    || 'Request Callback';
  const subtitle = config.subtitle || 'Share your details and our senior luxury consultant will reach out within a few hours.';
  const btnText  = config.btnText  || 'Request Callback';
  const unitVal  = config.unit     || '';

  if (enquireModalTitle) enquireModalTitle.textContent = title;
  if (enquireModalSub)   enquireModalSub.textContent   = subtitle;
  if (modalSubmitBtn)    modalSubmitBtn.textContent    = btnText;
  if (unitVal && modalUnitSelect) {
    for (let opt of modalUnitSelect.options) {
      if (opt.value === unitVal) { opt.selected = true; break; }
    }
  }
  openModal(enquireModal);
}

// Wire up all [data-action="enquire"] buttons
document.querySelectorAll('[data-action="enquire"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const unitType = btn.dataset.unitType || '';
    openEnquireModal({
      unit: unitType,
      title: unitType ? `Get Price Details — ${unitType}` : 'Request Callback',
      btnText: 'Get Price Details',
    });
  });
});

// Wire up [data-action="brochure"] buttons
document.querySelectorAll('[data-action="brochure"]').forEach(btn => {
  btn.addEventListener('click', () => {
    openEnquireModal({
      title: 'Download Official E-Brochure',
      subtitle: 'Share your details and we will send the complete RISEONIC e-brochure instantly on WhatsApp.',
      btnText: 'Download E-Brochure',
    });
  });
});

// Header + hello bar enquire buttons
headerEnquireBtn?.addEventListener('click', () => openEnquireModal({ title: 'Enquire Now' }));
helloInquiryBtn?.addEventListener('click', () => openEnquireModal({ title: 'Inquire Now' }));

// Request Callback specific button
requestCallbackBtn?.addEventListener('click', () => {
  openEnquireModal({
    title: 'Request Callback',
    subtitle: 'Our senior luxury property consultant will call you back within a few hours.',
    btnText: 'Request Callback',
  });
});

// ======================================================
// CALL BUTTON (opens prompt for number)
// ======================================================
function handleCallClick() {
  const num = prompt('Enter your phone number and we\'ll call you back:\n(Or call us directly: 9878249224)');
  if (num && num.trim().length >= 10) {
    alert(`Thank you! Our team will call you back at ${num.trim()} within a few hours. You can also reach us directly at 9878249224.`);
    // WhatsApp redirect for callback confirmation
    const msg = encodeURIComponent(`Hi RISEONIC Team, please call me back at ${num.trim()}. I'm interested in the project.`);
    window.open(`https://api.whatsapp.com/send?phone=919878249224&text=${msg}`, '_blank');
  } else if (num !== null) {
    // Direct call as fallback
    window.location.href = 'tel:9878249224';
  }
}
headerCallBtn?.addEventListener('click', handleCallClick);
helloCallBtn?.addEventListener('click', handleCallClick);

// ======================================================
// VIRTUAL TOUR — GATED (form → then video)
// ======================================================
function openTourGate() {
  openModal(tourGateModal);
}
virtualTourThumb?.addEventListener('click', openTourGate);
openVirtualTourBtn?.addEventListener('click', openTourGate);

tourGateForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('tourName')?.value || '';
  const phone = document.getElementById('tourPhone')?.value || '';
  if (!name || !phone) return;

  closeModal(tourGateModal);
  tourGateForm.reset();

  // Open video
  setTimeout(() => {
    openVideoModal();
  }, 200);
});

// ======================================================
// VIDEO MODAL
// ======================================================
function openVideoModal() {
  if (videoIframe) {
    videoIframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
  }
  openModal(videoModal);
}

function stopVideo() {
  if (videoIframe) {
    videoIframe.src = '';
  }
}

// ======================================================
// GALLERY LIGHTBOX
// ======================================================
window.openLightbox = function(src, caption) {
  if (lightboxImg)     lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = caption;
  openModal(galleryLightbox);
};

// ======================================================
// GALLERY FILTER TABS
// ======================================================
const filterBtns  = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.photo-gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.style.display = '';
        item.style.opacity = '1';
      } else {
        item.style.opacity = '0';
        item.style.display = 'none';
      }
    });
  });
});

// ======================================================
// CONFIG TABS (Floor Plans)
// ======================================================
const configTabs   = document.querySelectorAll('.config-tab');
const configPanels = document.querySelectorAll('.config-panel');

configTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.config;
    configTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    configPanels.forEach(p => { p.classList.remove('is-active'); p.hidden = true; });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(`panel-${target}`);
    if (panel) { panel.classList.add('is-active'); panel.hidden = false; }
  });
});

// ======================================================
// FAQ ACCORDION
// ======================================================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    faqItems.forEach(i => { i.classList.remove('is-open'); i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); });
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ======================================================
// FORM SUBMISSION HANDLER
// ======================================================
function handleFormSubmit(e, form, btnEl, successCallback) {
  e.preventDefault();
  const name  = form.querySelector('[name="name"]')?.value?.trim()   || 'Valued Visitor';
  const phone = form.querySelector('[name="phone"]')?.value?.trim()  || '';
  const unit  = form.querySelector('[name="unit"]')?.value?.trim()   || 'General Enquiry';

  if (!phone || phone.length < 10) {
    form.querySelector('[name="phone"]')?.focus();
    return;
  }

  const origText = btnEl?.textContent;
  if (btnEl) { btnEl.textContent = 'Sending…'; btnEl.disabled = true; }

  setTimeout(() => {
    if (btnEl) { btnEl.textContent = '✓ Received!'; btnEl.style.background = '#10b981'; }

    const waMsg = encodeURIComponent(`Hi RISEONIC Team,\nName: ${name}\nPhone: ${phone}\nInterested in: ${unit}\n\nPlease share price details and site visit information.`);
    const waUrl = `https://api.whatsapp.com/send?phone=919878249224&text=${waMsg}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
      if (btnEl) {
        btnEl.textContent = origText;
        btnEl.disabled = false;
        btnEl.style.background = '';
      }
      if (successCallback) successCallback();
    }, 700);
  }, 900);
}

// Hero form
heroForm?.addEventListener('submit', e => {
  handleFormSubmit(e, heroForm, heroForm.querySelector('[type="submit"]'));
});

// Enquire modal form
enquireModalForm?.addEventListener('submit', e => {
  handleFormSubmit(e, enquireModalForm, modalSubmitBtn, () => closeModal(enquireModal));
});

// Contact / Book Visit form
contactForm?.addEventListener('submit', e => {
  handleFormSubmit(e, contactForm, contactForm.querySelector('[type="submit"]'));
});

// ======================================================
// SOCIAL PROOF TOAST
// ======================================================
const toasts = [
  { dot: 'RS', text: '<strong>Rajinder S.</strong> from Chandigarh just <em>booked a site visit</em>' },
  { dot: 'PK', text: '<strong>Dr. Priya K.</strong> from Panchkula <em>requested price details</em>' },
  { dot: 'NRI', text: '<strong>Amarjeet K. (Canada)</strong> <em>downloaded the e-brochure</em>' },
  { dot: 'AK', text: '<strong>Amrik S.</strong> from Mohali <em>enquired about 4 BHK + Servant</em>' },
  { dot: 'SK', text: '<strong>Sumit K.</strong> from Sector 17 just <em>watched the virtual tour</em>' },
];
let toastIdx = 0;

function showToast() {
  if (!socialToast || !toastText || !toastDot) return;
  const t = toasts[toastIdx];
  toastDot.textContent  = t.dot;
  toastText.innerHTML   = t.text;
  socialToast.classList.add('show');
  setTimeout(() => socialToast.classList.remove('show'), 5000);
  toastIdx = (toastIdx + 1) % toasts.length;
}

setTimeout(() => {
  showToast();
  setInterval(showToast, 18000);
}, 5000);

// ======================================================
// INTERSECTION OBSERVER — Animate sections on scroll
// ======================================================
const animEls = document.querySelectorAll('.section, .quick-fact, .why-choose-card, .testimonial-card, .faq-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

animEls.forEach(el => {
  if (!el.closest('.hero')) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  }
});
