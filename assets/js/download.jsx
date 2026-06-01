/* 3D Download cards — tilt, glowing OS mark, size meter, signature badge, copy snippet */

function OSMark({ kind }) {
  if (kind === 'mac') return (<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" fill="#7dd3fc"/><circle cx="12" cy="12" r="2.4" fill="#a78bfa"/><circle cx="18" cy="12" r="2.4" fill="#4ade80"/></svg>);
  if (kind === 'win') return (<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>);
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2-3 2M12 14h4"/></svg>);
}

function CopyCmd({ cmd }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(cmd).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }).catch(() => {});
  };
  return (
    <button className="dl-cmd" onClick={copy} title="Copy to clipboard">
      <span className="mono">{cmd}</span>
      <span className="dl-copy">{copied ? '✓ copied' : 'copy'}</span>
    </button>
  );
}

function Download() {
  const cards = [
    { kind: 'mac', os: 'macOS', status: 'Released', sc: 'ok', desc: 'macOS 13 Ventura or later. arm64 native, x86_64 supported.',
      cmd: 'brew install --cask noyce-ide', size: 142, max: 220, arch: 'arm64 · 142 MB', sig: 'ed25519 · notarized',
      href: 'https://github.com/Hitheshkaranth/noyce_ide/releases/latest/download/Noyce_macOS_aarch64.dmg', cta: 'Download · arm64' },
    { kind: 'win', os: 'Windows', status: 'Beta', sc: 'warn', desc: 'Windows 11 · x64 · code-signed · MSI and portable.',
      cmd: 'winget install Noyce.IDE', size: 168, max: 220, arch: 'x64 · 168 MB', sig: 'Authenticode · signed',
      href: 'https://github.com/Hitheshkaranth/noyce_ide/releases/latest/download/Noyce_x64_en-US.msi', cta: 'Download · x64' },
    { kind: 'linux', os: 'Linux', status: 'Roadmap', sc: 'ice', desc: 'Ubuntu 22.04+, Fedora 39+, AppImage and deb. Q3 2026.',
      cmd: 'flatpak install dev.noyce.IDE', size: 0, max: 220, arch: 'AppImage · deb', sig: 'sha256 · planned',
      href: 'https://github.com/Hitheshkaranth/noyce_ide', cta: 'Notify me' },
  ];
  return (
    <section className="section-pad" id="download">
      <div className="wrap">
        <div className="section-head reveal" style={{ margin: '0 auto 56px', textAlign: 'center' }}>
          <span className="kicker">Get Noyce</span>
          <h2>Install. Open a template.<br />Ship a certified binary.</h2>
          <p style={{ margin: '20px auto 0' }}>Noyce is free during beta. macOS arm64 ships today, Windows is in beta, and Linux is on the roadmap.</p>
        </div>
        <div className="dl-grid">
          {cards.map((c, i) => (
            <TiltCard key={c.os} className={'dl-card glass board reveal d' + (i + 1)}>
              <span className="corner-pad tl" /><span className="corner-pad tr" /><span className="corner-pad bl" /><span className="corner-pad br" />
              <div className="dl-head">
                <span className={'dl-mark ' + c.kind}><OSMark kind={c.kind} /></span>
                <span className={'dl-status ' + c.sc}><span className="d" />{c.status}</span>
              </div>
              <h3 className="dl-os">{c.os}</h3>
              <p className="dl-desc">{c.desc}</p>
              <CopyCmd cmd={c.cmd} />
              <div className="dl-meter">
                <div className="dl-meter-top"><span>package</span><span className="mono">{c.arch}</span></div>
                <div className="minibar"><i style={{ width: (c.size ? (c.size / c.max * 100) : 0) + '%' }} /></div>
              </div>
              <div className="dl-sig"><Ico.review style={{ width: 13, height: 13, color: 'var(--green)' }} /><span className="mono">{c.sig}</span></div>
              <a href={c.href} target="_blank" rel="noreferrer" className={'btn btn-sweep dl-btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost')}>
                <Ico.download style={{ width: 16, height: 16 }} /> {c.cta}
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Download });
