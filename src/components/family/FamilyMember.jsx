// File: src/components/family/FamilyMember.jsx
// Family member component for displaying individual members in the tree

import React, { useState } from 'react';
import { calculateAge } from '../../utils/formatters';

const FamilyMember = ({ member, isRoot = false, onSelect }) => {
  const [expanded, setExpanded] = useState(isRoot);
  
  if (!member) return null;
  
  const hasChildren = member.children && member.children.length > 0;
  
  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(member._id);
    }
  };
  
  // Determine gender-based styling
  const genderClass = member.gender === 'female' ? 'member-female' : 'member-male';
  
  return (
    <div className={`family-member-container ${isRoot ? 'root-member' : ''}`}>
      <div 
        className={`family-member ${genderClass} ${isRoot ? 'root' : ''}`}
        onClick={handleSelect}
      >
        <div className="member-avatar">
          {member.profileImage ? (
            <img src={member.profileImage} alt={member.firstName} />
          ) : (
            <div className="avatar-placeholder">
              {member.firstName ? member.firstName.charAt(0) : '?'}
              {member.lastName ? member.lastName.charAt(0) : ''}
            </div>
          )}
        </div>
        <div className="member-info">
          <h3 className="member-name">
            {member.firstName} {member.lastName}
          </h3>
          <div className="member-details">
            {member.birthDate && (
              <span className="member-age">
                {calculateAge(member.birthDate)} years
              </span>
            )}
            {member.relationship && (
              <span className="member-relationship">
                {member.relationship}
              </span>
            )}
          </div>
        </div>
        {hasChildren && (
          <button 
            className="toggle-children"
            onClick={handleToggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div className="member-children">
          {member.children.map(child => (
            <FamilyMember 
              key={child._id} 
              member={child} 
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyMember; 