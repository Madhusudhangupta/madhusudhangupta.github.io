/**
 * Optimized Portfolio Script
 * -------------------------------------------------
 * 1. Fade-in on scroll
 * 2. Lazy loading (native + polyfill)
 * 3. Parallax background
 * 4. Dark-mode toggle + persistence
 * 5. Visitor counter (GitHub API)
 * 6. Particles.js background
 * 7. Typewriter effect
 * 8. Scroll progress bar
 * 9. Custom cursor
 * 10. Contact form – validation + AJAX + success overlay
 * -------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------
   * 1. Fade-in animation
   * ------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in, .project-card, .social-links a');
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* -------------------------------------------------
   * 2. Lazy-loading fallback
   * ------------------------------------------------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  } else {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => img.classList.add('loaded'));
  }

  /* -------------------------------------------------
   * 3. Parallax background
   * ------------------------------------------------- */
  const parallaxSections = document.querySelectorAll('.parallax');
  let ticking = false;
  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxSections.forEach(sec => (sec.style.backgroundPositionY = `${scrollY * 0.5}px`));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  /* -------------------------------------------------
   * 4. Dark Mode Toggle
   * ------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeLink = document.getElementById('theme');
  const moonIcon = themeToggle.querySelector('i');

  const setTheme = mode => {
    themeLink.href = `css/${mode}.css`;
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    moonIcon.classList.toggle('fa-sun', mode === 'light');
    moonIcon.classList.toggle('fa-moon', mode === 'dark');
  };

  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  // Auto-detect system preference on first visit
  if (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme(localStorage.getItem('theme') || 'light');
  }

  /* -------------------------------------------------
   * 5. Visitor Counter (GitHub repo watchers)
   * ------------------------------------------------- */
  fetch('https://api.github.com/repos/madhusudhangupta/madhusudhangupta.github.io')
    .then(r => r.json())
    .then(data => {
      const count = data.subscribers_count || data.watchers_count || 0;
      document.getElementById('visitors').textContent = count || 'Launching Soon';
    })
    .catch(() => {
      document.getElementById('visitors').textContent = 'Live';
    });

  /* -------------------------------------------------
   * 6. Particles.js background
   * ------------------------------------------------- */
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60 },
        color: { value: '#64b5f6' },
        shape: { type: 'circle' },
        opacity: { value: 0.4 },
        size: { value: 3 },
        line_linked: { enable: true, color: '#64b5f6', opacity: 0.3 },
        move: { enable: true, speed: 1.5 }
      },
      interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } }
    });
  }

  /* -------------------------------------------------
   * 7. Typewriter Effect
   * ------------------------------------------------- */
  if (typeof Typewriter !== 'undefined') {
    new Typewriter('#typewriter', {
      strings: ['Madhusudhan Gupta', 'Full-Stack Developer', 'Problem Solver'],
      autoStart: true,
      loop: true,
      delay: 80
    });
  }

  /* -------------------------------------------------
   * 8. Scroll Progress Bar
   * ------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = ((h.scrollTop || document.body.scrollTop) /
      (h.scrollHeight - h.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = `${scrolled}%`;
  });

  /* -------------------------------------------------
   * 9. Custom Cursor
   * ------------------------------------------------- */
  const cursor = document.querySelector('.cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  /* -------------------------------------------------
   * 10. Contact Form – Validation + AJAX + Success
   * ------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm?.querySelector('button[type="submit"]');
  const successOverlay = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // always prevent default – we’ll submit via fetch

      // ---------- 1. Reset previous errors ----------
      contactForm.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input, textarea');
        const err = group.querySelector('.error-msg');
        err.textContent = '';
        input.style.border = '';
      });

      let isValid = true;
      const showError = (input, msg) => {
        const err = input.parentElement.querySelector('.error-msg');
        err.textContent = msg;
        err.style.color = '#e74c3c';
        input.style.border = '2px solid #e74c3c';
        isValid = false;
      };

      // ---------- 2. Validate fields ----------
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim()) showError(name, 'Please enter your name');
      if (!email.value.trim()) showError(email, 'Please enter your email');
      else if (!emailRegex.test(email.value)) showError(email, 'Please enter a valid email');
      if (!message.value.trim()) showError(message, 'Please write a message');

      if (!isValid) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        return;
      }

      // ---------- 3. Show loading ----------
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Sending...';

      // ---------- 4. AJAX POST ----------
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(r => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.textContent = 'Send Message';

          if (r.ok) {
            contactForm.reset();
            successOverlay.classList.add('show');
            setTimeout(() => successOverlay.classList.remove('show'), 4000);
          } else {
            throw new Error('Server error');
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.textContent = 'Send Message';
          alert('Oops! Something went wrong. Please try again later.');
        });
    });
  }
});