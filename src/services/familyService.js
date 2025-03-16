// File: src/services/familyService.js
// Service for interacting with family-related API endpoints

import apiClient from './apiClient';

const familyService = {
/**
 * Create a new family tree
   * @param {Object} familyData - Data for the new family tree
   * @returns {Promise} - API response
   */
  createFamilyTree: async (treeData) => {
    try {
      console.log('familyService.createFamilyTree called with:', treeData);
      const response = await apiClient.post('/family', treeData);
      console.log('API response for createFamilyTree:', response);
      
      // Check if the response has the expected structure
      if (response.data && (response.data.success !== false)) {
        // Handle different response formats
        const data = response.data.data || response.data;
        
        return {
          success: true,
          data: data,
          message: 'Family tree created successfully'
        };
      } else {
        // Handle error response
        return {
          success: false,
          message: response.data?.message || 'Failed to create family tree'
        };
      }
    } catch (error) {
      console.error('Error creating family tree:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to create family tree' 
      };
    }
  },

  /**
   * Get all family trees for the user
   * @returns {Promise} - API response with all family trees data
   */
  getFamilyTree: () => {
    return apiClient.get('/family');
  },

  /**
   * Get a specific family tree by ID
   * @param {string} treeId - ID of the family tree
   * @returns {Promise} - API response with family tree data
   */
  getFamilyTreeById: (treeId) => {
    return apiClient.get(`/family/${treeId}`);
  },

  /**
   * Get all family trees for the user
   * @returns {Promise} - API response with all family trees data
   */
  getAllFamilyTrees: async () => {
    try {
      console.log('Fetching all family trees');
      const response = await apiClient.get('/family');
      console.log('getAllFamilyTrees response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching family trees:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch family trees' };
    }
  },

  /**
   * Get all family members for the user's default tree
   * @returns {Promise} - API response with family members data
   */
  getFamilyMembers: () => {
    return apiClient.get('/family/members');
  },

  /**
   * Get family members for a specific tree
   * @param {string} treeId - ID of the family tree
   * @returns {Promise} - API response with family members data
   */
  getFamilyMembersByTreeId: (treeId) => {
    return apiClient.get(`/family/${treeId}/members`);
  },

/**
 * Get a specific family member by ID
   * @param {string} memberId - ID of the family member
   * @returns {Promise} - API response with member data
   */
  getFamilyMember: (memberId) => {
    return apiClient.get(`/family/members/${memberId}`);
  },

  /**
   * Add a child to the family tree
   * @param {Object} childData - Data for the new child
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response
   */
  addChild: (childData, treeId) => {
    console.log('familyService.addChild called with:', { childData, treeId });
    
    if (treeId) {
      // Ensure treeId is a string and properly formatted
      const formattedTreeId = String(treeId).trim();
      console.log('Using formatted treeId:', formattedTreeId);
      return apiClient.post(`/family/${formattedTreeId}/children`, childData);
    }
    return apiClient.post('/family/members', childData);
  },

  /**
   * Update a family member
   * @param {string} memberId - ID of the family member to update
   * @param {Object} updateData - Updated data for the member
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response
   */
  updateChild: (memberId, updateData, treeId) => {
    if (treeId) {
      return apiClient.put(`/family/${treeId}/children/${memberId}`, updateData);
    }
    return apiClient.put(`/family/children/${memberId}`, updateData);
  },

  /**
   * Delete a family member
   * @param {string} memberId - ID of the family member to delete
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response
   */
  deleteChild: (memberId, treeId) => {
    if (treeId) {
      return apiClient.delete(`/family/${treeId}/children/${memberId}`);
    }
    return apiClient.delete(`/family/children/${memberId}`);
  },

  /**
   * Delete the entire family tree
   * @param {string} [treeId] - Optional ID of the family tree to delete
   * @returns {Promise} - API response
   */
  deleteFamilyTree: (treeId) => {
    if (treeId) {
      return apiClient.delete(`/family/${treeId}`);
    }
    return apiClient.delete('/family');
  },

  /**
   * Get ancestors of a family member
   * @param {string} memberId - ID of the family member
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response with ancestors data
   */
  getAncestors: (memberId, treeId) => {
    if (treeId) {
      return apiClient.get(`/family/${treeId}/members/${memberId}/ancestors`);
    }
    return apiClient.get(`/family/members/${memberId}/ancestors`);
  },

  /**
   * Get descendants of a family member
   * @param {string} memberId - ID of the family member
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response with descendants data
   */
  getDescendants: (memberId, treeId) => {
    if (treeId) {
      return apiClient.get(`/family/${treeId}/members/${memberId}/descendants`);
    }
    return apiClient.get(`/family/members/${memberId}/descendants`);
  },

  /**
   * Calculate relationship between two family members
   * @param {string} member1Id - ID of the first family member
   * @param {string} member2Id - ID of the second family member
   * @param {string} [treeId] - Optional ID of the family tree
   * @returns {Promise} - API response with relationship data
   */
  calculateRelationship: (member1Id, member2Id, treeId) => {
    if (treeId) {
      return apiClient.get(`/family/${treeId}/relationship?member1=${member1Id}&member2=${member2Id}`);
    }
    return apiClient.get(`/family/relationship?member1=${member1Id}&member2=${member2Id}`);
  },

  // Get a specific family tree by ID
  getFamilyTree: async (treeId) => {
    try {
      const response = await apiClient.get(`/family/${treeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching family tree:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch family tree' };
    }
  },
  
  // Update a family tree
  updateFamilyTree: async (treeId, treeData) => {
    try {
      const response = await apiClient.put(`/family/${treeId}`, treeData);
      return response.data;
    } catch (error) {
      console.error('Error updating family tree:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update family tree' };
    }
  },
  
  // Delete a family tree
  deleteFamilyTree: async (treeId) => {
    try {
      const response = await apiClient.delete(`/family/${treeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting family tree:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete family tree' };
    }
  },
  
  // Add a member to a family tree
  addMember: async (memberData, treeId) => {
    try {
      // Format the tree ID to ensure it's a string and trimmed
      const formattedTreeId = treeId ? String(treeId).trim() : '';
      console.log('familyService.addMember called with treeId:', formattedTreeId);
      
      // Determine the appropriate URL based on relationship type and tree ID
      let url = '/family/members';
      
      // Check if we have relationship-specific data
      const relationshipMode = memberData.relationshipMode || 'child';
      
      if (formattedTreeId) {
        // Use the appropriate endpoint based on relationship mode
        if (relationshipMode === 'parent') {
          url = `/family/${formattedTreeId}/parents`;
        } else if (relationshipMode === 'partner') {
          url = `/family/${formattedTreeId}/partners`;
        } else {
          // Default to members endpoint
          url = `/family/${formattedTreeId}/members`;
        }
      } else {
        // No tree ID provided, use base endpoints
        if (relationshipMode === 'parent') {
          url = '/family/parents';
        } else if (relationshipMode === 'partner') {
          url = '/family/partners';
        }
      }
      
      console.log(`Sending request to ${url} with member data, relationship mode: ${relationshipMode}`);
      const response = await apiClient.post(url, memberData);
      console.log('API response for addMember:', response);
      
      // Check if the response has the expected structure
      if (response.data && (response.data.success !== false)) {
        // Handle different response formats
        const data = response.data.data || response.data;
        
        return {
          success: true,
          data: data,
          message: 'Family member added successfully'
        };
      } else {
        // Handle error response
        return {
          success: false,
          message: response.data?.message || 'Failed to add family member'
        };
      }
    } catch (error) {
      console.error('Error adding family member:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to add family member' 
      };
    }
  },
  
  // Add a child to a parent in a family tree
  addChild: async (childData, parentId, treeId) => {
    try {
      // Format the tree ID to ensure it's a string and trimmed
      const formattedTreeId = treeId ? String(treeId).trim() : '';
      console.log('Adding child to parent ID:', parentId, 'in tree ID:', formattedTreeId);
      
      // Check if this is a spouse relationship
      const isSpouseRelationship = childData.get('relationshipType') === 'spouse';
      
      let url = '/family/members';
      
      // If we have a tree ID, use it in the URL
      if (formattedTreeId) {
        url = `/family/${formattedTreeId}/children`;
      }
      
      // Add parent ID to the form data
      if (parentId) {
        if (isSpouseRelationship) {
          childData.append('spouseId', parentId);
        } else {
          childData.append('parentId', parentId);
        }
      }
      
      console.log(`Sending request to ${url} with child data`);
      const response = await apiClient.post(url, childData);
      return response.data;
    } catch (error) {
      console.error('Error adding child:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add child' };
    }
  },
  
  // Update a member in a family tree
  updateMember: async (memberId, memberData) => {
    try {
      const response = await apiClient.put(`/family/members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      console.error('Error updating family member:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update family member' };
    }
  },
  
  // Delete a member from a family tree
  deleteMember: async (memberId) => {
    try {
      const response = await apiClient.delete(`/family/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting family member:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete family member' };
    }
  },
  
  // Add a spouse relationship between two members
  addSpouseRelationship: async (member1Id, member2Id, treeId) => {
    try {
      // Format the tree ID to ensure it's a string and trimmed
      const formattedTreeId = treeId ? String(treeId).trim() : '';
      
      const response = await apiClient.post(`/family/${formattedTreeId}/relationships/spouse`, {
        member1Id,
        member2Id
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding spouse relationship:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add spouse relationship' };
    }
  }
};

export default familyService; 