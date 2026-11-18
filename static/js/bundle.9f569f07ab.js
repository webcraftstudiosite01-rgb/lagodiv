(function(){
'use strict';
/**
 * Smooth Inertial Scroll Controller (Lenis-compatible RAF loop with prefers-reduced-motion guard).
 */
function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.classList.add('reduced-motion');
    return { scrollTo: (target) => window.scrollTo({ top: target, behavior: 'auto' }) };
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  return {
    scrollTo: (top) => window.scrollTo({ top, behavior: 'smooth' }),
  };
}

/**
 * Hero III Dual-Element Diptych & Magnetic Cursor Choreography.
 */
function initHeroAndCursor() {
  const pre = document.getElementById('preloader');
  if (pre) {
    setTimeout(() => pre.classList.add('is-done'), 380);
  }

  const cursor = document.getElementById('cursorFollower');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !prefersReduced && cursor) {
    window.addEventListener(
      'pointermove',
      (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-expanded');
        cursor.textContent = el.getAttribute('data-cursor') || '';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-expanded');
        cursor.textContent = '';
      });
    });
  }
}

/**
 * Editorial Viewport Reveal Engine (IntersectionObserver with No-JS & Reduced-Motion safety).
 */
function initReveals() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * Subtle Scroll Parallax for Collage & Hero Media ([data-parallax]).
 */
function initParallax() {
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.08');
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const offset = (rect.top - vh * 0.5) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * Horizontal Scroll Rail Controller (.rail-track).
 */
function initHorizontalRails() {
  document.querySelectorAll('.rail-track').forEach((track) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  });
}

/**
 * Nav V2 Floating Minimal Frame Scroll State Choreography.
 */
function initNavChoreography() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 48) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    },
    { passive: true }
  );
}

/**
 * Progressive View Transitions API enhancer.
 */
function initPageTransitions() {
  if (!document.startViewTransition) return;
  document.querySelectorAll('a[data-transition]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = href;
      });
    });
  });
}

/**
 * Fullscreen Concierge Menu Controller.
 */
function toggleConciergeMenu(open) {
  const menu = document.getElementById('conciergeMenu');
  if (!menu) return;
  if (open) {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
  } else {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
  }
}

function swapMenuPreview(src, caption) {
  const img = document.getElementById('menuPreviewImg');
  const cap = document.getElementById('menuPreviewCaption');
  if (img && src) img.src = src;
  if (cap && caption) cap.textContent = caption;
}

function initConciergeMenu() {
  window.toggleConciergeMenu = toggleConciergeMenu;
  window.swapMenuPreview = swapMenuPreview;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleConciergeMenu(false);
    }
  });
}

/**
 * FAQ Accordion & Hotel Tab Controller.
 */
function switchHotelTab(key, btn) {
  document.querySelectorAll('.hotel-panel').forEach((p) => p.classList.remove('is-active'));
  const panel = document.getElementById('panel-' + key);
  if (panel) panel.classList.add('is-active');
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.hotel-tab').forEach((t) => t.classList.remove('is-active'));
    btn.classList.add('is-active');
  }
}

function initAccordionsAndTabs() {
  window.switchHotelTab = switchHotelTab;
}

/**
 * Fullscreen Lightbox & Gallery Filter Controller.
 */
function openLightbox(src, caption) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!box || !img) return;
  img.src = src;
  if (cap) cap.textContent = caption || '';
  box.classList.add('is-open');
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  if (box) box.classList.remove('is-open');
}

function filterGallery(category, btn) {
  document.querySelectorAll('[data-gallery-cat]').forEach((item) => {
    const cat = item.getAttribute('data-gallery-cat');
    if (category === 'all' || cat === category) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
    btn.classList.add('is-active');
  }
}

function initLightbox() {
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.filterGallery = filterGallery;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/**
 * Slide-Out Booking Drawer & Live Stay Calculator.
 */
let currentBaseRate = 3900;

function openBookingDrawer(roomTitle, rate, roomSlug) {
  currentBaseRate = Number(rate) || 3900;
  const roomInput = document.getElementById('bkRoom');
  const slugInput = document.getElementById('bkRoomSlug');
  const successBox = document.getElementById('bkSuccess');
  if (roomInput && roomTitle) roomInput.value = roomTitle;
  if (slugInput && roomSlug) slugInput.value = roomSlug;
  if (successBox) successBox.style.display = 'none';
  recalcBooking();
  const backdrop = document.getElementById('bookingBackdrop');
  const drawer = document.getElementById('bookingDrawer');
  if (backdrop) backdrop.classList.add('is-open');
  if (drawer) drawer.classList.add('is-open');
}

function closeBookingDrawer() {
  const backdrop = document.getElementById('bookingBackdrop');
  const drawer = document.getElementById('bookingDrawer');
  if (backdrop) backdrop.classList.remove('is-open');
  if (drawer) drawer.classList.remove('is-open');
}

function recalcBooking() {
  const inEl = document.getElementById('bkIn');
  const outEl = document.getElementById('bkOut');
  const nightsEl = document.getElementById('bkNights');
  const totalEl = document.getElementById('bkTotal');
  if (!inEl || !outEl || !nightsEl || !totalEl) return;

  const d1 = new Date(inEl.value);
  const d2 = new Date(outEl.value);
  let nights = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(nights) || nights < 1) nights = 1;
  nightsEl.textContent = String(nights);
  if (currentBaseRate > 0) {
    const total = nights * currentBaseRate;
    totalEl.textContent = total.toLocaleString('uk-UA') + ' ₴';
  } else {
    totalEl.textContent = 'Індивідуальний розрахунок';
  }
}

function initBookingDrawer() {
  window.openBookingDrawer = openBookingDrawer;
  window.closeBookingDrawer = closeBookingDrawer;
  window.recalcBooking = recalcBooking;
}

/**
 * Lagodiv Lake Resort — Primary ES Module Entrypoint (Stage 5 Motion Engine & UI).
 */











document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroAndCursor();
  initNavChoreography();
  initReveals();
  initParallax();
  initHorizontalRails();
  initPageTransitions();
  initConciergeMenu();
  initAccordionsAndTabs();
  initLightbox();
  initBookingDrawer();
});
})();
