/* ── CUSTOM CURSOR ─────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateCursor);
})();

/* ── TYPEWRITER ─────────────────────────────────────── */
const phrases = [
  'Full Stack Developer',
  'Django + Vue.js Engineer',
  'B.Tech CS @ Amity · 2026',
  'Building Reliable Web Apps',
  'Open to Opportunities'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typewriterEl = document.getElementById('typewriter');

function typewrite() {
  const word = phrases[phraseIndex];
  if (!deleting) {
    typewriterEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(typewrite, 1800);
      return;
    }
  } else {
    typewriterEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typewrite, deleting ? 55 : 90);
}
typewrite();

/* ── NAV SCROLL EFFECT ──────────────────────────────── */
const nav = document.getElementById('navbar');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
  backTop.classList.toggle('visible', window.scrollY > 400);
});

/* ── HAMBURGER MENU ─────────────────────────────────── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── DARK / LIGHT THEME TOGGLE ──────────────────────── */
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme'); // back to warm light
    themeBtn.textContent = '🌙';
    // restore warm nav bg
    document.getElementById('navbar').style.background = 'rgba(253, 246, 238, 0.88)';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️';
    document.getElementById('navbar').style.background = 'rgba(28, 19, 13, 0.88)';
  }
});

/* ── SCROLL REVEAL ANIMATIONS ───────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ANIMATED SKILL BARS ────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar').forEach(bar => barObserver.observe(bar));

/* ── PROJECT FILTER SYSTEM ──────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ── BACK TO TOP ─────────────────────────────────────── */
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONTACT FORM (opens mailto) ─────────────────────── */
function sendMsg(e) {
  e.preventDefault();
  const name = document.getElementById('cfName').value.trim();
  const email = document.getElementById('cfEmail').value.trim();
  const msg = document.getElementById('cfMsg').value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in all fields.');
    return;
  }

  window.open(
    `https://mail.google.com/mail/?view=cm&to=naman.cs.data@gmail.com` +
    `?subject=${encodeURIComponent('Portfolio Enquiry from ' + name)}` +
    `&body=${encodeURIComponent(msg + '\n\nFrom: ' + name + '\nEmail: ' + email)}`, '_blank');

  document.getElementById('cfName').value = '';
  document.getElementById('cfEmail').value = '';
  document.getElementById('cfMsg').value = '';
}

/* ── HERO INITIAL REVEAL ─────────────────────────────── */
document.querySelectorAll('#hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 300 + i * 180);
});
