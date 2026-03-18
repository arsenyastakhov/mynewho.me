import React, { useMemo, useState } from 'react';
import { ImagePlus, LoaderCircle, Star, Trash2 } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import { AMENITY_GROUPS, dedupeAmenities } from '../utils/amenities';
import { buildPropertyStatusFields, getPropertyStatus } from '../utils/propertyStatus';
import { getPropertyMediaFolder, isCloudinaryConfigured, uploadImageToCloudinary } from '../utils/cloudinary';
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
      planImage: '',
      amenities: [],
      gallery: []
    }
  );

  const [galleryInput, setGalleryInput] = useState(
    existingProperty ? existingProperty.gallery.join(', ') : ''
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGalleryDragActive, setIsGalleryDragActive] = useState(false);
  const [isPlanDragActive, setIsPlanDragActive] = useState(false);
  const [isAdvancedMediaOpen, setIsAdvancedMediaOpen] = useState(false);
  const [draggedGalleryImage, setDraggedGalleryImage] = useState('');

  const galleryItems = useMemo(
    () => Array.from(
      new Set(
        galleryInput
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      )
    ),
    [galleryInput]
  );

  const syncGallery = (items) => {
    setGalleryInput(items.join(', '));
  };

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

  const removeGalleryImage = (imageUrl) => {
    const nextGallery = galleryItems.filter((item) => item !== imageUrl);
    syncGallery(nextGallery);

    setFormData((prev) => ({
      ...prev,
      image: prev.image === imageUrl ? nextGallery[0] || '' : prev.image,
    }));
  };

  const setPrimaryImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const reorderGalleryImages = (draggedImage, targetImage) => {
    if (!draggedImage || !targetImage || draggedImage === targetImage) {
      return;
    }

    const nextGallery = [...galleryItems];
    const fromIndex = nextGallery.indexOf(draggedImage);
    const toIndex = nextGallery.indexOf(targetImage);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    nextGallery.splice(fromIndex, 1);
    nextGallery.splice(toIndex, 0, draggedImage);
    syncGallery(nextGallery);
  };

  const uploadGalleryFiles = async (files) => {
    setUploadError('');
    setIsUploadingImages(true);

    try {
      const uploadedUrls = [];
      const galleryFolder = getPropertyMediaFolder(formData, 'gallery');

      for (const file of files) {
        const uploadedUrl = await uploadImageToCloudinary(file, { folder: galleryFolder });
        uploadedUrls.push(uploadedUrl);
      }

      const nextGallery = [...galleryItems, ...uploadedUrls];
      syncGallery(nextGallery);

      setFormData((prev) => ({
        ...prev,
        image: prev.image || uploadedUrls[0] || nextGallery[0] || '',
      }));
    } catch (error) {
      setUploadError(error.message || 'Something went wrong while uploading.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    await uploadGalleryFiles(files);
    event.target.value = '';
  };

  const uploadPlanFile = async (file) => {
    setUploadError('');
    setIsUploadingImages(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file, {
        folder: getPropertyMediaFolder(formData, 'plans'),
      });

      setFormData((prev) => ({
        ...prev,
        planImage: uploadedUrl,
      }));
    } catch (error) {
      setUploadError(error.message || 'Something went wrong while uploading.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handlePlanUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    await uploadPlanFile(file);
    event.target.value = '';
  };

  const createDropHandlers = (setDragActive, onFilesDropped) => ({
    onDragEnter: (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isCloudinaryConfigured() || isUploadingImages) return;
      setDragActive(true);
    },
    onDragOver: (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isCloudinaryConfigured() || isUploadingImages) return;
      setDragActive(true);
    },
    onDragLeave: (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
    },
    onDrop: async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);

      if (!isCloudinaryConfigured() || isUploadingImages) return;

      const files = Array.from(event.dataTransfer?.files || []).filter((file) =>
        file.type.startsWith('image/')
      );

      if (!files.length) {
        return;
      }

      await onFilesDropped(files);
    },
  });

  const galleryDropHandlers = createDropHandlers(setIsGalleryDragActive, uploadGalleryFiles);
  const planDropHandlers = createDropHandlers(setIsPlanDragActive, async (files) => {
    if (files[0]) {
      await uploadPlanFile(files[0]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);

    // Process lists and numbers before saving
    const processedGallery = galleryItems;
    const primaryImage =
      formData.image ||
      processedGallery[0] ||
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

    const processedData = {
      ...formData,
      amenities: dedupeAmenities(formData.amenities),
      ...buildPropertyStatusFields(formData),
      pricePerMonth: Number(formData.pricePerMonth),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      squareFeet: Number(formData.squareFeet),
      garage: Number(formData.garage),
      image: primaryImage,
      gallery: processedGallery.length ? processedGallery : [primaryImage],
    };

    try {
      if (isEditing) {
        await updateProperty(existingProperty.id, processedData);
      } else {
        await addProperty(processedData);
      }

      onClose();
    } catch (error) {
      setSaveError(error.message || 'Unable to save this property right now.');
    } finally {
      setIsSaving(false);
    }
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
            <div className="media-upload-header">
              <label>Upload Photos</label>
              <span className="media-upload-note">
                {isCloudinaryConfigured()
                  ? 'Upload straight to Cloudinary and use the first photo or choose a cover.'
                  : 'Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable uploads.'}
              </span>
            </div>

            <label
              className={`upload-dropzone ${!isCloudinaryConfigured() ? 'is-disabled' : ''} ${isGalleryDragActive ? 'is-drag-active' : ''}`}
              {...galleryDropHandlers}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={!isCloudinaryConfigured() || isUploadingImages}
                onChange={handleImageUpload}
              />
              <span className="upload-dropzone-icon">
                {isUploadingImages ? <LoaderCircle size={20} className="spin" /> : <ImagePlus size={20} />}
              </span>
              <span className="upload-dropzone-text">
                {isUploadingImages ? 'Uploading images...' : 'Choose photos to upload'}
              </span>
              <span className="upload-dropzone-subtext">
                or drag and drop images here
              </span>
            </label>

            {uploadError && <p className="upload-error">{uploadError}</p>}

            {galleryItems.length > 0 && (
              <div className="gallery-manager">
                {galleryItems.map((imageUrl) => {
                  const isPrimary = formData.image === imageUrl;

                  return (
                    <div
                      key={imageUrl}
                      className={`gallery-manager-item ${draggedGalleryImage === imageUrl ? 'is-dragging' : ''}`}
                      draggable
                      onDragStart={() => setDraggedGalleryImage(imageUrl)}
                      onDragEnd={() => setDraggedGalleryImage('')}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        reorderGalleryImages(draggedGalleryImage, imageUrl);
                        setDraggedGalleryImage('');
                      }}
                    >
                      <img src={imageUrl} alt="Property upload" className="gallery-manager-image" />
                      <div className="gallery-manager-actions">
                        <button
                          type="button"
                          className={`gallery-action-btn ${isPrimary ? 'is-active' : ''}`}
                          onClick={() => setPrimaryImage(imageUrl)}
                        >
                          <Star size={16} />
                          {isPrimary ? 'Cover photo' : 'Set as cover'}
                        </button>
                        <button
                          type="button"
                          className="gallery-action-btn danger"
                          onClick={() => removeGalleryImage(imageUrl)}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <div className="media-upload-header">
              <label>Floor Plan Image</label>
              <span className="media-upload-note">
                Upload a separate floor-plan image that appears below the pricing card on the property page.
              </span>
            </div>

            <label
              className={`upload-dropzone ${!isCloudinaryConfigured() ? 'is-disabled' : ''} ${isPlanDragActive ? 'is-drag-active' : ''}`}
              {...planDropHandlers}
            >
              <input
                type="file"
                accept="image/*"
                disabled={!isCloudinaryConfigured() || isUploadingImages}
                onChange={handlePlanUpload}
              />
              <span className="upload-dropzone-icon">
                {isUploadingImages ? <LoaderCircle size={20} className="spin" /> : <ImagePlus size={20} />}
              </span>
              <span className="upload-dropzone-text">
                {formData.planImage ? 'Replace floor plan image' : 'Upload floor plan image'}
              </span>
              <span className="upload-dropzone-subtext">
                or drag and drop a plan image here
              </span>
            </label>

            <input
              type="url"
              name="planImage"
              value={formData.planImage || ''}
              onChange={handleChange}
              placeholder="https://..."
            />

            {formData.planImage && (
              <div className="plan-image-preview">
                <img src={formData.planImage} alt="Floor plan preview" className="gallery-manager-image" />
                <div className="gallery-manager-actions">
                  <button
                    type="button"
                    className="gallery-action-btn danger"
                    onClick={() => setFormData((prev) => ({ ...prev, planImage: '' }))}
                  >
                    <Trash2 size={16} />
                    Remove plan image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setIsAdvancedMediaOpen((prev) => !prev)}
            >
              {isAdvancedMediaOpen ? 'Hide advanced media options' : 'Show advanced media options'}
            </button>
          </div>

          {isAdvancedMediaOpen && (
            <>
              <div className="form-group full-width">
                <label>Primary Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
              </div>

              <div className="form-group full-width">
                <label>Gallery Image URLs (Comma separated)</label>
                <textarea value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} rows="3" placeholder="url1, url2, url3..."></textarea>
              </div>
            </>
          )}

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
          {saveError && <p className="save-error">{saveError}</p>}
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Property'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default PropertyForm;
