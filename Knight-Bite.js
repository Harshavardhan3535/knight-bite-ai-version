/* ============================================================
   KNIGHT BITE — Combined Script
   Works across: Knight-Bite.html, about.html, menu.html, Franchise.html
   ============================================================ */

/* ── 1. DYNAMIC YEAR ────────────────────────────────────────
   Automatically updates copyright year on all pages.
   Targets both #year and #year2 elements.
   ---------------------------------------------------------- */
function setYear() {
  const currentYear = new Date().getFullYear();
  const yearEls = document.querySelectorAll('#year, #year2');
  yearEls.forEach(el => el.textContent = currentYear);
}

/* ── 2. HAMBURGER MENU ──────────────────────────────────────
   Toggles mobile nav open/close.
   Also closes menu when user clicks a nav link.
   Also closes menu when user clicks outside of it.
   ---------------------------------------------------------- */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (!hamburger || !mobileNav) return; // safety check

  // Toggle on hamburger click
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when a nav link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── 3. EMAIL SUBSCRIBE ─────────────────────────────────────
   Validates email input in the footer subscribe form.
   Shows success message on valid submission.
   Only runs on pages that have #emailInput.
   ---------------------------------------------------------- */
function initEmailSubscribe() {
  const emailInput = document.getElementById('emailInput');
  const subscribeMsg = document.getElementById('subscribeMsg');
  const subscribeBtn = document.getElementById('subscribeBtn');

  if (!emailInput) return; // only runs on pages with this element

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubscribe() {
    const value = emailInput.value.trim();

    if (!emailRegex.test(value)) {
      emailInput.style.borderColor = '#ef4444';
      emailInput.focus();
      return;
    }

    // Valid — show success
    emailInput.style.borderColor = '#4ade80';
    if (subscribeMsg) {
      subscribeMsg.classList.add('show');
      setTimeout(() => {
        subscribeMsg.classList.remove('show');
        emailInput.style.borderColor = '';
      }, 4000);
    }
    emailInput.value = '';
  }

  // Click on button
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', handleSubscribe);
  }

  // Also trigger on Enter key
  emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubscribe();
  });
}

/* ── 4. FRANCHISE FORM ──────────────────────────────────────
   Validates all required fields in the franchise application.
   Shows inline success message on valid submission.
   Only runs on Franchise.html which has #franchiseForm.
   ---------------------------------------------------------- */
function initFranchiseForm() {
  const submitBtn = document.getElementById('franchiseSubmit');
  const formSuccess = document.getElementById('formSuccess');

  if (!submitBtn) return; // only runs on Franchise.html

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(id, checkFn) {
    const el = document.getElementById(id);
    if (!el) return true; // field doesn't exist, skip
    const valid = checkFn(el.value.trim());
    el.style.borderColor = valid ? '' : '#ef4444';
    return valid;
  }

  submitBtn.addEventListener('click', () => {
    // Clear all borders first
    ['firstName', 'lastName', 'email', 'phone', 'city', 'investment', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = '';
    });

    const checks = [
      validateField('firstName',  v => v.length > 0),
      validateField('lastName',   v => v.length > 0),
      validateField('email',      v => emailRegex.test(v)),
      validateField('phone',      v => v.length >= 7),
      validateField('city',       v => v.length > 0),
      validateField('investment', v => v.length > 0),
    ];

    const allValid = checks.every(Boolean);

    if (!allValid) {
      // Scroll to first red field
      const firstError = document.querySelector('input[style*="ef4444"], select[style*="ef4444"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // All valid — show success
    if (formSuccess) {
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form fields
    ['firstName', 'lastName', 'email', 'phone', 'city', 'investment', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = el.tagName === 'SELECT' ? '' : '';
    });
  });
}

/* ── 5. ACTIVE NAV LINK ─────────────────────────────────────
   Automatically highlights the correct nav link
   based on the current page filename.
   ---------------------------------------------------------- */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'Knight-Bite.html';

  // Target both desktop and mobile navs
  const allNavLinks = document.querySelectorAll('.navbar-links a, .mobile-nav a');

  allNavLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ── 6. SMOOTH SCROLL for anchor links ─────────────────────
   Handles #anchor links like "Apply Now" on Franchise page.
   ---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── 7. NAVBAR SCROLL SHADOW ────────────────────────────────
   Adds a subtle shadow to the navbar when user scrolls down
   to improve readability over page content.
   ---------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* ── INIT — Run everything on DOM ready ─────────────────────
   Each function checks for its own elements before running,
   so it's safe to load this script on every page.
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initHamburger();
  initEmailSubscribe();
  initFranchiseForm();
  setActiveNav();
  initSmoothScroll();
  initNavbarScroll();
});