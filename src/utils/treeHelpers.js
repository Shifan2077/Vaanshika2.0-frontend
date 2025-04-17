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
  
  // Special case: If there's only one member, it's the root
  if (members.length === 1) {
    console.log('Only one member found, treating as root:', members[0]);
    const singleMember = members[0];
    
    // Format the single member for visualization
    return formatSingleMember(singleMember);
  }
  
  // Create a map of members by ID for quick lookup
  const membersMap = {};
  members.forEach(member => {
    // Handle both string IDs and MongoDB ObjectIds
    const memberId = member.id || member._id;
    
    membersMap[memberId] = {
      ...member,
      id: memberId, // Ensure id is set
      children: [], // Initialize empty children array for building the tree
      processedChildren: false // Flag to track if we've processed this member's children
    };
  });
  
  console.log('Members map created with', Object.keys(membersMap).length, 'members');

  // Process relationships from the API response
  members.forEach(member => {
    const memberId = member.id || member._id;
    
    // Skip if this member doesn't exist in our map (shouldn't happen)
    if (!membersMap[memberId]) {
      console.log(`Member ${memberId} not found in members map`);
      return;
    }
    
    // Process children array if it exists
    if (member.children && member.children.length > 0) {
      console.log(`Processing ${member.children.length} children for member ${memberId}`);
      
      member.children.forEach(childId => {
        // Make sure the child exists in our members map
        if (membersMap[childId]) {
          // Add child to parent's children array if not already there
          if (!membersMap[memberId].children.includes(childId)) {
            membersMap[memberId].children.push(childId);
          }
          
          // Set parentId on child if not already set
          if (!membersMap[childId].parentId) {
            membersMap[childId].parentId = memberId;
          }
          
          console.log(`Added child ${childId} to parent ${memberId}`);
        } else {
          console.log(`Child ${childId} not found in members map`);
        }
      });
      
      // Mark this member's children as processed
      membersMap[memberId].processedChildren = true;
    }
    
    // Process parents array if it exists
    if (member.parents && member.parents.length > 0) {
      console.log(`Processing ${member.parents.length} parents for member ${memberId}`);
      
      member.parents.forEach(parentId => {
        // Make sure the parent exists in our members map
        if (membersMap[parentId]) {
          // Add child to parent's children array if not already there and not already processed
          if (!membersMap[parentId].processedChildren && !membersMap[parentId].children.includes(memberId)) {
            membersMap[parentId].children.push(memberId);
            console.log(`Added child ${memberId} to parent ${parentId} from parents array`);
          }
        } else {
          console.log(`Parent ${parentId} not found in members map`);
        }
      });
    }
  });
  
  // Create family units for spouses/partners
  const familyUnits = {};
  const processedSpouses = new Set();
  
  // First pass: identify all partner relationships and create family units
  members.forEach(member => {
    const memberId = member.id || member._id;
    
    // Skip if already processed as a spouse
    if (processedSpouses.has(memberId)) {
      return;
    }
    
    // Check if this member has partners
    if (member.spouses && member.spouses.length > 0) {
      // Create a family unit for this member and their partners
      const familyUnitId = `family_unit_${memberId}`;
      
      if (!familyUnits[familyUnitId]) {
        familyUnits[familyUnitId] = {
          id: familyUnitId,
          name: 'Family Unit',
          type: 'familyUnit',
          spouses: [memberId],
          children: []
        };
        
        // Add all partners to the family unit
        member.spouses.forEach(spouseId => {
          if (membersMap[spouseId]) {
            familyUnits[familyUnitId].spouses.push(spouseId);
            processedSpouses.add(spouseId);
          }
        });
        
        // Mark the primary member as processed
        processedSpouses.add(memberId);
        
        console.log(`Created family unit ${familyUnitId} for member ${memberId} with partners:`, member.spouses);
      }
    }
  });
  
  // Second pass: check for spouse relationships that might not be in the spouses array
  members.forEach(member => {
    const memberId = member.id || member._id;
    
    // Skip if already processed as a spouse
    if (processedSpouses.has(memberId)) {
      return;
    }
    
    // Check if this member has a spouse relationship type
    const isSpouseRelationship = 
      member.relationshipType === 'spouse' || 
      member.relationshipType === 'husband' || 
      member.relationshipType === 'wife' || 
      member.relationshipType === 'partner';
    
    if (isSpouseRelationship && member.spouseId && membersMap[member.spouseId]) {
      const spouseId = member.spouseId;
      
      // Check if spouse is already in a family unit
      let existingUnitId = null;
      for (const unitId in familyUnits) {
        if (familyUnits[unitId].spouses.includes(spouseId)) {
          existingUnitId = unitId;
          break;
        }
      }
      
      if (existingUnitId) {
        // Add this member to the existing family unit
        if (!familyUnits[existingUnitId].spouses.includes(memberId)) {
          familyUnits[existingUnitId].spouses.push(memberId);
          processedSpouses.add(memberId);
        }
      } else {
        // Create a new family unit for this spouse relationship
        const familyUnitId = `family_unit_${memberId}_${spouseId}`;
        
        familyUnits[familyUnitId] = {
          id: familyUnitId,
          name: 'Family Unit',
          type: 'familyUnit',
          spouses: [memberId, spouseId],
          children: []
        };
        
        // Mark both members as processed
        processedSpouses.add(memberId);
        processedSpouses.add(spouseId);
        
        console.log(`Created family unit ${familyUnitId} for spouse relationship between ${memberId} and ${spouseId}`);
      }
    }
  });
  
  // Third pass: assign children to family units or parents
  members.forEach(member => {
    const memberId = member.id || member._id;
    const parentId = member.parentId;
    
    if (!parentId) return;
    
    // Check if parent is part of a family unit
    let assignedToFamilyUnit = false;
    for (const unitId in familyUnits) {
      if (familyUnits[unitId].spouses.includes(parentId)) {
        // Add child to family unit
        if (!familyUnits[unitId].children.includes(memberId)) {
          familyUnits[unitId].children.push(memberId);
          assignedToFamilyUnit = true;
          console.log(`Assigned child ${memberId} to family unit ${unitId}`);
        }
        break;
      }
    }
    
    // If not assigned to a family unit, add directly to parent
    if (!assignedToFamilyUnit && membersMap[parentId]) {
      if (!membersMap[parentId].children.includes(memberId)) {
        membersMap[parentId].children.push(memberId);
        console.log(`Assigned child ${memberId} directly to parent ${parentId}`);
      }
    }
  });

  // Fourth pass: process the children arrays in each member
  members.forEach(member => {
    const memberId = member.id || member._id;
    
    if (member.children && member.children.length > 0) {
      member.children.forEach(childId => {
        if (membersMap[childId]) {
          // Check if child is already in a family unit
          let isInFamilyUnit = false;
          for (const unitId in familyUnits) {
            if (familyUnits[unitId].children.includes(childId)) {
              isInFamilyUnit = true;
              break;
            }
          }
          
          // Check if parent is in a family unit
          let parentInFamilyUnit = false;
          let parentFamilyUnitId = null;
          for (const unitId in familyUnits) {
            if (familyUnits[unitId].spouses.includes(memberId)) {
              parentInFamilyUnit = true;
              parentFamilyUnitId = unitId;
              break;
            }
          }
          
          // If parent is in a family unit, add child to that unit
          if (parentInFamilyUnit && !isInFamilyUnit) {
            if (!familyUnits[parentFamilyUnitId].children.includes(childId)) {
              familyUnits[parentFamilyUnitId].children.push(childId);
              console.log(`Added child ${childId} to parent's family unit ${parentFamilyUnitId}`);
            }
          }
        }
      });
    }
  });
  
  // Find root members (those without parents or with parents not in the members list)
  let rootMembers = [];
  
  // If a specific root ID is provided, use that
  if (rootId && membersMap[rootId]) {
    console.log(`Using specified root member: ${rootId}`);
    rootMembers = [membersMap[rootId]];
  } else {
    // Find members without parents
    rootMembers = Object.values(membersMap).filter(member => {
      // Check if member has no parent or parent is not in our members list
      const hasNoParent = !member.parentId || !membersMap[member.parentId];
      
      // Check if member is not a child in any family unit
      let isNotChildInFamilyUnit = true;
      for (const unitId in familyUnits) {
        if (familyUnits[unitId].children.includes(member.id)) {
          isNotChildInFamilyUnit = false;
          break;
        }
      }
      
      return hasNoParent && isNotChildInFamilyUnit;
    });
  }
  
  console.log('Root members found:', rootMembers.length);

  // If no root members found, use the first member as root
  if (rootMembers.length === 0 && members.length > 0) {
    console.log('No root members found, using first member as root');
    const firstMemberId = members[0].id || members[0]._id;
    
    // Check if first member is part of a family unit
    let foundInFamilyUnit = false;
    for (const unitId in familyUnits) {
      if (familyUnits[unitId].spouses.includes(firstMemberId)) {
        rootMembers = [createFamilyUnitNode(familyUnits[unitId], membersMap)];
        foundInFamilyUnit = true;
        break;
      }
    }
    
    // If not in a family unit, use the member directly
    if (!foundInFamilyUnit) {
      rootMembers = [membersMap[firstMemberId]];
    }
  }

  // Convert family units to nodes and add them to root members if they contain root members
  for (const unitId in familyUnits) {
    const unit = familyUnits[unitId];
    let containsRootMember = false;
    
    // Check if any spouse in this unit is a root member
    for (const spouseId of unit.spouses) {
      if (rootMembers.some(member => member.id === spouseId)) {
        containsRootMember = true;
        // Remove the individual root member as they'll be part of the family unit
        rootMembers = rootMembers.filter(member => member.id !== spouseId);
      }
    }
    
    if (containsRootMember) {
      // Add the family unit as a root node
      rootMembers.push(createFamilyUnitNode(unit, membersMap));
    }
  }

  // Build the tree by connecting children to parents or family units
  const processedNodes = new Set();
  
  // Process family units first
  Object.values(familyUnits).forEach(unit => {
    // For each child in the family unit
    unit.children.forEach(childId => {
      if (membersMap[childId]) {
        // Find the family unit node in root members
        const familyUnitNode = findFamilyUnitNode(rootMembers, unit.id);
        if (familyUnitNode) {
          // Initialize children array if it doesn't exist
          if (!familyUnitNode.children) {
            familyUnitNode.children = [];
          }
          
          // Add the child to the family unit's children
          if (!familyUnitNode.children.some(child => child.id === childId)) {
            familyUnitNode.children.push(membersMap[childId]);
            processedNodes.add(childId);
          }
        }
      }
    });
  });
  
  // Process individual members
  Object.values(membersMap).forEach(member => {
    if (member.children && member.children.length > 0) {
      member.children.forEach(childId => {
        // Skip if already processed or not in members map
        if (processedNodes.has(childId) || !membersMap[childId]) {
          return;
        }
        
        // Initialize children array if it doesn't exist
        if (!member.children) {
          member.children = [];
        }
        
        // Add child to parent's children array
        if (!member.children.some(child => child.id === childId)) {
          member.children.push(membersMap[childId]);
          processedNodes.add(childId);
        }
      });
    }
  });

  // Format the tree for visualization
  const formatNode = (node) => {
    // Handle family unit nodes differently
    if (node.type === 'familyUnit') {
      return {
        id: node.id,
        name: node.name,
        type: 'familyUnit',
        attributes: {
          type: 'familyUnit',
          spouses: node.spouses.map(spouseId => {
            const spouse = membersMap[spouseId];
            if (!spouse) return null;
            return {
              id: spouse.id,
              firstName: spouse.firstName || '',
              lastName: spouse.lastName || '',
              gender: spouse.gender,
              photoURL: spouse.photoURL || spouse.profilePicture,
              dateOfBirth: spouse.birthDate || spouse.dateOfBirth,
              dateOfDeath: spouse.deathDate || spouse.dateOfDeath,
              isAlive: spouse.isAlive !== undefined ? spouse.isAlive : true,
              location: spouse.location,
              occupation: spouse.occupation,
              bio: spouse.bio || spouse.notes,
              contactInfo: spouse.contactInfo || {}
            };
          }).filter(Boolean)
        },
        children: node.children && node.children.length > 0 ? 
          node.children.map(child => {
            // Check if child is an ID or an object
            const childNode = typeof child === 'string' ? membersMap[child] : child;
            return childNode ? formatNode(childNode) : null;
          }).filter(Boolean) : []
      };
    }
    
    // Extract first and last name from the name field if needed
    let firstName = node.firstName || '';
    let lastName = node.lastName || '';
    
    if (!firstName && !lastName && node.name) {
      const nameParts = node.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Format the node for visualization
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
        contactInfo: node.contactInfo || {},
        spouseId: node.spouseId,
        relationshipType: node.relationshipType,
      },
      children: node.children && node.children.length > 0 ? 
        node.children.map(child => {
          // Check if child is an ID or an object
          const childNode = typeof child === 'string' ? membersMap[child] : child;
          return childNode ? formatNode(childNode) : null;
        }).filter(Boolean) : []
    };
  };
  
  // If we have multiple root members, create a virtual root
  let formattedTree;
  if (rootMembers.length > 1) {
    formattedTree = {
      id: 'virtual_root',
      name: 'Family',
      attributes: {
        virtual: true
      },
      children: rootMembers.map(node => formatNode(node)).filter(Boolean)
    };
  } else if (rootMembers.length === 1) {
    formattedTree = formatNode(rootMembers[0]);
  } else {
    console.log('No root members found, returning null');
    return null;
  }
  
  console.log('Formatted tree:', formattedTree);
  return formattedTree;
};

/**
 * Creates a family unit node from a family unit object
 * @param {Object} unit - The family unit object
 * @param {Object} membersMap - Map of all members by ID
 * @returns {Object} - The family unit node
 */
const createFamilyUnitNode = (unit, membersMap) => {
  return {
    id: unit.id,
    name: unit.name,
    type: 'familyUnit',
    spouses: unit.spouses,
    children: unit.children.map(childId => membersMap[childId]).filter(Boolean)
  };
};

/**
 * Finds a family unit node in the tree by ID
 * @param {Array} nodes - The nodes to search
 * @param {String} unitId - The family unit ID to find
 * @returns {Object|null} - The found family unit node or null
 */
const findFamilyUnitNode = (nodes, unitId) => {
  for (const node of nodes) {
    if (node.id === unitId) {
      return node;
    }
    
    // Check children recursively
    if (node.children && node.children.length > 0) {
      const found = findFamilyUnitNode(node.children, unitId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
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

/**
 * Format a single member for visualization (used when there's only one member in the tree)
 * @param {Object} member - The member to format
 * @returns {Object} - Formatted member for visualization
 */
const formatSingleMember = (member) => {
  // Extract first and last name from the name field if needed
  let firstName = member.firstName || '';
  let lastName = member.lastName || '';
  
  if (!firstName && !lastName && member.name) {
    const nameParts = member.name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  
  // Format the node for visualization
  return {
    id: member.id || member._id,
    name: member.name || `${firstName} ${lastName}`.trim(),
    attributes: {
      firstName,
      lastName,
      gender: member.gender,
      dateOfBirth: member.birthDate || member.dateOfBirth,
      dateOfDeath: member.deathDate || member.dateOfDeath,
      isAlive: member.isAlive !== undefined ? member.isAlive : true,
      location: member.location,
      occupation: member.occupation,
      bio: member.bio || member.notes,
      photoURL: member.photoURL || member.profilePicture,
      contactInfo: member.contactInfo || {},
      spouseId: member.spouseId,
      relationshipType: member.relationshipType,
    },
    children: []
  };
};

export default {
  buildFamilyTree,
  findNodeById,
  getPathToNode,
  calculateRelationship
}; 