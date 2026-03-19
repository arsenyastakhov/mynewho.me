import { Mail, MapPin, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const getSectionHref = (sectionId) => (
    location.pathname === '/' ? `#${sectionId}` : `/#${sectionId}`
  );

  return (
    <footer className="footer section-padding">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <img src="/assets/logo.png" alt="MyNewHome Logo" className="footer-logo-image" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <h3 className="footer-logo fallback-text" style={{ display: 'none' }}>MyNewHome</h3>
            <p className="footer-text">
              Modern rental homes from owner in Punta Gorda and Port Charlotte. Redefining the leasing experience.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Explore</h4>
            <ul>
              <li><a href={getSectionHref('listings')}>Available Homes</a></li>
              <li><a href={getSectionHref('how-it-works')}>Instant Tour</a></li>
              <li><a href={getSectionHref('benefits')}>Benefits</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li className="contact-item">
                <Phone size={18} />
                <span>(941) 273-4666</span>
              </li>
              <li className="contact-item">
                <Mail size={18} />
                <a href="mailto:info@mynewho.me">info@mynewho.me</a>
              </li>
              <li className="contact-item">
                <MapPin size={18} />
                <span>Punta Gorda, FL 33950</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} MyNewHome. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
