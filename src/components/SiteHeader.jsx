import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Brand({ to = '/' }) {
  return (
    <Link to={to} className="brand" aria-label="Count-inst — accueil">
      <img src="/insta-logo.png" alt="" className="brand__logo" />
      <span>Count-inst</span>
    </Link>
  );
}

const NAV = [
  { href: '/#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/#designs', label: 'Designs' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#tarifs', label: 'Tarifs' },
  { href: '/#faq', label: 'FAQ' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLogged = !!localStorage.getItem('token');
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Sur la page d'accueil, on garde des ancres simples (#id) pour un scroll fluide
  const href = (h) => (onHome ? h.replace('/#', '#') : h);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container site-header__inner">
          <Brand />

          <nav className="site-nav" aria-label="Navigation principale">
            {NAV.map((n) => (
              <a key={n.href} href={href(n.href)}>{n.label}</a>
            ))}
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="site-header__actions">
            {isLogged ? (
              <Link to="/dashboard" className="btn btn--primary btn--sm hide-mobile">Mon compteur →</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm hide-mobile">Connexion</Link>
                <Link to="/register" className="btn btn--primary btn--sm hide-mobile">Essai gratuit</Link>
              </>
            )}
            <button
              type="button"
              className="icon-btn site-header__burger"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          {NAV.map((n) => (
            <a key={n.href} href={href(n.href)} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <Link to="/contact">Contact</Link>
          {isLogged ? (
            <Link to="/dashboard" className="btn btn--primary btn--block">Mon compteur →</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn--primary btn--block">Essai gratuit</Link>
              <Link to="/login" className="btn btn--block">Connexion</Link>
            </>
          )}
        </nav>
      )}
    </>
  );
}
