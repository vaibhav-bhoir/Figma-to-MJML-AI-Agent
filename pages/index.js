/**
 * Main page component for the Figma to MJML AI Agent
 * Handles the complete user interface and workflow
 */

import Head from 'next/head';
import { useRef, useState } from 'react';
import ConversionResults from '../components/ConversionResults';
import UploadForm from '../components/UploadForm';

export default function Home() {
  const [conversionResult, setConversionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [litmusResults, setLitmusResults] = useState(null);
  const uploadFormRef = useRef(null);

  const handleConvert = async (type, data) => {
    setIsLoading(true);
    setError(null);
    setConversionResult(null);

    try {
      const endpoint = type === 'figma' ? '/api/convert-figma' : '/api/convert-image';
      
      const options = {
        method: 'POST',
      };

      if (type === 'figma') {
        options.headers = {
          'Content-Type': 'application/json',
        };
        options.body = JSON.stringify(data);
      } else {
        // For image upload, data is already FormData
        options.body = data;
      }

      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      setConversionResult(result);
      
      // Clear inputs after successful conversion
      if (uploadFormRef.current && uploadFormRef.current.clearInputs) {
        uploadFormRef.current.clearInputs();
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'An unexpected error occurred during conversion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToLitmus = async (html) => {
    try {
      setError(null);
      
      const response = await fetch('/api/send-to-litmus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-test',
          html: html,
          options: {
            subject: 'AI Generated Email Template Test',
            name: `Test - ${new Date().toLocaleString()}`,
            usePopularOnly: true
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email to Litmus');
      }

      // Start monitoring the test
      if (result.testId) {
        await monitorLitmusTest(result.testId);
      }

      alert('✅ Email sent to Litmus for testing! Check your Litmus dashboard for results.');
    } catch (err) {
      console.error('Litmus error:', err);
      setError(`Litmus Error: ${err.message}`);
    }
  };

  const monitorLitmusTest = async (testId) => {
    try {
      const response = await fetch('/api/send-to-litmus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'monitor-test',
          options: { 
            testId: testId,
            timeout: 60000, // 1 minute for demo
            interval: 5000   // Check every 5 seconds
          }
        }),
      });

      const result = await response.json();
      
      if (result.success && result.completed) {
        setLitmusResults(result.results);
      }
    } catch (err) {
      console.warn('Failed to monitor Litmus test:', err.message);
      // Don't show error to user as this is optional monitoring
    }
  };

  return (
    <div className="app-container">
      <Head>
        <title>Figma to MJML AI Agent - Convert Designs to Email Templates</title>
        <meta name="description" content="AI-powered tool to convert Figma designs and images to responsive MJML email templates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="app-title">
                <span className="logo-icon">🎨</span>
                Figma to MJML AI Agent
              </h1>
              <p className="app-subtitle">
                Convert Figma designs and images to responsive email templates using AI
              </p>
            </div>
            
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-text">AI-Powered</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📱</span>
                <span className="stat-text">Responsive</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <span className="stat-text">Email-Safe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">❌</span>
              <span className="error-message">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="error-dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <UploadForm ref={uploadFormRef} onConvert={handleConvert} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="loading-section">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h3>🤖 AI is working its magic...</h3>
              <p>Converting your design to a beautiful email template</p>
              <div className="loading-steps">
                <div className="step">📐 Analyzing layout structure</div>
                <div className="step">🧠 Generating MJML with AI</div>
                <div className="step">⚡ Compiling to HTML</div>
                <div className="step">✅ Optimizing for email clients</div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Results */}
        {conversionResult && (
          <ConversionResults 
            results={conversionResult} 
            onSendToLitmus={handleSendToLitmus}
          />
        )}

        {/* Litmus Results */}
        {litmusResults && (
          <div className="litmus-results">
            <h3>🚀 Litmus Test Results</h3>
            <div className="litmus-summary">
              <div className="summary-stat">
                <span className="stat-label">Total Platforms:</span>
                <span className="stat-value">{litmusResults.summary?.total || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{litmusResults.summary?.completed || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Failed:</span>
                <span className="stat-value">{litmusResults.summary?.failed || 0}</span>
              </div>
            </div>
            
            {litmusResults.results && litmusResults.results.length > 0 && (
              <div className="platform-results">
                {litmusResults.results.slice(0, 6).map((result, index) => (
                  <div key={index} className="platform-result">
                    <div className="platform-name">{result.platform}</div>
                    <div className={`platform-status ${result.status}`}>
                      {result.status}
                    </div>
                    {result.screenshot && (
                      <a href={result.screenshot} target="_blank" rel="noopener noreferrer">
                        View Screenshot
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How It Works Section */}
        {!conversionResult && !isLoading && (
          <section className="how-it-works">
            <h2>🛠️ How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>📤 Upload Source</h3>
                  <p>Upload a Figma file URL or an image (PNG/JPG) of your email design</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>🤖 AI Analysis</h3>
                  <p>Our AI analyzes the layout, extracts text, and identifies email components</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>⚡ MJML Generation</h3>
                  <p>AI generates clean, responsive MJML code optimized for email clients</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>📧 HTML Output</h3>
                  <p>Get production-ready HTML that works across all major email clients</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>🚀 Test & Deploy</h3>
                  <p>Test with Litmus integration and download your email template</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {!conversionResult && !isLoading && (
          <section className="features">
            <h2>✨ Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Figma Integration</h3>
                <p>Direct integration with Figma API to extract designs and assets</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🖼️</div>
                <h3>Image Recognition</h3>
                <p>Advanced OCR and computer vision to analyze uploaded images</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>AI-Powered</h3>
                <p>OpenAI GPT-4 intelligently converts layouts to semantic MJML</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>Generates mobile-first, responsive email templates</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3>Email Client Compatible</h3>
                <p>Optimized for Gmail, Outlook, Apple Mail, and more</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Litmus Testing</h3>
                <p>Built-in integration with Litmus for cross-client testing</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with ❤️ by VAIBHAV BHOIR using Next.js, OpenAI, MJML, and Litmus API
        </p>
        <p className="footer-note">
          This is a prototype demonstration of AI-powered email template generation
        </p>
      </footer>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .logo-section {
          text-align: center;
        }

        .app-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 15px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .logo-icon {
          font-size: 52px;
        }

        .app-subtitle {
          font-size: 18px;
          color: #6c757d;
          margin: 0;
          max-width: 600px;
        }

        .header-stats {
          display: flex;
          gap: 30px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 25px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .stat-icon {
          font-size: 20px;
        }

        .stat-text {
          font-weight: 600;
          color: #495057;
        }

        .error-banner {
          margin-bottom: 30px;
          animation: slideDown 0.3s ease-out;
        }

        .error-content {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 15px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-icon {
          font-size: 18px;
        }

        .error-message {
          flex: 1;
          font-weight: 500;
        }

        .error-dismiss {
          background: none;
          border: none;
          color: #721c24;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .error-dismiss:hover {
          background-color: rgba(114, 28, 36, 0.1);
        }

        .loading-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 50px 30px;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .loading-content h3 {
          font-size: 24px;
          color: #495057;
          margin: 20px 0 10px 0;
        }

        .loading-content p {
          color: #6c757d;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e9ecef;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .loading-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .step {
          padding: 8px 16px;
          background-color: #f8f9fa;
          border-radius: 20px;
          font-size: 14px;
          color: #495057;
          animation: pulse 2s ease-in-out infinite;
        }

        .litmus-results {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .litmus-results h3 {
          margin: 0 0 20px 0;
          color: #495057;
          font-size: 24px;
        }

        .litmus-summary {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          flex: 1;
          min-width: 120px;
        }

        .summary-stat .stat-label {
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .summary-stat .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #495057;
        }

        .platform-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .platform-result {
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          text-align: center;
        }

        .platform-name {
          font-weight: 500;
          margin-bottom: 8px;
          color: #495057;
        }

        .platform-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .platform-status.completed {
          background-color: #d4edda;
          color: #155724;
        }

        .platform-status.failed {
          background-color: #f8d7da;
          color: #721c24;
        }

        .platform-result a {
          color: #007bff;
          text-decoration: none;
          font-size: 12px;
        }

        .platform-result a:hover {
          text-decoration: underline;
        }

        .how-it-works, .features {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 40px 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .how-it-works h2, .features h2 {
          text-align: center;
          font-size: 32px;
          color: #495057;
          margin: 0 0 40px 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          padding: 25px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin: 0 auto 20px auto;
        }

        .step-content h3 {
          font-size: 18px;
          color: #495057;
          margin: 0 0 12px 0;
        }

        .step-content p {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .feature-card {
          padding: 30px 25px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid #e9ecef;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 20px;
          color: #495057;
          margin: 0 0 15px 0;
        }

        .feature-card p {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .app-footer {
          text-align: center;
          padding: 30px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
          margin-top: 20px;
        }

        .app-footer p {
          margin: 8px 0;
        }

        .footer-note {
          font-size: 14px;
          opacity: 0.8;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }

          .app-title {
            font-size: 32px;
            flex-direction: column;
            gap: 10px;
          }

          .logo-icon {
            font-size: 40px;
          }

          .app-subtitle {
            font-size: 16px;
          }

          .header-stats {
            gap: 15px;
          }

          .stat-item {
            padding: 8px 15px;
          }

          .how-it-works h2, .features h2 {
            font-size: 24px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .loading-content {
            padding: 30px 20px;
          }

          .litmus-summary {
            flex-direction: column;
          }

          .platform-results {
            grid-template-columns: 1fr;
          }
        }

        /* Fallback Warning Styles */
        .fallback-warning {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
          border: 1px solid #ffeaa7;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
        }

        .warning-content {
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .warning-icon {
          font-size: 24px;
          margin-top: 2px;
        }

        .warning-content div {
          flex: 1;
        }

        .warning-content strong {
          display: block;
          color: #856404;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .warning-content p {
          color: #856404;
          margin: 0 0 10px 0;
          font-size: 14px;
        }

        .warning-content a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
        }

        .warning-content a:hover {
          text-decoration: underline;
        }

        .fallback-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}