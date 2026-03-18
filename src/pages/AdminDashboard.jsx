import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, ShieldAlert, Lock, LogOut, ArrowUpDown } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import PropertyForm from '../components/PropertyForm';
import { getPropertyStatus } from '../utils/propertyStatus';
import { verifyAdminPassword } from '../utils/propertyApi';
import './AdminDashboard.css';

const STATUS_SORT_ORDER = {
  'ready-to-move-in': 0,
  'available-soon': 1,
  leased: 2,
};

const AdminDashboard = () => {
  const { properties, deleteProperty, storageMode, syncError, isSyncing } = useProperties();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [sortField, setSortField] = useState('address');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    // Check if previously authenticated in this session
    const authStatus = sessionStorage.getItem('admin_auth');
    const storedPassword = sessionStorage.getItem('admin_password');

    if (authStatus === 'true' && storedPassword) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);
    setLoginError(false);
    setLoginMessage('');

    try {
      const isValid = await verifyAdminPassword(passwordInput);

      if (!isValid) {
        throw new Error('Incorrect password.');
      }

      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.setItem('admin_password', passwordInput);
    } catch (error) {
      setLoginError(true);
      setLoginMessage(error.message || 'Incorrect password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_password');
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProperty(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortField(field);
    setSortDirection('asc');
  };

  const sortedProperties = [...properties].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'address') {
      comparison = a.address.localeCompare(b.address);
    }

    if (sortField === 'location') {
      comparison = a.location.localeCompare(b.location) || a.address.localeCompare(b.address);
    }

    if (sortField === 'price') {
      comparison = a.pricePerMonth - b.pricePerMonth || a.address.localeCompare(b.address);
    }

    if (sortField === 'status') {
      const aStatus = getPropertyStatus(a);
      const bStatus = getPropertyStatus(b);

      comparison =
        (STATUS_SORT_ORDER[aStatus.key] ?? 99) - (STATUS_SORT_ORDER[bStatus.key] ?? 99) ||
        aStatus.adminLabel.localeCompare(bStatus.adminLabel) ||
        a.address.localeCompare(b.address);
    }

    return sortDirection === 'asc' ? comparison : comparison * -1;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-page login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="login-header">
            <Lock size={32} className="login-icon" />
            <h2>Admin Access Restricted</h2>
            <p>Please enter the administrator password to manage properties.</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Enter password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              {loginError && <span className="login-error-text">{loginMessage || 'Incorrect password. Please try again.'}</span>}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Checking Access...' : 'Access Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="admin-page">
        <div className="container">
          <button className="btn-secondary back-btn" onClick={handleCloseForm}>
            <X size={20} /> Cancel
          </button>
          <PropertyForm 
            existingProperty={editingProperty} 
            onClose={handleCloseForm} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        
        <div className="admin-header">
          <div>
            <h1>Property Management</h1>
            <p className="admin-subtitle">Add, edit, or remove properties from your portfolio.</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={20} /> Add Property
            </button>
            <button className="btn-secondary logout-btn" onClick={handleLogout} title="Log Out">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="admin-warning">
          <ShieldAlert size={20} className="warning-icon" />
          <p>
            <strong>Storage:</strong>{' '}
            {storageMode === 'remote'
              ? 'Connected to Supabase. Property changes will sync across devices.'
              : isSyncing
                ? 'Checking live property storage...'
                : 'Fallback mode: using local browser storage on this device only.'}
            {syncError ? ` ${syncError}` : ''}
          </p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <button type="button" className="sort-button" onClick={() => handleSort('address')}>
                    Property <ArrowUpDown size={14} className={sortField === 'address' ? 'sort-icon active' : 'sort-icon'} />
                  </button>
                </th>
                <th>
                  <button type="button" className="sort-button" onClick={() => handleSort('location')}>
                    Location <ArrowUpDown size={14} className={sortField === 'location' ? 'sort-icon active' : 'sort-icon'} />
                  </button>
                </th>
                <th>
                  <button type="button" className="sort-button" onClick={() => handleSort('price')}>
                    Price <ArrowUpDown size={14} className={sortField === 'price' ? 'sort-icon active' : 'sort-icon'} />
                  </button>
                </th>
                <th>
                  <button type="button" className="sort-button" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown size={14} className={sortField === 'status' ? 'sort-icon active' : 'sort-icon'} />
                  </button>
                </th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProperties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">No properties found. Add one to get started!</td>
                </tr>
              ) : (
                sortedProperties.map(property => {
                  const status = getPropertyStatus(property);

                  return (
                  <tr key={property.id} className="clickable-row" onClick={() => handleEdit(property)}>
                    <td>
                      <div className="table-prop-info">
                        <img src={property.image} alt={property.address} className="table-img" />
                        <div>
                          <strong>{property.address}</strong>
                          <div className="text-small text-muted">
                            {property.bedrooms} Bed • {property.bathrooms} Bath • {property.squareFeet} sqft
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{property.location}</td>
                    <td>${property.pricePerMonth.toLocaleString()}/mo</td>
                    <td>
                      {status.adminBadges.map((badge) => (
                        <span key={badge.label} className={`status-badge status-${badge.badgeClass}`}>
                          {badge.label}
                        </span>
                      ))}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="icon-btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(property); }} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(property.id); }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
