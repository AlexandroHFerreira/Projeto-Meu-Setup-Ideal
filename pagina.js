(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Brilho que segue o mouse */
  const glow = $('#glow');
  if (!reduce && matchMedia('(hover:hover)').matches) {
    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      glow.style.left = x + 'px'; glow.style.top = y + 'px';
      requestAnimationFrame(loop);
    };
    loop();
  } else {
    glow.style.display = 'none';
  }

  /* Menu mobile */
  const btn = $('#menuBtn');
  const links = $('#navLinks');
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));

  /* Revelar ao rolar */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 90 + 'ms';
    io.observe(el);
  });

  /* Contadores */
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1500;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    co.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => co.observe(el));

  /* Efeito 3D nos cards */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* Formulário */
  const form = $('#form'), email = $('#email'), msg = $('#msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    msg.className = 'form__msg ' + (ok ? 'ok' : 'err');
    msg.textContent = ok ? 'Tudo certo! Você entrou na lista. 🎉' : 'Digite um e-mail válido.';
    if (ok) form.reset();
  });

  $('#year').textContent = new Date().getFullYear();
})();
