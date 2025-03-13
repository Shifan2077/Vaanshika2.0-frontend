// File: src/components/family/EditMember.jsx
// Component for editing existing family members

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../hooks/useFamily';
import { validateForm } from '../../utils/validation';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const EditMember = ({ isOpen, onClose, memberId }) => {
  const navigate = useNavigate();
  const { familyTree, getMember, updateMember, removeMember, loading } = useFamily();
  const [availableParents, setAvailableParents] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    relationship: '',
    parents: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadMemberData = async () => {
      if (memberId) {
        try {
          setIsLoading(true);
          const data = await getMember(memberId);
          setMemberData(data);
          
          // Set form data from member data
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            gender: data.gender || 'male',
            birthDate: data.birthDate ? data.birthDate.substring(0, 10) : '',
            relationship: data.relationship || '',
            parents: data.parents || []
          });
        } catch (error) {
          console.error('Error loading member data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadMemberData();
  }, [memberId, getMember]);
  
  useEffect(() => {
    // Populate available parents from family tree, excluding the current member
    if (familyTree && familyTree.members) {
      const parents = familyTree.members.filter(member => member._id !== memberId);
      setAvailableParents(parents);
    }
  }, [familyTree, memberId]);
  
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
      await updateMember(memberId, formData);
      onClose();
      navigate('/family-tree');
    } catch (error) {
      console.error('Error updating family member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await removeMember(memberId);
      onClose();
      navigate('/family-tree');
    } catch (error) {
      console.error('Error deleting family member:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Family Member"
      >
        <Loader text="Loading member data..." />
      </Modal>
    );
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Family Member"
    >
      {showDeleteConfirm ? (
        <div className="delete-confirmation">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete {memberData.firstName} {memberData.lastName}?</p>
          <p>This action cannot be undone.</p>
          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-member-form">
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
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
            <div className="spacer"></div>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditMember; 