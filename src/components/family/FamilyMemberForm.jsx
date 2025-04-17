// File: src/components/family/FamilyMemberForm.jsx
// Glassmorphic form component for adding or editing family members

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFamily } from "../../contexts/FamilyContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const FamilyMemberForm = ({
  onClose,
  initialData = {},
  mode = "add",
  relatedMemberId = null,
  relationshipMode = "child", // 'child', 'parent', or 'partner'
  onSubmit,
}) => {
  const { addMember, updateMember, selectedTreeId } = useFamily();
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    deathDate: "",
    isAlive: true,
    location: "",
    occupation: "",
    bio: "",
    photoURL: "",
    contactInfo: {
      email: "",
      phone: "",
    },
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    relationshipType:
      relationshipMode === "partner"
        ? "spouse"
        : relationshipMode === "parent"
        ? "parent"
        : "child",
  });

  // Initialize form with data if editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setMemberData({
        ...initialData,
        birthDate: initialData.birthDate
          ? new Date(initialData.birthDate).toISOString().split("T")[0]
          : "",
        deathDate: initialData.deathDate
          ? new Date(initialData.deathDate).toISOString().split("T")[0]
          : "",
        isAlive: initialData.isAlive !== undefined ? initialData.isAlive : true,
        contactInfo: initialData.contactInfo || { email: "", phone: "" },
        socialMedia: initialData.socialMedia || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        photoURL: initialData.photoURL || "",
        relationshipType:
          relationshipMode === "partner"
            ? "spouse"
            : relationshipMode === "parent"
            ? "parent"
            : initialData.relationshipType || "child",
      });
    } else {
      // Set default relationship type based on relationshipMode
      setMemberData((prev) => ({
        ...prev,
        relationshipType:
          relationshipMode === "partner"
            ? "spouse"
            : relationshipMode === "parent"
            ? "parent"
            : "child",
      }));
    }
  }, [initialData, mode, relationshipMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setMemberData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === "checkbox") {
      setMemberData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setMemberData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log("Member data:", memberData);
    e.preventDefault();
    setLoading(true);

    try {
      // If onSubmit prop is provided, use it
      if (onSubmit) {
        await onSubmit(memberData);
        onClose();
        return;
      }

      const formData = new FormData();

      // Add all member data to formData
      Object.keys(memberData).forEach((key) => {
        if (key === "contactInfo") {
          formData.append(
            "contactInfo",
            JSON.stringify(memberData.contactInfo)
          );
        } else if (key === "photoURL") {
          formData.append("photoURL", memberData.photoURL);
        } else if (key === "socialMedia") {
          formData.append(
            "socialMedia",
            JSON.stringify(memberData.socialMedia)
          );
        } else if (memberData[key] !== undefined && memberData[key] !== null) {
          formData.append(key, memberData[key]);
        }
      });

      // Add relationship-specific IDs based on relationshipMode
      if (relatedMemberId) {
        if (relationshipMode === "child") {
          formData.append("parentId", relatedMemberId);
        } else if (relationshipMode === "parent") {
          formData.append("childId", relatedMemberId);
        } else if (relationshipMode === "partner") {
          formData.append("partnerId", relatedMemberId);
        }
      }

      console.log("Submitting member data:", {
        ...memberData,
        relationshipMode,
        relatedMemberId,
        relationshipType: memberData.relationshipType,
      });

      let result;
      if (mode === "edit") {
        result = await updateMember(initialData.id, formData);
      } else {
        result = await addMember(formData, selectedTreeId);
      }

      if (result && result.success) {
        toast.success(
          mode === "edit"
            ? "Member updated successfully!"
            : "Member added successfully!"
        );
        onClose();
      } else {
        toast.error(result?.message || "Failed to save member");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the member");
    } finally {
      setLoading(false);
    }
  };

  // Get the title based on the relationship mode
  const getFormTitle = () => {
    if (mode === "edit") {
      return "Edit Family Member";
    }

    switch (relationshipMode) {
      case "parent":
        return "Add Parent";
      case "partner":
        return "Add Partner";
      case "child":
      default:
        return "Add Child";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {getFormTitle()}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={memberData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={memberData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={memberData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {relatedMemberId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship Type
                </label>
                <select
                  name="relationshipType"
                  value={memberData.relationshipType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {relationshipMode === "partner" && (
                    <>
                      <option value="spouse">Spouse</option>
                      <option value="husband">Husband</option>
                      <option value="wife">Wife</option>
                      <option value="partner">Partner</option>
                    </>
                  )}
                  {relationshipMode === "parent" && (
                    <>
                      <option value="parent">Parent</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="dad">Dad</option>
                      <option value="mom">Mom</option>
                      <option value="stepDad">Step Dad</option>
                      <option value="stepMom">Step Mom</option>
                    </>
                  )}
                  {relationshipMode === "child" && (
                    <>
                      <option value="child">Child</option>
                      <option value="adopted">Adopted Child</option>
                      <option value="foster">Foster Child</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={memberData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center h-full mt-7">
                  <input
                    type="checkbox"
                    id="isAlive"
                    name="isAlive"
                    checked={memberData.isAlive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isAlive"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Is Alive
                  </label>
                </div>
              </div>
            </div>

            {!memberData.isAlive && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Death Date
                </label>
                <input
                  type="date"
                  name="deathDate"
                  value={memberData.deathDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={memberData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={memberData.occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={memberData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={memberData.contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={memberData.contactInfo.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="photoURL"
                value={memberData.photoURL}
                onChange={handleChange}
                placeholder="Enter photo URL"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              {memberData.photoURL && (
                <div className="mt-2">
                  <img
                    src={memberData.photoURL}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/80?text=Invalid+URL";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Social Media Links
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Facebook Profile
                </label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={memberData.socialMedia.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/profile"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter Profile
                </label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={memberData.socialMedia.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instagram Profile
                </label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={memberData.socialMedia.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={memberData.socialMedia.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

FamilyMemberForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(["add", "edit"]),
  relatedMemberId: PropTypes.string,
  relationshipMode: PropTypes.oneOf(["child", "parent", "partner"]),
  onSubmit: PropTypes.func,
};

export default FamilyMemberForm;
