/**
 * Optimized Portfolio Script – **NO FILTERING**
 * - Fade-in on scroll (single IntersectionObserver)
 * - Native lazy loading + polyfill fallback
 * - Smooth parallax background
 */

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------
   * 1. Fade-in animation for sections & project cards
   * ------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in, .project-card, .social-links a');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target); // observe once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));

  /* -------------------------------------------------
   * 2. Lazy-loading fallback for browsers without native support
   * ------------------------------------------------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    // Browser does **not** support `loading="lazy"`
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // In case you ever want a data-src fallback:
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imgObserver.unobserve(img);
        }
      });
    });

    lazyImgs.forEach((img) => imgObserver.observe(img));
  } else {
    // Native lazy loading is supported – just add a class for CSS transitions
    document
      .querySelectorAll('img[loading="lazy"]')
      .forEach((img) => img.classList.add('loaded'));
  }

  /* -------------------------------------------------
   * 3. Parallax background on scroll
   * ------------------------------------------------- */
  const parallaxSections = document.querySelectorAll('.parallax');
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxSections.forEach(
      (sec) => (sec.style.backgroundPositionY = `${scrollY * 0.5}px`)
    );
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
});

/* -------------------------------------------------
 * 4. Contact Form Validation
 * ------------------------------------------------- */
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
  const form = e.target;
  let isValid = true;

  // Helper: show/hide error
  const showError = (input, message) => {
    const errorSpan = input.parentElement.querySelector('.error-msg');
    errorSpan.textContent = message;
    errorSpan.style.color = '#e74c3c';
    input.style.border = '2px solid #e74c3c';
    isValid = false;
  };

  const clearError = (input) => {
    const errorSpan = input.parentElement.querySelector('.error-msg');
    errorSpan.textContent = '';
    input.style.border = '';
  };

  // Reset previous errors
  form.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('input, textarea');
    clearError(input);
  });

  // Validate Name
  const name = form.querySelector('#name');
  if (!name.value.trim()) {
    showError(name, 'Please enter your name');
  }

  // Validate Email
  const email = form.querySelector('#email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, 'Please enter your email');
  } else if (!emailRegex.test(email.value)) {
    showError(email, 'Please enter a valid email');
  }

  // Validate Message
  const message = form.querySelector('#message');
  if (!message.value.trim()) {
    showError(message, 'Please write a message');
  }

  // If invalid, stop submission
  if (!isValid) {
    e.preventDefault();
    return;
  }

  // Optional: Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
});

// Dark Mode
const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme');
const moonIcon = themeToggle.querySelector('i');

function setTheme(mode) {
  themeLink.href = `css/${mode}.css`;
  document.body.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
  moonIcon.classList.toggle('fa-sun', mode === 'light');
  moonIcon.classList.toggle('fa-moon', mode === 'dark');
}

themeToggle.addEventListener('click', () => {
  const current = localStorage.getItem('theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
});

// Auto-detect
if (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
} else {
  setTheme(localStorage.getItem('theme') || 'light');
}

// Visitor Counter
fetch('https://api.github.com/repos/madhusudhangupta/madhusudhangupta.github.io')
  .then(r => r.json())
  .then(data => {
    const count = data.subscribers_count || data.watchers_count || 0;
    document.getElementById('visitors').textContent = count || 'Launching Soon';
  })
  .catch(() => {
    document.getElementById('visitors').textContent = 'Live'; // Fallback
  });

// Particles
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 60 },
    "color": { "value": "#64b5f6" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.4 },
    "size": { "value": 3 },
    "line_linked": { "enable": true, "color": "#64b5f6", "opacity": 0.3 },
    "move": { "enable": true, "speed": 1.5 }
  },
  "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" } } }
});

// Typing Effect
new Typewriter('#typewriter', {
  strings: ['Madhusudhan Gupta', 'Full-Stack Developer', 'Problem Solver'],
  autoStart: true, loop: true, delay: 80
});

// Progress Bar
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});