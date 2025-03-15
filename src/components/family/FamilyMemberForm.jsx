// File: src/components/family/FamilyMemberForm.jsx
// Glassmorphic form component for adding or editing family members

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFamily } from '../../contexts/FamilyContext';

const FamilyMemberForm = ({ 
  mode = 'add',
  initialData = null, 
  parentId = null, 
  onSubmit, 
  onCancel 
}) => {
  const { loading } = useFamily();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    deathDate: '',
    isAlive: true,
    location: '',
    occupation: '',
    bio: '',
    photo: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      }
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with member data if editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const { name, attributes = {} } = initialData;
      
      // Split name into first and last name if available
      let firstName = '';
      let lastName = '';
      if (name) {
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      setFormData({
        firstName: attributes.firstName || firstName,
        lastName: attributes.lastName || lastName,
        gender: attributes.gender || '',
        birthDate: attributes.dateOfBirth || '',
        deathDate: attributes.dateOfDeath || '',
        isAlive: attributes.isAlive !== undefined ? attributes.isAlive : true,
        location: attributes.location || '',
        occupation: attributes.occupation || '',
        bio: attributes.bio || '',
        photo: attributes.photoURL || '',
        contactInfo: {
          email: attributes.contactInfo?.email || '',
          phone: attributes.contactInfo?.phone || '',
          address: attributes.contactInfo?.address || '',
          socialMedia: {
            facebook: attributes.contactInfo?.socialMedia?.facebook || '',
            twitter: attributes.contactInfo?.socialMedia?.twitter || '',
            instagram: attributes.contactInfo?.socialMedia?.instagram || '',
            linkedin: attributes.contactInfo?.socialMedia?.linkedin || ''
          }
        }
      });
    }
  }, [mode, initialData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., contactInfo.email)
      const parts = name.split('.');
      
      if (parts.length === 2) {
        // Handle two-level nesting (e.g., contactInfo.email)
        const [parent, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else if (parts.length === 3) {
        // Handle three-level nesting (e.g., contactInfo.socialMedia.facebook)
        const [parent, middle, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [middle]: {
              ...prev[parent][middle],
              [child]: value
            }
          }
        }));
      }
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Date validation
    if (formData.birthDate && formData.deathDate) {
      const birthDate = new Date(formData.birthDate);
      const deathDate = new Date(formData.deathDate);
      
      if (birthDate > deathDate) {
        newErrors.deathDate = 'Death date cannot be before birth date';
      }
    }
    
    // Email validation
    if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.contactInfo.phone && !/^\+?[0-9]{10,15}$/.test(formData.contactInfo.phone.replace(/\D/g, ''))) {
      newErrors['contactInfo.phone'] = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const memberData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate || null,
        isAlive: formData.isAlive,
        location: formData.location,
        occupation: formData.occupation,
        bio: formData.bio,
        photo: formData.photo,
        contactInfo: formData.contactInfo
      };
      
      // Add parentId if provided
      if (parentId) {
        memberData.parentId = parentId;
      }
      
      console.log('Submitting member data:', memberData);
      
      // Call the onSubmit callback with the form data
      await onSubmit(memberData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'An error occurred while saving the member'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glassmorphism p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === 'edit' ? 'Edit Family Member' : 'Add Family Member'}
      </h2>
      
      {errors.form && (
        <div className="alert-error mb-4">
          <p>{errors.form}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b border-neutral-200 pb-2 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder="First name"
                required
              />
              {errors.firstName && <p className="form-error">{errors.firstName}</p>}
            </div>
            
            <div className="form-control">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Last name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-control">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="birthDate" className="form-label">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-control">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="isAlive"
                  name="isAlive"
                  checked={formData.isAlive}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="isAlive" className="form-label ml-2 mb-0">
                  Is Alive
                </label>
              </div>
              
              {!formData.isAlive && (
                <div className="mt-2">
                  <label htmlFor="deathDate" className="form-label">Death Date</label>
                  <input
                    type="date"
                    id="deathDate"
                    name="deathDate"
                    value={formData.deathDate}
                    onChange={handleChange}
                    className={`form-input ${errors.deathDate ? 'border-error focus:border-error focus:ring-error' : ''}`}
                  />
                  {errors.deathDate && <p className="form-error">{errors.deathDate}</p>}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-control">
            <label htmlFor="occupation" className="form-label">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-input"
              placeholder="Occupation or profession"
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="bio" className="form-label">Biography</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-input min-h-[100px]"
              placeholder="Brief biography or notable information"
            ></textarea>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b border-neutral-200 pb-2 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="contactInfo.email" className="form-label">Email</label>
              <input
                type="email"
                id="contactInfo.email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                className={`form-input ${errors['contactInfo.email'] ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder="Email address"
              />
              {errors['contactInfo.email'] && <p className="form-error">{errors['contactInfo.email']}</p>}
            </div>
            
            <div className="form-control">
              <label htmlFor="contactInfo.phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="contactInfo.phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className={`form-input ${errors['contactInfo.phone'] ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder="Phone number"
              />
              {errors['contactInfo.phone'] && <p className="form-error">{errors['contactInfo.phone']}</p>}
            </div>
          </div>
          
          <div className="form-control">
            <label htmlFor="contactInfo.address" className="form-label">Address</label>
            <textarea
              id="contactInfo.address"
              name="contactInfo.address"
              value={formData.contactInfo.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Full address"
              rows="2"
            ></textarea>
          </div>
        </div>
        
        {/* Media & Social */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b border-neutral-200 pb-2 mb-4">Media & Social</h3>
          
          <div className="form-control">
            <label htmlFor="photo" className="form-label">Profile Image URL</label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="form-hint">Enter a URL for the profile image</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="contactInfo.socialMedia.facebook" className="form-label">Facebook</label>
              <input
                type="url"
                id="contactInfo.socialMedia.facebook"
                name="contactInfo.socialMedia.facebook"
                value={formData.contactInfo.socialMedia.facebook}
                onChange={handleChange}
                className="form-input"
                placeholder="Facebook profile URL"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="contactInfo.socialMedia.twitter" className="form-label">Twitter</label>
              <input
                type="url"
                id="contactInfo.socialMedia.twitter"
                name="contactInfo.socialMedia.twitter"
                value={formData.contactInfo.socialMedia.twitter}
                onChange={handleChange}
                className="form-input"
                placeholder="Twitter profile URL"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="contactInfo.socialMedia.instagram" className="form-label">Instagram</label>
              <input
                type="url"
                id="contactInfo.socialMedia.instagram"
                name="contactInfo.socialMedia.instagram"
                value={formData.contactInfo.socialMedia.instagram}
                onChange={handleChange}
                className="form-input"
                placeholder="Instagram profile URL"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="contactInfo.socialMedia.linkedin" className="form-label">LinkedIn</label>
              <input
                type="url"
                id="contactInfo.socialMedia.linkedin"
                name="contactInfo.socialMedia.linkedin"
                value={formData.contactInfo.socialMedia.linkedin}
                onChange={handleChange}
                className="form-input"
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isSubmitting || loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              mode === 'edit' ? 'Update Member' : 'Add Member'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

FamilyMemberForm.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit']),
  initialData: PropTypes.object,
  parentId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default FamilyMemberForm; 