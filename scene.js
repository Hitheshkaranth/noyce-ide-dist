/* scene.js — Three.js hero MCU chip + scroll/motion behaviors */

(function() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------ Hero MCU chip (Three.js) ------------ */
  function initChip() {
    const host = document.getElementById('chip-stage');
    if (!host) return;
    if (reduced || typeof THREE === 'undefined') {
      host.classList.add('static');
      return;
    }

    const w = host.clientWidth, h = host.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
    camera.position.set(0, 4.2, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    host.appendChild(renderer.domElement);

    const chipGroup = new THREE.Group();
    scene.add(chipGroup);

    // body (matte black silicon)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d12, metalness: 0.4, roughness: 0.55,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 2.4), bodyMat);
    body.position.y = 0;
    chipGroup.add(body);

    // beveled top inset
    const topInset = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.04, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x14181f, metalness: 0.3, roughness: 0.7 })
    );
    topInset.position.y = 0.11;
    chipGroup.add(topInset);

    // chip-1 marking (subtle copper dot at pin1)
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 24),
      new THREE.MeshBasicMaterial({ color: 0xb87333 })
    );
    dot.rotation.x = -Math.PI / 2;
    dot.position.set(-0.85, 0.131, -0.85);
    chipGroup.add(dot);

    // text-like silk lines
    const silkMat = new THREE.MeshBasicMaterial({ color: 0x2a3340 });
    for (let i = 0; i < 3; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.001, 0.02), silkMat);
      line.position.set(0, 0.131, -0.1 + i * 0.1);
      chipGroup.add(line);
    }

    // pins — 36 per side × 4 = 144 (LQFP)
    const pinsPerSide = 36;
    const pinLen = 0.36;
    const pinW = 0.04;
    const pinH = 0.05;
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xc8a878, metalness: 0.9, roughness: 0.35,
      emissive: 0x000000,
    });
    const pinGeom = new THREE.BoxGeometry(pinW, pinH, pinLen);

    const pins = [];
    const sideOffset = 1.2 + pinLen / 2;
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < pinsPerSide; i++) {
        const m = new THREE.Mesh(pinGeom, pinMat.clone());
        const t = (i + 0.5) / pinsPerSide;
        const along = -1.05 + t * 2.1;
        if (side === 0) {
          m.position.set(along, 0, -sideOffset);
        } else if (side === 1) {
          m.rotation.y = Math.PI / 2;
          m.position.set(sideOffset, 0, along);
        } else if (side === 2) {
          m.position.set(along, 0, sideOffset);
        } else {
          m.rotation.y = Math.PI / 2;
          m.position.set(-sideOffset, 0, along);
        }
        chipGroup.add(m);
        pins.push({ mesh: m, side, i });
      }
    }

    // pcb pedestal grid (subtle)
    const grid = new THREE.GridHelper(10, 30, 0x1a2230, 0x0f141c);
    grid.position.y = -0.6;
    scene.add(grid);

    // lights
    scene.add(new THREE.AmbientLight(0x202838, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(4, 6, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0x22e07e, 1.25, 10);
    rim.position.set(-3, 2, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(0xaebccc, 0.45, 12);
    fill.position.set(3, 1, 3);
    scene.add(fill);

    // pointer-tracking glow
    const cursor = { x: 0, y: 0 };
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      cursor.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      cursor.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });

    // resize
    const onResize = () => {
      const W = host.clientWidth, H = host.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      chipGroup.rotation.y = Math.PI / 6 + Math.sin(t * 0.18) * 0.15 + cursor.x * 0.18;
      chipGroup.rotation.x = -0.18 + cursor.y * 0.08;

      // pin pulse — procedural wave around the perimeter
      const N = pins.length;
      for (let k = 0; k < N; k++) {
        // perimeter index
        const idx = k;
        const phase = (idx / N) * Math.PI * 2;
        const wave = Math.sin(t * 1.6 - phase * 3) * 0.5 + 0.5;
        const lift = Math.max(0, wave - 0.8) * 5; // sparse pulses
        // signal-green emissive pulse (matches the page's single accent)
        pins[k].mesh.material.emissive.setRGB(
          lift * 0.13, lift * 0.88, lift * 0.49
        );
      }

      rim.position.x = -3 + cursor.x * 1.5;
      rim.position.z = -3 - cursor.y * 1.5;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ------------ Reveal on scroll ------------ */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ------------ Scroll progress ------------ */
  function initProgress() {
    const bar = document.getElementById('progress');
    if (!bar) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sc = document.documentElement;
        const max = sc.scrollHeight - sc.clientHeight;
        const p = Math.max(0, Math.min(1, sc.scrollTop / Math.max(1, max)));
        bar.style.setProperty('--p', (p * 100).toFixed(2) + '%');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------ Nav glassiness on scroll ------------ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 12) nav.classList.add('is-stuck');
      else nav.classList.remove('is-stuck');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------ Sticky scroll-jack: step indices ------------ */
  function initScrolljack(rootSel) {
    document.querySelectorAll(rootSel).forEach(root => {
      const steps = root.querySelectorAll('[data-step]');
      const stage = root.querySelector('[data-stage]');
      if (!steps.length || !stage) return;
      const layers = stage.querySelectorAll('[data-layer]');
      const kinetic = root.querySelector('[data-kinetic]');
      const kineticItems = kinetic ? kinetic.querySelectorAll('span') : [];

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = +e.target.dataset.step;
            layers.forEach((l, i) => l.classList.toggle('is-active', i === idx));
            kineticItems.forEach((s, i) => s.classList.toggle('is-active', i === idx));
          }
        });
      }, { threshold: 0.5, rootMargin: '-30% 0px -30% 0px' });
      steps.forEach(s => io.observe(s));
    });
  }

  /* ------------ Demo reel ------------ */
  function initReel() {
    const reel = document.getElementById('reel');
    if (!reel) return;
    const slides = reel.querySelectorAll('.reel-slide');
    const cap = reel.querySelector('.reel-caption');
    const bar = reel.querySelector('.reel-progress .bar');
    let i = 0;
    function tick() {
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      cap.textContent = slides[i].dataset.caption;
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        bar.style.transition = 'width 1.6s linear';
        bar.style.width = '100%';
      });
      i = (i + 1) % slides.length;
    }
    tick();
    setInterval(tick, 1600);
  }

  /* ------------ Pipeline progressive light-up ------------ */
  function initPipeline() {
    const pl = document.getElementById('pipeline');
    if (!pl) return;
    const stages = pl.querySelectorAll('.stage');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          stages.forEach((s, k) => {
            setTimeout(() => s.classList.add('is-active'), k * 220);
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(pl);
  }

  /* ------------ Platform autodetect ------------ */
  function initPlatform() {
    const ua = navigator.userAgent;
    const cta = document.getElementById('primary-dl');
    if (!cta) return;
    let label = 'Download for macOS';
    let icon = '';
    if (/Win/i.test(ua)) label = 'Download for Windows';
    else if (/Linux/i.test(ua) && !/Android/i.test(ua)) label = 'Download for Linux';
    else if (/Mac/i.test(ua)) label = 'Download for macOS';
    const span = cta.querySelector('.lbl');
    if (span) span.textContent = label;
  }

  /* ---- AI Galaxy (SVG, decorative) ---- */
  function initGalaxy() {
    if (reduced) return;
    const g = document.getElementById('galaxy');
    if (!g) return;
    const sats = g.querySelectorAll('[data-sat]');
    let t = 0;
    function tick() {
      t += 0.005;
      sats.forEach((s, i) => {
        const a = t + (i * Math.PI * 2) / sats.length;
        const r = 220;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.45;
        s.setAttribute('transform', `translate(${x}, ${y})`);
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---- init ---- */
  function init() {
    initNav();
    initReveal();
    initProgress();
    initScrolljack('.scrolljack');
    initReel();
    initPipeline();
    initPlatform();
    initGalaxy();
    // chip on idle so initial paint is fast
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initChip, { timeout: 400 });
    } else {
      setTimeout(initChip, 100);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
