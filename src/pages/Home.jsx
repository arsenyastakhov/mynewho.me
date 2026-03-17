import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ListingsSection from '../components/ListingsSection';
import SelfTourSection from '../components/SelfTourSection';
import TrustSection from '../components/TrustSection';

const Home = () => {
  const [searchFilters, setSearchFilters] = useState({ beds: null, city: null });

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection onSearch={handleSearch} />
      <ListingsSection searchFilters={searchFilters} />
      <SelfTourSection />
      <TrustSection />
    </motion.div>
  );
};

export default Home;
