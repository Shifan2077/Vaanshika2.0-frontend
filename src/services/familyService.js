// File: src/services/familyService.js
// Service for interacting with family-related API endpoints

import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Get the current user's authentication token
 * @returns {Promise<string>} The authentication token
 */
const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  return await currentUser.getIdToken();
};

/**
 * Handle API response and errors
 * @param {Response} response - The fetch response object
 * @returns {Promise<any>} The parsed response data
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || 'Something went wrong';
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Create a new family tree
 * @param {Object} familyData - The family tree data
 * @returns {Promise<Object>} The created family tree
 */
export const createFamilyTree = async (familyData) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(familyData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating family tree:', error);
    throw error;
  }
};

/**
 * Get the current user's family tree
 * @returns {Promise<Object>} The family tree data
 */
export const getFamilyTree = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching family tree:', error);
    throw error;
  }
};

/**
 * Add a child to a family member
 * @param {string} parentId - The ID of the parent member
 * @param {Object} childData - The child data (name, attributes)
 * @returns {Promise<Object>} The updated family tree
 */
export const addChild = async (parentId, childData) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family/addChild`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        parent_id: parentId,
        name: childData.name,
        attributes: childData.attributes
      })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding child:', error);
    throw error;
  }
};

/**
 * Update a family member
 * @param {string} memberId - The ID of the member to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} The result of the update operation
 */
export const updateFamilyMember = async (memberId, updates) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family/updateChild`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        member_id: memberId,
        updates
      })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating family member:', error);
    throw error;
  }
};

/**
 * Delete a family member
 * @param {string} memberId - The ID of the member to delete
 * @returns {Promise<Object>} The result of the delete operation
 */
export const deleteFamilyMember = async (memberId) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family/deleteChild`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        member_id: memberId
      })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting family member:', error);
    throw error;
  }
};

/**
 * Delete the entire family tree
 * @returns {Promise<Object>} The result of the delete operation
 */
export const deleteFamilyTree = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/family/deleteTree`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting family tree:', error);
    throw error;
  }
};

/**
 * Search for family members by name
 * @param {string} searchTerm - The search term
 * @returns {Promise<Array>} The search results
 */
export const searchFamilyMembers = async (searchTerm) => {
  try {
    const familyTree = await getFamilyTree();
    
    // Implement client-side search since the backend doesn't have a search endpoint
    const searchResults = [];
    
    // Helper function to recursively search the tree
    const searchTree = (member, term) => {
      if (member.name.toLowerCase().includes(term.toLowerCase())) {
        searchResults.push(member);
      }
      
      if (member.children && member.children.length > 0) {
        member.children.forEach(child => searchTree(child, term));
      }
    };
    
    // Start the search from the root
    searchTree(familyTree, searchTerm);
    
    return searchResults;
  } catch (error) {
    console.error('Error searching family members:', error);
    throw error;
  }
};

/**
 * Get a specific family member by ID
 * @param {string} memberId - The ID of the member to retrieve
 * @returns {Promise<Object>} The family member
 */
export const getFamilyMember = async (memberId) => {
  try {
    const familyTree = await getFamilyTree();
    
    // Helper function to recursively find a member by ID
    const findMemberById = (member, id) => {
      if (member.member_id === id) {
        return member;
      }
      
      if (member.children && member.children.length > 0) {
        for (const child of member.children) {
          const found = findMemberById(child, id);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    // Find the member in the tree
    const member = findMemberById(familyTree, memberId);
    
    if (!member) {
      throw new Error('Family member not found');
    }
    
    return member;
  } catch (error) {
    console.error('Error getting family member:', error);
    throw error;
  }
};

/**
 * Get all ancestors of a family member
 * @param {string} memberId - The ID of the member
 * @returns {Promise<Array>} The ancestors
 */
export const getAncestors = async (memberId) => {
  try {
    const familyTree = await getFamilyTree();
    
    const ancestors = [];
    
    // Helper function to find a member's parent
    const findParent = (tree, childId) => {
      if (tree.children && tree.children.some(child => child.member_id === childId)) {
        return tree;
      }
      
      if (tree.children) {
        for (const child of tree.children) {
          const parent = findParent(child, childId);
          if (parent) return parent;
        }
      }
      
      return null;
    };
    
    // Find all ancestors by repeatedly finding parents
    let currentId = memberId;
    let parent = findParent(familyTree, currentId);
    
    while (parent) {
      ancestors.push(parent);
      currentId = parent.member_id;
      parent = findParent(familyTree, currentId);
    }
    
    return ancestors;
  } catch (error) {
    console.error('Error getting ancestors:', error);
    throw error;
  }
};

/**
 * Get all descendants of a family member
 * @param {string} memberId - The ID of the member
 * @returns {Promise<Array>} The descendants
 */
export const getDescendants = async (memberId) => {
  try {
    const familyTree = await getFamilyTree();
    
    // Helper function to find a member by ID
    const findMemberById = (member, id) => {
      if (member.member_id === id) {
        return member;
      }
      
      if (member.children && member.children.length > 0) {
        for (const child of member.children) {
          const found = findMemberById(child, id);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    // Helper function to get all descendants of a member
    const getAllDescendants = (member) => {
      const descendants = [];
      
      if (member.children && member.children.length > 0) {
        member.children.forEach(child => {
          descendants.push(child);
          descendants.push(...getAllDescendants(child));
        });
      }
      
      return descendants;
    };
    
    // Find the member and get their descendants
    const member = findMemberById(familyTree, memberId);
    
    if (!member) {
      throw new Error('Family member not found');
    }
    
    return getAllDescendants(member);
  } catch (error) {
    console.error('Error getting descendants:', error);
    throw error;
  }
};

/**
 * Calculate the relationship between two family members
 * @param {string} member1Id - The ID of the first member
 * @param {string} member2Id - The ID of the second member
 * @returns {Promise<string>} The relationship description
 */
export const calculateRelationship = async (member1Id, member2Id) => {
  try {
    // Get ancestors of both members
    const member1Ancestors = await getAncestors(member1Id);
    const member2Ancestors = await getAncestors(member2Id);
    
    // Check if one is an ancestor of the other
    if (member1Ancestors.some(ancestor => ancestor.member_id === member2Id)) {
      return 'Ancestor';
    }
    
    if (member2Ancestors.some(ancestor => ancestor.member_id === member1Id)) {
      return 'Descendant';
    }
    
    // Check for siblings (share at least one parent)
    const member1ParentIds = member1Ancestors.map(ancestor => ancestor.member_id);
    const member2ParentIds = member2Ancestors.map(ancestor => ancestor.member_id);
    
    const commonParents = member1ParentIds.filter(id => member2ParentIds.includes(id));
    
    if (commonParents.length > 0) {
      return 'Sibling';
    }
    
    // If they share ancestors but aren't direct siblings, they're cousins or other relatives
    const allAncestorIds = [...new Set([...member1ParentIds, ...member2ParentIds])];
    
    if (allAncestorIds.length > 0) {
      return 'Relative';
    }
    
    return 'Unrelated';
  } catch (error) {
    console.error('Error calculating relationship:', error);
    throw error;
  }
};

export default {
  createFamilyTree,
  getFamilyTree,
  addChild,
  updateFamilyMember,
  deleteFamilyMember,
  deleteFamilyTree,
  searchFamilyMembers,
  getFamilyMember,
  getAncestors,
  getDescendants,
  calculateRelationship
}; 