// File: src/components/family/FamilyMemberForm.jsx
// Glassmorphic form component for adding or editing family members

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFamily } from '../../hooks/useFamily';

const FamilyMemberForm = ({ 
  member, 
  parentId, 
  isEdit = false, 
  onSubmit, 
  onCancel 
}) => {
  const { loading } = useFamily();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    occupation: '',
    bio: '',
    imageUrl: '',
    email: '',
    phone: '',
    address: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with member data if editing
  useEffect(() => {
    if (isEdit && member) {
      const { name, attributes = {} } = member;
      setFormData({
        name: name || '',
        gender: attributes.gender || '',
        birthDate: attributes.birthDate || '',
        deathDate: attributes.deathDate || '',
        birthPlace: attributes.birthPlace || '',
        occupation: attributes.occupation || '',
        bio: attributes.bio || '',
        imageUrl: attributes.imageUrl || '',
        email: attributes.email || '',
        phone: attributes.phone || '',
        address: attributes.address || '',
        socialMedia: {
          facebook: attributes.socialMedia?.facebook || '',
          twitter: attributes.socialMedia?.twitter || '',
          instagram: attributes.socialMedia?.instagram || '',
          linkedin: attributes.socialMedia?.linkedin || ''
        }
      });
    }
  }, [isEdit, member]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., socialMedia.facebook)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
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
        name: formData.name,
        attributes: {
          gender: formData.gender,
          birthDate: formData.birthDate,
          deathDate: formData.deathDate || null,
          birthPlace: formData.birthPlace,
          occupation: formData.occupation,
          bio: formData.bio,
          imageUrl: formData.imageUrl,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          socialMedia: formData.socialMedia
        }
      };
      
      // Call the onSubmit callback with the form data
      await onSubmit(memberData, isEdit ? member.member_id : parentId);
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
        {isEdit ? 'Edit Family Member' : 'Add Family Member'}
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
          
          <div className="form-control">
            <label htmlFor="name" className="form-label">
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'border-error focus:border-error focus:ring-error' : ''}`}
              placeholder="Enter full name"
              required
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
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
              <label htmlFor="birthPlace" className="form-label">Birth Place</label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
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
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder="Email address"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            
            <div className="form-control">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'border-error focus:border-error focus:ring-error' : ''}`}
                placeholder="Phone number"
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
          </div>
          
          <div className="form-control">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
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
            <label htmlFor="imageUrl" className="form-label">Profile Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="form-hint">Enter a URL for the profile image</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="socialMedia.facebook" className="form-label">Facebook</label>
              <input
                type="url"
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
                className="form-input"
                placeholder="Facebook profile URL"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="socialMedia.twitter" className="form-label">Twitter</label>
              <input
                type="url"
                id="socialMedia.twitter"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
                className="form-input"
                placeholder="Twitter profile URL"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="socialMedia.instagram" className="form-label">Instagram</label>
              <input
                type="url"
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
                className="form-input"
                placeholder="Instagram profile URL"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="socialMedia.linkedin" className="form-label">LinkedIn</label>
              <input
                type="url"
                id="socialMedia.linkedin"
                name="socialMedia.linkedin"
                value={formData.socialMedia.linkedin}
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
              isEdit ? 'Update Member' : 'Add Member'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

FamilyMemberForm.propTypes = {
  member: PropTypes.object,
  parentId: PropTypes.string,
  isEdit: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default FamilyMemberForm; 