// File: src/context/FamilyContext.js
// Context for managing family tree data

import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as familyService from '../services/familyService';

// Create context
export const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [familyTree, setFamilyTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch family tree data
  const fetchFamilyTree = async () => {
    if (!currentUser) {
      setFamilyTree(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await familyService.getFamilyTree();
      setFamilyTree(data);
    } catch (error) {
      console.error('Error fetching family tree:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get a specific family member
  const getMember = async (memberId) => {
    if (!currentUser || !memberId) {
      throw new Error('User not authenticated or member ID not provided');
    }

    try {
      return await familyService.getFamilyMember(memberId);
    } catch (error) {
      console.error('Error fetching family member:', error);
      setError(error.message);
      throw error;
    }
  };

  // Add a new family member
  const addMember = async (parentId, memberData) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await familyService.addChild(parentId, memberData);
      
      // Update local state
      await fetchFamilyTree(); // Refresh the tree after adding a member
      
      return result;
    } catch (error) {
      console.error('Error adding family member:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update an existing family member
  const updateMember = async (memberId, memberData) => {
    if (!currentUser || !memberId) {
      throw new Error('User not authenticated or member ID not provided');
    }

    try {
      const result = await familyService.updateFamilyMember(memberId, memberData);
      
      // Update local state
      await fetchFamilyTree(); // Refresh the tree after updating a member
      
      return result;
    } catch (error) {
      console.error('Error updating family member:', error);
      setError(error.message);
      throw error;
    }
  };

  // Remove a family member
  const removeMember = async (memberId) => {
    if (!currentUser || !memberId) {
      throw new Error('User not authenticated or member ID not provided');
    }

    try {
      const result = await familyService.deleteFamilyMember(memberId);
      
      // Update local state
      await fetchFamilyTree(); // Refresh the tree after removing a member
      
      return result;
    } catch (error) {
      console.error('Error removing family member:', error);
      setError(error.message);
      throw error;
    }
  };

  // Create a new family tree
  const createTree = async (treeData) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await familyService.createFamilyTree(treeData);
      
      // Update local state
      await fetchFamilyTree(); // Refresh after creating a new tree
      
      return result;
    } catch (error) {
      console.error('Error creating family tree:', error);
      setError(error.message);
      throw error;
    }
  };

  // Delete the entire family tree
  const deleteTree = async () => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await familyService.deleteFamilyTree();
      
      // Update local state
      setFamilyTree(null);
      
      return result;
    } catch (error) {
      console.error('Error deleting family tree:', error);
      setError(error.message);
      throw error;
    }
  };

  // Get ancestors of a family member
  const getAncestors = async (memberId) => {
    if (!currentUser || !memberId) {
      throw new Error('User not authenticated or member ID not provided');
    }

    try {
      return await familyService.getAncestors(memberId);
    } catch (error) {
      console.error('Error getting ancestors:', error);
      setError(error.message);
      throw error;
    }
  };

  // Get descendants of a family member
  const getDescendants = async (memberId) => {
    if (!currentUser || !memberId) {
      throw new Error('User not authenticated or member ID not provided');
    }

    try {
      return await familyService.getDescendants(memberId);
    } catch (error) {
      console.error('Error getting descendants:', error);
      setError(error.message);
      throw error;
    }
  };

  // Calculate relationship between two family members
  const calculateRelationship = async (member1Id, member2Id) => {
    if (!currentUser || !member1Id || !member2Id) {
      throw new Error('User not authenticated or member IDs not provided');
    }

    try {
      return await familyService.calculateRelationship(member1Id, member2Id);
    } catch (error) {
      console.error('Error calculating relationship:', error);
      setError(error.message);
      throw error;
    }
  };

  // Search for family members by name
  const searchMembers = async (searchTerm) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      return await familyService.searchFamilyMembers(searchTerm);
    } catch (error) {
      console.error('Error searching family members:', error);
      setError(error.message);
      throw error;
    }
  };

  // Fetch family tree when user changes
  useEffect(() => {
    if (currentUser) {
      fetchFamilyTree();
    }
  }, [currentUser]);

  const value = {
    familyTree,
    loading,
    error,
    fetchFamilyTree,
    getMember,
    addMember,
    updateMember,
    removeMember,
    createTree,
    deleteTree,
    getAncestors,
    getDescendants,
    calculateRelationship,
    searchMembers
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}; 