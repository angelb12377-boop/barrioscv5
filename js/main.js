/* ============================================================
   Barrios Construction 20 LLC — Main JS
   ============================================================ */

// ---------- Header scroll effect ----------
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- Mobile Nav ----------
const navToggle = document.querySelector('.nav-toggle');
const mainNav   = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('mobile-open');
      navToggle.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('mobile-open');
      navToggle.classList.remove('open');
    }
  });
}

// ---------- Active Nav ----------
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();

// ---------- Gallery Filter ----------
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });
}

// ---------- Lightbox ----------
const lightbox      = document.querySelector('.lightbox');
const lightboxImg   = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  lightboxClose && lightboxClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// ---------- Contact Form ----------
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const group  = field.closest('.form-group');
      const errMsg = group?.querySelector('.error-msg');
      field.classList.remove('error');
      errMsg?.classList.remove('show');

      if (!field.value.trim()) {
        field.classList.add('error');
        errMsg?.classList.add('show');
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('error');
        if (errMsg) { errMsg.textContent = 'Please enter a valid email.'; errMsg.classList.add('show'); }
        valid = false;
      }
    });

    if (valid) {
      const btn = form.querySelector('.form-submit');
      const msg = form.querySelector('.form-success');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      const data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          form.reset();
          msg?.classList.add('show');
          setTimeout(() => msg?.classList.remove('show'), 6000);
        } else {
          alert('Sorry, there was a problem sending your message. Please try again.');
        }
      }).catch(() => {
        alert('Sorry, there was a problem sending your message. Please try again.');
      }).finally(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
    }
  });

  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => {
      f.classList.remove('error');
      f.closest('.form-group')?.querySelector('.error-msg')?.classList.remove('show');
    });
  });
}

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
