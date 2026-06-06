/* Sticky glass nav with scroll state + active-section indicator */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');
  const links = [
    ['features', 'Features'], ['ai', 'AI'], ['hardware', 'Hardware'],
    ['compliance', 'Compliance'], ['graph', 'Graph'], ['download', 'Download'],
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const ids = ['features', 'ai', 'hardware', 'compliance', 'graph', 'download'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-logo">
          <img className="logo-img" src="icons_resources/logo_horizontal.png" alt="Noyce IDE" />
          <span className="ver">1.0.7</span>
        </a>
        <div className="nav-links">
          {links.map(([id, label]) => (
            <a key={id} href={'#' + id} className={active === id ? 'active' : ''}>{label}</a>
          ))}
        </div>
        <div className="nav-cta">
          <a href="https://github.com/Hitheshkaranth/noyce_ide" className="btn btn-ghost" target="_blank" rel="noreferrer">
            <Ico.github style={{ width: 16, height: 16 }} /> GitHub
          </a>
          <a href="#download" className="btn btn-primary btn-sweep">Download</a>
        </div>
      </div>
    </nav>
  );
}

Object.assign(window, { Nav });
