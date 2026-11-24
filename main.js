{
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navbar shadow, reading progress bar and back-to-top button
  const nav = document.querySelector('.site-nav');
  const bar = document.querySelector('.progress-top');
  const toTop = document.querySelector('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // Close the mobile menu after choosing a section
  const menu = document.getElementById('mainNav');
  document.querySelectorAll('#mainNav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  // Highlight the nav link of the section in view
  const links = [...document.querySelectorAll('#mainNav .nav-link')];
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll (also starts the map route and timeline line)
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .timeline, .map-card').forEach((el) => revealer.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { countUp(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObs.observe(c));

  // Typing roles in the hero
  const typed = document.querySelector('.typed');
  const roles = [
    'Assistant Professor of Commerce',
    'Former Dean, MIANZ International College',
    'Cambridge O Level & A Level Educator',
    'Behavioural Finance Researcher'
  ];
  if (typed) {
    if (reduce) { typed.textContent = roles[0]; }
    else {
      let r = 0, i = 0, deleting = false;
      const tick = () => {
        const word = roles[r];
        i += deleting ? -1 : 1;
        typed.textContent = word.slice(0, i);
        let wait = deleting ? 35 : 70;
        if (!deleting && i === word.length) { deleting = true; wait = 1800; }
        else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; wait = 400; }
        setTimeout(tick, wait);
      };
      tick();
    }
  }

  // Copy email button
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('sonipawar2008@gmail.com');
        copyBtn.textContent = 'Copied';
      } catch (err) {
        copyBtn.textContent = 'Select & copy';
      }
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
  }

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
}
