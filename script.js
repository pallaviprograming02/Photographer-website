/* script.js - client side */
(() => {
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // --- State ---
  let currentPhotos = [];
  let currentPhotoIndex = 0;

  // --- Mobile Menu ---
  const menuBtn = qs('#menuBtn');
  const mobileNav = qs('#mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
    });

    qsa('#mobileNav a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // --- Gallery Logic ---
  const galleryGrid = qs('#galleryGrid');

  const renderGallery = (filter = 'All') => {
    if (!galleryGrid) return;

    const allPhotos = DataManager.getPhotos();

    // Filter
    if (filter === 'All') {
      currentPhotos = allPhotos;
    } else {
      currentPhotos = allPhotos.filter(p => p.category === filter);
    }

    galleryGrid.innerHTML = '';

    if (currentPhotos.length === 0) {
      galleryGrid.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center;">No photos found in this category.</p>';
      return;
    }

    currentPhotos.forEach((photo, index) => {
      const div = document.createElement('div');
      // Added 'card' class for styling
      div.className = 'gallery-item card';

      // Interaction: Open Lightbox
      div.addEventListener('click', (e) => {
        openLightbox(index);
      });

      // For keyboard access
      div.tabIndex = 0;
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = 'lazy';

      div.appendChild(img);
      galleryGrid.appendChild(div);
    });
  };

  // Filters
  const filterBtns = qsa('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });

  // --- Lightbox ---
  const lightbox = qs('#lightbox');
  const lbImage = qs('#lbImage');
  const lbCaption = qs('#lbCaption');
  const lbClose = qs('#lbClose');
  const lbNext = qs('#lbNext');
  const lbPrev = qs('#lbPrev');

  const openLightbox = (index) => {
    if (!lightbox) return;
    currentPhotoIndex = index;
    updateLightbox();
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.focus();
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const updateLightbox = () => {
    if (currentPhotos.length === 0) return;
    const photo = currentPhotos[currentPhotoIndex];
    lbImage.src = photo.full || photo.src;
    lbImage.alt = photo.alt;
    lbCaption.textContent = photo.caption;
  };

  const nextPhoto = () => {
    if (currentPhotos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    updateLightbox();
  };

  const prevPhoto = () => {
    if (currentPhotos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
  };

  if (lightbox) {
    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      const isHidden = lightbox.getAttribute('aria-hidden') === 'true';
      if (!isHidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      }
    });
  }

  // --- Booking Modal & Forms ---
  const bookingModal = qs('#bookingModal');
  const openBookingBtn = qs('#openBooking');
  const closeBookingBtn = qs('#closeBooking');
  const bookingCancelBtn = qs('#bookingCancel');

  // Open Booking Modal
  const openBooking = (serviceName) => {
    if (bookingModal) {
      bookingModal.setAttribute('aria-hidden', 'false');
      if (serviceName) {
        const select = qs('#bservice');
        if (select) select.value = serviceName;
      }
      const firstInput = qs('#bname');
      if (firstInput) firstInput.focus();
    }
  };

  const closeBooking = () => {
    if (bookingModal) bookingModal.setAttribute('aria-hidden', 'true');
  };

  if (openBookingBtn) openBookingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openBooking();
  });
  if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);
  if (bookingCancelBtn) bookingCancelBtn.addEventListener('click', closeBooking);

  // Bind "Book" buttons in Services
  qsa('button[data-action="book"]').forEach(btn => {
    btn.addEventListener('click', () => {
      openBooking(btn.dataset.service);
    });
  });

  // Contact Form (WhatsApp Redirect)
  const contactForm = qs('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const msg = formData.get('message');

      if (!name) {
        alert('Please enter your name');
        return;
      }

      const text = `Hi, I am ${name}. ${msg}`;
      const url = `https://wa.me/919763098110?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      qs('#contactStatus').textContent = "Opening WhatsApp...";
    });
  }

  // Generator function for bilingual message
  const generateBookingMessage = (order) => {
    // English Part
    const english = `Hi ${order.name} 😊\nThank you for booking your ${order.service} photography session with YourName.\n\n📸 Booking Details:\n• Date: ${order.date}\n• Package: ${order.service}\n• Phone: ${order.phone}\n• Notes: ${order.notes || 'None'}\n\nPlease reach 10–15 minutes early.\nLooking forward to capturing your beautiful moments ✨`;

    // Marathi Part
    const marathi = `नमस्कार ${order.name} 😊\nYourName फोटोग्राफी स्टुडिओ निवडल्याबद्दल धन्यवाद.\n\n📸 बुकिंग तपशील:\n• तारीख: ${order.date}\n• पॅकेज: ${order.service}\n• फोन: ${order.phone}\n\nकृपया 10-15 मिनिटे लवकर पोहचा.\nतुमचे सुंदर क्षण टिपण्यासाठी आम्ही उत्सुक आहोत ✨`;

    return `${english}\n\n----------------------------\n\n${marathi}`;
  };

  // Booking Form (Submit to DataManager + WhatsApp)
  const bookingForm = qs('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);

      if (!formData.get('name') || !formData.get('email') || !formData.get('phone')) {
        qs('#bookingStatus').textContent = "Please fill in all required fields.";
        qs('#bookingStatus').style.color = "red";
        return;
      }

      const order = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        notes: formData.get('notes'),
      };

      // Save to LocalStorage
      DataManager.addOrder(order);

      // Give feedback
      qs('#bookingStatus').textContent = "Booking saved! Redirecting to WhatsApp...";
      qs('#bookingStatus').style.color = "inherit";

      setTimeout(() => {
        const text = generateBookingMessage(order);
        const url = `https://wa.me/919763098110?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        closeBooking();
        bookingForm.reset();
        qs('#bookingStatus').textContent = "";
      }, 1000);
    });
  }

  // --- Initialize ---
  renderGallery();

  // Smooth Scroll for "View Gallery"
  qs('#viewGalleryBtn')?.addEventListener('click', () => {
    qs('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Update Year
  const yearSpan = qs('#year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

})();