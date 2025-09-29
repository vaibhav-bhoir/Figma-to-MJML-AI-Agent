/**
 * MJML Processing Library
 * Handles MJML compilation, validation, and optimization
 */

import mjml from 'mjml';
import { validateAndCorrectMJML } from './mjml-validator.js';

/**
 * Compile MJML to HTML
 * @param {string} mjmlCode - MJML source code
 * @param {Object} options - Compilation options
 * @returns {Object} Compilation result with HTML and errors
 */
export function compileMJML(mjmlCode, options = {}) {
  try {
    // Default options
    const defaultOptions = {
      keepComments: false,
      beautify: true,
      minify: false,
      validationLevel: 'soft', // 'strict', 'soft', or 'skip'
      fonts: {
        'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
        'Ubuntu': 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
        'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
      },
      ...options
    };

    // Validate and correct MJML before compilation
    const validation = validateAndCorrectMJML(mjmlCode);
    const correctedMjml = validation.correctedMjml;
    
    // Compile MJML
    const result = mjml(correctedMjml, defaultOptions);

    return {
      success: true,
      html: result.html,
      errors: result.errors || [],
      warnings: [...(result.warnings || []), ...(validation.warnings || [])],
      correctedMjml: validation.isValid ? null : correctedMjml,
      validationApplied: !validation.isValid
    };
    
  } catch (error) {
    return {
      success: false,
      html: null,
      errors: [{
        line: 0,
        message: error.message,
        tagName: 'compilation'
      }],
      warnings: []
    };
  }
}

/**
 * Validate MJML code
 * @param {string} mjmlCode - MJML source code
 * @returns {Object} Validation result
 */
export function validateMJML(mjmlCode) {
  try {
    const result = mjml(mjmlCode, { validationLevel: 'strict' });
    
    return {
      isValid: result.errors.length === 0,
      errors: result.errors || [],
      warnings: result.warnings || []
    };
    
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        line: 0,
        message: error.message,
        tagName: 'validation'
      }],
      warnings: []
    };
  }
}

/**
 * Optimize MJML code for better email client compatibility
 * @param {string} mjmlCode - MJML source code
 * @returns {string} Optimized MJML code
 */
export function optimizeMJML(mjmlCode) {
  let optimized = mjmlCode;
  
  // Add common optimizations
  optimized = addEmailClientFixes(optimized);
  optimized = optimizeImages(optimized);
  optimized = addFallbackStyles(optimized);
  
  return optimized;
}

/**
 * Add email client specific fixes
 * @param {string} mjmlCode - MJML source code
 * @returns {string} Fixed MJML code
 */
function addEmailClientFixes(mjmlCode) {
  let fixed = mjmlCode;
  
  // Ensure proper head section
  if (!fixed.includes('<mj-head>')) {
    const headSection = `
  <mj-head>
    <mj-title>Email Template</mj-title>
    <mj-preview></mj-preview>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="0" />
    </mj-attributes>
    <mj-style inline="inline">
      .link-nostyle { color: inherit; text-decoration: none; }
      @media only screen and (max-width: 480px) {
        .mobile-hide { display: none !important; }
        .mobile-center { text-align: center !important; }
      }
    </mj-style>
  </mj-head>`;
    
    fixed = fixed.replace('<mj-body>', headSection + '\n  <mj-body>');
  }
  
  return fixed;
}

/**
 * Optimize image attributes for email
 * @param {string} mjmlCode - MJML source code
 * @returns {string} Optimized MJML code
 */
function optimizeImages(mjmlCode) {
  // Add alt text to images without it
  let optimized = mjmlCode.replace(
    /<mj-image([^>]*?)(?!.*alt=)([^>]*?)>/g,
    '<mj-image$1 alt=""$2>'
  );
  
  // Add width attributes to images for better compatibility
  optimized = optimized.replace(
    /<mj-image(?![^>]*width=)([^>]*?)>/g,
    '<mj-image width="600px"$1>'
  );
  
  return optimized;
}

/**
 * Add fallback styles for better compatibility
 * @param {string} mjmlCode - MJML source code
 * @returns {string} MJML with fallback styles
 */
function addFallbackStyles(mjmlCode) {
  // This would add VML fallbacks for Outlook, background image fallbacks, etc.
  // For now, we'll just ensure basic compatibility
  
  let enhanced = mjmlCode;
  
  // Add table-layout:fixed for Outlook
  if (enhanced.includes('<mj-style')) {
    enhanced = enhanced.replace(
      '<mj-style inline="inline">',
      '<mj-style inline="inline">\n      table { table-layout: fixed; }\n      .outlook-group-fix { width: 100%; }'
    );
  }
  
  return enhanced;
}

/**
 * Extract inline CSS from MJML compilation
 * @param {string} html - Compiled HTML
 * @returns {string} Extracted CSS
 */
export function extractCSS(html) {
  const styleMatch = html.match(/<style type="text\/css">([\s\S]*?)<\/style>/);
  return styleMatch ? styleMatch[1] : '';
}

/**
 * Generate preview text from MJML
 * @param {string} mjmlCode - MJML source code
 * @returns {string} Preview text
 */
export function generatePreviewText(mjmlCode) {
  // Extract text content for preview
  const textMatches = mjmlCode.match(/<mj-text[^>]*>([\s\S]*?)<\/mj-text>/g);
  
  if (!textMatches) return '';
  
  const textContent = textMatches
    .map(match => {
      // Remove HTML tags and get text content
      const content = match.replace(/<mj-text[^>]*>/, '').replace(/<\/mj-text>/, '');
      return content.replace(/<[^>]*>/g, '').trim();
    })
    .filter(text => text.length > 0)
    .join(' ');
  
  // Limit to 150 characters for preview
  return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
}

/**
 * Get MJML statistics
 * @param {string} mjmlCode - MJML source code
 * @returns {Object} Statistics about the MJML
 */
export function getMJMLStats(mjmlCode) {
  const stats = {
    components: {},
    totalComponents: 0,
    hasImages: false,
    hasButtons: false,
    estimatedSize: 0
  };
  
  // Count components
  const componentMatches = mjmlCode.match(/<mj-[a-z-]+/g);
  if (componentMatches) {
    componentMatches.forEach(component => {
      const name = component.replace('<mj-', '');
      stats.components[name] = (stats.components[name] || 0) + 1;
      stats.totalComponents++;
    });
  }
  
  // Check for specific features
  stats.hasImages = mjmlCode.includes('<mj-image');
  stats.hasButtons = mjmlCode.includes('<mj-button');
  
  // Estimate size
  stats.estimatedSize = mjmlCode.length;
  
  return stats;
}