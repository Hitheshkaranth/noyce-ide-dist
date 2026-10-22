// Noyce IDE docs: search, copy buttons, on-this-page scrollspy, screenshot zoom, mobile drawer.
// Runs in the browser on the published site, not in Node.
/* global document, addEventListener, removeEventListener, scrollY, innerHeight, location */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BASE = document.documentElement.dataset.base || '/docs/';

  // Mobile drawer
  const menu = $('.menu-btn');
  const closeNav = () => { document.body.classList.remove('nav-open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $('.scrim')?.addEventListener('click', closeNav);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // Copy buttons
  $$('.copy').forEach((b) => b.addEventListener('click', async () => {
    const pre = b.closest('.code').querySelector('pre');
    const text = [...pre.querySelectorAll('.line')].map((l) => l.dataset.cmd ?? l.textContent).join('\n') || pre.textContent;
    try { await navigator.clipboard.writeText(text.trim()); } catch { return; }
    b.dataset.done = '';
    b.lastChild.textContent = 'Copied';
    setTimeout(() => { delete b.dataset.done; b.lastChild.textContent = 'Copy'; }, 1600);
  }));

  // Screenshot zoom
  $$('.fig-frame img').forEach((img) => img.addEventListener('click', () => {
    const z = document.createElement('div');
    z.className = 'zoom';
    z.setAttribute('role', 'dialog');
    z.setAttribute('aria-label', img.alt);
    const big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    z.append(big);
    const close = () => { z.remove(); removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    z.addEventListener('click', close);
    addEventListener('keydown', onKey);
    document.body.append(z);
  }));

  // Diagrams enlarge the same way
  $$('.diagram-wrap').forEach((w) => w.addEventListener('click', () => {
    const z = document.createElement('div');
    z.className = 'zoom';
    z.setAttribute('role', 'dialog');
    z.setAttribute('aria-label', w.querySelector('svg')?.getAttribute('aria-label') ?? 'Diagram');
    z.append(w.querySelector('svg').cloneNode(true));
    const close = () => { z.remove(); removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    z.addEventListener('click', close);
    addEventListener('keydown', onKey);
    document.body.append(z);
  }));

  // On this page: highlight the section being read
  const links = $$('.toc a');
  if (links.length) {
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    const spy = () => {
      const y = scrollY + 120;
      let cur = heads[0];
      for (const h of heads) if (h.offsetTop <= y) cur = h;
      if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = heads[heads.length - 1];
      links.forEach((a) => a.classList.toggle('on', a.hash.slice(1) === cur?.id));
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // Search over every page's headings and text (index built at publish time)
  const input = $('#q');
  const box = $('#results');
  if (!input || !box) return;
  let index = null;
  let sel = -1;
  const load = async () => { index ??= await (await fetch(BASE + 'search.json')).json(); return index; };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hi = (s, terms) => terms.reduce((acc, t) => acc.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>'), esc(s));
  const render = async () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; return; }
    const terms = q.split(/\s+/).filter(Boolean);
    const rows = [];
    for (const doc of await load()) {
      for (const s of doc.sections) {
        const hay = (s.h + ' ' + s.t).toLowerCase();
        if (!terms.every((t) => hay.includes(t))) continue;
        let score = 0;
        for (const t of terms) { if (s.h.toLowerCase().includes(t)) score += 5; if (doc.title.toLowerCase().includes(t)) score += 3; }
        const at = s.t.toLowerCase().indexOf(terms[0]);
        const snip = at < 0 ? s.t.slice(0, 110) : (at > 40 ? '…' : '') + s.t.slice(Math.max(0, at - 40), at + 80);
        rows.push({ score, href: BASE + doc.slug + (s.id ? '#' + s.id : ''), title: s.h, page: doc.title, snip });
      }
    }
    rows.sort((a, b) => b.score - a.score);
    sel = -1;
    box.innerHTML = rows.length
      ? rows.slice(0, 12).map((r) => `<a href="${r.href}" role="option"><span class="r-t">${hi(r.title, terms)}</span><span class="r-p">${esc(r.page)}</span><span class="r-s">${hi(r.snip, terms)}</span></a>`).join('')
      : '<div class="empty">No matches. Try a surface name like “MISRA” or “Register Knowledge”.</div>';
    box.hidden = false;
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', () => { load(); if (input.value.trim().length > 1) render(); });
  input.addEventListener('keydown', (e) => {
    const opts = $$('a', box);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === sel)));
      opts[sel]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && opts.length) {
      location.href = (opts[sel] ?? opts[0]).href;
    } else if (e.key === 'Escape') {
      box.hidden = true; input.blur();
    }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) box.hidden = true; });
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();
