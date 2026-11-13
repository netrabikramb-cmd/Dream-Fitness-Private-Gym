/**
 * Dreams Fitness Studio Private Gym - Main Script
 * Calm & Cool Luxury Interactive Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initServicesFilter();
  initGallery();
  initCalculator();
  initConsultationModal();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.innerHTML = isExpanded 
        ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (toggleBtn) {
          toggleBtn.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        }
      });
    });
  }

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => l.classList.remove('active'));
        if (targetLink) targetLink.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. SERVICES FILTERING
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.services-filters .filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. GALLERY FILTERING & INTERACTIVE LIGHTBOX
   ========================================================================== */
let galleryItemsData = [];
let currentLightboxIndex = 0;

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.gallery-tabs .filter-btn');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-nav.prev');
  const nextBtn = document.querySelector('.lightbox-nav.next');

  // Populate gallery data
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay-title') ? item.querySelector('.gallery-overlay-title').innerText : '';
    const desc = item.querySelector('.gallery-overlay-sub') ? item.querySelector('.gallery-overlay-sub').innerText : '';
    
    galleryItemsData.push({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      title: title,
      desc: desc,
      category: item.getAttribute('data-category') || 'all',
      element: item
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = galleryItemsData[currentLightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxTitle.innerText = item.title;
    lightboxDesc.innerText = item.desc;
  }

  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItemsData.length;
    updateLightbox();
  }

  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItemsData.length) % galleryItemsData.length;
    updateLightbox();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   4. FITNESS & CALORIE / MACRO CALCULATOR
   ========================================================================== */
function initCalculator() {
  const form = document.getElementById('fitnessCalculatorForm');
  if (!form) return;

  const calDisplay = document.getElementById('calcCalories');
  const proteinDisplay = document.getElementById('calcProtein');
  const carbsDisplay = document.getElementById('calcCarbs');
  const fatsDisplay = document.getElementById('calcFats');
  const bmiDisplay = document.getElementById('calcBmi');
  const bmiCategory = document.getElementById('calcBmiCategory');
  const applyBtn = document.getElementById('btnApplyToConsultation');

  function calculate() {
    const age = parseFloat(document.getElementById('calcAge').value) || 28;
    const gender = document.getElementById('calcGender').value;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 72; // kg
    const height = parseFloat(document.getElementById('calcHeight').value) || 175; // cm
    const activity = parseFloat(document.getElementById('calcActivity').value) || 1.375;
    const goal = document.getElementById('calcGoal').value;

    // Mifflin-St Jeor BMR
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = Math.round(bmr * activity);
    let targetCalories = tdee;

    // Goal adjustments
    if (goal === 'fat_loss') {
      targetCalories = Math.round(tdee - 450);
    } else if (goal === 'muscle_gain') {
      targetCalories = Math.round(tdee + 350);
    } else if (goal === 'aggressive_cut') {
      targetCalories = Math.round(tdee * 0.78);
    }

    // Macros distribution
    // Protein: 2.1g per kg bodyweight
    const proteinGrams = Math.round(weight * 2.1);
    const proteinCalories = proteinGrams * 4;

    // Fats: 25% of target calories
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: remaining calories
    const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
    const carbGrams = Math.round(remainingCalories / 4);

    // BMI calculation
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    let category = 'Normal Weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obesity Class';

    // Animate / Render
    animateValue(calDisplay, targetCalories);
    proteinDisplay.innerText = `${proteinGrams}g`;
    carbsDisplay.innerText = `${carbGrams}g`;
    fatsDisplay.innerText = `${fatGrams}g`;
    bmiDisplay.innerText = `${bmi}`;
    bmiCategory.innerText = `(${category})`;
  }

  form.addEventListener('input', calculate);
  form.addEventListener('change', calculate);
  calculate(); // Initial calculation

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const goalSelect = document.getElementById('calcGoal');
      const goalText = goalSelect.options[goalSelect.selectedIndex].text;
      const calories = calDisplay.innerText;
      const weight = document.getElementById('calcWeight').value;

      openConsultationModalWithData({
        goal: goalText,
        details: `Calculated Target: ${calories} kcal/day for ${weight}kg weight goal.`
      });
    });
  }
}

function animateValue(element, end) {
  if (!element) return;
  element.innerText = `${end} kcal`;
}

/* ==========================================================================
   5. CONSULTATION MODAL & WHATSAPP INTEGRATION
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openButtons = document.querySelectorAll('[data-open-modal="consultation"]');
  const form = document.getElementById('consultationBookingForm');
  const successState = document.getElementById('modalSuccessState');
  const waDirectBtn = document.getElementById('modalWaDirectBtn');
  const callDirectBtn = document.getElementById('modalCallDirectBtn');

  function openModal(serviceName = '') {
    if (!modal) return;
    if (form) {
      form.style.display = 'flex';
      form.reset();
    }
    if (successState) successState.classList.remove('active');

    if (serviceName) {
      const serviceSelect = document.getElementById('bookingService');
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const service = document.getElementById('bookingService').value;
      const timeSlot = document.getElementById('bookingTimeSlot').value;
      const goal = document.getElementById('bookingGoal').value.trim();

      // Format WhatsApp message
      const message = `Hello Dreams Fitness Studio! 🏋️‍♂️%0A%0AMy name is *${encodeURIComponent(name)}*.%0APhone: *${encodeURIComponent(phone)}*%0AI would like to book a private consultation:%0A- Service: *${encodeURIComponent(service)}*%0A- Preferred Slot: *${encodeURIComponent(timeSlot)}*%0A- Primary Goal: *${encodeURIComponent(goal || 'Body Transformation')}*%0A%0APlease let me know your available slots at Prasuti Griha Marga, Kathmandu!`;

      const waUrl = `https://wa.me/9779851022697?text=${message}`;

      if (waDirectBtn) {
        waDirectBtn.setAttribute('href', waUrl);
      }
      if (callDirectBtn) {
        callDirectBtn.setAttribute('href', 'tel:9851022697');
      }

      // Hide form & show confirmation state
      form.style.display = 'none';
      if (successState) {
        successState.classList.add('active');
      }

      // Store in localStorage
      try {
        const bookings = JSON.parse(localStorage.getItem('dfs_bookings') || '[]');
        bookings.push({
          name, phone, service, timeSlot, goal, date: new Date().toISOString()
        });
        localStorage.setItem('dfs_bookings', JSON.stringify(bookings));
      } catch (err) {
        console.warn('Storage disabled', err);
      }
    });
  }
}

window.openConsultationModalWithData = function(data) {
  const modal = document.getElementById('consultationModal');
  if (!modal) return;
  const form = document.getElementById('consultationBookingForm');
  const successState = document.getElementById('modalSuccessState');
  if (form) form.style.display = 'flex';
  if (successState) successState.classList.remove('active');

  if (data.details) {
    const goalField = document.getElementById('bookingGoal');
    if (goalField) {
      goalField.value = `${data.goal}: ${data.details}`;
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

/* ==========================================================================
   6. SMOOTH SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
