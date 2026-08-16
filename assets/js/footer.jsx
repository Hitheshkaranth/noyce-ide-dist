/* Closing CTA + footer */

function Footer() {
  const cols = [
    { h: 'Product', links: [['Features', '#features'], ['AI orchestrator', '#ai'], ['Hardware support', '#hardware'], ['Compliance', '#compliance'], ['Download', '#download']] },
    { h: 'Resources', links: [['Docs', 'https://github.com/Hitheshkaranth/noyce_ide'], ['Changelog', 'https://github.com/Hitheshkaranth/noyce_ide'], ['DO-178C guide', 'https://github.com/Hitheshkaranth/noyce_ide'], ['ISO 26262 guide', 'https://github.com/Hitheshkaranth/noyce_ide']] },
    { h: 'Community', links: [['GitHub', 'https://github.com/Hitheshkaranth/noyce_ide'], ['Discussions', 'https://github.com/Hitheshkaranth/noyce_ide/discussions'], ['Issues', 'https://github.com/Hitheshkaranth/noyce_ide/issues']] },
  ];
  return (
    <React.Fragment>
      <section className="cta">
        <div className="wrap">
          <div className="cta-panel glass reveal">
            <div className="scan" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: 'linear-gradient(180deg, rgba(125,211,252,0.12), transparent)', animation: 'scanline 7s linear infinite', pointerEvents: 'none' }} />
            <span className="kicker">Ship it</span>
            <h2 style={{ marginTop: 22 }}>Ship firmware<br />that <span className="grad">has to be right.</span></h2>
            <div className="cta-actions">
              <a href="#download" className="btn btn-primary btn-sweep"><Ico.download style={{ width: 17, height: 17 }} /> Download Noyce</a>
              <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="btn btn-ghost">Configure your model <Ico.arrow style={{ width: 16, height: 16 }} /></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <a href="#top" className="nav-logo" style={{ fontSize: 17 }}><span className="mark" />Noyce IDE</a>
            <p className="blurb">An AI-native Code-OSS workbench for safety-critical embedded firmware.</p>
            <p className="copy">v2.0.3 · Free during beta</p>
          </div>
          {cols.map((col) => (
            <div key={col.h}>
              <h5>{col.h}</h5>
              {col.links.map(([t, href]) => (
                <a key={t} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{t}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="wrap"><p className="copy">© 2026 Noyce · All rights reserved · Built with Code-OSS, Rust, and React</p></div>
      </footer>
    </React.Fragment>
  );
}

Object.assign(window, { Footer });
