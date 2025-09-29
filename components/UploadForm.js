/**
 * Upload Form Component
 * Handles both Figma URL input and image file uploads
 */

import { forwardRef, useImperativeHandle, useState } from 'react';

const UploadForm = forwardRef(({ onConvert, isLoading }, ref) => {
  const [activeTab, setActiveTab] = useState('figma');
  const [figmaInput, setFigmaInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  // Expose clearInputs method to parent component
  useImperativeHandle(ref, () => ({
    clearInputs: () => {
      setFigmaInput('');
      setImageFile(null);
      setDragOver(false);
    }
  }));
  
  // Extract file ID from Figma URL
  const extractFigmaId = (url) => {
    if (!url) return '';
    
    // If it's already just an ID (no URL), return as is
    if (url.length < 50 && !url.includes('/')) return url;
    
    // Extract from various Figma URL formats
    const patterns = [
      /figma\.com\/design\/([^\/\?]+)/,
      /figma\.com\/file\/([^\/\?]+)/,
      /figma\.com\/proto\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return url;
  };

  const handleFigmaSubmit = (e) => {
    e.preventDefault();
    const fileId = extractFigmaId(figmaInput.trim());
    if (fileId) {
      onConvert('figma', { fileId: fileId });
    }
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', file);
      
      onConvert('image', formData);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  return (
    <div className="upload-section">
      {/* Tab Navigation */}
      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'figma' ? 'active' : ''}`}
          onClick={() => setActiveTab('figma')}
          disabled={isLoading}
        >
          📋 Figma File
        </button>
        <button 
          className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
          disabled={isLoading}
        >
          🖼️ Image Upload
        </button>
      </div>

      {/* Figma Tab */}
      {activeTab === 'figma' && (
        <div className="tab-content">
          <form onSubmit={handleFigmaSubmit}>
            <div className="input-group">
              <label htmlFor="figma-input">
                Figma File URL or ID *
              </label>
              <input
                id="figma-input"
                type="text"
                value={figmaInput}
                onChange={(e) => setFigmaInput(e.target.value)}
                placeholder="https://www.figma.com/design/... or just the file ID"
                disabled={isLoading}
                required
              />
              <small className="help-text">
                Paste your Figma share URL or just the file ID
              </small>
            </div>
            
            <button 
              type="submit" 
              className="convert-btn"
              disabled={isLoading || !figmaInput.trim()}
            >
              {isLoading ? '🤖 Converting...' : '🚀 Convert to MJML'}
            </button>
          </form>
        </div>
      )}

      {/* Image Tab */}
      {activeTab === 'image' && (
        <div className="tab-content">
          <div 
            className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            
            <div className="drop-content">
              <div className="drop-icon">📁</div>
              <h3>Drop your image here</h3>
              <p>or <label htmlFor="image-input" className="file-link">browse files</label></p>
              <small>Supports PNG, JPG, SVG files</small>
            </div>
            
            {imageFile && (
              <div className="file-selected">
                <span className="file-name">📎 {imageFile.name}</span>
                <button 
                  onClick={() => setImageFile(null)}
                  className="remove-file"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .upload-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .tab-nav {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .tab-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.2s ease;
        }

        .tab-btn:hover:not(:disabled) {
          background: #e9ecef;
          color: #495057;
        }

        .tab-btn.active {
          background: white;
          color: #0070f3;
          border-bottom: 2px solid #0070f3;
        }

        .tab-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tab-content {
          padding: 2rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .input-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
        }

        .input-group input:disabled {
          background: #f8f9fa;
          opacity: 0.7;
        }

        .help-text {
          display: block;
          margin-top: 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .convert-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #0070f3, #0051cc);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .convert-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
        }

        .convert-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .file-drop-zone {
          border: 2px dashed #e9ecef;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .file-drop-zone:hover,
        .file-drop-zone.drag-over {
          border-color: #0070f3;
          background: rgba(0, 112, 243, 0.05);
        }

        .drop-content {
          pointer-events: none;
        }

        .drop-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .drop-content h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .drop-content p {
          margin: 0 0 0.5rem 0;
          color: #6c757d;
        }

        .file-link {
          color: #0070f3;
          text-decoration: underline;
          cursor: pointer;
          pointer-events: all;
        }

        .file-link:hover {
          color: #0051cc;
        }

        .file-selected {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-name {
          color: #333;
          font-weight: 500;
        }

        .remove-file {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .remove-file:hover:not(:disabled) {
          background: #c82333;
        }

        .remove-file:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
});

UploadForm.displayName = 'UploadForm';

export default UploadForm;
