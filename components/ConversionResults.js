/**
 * Conversion Results Component
 * Displays the converted MJML code, HTML preview, and export options
 */

import { useState } from 'react';
import PreviewIframe from './PreviewIframe';

export default function ConversionResults({ results, onSendToLitmus }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  if (!results) return null;

  const { mjml, html, success, error, metadata, usedFallback } = results;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyFeedback(type);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!success) {
    return (
      <div className="results-section error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h3>Conversion Failed</h3>
          <p>{error || 'An unknown error occurred during conversion.'}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section">
      {/* Fallback Warning */}
      {usedFallback && (
        <div className="fallback-warning">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>Fallback Mode Used</strong>
              <p>AI conversion unavailable. Generated basic template structure. Add OpenAI credits for full AI features.</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="results-header">
        <h2>🎉 Conversion Complete!</h2>
        {metadata && (
          <div className="metadata">
            <span>📏 {metadata.width || 'Unknown'}×{metadata.height || 'Unknown'}px</span>
            {metadata.frameCount && <span>🖼️ {metadata.frameCount} frames</span>}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mjml' ? 'active' : ''}`}
          onClick={() => setActiveTab('mjml')}
        >
          📄 MJML Code
        </button>
        <button 
          className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
          onClick={() => setActiveTab('html')}
        >
          🌐 HTML Code
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="preview-tab-content">
            <div className="litmus-toolbar">
              <button 
                onClick={() => onSendToLitmus && onSendToLitmus(html)}
                className="litmus-btn"
                title="Test in Multiple Email Clients"
              >
                🧪 Test in Litmus
              </button>
            </div>
            <PreviewIframe html={html} title="Email Template Preview" />
          </div>
        )}

        {/* MJML Code Tab */}
        {activeTab === 'mjml' && (
          <div className="code-container">
            <div className="code-toolbar">
              <button 
                onClick={() => copyToClipboard(mjml, 'mjml')}
                className="copy-btn"
              >
                {showCopyFeedback === 'mjml' ? '✅ Copied!' : '📋 Copy MJML'}
              </button>
              <button 
                onClick={() => downloadFile(mjml, 'email-template.mjml', 'text/plain')}
                className="download-btn"
              >
                💾 Download MJML
              </button>
            </div>
            <pre className="code-block">
              <code>{mjml}</code>
            </pre>
          </div>
        )}

        {/* HTML Code Tab */}
        {activeTab === 'html' && (
          <div className="code-container">
            <div className="code-toolbar">
              <button 
                onClick={() => copyToClipboard(html, 'html')}
                className="copy-btn"
              >
                {showCopyFeedback === 'html' ? '✅ Copied!' : '📋 Copy HTML'}
              </button>
              <button 
                onClick={() => downloadFile(html, 'email-template.html', 'text/html')}
                className="download-btn"
              >
                💾 Download HTML
              </button>
            </div>
            <pre className="code-block">
              <code>{html}</code>
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .results-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .results-section.error {
          border: 2px solid #dc3545;
        }

        .fallback-warning {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border-bottom: 1px solid #f1c40f;
          padding: 1rem 2rem;
        }

        .warning-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .warning-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .warning-text strong {
          display: block;
          color: #856404;
          margin-bottom: 0.25rem;
        }

        .warning-text p {
          margin: 0;
          color: #856404;
          font-size: 0.9rem;
        }

        .error-content {
          text-align: center;
          padding: 3rem 2rem;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-content h3 {
          margin: 0 0 1rem 0;
          color: #dc3545;
        }

        .error-content p {
          margin: 0 0 2rem 0;
          color: #6c757d;
        }

        .retry-btn {
          padding: 0.75rem 1.5rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .retry-btn:hover {
          background: #c82333;
        }

        .results-header {
          padding: 2rem;
          border-bottom: 1px solid #e9ecef;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .results-header h2 {
          margin: 0 0 0.5rem 0;
          color: #28a745;
        }

        .metadata {
          display: flex;
          gap: 1rem;
          color: #6c757d;
          font-size: 0.9rem;
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

        .tab-btn:hover {
          background: #e9ecef;
          color: #495057;
        }

        .tab-btn.active {
          background: white;
          color: #0070f3;
          border-bottom: 2px solid #0070f3;
        }

        .tab-content {
          min-height: 400px;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          height: 600px;
        }

        .preview-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .device-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .device-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }

        .device-btn.active {
          background: #0070f3;
          border-color: #0070f3;
          color: white;
        }

        .device-btn:hover:not(.active) {
          background: #f8f9fa;
        }

        .preview-tab-content {
          padding: 0;
        }

        .litmus-toolbar {
          display: flex;
          justify-content: flex-end;
          padding: 1rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .litmus-btn {
          padding: 0.5rem 1rem;
          background: #17a2b8;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .litmus-btn:hover {
          background: #138496;
        }

        .preview-frame {
          flex: 1;
          padding: 1rem;
          background: #f8f9fa;
        }

        .email-iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .code-container {
          display: flex;
          flex-direction: column;
          height: 600px;
        }

        .code-toolbar {
          display: flex;
          gap: 1rem;
          padding: 1rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .copy-btn,
        .download-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .copy-btn:hover {
          background: #28a745;
          border-color: #28a745;
          color: white;
        }

        .download-btn:hover {
          background: #0070f3;
          border-color: #0070f3;
          color: white;
        }

        .code-block {
          flex: 1;
          margin: 0;
          padding: 2rem;
          background: #f8f9fa;
          overflow: auto;
          font-family: 'Courier New', Monaco, monospace;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .code-block code {
          color: #333;
        }
      `}</style>
    </div>
  );
}
