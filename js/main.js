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

})();
