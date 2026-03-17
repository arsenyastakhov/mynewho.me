import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, MapPin, Search } from 'lucide-react';
import './HeroSection.css';

const BEDROOM_OPTIONS = [
  { label: '3 bedrooms', value: 3 },
  { label: '4 bedrooms', value: 4 },
];

const CITY_OPTIONS = [
  { label: 'Punta Gorda', value: 'Punta Gorda' },
  { label: 'Port Charlotte', value: 'Port Charlotte' },
];

const HeroSection = ({ onSearch }) => {
  const [beds, setBeds] = useState([]);
  const [city, setCity] = useState([]);

  const handleSearch = () => {
    onSearch({ beds, city });
  };

  const toggleBed = (val) => {
    setBeds(prev => prev.includes(val) ? prev.filter(b => b !== val) : [...prev, val]);
  };

  const toggleCity = (val) => {
    setCity(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  return (
    <section className="hero-section">
      <div className="hero-background"></div>

      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title">Ready to move in?</h1>
          <p className="hero-subtitle">We proudly offer a selection of quality homes for long-term rent in the scenic locations of Punta Gorda and Port Charlotte, FL. Discover a place to call home in one of these vibrant communities.</p>
        </motion.div>

        <motion.div 
          className="hero-interaction"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="selector-card">
            
            <div className="selector-group">
              <div className="options-grid">
                {BEDROOM_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`option-btn ${beds.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => toggleBed(option.value)}
                  >
                    <BedDouble className="option-icon" size={24} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="selector-group">
              <div className="options-grid">
                {CITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`option-btn ${city.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => toggleCity(option.value)}
                  >
                    <MapPin className="option-icon" size={24} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn-primary search-btn"
              onClick={handleSearch}
              disabled={beds.length === 0 && city.length === 0}
            >
              <Search size={20} />
              Find Homes
            </button>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
