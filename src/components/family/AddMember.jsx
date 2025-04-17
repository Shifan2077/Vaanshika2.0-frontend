// File: src/components/family/AddMember.jsx
// Component for adding new family members

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../../hooks/useFamily";
import { validateForm } from "../../utils/validation";
import Input from "../common/Input";
import Button from "../common/Button";
import Modal from "../common/Modal";

const AddMember = ({
  isOpen,
  onClose,
  parentMemberId = null,
  spouseMemberId = null,
}) => {
  const navigate = useNavigate();
  const { familyTree, addMember, loading } = useFamily();
  const [availableParents, setAvailableParents] = useState([]);
  const [availableSpouses, setAvailableSpouses] = useState([]);
  const [showSpouseSection, setShowSpouseSection] = useState(!!spouseMemberId);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    relationship: "",
    parents: parentMemberId ? [parentMemberId] : [],
    spouseId: spouseMemberId || "",
    relationshipType: spouseMemberId ? "spouse" : "child",
    photoURL: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Populate available parents and potential spouses from family tree
    if (familyTree && familyTree.members) {
      setAvailableParents(familyTree.members);

      // Filter out members who could be spouses (exclude direct family members)
      const potentialSpouses = familyTree.members.filter(
        (member) =>
          !formData.parents.includes(member._id) &&
          member._id !== parentMemberId
      );
      setAvailableSpouses(potentialSpouses);
    }
  }, [familyTree, formData.parents, parentMemberId]);

  // If parentMemberId is provided, set it in the form data
  useEffect(() => {
    if (parentMemberId) {
      setFormData((prev) => ({
        ...prev,
        parents: [parentMemberId],
        relationshipType: "child",
      }));
    }
  }, [parentMemberId]);

  // If spouseMemberId is provided, set it in the form data
  useEffect(() => {
    if (spouseMemberId) {
      setFormData((prev) => ({
        ...prev,
        spouseId: spouseMemberId,
        relationshipType: "spouse",
      }));
      setShowSpouseSection(true);
    }
  }, [spouseMemberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleParentChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        parents: [...formData.parents, value],
      });
    } else {
      setFormData({
        ...formData,
        parents: formData.parents.filter((id) => id !== value),
      });
    }
  };

  const handleSpouseChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      spouseId: value,
      relationshipType: value ? "spouse" : "child",
    });
  };

  const toggleSpouseSection = () => {
    setShowSpouseSection(!showSpouseSection);
    if (!showSpouseSection) {
      // Reset spouse fields when showing the section
      setFormData({
        ...formData,
        spouseId: "",
        relationshipType: "spouse",
      });
    } else {
      // Clear spouse fields when hiding the section
      setFormData({
        ...formData,
        spouseId: "",
        relationshipType: "child",
      });
    }
  };

  const handleSubmit = async (e) => {
    console.log("Form data:");

    e.preventDefault();

    // Validate form
    const validationRules = {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      gender: { required: true },
      birthDate: { date: true },
    };

    // Add validation for spouse fields if the section is shown
    if (showSpouseSection && formData.spouseId) {
      validationRules.relationshipType = { required: true };
    }

    const { isValid, errors } = validateForm(formData, validationRules);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    console.log("Form data:", formData);

    try {
      // Prepare member data based on relationship type
      const memberData = {
        ...formData,
        parentId:
          parentMemberId ||
          (formData.parents.length > 0 ? formData.parents[0] : null),
        spouseId: showSpouseSection ? formData.spouseId : null,
        relationshipType: formData.relationshipType || "child",
        isPartOfFamilyUnit: !!formData.spouseId,
      };

      // If adding a spouse, generate a family unit ID
      if (formData.spouseId) {
        memberData.familyUnitId = `family_unit_${Date.now()}`;
      }

      console.log("Submitting member data:", memberData);
      await addMember(memberData);
      onClose();
      navigate("/family-tree");
    } catch (error) {
      console.error("Error adding family member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Family Member">
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
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
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
              {availableParents.map((parent) => (
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

        {/* Spouse/Partner Section Toggle */}
        <div className="form-group mt-4">
          <button
            type="button"
            className="text-primary-600 hover:text-primary-800 flex items-center text-sm font-medium"
            onClick={toggleSpouseSection}
          >
            <span className="mr-2">{showSpouseSection ? "−" : "+"}</span>
            {showSpouseSection
              ? "Hide Spouse/Partner Information"
              : "Add Spouse/Partner Information"}
          </button>
        </div>

        {/* Spouse/Partner Fields */}
        {showSpouseSection && (
          <div className="spouse-section border-l-2 border-primary-200 pl-4 mt-2 mb-4">
            <div className="form-group">
              <label className="input-label">Spouse/Partner</label>
              <select
                name="spouseId"
                value={formData.spouseId}
                onChange={handleSpouseChange}
                className="form-select w-full"
              >
                <option value="">Select a spouse/partner</option>
                {availableSpouses.map((spouse) => (
                  <option key={spouse._id} value={spouse._id}>
                    {spouse.firstName} {spouse.lastName}
                  </option>
                ))}
              </select>
              {formErrors.spouseId && (
                <p className="text-error-600 text-sm mt-1">
                  {formErrors.spouseId}
                </p>
              )}
            </div>

            <div className="form-group mt-3">
              <label className="input-label">Relationship Type</label>
              <select
                name="relationshipType"
                value={formData.relationshipType}
                onChange={handleChange}
                className="form-select w-full"
                disabled={!formData.spouseId}
              >
                <option value="">Select relationship type</option>
                <option value="spouse">Spouse</option>
                <option value="partner">Partner</option>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="ex-spouse">Ex-Spouse</option>
                <option value="fiancé">Fiancé</option>
                <option value="fiancée">Fiancée</option>
              </select>
              {formErrors.relationshipType && (
                <p className="text-error-600 text-sm mt-1">
                  {formErrors.relationshipType}
                </p>
              )}
            </div>
          </div>
        )}

        <Input
          label="Photo URL"
          type="url"
          name="photoURL"
          value={formData.photoURL}
          onChange={handleChange}
          placeholder="Enter photo URL"
          error={formErrors.photoURL}
        />

        <div className="form-section mt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Social Media Links
          </h3>
          <div className="space-y-3">
            <Input
              label="Facebook"
              type="url"
              name="socialMedia.facebook"
              value={formData.socialMedia.facebook}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    facebook: e.target.value,
                  },
                });
              }}
              placeholder="Facebook profile URL"
            />

            <Input
              label="Twitter"
              type="url"
              name="socialMedia.twitter"
              value={formData.socialMedia.twitter}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    twitter: e.target.value,
                  },
                });
              }}
              placeholder="Twitter profile URL"
            />

            <Input
              label="Instagram"
              type="url"
              name="socialMedia.instagram"
              value={formData.socialMedia.instagram}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    instagram: e.target.value,
                  },
                });
              }}
              placeholder="Instagram profile URL"
            />

            <Input
              label="LinkedIn"
              type="url"
              name="socialMedia.linkedin"
              value={formData.socialMedia.linkedin}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    linkedin: e.target.value,
                  },
                });
              }}
              placeholder="LinkedIn profile URL"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || loading}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMember;
