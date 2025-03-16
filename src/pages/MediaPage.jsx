// File: src/pages/MediaPage.jsx
// Media page component

import React from 'react';
import { Link } from 'react-router-dom';
import { useFileStorage } from '../hooks/useFileStorage';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { formatFileSize } from '../utils/formatters';

const MediaPage = () => {
  const { files, loading } = useFileStorage();

  if (loading) {
    return <Loader text="Loading media files..." />;
  }

  return (
    <div className="media-page">
      {/* <div className="page-header">
        <h1>Family Media</h1>
        <p>Manage and share family photos, videos, and documents</p>
        <Link to="/media/upload">
          <Button variant="primary">Upload Media</Button>
        </Link>
      </div> */}

      <div className="media-content">
        {files && files.length > 0 ? (
          <div className="media-grid">
            {files.map(file => (
              <div key={file._id} className="media-card">
                <div className="media-preview">
                  {file.fileType.startsWith('image/') ? (
                    <img src={file.downloadUrl} alt={file.fileName} />
                  ) : (
                    <div className="file-icon">
                      {file.fileType.includes('pdf') ? '📄' : 
                       file.fileType.includes('video') ? '🎬' : 
                       file.fileType.includes('audio') ? '🎵' : '📁'}
                    </div>
                  )}
                </div>
                <div className="media-info">
                  <h3 className="media-title">{file.fileName}</h3>
                  <p className="media-meta">
                    {formatFileSize(file.fileSize)} • {file.fileType}
                  </p>
                </div>
                <div className="media-actions">
                  <Button variant="text" size="small">View</Button>
                  <Button variant="text" size="small">Download</Button>
                  <Button variant="text" size="small">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No Media Files Found</h2>
            <p>You haven't uploaded any media files yet.</p>
            <Link to="/media/upload">
              <Button variant="primary">Upload Your First Media</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage; 