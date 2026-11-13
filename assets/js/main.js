/**
 * QUICK EXPRESS BUSINESS SOLUTIONS - MAIN JAVASCRIPT
 * Dynamic interactions, Swiper sliders, Calculator, WhatsApp widget & form logic
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Sticky Navbar on Scroll
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Initialize AOS (Animate on Scroll) if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }

  // 3. Hero Background Slider
  const heroSlider = document.querySelector('.hero-swiper');
  if (heroSlider) {
    const slides = Array.from(heroSlider.querySelectorAll('.swiper-slide'));
    const prevBtn = heroSlider.querySelector('.hero-prev');
    const nextBtn = heroSlider.querySelector('.hero-next');
    const pagination = heroSlider.querySelector('.hero-pagination');

    if (slides.length > 0) {
      let activeIndex = 0;

      const setActiveSlide = function (index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('swiper-slide-active', slideIndex === activeIndex);
        });

        if (pagination) {
          const dots = pagination.querySelectorAll('span');
          dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
          });
        }
      };

      if (pagination) {
        slides.forEach(function () {
          const dot = document.createElement('span');
          dot.setAttribute('aria-label', 'Go to slide');
          pagination.appendChild(dot);
        });
      }

      setActiveSlide(0);

      prevBtn && prevBtn.addEventListener('click', function () {
        setActiveSlide(activeIndex - 1);
      });

      nextBtn && nextBtn.addEventListener('click', function () {
        setActiveSlide(activeIndex + 1);
      });

      if (pagination) {
        const dots = pagination.querySelectorAll('span');
        dots.forEach(function (dot, dotIndex) {
          dot.addEventListener('click', function () {
            setActiveSlide(dotIndex);
          });
        });
      }

      setInterval(function () {
        setActiveSlide(activeIndex + 1);
      }, 6000);
    }
  }

  // 4. Clients Logo Continuous Marquee Slider
  if (document.querySelector('.clients-swiper')) {
    new Swiper('.clients-swiper', {
      loop: true,
      slidesPerView: 2,
      spaceBetween: 20,
      speed: 3000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false
      },
      breakpoints: {
        576: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 24 },
        992: { slidesPerView: 5, spaceBetween: 24 },
        1200: { slidesPerView: 6, spaceBetween: 30 }
      }
    });
  }

  // 5. Testimonials Swiper Slider
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 700,
      grabCursor: true,
      observer: true,
      observeParents: true,
      allowTouchMove: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.testi-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.testi-next',
        prevEl: '.testi-prev'
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 30 }
      }
    });
  }

  // 6. Number Counter Animation for Stats (IntersectionObserver)
  const counterElements = document.querySelectorAll('.counter-val');
  if (counterElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              const duration = 1800;
              const stepTime = 25;
              const totalSteps = duration / stepTime;
              const increment = target / totalSteps;
              let current = 0;

              const timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                  counter.innerText = target.toLocaleString();
                  clearInterval(timer);
                } else {
                  counter.innerText = Math.floor(current).toLocaleString();
                }
              }, stepTime);
            }
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      // Fallback
      counterElements.forEach(function (counter) {
        const target = counter.getAttribute('data-target');
        if (target) counter.innerText = parseInt(target, 10).toLocaleString();
      });
    }
  }

  // 7. WhatsApp Floating Chat Widget Logic
  const waToggleBtn = document.getElementById('waToggleBtn');
  const waChatWindow = document.getElementById('waChatWindow');
  const waCloseBtn = document.getElementById('waCloseBtn');
  const waStartChatBtn = document.getElementById('waStartChatBtn');
  const waCustomInput = document.getElementById('waCustomMsg');
  const defaultWaPhone = '971504842101'; // Corporate WhatsApp Line

  if (waToggleBtn && waChatWindow) {
    waToggleBtn.addEventListener('click', function () {
      waChatWindow.classList.toggle('active');
    });

    if (waCloseBtn) {
      waCloseBtn.addEventListener('click', function () {
        waChatWindow.classList.remove('active');
      });
    }

    // Quick option chips
    const waChips = document.querySelectorAll('.wa-opt-chip');
    waChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const query = this.getAttribute('data-query') || this.innerText;
        openWhatsApp(query);
      });
    });

    if (waStartChatBtn) {
      waStartChatBtn.addEventListener('click', function () {
        const customText = waCustomInput ? waCustomInput.value.trim() : '';
        const msg = customText || 'Hello Quick Express, I would like to inquire about business setup in Dubai.';
        openWhatsApp(msg);
      });
    }
  }

  function openWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${defaultWaPhone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  }

  // 8. Dynamic Business Setup Cost Calculator
  const calcJurisdictionBtns = document.querySelectorAll('[data-calc-jurisdiction]');
  const calcVisaSelect = document.getElementById('calcVisaCount');
  const calcOfficeSelect = document.getElementById('calcOfficeType');
  const calcPriceAed = document.getElementById('calcResultAed');
  const calcPriceUsd = document.getElementById('calcResultUsd');
  const calcSummaryText = document.getElementById('calcSummaryText');

  let selectedJurisdiction = 'freezone'; // default

  if (calcJurisdictionBtns.length > 0 && calcPriceAed) {
    calcJurisdictionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        calcJurisdictionBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedJurisdiction = this.getAttribute('data-calc-jurisdiction');
        updateCalculation();
      });
    });

    if (calcVisaSelect) calcVisaSelect.addEventListener('change', updateCalculation);
    if (calcOfficeSelect) calcOfficeSelect.addEventListener('change', updateCalculation);

    function updateCalculation() {
      let baseCost = 0;
      let visaCost = 0;
      let officeCost = 0;
      let jurisdictionLabel = 'Dubai Free Zone';

      if (selectedJurisdiction === 'freezone') {
        baseCost = 12500;
        jurisdictionLabel = 'Dubai Free Zone License';
      } else if (selectedJurisdiction === 'mainland') {
        baseCost = 18500;
        jurisdictionLabel = 'UAE Mainland (DED) License';
      } else if (selectedJurisdiction === 'offshore') {
        baseCost = 9800;
        jurisdictionLabel = 'UAE Offshore Company (RAK ICC / JAFZA)';
      }

      const visaCount = parseInt(calcVisaSelect ? calcVisaSelect.value : 1, 10);
      visaCost = visaCount * 3200; // estimated visa fees including Emirates ID & medical

      const officeType = calcOfficeSelect ? calcOfficeSelect.value : 'smart-desk';
      if (officeType === 'smart-desk') {
        officeCost = 0; // included in package
      } else if (officeType === 'flexi-desk') {
        officeCost = 3500;
      } else if (officeType === 'physical') {
        officeCost = 15000;
      }

      const totalAed = baseCost + visaCost + officeCost;
      const totalUsd = Math.round(totalAed / 3.6725);

      calcPriceAed.innerText = 'AED ' + totalAed.toLocaleString();
      if (calcPriceUsd) {
        calcPriceUsd.innerText = `≈ $${totalUsd.toLocaleString()} USD (Estimated Total)`;
      }
      if (calcSummaryText) {
        calcSummaryText.innerText = `${jurisdictionLabel} with ${visaCount} visa(s) and selected workspace allocation.`;
      }
    }

    // Initial run
    updateCalculation();
  }

  // 9. Generic Form Handling with feedback modal / alert
  const contactForms = document.querySelectorAll('.qe-ajax-form');
  contactForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        // Show success modal or alert
        const consultationModal = bootstrap.Modal.getInstance(document.getElementById('consultationModal'));
        if (consultationModal) {
          consultationModal.hide();
        }

        const successModalEl = document.getElementById('successModal');
        if (successModalEl) {
          const successModal = new bootstrap.Modal(successModalEl);
          successModal.show();
        } else {
          alert('Thank you! Your inquiry has been received. Our senior business consultant will contact you within 15 minutes.');
        }

        form.reset();
      }, 1200);
    });
  });

  // 10. Service Filter Buttons (on services.html)
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.filterable-service-item');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
        filterBtns.forEach(b => b.classList.add('btn-outline-primary'));
        this.classList.add('active', 'btn-primary');
        this.classList.remove('btn-outline-primary');

        const filter = this.getAttribute('data-filter');

        serviceCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            card.classList.add('animate__animated', 'animate__fadeIn');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 11. Modal Prefill with Package or Service
  const offerModalTriggers = document.querySelectorAll('[data-bs-toggle="modal"][data-package-title]');
  offerModalTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const packageTitle = this.getAttribute('data-package-title');
      const serviceSelect = document.getElementById('modalServiceSelect');
      if (serviceSelect && packageTitle) {
        let found = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(packageTitle.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const notesField = document.getElementById('modalNotes');
          if (notesField) notesField.value = 'Interested in package: ' + packageTitle;
        }
      }
    });
  });

  // 12. Back To Top Floating Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
