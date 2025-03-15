// File: src/services/familyService.js
// Service for interacting with family-related API endpoints

import apiClient from './apiClient';

const familyService = {
/**
 * Create a new family tree
   * @param {Object} familyData - Data for the new family tree
   * @returns {Promise} - API response
   */
  createFamilyTree: (familyData) => {
    return apiClient.post('/family', familyData);
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
  getAllFamilyTrees: () => {
    return apiClient.get('/family/all');
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
  }
};

export default familyService; 