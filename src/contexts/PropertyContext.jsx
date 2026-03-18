import React, { createContext, useContext, useState, useEffect } from 'react';
import { properties as initialProperties } from '../data/properties';
import {
  createPropertyViaApi,
  deletePropertyViaApi,
  fetchPropertiesFromApi,
  updatePropertyViaApi,
} from '../utils/propertyApi';

const PropertyContext = createContext();
const LOCAL_STORAGE_KEY = 'myNewHome_properties_v4';

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const readLocalProperties = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse properties from localStorage', e);
      }
    }

    return initialProperties;
  };

  const [properties, setProperties] = useState(readLocalProperties);
  const [storageMode, setStorageMode] = useState('loading');
  const [syncError, setSyncError] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProperties = async () => {
      setIsSyncing(true);

      try {
        const remoteProperties = await fetchPropertiesFromApi();

        if (!isMounted) {
          return;
        }

        setProperties(remoteProperties);
        setStorageMode('remote');
        setSyncError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProperties(readLocalProperties());
        setStorageMode('local');
        setSyncError(error.message || 'Falling back to local browser storage.');
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save properties to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  const addProperty = async (newProp) => {
    if (storageMode === 'remote') {
      const createdProperty = await createPropertyViaApi(newProp);
      setProperties((prev) => [...prev, createdProperty]);
      return createdProperty;
    }

    const createdProperty = { ...newProp, id: `prop-${Date.now()}` };
    setProperties((prev) => [...prev, createdProperty]);
    return createdProperty;
  };

  const updateProperty = async (id, updatedProp) => {
    if (storageMode === 'remote') {
      const savedProperty = await updatePropertyViaApi(id, updatedProp);
      setProperties((prev) => prev.map((property) => (
        property.id === id ? savedProperty : property
      )));
      return savedProperty;
    }

    setProperties((prev) => prev.map((property) => (
      property.id === id ? { ...property, ...updatedProp } : property
    )));
    return { ...updatedProp, id };
  };

  const deleteProperty = async (id) => {
    if (storageMode === 'remote') {
      await deletePropertyViaApi(id);
    }

    setProperties((prev) => prev.filter((property) => property.id !== id));
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        storageMode,
        syncError,
        isSyncing,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
