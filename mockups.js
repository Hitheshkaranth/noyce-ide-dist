/* mockups.js — rich SVG mockups of Noyce IDE panels.
   Each function returns an <svg> string. Aspect 16/10 or 16/9 as noted. */

const NS = "http://www.w3.org/2000/svg";

/* ---------- shared chrome ---------- */
function ideChrome(title, rightTabs = []) {
  const tabHTML = rightTabs.map((t, i) => `<rect x="${110 + i * 90}" y="36" width="80" height="22" rx="4" fill="${i === 0 ? '#1c232d' : 'transparent'}" stroke="${i === 0 ? '#2a323e' : 'transparent'}"/>
    <text x="${150 + i * 90}" y="51" text-anchor="middle" fill="${i === 0 ? '#e8f0fa' : '#8a98ac'}" font-family="Geist Mono, monospace" font-size="10">${t}</text>`).join('');
  return `
    <rect x="0" y="0" width="100%" height="100%" fill="#0f141c"/>
    <rect x="0" y="0" width="100%" height="30" fill="#0a0e15"/>
    <circle cx="14" cy="15" r="4" fill="#ff5f57"/>
    <circle cx="30" cy="15" r="4" fill="#febc2e"/>
    <circle cx="46" cy="15" r="4" fill="#28c840"/>
    <text x="50%" y="19" text-anchor="middle" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">${title}</text>
    <rect x="0" y="30" width="100%" height="36" fill="#0c111a"/>
    ${tabHTML}
  `;
}

/* ---------- 01 Project Graph ---------- */
function projectGraph() {
  const nodes = [
    { x: 220, y: 200, r: 22, c: '#8ee6ff', l: 'main' },
    { x: 360, y: 140, r: 14, c: '#52c4ff', l: 'hal' },
    { x: 420, y: 240, r: 14, c: '#52c4ff', l: 'rtos' },
    { x: 540, y: 180, r: 10, c: '#00e676', l: 'gpio' },
    { x: 600, y: 280, r: 10, c: '#00e676', l: 'uart' },
    { x: 320, y: 320, r: 12, c: '#ffc66d', l: 'isr' },
    { x: 180, y: 360, r: 10, c: '#7c4dff', l: 'log' },
    { x: 700, y: 220, r: 8, c: '#00e676', l: 'spi' },
    { x: 640, y: 360, r: 9, c: '#ff6dc7', l: 'test' },
    { x: 480, y: 380, r: 8, c: '#ffc66d', l: 'fault' },
    { x: 760, y: 320, r: 7, c: '#52c4ff', l: 'i2c' },
    { x: 280, y: 80, r: 8, c: '#7c4dff', l: 'req' },
  ];
  const edges = [
    [0,1],[0,2],[1,3],[1,4],[2,5],[2,3],[0,6],[3,7],[5,8],[5,9],[7,10],[0,11],[6,9],[1,7],[4,9]
  ];
  const edgesSvg = edges.map(([a,b]) => {
    const A = nodes[a], B = nodes[b];
    return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="#2a3340" stroke-width="1"/>`;
  }).join('');
  const nodesSvg = nodes.map(n => `
    <g>
      <circle cx="${n.x}" cy="${n.y}" r="${n.r + 6}" fill="${n.c}" opacity="0.12"/>
      <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${n.c}" opacity="0.85"/>
      <circle cx="${n.x}" cy="${n.y}" r="${n.r - 3}" fill="#0a0e15"/>
      <text x="${n.x}" y="${n.y + n.r + 14}" text-anchor="middle" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="10">${n.l}.c</text>
    </g>`).join('');
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">
    ${ideChrome('project-graph — Noyce Workspace', ['Graph', 'Files', 'Search'])}
    <rect x="0" y="66" width="100%" height="100%" fill="url(#bgGrad)"/>
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#0f141c"/>
        <stop offset="100%" stop-color="#06090f"/>
      </radialGradient>
    </defs>
    <g transform="translate(0, 70)">
      ${edgesSvg}
      ${nodesSvg}
    </g>
    <g transform="translate(20, 480)">
      <rect width="220" height="40" rx="6" fill="#0c111a" stroke="#1c232d"/>
      <text x="14" y="18" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">NODES</text>
      <text x="14" y="32" fill="#e8f0fa" font-family="Geist Mono, monospace" font-size="14">142 · 1.2k edges</text>
    </g>
    <g transform="translate(720, 480)">
      <rect width="220" height="40" rx="6" fill="#0c111a" stroke="#1c232d"/>
      <text x="14" y="18" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">SIDECAR</text>
      <text x="14" y="32" fill="#00e676" font-family="Geist Mono, monospace" font-size="14">● indexed in 412ms</text>
    </g>
  </svg>`;
}

/* ---------- 02 Compliance Dashboard ---------- */
function complianceDashboard() {
  const tableRows = [
    ['A-1', 'Software development plan',    'Linked',   '#00e676'],
    ['A-2', 'Software verification plan',    'Linked',   '#00e676'],
    ['A-3', 'Software configuration mgmt',   'Linked',   '#00e676'],
    ['A-4', 'Software quality assurance',    'Linked',   '#00e676'],
    ['A-5', 'High-level requirements',        'Linked',   '#00e676'],
    ['A-6', 'Low-level requirements',         'Pending',  '#ffc66d'],
    ['A-7', 'Source code review',             'Pending',  '#ffc66d'],
    ['A-8', 'Executable object code',         'Open',     '#ff6d6d'],
  ];
  const rowsSvg = tableRows.map((r,i) => `
    <g transform="translate(20, ${110 + i * 30})">
      <text x="0" y="14" fill="#8ee6ff" font-family="Geist Mono, monospace" font-size="11">${r[0]}</text>
      <text x="50" y="14" fill="#c4d2e4" font-family="Geist, sans-serif" font-size="12">${r[1]}</text>
      <rect x="380" y="3" width="60" height="16" rx="3" fill="${r[3]}" opacity="0.15"/>
      <text x="410" y="14" text-anchor="middle" fill="${r[3]}" font-family="Geist Mono, monospace" font-size="10">${r[2]}</text>
    </g>`).join('');

  // doughnut
  const total = 12, linked = 10;
  const C = 2 * Math.PI * 50;
  const off = C * (1 - linked / total);
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">
    ${ideChrome('compliance-dashboard — DO-178C Table A', ['Compliance','Trace','Reqs'])}
    <!-- left panel: table -->
    <g transform="translate(40, 80)">
      <text x="0" y="0" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="14" font-weight="500">Objectives · Level A</text>
      <text x="0" y="18" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">10 / 12 LINKED</text>
      ${rowsSvg}
    </g>
    <!-- right panel: rings -->
    <g transform="translate(560, 100)">
      <rect x="0" y="0" width="360" height="180" rx="10" fill="#0c111a" stroke="#1c232d"/>
      <text x="20" y="26" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13" font-weight="500">DO-178C objectives</text>
      <g transform="translate(80, 100)">
        <circle r="50" fill="none" stroke="#1c232d" stroke-width="8"/>
        <circle r="50" fill="none" stroke="#00e676" stroke-width="8" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90)"/>
        <text y="2" text-anchor="middle" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="20" font-weight="500">10/12</text>
        <text y="20" text-anchor="middle" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="9">LINKED</text>
      </g>
      <g transform="translate(220, 50)">
        <text fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">MISRA-C</text>
        <text y="22" fill="#ffc66d" font-family="Geist, sans-serif" font-size="22" font-weight="500">170</text>
        <text y="40" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="9">OPEN VIOLATIONS</text>
      </g>
      <g transform="translate(220, 100)">
        <text fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">MC/DC COVERAGE</text>
        <text y="22" fill="#8ee6ff" font-family="Geist, sans-serif" font-size="22" font-weight="500">87.3%</text>
      </g>
    </g>
    <g transform="translate(560, 310)">
      <rect x="0" y="0" width="360" height="180" rx="10" fill="#0c111a" stroke="#1c232d"/>
      <text x="20" y="26" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13" font-weight="500">Verification activities</text>
      <g transform="translate(20, 50)" font-family="Geist Mono, monospace" font-size="10" fill="#c4d2e4">
        <text y="14">Unit · 6/12 <tspan fill="#ffc66d">▮▮▮▮▮▮</tspan><tspan fill="#1c232d">▮▮▮▮▮▮</tspan></text>
        <text y="34">Integ · 4/8 <tspan fill="#8ee6ff">▮▮▮▮</tspan><tspan fill="#1c232d">▮▮▮▮</tspan></text>
        <text y="54">HW/SW · 2/6 <tspan fill="#7c4dff">▮▮</tspan><tspan fill="#1c232d">▮▮▮▮</tspan></text>
        <text y="74">MC/DC · 11/12 <tspan fill="#00e676">▮▮▮▮▮▮▮▮▮▮▮</tspan><tspan fill="#1c232d">▮</tspan></text>
        <text y="100" fill="#8a98ac" font-size="10">Last verified · 2 min ago</text>
      </g>
    </g>
  </svg>`;
}

/* ---------- 03 Traceability Graph ---------- */
function traceability() {
  const cols = [
    { x: 80,  y: 90,  label: 'REQ', color: '#8ee6ff', items: ['REQ-001 Brake actuation','REQ-002 Fault detection','REQ-003 Watchdog reset','REQ-004 ASIL-D timer','REQ-005 Sensor fusion'] },
    { x: 380, y: 90,  label: 'DESIGN', color: '#00e676', items: ['DES-101 Brake controller','DES-102 Diagnostic module','DES-103 Watchdog HAL','DES-104 Timer interrupt','DES-105 Fusion pipeline'] },
    { x: 680, y: 90,  label: 'TEST', color: '#ffc66d', items: ['TST-201 Brake unit','TST-202 Fault injection','TST-203 Watchdog timeout','TST-204 Timer accuracy','TST-205 Fusion harness'] },
  ];
  let svg = ideChrome('traceability-graph — REQ ⇄ DESIGN ⇄ TEST', ['Trace','Audit','Scan']);
  cols.forEach(col => {
    svg += `<text x="${col.x}" y="100" fill="${col.color}" font-family="Geist Mono, monospace" font-size="11">${col.label}</text>`;
    col.items.forEach((it, i) => {
      svg += `<g transform="translate(${col.x},${120 + i * 60})">
        <rect width="220" height="44" rx="6" fill="#0c111a" stroke="${col.color}" stroke-opacity="0.3"/>
        <circle cx="14" cy="22" r="3" fill="${col.color}"/>
        <text x="28" y="20" fill="#e8f0fa" font-family="Geist Mono, monospace" font-size="11">${it.split(' ')[0]}</text>
        <text x="28" y="34" fill="#8a98ac" font-family="Geist, sans-serif" font-size="11">${it.split(' ').slice(1).join(' ')}</text>
      </g>`;
    });
  });
  // edges
  for (let i = 0; i < 5; i++) {
    const y = 142 + i * 60;
    svg += `<path d="M ${300} ${y} C ${340} ${y}, ${340} ${y}, ${380} ${y}" stroke="#2a3340" stroke-width="1" fill="none" stroke-dasharray="3 3"/>`;
    svg += `<path d="M ${600} ${y} C ${640} ${y}, ${640} ${y}, ${680} ${y}" stroke="#2a3340" stroke-width="1" fill="none" stroke-dasharray="3 3"/>`;
  }
  // active highlighted thread
  svg += `<path d="M 300 142 C 340 142, 340 142, 380 142 L 600 142 C 640 142, 640 142, 680 142" stroke="#8ee6ff" stroke-width="1.5" fill="none" opacity="0.7"/>`;
  svg += `<text x="40" y="510" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">scan-workspace · 1,284 links · audit log ▸ ready for export</text>`;
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 04 AI Orchestrator (kanban) ---------- */
function aiOrchestrator() {
  const cols = [
    { x: 30, w: 218, t: 'Backlog', items: [
      { who: 'System Designer', what: 'Decompose REQ-014', tag: 'spec', color: '#8ee6ff' },
      { who: 'Tester', what: 'Author MC/DC harness', tag: 'test', color: '#ffc66d' },
      { who: 'Doc Specialist', what: 'Update SDP §4.2', tag: 'doc', color: '#7c4dff' },
    ]},
    { x: 258, w: 218, t: 'In progress', items: [
      { who: 'Coder', what: 'Implement watchdog HAL', tag: 'code', color: '#00e676' },
      { who: 'Reviewer', what: 'Review PR #214', tag: 'review', color: '#ff6dc7' },
    ]},
    { x: 486, w: 218, t: 'Verifying', items: [
      { who: 'Tester', what: 'Run TST-204 ×128 iter', tag: 'verify', color: '#ffc66d' },
      { who: 'Traceability Monitor', what: 'Re-link REQ→TST', tag: 'trace', color: '#52c4ff' },
    ]},
    { x: 714, w: 218, t: 'Done', items: [
      { who: 'Coder', what: 'GPIO IRQ refactor', tag: 'merged', color: '#00e676' },
      { who: 'Reviewer', what: 'PR #209 approved', tag: 'merged', color: '#00e676' },
    ]},
  ];
  let svg = ideChrome('ai-orchestrator — Sprint #14', ['Board','Sprint','Personas']);
  cols.forEach(col => {
    svg += `<text x="${col.x + 14}" y="98" fill="#c4d2e4" font-family="Geist, sans-serif" font-size="12" font-weight="500">${col.t}</text>`;
    svg += `<text x="${col.x + col.w - 14}" y="98" text-anchor="end" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">${col.items.length}</text>`;
    svg += `<rect x="${col.x}" y="110" width="${col.w}" height="380" rx="10" fill="#0c111a" stroke="#1c232d"/>`;
    col.items.forEach((it, i) => {
      svg += `<g transform="translate(${col.x + 12}, ${124 + i * 110})">
        <rect width="${col.w - 24}" height="92" rx="8" fill="#161c24" stroke="#1c232d"/>
        <circle cx="14" cy="18" r="4" fill="${it.color}"/>
        <text x="26" y="22" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="10">${it.who.toUpperCase()}</text>
        <text x="14" y="46" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13">${it.what}</text>
        <rect x="14" y="62" width="48" height="18" rx="3" fill="${it.color}" opacity="0.14"/>
        <text x="38" y="74" text-anchor="middle" fill="${it.color}" font-family="Geist Mono, monospace" font-size="10">${it.tag}</text>
        <text x="${col.w - 38}" y="74" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">#${214 - i}</text>
      </g>`;
    });
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 05 AI Models (provider matrix) ---------- */
function aiModels() {
  const providers = [
    { name: 'Anthropic',  model: 'claude-sonnet-4.5', ctx: '200k', ms: 380, status: 'active',  color: '#ffc66d' },
    { name: 'OpenAI',     model: 'gpt-5',             ctx: '128k', ms: 420, status: 'ready',   color: '#00e676' },
    { name: 'Google',     model: 'gemini-2.5-pro',    ctx: '1M',   ms: 510, status: 'ready',   color: '#8ee6ff' },
    { name: 'Ollama',     model: 'qwen2.5-coder:32b', ctx: '32k',  ms: 80,  status: 'local',   color: '#7c4dff' },
    { name: 'LM Studio',  model: 'llama-3.3-70b',     ctx: '32k',  ms: 110, status: 'local',   color: '#7c4dff' },
    { name: 'Mistral',    model: 'codestral-25.01',   ctx: '256k', ms: 320, status: 'ready',   color: '#00e676' },
  ];
  let svg = ideChrome('ai-models — Provider Matrix', ['Models','Routing','Costs']);
  svg += `<g transform="translate(40, 80)">
    <text fill="#e8f0fa" font-family="Geist, sans-serif" font-size="14" font-weight="500">Configured providers</text>
    <text y="18" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">5 ACTIVE · ROUTE BY COST + LATENCY</text>
  </g>`;
  // header
  svg += `<g transform="translate(40, 140)" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">
    <text x="0">PROVIDER</text>
    <text x="180">MODEL</text>
    <text x="500">CTX</text>
    <text x="580">P50 ms</text>
    <text x="700">STATUS</text>
  </g>`;
  providers.forEach((p, i) => {
    const y = 170 + i * 52;
    svg += `<g transform="translate(40, ${y})">
      <rect width="880" height="42" rx="6" fill="#0c111a" stroke="#1c232d"/>
      <circle cx="16" cy="21" r="4" fill="${p.color}"/>
      <text x="30" y="26" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13">${p.name}</text>
      <text x="180" y="26" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="11">${p.model}</text>
      <text x="500" y="26" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="11">${p.ctx}</text>
      <text x="580" y="26" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="11">${p.ms}</text>
      <rect x="700" y="12" width="70" height="18" rx="3" fill="${p.color}" opacity="0.14"/>
      <text x="735" y="25" text-anchor="middle" fill="${p.color}" font-family="Geist Mono, monospace" font-size="10">${p.status.toUpperCase()}</text>
      <text x="820" y="26" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">⚙</text>
    </g>`;
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 06 Build Pipeline ---------- */
function buildPipeline() {
  const stages = [
    { t: 'Configure',  m: 'cmake · gen', s: 'ok',     time: '0.4s' },
    { t: 'Compile',    m: 'arm-gcc · -O2',  s: 'ok',     time: '12.1s' },
    { t: 'Lint',       m: 'misra · 0 viol',  s: 'ok',     time: '3.2s' },
    { t: 'Test',       m: 'unity · 184 pass',s: 'ok',     time: '8.7s' },
    { t: 'Coverage',   m: 'MC/DC 87.3%',     s: 'warn',   time: '5.1s' },
    { t: 'Sign',       m: 'ed25519 · ok',    s: 'ok',     time: '0.2s' },
    { t: 'Flash',      m: 'stm32 · 612KB',   s: 'ready',  time: '—' },
  ];
  let svg = ideChrome('build-pipeline — release/v1.0.5', ['Build','Logs','Targets']);
  // top bar with stages
  stages.forEach((s, i) => {
    const x = 40 + i * 128;
    const fill = s.s === 'ok' ? '#00e676' : s.s === 'warn' ? '#ffc66d' : '#8a98ac';
    svg += `<g transform="translate(${x}, 90)">
      <rect width="116" height="100" rx="10" fill="#0c111a" stroke="#1c232d"/>
      <circle cx="14" cy="14" r="4" fill="${fill}"/>
      <text x="24" y="18" fill="${fill}" font-family="Geist Mono, monospace" font-size="9">${s.s.toUpperCase()}</text>
      <text x="14" y="48" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="14">${s.t}</text>
      <text x="14" y="70" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="10">${s.m}</text>
      <text x="14" y="88" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">${s.time}</text>
    </g>`;
    if (i < stages.length - 1) {
      svg += `<line x1="${x + 116}" y1="140" x2="${x + 128}" y2="140" stroke="#2a3340" stroke-width="1.5"/>`;
    }
  });
  // log
  svg += `<g transform="translate(40, 220)">
    <rect width="880" height="270" rx="10" fill="#0a0e15" stroke="#1c232d"/>
    <text x="20" y="28" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">BUILD LOG · release/v1.0.5</text>
  </g>`;
  const lines = [
    ['[16:42:01]','./build/main.elf','     ', 'arm-none-eabi-gcc -mcpu=cortex-m7 -O2'],
    ['[16:42:13]','OK','            ',        'compile: 184 units, 0 errors, 0 warnings'],
    ['[16:42:17]','MISRA','         ',        'analyzer: 170 advisories (deviated), 0 mandatory'],
    ['[16:42:26]','UNIT','          ',        'unity: 184 passed in 8.7s'],
    ['[16:42:31]','MC/DC','         ',        'coverage: 87.3% (target 90%, 14 conditions remain)'],
    ['[16:42:31]','SIGN','          ',        'ed25519 signature · keyid 0xA8FE..2C19'],
    ['[16:42:32]','ARTIFACT','      ',        'noyce-firmware-1.0.5-stm32h7.bin (612 KB)'],
  ];
  lines.forEach((l, i) => {
    const y = 270 + i * 20;
    svg += `<g transform="translate(60, ${y})" font-family="Geist Mono, monospace" font-size="11">
      <text fill="#52c4ff">${l[0]}</text>
      <text x="80" fill="${l[1] === 'OK' || l[1] === 'UNIT' ? '#00e676' : l[1] === 'MC/DC' ? '#ffc66d' : '#7c4dff'}">${l[1]}</text>
      <text x="180" fill="#c4d2e4">${l[3]}</text>
    </g>`;
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 07 Project Templates ---------- */
function projectTemplates() {
  const cards = [
    { vendor: 'STMicro', mcu: 'STM32H743', desc: 'Cortex-M7 · 480 MHz · ARINC 653', cert: 'DO-178C A', c: '#8ee6ff' },
    { vendor: 'TI',      mcu: 'Tiva C TM4C', desc: 'Cortex-M4F · 120 MHz · ISO 26262', cert: 'ASIL D', c: '#00e676' },
    { vendor: 'Microchip', mcu: 'PIC32MZ EF', desc: 'MIPS M-Class · 252 MHz · IEC 62304', cert: 'Class C', c: '#ffc66d' },
    { vendor: 'Raspberry Pi', mcu: 'RP2040', desc: 'Dual Cortex-M0+ · 133 MHz · MISRA', cert: 'MISRA C:2012', c: '#7c4dff' },
    { vendor: 'NXP',     mcu: 'i.MX RT1170', desc: 'Cortex-M7+M4 · 1 GHz · AUTOSAR', cert: 'AUTOSAR CP', c: '#ff6dc7' },
    { vendor: 'Generic', mcu: 'Cortex-M33', desc: 'TrustZone · 200 MHz · IEC 61508', cert: 'SIL 3', c: '#52c4ff' },
  ];
  let svg = ideChrome('project-templates — New Workspace', ['Templates','Custom','Recents']);
  svg += `<text x="40" y="98" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="16" font-weight="500">Certification-ready starters</text>
    <text x="40" y="118" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">6 templates · pre-wired CMake · linker · HAL · MISRA profile</text>`;
  cards.forEach((c, i) => {
    const x = 40 + (i % 3) * 296;
    const y = 150 + Math.floor(i / 3) * 175;
    svg += `<g transform="translate(${x}, ${y})">
      <rect width="280" height="160" rx="12" fill="#0c111a" stroke="#1c232d"/>
      <rect x="0" y="0" width="280" height="2" fill="${c.c}"/>
      <text x="18" y="32" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">${c.vendor.toUpperCase()}</text>
      <text x="18" y="60" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="20" font-weight="500">${c.mcu}</text>
      <text x="18" y="86" fill="#c4d2e4" font-family="Geist, sans-serif" font-size="12">${c.desc}</text>
      <rect x="18" y="108" width="120" height="22" rx="4" fill="${c.c}" opacity="0.14"/>
      <text x="78" y="123" text-anchor="middle" fill="${c.c}" font-family="Geist Mono, monospace" font-size="10">${c.cert}</text>
      <text x="262" y="148" text-anchor="end" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">USE →</text>
    </g>`;
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 08 Review Workflow ---------- */
function reviewWorkflow() {
  let svg = ideChrome('review-workflow — PR #214 watchdog-hal', ['Diff','Comments','Bots']);
  // diff
  svg += `<g transform="translate(30, 90)">
    <rect width="560" height="400" rx="10" fill="#0c111a" stroke="#1c232d"/>
    <text x="20" y="26" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">src/hal/watchdog.c · +24 −6</text>
  </g>`;
  const code = [
    ['  9', ' ', 'void wdt_init(uint32_t timeout_ms) {',                '#c4d2e4'],
    [' 10', '-', '  WDT->CTRL |= WDT_EN | WDT_RESET;',                  '#ff6d6d'],
    [' 11', '+', '  /* MISRA-C:2012 R.11.5 — explicit cast */',         '#00e676'],
    [' 12', '+', '  WDT->CTRL = (uint32_t)(WDT_EN | WDT_RESET);',       '#00e676'],
    [' 13', '+', '  WDT->LOAD = ms_to_ticks(timeout_ms);',              '#00e676'],
    [' 14', ' ', '  wdt_kick();',                                       '#c4d2e4'],
    [' 15', ' ', '}',                                                   '#c4d2e4'],
    [' 16', ' ', '',                                                    '#c4d2e4'],
    [' 17', '+', 'void wdt_kick(void) {',                               '#00e676'],
    [' 18', '+', '  WDT->FEED = WDT_FEED_KEY;',                         '#00e676'],
    [' 19', '+', '}',                                                   '#00e676'],
  ];
  code.forEach((l, i) => {
    const y = 120 + i * 22;
    const bg = l[1] === '+' ? '#00e6761a' : l[1] === '-' ? '#ff6d6d1a' : 'transparent';
    svg += `<rect x="30" y="${y - 16}" width="560" height="22" fill="${bg}"/>
      <text x="46" y="${y}" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">${l[0]}</text>
      <text x="82" y="${y}" fill="${l[1] === '+' ? '#00e676' : l[1] === '-' ? '#ff6d6d' : '#8a98ac'}" font-family="Geist Mono, monospace" font-size="11">${l[1]}</text>
      <text x="100" y="${y}" fill="${l[3]}" font-family="Geist Mono, monospace" font-size="11">${l[2]}</text>`;
  });
  // right panel — bot reviews
  svg += `<g transform="translate(620, 90)">
    <rect width="300" height="400" rx="10" fill="#0c111a" stroke="#1c232d"/>
    <text x="20" y="26" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13" font-weight="500">Review hub</text>
  </g>`;
  const reviewers = [
    { who: 'Reviewer · AI', verdict: 'Approved', text: 'MISRA R.11.5 fix is correct. wdt_kick now exposed.', c: '#00e676' },
    { who: 'Tester · AI',   verdict: 'Tests added', text: 'TST-204 timer accuracy ±0.5% verified, 128 iter.', c: '#ffc66d' },
    { who: 'Traceability',  verdict: 'Linked', text: 'REQ-003 ⇄ DES-103 ⇄ TST-203 thread updated.', c: '#52c4ff' },
    { who: 'Doc Specialist', verdict: 'Drafted', text: 'SDP §4.2 watchdog reset rationale appended.', c: '#7c4dff' },
  ];
  reviewers.forEach((r, i) => {
    const y = 130 + i * 80;
    svg += `<g transform="translate(640, ${y})">
      <circle cx="0" cy="14" r="6" fill="${r.c}"/>
      <text x="14" y="14" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="12" font-weight="500">${r.who}</text>
      <text x="14" y="30" fill="${r.c}" font-family="Geist Mono, monospace" font-size="10">${r.verdict.toUpperCase()}</text>
      <text x="14" y="52" fill="#c4d2e4" font-family="Geist, sans-serif" font-size="11">${r.text}</text>
    </g>`;
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 09 Noyce AI Launcher (the hero panel) ---------- */
function aiLauncher() {
  let svg = ideChrome('Noyce IDE — main.c · watchdog-hal', ['Editor','AI','Pins','Trace']);
  // sidebar
  svg += `<rect x="0" y="66" width="56" height="100%" fill="#0a0e15"/>
    <g transform="translate(20, 90)" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="14">
      <text y="0">≡</text>
      <text y="36" fill="#8ee6ff">⌘</text>
      <text y="72">⌥</text>
      <text y="108">↯</text>
      <text y="144">⊞</text>
      <text y="180">◈</text>
    </g>`;
  // file tree
  svg += `<rect x="56" y="66" width="180" height="100%" fill="#0c111a"/>
    <g transform="translate(70, 96)" font-family="Geist Mono, monospace" font-size="11">
      <text fill="#8a98ac" font-size="10">EXPLORER</text>
      <text y="24" fill="#c4d2e4">▾ src</text>
      <text y="42" fill="#c4d2e4">  ▾ hal</text>
      <text y="60" fill="#8ee6ff">    watchdog.c</text>
      <text y="78" fill="#c4d2e4">    gpio.c</text>
      <text y="96" fill="#c4d2e4">    uart.c</text>
      <text y="114" fill="#c4d2e4">  ▾ app</text>
      <text y="132" fill="#c4d2e4">    main.c</text>
      <text y="150" fill="#c4d2e4">  ▸ rtos</text>
      <text y="168" fill="#c4d2e4">  ▸ drivers</text>
      <text y="186" fill="#c4d2e4">▸ tests</text>
      <text y="204" fill="#c4d2e4">▸ compliance</text>
      <text y="222" fill="#c4d2e4">▸ build</text>
    </g>`;
  // editor
  svg += `<rect x="236" y="66" width="500" height="100%" fill="#0f141c"/>`;
  const code = [
    [' 1', '#include "watchdog.h"',                         '#7c4dff','#c4d2e4'],
    [' 2', '#include "rtos.h"',                              '#7c4dff','#c4d2e4'],
    [' 3', '',                                              '',''],
    [' 4', '/* REQ-003 · ASIL-D watchdog */',               '#8a98ac','#8a98ac'],
    [' 5', 'void task_safety(void *arg) {',                 '#ffc66d','#c4d2e4'],
    [' 6', '  wdt_init(50);  /* 50 ms */',                  '#c4d2e4','#c4d2e4'],
    [' 7', '  for (;;) {',                                  '#ff6dc7','#c4d2e4'],
    [' 8', '    if (sensor_ok()) {',                        '#ff6dc7','#c4d2e4'],
    [' 9', '      wdt_kick();',                             '#c4d2e4','#00e676'],
    ['10', '    }',                                         '#c4d2e4','#c4d2e4'],
    ['11', '    rtos_delay(10);',                           '#c4d2e4','#c4d2e4'],
    ['12', '  }',                                           '#c4d2e4','#c4d2e4'],
    ['13', '}',                                             '#ffc66d','#c4d2e4'],
  ];
  code.forEach((l, i) => {
    const y = 100 + i * 22;
    svg += `<text x="250" y="${y}" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">${l[0]}</text>
      <text x="280" y="${y}" fill="${l[3]}" font-family="Geist Mono, monospace" font-size="12">${l[1]}</text>`;
  });
  // AI launcher panel (the hero element)
  svg += `<g transform="translate(740, 90)">
    <rect width="200" height="420" rx="10" fill="#0c111a" stroke="#7c4dff" stroke-opacity="0.3"/>
    <rect x="0" y="0" width="200" height="2" rx="1" fill="url(#aiGrad)"/>
    <defs>
      <linearGradient id="aiGrad" x1="0" x2="1">
        <stop offset="0" stop-color="#8ee6ff"/>
        <stop offset="0.5" stop-color="#00e676"/>
        <stop offset="1" stop-color="#7c4dff"/>
      </linearGradient>
    </defs>
    <text x="14" y="24" fill="#7c4dff" font-family="Geist Mono, monospace" font-size="10">NOYCE AI</text>
    <text x="14" y="46" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13" font-weight="500">Ask · /trace REQ-003</text>
    <rect x="14" y="56" width="172" height="34" rx="6" fill="#161c24" stroke="#1c232d"/>
    <text x="22" y="78" fill="#8a98ac" font-family="Geist, sans-serif" font-size="11">claude-sonnet-4.5</text>
    <text x="178" y="78" text-anchor="end" fill="#7c4dff" font-family="Geist Mono, monospace" font-size="10">▸</text>
    <text x="14" y="118" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="9">ACTIONS</text>
  </g>`;
  const actions = [
    { i: '↯', t: 'Decompose req',    c: '#8ee6ff' },
    { i: '⊕', t: 'Generate test',    c: '#ffc66d' },
    { i: '◈', t: 'Review diff',      c: '#ff6dc7' },
    { i: '☰', t: 'Doc rationale',    c: '#7c4dff' },
    { i: '⌖', t: 'Trace links',      c: '#52c4ff' },
    { i: '✓', t: 'Verify MC/DC',     c: '#00e676' },
  ];
  actions.forEach((a, i) => {
    const y = 130 + i * 40;
    svg += `<g transform="translate(754, ${y})">
      <rect width="172" height="32" rx="6" fill="#161c24" stroke="#1c232d"/>
      <circle cx="18" cy="16" r="10" fill="${a.c}" opacity="0.18"/>
      <text x="18" y="20" text-anchor="middle" fill="${a.c}" font-family="Geist Mono, monospace" font-size="11">${a.i}</text>
      <text x="38" y="20" fill="#c4d2e4" font-family="Geist, sans-serif" font-size="11">${a.t}</text>
    </g>`;
  });
  // status bar
  svg += `<rect x="0" y="510" width="100%" height="30" fill="#0a0e15"/>
    <g transform="translate(20, 528)" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="10">
      <text fill="#00e676">● STM32H743 · arm-gcc 13.2</text>
      <text x="220">UTF-8</text>
      <text x="280">LF</text>
      <text x="310" fill="#8ee6ff">MISRA · 0/0</text>
      <text x="410" fill="#ffc66d">MC/DC 87.3%</text>
      <text x="700" fill="#7c4dff">↯ Sonnet 4.5</text>
      <text x="820" fill="#8a98ac">REQ-003 ⇄ TST-204</text>
    </g>`;
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

/* ---------- 10 Pin Configurator ---------- */
function pinConfigurator() {
  let svg = ideChrome('pin-configurator — STM32H743 LQFP-144', ['Pins','Clocks','DMA']);
  // peripheral list left
  const peripherals = [
    { n: 'GPIOA', pins: '16', c: '#8ee6ff' },
    { n: 'USART1', pins: 'TX·PA9 RX·PA10', c: '#00e676' },
    { n: 'SPI1', pins: 'SCK·PB3 MISO·PB4 MOSI·PB5', c: '#ffc66d' },
    { n: 'I2C1', pins: 'SCL·PB6 SDA·PB7', c: '#7c4dff' },
    { n: 'TIM2', pins: 'CH1·PA0 CH2·PA1', c: '#52c4ff' },
    { n: 'CAN1', pins: 'RX·PB8 TX·PB9', c: '#ff6dc7' },
    { n: 'ADC1', pins: 'IN0·PA0 IN1·PA1', c: '#00e676' },
    { n: 'DAC1', pins: 'OUT1·PA4', c: '#ffc66d' },
  ];
  svg += `<text x="40" y="98" fill="#e8f0fa" font-family="Geist, sans-serif" font-size="14" font-weight="500">Peripherals · 8 enabled</text>`;
  peripherals.forEach((p, i) => {
    const y = 120 + i * 46;
    svg += `<g transform="translate(40, ${y})">
      <rect width="260" height="38" rx="6" fill="#0c111a" stroke="#1c232d"/>
      <circle cx="14" cy="19" r="4" fill="${p.c}"/>
      <text x="26" y="17" fill="#e8f0fa" font-family="Geist Mono, monospace" font-size="11">${p.n}</text>
      <text x="26" y="30" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="9">${p.pins}</text>
      <text x="246" y="22" text-anchor="end" fill="${p.c}" font-family="Geist Mono, monospace" font-size="10">●</text>
    </g>`;
  });
  // chip in center
  const cx = 600, cy = 290, size = 200;
  svg += `<g transform="translate(${cx - size/2}, ${cy - size/2})">
    <rect width="${size}" height="${size}" rx="8" fill="#1c232d" stroke="#2a3340"/>
    <rect x="20" y="20" width="${size - 40}" height="${size - 40}" rx="3" fill="#0a0e15" stroke="#2a3340"/>
    <text x="${size/2}" y="${size/2 - 4}" text-anchor="middle" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="11">STM32H743</text>
    <text x="${size/2}" y="${size/2 + 14}" text-anchor="middle" fill="#7c4dff" font-family="Geist Mono, monospace" font-size="9">LQFP-144</text>
    <text x="${size/2}" y="${size/2 + 30}" text-anchor="middle" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="8">CORTEX-M7</text>
  </g>`;
  // pins around chip
  const pinCount = 18;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < pinCount; i++) {
      const t = (i + 0.5) / pinCount;
      const active = Math.random() > 0.7;
      let px, py, w, h;
      if (side === 0) { // top
        px = cx - size/2 + 20 + t * (size - 40); py = cy - size/2 - 10; w = 4; h = 12;
      } else if (side === 1) { // right
        px = cx + size/2 - 2; py = cy - size/2 + 20 + t * (size - 40); w = 12; h = 4;
      } else if (side === 2) { // bottom
        px = cx - size/2 + 20 + t * (size - 40); py = cy + size/2 - 2; w = 4; h = 12;
      } else { // left
        px = cx - size/2 - 10; py = cy - size/2 + 20 + t * (size - 40); w = 12; h = 4;
      }
      const colors = ['#8ee6ff','#00e676','#ffc66d','#7c4dff','#52c4ff','#ff6dc7'];
      const c = active ? colors[Math.floor(Math.random() * colors.length)] : '#2a3340';
      svg += `<rect x="${px}" y="${py}" width="${w}" height="${h}" rx="1" fill="${c}"/>`;
    }
  }
  // beams from peripherals to pins
  const beams = [
    { y1: 139, x2: cx - size/2 - 4, y2: cy - 60 },
    { y1: 185, x2: cx - size/2 - 4, y2: cy - 20 },
    { y1: 231, x2: cx - 30, y2: cy - size/2 - 4 },
    { y1: 277, x2: cx + size/2 + 4, y2: cy - 30 },
    { y1: 323, x2: cx + size/2 + 4, y2: cy + 30 },
  ];
  beams.forEach(b => {
    svg += `<path d="M 300 ${b.y1} Q 450 ${b.y1}, ${b.x2} ${b.y2}" stroke="url(#beamGrad)" stroke-width="1" fill="none" opacity="0.6"/>`;
  });
  svg += `<defs>
    <linearGradient id="beamGrad" x1="0" x2="1">
      <stop offset="0" stop-color="#8ee6ff" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#8ee6ff" stop-opacity="0.9"/>
    </linearGradient>
  </defs>`;
  // right pin map
  svg += `<g transform="translate(770, 90)">
    <text fill="#e8f0fa" font-family="Geist, sans-serif" font-size="13" font-weight="500">Pin map</text>
    <text y="20" fill="#8a98ac" font-family="Geist Mono, monospace" font-size="9">144 / 144 RESOLVED</text>
  </g>`;
  const pinmap = [
    ['PA0','TIM2_CH1','#52c4ff'],
    ['PA1','TIM2_CH2','#52c4ff'],
    ['PA4','DAC1_OUT1','#ffc66d'],
    ['PA9','USART1_TX','#00e676'],
    ['PA10','USART1_RX','#00e676'],
    ['PB3','SPI1_SCK','#ffc66d'],
    ['PB6','I2C1_SCL','#7c4dff'],
    ['PB8','CAN1_RX','#ff6dc7'],
  ];
  pinmap.forEach((p, i) => {
    const y = 140 + i * 38;
    svg += `<g transform="translate(770, ${y})">
      <rect width="160" height="30" rx="4" fill="#0c111a" stroke="#1c232d"/>
      <text x="10" y="20" fill="#c4d2e4" font-family="Geist Mono, monospace" font-size="11">${p[0]}</text>
      <text x="58" y="20" fill="${p[2]}" font-family="Geist Mono, monospace" font-size="11">${p[1]}</text>
    </g>`;
  });
  return `<svg viewBox="0 0 960 540" xmlns="${NS}">${svg}</svg>`;
}

window.MOCKUPS = {
  '01': projectGraph,
  '02': complianceDashboard,
  '03': traceability,
  '04': aiOrchestrator,
  '05': aiModels,
  '06': buildPipeline,
  '07': projectTemplates,
  '08': reviewWorkflow,
  '09': aiLauncher,
  '10': pinConfigurator,
};

// Inject into all elements with [data-mock].
// Prefer the real screenshot from data-asset when present; fall back to the
// hand-drawn SVG mockup if the image fails to load (offline, missing file).
function renderSvgMock(el, key) {
  if (window.MOCKUPS[key]) el.innerHTML = window.MOCKUPS[key]();
}

window.injectMockups = function() {
  document.querySelectorAll('[data-mock]').forEach(el => {
    const key = el.getAttribute('data-mock');
    const asset = el.getAttribute('data-asset');
    if (asset) {
      el.innerHTML = '';
      const img = document.createElement('img');
      img.src = asset;
      img.alt = 'Noyce IDE — ' + (el.getAttribute('data-caption') || ('panel ' + key));
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;display:block;';
      img.onerror = function () {
        el.innerHTML = '';
        renderSvgMock(el, key);
      };
      el.appendChild(img);
    } else {
      renderSvgMock(el, key);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.injectMockups);
} else {
  window.injectMockups();
}
