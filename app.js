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
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Full Image Lightbox Modal for Gallery Grid
  const lightboxModal = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  window.openLightbox = function(src, captionText) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.innerText = captionText;
    if (lightboxModal) lightboxModal.classList.add('active');
  };

  window.closeLightbox = function() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  };

  // Gallery Filter Nav Switcher
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.photo-gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

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
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
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
