import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Car, CheckCircle2, ChevronLeft, Phone, Calendar, TriangleAlert, X } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import { groupAmenities } from '../utils/amenities';
import { getPropertyStatus } from '../utils/propertyStatus';
import './PropertyDetails.css';

const getStreetOnlyAddress = (address = '') => address.split(',')[0]?.trim() || address;

const PropertyDetails = () => {
  const { id } = useParams();
  const { properties } = useProperties();
  const property = properties.find(p => p.id === id);
  const status = getPropertyStatus(property);
  const groupedAmenities = groupAmenities(property?.amenities);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!isTourModalOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsTourModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isTourModalOpen]);

  if (!property) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Property not found.</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Listings</Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="property-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container" style={{ paddingBottom: '2rem' }}>
        <Link to="/" className="back-link">
          <ChevronLeft size={20} /> Back to all homes
        </Link>
      </div>

      {/* Image Gallery */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            <motion.div 
              className="gallery-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={property.gallery[0]} alt="Main view" className="gallery-img" />
            </motion.div>
            <div className="gallery-side">
              {property.gallery.slice(1, 3).map((img, idx) => (
                <motion.div 
                  key={idx} 
                  className="gallery-side-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                >
                  <img src={img} alt={`View ${idx + 2}`} className="gallery-img" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Info Container */}
      <section className="section info-section">
        <div className="container property-layout">
          
          <div className="property-main-content">
            <motion.div 
              className="property-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="property-labels">
                {property.newConstruction && <span className="label new-label">New Construction</span>}
                {status.detailBadges.map((badge) => (
                  <span key={badge.label} className={`label ${badge.badgeClass}-label`}>
                    {badge.label}
                  </span>
                ))}
                <span className="label location-label"><MapPin size={14} /> {property.location}</span>
              </div>
              <h1 className="property-address">{getStreetOnlyAddress(property.address)}</h1>
              
              <div className="property-quick-stats">
                <div className="stat-item"><BedDouble size={24} /> <span>{property.bedrooms} Beds</span></div>
                <div className="stat-item"><Bath size={24} /> <span>{property.bathrooms} Baths</span></div>
                <div className="stat-item"><Square size={24} /> <span>{property.squareFeet.toLocaleString()} sqft</span></div>
                <div className="stat-item"><Car size={24} /> <span>{property.garage} Car Garage</span></div>
              </div>
            </motion.div>

            <motion.div 
              className="property-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2>About this home</h2>
              <p>{property.description}</p>
            </motion.div>

            <motion.div 
              className="property-amenities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2>Amenities & Highlights</h2>
              <div className="amenity-groups-display">
                {groupedAmenities.map((group) => (
                  <div key={group.title} className="amenity-group-display">
                    <h3>{group.title}</h3>
                    <ul className="amenities-list">
                      {group.options.map((amenity) => (
                        <li key={amenity} className="amenity-item">
                          <CheckCircle2 className="amenity-icon" size={20} />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <motion.div 
            className="property-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="action-card">
              <div className="price-display">
                <span className="price-val">${property.pricePerMonth.toLocaleString()}</span>
                <span className="price-mo">/ month</span>
              </div>
              
              <div className="action-buttons">
                {status.isReady ? (
                  <>
                    <button className="btn-primary w-full btn-large" onClick={() => window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer')}>
                      Apply Now
                    </button>
                    <button className="btn-secondary w-full btn-large" onClick={() => setIsTourModalOpen(true)}>
                      <Calendar size={20} /> Schedule Self-Tour
                    </button>
                  </>
                ) : status.isAvailableSoon ? (
                  <>
                    <button className="btn-primary w-full btn-large" onClick={() => window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer')}>
                      Apply Now
                    </button>
                    <button
                      type="button"
                      className="btn-secondary w-full btn-large"
                      onClick={() => {
                        if (status.canScheduleTour) {
                          setIsTourModalOpen(true);
                        }
                      }}
                      disabled={!status.canScheduleTour}
                      style={status.canScheduleTour ? undefined : { opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      <Calendar size={20} /> {status.tourLabel}
                    </button>
                  </>
                ) : (
                  <button className="btn-secondary w-full btn-large" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    Currently Unavailable
                  </button>
                )}
                <button className="ghost-btn w-full">
                  <Phone size={20} /> Request a Call
                </button>
              </div>

              <div className="trust-badge">
                <CheckCircle2 size={16} color="var(--accent)" />
                <span>Fast 24-hour approval process</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {isTourModalOpen && (
        <div className="tour-modal-overlay" onClick={() => setIsTourModalOpen(false)}>
          <motion.div
            className="tour-modal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="tour-modal-close" onClick={() => setIsTourModalOpen(false)} aria-label="Close self-tour instructions">
              <X size={20} />
            </button>

            <div className="tour-modal-content">
              <span className="tour-modal-kicker">Self-Tour Instructions</span>
              <h2>Schedule your self-tour now</h2>
              <p>
                For <strong>{property.address}</strong>
                <br />
                text <strong>RENT</strong> to <strong>(941) 273-4666</strong>
              </p>

              <div className="tour-modal-note">
                <TriangleAlert size={18} />
                <span>If prompted, choose Allow so your browser can open Messages. Standard message and data rates may apply.</span>
              </div>

              <div className="tour-modal-actions">
                <a className="btn-primary w-full btn-large" href="sms:9412734666?body=RENT">
                  Text RENT Now
                </a>
                <button className="btn-secondary w-full btn-large" onClick={() => setIsTourModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyDetails;
