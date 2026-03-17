import React, { useState } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import { AMENITY_GROUPS, dedupeAmenities } from '../utils/amenities';
import { buildPropertyStatusFields, getPropertyStatus } from '../utils/propertyStatus';
import './PropertyForm.css';

const PropertyForm = ({ existingProperty, onClose }) => {
  const { addProperty, updateProperty } = useProperties();
  const isEditing = !!existingProperty;
  const existingStatus = getPropertyStatus(existingProperty);

  // Initialize form state
  const [formData, setFormData] = useState(
    existingProperty ? {
      ...existingProperty,
      amenities: dedupeAmenities(existingProperty.amenities),
      available: existingStatus.isReady,
      leased: existingStatus.isLeased,
    } : {
      address: '',
      pricePerMonth: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      garage: '',
      location: 'Punta Gorda',
      newConstruction: false,
      available: true,
      leased: false,
      availableDate: '',
      shortDescription: '',
      description: '',
      image: '',
      amenities: [],
      gallery: []
    }
  );

  const [galleryInput, setGalleryInput] = useState(
    existingProperty ? existingProperty.gallery.join(', ') : ''
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'available' && checked ? { availableDate: '', leased: false } : {}),
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : dedupeAmenities([...prev.amenities, amenity]),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process lists and numbers before saving
    const processedData = {
      ...formData,
      amenities: dedupeAmenities(formData.amenities),
      ...buildPropertyStatusFields(formData),
      pricePerMonth: Number(formData.pricePerMonth),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      squareFeet: Number(formData.squareFeet),
      garage: Number(formData.garage),
      gallery: galleryInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (isEditing) {
      updateProperty(existingProperty.id, processedData);
    } else {
      addProperty(processedData);
    }
    
    // Default fallback image if none provided
    if (!processedData.image) {
       processedData.image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
       processedData.gallery = [processedData.image];
    }

    onClose();
  };

  return (
    <div className="property-form-card">
      <h2>{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
      <p className="form-subtitle">Fill out the details below to {isEditing ? 'update this' : 'create a new'} listing in your portfolio.</p>

      <form onSubmit={handleSubmit} className="admin-form">
        
        <div className="form-section">
          <h3>Core Details</h3>
          
          <div className="form-group full-width">
            <label>Street Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="e.g. 123 Main St, Punta Gorda, FL" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location (City)</label>
              <select name="location" value={formData.location} onChange={handleChange}>
                <option value="Punta Gorda">Punta Gorda</option>
                <option value="Port Charlotte">Port Charlotte</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price per Month ($)</label>
              <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} required min="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Specs & Features</h3>
          
          <div className="form-row quarter">
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" step="0.5" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Square Feet</label>
              <input type="number" name="squareFeet" value={formData.squareFeet} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Garage Spots</label>
              <input type="number" name="garage" value={formData.garage} onChange={handleChange} required min="0" />
            </div>
          </div>
          
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="newConstruction" checked={formData.newConstruction} onChange={handleChange} />
              <span>New Construction</span>
            </label>
            
            <label className="checkbox-label">
              <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
              <span>Available for Rent Now</span>
            </label>
            
            {!formData.available && (
              <div className="status-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="leased"
                    checked={formData.leased}
                    onChange={handleChange}
                  />
                  <span>Currently leased</span>
                </label>

                <div className="form-group status-date-group">
                  <label>Available Soon Date</label>
                  <input type="date" name="availableDate" value={formData.availableDate || ''} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Descriptions & Media</h3>
          
          <div className="form-group full-width">
            <label>Short Description (Card format)</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required maxLength="150" />
          </div>

          <div className="form-group full-width">
            <label>Full Description (Details page)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
          </div>

          <div className="form-group full-width">
            <label>Primary Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="form-group full-width">
            <label>Gallery Image URLs (Comma separated)</label>
            <textarea value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} rows="3" placeholder="url1, url2, url3..."></textarea>
          </div>

          <div className="form-group full-width">
            <label>Amenities</label>
            <div className="amenity-groups">
              {AMENITY_GROUPS.map((group) => (
                <div key={group.title} className="amenity-group">
                  <h4>{group.title}</h4>
                  <div className="amenities-grid">
                    {group.options.map((amenity) => (
                      <label key={amenity} className="amenity-option">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Property</button>
        </div>

      </form>
    </div>
  );
};

export default PropertyForm;
