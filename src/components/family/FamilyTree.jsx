// File: src/components/family/FamilyTree.jsx
// Family tree visualization component

import React, { useEffect, useState } from 'react';
import { useFamily } from '../../hooks/useFamily';
import FamilyMember from './FamilyMember';
import Loader from '../common/Loader';
import { buildFamilyTree } from '../../utils/treeHelpers';

const FamilyTree = () => {
  const { familyTree, loading } = useFamily();
  const [treeData, setTreeData] = useState(null);
  const [rootMemberId, setRootMemberId] = useState(null);

  useEffect(() => {
    if (familyTree && familyTree.members && familyTree.members.length > 0) {
      const hierarchicalTree = buildFamilyTree(familyTree.members, rootMemberId);
      setTreeData(hierarchicalTree);
    }
  }, [familyTree, rootMemberId]);

  if (loading) {
    return <Loader text="Loading family tree..." />;
  }

  if (!familyTree || !familyTree.members || familyTree.members.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Family Tree Found</h2>
        <p>You haven't created a family tree yet. Start by adding yourself as the first member.</p>
      </div>
    );
  }

  const handleMemberSelect = (memberId) => {
    setRootMemberId(memberId);
  };

  return (
    <div className="family-tree-container">
      <div className="family-tree-controls">
        <button 
          className="btn btn-outline"
          onClick={() => setRootMemberId(null)}
          disabled={!rootMemberId}
        >
          Reset View
        </button>
      </div>
      
      <div className="family-tree-visualization">
        {treeData ? (
          <div className="tree-wrapper">
            <FamilyMember 
              member={treeData} 
              isRoot={true} 
              onSelect={handleMemberSelect}
            />
          </div>
        ) : (
          <div className="empty-state">
            <p>Unable to visualize family tree. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree; 