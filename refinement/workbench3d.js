// Inside Noyce: a real board on a desk, wired to the IDE, then the IDE opened up into
// its real screens with one requirement traced through them. Driven by scroll.
// Screens are real captures from the H-Bridge project on the current development build.
import * as THREE from './vendor/three.module.min.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

const CYAN = 0x62d2e8, GREEN = 0x86ef9c;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (p, a, b) => { const t = clamp((p - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const FONT = "'Geist Mono', ui-monospace, Menlo, monospace";
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Top of each capture holds the dev host title bar, so it's cropped away.
const CROP = 0.03, IMG_W = 1920, IMG_H = 1186 * (1 - CROP), ASPECT = IMG_W / IMG_H, PANE_W = 64, PANE_H = PANE_W / ASPECT;
const SCREEN = V(6, 25.2, -17);
const CHROME = [[0, 0.03, 0.026, 1], [0.026, 0.03, 1, 0.058], [0, 0.98, 1, 1]];
// file, thread in [u, v], thread out, x, y offset, turn, UI layers, close-up centre, crop width, close-up offset, caption, 3D set piece
const PANES = [
  { f: 'models', in: [0.215, 0.253], out: [0.87, 0.139], dx: 0, dy: 0, turn: 0, layers: [[0.027, 0.12, 0.18, 0.975], [0.182, 0.125, 0.995, 0.19], [0.19, 0.208, 0.99, 0.43]], zoom: [0.31, 0.255], zw: 0.42, at: [14, -11], cap: 'Your own server: localhost, no cloud account' },
  { f: 'requirements', in: [0.105, 0.36], out: [0.72, 0.56], dx: 46, dy: 10, turn: -0.2, layers: [[0.03, 0.17, 0.99, 0.26], [0.03, 0.33, 0.495, 0.97], [0.5, 0.29, 0.99, 0.97]], zoom: [0.74, 0.56], zw: 0.52, at: [15, -13], cap: 'Stated at the code: an @req tag in the source' },
  { f: 'traceability', in: [0.5, 0.5], out: [0.5, 0.72], dx: -40, dy: -6, turn: 0.2, layers: [[0.03, 0.07, 0.99, 0.19], [0.28, 0.25, 0.72, 0.88]], piece: 'graph', at: [-17, -11], cap: 'Requirement, source and test, one graph' },
  { f: 'tests', in: [0.12, 0.4], out: [0.15, 0.7], dx: 48, dy: 12, turn: -0.2, layers: [[0.03, 0.16, 0.285, 0.97]], piece: 'tests', at: [15, -8], cap: '99 host tests, all passing' },
  { f: 'mcdc', in: [0.215, 0.235], out: [0.6, 0.235], dx: -44, dy: -8, turn: 0.2, layers: [[0.03, 0.2, 0.97, 0.3], [0.03, 0.36, 0.97, 0.96]], piece: 'bars', at: [15, -11], cap: 'MC/DC 74 of 74 conditions, 12 modules' },
  { f: 'cbmc', in: [0.11, 0.345], out: [0.55, 0.7], dx: 42, dy: 8, turn: -0.18, layers: [[0.03, 0.3, 0.99, 0.38], [0.03, 0.39, 0.99, 0.49], [0.03, 0.5, 0.99, 0.975]], piece: 'proof', at: [15, -12], cap: '1,172 proved, 0 failed, host data model' },
  { f: 'audit', in: [0.27, 0.26], out: [0.6, 0.6], dx: -36, dy: 0, turn: 0.14, layers: [[0.2, 0.125, 0.88, 0.17], [0.2, 0.2, 0.88, 0.58], [0.2, 0.58, 0.88, 0.97]], piece: 'chain', at: [15, -13], cap: 'Each entry carries the hash before it' },
  { f: 'compliance', in: [0.5, 0.36], out: [0.5, 0.36], dx: 28, dy: 4, turn: -0.1, layers: [[0.03, 0.18, 0.99, 0.27], [0.03, 0.28, 0.99, 0.46], [0.03, 0.51, 0.99, 0.61]], piece: 'annex', at: [15, -13.5], cap: '0 satisfied, 39 partial, 32 open, of 71' },
];
const paneZ = (i) => SCREEN.z - i * 96;
const paneArrive = (i) => 0.262 + i * 0.082, DWELL = 0.05;
const stopOf = (p) => { if (p < 0.15) return 0; for (let i = PANES.length - 1; i >= 1; i--) if (p >= paneArrive(i) - 0.012) return i + 1; return 1; };

function texture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function mount(canvas, { onStop, still = false, imgBase = '/refinement/screens/' } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  const camera = new THREE.PerspectiveCamera(32, 2, 0.5, 1800);
  renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;

  const key = new THREE.DirectionalLight(0xfff1e0, 2.3);
  key.position.set(-50, 85, 62); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -85, right: 85, top: 60, bottom: -50, near: 10, far: 220 });
  key.shadow.bias = -0.0004;  key.shadow.normalBias = 0.05; key.shadow.radius = 5; scene.add(key);
  const rim = new THREE.DirectionalLight(CYAN, 0.55); rim.position.set(80, 30, -70); scene.add(rim);
  const glow = new THREE.PointLight(0xbfd8ff, 700, 110, 2); glow.position.set(SCREEN.x, SCREEN.y - 4, SCREEN.z + 16); scene.add(glow);
  const lamp = new THREE.SpotLight(0xffdcb0, 3900, 120, 0.62, 0.72, 1.7); lamp.position.set(-33, 46, 18); lamp.target.position.set(-22, 0, 13); lamp.castShadow = true; lamp.shadow.mapSize.set(1536, 1536); lamp.shadow.bias = -0.0003; lamp.shadow.radius = 6; scene.add(lamp, lamp.target);

  const std = (color, roughness, metalness, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const M = {
    alu: std(0x24272b, 0.46, 0.85), aluLight: std(0x6d7278, 0.34, 0.95), steel: std(0xc4c9ce, 0.2, 1), plastic: std(0x15171a, 0.62, 0.05), slot: std(0x050506, 0.85, 0.2),
    brass: std(0xc9a25c, 0.3, 1), copper: std(0xc17d4d, 0.32, 1), ceramic: std(0x8b7555, 0.6, 0.05), green: std(0x1f6048, 0.55, 0.1), chip: std(0x101114, 0.42, 0.25), rubber: std(0x08090a, 0.9, 0),
    key: std(0x1a1c20, 0.55, 0.15), cable: std(0x101215, 0.6, 0.05),
  };
  const shadow = (m, cast = true) => { m.castShadow = cast; m.receiveShadow = true; return m; };
  const box = (parent, w, h, d, mat, x = 0, y = 0, z = 0) => { const t = Math.min(w, h, d), geo = t >= 0.28 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(t * 0.14, 0.42)) : new THREE.BoxGeometry(w, h, d); const m = shadow(new THREE.Mesh(geo, mat)); m.position.set(x, y, z); parent.add(m); return m; };
  const cyl = (parent, r, h, mat, x = 0, y = 0, z = 0, seg = 28) => { const m = shadow(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat)); m.position.set(x, y, z); parent.add(m); return m; };
  const screw = (parent, x, y, z) => { cyl(parent, 0.34, 0.2, M.steel, x, y, z, 14); box(parent, 0.46, 0.03, 0.08, M.slot, x, y + 0.105, z); };
  const tube = (parent, pts, r, mat) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 70, r, 10), mat); m.castShadow = true; parent.add(m); return m; };
  const mx = new THREE.Matrix4(), q = new THREE.Quaternion(), yAxis = V(0, 1, 0), one = V(1, 1, 1);

  // ---------- The desk ----------
  const desk = new THREE.Group(); scene.add(desk);
  const wood = texture(2048, 1024, (g, w, h) => {
    g.fillStyle = '#1a140f'; g.fillRect(0, 0, w, h);
    let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 900; i++) { const y = r() * h, a = 0.03 + r() * 0.08; g.strokeStyle = `rgba(${r() > 0.5 ? '90,65,44' : '6,4,3'},${a})`; g.lineWidth = 0.6 + r() * 2.4; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 16, w * 0.7, y + (r() - 0.5) * 16, w, y + (r() - 0.5) * 8); g.stroke(); }
  });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(340, 170), new THREE.MeshStandardMaterial({ map: wood, roughness: 0.42, metalness: 0.05 }));
  top.rotation.x = -Math.PI / 2; top.position.set(0, 0, -5); top.receiveShadow = true; desk.add(top);
  // ESD mat under the board, with its grounding snap
  const matT = texture(1024, 640, (g, w, h) => {
    g.fillStyle = '#20313a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.05)';
    for (let y = 16; y < h; y += 26) for (let x = 16; x < w; x += 26) g.fillRect(x, y, 2, 2);
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.strokeRect(10, 10, w - 20, h - 20);
  });
  box(desk, 66, 0.22, 40, new THREE.MeshStandardMaterial({ map: matT, roughness: 0.82 }), -22, 0.11, 13);
  cyl(desk, 0.55, 0.18, M.steel, -53, 0.3, 30, 18);

  // ---------- The H-Bridge board ----------
  const pcb = new THREE.Group(); pcb.position.set(-22, 1.9, 13); pcb.rotation.y = 0.14; desk.add(pcb);
  const PW = 19.6, PD = 14;
  const TW = window.innerWidth < 900 ? 2048 : 3072, TH = Math.round(TW * PD / PW), SX = TW / 2048;
  const px = (x) => (x + PW / 2) / PW * TW, py = (z) => (z + PD / 2) / PD * TH;
  // Placement first, so the artwork can pad every part.
  const spotRnd = (() => { let s = 13; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const keepOut = [[-3, -0.6, 2.9, 2.9], [2.1, -1.9, 1.5, 1.4], [2.1, 1.7, 1.5, 1.4], [-6.9, 2.3, 1.4, 1.1], [1.2, 5.5, 2.1, 1.6], [7.45, -4.75, 2.2, 1.7], [7.45, 4.5, 2.2, 1.7], [3.7, -5.2, 1.3, 1.3], [3.7, 4.9, 1.3, 1.3], [8.7, 0, 1.3, 2.2], [-8, -5.2, 1.8, 0.8], [-8.6, 4.6, 1.2, 1.5], [-6.5, -3.5, 0.8, 0.6], [5.2, -2.1, 1, 0.6], [5.2, 2.1, 1, 0.6]];
  const passiveSpots = [];
  while (passiveSpots.length < 96) { const x = -9.1 + spotRnd() * 18.2, z = -6.4 + spotRnd() * 12.8, a = spotRnd() > 0.5 ? Math.PI / 2 : 0; if (keepOut.some(([kx, kz, hx, hz]) => Math.abs(x - kx) < hx && Math.abs(z - kz) < hz)) continue; if (passiveSpots.some((s) => Math.hypot(s.x - x, s.z - z) < 0.62)) continue; passiveSpots.push({ x, z, a, cap: spotRnd() > 0.52 }); }
  const routes = []; {
    const r = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    for (let i = 0; i < 220; i++) { let x = r() * TW, y = r() * TH; const pts = [[x, y]], width = (r() > 0.84 ? 9 : 3.2) * SX; for (let k = 0; k < 5; k++) { const d = (r() - 0.5) * 340 * SX; if (k % 2 === 0) x += d; else { x += Math.abs(d) * 0.7 * (r() > 0.5 ? 1 : -1); y += d; } pts.push([x, y]); } routes.push({ pts, width }); }
  }
  const viaRnd = (() => { let s = 29; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const vias = Array.from({ length: 460 }, () => [viaRnd() * TW, viaRnd() * TH]);
  const strokeRoutes = (g) => routes.forEach(({ pts, width }) => { g.lineWidth = width; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); });
  const padsOf = (g) => {
    const rect = (x, z, w, d, a = 0) => { g.save(); g.translate(px(x), py(z)); g.rotate(a); const u = TW / PW; g.fillRect(-w * u / 2, -d * u / 2, w * u, d * u); g.restore(); };
    passiveSpots.forEach((s) => { const c = Math.cos(s.a), n = Math.sin(s.a); [-1, 1].forEach((k) => rect(s.x + k * c * 0.19, s.z - k * n * 0.19, 0.16, 0.26, -s.a)); });
    for (let i = 0; i < 48; i++) { const a = Math.floor(i / 12) * Math.PI / 2, o = (i % 12 - 5.5) * 0.27, rr = 2.13; rect(-3 + Math.cos(a) * rr + Math.sin(a) * o, -0.6 - Math.sin(a) * rr + Math.cos(a) * o, 0.56, 0.17, -a); }
    [[2.1, -1.9, 7], [2.1, 1.7, 7], [-6.9, 2.3, 4]].forEach(([x, z, n]) => { for (let i = 0; i < n; i++) for (const k of [-1, 1]) rect(x + k * 0.92, z + (i - (n - 1) / 2) * 0.26, 0.4, 0.16); });
  };
  const pcbTex = texture(TW, TH, (g, w, h) => {
    g.fillStyle = '#0a2c25'; g.fillRect(0, 0, w, h);
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#15594a'; strokeRoutes(g);
    vias.forEach(([x, y]) => { g.fillStyle = '#b48a4b'; g.beginPath(); g.arc(x, y, 3.8 * SX, 0, 7); g.fill(); g.fillStyle = '#04100d'; g.beginPath(); g.arc(x, y, 1.6 * SX, 0, 7); g.fill(); });
    g.fillStyle = '#d0d4d6'; padsOf(g);
    g.strokeStyle = '#e4e8e4'; g.fillStyle = '#e4e8e4'; g.lineWidth = 3 * SX; g.strokeRect(14 * SX, 14 * SX, w - 28 * SX, h - 28 * SX);
    const put = (t, x, y, s = 25) => { g.font = `600 ${s * SX}px ${FONT}`; g.fillText(t, x * SX, y * SX); };
    put('H-BRIDGE CONTROLLER', 700, 1425, 37); put('U1', 760, 400); put('Q1', 1590, 215); put('Q2', 1860, 215); put('Q3', 1590, 1260); put('Q4', 1860, 1260);
    put('J1 SWD', 90, 72); put('J2 VBUS', 1640, 720, 28); put('C1', 1300, 215); put('C2', 1300, 1260); put('Y1', 500, 330); put('D1', 180, 1240); put('D2', 290, 1240);
    put('U2', 1150, 610); put('U3', 1150, 910); put('U4', 300, 900); put('L1', 1120, 1130); put('J3 RS485', 70, 1090, 22); put('REV B', 1880, 1425, 22);
    passiveSpots.forEach((s, i) => { g.font = `600 ${11 * SX}px ${FONT}`; g.fillText((s.cap ? 'C' : 'R') + (i + 3), px(s.x) + 14 * SX, py(s.z) - 12 * SX); });
    [[60, 60], [1980, 60], [60, 1400]].forEach(([x, y]) => { g.fillStyle = '#c9a25c'; g.beginPath(); g.arc((x + 20) * SX, (y + 20) * SX, 11 * SX, 0, 7); g.fill(); g.strokeStyle = '#e4e8e4'; g.lineWidth = 2 * SX; g.beginPath(); g.arc((x + 20) * SX, (y + 20) * SX, 21 * SX, 0, 7); g.stroke(); });
  });
  pcbTex.anisotropy = maxAniso;
  // Copper stands proud of the mask: the relief catches light at shallow angles.
  const pcbBump = texture(TW >> 1, TH >> 1, (g, w, h) => { g.scale(0.5, 0.5); g.fillStyle = '#404040'; g.fillRect(0, 0, TW, TH); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#8a8a8a'; strokeRoutes(g); g.fillStyle = '#c8c8c8'; padsOf(g); vias.forEach(([x, y]) => { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 3.8 * SX, 0, 7); g.fill(); g.fillStyle = '#101010'; g.beginPath(); g.arc(x, y, 1.6 * SX, 0, 7); g.fill(); }); }); pcbBump.colorSpace = THREE.NoColorSpace;
  // Solder pads are bright metal; the mask stays satin.
  const pcbRough = texture(TW >> 1, TH >> 1, (g) => { g.scale(0.5, 0.5); g.fillStyle = '#7a7a7a'; g.fillRect(0, 0, TW, TH); g.fillStyle = '#1e1e1e'; padsOf(g); }); pcbRough.colorSpace = THREE.NoColorSpace;
  const pcbSide = std(0x8a7d3f, 0.34, 0.7);
  const pcbTop = new THREE.MeshPhysicalMaterial({ map: pcbTex, bumpMap: pcbBump, bumpScale: 0.9, roughnessMap: pcbRough, roughness: 1, metalness: 0.28, clearcoat: 0.5, clearcoatRoughness: 0.34 });
  // Signals: light sweeps along the copper while firmware runs.
  const pulseMask = texture(1024, Math.round(1024 * PD / PW), (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.scale(w / TW, h / TH); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#fff'; strokeRoutes(g); });
  const pulseAlpha = texture(512, 64, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,.25)'); gr.addColorStop(0.62, 'rgba(255,255,255,1)'); gr.addColorStop(0.68, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); pulseAlpha.wrapS = THREE.RepeatWrapping; pulseAlpha.colorSpace = THREE.NoColorSpace;
  const pulseMat = new THREE.MeshBasicMaterial({ map: pulseMask, alphaMap: pulseAlpha, color: 0x7dfbd0, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false });
  const pulse = new THREE.Mesh(new THREE.PlaneGeometry(PW, PD), pulseMat); pulse.rotation.x = -Math.PI / 2; pulse.position.y = 0.116; pcb.add(pulse);
  pcb.add(shadow(new THREE.Mesh(new THREE.BoxGeometry(PW, 0.22, PD), [pcbSide, pcbSide, pcbTop, pcbSide, pcbSide, pcbSide])));
  [[-9.3, -6.5], [9.3, -6.5], [-9.3, 6.5], [9.3, 6.5]].forEach(([x, z]) => { cyl(pcb, 0.42, 1.7, M.brass, x, -0.8, z, 14); screw(pcb, x, 0.2, z); });
  const mcu = new THREE.Group(); mcu.position.set(-3, 0.11, -0.6); pcb.add(mcu);
  box(mcu, 3.6, 0.42, 3.6, M.chip, 0, 0.25, 0);
  const pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.52, 0.05, 0.12), M.steel, 48);
  for (let i = 0; i < 48; i++) { const a = Math.floor(i / 12) * Math.PI / 2, o = (i % 12 - 5.5) * 0.27, r = 2.03; q.setFromAxisAngle(yAxis, a); mx.compose(V(Math.cos(a) * r + Math.sin(a) * o, 0.08, -Math.sin(a) * r + Math.cos(a) * o), q, one); pins.setMatrixAt(i, mx); }
  pins.castShadow = true; mcu.add(pins);
  const markT = texture(600, 600, (g, w, h) => { g.fillStyle = '#0d0e11'; g.fillRect(0, 0, w, h); g.fillStyle = '#bfc4c8'; g.font = `700 60px ${FONT}`; g.fillText('ST', 60, 170); g.font = `600 66px ${FONT}`; g.fillText('STM32G431', 60, 276); g.font = `45px ${FONT}`; g.fillText('LQFP48', 60, 360); g.beginPath(); g.arc(78, 504, 24, 0, 7); g.fill(); });
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 3.3), std(0xffffff, 0.5, 0.1, { map: markT })); mark.rotation.x = -Math.PI / 2; mark.position.y = 0.465; mcu.add(mark);
  [[6.6, -4.7], [8.3, -4.7], [6.6, 4.5], [8.3, 4.5]].forEach(([x, z]) => { box(pcb, 1.2, 0.5, 1.45, M.chip, x, 0.36, z); box(pcb, 1.1, 0.08, 0.7, M.steel, x, 0.15, z + (z < 0 ? 1 : -1) * 0.95); [-0.4, 0, 0.4].forEach((o) => box(pcb, 0.18, 0.06, 0.6, M.steel, x + o, 0.14, z + (z < 0 ? -1 : 1) * 0.92)); });
  const sleeve = texture(512, 256, (g, w, h) => { g.fillStyle = '#10141a'; g.fillRect(0, 0, w, h); g.fillStyle = '#3b4552'; g.fillRect(0, 0, 58, h); g.fillStyle = '#c5ccd4'; g.font = `700 34px ${FONT}`; g.fillText('-', 20, 60); g.fillText('-', 20, 130); g.fillText('-', 20, 200); g.font = `600 30px ${FONT}`; g.fillText('105C', 90, 72); g.fillText('470uF', 90, 128); g.fillText('63V', 90, 184); g.fillText('470uF', 310, 128); });
  [[3.7, -5.2], [3.7, 4.9]].forEach(([x, z]) => { cyl(pcb, 0.95, 1.9, std(0xffffff, 0.34, 0.2, { map: sleeve }), x, 1.06, z, 36); cyl(pcb, 0.78, 0.04, M.aluLight, x, 2.03, z, 36); box(pcb, 1.3, 0.025, 0.08, M.slot, x, 2.05, z); box(pcb, 0.08, 0.025, 1.3, M.slot, x, 2.05, z); });
  const bodyC = new THREE.InstancedMesh(new THREE.BoxGeometry(0.27, 0.15, 0.2), M.ceramic, passiveSpots.length), bodyR = new THREE.InstancedMesh(new THREE.BoxGeometry(0.27, 0.11, 0.2), std(0x0d0e10, 0.4, 0.1), passiveSpots.length);
  const caps = new THREE.InstancedMesh(new THREE.BoxGeometry(0.075, 0.16, 0.21), M.steel, passiveSpots.length * 2); let nc = 0, nr = 0;
  passiveSpots.forEach((s, i) => { q.setFromAxisAngle(yAxis, s.a); const pos = V(s.x, 0.2, s.z); mx.compose(pos, q, one); if (s.cap) bodyC.setMatrixAt(nc++, mx); else bodyR.setMatrixAt(nr++, mx); [-1, 1].forEach((k, j) => { mx.compose(V(s.x + k * Math.cos(s.a) * 0.17, 0.2, s.z - k * Math.sin(s.a) * 0.17), q, one); caps.setMatrixAt(i * 2 + j, mx); }); });
  bodyC.count = nc; bodyR.count = nr; [bodyC, bodyR, caps].forEach((m) => { m.castShadow = true; pcb.add(m); });
  const can = cyl(pcb, 0.5, 0.42, M.steel, -6.5, 0.32, -3.5, 24); can.scale.z = 0.55;
  // SOIC gate drivers and the RS485 transceiver, each with real gull-wing leads
  const soic = (x, z, leads, label) => {
    const s = new THREE.Group(); s.position.set(x, 0.11, z); pcb.add(s); box(s, 1.5, 0.3, 1.2 + leads * 0.11, M.chip, 0, 0.2, 0);
    for (let i = 0; i < leads; i++) for (const side of [-1, 1]) box(s, 0.34, 0.05, 0.09, M.steel, side * 0.9, 0.09, (i - (leads - 1) / 2) * 0.26);
    const tt = texture(240, 160, (g, w, h) => { g.fillStyle = '#0d0e11'; g.fillRect(0, 0, w, h); g.fillStyle = '#b8bdc2'; g.font = `600 44px ${FONT}`; g.fillText(label, 16, 66); g.beginPath(); g.arc(30, 122, 10, 0, 7); g.fill(); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 0.9), std(0xffffff, 0.5, 0.1, { map: tt })); m.rotation.x = -Math.PI / 2; m.position.y = 0.355; s.add(m);
  };
  soic(2.1, -1.9, 7, 'DRV'); soic(2.1, 1.7, 7, 'DRV'); soic(-6.9, 2.3, 4, '485');
  // Current-sense shunts and the power inductor
  [[5.2, -2.1], [5.2, 2.1]].forEach(([x, z]) => { box(pcb, 1.3, 0.14, 0.62, M.steel, x, 0.18, z); box(pcb, 0.8, 0.15, 0.56, std(0x20242a, 0.5, 0.3), x, 0.2, z); });
  const coil = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.45, 18, 40), std(0x2b2f35, 0.5, 0.15)); coil.rotation.x = Math.PI / 2; coil.position.set(1.2, 0.56, 5.5); coil.castShadow = true; pcb.add(coil);
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, w = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.042, 6, 14), M.copper); w.position.set(1.2 + Math.cos(a) * 1.0, 0.56, 5.5 + Math.sin(a) * 1.0); w.rotation.y = -a; pcb.add(w); }
  // Heatsink across the high side
  const hs = new THREE.Group(); hs.position.set(7.45, 0.72, -4.75); pcb.add(hs); box(hs, 3.5, 0.2, 1.7, M.aluLight, 0, 0, 0);
  for (let i = 0; i < 10; i++) box(hs, 0.13, 1.1, 1.7, M.aluLight, -1.62 + i * 0.36, 0.62, 0);
  // Test points and the RS485 connector
  [[-1, 5.8, 'TP1'], [0.2, 5.9, 'TP2'], [-8.6, -1.4, 'TP3'], [-8.6, 0.2, 'TP4'], [4.8, 6.2, 'TP5'], [5.2, -6.2, 'TP6']].forEach(([x, z]) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 8, 20), M.brass); t.rotation.x = Math.PI / 2; t.position.set(x, 0.17, z); pcb.add(t); });
  const j3 = new THREE.Group(); j3.position.set(-8.6, 0.11, 4.6); pcb.add(j3); box(j3, 1.8, 1, 2.3, M.green, 0, 0.5, 0); [-0.65, 0, 0.65].forEach((z) => { cyl(j3, 0.27, 0.08, M.steel, 0, 1.03, z, 12); box(j3, 0.06, 0.6, 0.42, M.slot, -0.92, 0.45, z); });
  const hdr = new THREE.Group(); hdr.position.set(-8, 0.11, -5.2); pcb.add(hdr); box(hdr, 2.8, 0.45, 0.9, M.plastic, 0, 0.23, 0);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) box(hdr, 0.1, 0.9, 0.1, M.brass, -1 + i * 0.5, 0.75, -0.2 + j * 0.4);
  const term = new THREE.Group(); term.position.set(8.7, 0.11, 0); pcb.add(term); box(term, 1.7, 1.2, 3.8, M.green, 0, 0.6, 0);
  [-1.2, 0, 1.2].forEach((z) => { cyl(term, 0.34, 0.1, M.steel, 0, 1.22, z, 12); box(term, 0.07, 0.72, 0.62, M.slot, 0.86, 0.5, z); });
  const ledMat = [std(0x062015, 0.3, 0, { emissive: GREEN, emissiveIntensity: 0 }), std(0x051820, 0.3, 0, { emissive: CYAN, emissiveIntensity: 0 })];
  ledMat.forEach((m, i) => box(pcb, 0.42, 0.16, 0.24, m, -7.8 + i * 1.1, 0.2, 5.6));
  pcb.updateMatrixWorld(true);
  const onBoard = (x, y, z) => pcb.localToWorld(V(x, y, z));

  // ---------- Debug probe, cables ----------
  const probe = new THREE.Group(); probe.position.set(-3, 0, 2); probe.rotation.y = -0.2; desk.add(probe);
  box(probe, 8, 2.4, 5, M.alu, 0, 1.2, 0); box(probe, 8.1, 0.3, 5.1, M.aluLight, 0, 2.5, 0);
  [[-3.4, -2], [3.4, -2], [-3.4, 2], [3.4, 2]].forEach(([x, z]) => screw(probe, x, 2.66, z));
  const probeLed = std(0x041a12, 0.3, 0, { emissive: GREEN, emissiveIntensity: 2 }); box(probe, 0.4, 0.1, 0.4, probeLed, 2.8, 2.7, 0.6);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.3), std(0xffffff, 0.6, 0, { map: texture(460, 130, (g, w, h) => { g.fillStyle = '#0c0d0f'; g.fillRect(0, 0, w, h); g.fillStyle = '#d6d8da'; g.font = `600 42px ${FONT}`; g.fillText('DEBUG PROBE', 14, 82); }) })); lab.rotation.x = -Math.PI / 2; lab.position.set(-0.9, 2.66, 0.2); probe.add(lab);
  probe.updateMatrixWorld(true);
  const pW = (x, y, z) => probe.localToWorld(V(x, y, z));
  // Ribbon from the SWD header to the probe; USB from the probe to the workstation.
  // Socket on the probe and IDC plug on J1 first, so the conductors can end inside both.
  box(probe, 0.9, 1.5, 3.0, M.plastic, -4.45, 1.3, 0);
  const plug = new THREE.Group(); plug.position.set(-8, 0.11 + 1.16, -5.2); pcb.add(plug);
  box(plug, 2.7, 0.62, 1.0, M.plastic, 0, 0, 0); box(plug, 2.15, 0.2, 0.62, std(0x2a2d31, 0.5, 0.1), 0, 0.38, 0);
  pcb.updateMatrixWorld(true); probe.updateMatrixWorld(true);
  const ribMats = [std(0x9b2020, 0.6, 0.05), std(0x9ba1a8, 0.65, 0.05)];
  for (let i = 0; i < 10; i++) {
    const o = (i - 4.5) * 0.215;
    const a0 = onBoard(-8 + o, 1.72, -5.2), a1 = onBoard(-8 + o, 3.7, -5.3), a2 = onBoard(-8 + o * 0.98, 6.6, -6.3);
    const e0 = pW(-4.85, 1.45, o), e1 = pW(-7.4, 2.0, o), e2 = pW(-11, 4.6, o * 0.98);
    const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a0, a1, a2, a2.clone().lerp(e2, 0.5).add(V(0, 2.2, 0)), e2, e1, e0]), 110, 0.105, 6), i === 0 ? ribMats[0] : ribMats[1]);
    wire.castShadow = true; desk.add(wire);
  }
  const u0 = pW(6.9, 1.2, 0), u1 = V(50.5, 3.5, -22);
  tube(desk, [u0, u0.clone().add(V(4, 0.2, 0.4)), V(24, 0.5, 8), V(44, 0.5, 2), V(50, 2, -14), u1], 0.32, M.cable);
  box(probe, 1.6, 1.1, 1.2, M.steel, 4.5, 1.2, 0); box(probe, 2.2, 1.4, 1.5, M.plastic, 5.9, 1.2, 0);
  const u1Boot = box(desk, 1.4, 1, 2.6, M.plastic, u1.x, u1.y, u1.z + 0.7); u1Boot.castShadow = true;
  // Multimeter with its leads on the mat
  const dmm = new THREE.Group(); dmm.position.set(-46, 0.22, 21); dmm.rotation.y = 0.32; desk.add(dmm);
  const rb = new THREE.Mesh(new THREE.BoxGeometry(8, 1.4, 14.5), std(0x8a5a10, 0.68, 0.05)); rb.position.y = 0.72; rb.castShadow = true; dmm.add(rb); box(dmm, 6.8, 0.25, 13, M.plastic, 0, 1.45, 0);
  const lcdT = texture(360, 180, (g, w, h) => { g.fillStyle = '#a7b09a'; g.fillRect(0, 0, w, h); g.fillStyle = '#20231d'; g.font = `700 104px ${FONT}`; g.fillText('O.L', 70, 128); g.font = `600 34px ${FONT}`; g.fillText('V', 300, 150); });
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.8), std(0xffffff, 0.3, 0.05, { map: lcdT })); lcd.rotation.x = -Math.PI / 2; lcd.position.set(0, 1.6, -4.1); dmm.add(lcd);
  const dial = cyl(dmm, 2.2, 0.5, M.chip, 0, 1.8, 1.2, 40); box(dial, 0.42, 0.12, 3.8, M.aluLight, 0, 0.27, 0);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; box(dmm, 0.1, 0.03, 0.42, M.steel, Math.sin(a) * 2.8, 1.6, 1.2 + Math.cos(a) * 2.8).rotation.y = a; }
  [[-2.1, 0x7d1a1a], [2.1, 0x111111]].forEach(([x, c]) => { cyl(dmm, 0.48, 0.42, std(c, 0.38, 0.25), x, 1.74, 5.4, 16); });
  dmm.updateMatrixWorld(true);
  const lead = (x, c, to) => { const a = dmm.localToWorld(V(x, 1.9, 5.4)), mat = std(c, 0.5, 0.08); tube(desk, [a, a.clone().add(V(0.3, 1.6, 2)), a.clone().add(V(4, 0.5, 6)), to.clone().add(V(-6, 0.1, 3)), to], 0.17, mat); const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.28, 4.2, 14), mat); tip.position.copy(to).add(V(1.5, 0.1, -0.5)); tip.rotation.z = Math.PI / 2 - 0.22; tip.rotation.y = 0.3; tip.castShadow = true; desk.add(tip); const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 2, 8), M.steel); pin.position.copy(to).add(V(4.5, 0.1, -1.4)); pin.rotation.z = Math.PI / 2 - 0.22; pin.rotation.y = 0.3; desk.add(pin); };
  lead(-2.1, 0x8c1f1f, V(-28, 0.62, 30)); lead(2.1, 0x111317, V(-31, 0.62, 28));
  // Oscilloscope at the back of the bench
  const scope = new THREE.Group(); scope.position.set(-38, 0, -14); scope.rotation.y = 0.18; desk.add(scope);
  box(scope, 24, 14.5, 12, std(0x2a2d31, 0.55, 0.4), 0, 7.25, 0); box(scope, 23.6, 14, 0.3, M.plastic, 0, 7.3, 6.1);
  const scopeC = document.createElement('canvas'); scopeC.width = 640; scopeC.height = 400; const scopeG = scopeC.getContext('2d'); const sT = new THREE.CanvasTexture(scopeC); sT.colorSpace = THREE.SRGBColorSpace;
  let scopeLast = -1;
  const drawScope = (t) => {
    const g = scopeG, w = 640, h = 400; g.fillStyle = '#050b0a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,170,160,.22)'; g.lineWidth = 1;
    for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(i * w / 10, 0); g.lineTo(i * w / 10, h); g.stroke(); } for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
    const duty = 0.42 + Math.sin(t * 0.7) * 0.16, ph = t * 90;
    g.strokeStyle = '#86ef9c'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= w; x += 2) { const y = ((x + ph) % 64) / 64 < duty ? 104 : 178; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.strokeStyle = '#62d2e8'; g.beginPath(); for (let x = 0; x <= w; x += 2) { const v = x + ph, y = 292 + Math.sin(v * 0.0982) * 26 + Math.sin(v * 0.39) * 4; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.fillStyle = '#9fb0ac'; g.font = `19px ${FONT}`; g.fillText('CH1 PWM', 14, 26); g.fillText('CH2 phase current', 14, 384); sT.needsUpdate = true;
  };
  drawScope(0);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(14, 9.8), new THREE.MeshBasicMaterial({ map: sT, toneMapped: false })); sc.position.set(-3.7, 8.2, 6.27); scope.add(sc);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const k = cyl(scope, r === 0 ? 0.74 : 0.5, 0.5, r === 0 ? M.aluLight : M.chip, 5.9 + c * 1.95, 11.5 - r * 2.25, 6.4, 20); k.rotation.x = Math.PI / 2; }
  [0, 1, 2].forEach((i) => { const k = cyl(scope, 0.68, 0.7, M.steel, 5.9 + i * 1.95, 2.4, 6.5, 18); k.rotation.x = Math.PI / 2; const c = cyl(scope, 0.32, 0.8, M.brass, 5.9 + i * 1.95, 2.4, 6.6, 12); c.rotation.x = Math.PI / 2; });
  for (let c = 0; c < 6; c++) box(scope, 1.25, 0.72, 0.28, M.key, -9.5 + c * 2.35, 2.25, 6.3);
  // Scope probes clip to the test points
  scope.updateMatrixWorld(true);
  const scA = scope.localToWorld(V(5.9, 2.4, 6.7)), scB = scope.localToWorld(V(7.85, 2.4, 6.7));
  tube(desk, [scA, scA.clone().add(V(1, -0.8, 5)), V(-30, 0.9, 12), onBoard(-8.6, 3.6, -1.4), onBoard(-8.6, 0.5, -1.4)], 0.14, std(0x2d7a58, 0.5, 0.08));
  tube(desk, [scB, scB.clone().add(V(2, -0.8, 6)), V(-29, 1.1, 15), onBoard(-8.6, 3.8, 0.2), onBoard(-8.6, 0.5, 0.2)], 0.14, std(0x2b6c86, 0.5, 0.08));
  // Notebook, pen, mug
  const note = new THREE.Group(); note.position.set(-2, 0.05, 25); note.rotation.y = -0.2; desk.add(note);
  const noteT = texture(620, 800, (g, w, h) => { g.fillStyle = '#e9e6dc'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(70,110,140,.28)'; for (let y = 54; y < h; y += 36) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.fillStyle = '#242a35'; g.font = `italic 28px ui-serif, Georgia, serif`; ['H-Bridge bring-up', 'SWD ok, 170 MHz clock', 'dead time on PWM enable?', 'check HLR-01 CRC on RS485', '-> add robustness test'].forEach((s, i) => g.fillText(s, 34, 87 + i * 72)); });
  box(note, 12, 0.5, 15.5, M.plastic, 0, 0.25, 0); const pg = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 15.1), std(0xffffff, 0.86, 0, { map: noteT })); pg.rotation.x = -Math.PI / 2; pg.position.y = 0.52; note.add(pg);
  const pen = cyl(note, 0.2, 11, std(0x101826, 0.3, 0.5), 7.2, 0.28, 0, 12); pen.rotation.x = Math.PI / 2; pen.rotation.z = 0.14;
  const mug = new THREE.Group(); mug.position.set(38, 0, 9); desk.add(mug);
  const mugB = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.9, 7.4, 44, 1, true), std(0xd9d8d3, 0.34, 0.05, { side: THREE.DoubleSide })); mugB.position.y = 3.7; mugB.castShadow = true; mug.add(mugB); cyl(mug, 2.92, 0.2, std(0xd9d8d3, 0.34, 0.05), 0, 0.1, 0, 44); cyl(mug, 3.02, 0.1, std(0x24150b, 0.22, 0.05), 0, 6.2, 0, 44);
  const hd = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.36, 12, 28), std(0xd9d8d3, 0.34, 0.05)); hd.position.set(3.6, 3.8, 0); hd.castShadow = true; mug.add(hd);
  // Bench supply for the motor rail
  const psu = new THREE.Group(); psu.position.set(-62, 0, -9); psu.rotation.y = 0.22; desk.add(psu);
  box(psu, 18, 12, 16, M.alu, 0, 6, 0); box(psu, 18.2, 12.2, 0.4, M.plastic, 0, 6.1, 8.1);
  const psuD = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), new THREE.MeshBasicMaterial({ toneMapped: false, map: texture(400, 160, (g, w, h) => { g.fillStyle = '#04100a'; g.fillRect(0, 0, w, h); g.fillStyle = '#86ef9c'; g.font = `700 74px ${FONT}`; g.fillText('OUT ON', 24, 106); }) })); psuD.position.set(-3.8, 9, 8.33); psu.add(psuD);
  for (let i = 0; i < 9; i++) box(psu, 0.1, 9, 0.5, M.slot, 9.03, 6, -6 + i * 1.4);
  [[-5, 0x8c1f1f], [-1.5, 0x111111]].forEach(([x, c]) => { const k = cyl(psu, 0.8, 1.2, std(c, 0.35, 0.3), x, 3, 8.6, 20); k.rotation.x = Math.PI / 2; });
  [[4, 8], [4, 4]].forEach(([x, y]) => { const k = cyl(psu, 1.15, 1, M.aluLight, x, y, 8.5, 24); k.rotation.x = Math.PI / 2; });
  psu.updateMatrixWorld(true);
  const wireRed = std(0x8c1f1f, 0.5, 0.1), wireBlk = M.cable;
  const axisZ = V(0, 0, 1);
  const banana = (x, mat) => { const g = new THREE.Group(); psu.add(g); g.position.set(x, 3, 9.2); g.rotation.x = Math.PI / 2; cyl(g, 0.5, 2.4, mat, 0, 1.2, 0, 18); cyl(g, 0.3, 0.8, mat, 0, 2.7, 0, 12); };
  banana(-5, wireRed); banana(-1.5, wireBlk);
  psu.updateMatrixWorld(true);
  const power = (sx, z, mat, front) => {
    const s0 = psu.localToWorld(V(sx, 3, 12.2)), s1 = psu.localToWorld(V(sx, 2.2, 15.5));
    const e0 = onBoard(10.05, 0.62, z), e1 = onBoard(11.6, 0.68, z), e2 = onBoard(14.2, -0.65, z + (z < 0 ? -0.6 : 0.6));
    tube(desk, [s0, s1, V(s1.x + 7, 0.5, front), V(-36, 0.5, front + 4), V(-13, 0.5, front + 4), V(e2.x + 2.2, 0.5, e2.z + 7), e2, e1, e0], 0.24, mat);
    const fer = cyl(pcb, 0.2, 0.8, M.steel, 9.72, 0.62, z, 12); fer.rotation.z = Math.PI / 2;
    const boot = cyl(pcb, 0.28, 0.6, mat, 10.28, 0.62, z, 12); boot.rotation.z = Math.PI / 2;
  };
  power(-5, -1.2, wireRed, 22); power(-1.5, 1.2, wireBlk, 25);

  // ---------- The room ----------
  const wall = new THREE.Group(); desk.add(wall);
  const peg = texture(1536, 512, (g, w, h) => { g.fillStyle = '#16191c'; g.fillRect(0, 0, w, h); g.fillStyle = '#050607'; for (let y = 14; y < h; y += 28) for (let x = 14; x < w; x += 28) { g.beginPath(); g.arc(x, y, 3.6, 0, 7); g.fill(); } });
  peg.wrapS = peg.wrapT = THREE.RepeatWrapping;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(360, 120), new THREE.MeshStandardMaterial({ map: peg, roughness: 0.82, metalness: 0.15 })); back.position.set(0, 60, -60); back.receiveShadow = true; wall.add(back);
  // Parts bins on a shelf
  box(wall, 76, 1.1, 13, M.alu, -70, 45, -53); [-104, -36].forEach((x) => box(wall, 1, 7, 12, M.alu, x, 41.5, -56));
  for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const y = 49 + r * 7.6, x = -103 + i * 8.2, bin = box(wall, 7.4, 6.8, 10, std(i % 3 ? 0x1b2026 : 0x22303a, 0.5, 0.05), x, y, -53.5); bin.castShadow = false;
    const t = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.5), std(0xffffff, 0.6, 0, { map: texture(230, 75, (g, w, h) => { g.fillStyle = '#d9d6cc'; g.fillRect(0, 0, w, h); g.fillStyle = '#17191c'; g.font = `600 30px ${FONT}`; g.fillText(['0402 10k', '0402 100n', '0603 1u', 'SOIC-8', 'LQFP48', 'JST-XH', 'M3 x 6', 'TVS', 'MOSFET'][(i + r * 4) % 9], 10, 50); }) })); t.position.set(x, y + 1.8, -48.4); wall.add(t); }
  // Hand tools hanging on the pegboard
  [[-96, 26, 0x8c1f1f, 8], [-88, 26, 0x1d5a78, 10], [-80, 26, 0xc0882a, 7]].forEach(([x, y, c, len]) => { const h = new THREE.Group(); h.position.set(x, y, -57.5); wall.add(h); cyl(h, 0.85, len, std(c, 0.4, 0.05), 0, len / 2 + 1, 0, 18); cyl(h, 0.2, 9, M.steel, 0, -3.4, 0, 10); });
  // Articulated desk lamp
  const armMat = std(0x2d3136, 0.4, 0.75);
  const beam = (a, b, r = 0.42) => { const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 14), armMat); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(yAxis, d.normalize()); m.castShadow = true; desk.add(m); return m; };
  const j0 = V(-64, 0.9, 20), j1 = V(-72, 34, 6), j2 = V(-34, 50, 16); cyl(desk, 5.2, 1.1, M.alu, j0.x, 0.55, j0.z, 40);
  beam(j0, j1); beam(j0.clone().add(V(1.4, 0, 0)), j1.clone().add(V(1.4, 0, 0)), 0.22); beam(j1, j2); beam(j1.clone().add(V(0, 1.3, 0)), j2.clone().add(V(0, 1.3, 0)), 0.22);
  [j0.clone().add(V(0, 1, 0)), j1].forEach((j) => { const o = new THREE.Mesh(new THREE.SphereGeometry(1.1, 18, 12), armMat); o.position.copy(j); o.castShadow = true; desk.add(o); });
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 5.8, 6.4, 40, 1, true), std(0x25282c, 0.42, 0.7, { side: THREE.DoubleSide })); shade.position.set(-33, 47.6, 17.6); shade.rotation.z = -0.12; desk.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffe3bd, toneMapped: false })); bulb.position.set(-33, 46.2, 17.6); desk.add(bulb);
  // Solder spool, tweezers, spare boards
  const spool = new THREE.Group(); spool.position.set(-58, 0, 34); desk.add(spool); cyl(spool, 3.1, 0.3, M.plastic, 0, 0.2, 0, 32); cyl(spool, 3.1, 0.3, M.plastic, 0, 3.9, 0, 32);
  for (let i = 0; i < 16; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.13, 7, 34), M.steel); t.rotation.x = Math.PI / 2; t.position.y = 0.48 + i * 0.205; spool.add(t); } cyl(spool, 1.4, 3.8, M.plastic, 0, 2.05, 0, 20);
  const tw = new THREE.Group(); tw.position.set(7, 0.32, 33); tw.rotation.y = 0.62; desk.add(tw); [-0.1, 0.1].forEach((a) => { const arm = box(tw, 11, 0.14, 0.5, M.steel, 0, 0, a * 3); arm.rotation.y = a; });
  [0, 1, 2].forEach((i) => { const sp = box(desk, 20, 0.22, 14, std(0x13392f, 0.42, 0.25), -74 + i * 0.3, 0.13 + i * 0.25, 33 - i * 0.2); sp.rotation.y = 0.32 + i * 0.05; });
  // Dust in the lamp light
  const dust = (() => { const n = 230, a = new Float32Array(n * 3), rr = (() => { let s = 91; return () => (s = (s * 16807) % 2147483647) / 2147483647; })(); for (let i = 0; i < n; i++) { a[i * 3] = -58 + rr() * 72; a[i * 3 + 1] = 2 + rr() * 44; a[i * 3 + 2] = -8 + rr() * 42; } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe4c4, size: 0.2, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending })); })(); desk.add(dust);

  // ---------- Workstation monitor ----------
  const mon = new THREE.Group(); mon.position.copy(SCREEN); desk.add(mon);
  const shell = std(0x24262a, 0.34, 0.65), brushed = std(0x8c9096, 0.3, 0.95);
  box(mon, PANE_W + 0.9, PANE_H + 0.9, 0.8, shell, 0, 0, -0.42);
  box(mon, PANE_W - 8, PANE_H - 5, 1.7, shell, 0, -0.5, -1.45);
  box(mon, 18, 13, 1.2, std(0x1b1d20, 0.5, 0.5), 0, -1.5, -2.6);
  for (let i = 0; i < 22; i++) box(mon, 0.42, 3.4, 0.08, M.slot, -22 + i * 2.1, PANE_H / 2 - 6, -2.32);
  box(mon, PANE_W + 0.9, 0.06, 0.06, M.aluLight, 0, -PANE_H / 2 - 0.46, 0.01).castShadow = false;
  // Slim screen glass catches the room.
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(PANE_W + 0.7, PANE_H + 0.7), new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.08, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6, depthWrite: false })); glass.position.z = 0.1; mon.add(glass);
  // Neck, cable passthrough, plate foot
  const footY = -SCREEN.y;
  box(mon, 7.5, SCREEN.y - 1.4, 1.5, brushed, 0, footY + (SCREEN.y - 1.4) / 2 + 0.7, -4.2);
  box(mon, 3.2, 3, 1.6, M.slot, 0, footY + 8, -4.2).castShadow = false;
  box(mon, 8, 5, 2.6, brushed, 0, -1.2, -3.6);
  box(mon, 24, 0.7, 16, brushed, 0, footY + 0.4, -3);
  // ---------- The computer: a local AI workstation with a glass side ----------
  const pc = new THREE.Group(); pc.position.set(71, 0, -30); pc.rotation.y = -0.44; desk.add(pc); const PCW = 42, PCH = 46, PCD = 22;
  const panelM = std(0x121417, 0.42, 0.72);
  box(pc, PCW, 1.2, PCD, panelM, 0, 2.6, 0); box(pc, PCW, 1.2, PCD, panelM, 0, PCH + 1.2, 0); box(pc, 1.2, PCH, PCD, panelM, -PCW / 2, PCH / 2 + 1.8, 0); box(pc, 1.2, PCH, PCD, panelM, PCW / 2, PCH / 2 + 1.8, 0); box(pc, PCW, PCH, 1, panelM, 0, PCH / 2 + 1.8, -PCD / 2);
  [[-17, -8], [17, -8], [-17, 8], [17, 8]].forEach(([x, z]) => { cyl(pc, 1.6, 1.5, M.rubber, x, 1.1, z, 18); });
  for (let i = 0; i < 26; i++) box(pc, 26 - (i % 2) * 2, 0.08, 0.4, M.slot, 0, PCH + 1.84, -8 + i * 0.64);
  // Motherboard with real traces
  const mbT = texture(1024, 1024, (g, w, h) => { g.fillStyle = '#0d1412'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1f3a32'; g.lineWidth = 3; let s = 53; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 170; i++) { let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { if (k % 2) x += (r() - 0.5) * 220; else y += (r() - 0.5) * 220; g.lineTo(x, y); } g.stroke(); } });
  const mb = new THREE.Mesh(new THREE.PlaneGeometry(PCW - 4, PCH - 2), std(0xffffff, 0.5, 0.35, { map: mbT })); mb.position.set(0, PCH / 2 + 2, -PCD / 2 + 0.7); mb.receiveShadow = true; pc.add(mb);
  // RAM with lit heat spreaders
  const ramLit = new THREE.MeshBasicMaterial({ color: GREEN, toneMapped: false });
  for (let i = 0; i < 4; i++) { box(pc, 0.8, 11, 2.2, std(0x1b1e22, 0.34, 0.75), 5.4 + i * 1.5, 33, -PCD / 2 + 2); box(pc, 0.62, 0.32, 1.9, ramLit, 5.4 + i * 1.5, 38.7, -PCD / 2 + 2); }
  // Tower cooler: fin stack, heat pipes, fan
  const coolerAt = V(-4, 33, -PCD / 2 + 5.5);
  const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(11, 11, 0.13), std(0xb7bcc1, 0.32, 0.95), 26); for (let i = 0; i < 26; i++) { mx.compose(V(coolerAt.x, coolerAt.y, coolerAt.z - 2.6 + i * 0.28), new THREE.Quaternion(), one); fins.setMatrixAt(i, mx); } fins.castShadow = true; pc.add(fins);
  [-3, -1, 1, 3].forEach((x) => { const hp = cyl(pc, 0.3, 12, M.copper, coolerAt.x + x, coolerAt.y, coolerAt.z - 3.2, 10); hp.rotation.z = 0; });
  const makeFan = (R0, ledColor) => {
    const f = new THREE.Group(); const fm = std(0x101215, 0.5, 0.2), s0 = R0 * 2.25, bar = R0 * 0.2; [[0, (s0 - bar) / 2, s0, bar], [0, -(s0 - bar) / 2, s0, bar], [(s0 - bar) / 2, 0, bar, s0], [-(s0 - bar) / 2, 0, bar, s0]].forEach(([x, y, w, h]) => box(f, w, h, 1.3, fm, x, y, 0));
    const hub = new THREE.Group(); f.add(hub);
    const blade = new THREE.Shape(); blade.moveTo(0, 0); blade.bezierCurveTo(R0 * 0.3, R0 * 0.14, R0 * 0.62, R0 * 0.32, R0 * 0.9, R0 * 0.14); blade.lineTo(R0 * 0.88, -R0 * 0.1); blade.bezierCurveTo(R0 * 0.5, -R0 * 0.02, R0 * 0.2, -R0 * 0.08, 0, 0);
    const bg = new THREE.ExtrudeGeometry(blade, { depth: 0.1, bevelEnabled: false });
    for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(bg, std(0x24282d, 0.42, 0.35)); m.rotation.z = i / 9 * Math.PI * 2; m.position.z = 0.7; hub.add(m); }
    const cap = cyl(f, R0 * 0.26, 0.4, std(0x1b1e22, 0.35, 0.7), 0, 0, 0.92, 24); cap.rotation.x = Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R0 * 0.98, 0.1, 8, 54), new THREE.MeshBasicMaterial({ color: ledColor, toneMapped: false })); ring.position.z = 0.72; f.add(ring);
    return { f, hub };
  };
  const fans = [];
  const f1 = makeFan(4.9, CYAN); f1.f.rotation.y = 0; f1.f.position.set(coolerAt.x, coolerAt.y, coolerAt.z + 3.6); pc.add(f1.f); fans.push(f1);
  [[-14.5, 33], [-14.5, 18.5]].forEach(([x, y]) => { const c = makeFan(5, GREEN); c.f.rotation.y = Math.PI / 2; c.f.position.set(x - 4.8, y, 0); pc.add(c.f); fans.push(c); });
  // The GPU that serves the model: shroud, backplate, three fans
  const gpuY = 19.5, gpuZ = 1;
  box(pc, 31, 6.2, 11.5, std(0x1c1f23, 0.3, 0.8), 2.8, gpuY, gpuZ - 0.2);
  box(pc, 31, 0.25, 11.5, brushed, 2.8, gpuY + 3.24, gpuZ - 0.2);
  [-7.6, 2.8, 13.2].forEach((x) => { const c = makeFan(4.3, CYAN); c.f.rotation.x = Math.PI / 2; c.f.position.set(x, gpuY - 3.5, gpuZ - 0.2); pc.add(c.f); fans.push(c); });
  const gpuSide = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.8), new THREE.MeshBasicMaterial({ toneMapped: false, map: texture(1024, 150, (g, w, h) => { g.fillStyle = '#07090b'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#62d2e8'); gr.addColorStop(1, '#86ef9c'); g.fillStyle = gr; g.font = `700 76px ${FONT}`; g.fillText('LOCAL MODEL', 30, 104); g.font = `500 46px ${FONT}`; g.fillStyle = '#b8c4c9'; g.fillText(':1234', 760, 102); }) })); gpuSide.position.set(2.8, gpuY, gpuZ + 5.62); pc.add(gpuSide);
  // PSU shroud and braided power cables
  box(pc, PCW - 3, 7.5, PCD - 3, std(0x0e1012, 0.5, 0.45), 0, 7.1, 0);
  for (let i = 0; i < 12; i++) box(pc, 2.1, 0.2, 0.08, M.slot, -15 + i * 2.8, 9.5, PCD / 2 - 1.42);
  for (let i = 0; i < 4; i++) { const x = 13 + i * 0.6; tube(pc, [V(x, 11, 1), V(x, 15, 4), V(x - 2, gpuY + 2, gpuZ + 2)], 0.15, std(0x18191c, 0.75, 0.05)); }
  // Tempered glass side and lit front strip
  const glassSide = new THREE.Mesh(new THREE.PlaneGeometry(PCW - 0.4, PCH - 0.2), new THREE.MeshPhysicalMaterial({ color: 0x9fb2bd, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.5, depthWrite: false })); glassSide.position.set(0, PCH / 2 + 1.8, PCD / 2 + 0.12); pc.add(glassSide);
  const cabinGlow = new THREE.PointLight(0x84e6d8, 160, 42, 2); cabinGlow.position.set(2, 28, 4); pc.add(cabinGlow);
  const pcLed = new THREE.MeshBasicMaterial({ color: GREEN, toneMapped: false }); const led = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 12), pcLed); led.rotation.z = Math.PI / 2; led.position.set(-PCW / 2 - 0.68, 44, 7); pc.add(led);
  // Network: local switch; the uplink lies unplugged.
  const sw = new THREE.Group(); sw.position.set(52, 0, 5); sw.rotation.y = -0.2; desk.add(sw); box(sw, 13, 2.1, 7, std(0x1b1d21, 0.42, 0.65), 0, 1.15, 0);
  for (let i = 0; i < 5; i++) { box(sw, 1.5, 1.05, 0.12, M.slot, -5 + i * 2.4, 1.15, 3.54); const l = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: i < 2 ? GREEN : 0x23292c, toneMapped: false })); l.position.set(-5 + i * 2.4, 1.85, 3.54); sw.add(l); }
  sw.updateMatrixWorld(true); pc.updateMatrixWorld(true);
  const swP = (i) => sw.localToWorld(V(-5 + i * 2.4, 1.15, 3.6));
  const ethM = std(0x1f6f89, 0.52, 0.08), ethW = std(0xd7a53f, 0.52, 0.08);
  tube(desk, [swP(0), swP(0).add(V(0, 0.2, 3)), V(62, 0.5, 8), V(68, 0.5, -10), pc.localToWorld(V(PCW / 2 - 4, 3, -PCD / 2 - 0.6))], 0.2, ethM);
  tube(desk, [swP(1), swP(1).add(V(0, 0.2, 3)), V(40, 0.5, 8), V(20, 0.5, -3), V(10, 2, -17), V(SCREEN.x, 6, SCREEN.z - 5)], 0.2, ethM);
  const wanEnd = V(42, 0.45, 15);
  tube(desk, [V(90, 0.5, -2), V(74, 0.5, 8), V(56, 0.5, 16), wanEnd], 0.2, ethW);
  box(desk, 1.6, 1, 2.4, std(0xc6cbd0, 0.3, 0.1), wanEnd.x - 1, 0.55, wanEnd.z - 0.2);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 1.8), std(0xffffff, 0.7, 0, { map: texture(290, 90, (g, w, h) => { g.fillStyle = '#ded9c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181b'; g.font = `700 32px ${FONT}`; g.fillText('WAN: out', 26, 58); }) })); tag.rotation.x = -Math.PI / 2; tag.rotation.z = 0.28; tag.position.set(wanEnd.x + 4.6, 0.22, wanEnd.z + 1.8); desk.add(tag);
  // Display cable from the screen to the computer
  tube(desk, [V(SCREEN.x + 2, SCREEN.y - 4, SCREEN.z - 3), V(SCREEN.x + 10, 8, SCREEN.z - 7), pc.localToWorld(V(PCW / 2 - 7, 8, -PCD / 2 - 2.2)), pc.localToWorld(V(PCW / 2 - 7, 16, -PCD / 2 - 0.5))], 0.26, M.cable);
  // Keyboard and mouse, because this is someone's real desk
  const kb = new THREE.Group(); kb.position.set(16, 0, 24); kb.rotation.y = -0.05; desk.add(kb);
  box(kb, 37, 0.9, 13, M.alu, 0, 0.5, 0);
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(2.05, 0.55, 2.05), M.key, 75); let ki = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { mx.compose(V(-16.2 + c * 2.32, 1.15, -4.7 + r * 2.35), new THREE.Quaternion(), one); keys.setMatrixAt(ki++, mx); }
  keys.castShadow = true; kb.add(keys);
  const legend = new THREE.Mesh(new THREE.PlaneGeometry(34.8, 11.75), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: texture(1392, 470, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(214,218,222,.92)'; g.font = `600 26px ${FONT}`; ['`1234567890-=<<', 'TQWERTYUIOP[]/ ', 'CASDFGHJKL;:ENT', 'SZXCVBNM,./^S  ', 'CAM     MAR<v>F'].forEach((row, r) => [...row].forEach((c, i) => { if (c !== ' ') g.fillText(c, 22 + i * 92.8, 62 + r * 94); })); }) })); legend.rotation.x = -Math.PI / 2; legend.position.set(0.28, 1.44, 0); kb.add(legend);
  const mouse = new THREE.Mesh(new THREE.SphereGeometry(2.3, 24, 16), M.key); mouse.scale.set(0.8, 0.5, 1.25); mouse.position.set(41, 1, 25); mouse.castShadow = true; desk.add(mouse);

  // ---------- A piece of 3D that belongs to each scene. Counts are the screen's own figures. ----------
  function buildPiece(kind, W, H) {
    const group = new THREE.Group(), q0 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), c0 = new THREE.Color();
    const AMB = new THREE.Color(0xffb44a), DIM = new THREE.Color(0x1b2024), GRN = new THREE.Color(GREEN), BLU = new THREE.Color(0x4fa3d1);
    if (kind === 'graph') {
      const N = 46, rr = (() => { let s = 41; return () => (s = (s * 16807) % 2147483647) / 2147483647; })(), pts = [];
      for (let i = 0; i < N; i++) { const a = rr() * Math.PI * 2, z = rr() * 2 - 1, r = Math.sqrt(1 - z * z), R0 = 6.2 * (0.5 + rr() * 0.5); pts.push(V(Math.cos(a) * r * R0 * 1.85, z * R0, Math.sin(a) * r * R0 * 0.8)); }
      const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.46, 14, 10), new THREE.MeshBasicMaterial({ toneMapped: false }), N);
      pts.forEach((p, i) => { m4.compose(p, q0, one); nodes.setMatrixAt(i, m4); nodes.setColorAt(i, i < 15 ? BLU : i < 34 ? GRN : AMB); }); group.add(nodes);
      const seg = []; for (let i = 15; i < N; i++) { let best = 0, bd = 1e9; for (let j = 0; j < 15; j++) { const d = pts[i].distanceTo(pts[j]); if (d < bd) { bd = d; best = j; } } seg.push(pts[i], pts[best]); }
      const lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), new THREE.LineBasicMaterial({ color: 0x7fb6c8, transparent: true, opacity: 0.55, toneMapped: false })); group.add(lines);
      return { group, update(v, t) { group.rotation.y = t * 0.35; nodes.scale.setScalar(v); lines.scale.setScalar(v); } };
    }
    if (kind === 'tests') {
      const C = 11, Rw = 9, cube = new THREE.InstancedMesh(new RoundedBoxGeometry(1.75, 0.95, 0.9, 1, 0.1), new THREE.MeshBasicMaterial({ toneMapped: false }), 99);
      for (let i = 0; i < 99; i++) { m4.compose(V((i % C - 5) * 2.2, (4 - Math.floor(i / C)) * 1.26, 0), q0, one); cube.setMatrixAt(i, m4); cube.setColorAt(i, DIM); } group.add(cube);
      let last = -1; return { group, update(v) { const n = Math.floor(v * 99); if (n === last) return; last = n; for (let i = 0; i < 99; i++) cube.setColorAt(i, i < n ? GRN : DIM); cube.instanceColor.needsUpdate = true; } };
    }
    if (kind === 'bars') {
      const bars = new THREE.InstancedMesh(new RoundedBoxGeometry(1.38, 1, 0.9, 1, 0.09), new THREE.MeshBasicMaterial({ color: GREEN, toneMapped: false }), 12), rails = new THREE.InstancedMesh(new THREE.BoxGeometry(1.38, 9.5, 0.2), new THREE.MeshBasicMaterial({ color: 0x1b2024, toneMapped: false }), 12);
      for (let i = 0; i < 12; i++) { m4.compose(V((i - 5.5) * 2.05, 0, -0.5), q0, one); rails.setMatrixAt(i, m4); } group.add(rails, bars);
      return { group, update(v) { for (let i = 0; i < 12; i++) { const h = Math.max(0.02, ramp(v, i * 0.05, 0.42 + i * 0.05) * 9.5); m4.compose(V((i - 5.5) * 2.05, -4.75 + h / 2, 0), q0, V(1, h, 1)); bars.setMatrixAt(i, m4); } bars.instanceMatrix.needsUpdate = true; } };
    }
    if (kind === 'proof') {
      const C = 49, cube = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), new THREE.MeshBasicMaterial({ toneMapped: false }), 1172);
      for (let i = 0; i < 1172; i++) { m4.compose(V((i % C - 24) * 0.5, (11.5 - Math.floor(i / C)) * 0.47, 0), q0, one); cube.setMatrixAt(i, m4); cube.setColorAt(i, DIM); } group.add(cube);
      let last = -1; return { group, update(v) { const n = Math.floor(v * 1172); if (n === last) return; last = n; for (let i = 0; i < 1172; i++) cube.setColorAt(i, i < n ? c0.copy(GRN).lerp(AMB.clone().set(CYAN), (i % C) / C * 0.7) : DIM); cube.instanceColor.needsUpdate = true; } };
    }
    if (kind === 'chain') {
      const linkM = new THREE.MeshMatcapMaterial({ matcap: texture(256, 256, (g, w) => { g.fillStyle = '#16191c'; g.fillRect(0, 0, w, w); const r = g.createRadialGradient(w * 0.38, w * 0.3, 8, w / 2, w / 2, w / 2); r.addColorStop(0, '#ffffff'); r.addColorStop(0.35, '#aeb6bd'); r.addColorStop(0.72, '#3a4148'); r.addColorStop(1, '#101316'); g.fillStyle = r; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill(); }) }), L = [];
      const plateT = (s) => texture(256, 96, (g, w, h) => { g.fillStyle = '#0d1a15'; g.fillRect(0, 0, w, h); g.fillStyle = '#9ff5c0'; g.font = `700 40px ${FONT}`; g.fillText(s, 16, 62); });
      for (let i = 0; i < 7; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.34, 14, 34), linkM); t.scale.y = 1.42; t.position.set(-10.5 + i * 3.5, 0.6, 0); t.rotation.x = i % 2 ? Math.PI / 2 : 0; t.rotation.z = Math.PI / 2; group.add(t); L.push(t); }
      ['a1f3', '77c0', 'd92e', '04bb'].forEach((s, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.6), new THREE.MeshBasicMaterial({ map: plateT(s), toneMapped: false })); p.position.set(-10.5 + i * 7, -3.9, 0.3); group.add(p); L.push(p); });
      return { group, update(v, t) { L.forEach((m, i) => { const e = ramp(v, i * 0.05, 0.42 + i * 0.05); m.scale.x = e || 0.001; m.visible = e > 0.01; }); group.rotation.y = Math.sin(t * 0.5) * 0.12; } };
    }
    // Annex A: 71 tiles. 39 partial, 32 open, none satisfied.
    const C = 13, tile = new THREE.InstancedMesh(new RoundedBoxGeometry(1.75, 1.62, 0.5, 1, 0.1), new THREE.MeshBasicMaterial({ toneMapped: false }), 71);
    for (let i = 0; i < 71; i++) { m4.compose(V((i % C - 6) * 1.98, (2.5 - Math.floor(i / C)) * 1.86, 0), q0, one); tile.setMatrixAt(i, m4); tile.setColorAt(i, DIM); } group.add(tile);
    let lastN = -1; return { group, update(v) { const n = Math.floor(v * 71); if (n !== lastN) { lastN = n; for (let i = 0; i < 71; i++) tile.setColorAt(i, i < n && i < 39 ? AMB : c0.setHex(i < n ? 0x2c333a : 0x14181b)); tile.instanceColor.needsUpdate = true; } for (let i = 0; i < 71; i++) { m4.compose(V((i % C - 6) * 1.98, (2.5 - Math.floor(i / C)) * 1.86, i < 39 ? 0.5 * Math.min(1, n / 39) : 0), q0, one); tile.setMatrixAt(i, m4); } tile.instanceMatrix.needsUpdate = true; } };
  }

  // ---------- The IDE's real surfaces ----------
  const loader = new THREE.TextureLoader();
  const paneObjs = PANES.map((P, i) => {
    const { f: file, dx, dy, turn } = P;
    const g = new THREE.Group(); g.position.set(SCREEN.x + dx, SCREEN.y + dy, paneZ(i)); g.rotation.y = turn; scene.add(g);
    const base = g.position.clone();
    const [lx, ly] = P.at, cap = P.cap, LW = 27, LH = 13.5, cw = P.zw || 0.3, ch = cw * (LH / LW) * (IMG_W / 1186), [cu, cv] = P.zoom || [0.5, 0.5];
    const zoomT = new THREE.Texture(); zoomT.colorSpace = THREE.SRGBColorSpace; zoomT.anisotropy = maxAniso; zoomT.repeat.set(cw, ch); zoomT.offset.set(clamp(cu - cw / 2, 0, 1 - cw), clamp(1 - cv - ch / 2, 0, 1 - ch));
    const layerTex = [];
    const tex = loader.load(`${imgBase}${file}.jpg`, (t) => { [zoomT, ...layerTex].forEach((x) => { x.image = t.image; x.needsUpdate = true; }); });
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = maxAniso; tex.repeat.set(1, 1 - CROP); tex.generateMipmaps = true;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, color: 0xffffff });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(PANE_W, PANE_H), mat); m.position.z = 0.02; g.add(m);
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(PANE_W + 0.5, PANE_H + 0.5), new THREE.MeshBasicMaterial({ color: 0x3a4750, transparent: true, toneMapped: false })); g.add(frame);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(PANE_W * 1.5, PANE_H * 1.7), new THREE.MeshBasicMaterial({ map: haloTex(), color: CYAN, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false })); halo.position.z = -0.4; g.add(halo);
    // Layers: crops of the same capture, each its own thin slab with a soft shadow on the screen below.
    const shadowT = haloTex();
    const layerT = (u0, v0, u1, v1) => { const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; t.repeat.set(u1 - u0, v1 - v0); t.offset.set(u0, 1 - v1); return t; };
    const layerObjs = [...CHROME.map((c) => [c, 0.5]), ...P.layers.map((c, k) => [c, 1.6 + k * 0.8])].map(([[u0, v0, u1, v1], lift], k) => {
      const lw = (u1 - u0) * PANE_W, lh = (v1 - v0) / (1 - CROP) * PANE_H, cx = ((u0 + u1) / 2 - 0.5) * PANE_W, cy = (0.5 - ((v0 + v1) / 2 - CROP) / (1 - CROP)) * PANE_H;
      const t = layerT(u0, v0, u1, v1); layerTex.push(t);
      const lg = new THREE.Group(); lg.position.set(cx, cy, 0.03 + k * 0.01); g.add(lg);
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(lw * 1.1, lh * 1.22), new THREE.MeshBasicMaterial({ map: shadowT, color: 0x000000, transparent: true, depthWrite: false, opacity: 0 })); sh.position.set(0.5, -0.5, -0.02); lg.add(sh);
      const e = new THREE.Mesh(new THREE.PlaneGeometry(lw + 0.16, lh + 0.16), new THREE.MeshBasicMaterial({ color: 0x6bb8c7, transparent: true, toneMapped: false, opacity: 0 })); lg.add(e);
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, opacity: 0 })); pl.position.z = 0.01; lg.add(pl);
      return { lg, lift, base: 0.03 + k * 0.01, mats: [sh.material, e.material, pl.material] };
    });
    const zoom = new THREE.Group(); zoom.position.set(lx, ly, 3.2); g.add(zoom);
    const zBack = new THREE.MeshBasicMaterial({ color: 0x4f9c7b, transparent: true, toneMapped: false, opacity: 0 });
    zoom.add(new THREE.Mesh(new THREE.PlaneGeometry(LW + 0.34, LH + 0.34), zBack));
    const zMat = new THREE.MeshBasicMaterial(P.piece ? { color: 0x06090b, transparent: true, toneMapped: false, opacity: 0 } : { map: zoomT, transparent: true, toneMapped: false, opacity: 0 });
    const pieceObj = P.piece ? buildPiece(P.piece, LW, LH) : null; if (pieceObj) { pieceObj.group.position.z = 0.5; zoom.add(pieceObj.group); }
    const zm = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), zMat); zm.position.z = 0.04; zoom.add(zm);
    const capT = texture(1024, 76, (c, w, h) => { c.fillStyle = 'rgba(4,14,11,.97)'; c.fillRect(0, 0, w, h); c.fillStyle = '#b8f7cb'; c.font = `600 ${cap.length > 44 ? 31 : 36}px ${FONT}`; c.textBaseline = 'middle'; c.fillText(cap, 20, h / 2 + 2); });
    const capM = new THREE.MeshBasicMaterial({ map: capT, transparent: true, toneMapped: false, opacity: 0 });
    const capMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW, LW * 76 / 1024), capM); capMesh.position.set(0, -LH / 2 - LW * 38 / 1024 - 0.17, 0.05); zoom.add(capMesh);
    g.updateMatrixWorld(true);
    return { g, base, mat, frame: frame.material, halo: halo.material, zoom, zMats: [zBack, zMat, capM], layerObjs, pieceObj };
  });
  function haloTex() {
    if (haloTex.t) return haloTex.t;
    haloTex.t = texture(256, 256, (c, w) => { const r = c.createRadialGradient(w / 2, w / 2, w * 0.2, w / 2, w / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, w, w); });
    return haloTex.t;
  }
  const anchor = (i, [u, v], z = 0.25) => paneObjs[i].g.localToWorld(V((u - 0.5) * PANE_W, (0.5 - (v - CROP) / (1 - CROP)) * PANE_H, z));

  const restIn = PANES.map((P, i) => anchor(i, P.in));
  // ---------- The thread: one requirement, followed through the work ----------
  const threadMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, transparent: true });
  const threads = [], rings = [], collars = [];
  const colA = new THREE.Color(CYAN), colB = new THREE.Color(GREEN);
  for (let i = 0; i < PANES.length - 1; i++) {
    const a = anchor(i, PANES[i].out), b = anchor(i + 1, PANES[i + 1].in);
    const curve = new THREE.CatmullRomCurve3([a, a.clone().add(V(0, 0, 9)), a.clone().lerp(b, 0.5).add(V((i % 2 ? 1 : -1) * 16, 16, 0)), b.clone().add(V(0, 17, 12)), b.clone().add(V(0, 4, 3)), b]);
    const geo = new THREE.TubeGeometry(curve, 140, 0.26, 8);
    const cnt = geo.attributes.position.count, col = new Float32Array(cnt * 3), tmp = new THREE.Color();
    for (let k = 0; k < cnt; k++) { tmp.copy(colA).lerp(colB, (i + k / cnt) / (PANES.length - 1)); col.set([tmp.r, tmp.g, tmp.b], k * 3); }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mesh = new THREE.Mesh(geo, threadMat); scene.add(mesh); threads.push({ mesh, total: geo.index.count, curve });
  }
  const headMat = new THREE.MeshBasicMaterial({ color: 0xeafff6, toneMapped: false });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), headMat); scene.add(head);
  const headGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: GREEN, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false })); headGlow.scale.set(9, 9, 1); scene.add(headGlow);
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.34, 10, 8), new THREE.MeshBasicMaterial({ color: 0xd8fff0, toneMapped: false }), (PANES.length - 1) * 5);
  beads.frustumCulled = false; scene.add(beads);
  PANES.forEach((P, i) => {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.4, 28), new THREE.MeshBasicMaterial({ color: 0x24303a, toneMapped: false })); collar.rotation.x = Math.PI / 2; collar.position.copy(anchor(i, P.in, 0.1)); scene.add(collar); collar.visible = false; collars.push(collar);
    const ringMat = new THREE.MeshBasicMaterial({ color: i === 0 ? CYAN : GREEN, toneMapped: false, transparent: true, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.28, 1.56, 44), ringMat); ring.position.copy(anchor(i, P.in, 0.32)); ring.rotation.y = P.turn; scene.add(ring); rings.push({ ring, ringMat });
  });

  // ---------- Camera ----------
  let width = 1, height = 1, frac = 0.64;
  function paneDistance() {
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const byW = PANE_W / frac / (2 * tan * camera.aspect), byH = PANE_H / (width >= 900 ? 0.84 : 0.9) / (2 * tan);
    return Math.max(byW, byH);
  }
  function resize() {
    const r = canvas.getBoundingClientRect(); width = Math.max(1, r.width); height = Math.max(1, r.height);
    renderer.setSize(width, height, false); camera.aspect = width / height;
    if (width >= 900) { camera.setViewOffset(width, height, -width * 0.185, 0, width, height); frac = 0.57; } else { camera.clearViewOffset(); frac = 0.84; }
    camera.updateProjectionMatrix(); buildKeys();
  }
  let KEYS = [];
  function buildKeys() {
    const d = paneDistance(), w = camera.aspect < 1.15 ? 1 + (1.15 - camera.aspect) * 0.8 : 1;
    const out = (x, y, z, tx, ty, tz) => [tx + (x - tx) * w, ty + (y - ty) * w, tz + (z - tz) * w, tx, ty, tz];
    KEYS = [
      [0, ...out(2, 76, 196, 12, 22, -10)],
      [0.05, ...out(-44, 17, 44, -20, 3, 13)],
      [0.09, ...out(-31, 6.4, 25, -23.5, 2.5, 12)],
      [0.125, ...out(-17, 9, 26, -9, 4, 3)],
      [0.165, ...out(30, 34, 60, 70, 24, -28)],
      [0.2, ...out(46, 28, 44, 71, 25, -29)],
      [0.235, ...out(-3, 25, 92, 6, 24, -12)],
    ];
    PANES.forEach((P, i) => {
      const a = paneArrive(i), n = V(Math.sin(P.turn), 0, Math.cos(P.turn)), c = paneObjs[i].base;
      const at = (dist, f) => { const look = c.clone().lerp(restIn[i], f); return [look.x + n.x * dist, look.y + n.y * dist + 1.5, look.z + n.z * dist, look.x, look.y, look.z]; };
      KEYS.push([a, ...at(d, 0)], [a + DWELL, ...at(d * 0.95, 0.05)]);
    });
    const lastI = PANES.length - 1, lt = PANES[lastI].turn, ln = V(Math.sin(lt), 0, Math.cos(lt)), lc = paneObjs[lastI].base;
    KEYS.push([1, lc.x + ln.x * d * 0.97, lc.y + ln.y * d * 0.97 + 1, lc.z + ln.z * d * 0.97, lc.x, lc.y, lc.z]);
  }
  function track(p) {
    if (p <= KEYS[0][0]) return KEYS[0].slice(1);
    for (let i = 0; i < KEYS.length - 1; i++) { const a = KEYS[i], b = KEYS[i + 1]; if (p <= b[0]) { const t = ramp(p, a[0], b[0]); return a.slice(1).map((v, k) => lerp(v, b[k + 1], t)); } }
    return KEYS[KEYS.length - 1].slice(1);
  }

  const id0 = new THREE.Quaternion();
  let lastStop = -1;
  function pose(p, t) {
    const [cx, cy, cz, tx, ty, tz] = track(p);
    camera.position.set(cx, cy, cz); camera.lookAt(tx, ty, tz);
    // Lights down as we go into the IDE; the screen stays on.
    const lights = 1 - ramp(p, 0.222, 0.262);
    key.intensity = 1.25 * lights; rim.intensity = 0.55 * lights; glow.intensity = 700 * lights; lamp.intensity = 3900 * lights; scene.environmentIntensity = 0.36 * lights;
    pulseMat.alphaMap.offset.x = -t * 0.33; pulseMat.opacity = 0.75 * lights; dust.rotation.y = Math.sin(t * 0.05) * 0.06; dust.position.y = Math.sin(t * 0.17) * 0.7;
    if (lights > 0.01 && Math.floor(t * 15) !== scopeLast) { scopeLast = Math.floor(t * 15); drawScope(t); }
    desk.visible = lights > 0.002;
    ledMat[0].emissiveIntensity = 2.2 + Math.sin(t * 4) * 1.6; ledMat[1].emissiveIntensity = Math.floor(t * 3) % 2 ? 3 : 0.4; probeLed.emissiveIntensity = Math.floor(t * 7) % 3 ? 2.6 : 0.3;
    const reveal = 0;
    if (lights > 0.01) { fans.forEach((c, i) => { c.hub.rotation.z = t * (5.5 + i * 0.7); }); cabinGlow.intensity = 160 * lights; }
    // Between screens, the camera banks and the lens opens a little.
    let travel = 0, dir = 0; for (let i = 0; i < PANES.length - 1; i++) { const s = paneArrive(i) + DWELL, e = paneArrive(i + 1); if (p > s && p < e) { travel = Math.sin((p - s) / (e - s) * Math.PI); dir = i % 2 ? -1 : 1; } }
    const roll = travel * dir * 0.075; camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(tx, ty, tz);
    const fov = 32 + travel * 7; if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    paneObjs.forEach((o, i) => {
      const side = i % 2 ? -1 : 1, a = paneArrive(i), last = i === PANES.length - 1;
      // Screens swing in from the side like cards being dealt, and swing away when finished.
      const swingIn = i === 0 ? 1 : ramp(p, a - 0.07, a + 0.002), swingOut = last ? 0 : ramp(p, a + DWELL + 0.004, a + DWELL + 0.05);
      o.g.rotation.y = PANES[i].turn + side * 1.05 * (1 - swingIn) - side * 1.25 * swingOut;
      o.g.position.set(o.base.x + side * 34 * (1 - swingIn) - side * 44 * swingOut, o.base.y - 7 * (1 - swingIn) + 4 * swingOut, o.base.z - 34 * (1 - swingIn) + 18 * swingOut);
      const near = i === 0 ? 1 : ramp(p, a - 0.075, a - 0.01), leave = 1 - ramp(p, a + DWELL + 0.005, a + DWELL + 0.04);
      const focus = Math.max(near * (i === PANES.length - 1 ? 1 : leave), reveal);
      const started = i === 0 ? 1 : ramp(p, a - 0.1, a - 0.06);
      const passed = i === PANES.length - 1 ? 0 : ramp(p, a + DWELL + 0.012, a + DWELL + 0.042);
      const op = Math.max(started * lerp(0.34, 1, focus) * (1 - passed), reveal * 0.95);
      o.mat.opacity = op; o.frame.opacity = op * (0.5 + focus * 0.5); o.halo.opacity = 0.32 * focus * (1 - reveal * 0.55);
      o.mat.color.setScalar(lerp(0.55, 1, focus));
      o.g.visible = op > 0.003;
      // The close-up rises off the screen once the camera has settled, and goes before it leaves.
      const inT = ramp(p, a + 0.004, a + 0.024), outT = i === PANES.length - 1 ? 0 : ramp(p, a + DWELL + 0.012, a + DWELL + 0.03);
      const lift = inT * (1 - outT) * (1 - reveal), solid = clamp(lift * 3.2);
      o.zMats.forEach((m) => { m.opacity = solid; }); o.zoom.visible = lift > 0.003;
      o.zoom.position.z = 7 + lift * 2; o.zoom.scale.setScalar(lerp(0.82, 1, lift));
      if (o.pieceObj && o.zoom.visible) o.pieceObj.update(ramp(p, a + 0.008, last ? a + 0.1 : a + DWELL), t);
      // Come apart as the camera arrives; settle back as it leaves. The closing shot keeps them apart.
      const apart = Math.max(ramp(p, a - 0.03, a + 0.012) * (i === PANES.length - 1 ? 1 : 1 - ramp(p, a + DWELL + 0.002, a + DWELL + 0.03)), reveal);
      o.layerObjs.forEach((l, k) => { const e = clamp(apart * 1.6 - k * 0.07); const v = ramp(e, 0, 1); l.lg.position.z = l.base + v * l.lift * 1.5; l.lg.visible = v > 0.003 && op > 0.01; l.mats[0].opacity = v * 0.75 * op; l.mats[1].opacity = v * 0.42 * op; l.mats[2].opacity = v * op; });
    });
    // Draw the thread from each surface to the next.
    let headAt = null;
    threads.forEach((th, i) => {
      const d = ramp(p, paneArrive(i) + DWELL * 0.7, paneArrive(i + 1) + 0.005);
      th.mesh.geometry.setDrawRange(0, Math.floor(th.total * d / 3) * 3); th.mesh.visible = d > 0.002;
      if (d > 0.002 && d < 0.998) headAt = th.curve.getPointAt(clamp(d));
    });
    let bi = 0; threads.forEach((th, i) => { const d = ramp(p, paneArrive(i) + DWELL * 0.7, paneArrive(i + 1) + 0.005); for (let k = 0; k < 5; k++) { const f = ((t * 0.16 + k / 5) % 1) * d; if (d > 0.04) { mx.compose(th.curve.getPointAt(clamp(f)), id0, one); } else mx.makeScale(0, 0, 0); beads.setMatrixAt(bi++, mx); } }); beads.instanceMatrix.needsUpdate = true; beads.visible = p > 0.26;
    head.visible = headGlow.visible = !!headAt; if (headAt) { head.position.copy(headAt); headGlow.position.copy(headAt); }
    rings.forEach(({ ring, ringMat }, i) => {
      const lit = i === 0 ? ramp(p, paneArrive(0) - 0.01, paneArrive(0) + 0.02) : ramp(p, paneArrive(i) - 0.01, paneArrive(i) + 0.015);
      ring.visible = lit > 0.002; ringMat.opacity = lit * (0.72 + Math.sin(t * 3.2 + i) * 0.28); ring.scale.setScalar(lerp(2.4, 1, lit) + (lit > 0.9 ? Math.sin(t * 3.2 + i) * 0.05 : 0));
    });
    const st = stopOf(p); if (st !== lastStop) { lastStop = st; if (onStop) onStop(st); }
  }

  let seeded = false, target = 0, cur = 0, raf = 0, on = false, last = 0, dirty = true, slow = 0, frames = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000) || 0.016; last = now;
    cur += (target - cur) * (1 - Math.exp(-dt * 6));
    pose(cur, now / 1000); renderer.render(scene, camera);
    frames++; if (dt > 0.03) slow++;
    if (frames === 45) { if (slow > 28 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); } frames = 0; slow = 0; }
  }
  const ro = new ResizeObserver(() => { resize(); if (still) draw(); }); ro.observe(canvas);
  const draw = () => { pose(cur, 2); renderer.render(scene, camera); };
  resize();
  const api = {
    setProgress(p) { target = clamp(p); if (still || !seeded) { seeded = true; cur = target; draw(); } },
    start() { if (still || on) return; on = true; last = performance.now(); raf = requestAnimationFrame(frame); },
    stop() { on = false; cancelAnimationFrame(raf); },
    redraw: draw,
    dispose() { api.stop(); ro.disconnect(); renderer.dispose(); envRT.dispose(); pmrem.dispose(); },
  };
  draw();
  return api;
}
