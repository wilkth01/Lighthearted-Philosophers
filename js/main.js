/**
 * Lighthearted Philosophers' Society
 * Main JavaScript File
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav__list');
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
  const yearSpan = document.getElementById('year');

  // Set current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Header scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile navigation toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('is-open');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    navList.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navToggle.setAttribute('aria-expanded', 'false');
          navList.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // Mobile dropdown handling
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav__link');

    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('is-open');
      }
    });
  });

  // Close mobile menu when window is resized to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (navList) navList.classList.remove('is-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      dropdownItems.forEach(item => item.classList.remove('is-open'));
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // Form validation (for contact page)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Basic validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const errorMsg = field.parentElement.querySelector('.error-message');

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          if (errorMsg) errorMsg.style.display = 'block';
        } else {
          field.classList.remove('error');
          if (errorMsg) errorMsg.style.display = 'none';
        }

        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a valid email address';
              errorMsg.style.display = 'block';
            }
          }
        }
      });

      if (isValid) {
        // In a real implementation, this would send to a server
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      }
    });
  }

  // Animate elements on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Accordion functionality (for FAQ or collapsible sections)
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', !isExpanded);
      content.hidden = isExpanded;
    });
  });

  // Tab functionality
  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    const tabs = tablist.querySelectorAll('[role="tab"]');
    const panels = tablist.parentElement.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // Deactivate all tabs
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        // Hide all panels
        panels.forEach(p => p.hidden = true);

        // Activate clicked tab
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');

        // Show associated panel
        const panelId = this.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) panel.hidden = false;
      });

      // Keyboard navigation
      tab.addEventListener('keydown', function(e) {
        let newIndex;

        switch (e.key) {
          case 'ArrowLeft':
            newIndex = index === 0 ? tabs.length - 1 : index - 1;
            break;
          case 'ArrowRight':
            newIndex = index === tabs.length - 1 ? 0 : index + 1;
            break;
          case 'Home':
            newIndex = 0;
            break;
          case 'End':
            newIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        e.preventDefault();
        tabs[newIndex].click();
        tabs[newIndex].focus();
      });
    });
  });

  // ============================================
  // EASTER EGGS
  // ============================================

  // 1. Konami Code: up up down down left right left right b a
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiIndex = 0;

  document.addEventListener('keydown', function(e) {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateSocratesDance();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateSocratesDance() {
    // Add dancing class to hero background
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
      heroBg.classList.add('socrates-dance');
    }

    // Create floating Socrates heads
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createFloatingSocrates();
      }, i * 150);
    }

    // Show achievement message
    showEasterEggModal(
      'Achievement Unlocked!',
      'You have discovered the ancient wisdom of the Konami Code. Socrates approves.'
    );

    // Remove dance class after animation
    setTimeout(() => {
      if (heroBg) heroBg.classList.remove('socrates-dance');
    }, 10000);
  }

  function createFloatingSocrates() {
    const socrates = document.createElement('img');
    socrates.src = 'images/socrates.png';
    socrates.className = 'floating-socrates';
    socrates.style.left = Math.random() * 100 + 'vw';
    socrates.style.animationDuration = (Math.random() * 3 + 2) + 's';
    socrates.style.opacity = Math.random() * 0.5 + 0.3;
    socrates.style.transform = `scale(${Math.random() * 0.5 + 0.3})`;
    document.body.appendChild(socrates);

    // Remove after animation
    setTimeout(() => {
      socrates.remove();
    }, 5000);
  }

  // 2. Type "heckle" anywhere to trigger snarky comment
  const heckleWord = 'heckle';
  let heckleBuffer = '';

  const heckleComments = [
    "Actually, I think you'll find that your premise is fundamentally flawed...",
    "Kant would be rolling in his grave right now.",
    "I'm not saying you're wrong, but have you considered that you might not be right?",
    "That's a very interesting point... for someone who hasn't read Wittgenstein.",
    "Your argument has more holes than Zeno's paradoxes.",
    "I've heard better reasoning from a first-year undergraduate.",
    "Descartes thought, therefore he was. I'm not sure what your excuse is.",
    "Socrates died for this?",
    "That's not even wrong.",
    "A truly Sisyphean effort at reasoning.",
    "Nietzsche called. He wants his nihilism back.",
    "Your logic is so circular, it's making me dizzy.",
    "Plato's cave has better illumination than this argument."
  ];

  document.addEventListener('keypress', function(e) {
    heckleBuffer += e.key.toLowerCase();

    // Keep buffer at manageable size
    if (heckleBuffer.length > 20) {
      heckleBuffer = heckleBuffer.slice(-20);
    }

    if (heckleBuffer.includes(heckleWord)) {
      const randomComment = heckleComments[Math.floor(Math.random() * heckleComments.length)];
      showEasterEggModal('🎭 Heckler Mode Activated!', randomComment);
      heckleBuffer = '';
    }
  });

  // 3. Geocities Mode - Transform to Web 1.0 style
  const geocitiesBtn = document.querySelector('.geocities-btn');
  let geocitiesMode = false;

  if (geocitiesBtn) {
    geocitiesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleGeocitiesMode();
    });
  }

  function toggleGeocitiesMode() {
    geocitiesMode = !geocitiesMode;
    document.body.classList.toggle('geocities-mode', geocitiesMode);

    if (geocitiesMode) {
      // Add visitor counter
      if (!document.querySelector('.geocities-counter')) {
        const counter = document.createElement('div');
        counter.className = 'geocities-counter';
        counter.innerHTML = `
          <img src="https://web.archive.org/web/20090830045122im_/http://www.geocities.com/SiliconValley/Haven/8331/ani_construction.gif" alt="Under Construction" onerror="this.style.display='none'">
          <p>You are visitor #${Math.floor(Math.random() * 9000) + 1000}</p>
          <p>Best viewed in Netscape Navigator 4.0</p>
          <marquee>Welcome to my Lighthearted Philosophers' Society Homepage!!!</marquee>
          <p><blink>~ * ~ Sign my Guestbook! ~ * ~</blink></p>
        `;
        document.body.insertBefore(counter, document.body.firstChild);
      }

      // Add cursor trail effect
      document.addEventListener('mousemove', geocitiesCursorTrail);

      showEasterEggModal(
        '~*~ WELCOME TO GEOCITIES ~*~',
        'You have activated Web 1.0 mode! Enjoy the nostalgia. Click the button again to return to the boring modern web.'
      );
    } else {
      // Remove geocities elements
      const counter = document.querySelector('.geocities-counter');
      if (counter) counter.remove();

      // Remove cursor trails
      document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
      document.removeEventListener('mousemove', geocitiesCursorTrail);
    }
  }

  function geocitiesCursorTrail(e) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    trail.innerHTML = '★';
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 1000);
  }

  // Shared modal function for easter eggs
  function showEasterEggModal(title, message) {
    // Remove existing modal if any
    const existing = document.querySelector('.easter-egg-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    modal.innerHTML = `
      <div class="easter-egg-modal__content">
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="btn btn--primary" onclick="this.closest('.easter-egg-modal').remove()">
          I accept this wisdom
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 10000);
  }

})();

// ==========================================================================
// Photo Carousel
// ==========================================================================
(function() {
  document.querySelectorAll('.carousel').forEach(function(carousel) {
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dotsWrap = carousel.querySelector('.carousel__dots');
    let index = 0;

    const dots = Array.from(slides).map(function(_, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      dot.addEventListener('click', function() { show(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function show(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      slides.forEach(function(slide, n) {
        slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
      dots.forEach(function(dot, n) {
        dot.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
    }

    carousel.querySelector('.carousel__btn--prev').addEventListener('click', function() { show(index - 1); });
    carousel.querySelector('.carousel__btn--next').addEventListener('click', function() { show(index + 1); });
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    show(0);
  });
})();
