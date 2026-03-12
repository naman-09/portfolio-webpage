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
/* ── FLOATING BUBBLE — drag + water physics ─────────── */
(function () {
  const bubble = document.getElementById('floatingBubble');
  if (!bubble) return;

  let isDragging = false;
  let startX, startY;         // pointer start position
  let bubbleX, bubbleY;       // bubble position (fixed coords)
  let velX = 0, velY = 0;     // velocity for inertia
  let lastX, lastY;           // last frame pointer position
  let rafId;

  /* Set initial position from CSS (bottom-right area) */
  function initPosition() {
    const rect = bubble.getBoundingClientRect();
    bubbleX = rect.left;
    bubbleY = rect.top;
    bubble.style.left = bubbleX + 'px';
    bubble.style.top  = bubbleY + 'px';
    bubble.style.bottom = 'auto';
    bubble.style.right  = 'auto';
  }

  /* ── POINTER DOWN (mouse + touch) ── */
  function onPointerDown(e) {
    e.preventDefault();
    initPosition();

    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX - bubbleX;
    startY = point.clientY - bubbleY;
    lastX  = point.clientX;
    lastY  = point.clientY;
    velX   = 0;
    velY   = 0;

    isDragging = true;
    bubble.classList.add('is-dragging');
    bubble.classList.remove('is-settling');

    /* Squash on grab */
    bubble.style.transform = 'scale(1.08, 0.94)';
    setTimeout(() => {
      if (isDragging) bubble.style.transform = '';
    }, 120);

    document.addEventListener('mousemove', onPointerMove, { passive: false });
    document.addEventListener('mouseup',   onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend',  onPointerUp);
  }

  /* ── POINTER MOVE ── */
  function onPointerMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const point = e.touches ? e.touches[0] : e;

    /* Velocity for inertia */
    velX = point.clientX - lastX;
    velY = point.clientY - lastY;
    lastX = point.clientX;
    lastY = point.clientY;

    bubbleX = point.clientX - startX;
    bubbleY = point.clientY - startY;

    /* Stretch in drag direction */
    const speed  = Math.sqrt(velX * velX + velY * velY);
    const stretch = Math.min(speed * 0.012, 0.12);
    const angle  = Math.atan2(velY, velX);
    const sx     = 1 + stretch;
    const sy     = 1 - stretch * 0.6;

    bubble.style.left      = bubbleX + 'px';
    bubble.style.top       = bubbleY + 'px';
    bubble.style.transform =
      `rotate(${angle}rad) scale(${sx}, ${sy})`;
  }

  /* ── POINTER UP — inertia + settle ── */
  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;

    bubble.classList.remove('is-dragging');
    bubble.style.transform = '';

    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup',   onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend',  onPointerUp);

    /* Inertia glide */
    const friction = 0.88;
    cancelAnimationFrame(rafId);

    function glide() {
      velX *= friction;
      velY *= friction;

      if (Math.abs(velX) < 0.3 && Math.abs(velY) < 0.3) {
        /* Snap settle with bounce animation */
        bubble.classList.add('is-settling');
        setTimeout(() => {
          bubble.classList.remove('is-settling');
          /* Resume idle wobble */
          bubble.style.animation = '';
          bubble.style.animation = 'bubbleIdle 3.5s ease-in-out infinite';
        }, 560);
        return;
      }

      bubbleX += velX;
      bubbleY += velY;

      /* Keep bubble inside viewport */
      const maxX = window.innerWidth  - bubble.offsetWidth;
      const maxY = window.innerHeight - bubble.offsetHeight;
      if (bubbleX < 0)    { bubbleX = 0;    velX *= -0.5; }
      if (bubbleY < 0)    { bubbleY = 0;    velY *= -0.5; }
      if (bubbleX > maxX) { bubbleX = maxX; velX *= -0.5; }
      if (bubbleY > maxY) { bubbleY = maxY; velY *= -0.5; }

      bubble.style.left = bubbleX + 'px';
      bubble.style.top  = bubbleY + 'px';

      rafId = requestAnimationFrame(glide);
    }

    glide();
  }

  /* Attach listeners */
  bubble.addEventListener('mousedown',  onPointerDown);
  bubble.addEventListener('touchstart', onPointerDown, { passive: false });
})();
