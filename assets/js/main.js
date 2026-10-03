/**
 * LUMÉA - Main Application Entrypoint
 * Handles Navbar scroll states, Mobile drawer, GSAP micro-animations, and global UI init.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initNewsletterForm();
  initHeroSearchForm();
  initGsapAnimations();
  highlightActiveNavLink();
});

/* ==========================================================================
   Navbar Scroll & State
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.lumea-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Drawer & Accordions
   ========================================================================== */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.btn-hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.btn-close-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Mobile nested dropdown accordion toggles
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = toggle.closest('.mobile-nav-item');
      const content = parentItem.querySelector('.mobile-dropdown-content');
      const icon = toggle.querySelector('i');

      if (content) {
        const isOpen = content.classList.contains('open');
        if (isOpen) {
          content.classList.remove('open');
          if (icon) icon.className = 'bi bi-chevron-down';
        } else {
          content.classList.add('open');
          if (icon) icon.className = 'bi bi-chevron-up';
        }
      }
    });
  });
}

/* ==========================================================================
   Newsletter Subscription Demo
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        window.LumeaNotifications?.success('Thank you for subscribing to LUMÉA Skin Journal!', 4500);
        emailInput.value = '';
      }
    });
  }
}

/* ==========================================================================
   Hero Search Widget
   ========================================================================== */
function initHeroSearchForm() {
  const heroSearch = document.getElementById('heroSearchForm');
  if (heroSearch) {
    heroSearch.addEventListener('submit', (e) => {
      e.preventDefault();
      const treatmentVal = document.getElementById('heroSearchTreatment')?.value || '';
      const locationVal = document.getElementById('heroSearchLocation')?.value || '';
      const dateVal = document.getElementById('heroSearchDate')?.value || '';

      const queryParams = new URLSearchParams();
      if (treatmentVal) queryParams.set('q', treatmentVal);
      if (locationVal && locationVal !== 'All Locations') queryParams.set('location', locationVal);
      if (dateVal) queryParams.set('date', dateVal);

      window.location.href = `treatments.html?${queryParams.toString()}`;
    });
  }
}

/* ==========================================================================
   GSAP Micro-animations
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Subtle hero reveal
  gsap.from('.hero-content-reveal', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.15
  });

  // Fade up elements
  const fadeElements = document.querySelectorAll('.animate-fade-up');
  if (fadeElements.length > 0) {
    fadeElements.forEach((el, index) => {
      gsap.from(el, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.08,
        ease: 'power2.out'
      });
    });
  }
}

/* ==========================================================================
   Active Link Detection
   ========================================================================== */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-lumea').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
