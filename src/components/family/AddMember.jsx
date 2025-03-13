// File: src/components/family/AddMember.jsx
// Component for adding new family members

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../hooks/useFamily';
import { validateForm } from '../../utils/validation';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';

const AddMember = ({ isOpen, onClose, parentMemberId = null }) => {
  const navigate = useNavigate();
  const { familyTree, addMember, loading } = useFamily();
  const [availableParents, setAvailableParents] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    relationship: '',
    parents: parentMemberId ? [parentMemberId] : []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Populate available parents from family tree
    if (familyTree && familyTree.members) {
      setAvailableParents(familyTree.members);
    }
  }, [familyTree]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleParentChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        parents: [...formData.parents, value]
      });
    } else {
      setFormData({
        ...formData,
        parents: formData.parents.filter(id => id !== value)
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationRules = {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      gender: { required: true },
      birthDate: { date: true }
    };
    
    const { isValid, errors } = validateForm(formData, validationRules);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addMember(formData);
      onClose();
      navigate('/family-tree');
    } catch (error) {
      console.error('Error adding family member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Family Member"
    >
      <form onSubmit={handleSubmit} className="add-member-form">
        <div className="form-row">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            error={formErrors.firstName}
          />
          
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            required
            error={formErrors.lastName}
          />
        </div>
        
        <div className="form-group">
          <label className="input-label">Gender</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>
        
        <Input
          label="Birth Date"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          error={formErrors.birthDate}
        />
        
        <Input
          label="Relationship"
          type="text"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          placeholder="E.g., Father, Mother, Child, Sibling"
          error={formErrors.relationship}
        />
        
        {availableParents.length > 0 && (
          <div className="form-group">
            <label className="input-label">Parents</label>
            <div className="checkbox-group">
              {availableParents.map(parent => (
                <label key={parent._id} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="parents"
                    value={parent._id}
                    checked={formData.parents.includes(parent._id)}
                    onChange={handleParentChange}
                  />
                  {parent.firstName} {parent.lastName}
                </label>
              ))}
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMember; 