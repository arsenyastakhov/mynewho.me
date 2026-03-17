import React, { createContext, useContext, useState, useEffect } from 'react';
import { properties as initialProperties } from '../data/properties';

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  // Try to load properties from localStorage, fallback to initial mock data.
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('myNewHome_properties_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse properties from localStorage', e);
        return initialProperties;
      }
    }
    return initialProperties;
  });

  // Save properties to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('myNewHome_properties_v4', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (newProp) => {
    setProperties(prev => [...prev, { ...newProp, id: `prop-${Date.now()}` }]);
  };

  const updateProperty = (id, updatedProp) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updatedProp } : p));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};
