document.addEventListener('DOMContentLoaded', () => {
  // Modal overlay element
  const modalOverlay = document.getElementById('enquireModal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');

  // Open Modal function with dynamic title and button text
  window.openEnquireModal = function(unitType = '', title = 'Schedule VIP Site Visit', btnText = 'Book VIP Site Visit') {
    if (unitType) {
      const select = document.getElementById('modalUnitSelect');
      if (select) select.value = unitType;
    }
    if (modalTitle) modalTitle.innerText = title;
    if (modalSubmitBtn) modalSubmitBtn.innerText = btnText;

    if (modalOverlay) modalOverlay.classList.add('active');
  };

  // Close Modal
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // Overview Section Auto-Scrolling Multi-Image Carousel (Using Live Assets)
  const mainFeaturedImg = document.getElementById('mainFeaturedImg');
  const mainFeaturedBadge = document.getElementById('mainFeaturedBadge');
  const thumbCards = document.querySelectorAll('.thumb-card');
  const dots = document.querySelectorAll('.gallery-dots .dot');

  const galleryData = [
    {
      src: 'assets/live_riseonic-building.jpg',
      badge: 'G+35 Iconic Tower Elevation',
      title: 'TriCity Tallest Landmark Skyview'
    },
    {
      src: 'assets/live_1000321094.jpg',
      badge: 'Luxury Living Lounge & Foyer',
      title: 'Palatial Interior Living Spaces'
    },
    {
      src: 'assets/live_1000321095.jpg',
      badge: 'Panoramic Terrace Garden',
      title: 'Terraces That Whisper Tranquillity'
    },
    {
      src: 'assets/lady_terrace_clean.jpg',
      badge: 'TriCity 1st Sky Terrace',
      title: 'First-Ever Terrace Homes in TriCity'
    }
  ];

  let currentSlide = 0;
  let autoSlideTimer = null;

  function updateGallerySlide(index) {
    currentSlide = index;
    const slide = galleryData[index];
    if (!slide) return;

    if (mainFeaturedImg) {
      mainFeaturedImg.style.opacity = '0.3';
      setTimeout(() => {
        mainFeaturedImg.src = slide.src;
        mainFeaturedImg.style.opacity = '1';
      }, 150);
    }

    if (mainFeaturedBadge) {
      mainFeaturedBadge.innerText = slide.badge;
    }

    thumbCards.forEach((card, idx) => {
      if (idx === index) card.classList.add('active');
      else card.classList.remove('active');
    });

    dots.forEach((dot, idx) => {
      if (idx === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      let nextIndex = (currentSlide + 1) % galleryData.length;
      updateGallerySlide(nextIndex);
    }, 3500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  thumbCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      updateGallerySlide(idx);
      startAutoSlide();
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      updateGallerySlide(idx);
      startAutoSlide();
    });
  });

  startAutoSlide();

  // Floor Plan Tab Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(target);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Form Submission Handlers
  const handleFormSubmit = (e, formType) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'Processing...';
    submitBtn.disabled = true;

    const name = form.querySelector('[name="name"]')?.value || 'Valued Visitor';
    const phone = form.querySelector('[name="phone"]')?.value || '9878249224';
    const unit = form.querySelector('[name="unit"]')?.value || '3 BHK + Servant';

    setTimeout(() => {
      submitBtn.innerText = '✓ Details Received!';
      submitBtn.style.background = '#10b981';

      // WhatsApp Redirect Link (Phone 9878249224)
      const whatsappMsg = encodeURIComponent(`Hi RISEONIC Team, I am interested in ${unit}. Name: ${name}, Phone: ${phone}. Please share price list and site visit details.`);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=919878249224&text=${whatsappMsg}`;

      setTimeout(() => {
        alert(`Thank you ${name}! Your inquiry for RISEONIC (${unit}) has been registered. Our senior sales advisor will contact you at ${phone} shortly.`);
        window.open(whatsappUrl, '_blank');
        form.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        if (modalOverlay) modalOverlay.classList.remove('active');
      }, 600);
    }, 900);
  };

  const heroForm = document.getElementById('heroLeadForm');
  if (heroForm) heroForm.addEventListener('submit', (e) => handleFormSubmit(e, 'hero'));

  const modalForm = document.getElementById('modalLeadForm');
  if (modalForm) modalForm.addEventListener('submit', (e) => handleFormSubmit(e, 'modal'));

  // Live Social Proof Toast System
  const socialToast = document.getElementById('socialProofToast');
  const toastText = document.getElementById('toastText');

  const socialProofData = [
    { name: 'Dr. Anish K.', location: 'Chandigarh Sector 35', action: 'booked a VIP Site Visit' },
    { name: 'Rohan Sharma', location: 'Mohali', action: 'downloaded 4 BHK Floor Plan' },
    { name: 'Mrs. Simran Kaur', location: 'Panchkula', action: 'requested Price Breakdown' },
    { name: 'Vikramjit Singh', location: 'NRI Client (UK)', action: 'reserved 3350 Sq.Ft. Residence' }
  ];

  let toastIndex = 0;
  const showToast = () => {
    if (!socialToast || !toastText) return;
    const item = socialProofData[toastIndex];
    toastText.innerHTML = `<strong>${item.name}</strong> from ${item.location} just <em>${item.action}</em>`;
    socialToast.classList.add('show');

    setTimeout(() => {
      socialToast.classList.remove('show');
      toastIndex = (toastIndex + 1) % socialProofData.length;
    }, 5000);
  };

  setTimeout(() => {
    showToast();
    setInterval(showToast, 18000);
  }, 4000);
});
