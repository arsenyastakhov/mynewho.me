import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Car, CheckCircle2, ChevronLeft, ChevronRight, Calendar, TriangleAlert, X } from 'lucide-react';
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const galleryImages = property?.gallery?.length ? property.gallery : property?.image ? [property.image] : [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!isTourModalOpen && !isGalleryModalOpen && !isPlanModalOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsTourModalOpen(false);
        setIsGalleryModalOpen(false);
        setIsPlanModalOpen(false);
      }

      if (galleryImages.length > 1 && isGalleryModalOpen && event.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      }

      if (galleryImages.length > 1 && isGalleryModalOpen && event.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [galleryImages.length, isGalleryModalOpen, isPlanModalOpen, isTourModalOpen]);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsGalleryModalOpen(false);
    setIsPlanModalOpen(false);
  }, [id]);

  const goToPreviousImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const openGalleryModal = (index) => {
    setActiveImageIndex(index);
    setIsGalleryModalOpen(true);
  };

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
          <motion.div
            className="property-gallery-shell"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gallery-stage">
              <button
                type="button"
                className="gallery-stage-button"
                onClick={() => openGalleryModal(activeImageIndex)}
              >
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`${property.address} view ${activeImageIndex + 1}`}
                  className="gallery-stage-image"
                />
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button type="button" className="gallery-nav prev" onClick={goToPreviousImage} aria-label="Previous property image">
                    <ChevronLeft size={22} />
                  </button>
                  <button type="button" className="gallery-nav next" onClick={goToNextImage} aria-label="Next property image">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <div className="gallery-counter">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="gallery-thumbnails" role="tablist" aria-label="Property photo thumbnails">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`gallery-thumb ${idx === activeImageIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    aria-pressed={idx === activeImageIndex}
                  >
                    <img src={img} alt={`${property.address} thumbnail ${idx + 1}`} className="gallery-thumb-image" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
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
                {property.planImage && (
                  <button type="button" className="stat-item stat-item-button floor-plan-stat" onClick={() => setIsPlanModalOpen(true)}>
                    <span>Floor Plan</span>
                  </button>
                )}
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

      {isGalleryModalOpen && (
        <div className="gallery-modal-overlay" onClick={() => setIsGalleryModalOpen(false)}>
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="gallery-modal-close" onClick={() => setIsGalleryModalOpen(false)} aria-label="Close image gallery">
              <X size={20} />
            </button>

            <div className="gallery-modal-stage">
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${property.address} large view ${activeImageIndex + 1}`}
                className="gallery-modal-image"
              />

              {galleryImages.length > 1 && (
                <>
                  <button type="button" className="gallery-nav prev modal-nav" onClick={goToPreviousImage} aria-label="Previous property image">
                    <ChevronLeft size={24} />
                  </button>
                  <button type="button" className="gallery-nav next modal-nav" onClick={goToNextImage} aria-label="Next property image">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="gallery-modal-thumbnails">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`modal-${img}-${idx}`}
                    type="button"
                    className={`gallery-thumb ${idx === activeImageIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={img} alt={`${property.address} modal thumbnail ${idx + 1}`} className="gallery-thumb-image" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {isPlanModalOpen && property.planImage && (
        <div className="gallery-modal-overlay" onClick={() => setIsPlanModalOpen(false)}>
          <motion.div
            className="gallery-modal plan-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="gallery-modal-close" onClick={() => setIsPlanModalOpen(false)} aria-label="Close floor plan">
              <X size={20} />
            </button>

            <div className="plan-modal-header">
              <span className="tour-modal-kicker">Floor Plan</span>
              <h2>See the layout</h2>
            </div>

            <div className="gallery-modal-stage plan-modal-stage">
              <img
                src={property.planImage}
                alt={`${property.address} floor plan`}
                className="gallery-modal-image plan-modal-image"
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyDetails;
