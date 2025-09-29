/**
 * Preview Iframe Component
 * Renders email HTML content in a sandboxed iframe with responsive controls
 */

import { useEffect, useRef, useState } from 'react';

export default function PreviewIframe({ html, title = "Email Preview" }) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (html && iframeRef.current) {
      setIsLoading(true);
      // Small delay to show loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [html]);

  const deviceSizes = {
    desktop: { width: '100%', height: '600px', label: '💻 Desktop' },
    tablet: { width: '768px', height: '600px', label: '📱 Tablet' },
    mobile: { width: '375px', height: '600px', label: '📱 Mobile' }
  };

  if (!html) {
    return (
      <div className="preview-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📄</div>
          <h3>No Preview Available</h3>
          <p>Convert a design first to see the email preview</p>
        </div>
        
        <style jsx>{`
          .preview-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 400px;
            background: #f8f9fa;
            border: 2px dashed #e9ecef;
            border-radius: 12px;
            margin: 1rem 0;
          }
          
          .placeholder-content {
            text-align: center;
            color: #6c757d;
          }
          
          .placeholder-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }
          
          .placeholder-content h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
          }
          
          .placeholder-content p {
            margin: 0;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  const currentDevice = deviceSizes[deviceMode];

  return (
    <div className="preview-container">
      {/* Device Controls */}
      <div className="preview-toolbar">
        <div className="device-selector">
          {Object.entries(deviceSizes).map(([mode, config]) => (
            <button
              key={mode}
              className={`device-btn ${
                deviceMode === mode ? 'active' : ''
              }`}
              onClick={() => setDeviceMode(mode)}
              title={`Switch to ${config.label}`}
            >
              {config.label}
            </button>
          ))}
        </div>
        
        <div className="preview-actions">
          <button
            className="action-btn"
            onClick={() => {
              if (iframeRef.current) {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(html);
                newWindow.document.close();
              }
            }}
            title="Open in New Tab"
          >
            🔗 Open in New Tab
          </button>
          
          <button
            className="action-btn"
            onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
              }
            }}
            title="Refresh Preview"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="preview-frame">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading preview...</p>
          </div>
        )}
        
        <div 
          className="iframe-container" 
          style={{ 
            width: currentDevice.width,
            height: currentDevice.height,
            opacity: isLoading ? 0 : 1
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title={title}
            className="preview-iframe"
            sandbox="allow-same-origin allow-scripts"
            loading="lazy"
          />
        </div>
      </div>

      <style jsx>{`
        .preview-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin: 1rem 0;
        }

        .preview-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .device-selector {
          display: flex;
          gap: 0.5rem;
        }

        .device-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .device-btn:hover {
          border-color: #0070f3;
          background: rgba(0, 112, 243, 0.05);
        }

        .device-btn.active {
          background: #0070f3;
          border-color: #0070f3;
          color: white;
        }

        .preview-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .action-btn:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .preview-frame {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 2rem;
          background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
                      linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
                      linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          min-height: 500px;
          overflow: auto;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          z-index: 10;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-overlay p {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }

        .iframe-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          transition: all 0.3s ease;
          max-width: 100%;
        }

        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .preview-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .device-selector {
            justify-content: center;
          }

          .preview-actions {
            justify-content: center;
          }

          .preview-frame {
            padding: 1rem;
          }

          .iframe-container {
            width: 100% !important;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}