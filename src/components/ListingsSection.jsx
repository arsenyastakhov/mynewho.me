import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from './PropertyCard';
import { getPropertyStatus } from '../utils/propertyStatus';
import './ListingsSection.css';

const ListingsSection = ({ searchFilters }) => {
  const { properties } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [activeBeds, setActiveBeds] = useState([]);
  const [activeCity, setActiveCity] = useState([]);
  const [showLeased, setShowLeased] = useState(false);
  const sectionRef = useRef(null);

  // Sync state when hero search is clicked
  useEffect(() => {
    if ((searchFilters?.beds && searchFilters.beds.length > 0) || (searchFilters?.city && searchFilters.city.length > 0)) {
      if (searchFilters.beds) setActiveBeds(searchFilters.beds.map(String));
      if (searchFilters.city) setActiveCity(searchFilters.city);
      
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchFilters]);

  // Apply filters whenever local state changes
  useEffect(() => {
    let result = properties;

    if (!showLeased) {
      result = result.filter((property) => getPropertyStatus(property).showInListings);
    }

    if (activeBeds.length > 0) {
      result = result.filter(p => activeBeds.includes(p.bedrooms.toString()));
    }

    if (activeCity.length > 0) {
      result = result.filter(p => activeCity.includes(p.location));
    }

    const sortedResult = [...result].sort((a, b) => (
      a.pricePerMonth - b.pricePerMonth || a.address.localeCompare(b.address)
    ));

    setFilteredProperties(sortedResult);
  }, [activeBeds, activeCity, properties, showLeased]);

  const toggleBedFilter = (bed) => {
    setActiveBeds(prev => prev.includes(bed) ? prev.filter(b => b !== bed) : [...prev, bed]);
  };
  
  const toggleCityFilter = (city) => {
    setActiveCity(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };

  const bedOptions = ['3', '4'];
  const cityOptions = ['Punta Gorda', 'Port Charlotte'];

  return (
    <section className="section bg-secondary" id="listings" ref={sectionRef}>
      <div className="container">
        
        <div className="listings-header">
          <motion.div 
            className="listings-title-group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Available Homes</h2>
            <p>Discover our curated selection of premium rental properties.</p>
          </motion.div>

          <motion.div 
            className="listings-filters"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="filter-scroll-container">
              <span className="filter-label">City:</span>
              <div className="filter-pill-group">
                {cityOptions.map(option => (
                  <button
                    key={option}
                    className={`filter-pill ${activeCity.includes(option) ? 'active' : ''}`}
                    onClick={() => toggleCityFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <div style={{ width: '1px', height: '20px', background: 'var(--border-light)', margin: '0 0.5rem' }}></div>

              <span className="filter-label">Beds:</span>
              <div className="filter-pill-group">
                {bedOptions.map(option => (
                  <button
                    key={'bed-' + option}
                    className={`filter-pill ${activeBeds.includes(option) ? 'active' : ''}`}
                    onClick={() => toggleBedFilter(option)}
                  >
                    {option} Beds
                  </button>
                ))}
              </div>

              <div style={{ width: '1px', height: '20px', background: 'var(--border-light)', margin: '0 0.5rem' }}></div>

              <button
                className={`filter-pill ${showLeased ? 'active' : ''}`}
                onClick={() => setShowLeased(!showLeased)}
              >
                Show Leased
              </button>
            </div>
            {/* The user specifically asked to remove the unused Filters button */}
          </motion.div>
        </div>

        <motion.div layout className="listings-grid">
          <AnimatePresence mode="popLayout">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            ) : (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="no-results-content">
                  <Search size={48} className="no-results-icon" />
                  <h3>No homes found</h3>
                  <p>We couldn't find any properties matching your exact criteria.</p>
                  <button onClick={() => { setActiveBeds([]); setActiveCity([]); }} className="btn-primary" style={{ marginTop: '1rem' }}>
                    View All Homes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default ListingsSection;
