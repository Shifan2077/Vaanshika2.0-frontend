// File: src/utils/treeHelpers.js
// Helper functions for building and manipulating family trees

// Build a hierarchical tree structure from flat member data
export const buildFamilyTree = (members, rootMemberId = null) => {
  if (!members || members.length === 0) return null;
  
  // Create a map of members by ID for quick lookup
  const membersMap = {};
  members.forEach(member => {
    membersMap[member._id] = {
      ...member,
      children: []
    };
  });
  
  // Find the root member
  let rootMember;
  
  if (rootMemberId) {
    // If a specific root is requested, use that
    rootMember = membersMap[rootMemberId];
  } else {
    // Otherwise, find the oldest generation member
    // Sort by generation (ascending) and then by age (descending)
    const sortedMembers = [...members].sort((a, b) => {
      if (a.generation !== b.generation) {
        return a.generation - b.generation;
      }
      
      // If same generation, older members come first
      const aDate = a.birthDate ? new Date(a.birthDate) : new Date();
      const bDate = b.birthDate ? new Date(b.birthDate) : new Date();
      return aDate - bDate;
    });
    
    rootMember = membersMap[sortedMembers[0]._id];
  }
  
  if (!rootMember) return null;
  
  // Build the tree structure
  members.forEach(member => {
    if (member.parents && member.parents.length > 0) {
      // Add this member as a child to each parent
      member.parents.forEach(parentId => {
        if (membersMap[parentId]) {
          membersMap[parentId].children.push(membersMap[member._id]);
        }
      });
    }
  });
  
  // Sort children by birth date
  Object.values(membersMap).forEach(member => {
    if (member.children.length > 0) {
      member.children.sort((a, b) => {
        const aDate = a.birthDate ? new Date(a.birthDate) : new Date();
        const bDate = b.birthDate ? new Date(b.birthDate) : new Date();
        return aDate - bDate;
      });
    }
  });
  
  return rootMember;
};

// Find a member in the tree by ID
export const findMemberInTree = (tree, memberId) => {
  if (!tree) return null;
  if (tree._id === memberId) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findMemberInTree(child, memberId);
      if (found) return found;
    }
  }
  
  return null;
};

// Get all ancestors of a member
export const getAncestors = (members, memberId) => {
  if (!members || !memberId) return [];
  
  const member = members.find(m => m._id === memberId);
  if (!member || !member.parents || member.parents.length === 0) return [];
  
  const ancestors = [];
  const queue = [...member.parents];
  
  while (queue.length > 0) {
    const parentId = queue.shift();
    const parent = members.find(m => m._id === parentId);
    
    if (parent) {
      ancestors.push(parent);
      
      if (parent.parents && parent.parents.length > 0) {
        queue.push(...parent.parents);
      }
    }
  }
  
  return ancestors;
};

// Get all descendants of a member
export const getDescendants = (members, memberId) => {
  if (!members || !memberId) return [];
  
  const descendants = [];
  const children = members.filter(m => m.parents && m.parents.includes(memberId));
  
  if (children.length === 0) return [];
  
  descendants.push(...children);
  
  children.forEach(child => {
    const childDescendants = getDescendants(members, child._id);
    descendants.push(...childDescendants);
  });
  
  return descendants;
};

// Calculate the relationship between two members
export const calculateRelationship = (members, member1Id, member2Id) => {
  if (!members || members.length === 0 || !member1Id || !member2Id) {
    return 'Unknown';
  }
  
  if (member1Id === member2Id) {
    return 'Self';
  }
  
  const membersMap = {};
  members.forEach(member => {
    membersMap[member._id] = member;
  });
  
  const member1 = membersMap[member1Id];
  const member2 = membersMap[member2Id];
  
  if (!member1 || !member2) {
    return 'Unknown';
  }
  
  // Check if member2 is a parent of member1
  if (member1.parents && member1.parents.includes(member2Id)) {
    return member2.gender === 'male' ? 'Father' : 'Mother';
  }
  
  // Check if member1 is a parent of member2
  if (member2.parents && member2.parents.includes(member1Id)) {
    return member1.gender === 'male' ? 'Child' : 'Child';
  }
  
  // Check if they are siblings (share at least one parent)
  if (member1.parents && member2.parents) {
    const commonParents = member1.parents.filter(parentId => 
      member2.parents.includes(parentId)
    );
    
    if (commonParents.length > 0) {
      return 'Sibling';
    }
  }
  
  // More complex relationships would require traversing the tree
  return 'Relative';
};

// Find the common ancestor of two members
export const findCommonAncestor = (members, member1Id, member2Id) => {
  if (!members || members.length === 0 || !member1Id || !member2Id) {
    return null;
  }
  
  const membersMap = {};
  members.forEach(member => {
    membersMap[member._id] = member;
  });
  
  const member1 = membersMap[member1Id];
  const member2 = membersMap[member2Id];
  
  if (!member1 || !member2) {
    return null;
  }
  
  // Get all ancestors of member1
  const member1Ancestors = new Set();
  const queue1 = [...(member1.parents || [])];
  
  while (queue1.length > 0) {
    const parentId = queue1.shift();
    member1Ancestors.add(parentId);
    
    const parent = membersMap[parentId];
    if (parent && parent.parents) {
      queue1.push(...parent.parents);
    }
  }
  
  // Check if member2 or any of its ancestors is in member1's ancestors
  if (member1Ancestors.has(member2Id)) {
    return member2;
  }
  
  const queue2 = [...(member2.parents || [])];
  while (queue2.length > 0) {
    const parentId = queue2.shift();
    
    if (member1Ancestors.has(parentId)) {
      return membersMap[parentId];
    }
    
    const parent = membersMap[parentId];
    if (parent && parent.parents) {
      queue2.push(...parent.parents);
    }
  }
  
  return null;
}; 