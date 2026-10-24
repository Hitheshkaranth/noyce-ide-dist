// Shared by the static product page and documentation. No runtime dependencies.
/* global HTMLElement, customElements, document */
(() => {
  const layers = [
    { label: 'Firmware workspace', name: 'Start with the project you have.', text: 'C and C++ source, requirements, build outputs, schematics, and your MCU reference manual stay beside the firmware. Register Knowledge connects code to page-cited hardware information.', detail: 'Inputs · source, requirements, build outputs, reference manual', link: 'projects', linkLabel: 'Open a firmware project', tone: '220', tag: 'SOURCE', parts: ['C / C++', 'Requirements', 'MCU manual'] },
    { label: 'Analysis engines', name: 'Measure what the code does.', text: 'MISRA analysis, CBMC, CodeQL, MC/DC coverage, and memory analysis produce findings from real tools. A check that has not run is not evidence of a pass.', detail: 'Outputs · tool findings, proofs, coverage and trace links', link: 'analysis', linkLabel: 'Explore analysis and proof', tone: '205', tag: 'ANALYSIS', parts: ['MISRA C', 'CBMC', 'MC/DC'] },
    { label: 'Human review', name: 'Inspect the proposal. Make the call.', text: 'Agents draft fixes and documents using your chosen model. Staged change sets carry a diff for an engineer to review, with required gates checked before a real change is applied.', detail: 'Decision · a named person reviews the proposed change', link: 'review-ai-changes', linkLabel: 'Review an AI change', tone: '185', tag: 'REVIEW', parts: ['Proposal', 'Diff', 'Decision'] },
    { label: 'Evidence records', name: 'Keep a record of the work.', text: 'Compliance runs pin tool results to a commit. Reviews and approvals are recorded, and the audit ledger chains each entry to the previous hash so alterations can be detected.', detail: 'Storage · project-local records in .noyce/', link: 'evidence-records', linkLabel: 'Understand evidence records', tone: '165', tag: 'EVIDENCE', parts: ['Run', 'Review', 'Audit ledger'] },
    { label: 'Reviewable deliverables', name: 'Bring the evidence to the review.', text: 'Evidence is graded against DO-178C Annex A objectives, cited in life-cycle documents, and exported in a sealed package. Open objectives stay visible; certification remains a decision for the authority.', detail: 'Deliverables · objective status, documents, sealed package', link: 'compliance', linkLabel: 'Explore compliance and certification', tone: '145', tag: 'DELIVERABLES', parts: ['Annex A', 'Documents', 'Package'] },
  ];
  const captures = [
    { file: 'register-knowledge-gpioafsel', caption: 'Register Knowledge · source linked to page-cited hardware documentation' },
    { file: 'misra', caption: 'MISRA diagnostics · findings from analysis of a real firmware project' },
    { file: 'records-reviews', caption: 'Review records · named authors, reviewers, and recorded decisions' },
    { file: 'audit-log', caption: 'Audit Trail · project history recorded in a hash-chained ledger' },
    { file: 'do178c-documents', caption: 'DO-178C documents · the life-cycle document set and its open work' },
  ];
  const pts = p => p.map(([x,y]) => `${x},${y}`).join(' ');
  class NoyceAnatomy extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true'; this.current = 0; this.expanded = true; this.view = 'screens';
      const id = `nx-anatomy-${++NoyceAnatomy.count}`;
      this.innerHTML = `<div class="na-explorer">
        <div class="na-toolbar"><span class="na-toolbar-title">One project. Connected evidence.</span><div class="na-views" role="group" aria-label="Workbench view"><button type="button" data-view="screens" aria-pressed="true">IDE screens</button><button type="button" data-view="layers" aria-pressed="false">3D layers</button></div></div>
        <div class="na-layout"><div class="na-navigation"><p class="na-nav-title">Explore the workflow</p><div class="na-layers" role="tablist" aria-label="Workbench layers" aria-orientation="vertical">${layers.map((l,i) => `<button type="button" role="tab" id="${id}-tab-${i}" data-layer="${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="${id}-panel"><span class="na-layer-index" aria-hidden="true">${i + 1}</span><span>${l.label}</span><span class="na-arrow" aria-hidden="true">→</span></button>`).join('')}</div><select class="na-layer-select" aria-label="Select a workbench layer">${layers.map((l,i) => `<option value="${i}">${i + 1}. ${l.label}</option>`).join('')}</select><p class="na-nav-note">Every screen is captured in Noyce IDE on a real firmware project.</p></div>
        <div class="na-content" id="${id}-panel" role="tabpanel" aria-labelledby="${id}-tab-0" tabindex="0">
          <div class="na-stage"><div class="na-capture"><img class="na-shot" width="1600" height="958" loading="lazy" decoding="async" alt=""><button type="button" class="na-enlarge" aria-label="Enlarge selected IDE screen">Enlarge ↗</button></div>
          <div class="na-visual" hidden><svg class="na-svg" viewBox="0 0 600 560" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Five connected workbench layers</title><desc id="${id}-desc">An exploded isometric view from firmware at the bottom to deliverables at the top. Use the workflow tabs to select a layer.</desc><defs>${layers.map((l,i) => `<linearGradient id="${id}-g${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="oklch(31% .035 ${l.tone})"/><stop offset="1" stop-color="oklch(20% .015 ${l.tone})"/></linearGradient>`).join('')}</defs><path class="na-axis" d="M300 68V506 M74 400L300 518 526 400"/>${layers.map((l,i) => this.plate(l,i,id)).join('')}</svg><button type="button" class="na-assemble" aria-pressed="false">Assemble layers</button></div></div>
          <div class="na-caption"></div><div class="na-detail" aria-live="polite" aria-atomic="true"><h3></h3><p></p><a></a></div>
        </div></div></div>`;
      this.addEventListener('click', e => {
        const plate = e.target.closest('[data-plate]');
        if (plate) { this.current = Number(plate.dataset.plate); this.update(); return; }
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.layer !== undefined) this.current = Number(b.dataset.layer);
        if (b.classList.contains('na-assemble')) this.expanded = !this.expanded;
        if (b.dataset.view) this.view = b.dataset.view;
        if (b.classList.contains('na-enlarge')) { this.enlarge(b); return; }
        this.update();
      });
      this.querySelector('.na-layer-select').addEventListener('change', e => { this.current = Number(e.target.value); this.update(); });
      this.querySelector('.na-layers').addEventListener('keydown', e => {
        const next = e.key === 'ArrowDown' ? (this.current + 1) % layers.length : e.key === 'ArrowUp' ? (this.current + layers.length - 1) % layers.length : e.key === 'Home' ? 0 : e.key === 'End' ? layers.length - 1 : -1;
        if (next < 0) return;
        e.preventDefault(); this.current = next; this.update(); this.querySelectorAll('[data-layer]')[next].focus();
      });
      this.update();
    }
    enlarge(trigger) {
      const dialog = document.createElement('dialog'); dialog.className = 'na-zoom'; dialog.setAttribute('aria-label', captures[this.current].caption);
      const img = this.querySelector('.na-shot').cloneNode(); img.removeAttribute('loading');
      const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close ×'; close.setAttribute('aria-label', 'Close enlarged workbench screen'); close.addEventListener('click', () => dialog.close());
      dialog.append(img, close); dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => { dialog.remove(); trigger.focus(); }, { once: true }); document.body.append(dialog); dialog.showModal();
    }
    plate(l,i,id) {
      const y = 395 - i * 67;
      const A = [80,y], B = [295,y-100], C = [520,y], D = [305,y+104];
      const drop = ([x,y]) => [x,y+13];
      // Extruded planes, conductive traces and three components form each technical layer.
      return `<g class="na-plate" data-plate="${i}" style="--na-tone:${l.tone};--na-stack:${(i-2)*52}px"><polygon class="na-side" points="${pts([A,D,drop(D),drop(A)])}"/><polygon class="na-front" points="${pts([D,C,drop(C),drop(D)])}"/><polygon class="na-top" fill="url(#${id}-g${i})" points="${pts([A,B,C,D])}"/><g class="na-circuit"><path d="M143 ${y-7}l74 35 62-29 60 29 100-45 M192 ${y-40}l71 34 44-21 86 42 M240 ${y-63}l60 28 46-21"/>${[0,1,2].map(k => `<circle cx="${217+k*73}" cy="${y+28-k*14}" r="3"/>`).join('')}</g>${l.parts.map((p,k) => {
        const x = 180+k*78, cy = y-21+k*9;
        return `<polygon class="na-chip" points="${pts([[x,cy],[x+40,cy-19],[x+89,cy+4],[x+49,cy+24]])}"/><path class="na-chip-edge" d="M${x} ${cy}v7l49 24 40-20v-7"/><text class="na-component" x="${x+44}" y="${cy+5}" text-anchor="middle" transform="rotate(26 ${x+44} ${cy+5})">${p}</text>`;
      }).join('')}<text class="na-plate-label" x="126" y="${y+20}" transform="rotate(26 126 ${y+20})">${l.tag}</text><circle class="na-led" cx="305" cy="${y+93}" r="3"/></g>`;
    }
    update() {
      const l = layers[this.current];
      this.querySelector('.na-layer-select').value = String(this.current);
      this.dataset.expanded = String(this.expanded);
      this.querySelectorAll('[data-layer]').forEach(b => { const selected = Number(b.dataset.layer) === this.current; b.setAttribute('aria-selected', String(selected)); b.tabIndex = selected ? 0 : -1; });
      this.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === this.view)));
      this.querySelector('.na-content').setAttribute('aria-labelledby', this.querySelector('[data-layer][aria-selected="true"]').id);
      this.querySelector('.na-capture').hidden = this.view !== 'screens';
      this.querySelector('.na-visual').hidden = this.view !== 'layers';
      const image = this.querySelector('.na-shot');
      const src = (this.dataset.docsBase || '/docs/') + 'img/' + captures[this.current].file + '.webp';
      if (image.getAttribute('src') !== src) image.setAttribute('src', src);
      image.alt = captures[this.current].caption;
      this.querySelector('.na-caption').textContent = this.view === 'screens' ? captures[this.current].caption : `${this.current + 1} of ${layers.length} · ${l.label} · ${l.detail}`;
      this.querySelectorAll('[data-plate]').forEach(p => p.dataset.active = String(Number(p.dataset.plate) === this.current));
      const assemble = this.querySelector('.na-assemble');
      assemble.textContent = this.expanded ? 'Assemble layers' : 'Explode layers'; assemble.setAttribute('aria-pressed', String(!this.expanded));
      this.querySelector('.na-detail h3').textContent = l.name;
      this.querySelector('.na-detail p').textContent = l.text;
      const a = this.querySelector('.na-detail a'); a.href = (this.dataset.docsBase || '/docs/') + l.link; a.textContent = l.linkLabel + ' ↗';
    }
  }
  NoyceAnatomy.count = 0;
  if (!customElements.get('noyce-anatomy')) customElements.define('noyce-anatomy', NoyceAnatomy);
})();
