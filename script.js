/* =========================================================
   Trade Journal B&S — Landing Page Script
   ========================================================= */

// ---- NAV: scroll shadow + mobile menu ----
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navBurger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
  // animate burger → X
  const spans = navBurger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// close mobile menu on link click
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = navBurger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- HERO: animate risk value cycling ----
const riskValues = ['0.50%', '0.75%', '1.00%', '1.25%', '1.50%', '1.75%', '2.00%'];
const riskEl = document.getElementById('riskAnim');
let riskIndex = 3; // start at 1.25%

if (riskEl) {
  setInterval(() => {
    riskEl.style.opacity = '0';
    riskEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      riskIndex = (riskIndex + 1) % riskValues.length;
      riskEl.textContent = riskValues[riskIndex];
      riskEl.style.opacity = '1';
      riskEl.style.transform = 'translateY(0)';
    }, 300);
  }, 2200);

  riskEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ---- STATS: count-up animation ----
function animateCountUp(el, target, suffix, duration = 1200) {
  const isInfinity = target === null;
  if (isInfinity) return; // already set as ∞

  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const statsSection = document.querySelector('.stats-bar');

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const data = [
      { target: 10, suffix: '+' },
      { target: 100, suffix: '%' },
      { target: null, suffix: '' }, // ∞
      { target: 0, suffix: '' },
    ];
    statNums.forEach((el, i) => {
      if (data[i].target !== null) {
        animateCountUp(el, data[i].target, data[i].suffix);
      }
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

// ---- SMOOTH ANCHOR SCROLL (offset for fixed nav) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 52;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- FEATURE CARDS: subtle parallax tilt on hover ----
document.querySelectorAll('.fg-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- APP WINDOW MOCKUP: subtle float animation ----
const appWindow = document.querySelector('.app-window');
if (appWindow) {
  let t = 0;
  function floatAnim() {
    t += 0.012;
    const y = Math.sin(t) * 6;
    appWindow.style.transform = `translateY(${y}px)`;
    requestAnimationFrame(floatAnim);
  }
  // Only run if user hasn't requested reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    floatAnim();
  }
}
