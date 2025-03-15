// File: src/utils/treeHelpers.js
// Helper functions for building and manipulating family trees

/**
 * Builds a hierarchical tree structure from flat family member data
 * @param {Array} members - Array of family members
 * @param {String} rootId - Optional ID of the root member (if not provided, will find members without parents)
 * @returns {Object} - Hierarchical tree structure for visualization
 */
export const buildFamilyTree = (members, rootId = null) => {
  console.log('Building family tree with members:', members);
  
  if (!members || members.length === 0) {
    console.log('No members provided to buildFamilyTree');
    return null;
  }

  // Create a map of members by ID for quick lookup
  const membersMap = {};
  members.forEach(member => {
    // Handle both string IDs and MongoDB ObjectIds
    const memberId = member.id || member._id;
    
    membersMap[memberId] = {
      ...member,
      id: memberId, // Ensure id is set
      children: []
    };
  });
  
  console.log('Members map created:', Object.keys(membersMap));

  // Find the root member(s)
  let rootMembers = [];
  if (rootId) {
    // If rootId is provided, use that as the root
    if (membersMap[rootId]) {
      rootMembers = [membersMap[rootId]];
    }
  } else {
    // Otherwise, find members without parents
    rootMembers = members
      .filter(member => {
        // Check for parentId in various formats
        const parentId = member.parentId || (member.parent && member.parent._id);
        return !parentId;
      })
      .map(member => membersMap[member.id || member._id]);
  }
  
  console.log('Root members found:', rootMembers.length);

  // If no root members found, use the first member as root
  if (rootMembers.length === 0 && members.length > 0) {
    console.log('No root members found, using first member as root');
    const firstMemberId = members[0].id || members[0]._id;
    rootMembers = [membersMap[firstMemberId]];
  }

  // Build the tree by connecting children to parents
  members.forEach(member => {
    const memberId = member.id || member._id;
    const parentId = member.parentId || (member.parent && member.parent._id);
    
    if (parentId && membersMap[parentId]) {
      membersMap[parentId].children.push(membersMap[memberId]);
    }
  });
  
  console.log('Tree structure built');

  // Format the tree for visualization
  const formatNode = (node) => {
    // Extract first and last name from the name field if needed
    let firstName = node.firstName || '';
    let lastName = node.lastName || '';
    
    if (!firstName && !lastName && node.name) {
      const nameParts = node.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    return {
      id: node.id || node._id,
      name: node.name || `${firstName} ${lastName}`.trim(),
      attributes: {
        firstName,
        lastName,
        gender: node.gender,
        dateOfBirth: node.birthDate || node.dateOfBirth,
        dateOfDeath: node.deathDate || node.dateOfDeath,
        isAlive: node.isAlive !== undefined ? node.isAlive : true,
        location: node.location,
        occupation: node.occupation,
        bio: node.bio || node.notes,
        photoURL: node.photoURL || node.profilePicture,
        contactInfo: node.contactInfo || {}
      },
      children: node.children.map(child => formatNode(child))
    };
  };

  // Return the formatted tree
  const result = rootMembers.length > 0 ? formatNode(rootMembers[0]) : null;
  console.log('Final tree structure:', result);
  return result;
};

/**
 * Finds a node in the tree by ID
 * @param {Object} tree - The tree to search
 * @param {String} id - The ID to find
 * @returns {Object|null} - The found node or null
 */
export const findNodeById = (tree, id) => {
  if (!tree) return null;
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  
  return null;
};

/**
 * Gets the path from the root to a node
 * @param {Object} tree - The tree to search
 * @param {String} id - The ID to find
 * @returns {Array} - Array of nodes from root to the target node
 */
export const getPathToNode = (tree, id) => {
  if (!tree) return [];
  
  if (tree.id === id) return [tree];
  
  if (tree.children) {
    for (const child of tree.children) {
      const path = getPathToNode(child, id);
      if (path.length > 0) {
        return [tree, ...path];
      }
    }
  }
  
  return [];
};

/**
 * Calculates the relationship between two members
 * @param {Object} tree - The family tree
 * @param {String} member1Id - ID of the first member
 * @param {String} member2Id - ID of the second member
 * @returns {String} - Description of the relationship
 */
export const calculateRelationship = (tree, member1Id, member2Id) => {
  // This is a simplified implementation
  // A more comprehensive implementation would consider various relationship types
  
  const path1 = getPathToNode(tree, member1Id);
  const path2 = getPathToNode(tree, member2Id);
  
  if (path1.length === 0 || path2.length === 0) {
    return 'Unknown';
  }
  
  // Find the common ancestor
  let commonAncestorIndex = 0;
  const minLength = Math.min(path1.length, path2.length);
  
  while (commonAncestorIndex < minLength && path1[commonAncestorIndex].id === path2[commonAncestorIndex].id) {
    commonAncestorIndex++;
  }
  
  if (commonAncestorIndex === 0) {
    return 'Not related';
  }
  
  const distance1 = path1.length - commonAncestorIndex;
  const distance2 = path2.length - commonAncestorIndex;
  
  if (distance1 === 0 && distance2 === 1) {
    return 'Parent';
  } else if (distance1 === 1 && distance2 === 0) {
    return 'Child';
  } else if (distance1 === 1 && distance2 === 1) {
    return 'Sibling';
  } else {
    return `Related (${distance1} steps up, ${distance2} steps down)`;
  }
};

export default {
  buildFamilyTree,
  findNodeById,
  getPathToNode,
  calculateRelationship
}; 