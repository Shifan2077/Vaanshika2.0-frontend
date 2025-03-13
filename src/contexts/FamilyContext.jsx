// File: src/contexts/FamilyContext.jsx
// Context for managing family tree data

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Create context
const FamilyContext = createContext();

export function useFamily() {
  return useContext(FamilyContext);
}

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all family members
  const fetchFamilyMembers = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/family/members');
      setFamilyMembers(response.data);
    } catch (err) {
      console.error('Error fetching family members:', err);
      setError('Failed to fetch family members. Please try again later.');
      
      // For demo purposes, set mock data if API fails
      setFamilyMembers(getMockFamilyMembers());
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch a specific family member
  const fetchFamilyMember = useCallback(async (memberId) => {
    if (!currentUser || !memberId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/family/members/${memberId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching family member ${memberId}:`, err);
      setError('Failed to fetch family member details. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Add a new family member
  const addFamilyMember = useCallback(async (memberData) => {
    if (!currentUser) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/family/members', memberData);
      setFamilyMembers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding family member:', err);
      setError('Failed to add family member. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update a family member
  const updateFamilyMember = useCallback(async (memberId, memberData) => {
    if (!currentUser || !memberId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/family/members/${memberId}`, memberData);
      
      setFamilyMembers(prev => 
        prev.map(member => 
          member._id === memberId ? response.data : member
        )
      );
      
      if (selectedMember && selectedMember._id === memberId) {
        setSelectedMember(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error updating family member ${memberId}:`, err);
      setError('Failed to update family member. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedMember]);

  // Delete a family member
  const deleteFamilyMember = useCallback(async (memberId) => {
    if (!currentUser || !memberId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/family/members/${memberId}`);
      
      setFamilyMembers(prev => 
        prev.filter(member => member._id !== memberId)
      );
      
      if (selectedMember && selectedMember._id === memberId) {
        setSelectedMember(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting family member ${memberId}:`, err);
      setError('Failed to delete family member. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedMember]);

  // Select a family member
  const selectFamilyMember = useCallback(async (memberId) => {
    if (!memberId) {
      setSelectedMember(null);
      return null;
    }
    
    // Check if the member is already in state
    const existingMember = familyMembers.find(m => m._id === memberId);
    
    if (existingMember) {
      setSelectedMember(existingMember);
      return existingMember;
    }
    
    // Fetch the member if not in state
    const member = await fetchFamilyMember(memberId);
    setSelectedMember(member);
    return member;
  }, [familyMembers, fetchFamilyMember]);

  // Build family tree structure
  const buildFamilyTree = useCallback((rootMemberId = null) => {
    if (!familyMembers.length) return null;
    
    // If no root is specified, find a member without parents
    let rootMember;
    
    if (rootMemberId) {
      rootMember = familyMembers.find(m => m._id === rootMemberId);
    } else {
      rootMember = familyMembers.find(m => !m.parents || m.parents.length === 0);
    }
    
    if (!rootMember) return null;
    
    // Recursive function to build the tree
    const buildTree = (member) => {
      const children = familyMembers.filter(m => 
        m.parents && m.parents.includes(member._id)
      );
      
      return {
        ...member,
        children: children.length > 0 ? children.map(buildTree) : []
      };
    };
    
    return buildTree(rootMember);
  }, [familyMembers]);

  // Mock data for development
  const getMockFamilyMembers = () => {
    return [
      {
        _id: '1',
        name: 'John Doe',
        gender: 'male',
        birthDate: '1970-05-15',
        deathDate: null,
        parents: [],
        spouses: ['2'],
        children: ['3', '4'],
        profileImage: null,
        contactInfo: {
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          address: '123 Main St, Anytown, USA'
        }
      },
      {
        _id: '2',
        name: 'Jane Doe',
        gender: 'female',
        birthDate: '1972-08-20',
        deathDate: null,
        parents: [],
        spouses: ['1'],
        children: ['3', '4'],
        profileImage: null,
        contactInfo: {
          email: 'jane.doe@example.com',
          phone: '123-456-7891',
          address: '123 Main St, Anytown, USA'
        }
      },
      {
        _id: '3',
        name: 'Michael Doe',
        gender: 'male',
        birthDate: '1995-03-10',
        deathDate: null,
        parents: ['1', '2'],
        spouses: [],
        children: [],
        profileImage: null,
        contactInfo: {
          email: 'michael.doe@example.com',
          phone: '123-456-7892',
          address: '456 Oak St, Anytown, USA'
        }
      },
      {
        _id: '4',
        name: 'Sarah Doe',
        gender: 'female',
        birthDate: '1998-11-25',
        deathDate: null,
        parents: ['1', '2'],
        spouses: [],
        children: [],
        profileImage: null,
        contactInfo: {
          email: 'sarah.doe@example.com',
          phone: '123-456-7893',
          address: '789 Pine St, Anytown, USA'
        }
      }
    ];
  };

  // Load family members when user changes
  useEffect(() => {
    if (currentUser) {
      fetchFamilyMembers();
    } else {
      setFamilyMembers([]);
      setSelectedMember(null);
    }
  }, [currentUser, fetchFamilyMembers]);

  const value = {
    familyMembers,
    selectedMember,
    loading,
    error,
    fetchFamilyMembers,
    fetchFamilyMember,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    selectFamilyMember,
    buildFamilyTree
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export default FamilyContext; 