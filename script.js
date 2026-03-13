/* ─────────────────────────────────────────────────────────────────
   Bharath Tammi — Portfolio  ·  script.js
   ───────────────────────────────────────────────────────────────── */

'use strict';

// ── DOM Ready ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initCountUp();
  initProjectFilter();
  initContactForm();
  initActiveNavHighlight();
  initGallery();
  initLightbox();
});

// ─────────────────────────────────────────────────────────────────
// Navbar — scroll behavior & shrink
// ─────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─────────────────────────────────────────────────────────────────
// Mobile Navigation Toggle
// ─────────────────────────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const allLinks = links.querySelectorAll('a');

  if (!toggle || !links) return;

  const openMenu = () => {
    links.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  allLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on backdrop click
  document.addEventListener('click', e => {
    if (
      links.classList.contains('open') &&
      !links.contains(e.target) &&
      !toggle.contains(e.target)
    ) closeMenu();
  });
}

// ─────────────────────────────────────────────────────────────────
// Scroll Reveal — IntersectionObserver
// ─────────────────────────────────────────────────────────────────
function initScrollReveal() {
  // Add reveal class to all target elements
  const targets = [
    '.section-header',
    '.project-card',
    '.skill-category',
    '.pillar',
    '.contact-info',
    '.contact-form',
    '.about-visual',
    '.about-text',
    '.hero-badge',
    '.hero-name',
    '.hero-title',
    '.hero-tagline',
    '.hero-actions',
    '.hero-stats',
    '.quick-fact',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger sibling elements
      if (
        el.parentElement &&
        el.parentElement.children.length > 1
      ) {
        el.style.transitionDelay = `${i * 0.07}s`;
      }
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────────
// Count-Up Animation for Hero Stats
// ─────────────────────────────────────────────────────────────────
function initCountUp() {
  const statNumbers = document.querySelectorAll('[data-target]');
  if (!statNumbers.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCount = (el, target, duration = 1800) => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          animateCount(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────────
// Project Filter
// ─────────────────────────────────────────────────────────────────
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const category = card.dataset.category || '';
        const show = filter === 'all' || category.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Re-stagger reveal
          card.style.animationDelay = `${i * 0.05}s`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────
// Active Nav Highlight on Scroll
// ─────────────────────────────────────────────────────────────────
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlight = () => {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
}

// ─────────────────────────────────────────────────────────────────
// Contact Form — Client-side validation + demo submit
// ─────────────────────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(form)) return;

    // Loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation: spin 1s linear infinite;">
        <polyline points="23 4 23 11 16 11"/><path d="M20.49 15a9 9 0 1 1-.18-4.24"/>
      </svg>
      Sending...
    `;

    // Add spin keyframes dynamically once
    if (!document.querySelector('#spinKeyframes')) {
      const style = document.createElement('style');
      style.id = 'spinKeyframes';
      style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // Simulate network (replace with real endpoint when deploying)
    await new Promise(r => setTimeout(r, 1500));

    // Success state
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide after a few seconds
    setTimeout(() => { success.hidden = true; }, 6000);
  });
}

function validateForm(form) {
  const name = form.querySelector('#contactName');
  const email = form.querySelector('#contactEmail');
  const message = form.querySelector('#contactMessage');
  let valid = true;

  [name, email, message].forEach(input => {
    input.style.borderColor = '';
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      valid = false;
    }
  });

  if (email.value.trim() && !isValidEmail(email.value)) {
    email.style.borderColor = '#ef4444';
    valid = false;
  }

  if (!valid) {
    const firstInvalid = form.querySelector('[style*="ef4444"]');
    if (firstInvalid) firstInvalid.focus();
  }

  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────────────────────────
// Smooth Anchor Scrolling (polyfill for older browsers)
// ─────────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─────────────────────────────────────────────────────────────────
// Project Gallery — Image Upload & Thumbnail Grid
// ─────────────────────────────────────────────────────────────────

// Global gallery data store: { projectId: [{ url, name }] }
const galleryData = {};

function initGallery() {
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const projectId = gallery.dataset.project;
    galleryData[projectId] = [];

    const fileInput = gallery.querySelector('.gallery-input');
    const imagesContainer = gallery.querySelector('.gallery-images');
    const placeholder = gallery.querySelector('.gallery-placeholder');

    if (!fileInput || !imagesContainer) return;

    // Handle file selection via input
    fileInput.addEventListener('change', e => {
      handleFiles(Array.from(e.target.files), projectId, imagesContainer, placeholder);
      fileInput.value = ''; // Reset so same file can be re-added
    });

    // Drag-and-drop support on the card itself
    const card = gallery.closest('.project-card');
    if (card) {
      card.addEventListener('dragover', e => {
        e.preventDefault();
        gallery.style.borderColor = 'rgba(99, 102, 241, 0.6)';
      });
      card.addEventListener('dragleave', () => {
        gallery.style.borderColor = '';
      });
      card.addEventListener('drop', e => {
        e.preventDefault();
        gallery.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleFiles(files, projectId, imagesContainer, placeholder);
      });
    }
  });
}

function handleFiles(files, projectId, imagesContainer, placeholder) {
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      const entry = { url: e.target.result, name: file.name };
      galleryData[projectId].push(entry);
      renderThumbnail(entry, projectId, imagesContainer, placeholder);
    };
    reader.readAsDataURL(file);
  });
}

function renderThumbnail(entry, projectId, imagesContainer, placeholder) {
  // Hide placeholder text once images exist
  const span = placeholder.querySelector('span');
  if (span) span.textContent = '+ Add more photos';

  const wrap = document.createElement('div');
  wrap.className = 'gallery-img-wrap';
  wrap.dataset.src = entry.url;

  const img = document.createElement('img');
  img.src = entry.url;
  img.alt = entry.name;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'gallery-remove';
  removeBtn.innerHTML = '&times;';
  removeBtn.setAttribute('aria-label', `Remove ${entry.name}`);
  removeBtn.addEventListener('click', e => {
    e.stopPropagation();
    galleryData[projectId] = galleryData[projectId].filter(i => i.url !== entry.url);
    wrap.remove();
    if (galleryData[projectId].length === 0 && span) {
      span.textContent = 'Add Evidence Photos';
    }
  });

  // Open lightbox on image click
  wrap.addEventListener('click', () => {
    openLightboxForProject(projectId, entry.url);
  });

  wrap.appendChild(img);
  wrap.appendChild(removeBtn);
  imagesContainer.appendChild(wrap);
}

// Public function called by onclick in HTML (gallery-placeholder)
window.openGallery = function (projectId) {
  // Trigger file input for this project
  const input = document.querySelector(
    `.project-gallery[data-project="${projectId}"] .gallery-input`
  );
  if (input) input.click();
};

// ─────────────────────────────────────────────────────────────────
// Lightbox — Fullscreen Image Viewer
// ─────────────────────────────────────────────────────────────────
let lightboxCurrentProject = null;
let lightboxCurrentIndex = 0;

function initLightbox() {
  // Create lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image lightbox');
  lb.innerHTML = `
    <button class="lightbox-close" id="lbClose" aria-label="Close lightbox">&times;</button>
    <button class="lightbox-nav lightbox-prev" id="lbPrev" aria-label="Previous image">&#8592;</button>
    <img class="lightbox-img" id="lbImg" src="" alt="Project evidence" />
    <button class="lightbox-nav lightbox-next" id="lbNext" aria-label="Next image">&#8594;</button>
  `;
  document.body.appendChild(lb);

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lbNext').addEventListener('click', () => navigateLightbox(1));

  // Close on backdrop click
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightboxForProject(projectId, startUrl) {
  lightboxCurrentProject = projectId;
  const images = galleryData[projectId] || [];
  lightboxCurrentIndex = images.findIndex(i => i.url === startUrl);
  if (lightboxCurrentIndex < 0) lightboxCurrentIndex = 0;

  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  lightboxCurrentProject = null;
}

function navigateLightbox(direction) {
  if (!lightboxCurrentProject) return;
  const images = galleryData[lightboxCurrentProject] || [];
  lightboxCurrentIndex = (lightboxCurrentIndex + direction + images.length) % images.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const images = galleryData[lightboxCurrentProject] || [];
  if (!images.length) return;
  const entry = images[lightboxCurrentIndex];
  const img = document.getElementById('lbImg');
  img.src = entry.url;
  img.alt = entry.name;

  // Show/hide nav based on count
  const showNav = images.length > 1;
  document.getElementById('lbPrev').style.display = showNav ? '' : 'none';
  document.getElementById('lbNext').style.display = showNav ? '' : 'none';
}

