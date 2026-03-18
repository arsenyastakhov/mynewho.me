import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const getSectionHref = (sectionId) => (
    location.pathname === '/' ? `#${sectionId}` : `/#${sectionId}`
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <img src="/assets/logo-wordmark-2026.png" alt="mynewho.me" className="logo-image" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
            <span className="logo-text fallback-text" style={{ display: 'none' }}>mynewho.me</span>
          </Link>
          <nav className="nav-menu">
            <a href={getSectionHref('listings')} className="nav-link">Available Homes</a>
            <a href={getSectionHref('how-it-works')} className="nav-link">Instant Tour</a>
            <a href={getSectionHref('benefits')} className="nav-link">Benefits</a>
          </nav>
          <div className="header-actions">
            <button className="btn-primary header-apply-btn" onClick={() => window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer')}>Apply Now</button>
            <button
              className="menu-btn"
              type="button"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(event) => event.stopPropagation()}>
            <a href={getSectionHref('listings')} className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Available Homes</a>
            <a href={getSectionHref('how-it-works')} className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Instant Tour</a>
            <a href={getSectionHref('benefits')} className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
