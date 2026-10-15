(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  /* ---------- Dados ---------- */
  const PROFILES = {
    gamer: {
      name: 'Setup Gamer',
      desc: 'Foco em desempenho, fluidez e conforto para longas partidas.',
      items: [
        { id: 'g1', icon: '🖥️', name: 'Monitor 144 Hz+', note: 'Painel rápido, 24" a 27"', price: 1300 },
        { id: 'g2', icon: '⌨️', name: 'Teclado mecânico', note: 'Switches responsivos', price: 350 },
        { id: 'g3', icon: '🖱️', name: 'Mouse gamer leve', note: 'Sensor preciso', price: 220 },
        { id: 'g4', icon: '🎧', name: 'Headset com microfone', note: 'Som posicional e conforto', price: 380 },
        { id: 'g5', icon: '🎮', name: 'Controle sem fio', note: 'Compatível com PC', price: 300 },
        { id: 'g6', icon: '🟪', name: 'Mousepad grande', note: 'Cobre teclado e mouse', price: 120 },
        { id: 'g7', icon: '💡', name: 'Iluminação RGB', note: 'Fita de LED ou barra', price: 150 },
        { id: 'g8', icon: '🪑', name: 'Cadeira gamer ergonômica', note: 'Apoio lombar ajustável', price: 1100 }
      ]
    },
    criativo: {
      name: 'Setup Criativo',
      desc: 'Cores fiéis, ferramentas de desenho e uma mesa organizada para criar.',
      items: [
        { id: 'c1', icon: '🖥️', name: 'Monitor com boa cobertura sRGB', note: 'Painel IPS calibrável', price: 1600 },
        { id: 'c2', icon: '💻', name: 'Notebook ou PC com 16 GB RAM', note: 'Para edição e design', price: 4500 },
        { id: 'c3', icon: '✏️', name: 'Mesa digitalizadora', note: 'Caneta com sensibilidade', price: 450 },
        { id: 'c4', icon: '📷', name: 'Câmera ou webcam Full HD', note: 'Fotos e conteúdo', price: 600 },
        { id: 'c5', icon: '💽', name: 'SSD externo 1 TB', note: 'Backup dos projetos', price: 450 },
        { id: 'c6', icon: '🎙️', name: 'Microfone USB', note: 'Narração e vídeo', price: 350 },
        { id: 'c7', icon: '🪴', name: 'Organização e decoração', note: 'Suportes, plantas, bandejas', price: 200 },
        { id: 'c8', icon: '💡', name: 'Luminária de mesa', note: 'Luz neutra e regulável', price: 160 }
      ]
    },
    dev: {
      name: 'Setup Programador',
      desc: 'Produtividade, espaço de tela e ergonomia para o dia inteiro.',
      items: [
        { id: 'd1', icon: '🖥️', name: 'Monitor 27" (QHD ou 4K)', note: 'Texto nítido, mais espaço', price: 1700 },
        { id: 'd2', icon: '🖥️', name: 'Segundo monitor', note: 'Docs, terminal e testes', price: 900 },
        { id: 'd3', icon: '⌨️', name: 'Teclado confortável', note: 'Mecânico ou low profile', price: 400 },
        { id: 'd4', icon: '🖱️', name: 'Mouse ergonômico', note: 'Menos desconforto no pulso', price: 300 },
        { id: 'd5', icon: '🪑', name: 'Cadeira ergonômica', note: 'Ajuste de altura e lombar', price: 1500 },
        { id: 'd6', icon: '🎧', name: 'Fone com cancelamento de ruído', note: 'Foco e reuniões', price: 700 },
        { id: 'd7', icon: '📐', name: 'Suporte articulado de monitor', note: 'Altura certa dos olhos', price: 250 },
        { id: 'd8', icon: '🔌', name: 'Hub USB-C / dock', note: 'Conecta tudo com um cabo', price: 300 }
      ]
    }
  };

  const QUIZ = [
    {
      q: 'O que você mais faz no computador?',
      opts: [
        { icon: '🎮', t: 'Jogar', d: 'Jogos competitivos e casuais', v: { gamer: 3 } },
        { icon: '🎨', t: 'Criar', d: 'Design, vídeo, foto, ilustração', v: { criativo: 3 } },
        { icon: '💻', t: 'Programar', d: 'Desenvolvimento e estudos', v: { dev: 3 } },
        { icon: '⚖️', t: 'Um pouco de tudo', d: 'Uso variado no dia a dia', v: { gamer: 1, criativo: 1, dev: 1 } }
      ]
    },
    {
      q: 'Quanto tempo você passa no setup por dia?',
      opts: [
        { icon: '⏱️', t: 'Até 3 horas', d: 'Uso moderado', v: {} },
        { icon: '🕔', t: 'De 4 a 7 horas', d: 'Bastante tempo', v: { dev: 1, criativo: 1 } },
        { icon: '🌙', t: 'Mais de 8 horas', d: 'Quase o dia todo', v: { dev: 2, criativo: 1 } }
      ]
    },
    {
      q: 'O que é mais importante para você?',
      opts: [
        { icon: '⚡', t: 'Desempenho e velocidade', d: 'Quanto mais rápido, melhor', v: { gamer: 2 } },
        { icon: '🌈', t: 'Qualidade de imagem', d: 'Cores e detalhes fiéis', v: { criativo: 2 } },
        { icon: '🧘', t: 'Conforto e foco', d: 'Ergonomia e produtividade', v: { dev: 2 } }
      ]
    }
  ];

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  /* ---------- Imagens com fallback ---------- */
  $$('[data-img]').forEach(el => {
    const src = el.dataset.img;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; };
    img.src = src; // se não existir, mantém o gradiente padrão
  });

  /* ---------- Header / menu ---------- */
  const header = $('#header');
  const burger = $('#burger');
  const nav = $('#nav');

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // Link ativo conforme a seção
  const sections = $$('main section[id]');
  const links = $$('a', nav);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Reveal ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObs.observe(el);
  });

  /* ---------- Contadores ---------- */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const dur = 1400;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  });
  $$('[data-count]').forEach(el => countObs.observe(el));

  /* ---------- Montador ---------- */
  const itemsEl = $('#items');
  const listEl = $('#summaryList');
  const totalEl = $('#total');
  const budgetEl = $('#budget');
  const barEl = $('#budgetBar');
  const msgEl = $('#budgetMsg');

  let currentTab = 'gamer';
  let selected = new Set();
  try { selected = new Set(JSON.parse(localStorage.getItem('msi_selected') || '[]')); } catch (_) {}
  try { budgetEl.value = localStorage.getItem('msi_budget') || ''; } catch (_) {}

  const allItems = Object.values(PROFILES).flatMap(p => p.items);
  const save = () => {
    try {
      localStorage.setItem('msi_selected', JSON.stringify([...selected]));
      localStorage.setItem('msi_budget', budgetEl.value);
    } catch (_) {}
  };

  const renderItems = () => {
    itemsEl.innerHTML = '';
    PROFILES[currentTab].items.forEach(it => {
      const label = document.createElement('label');
      label.className = 'item' + (selected.has(it.id) ? ' is-checked' : '');
      label.innerHTML = `
        <input type="checkbox" ${selected.has(it.id) ? 'checked' : ''}>
        <span class="item__check"></span>
        <span class="item__icon">${it.icon}</span>
        <span class="item__info"><strong>${it.name}</strong><span>${it.note}</span></span>
        <span class="item__price">${brl(it.price)}</span>`;
      $('input', label).addEventListener('change', e => {
        e.target.checked ? selected.add(it.id) : selected.delete(it.id);
        label.classList.toggle('is-checked', e.target.checked);
        renderSummary();
      });
      itemsEl.appendChild(label);
    });
  };

  const renderSummary = () => {
    const chosen = allItems.filter(i => selected.has(i.id));
    const total = chosen.reduce((s, i) => s + i.price, 0);
    listEl.innerHTML = chosen.length
      ? chosen.map(i => `<li><span>${i.icon} ${i.name}</span><span>${brl(i.price)}</span></li>`).join('')
      : '<li class="empty">Nenhum item selecionado.</li>';
    totalEl.textContent = brl(total);

    const budget = parseFloat(budgetEl.value);
    if (budget > 0) {
      const pct = Math.min((total / budget) * 100, 100);
      barEl.style.width = pct + '%';
      barEl.classList.toggle('over', total > budget);
      msgEl.textContent = total > budget
        ? `Passou ${brl(total - budget)} do orçamento.`
        : `Ainda restam ${brl(budget - total)} do orçamento.`;
    } else {
      barEl.style.width = '0';
      barEl.classList.remove('over');
      msgEl.textContent = 'Defina um orçamento para acompanhar.';
    }
    save();
  };

  const setTab = tab => {
    currentTab = tab;
    $$('.tab').forEach(t => {
      const on = t.dataset.tab === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    renderItems();
  };

  $$('.tab').forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
  budgetEl.addEventListener('input', renderSummary);

  $('#clearList').addEventListener('click', () => {
    selected.clear();
    renderItems();
    renderSummary();
    toast('Lista limpa');
  });

  $('#copyList').addEventListener('click', async () => {
    const chosen = allItems.filter(i => selected.has(i.id));
    if (!chosen.length) return toast('Selecione ao menos um item');
    const total = chosen.reduce((s, i) => s + i.price, 0);
    const text = 'MeuSetup Ideal — minha lista\n\n' +
      chosen.map(i => `• ${i.name} — ${brl(i.price)}`).join('\n') +
      `\n\nTotal estimado: ${brl(total)}`;
    try {
      await navigator.clipboard.writeText(text);
      toast('Lista copiada!');
    } catch (_) {
      toast('Não foi possível copiar');
    }
  });

  // Botões dos cards de perfil
  $$('[data-pick]').forEach(b => b.addEventListener('click', () => {
    setTab(b.dataset.pick);
    $('#montador').scrollIntoView({ behavior: 'smooth' });
  }));

  setTab('gamer');
  renderSummary();

  /* ---------- Quiz ---------- */
  const stepEl = $('#quizStep');
  const barQuiz = $('#quizBar');
  const countEl = $('#quizCount');
  const backBtn = $('#quizBack');
  let qi = 0;
  let answers = [];

  const renderQuiz = () => {
    const q = QUIZ[qi];
    barQuiz.style.width = ((qi + 1) / QUIZ.length * 100) + '%';
    countEl.textContent = `Pergunta ${qi + 1} de ${QUIZ.length}`;
    backBtn.disabled = qi === 0;
    stepEl.innerHTML = `<h3>${q.q}</h3><div class="options"></div>`;
    const box = $('.options', stepEl);
    q.opts.forEach((o, idx) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.innerHTML = `<span class="option__icon">${o.icon}</span><span><strong>${o.t}</strong><small>${o.d}</small></span>`;
      b.addEventListener('click', () => {
        answers[qi] = idx;
        if (qi < QUIZ.length - 1) { qi++; renderQuiz(); } else showResult();
      });
      box.appendChild(b);
    });
  };

  const showResult = () => {
    const score = { gamer: 0, criativo: 0, dev: 0 };
    answers.forEach((a, i) => {
      const v = QUIZ[i].opts[a].v;
      Object.keys(v).forEach(k => score[k] += v[k]);
    });
    const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    const p = PROFILES[best];
    barQuiz.style.width = '100%';
    countEl.textContent = 'Resultado';
    stepEl.innerHTML = `
      <div class="result">
        <span class="result__badge">Seu perfil</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <ul>${p.items.slice(0, 4).map(i => `<li>${i.icon} ${i.name}</li>`).join('')}</ul>
        <div class="result__actions">
          <button class="btn" id="goBuild">Montar minha lista</button>
          <button class="btn btn--ghost" id="again">Refazer quiz</button>
        </div>
      </div>`;
    $('#goBuild').addEventListener('click', () => {
      setTab(best);
      $('#montador').scrollIntoView({ behavior: 'smooth' });
    });
    $('#again').addEventListener('click', () => { qi = 0; answers = []; renderQuiz(); });
  };

  backBtn.addEventListener('click', () => {
    if (qi > 0) { qi--; renderQuiz(); }
  });
  renderQuiz();

  /* ---------- FAQ: abre um por vez ---------- */
  const details = $$('#faqList details');
  details.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) details.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---------- Newsletter ---------- */
  const form = $('#newsForm');
  const emailEl = $('#newsEmail');
  const newsMsg = $('#newsMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailEl.value.trim());
    newsMsg.className = 'news__msg ' + (ok ? 'ok' : 'err');
    newsMsg.textContent = ok ? 'Pronto! Você está na lista. 🎉' : 'Digite um e-mail válido.';
    if (ok) form.reset();
  });

  /* ---------- Ano ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
