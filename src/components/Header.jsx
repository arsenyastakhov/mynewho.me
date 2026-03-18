import { Link, useLocation } from 'react-router-dom';
import { Home, Menu } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const getSectionHref = (sectionId) => (
    location.pathname === '/' ? `#${sectionId}` : `/#${sectionId}`
  );

  return (
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
          <button className="btn-primary" onClick={() => window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer')}>Apply Now</button>
          <button className="menu-btn">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
