import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Car, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPropertyStatus } from '../utils/propertyStatus';
import './PropertyCard.css';

const PropertyCard = ({ property, index }) => {
  const status = getPropertyStatus(property);

  return (
    <motion.div 
      className="property-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/property/${property.id}`} className="card-image-link">
        <div className="card-image-wrapper">
          <img src={property.image} alt={property.address} className="card-image" loading="lazy" />
          <div className="card-badges">
            {property.newConstruction && (
              <div className="badge new-badge">
                <Sparkles size={14} /> New Construction
              </div>
            )}
            <div className={`badge availability-badge ${status.badgeClass}`}>
              {status.cardLabel}
            </div>
          </div>
          <div className="price-tag">
            ${property.pricePerMonth.toLocaleString()}<span className="price-period">/mo</span>
          </div>
        </div>
      </Link>

      <div className="card-content">
        <div className="card-header">
          <span className="location-tag">
            <MapPin size={14} /> {property.location}
          </span>
        </div>
        
        <Link to={`/property/${property.id}`} className="card-title-link">
          <h3 className="card-title">{property.address}</h3>
        </Link>
        
        <p className="card-desc">{property.shortDescription}</p>

        <div className="card-features">
          <div className="feature">
            <BedDouble size={18} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="feature">
            <Bath size={18} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="feature">
            <Square size={18} />
            <span>{property.squareFeet.toLocaleString()} sqft</span>
          </div>
          <div className="feature hide-mobile">
            <Car size={18} />
            <span>{property.garage} Car</span>
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/property/${property.id}`} className="btn-secondary card-btn">Details</Link>
          <button 
            className="btn-primary card-btn"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer');
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
