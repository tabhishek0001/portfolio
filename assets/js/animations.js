// Animations
/* ============================================================
   ANIMATIONS — Scroll reveal, counter, typing, misc
   ============================================================ */

const Animations = (() => {

  /* ── SCROLL REVEAL ──────────────────────────────────────────── */
  let revealObserver = null;

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      revealObserver.observe(el);
    });
  }

  function refreshReveal() {
    if (!revealObserver) return;
    document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)').forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ── ANIMATED COUNTERS ──────────────────────────────────────── */
  function initCounters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        el.textContent = el.dataset.prefix + formatCount(target, el.dataset.count) + el.dataset.suffix;
      });
      return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, target);
      el.textContent = prefix + formatCount(current, el.dataset.count) + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  function formatCount(value, originalStr) {
    // Preserve decimal if original had one (e.g. 3.8)
    if (originalStr && originalStr.includes('.')) {
      return value.toFixed(1);
    }
    return Math.round(value).toLocaleString();
  }

  /* ── TYPING ANIMATION ───────────────────────────────────────── */
  function initTyping(texts, elementId) {
    const el = document.getElementById(elementId);
    if (!el || !texts || texts.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = texts[0];
      return;
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseCounter = 0;

    function type() {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        el.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
          isDeleting = true;
          pauseCounter = 0;
          setTimeout(type, 1800); // pause at end
          return;
        }
        setTimeout(type, 75);
      } else {
        el.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }

    type();
  }

  /* ── STICKY NAVBAR + ACTIVE LINK ────────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Sticky scroll class
          if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }

          // Back to top
          const btn = document.getElementById('back-to-top');
          if (btn) {
            if (window.scrollY > 500) btn.classList.add('visible');
            else btn.classList.remove('visible');
          }

          // Active nav link
          updateActiveNavLink();

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ── MOBILE MENU ────────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ── BACK TO TOP ────────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── SMOOTH SCROLL (for anchor links) ───────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  }

  /* ── PRELOADER ──────────────────────────────────────────────── */
  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 500);
    }, 600);
  }

  function showError(message) {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.remove();

    const errorEl = document.getElementById('error-state');
    if (errorEl) {
      errorEl.classList.remove('hidden');
      const msgEl = errorEl.querySelector('.error-msg');
      if (msgEl && message) msgEl.textContent = message;
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.classList.add('hidden');
  }

  return {
    initScrollReveal,
    refreshReveal,
    initCounters,
    initTyping,
    initNavbar,
    initMobileMenu,
    initBackToTop,
    initSmoothScroll,
    hidePreloader,
    showError
  };
})();