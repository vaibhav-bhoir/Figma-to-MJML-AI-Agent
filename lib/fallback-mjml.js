/**
 * Fallback MJML Generation
 * Generates basic MJML templates when AI is not available
 */

/**
 * Generate a basic MJML template from layout data
 * @param {Object} layoutData - Processed layout information
 * @returns {string} Basic MJML template
 */
export function generateFallbackMJML(layoutData) {
  const { fileName, layouts } = layoutData;
  
  if (!layouts || layouts.length === 0) {
    return generateEmptyTemplate(fileName);
  }
  
  const primaryLayout = layouts[0];
  return generateLayoutBasedMJML(primaryLayout, fileName);
}

/**
 * Generate MJML from image analysis when AI is not available
 * @param {Object} metadata - Image metadata
 * @returns {string} Basic MJML template
 */
export function generateFallbackMJMLFromImage(metadata = {}) {
  const width = metadata.width || 600;
  const height = metadata.height || 400;
  
  return `<mjml>
  <mj-head>
    <mj-title>Email Template from Image</mj-title>
    <mj-preview>Generated email template from uploaded image</mj-preview>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="20px" />
    </mj-attributes>
    <mj-style inline="inline">
      .header { background-color: #f8f9fa; }
      .footer { background-color: #e9ecef; }
      @media only screen and (max-width: 480px) {
        .mobile-hide { display: none !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <!-- Header Section -->
    <mj-section css-class="header" padding="20px">
      <mj-column>
        <mj-text align="center" font-size="24px" font-weight="bold" color="#333333">
          Your Email Header
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Main Content Section -->
    <mj-section padding="20px">
      <mj-column>
        <mj-text font-size="16px" color="#333333">
          This email template was generated from your uploaded image (${width}×${height}px).
        </mj-text>
        
        <mj-spacer height="20px" />
        
        <mj-text>
          Please customize this template with your actual content:
        </mj-text>
        
        <mj-text>
          • Replace this text with your email content<br/>
          • Add images using &lt;mj-image&gt; components<br/>
          • Include call-to-action buttons<br/>
          • Customize colors and fonts
        </mj-text>
        
        <mj-spacer height="20px" />
        
        <mj-button background-color="#007bff" color="white" border-radius="5px">
          Call to Action
        </mj-button>
      </mj-column>
    </mj-section>
    
    <!-- Footer Section -->
    <mj-section css-class="footer" padding="20px">
      <mj-column>
        <mj-text align="center" font-size="12px" color="#666666">
          Generated with Figma to MJML AI Agent
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}

/**
 * Generate empty template when no data is available
 * @param {string} fileName - Optional file name
 * @returns {string} Empty MJML template
 */
function generateEmptyTemplate(fileName = 'Untitled') {
  return `<mjml>
  <mj-head>
    <mj-title>${fileName} - Email Template</mj-title>
    <mj-preview>Email template generated from ${fileName}</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Poppins', Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="20px" />
    </mj-attributes>
    <mj-style inline="inline">
      .primary-color { color: #007bff; }
      .secondary-color { color: #6c757d; }
      .bg-light { background-color: #f8f9fa; }
      @media only screen and (max-width: 480px) {
        .mobile-center { text-align: center !important; }
        .mobile-padding { padding: 10px !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <!-- Header -->
    <mj-section css-class="bg-light" padding="30px 20px">
      <mj-column>
        <mj-text align="center" font-size="28px" font-weight="600" css-class="primary-color">
          Welcome to Your Email
        </mj-text>
        <mj-text align="center" font-size="16px" css-class="secondary-color">
          This is a starter template ready for customization
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Main Content -->
    <mj-section padding="40px 20px">
      <mj-column>
        <mj-text font-size="18px" font-weight="500" color="#333333">
          Hello there! 👋
        </mj-text>
        
        <mj-spacer height="20px" />
        
        <mj-text>
          This email template was generated from your Figma design. Here's what you can do next:
        </mj-text>
        
        <mj-spacer height="15px" />
        
        <mj-text>
          <strong>✨ Customize Your Content:</strong><br/>
          Replace this placeholder text with your actual email content.
        </mj-text>
        
        <mj-spacer height="10px" />
        
        <mj-text>
          <strong>🎨 Update Colors & Fonts:</strong><br/>
          Modify the styles to match your brand guidelines.
        </mj-text>
        
        <mj-spacer height="10px" />
        
        <mj-text>
          <strong>📸 Add Images:</strong><br/>
          Include your brand assets and product images.
        </mj-text>
        
        <mj-spacer height="30px" />
        
        <mj-button background-color="#007bff" color="white" border-radius="6px" font-weight="500" font-size="16px" padding="12px 30px">
          Get Started
        </mj-button>
      </mj-column>
    </mj-section>
    
    <!-- Features Section -->
    <mj-section background-color="#f8f9fa" padding="40px 20px">
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="500" color="#333333">
          📱 Mobile Responsive
        </mj-text>
        <mj-text font-size="14px" color="#666666">
          Looks great on all devices and email clients.
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="500" color="#333333">
          ⚡ Fast & Reliable
        </mj-text>
        <mj-text font-size="14px" color="#666666">
          Optimized for quick loading and high deliverability.
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Footer -->
    <mj-section padding="30px 20px">
      <mj-column>
        <mj-divider border-color="#e9ecef" />
        
        <mj-spacer height="20px" />
        
        <mj-text align="center" font-size="12px" color="#999999">
          Generated with ❤️ by Figma to MJML AI Agent<br/>
          Need full AI features? Add your OpenAI API key to enable smart conversion.
        </mj-text>
        
        <mj-spacer height="10px" />
        
        <mj-text align="center" font-size="12px" color="#999999">
          <a href="#" style="color: #007bff; text-decoration: none;">Unsubscribe</a> |
          <a href="#" style="color: #007bff; text-decoration: none;">Privacy Policy</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}

/**
 * Generate MJML based on layout structure
 * @param {Object} layout - Layout information
 * @param {string} fileName - File name
 * @returns {string} Layout-based MJML template
 */
function generateLayoutBasedMJML(layout, fileName) {
  const { name, width, height, elements, backgroundColor } = layout;
  
  let mjml = `<mjml>
  <mj-head>
    <mj-title>${fileName} - ${name}</mj-title>
    <mj-preview>Email template generated from ${name}</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Poppins', Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="${backgroundColor || '#ffffff'}" padding="20px" />
    </mj-attributes>
    <mj-style inline="inline">
      .frame-width { max-width: ${Math.min(width, 600)}px; }
      @media only screen and (max-width: 480px) {
        .mobile-center { text-align: center !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body>`;
  
  // Add main section
  mjml += `\n    <mj-section css-class="frame-width" padding="20px">`;
  mjml += `\n      <mj-column>`;
  
  // Process elements
  if (elements && elements.length > 0) {
    mjml += generateElementsFromLayout(elements);
  } else {
    // Fallback content
    mjml += `\n        <mj-text font-size="18px" font-weight="500">`;
    mjml += `\n          Content from ${name}`;
    mjml += `\n        </mj-text>`;
    mjml += `\n        <mj-spacer height="20px" />`;
    mjml += `\n        <mj-text>`;
    mjml += `\n          This section was generated from your Figma frame "${name}" (${width}×${height}px).`;
    mjml += `\n          Please customize this template with your actual content.`;
    mjml += `\n        </mj-text>`;
  }
  
  mjml += `\n      </mj-column>`;
  mjml += `\n    </mj-section>`;
  mjml += `\n  </mj-body>`;
  mjml += `\n</mjml>`;
  
  return mjml;
}

/**
 * Generate MJML elements from layout elements
 * @param {Array} elements - Layout elements
 * @returns {string} MJML elements
 */
function generateElementsFromLayout(elements) {
  let mjmlElements = '';
  
  // Sort elements by position (top to bottom)
  const sortedElements = elements
    .filter(el => el.visible !== false)
    .sort((a, b) => {
      if (!a.bounds || !b.bounds) return 0;
      return a.bounds.y - b.bounds.y;
    });
  
  sortedElements.forEach((element, index) => {
    switch (element.type) {
      case 'TEXT':
        mjmlElements += generateTextElement(element);
        break;
      case 'RECTANGLE':
      case 'FRAME':
        if (element.hasImage) {
          mjmlElements += generateImageElement(element);
        } else {
          mjmlElements += generateBoxElement(element);
        }
        break;
      default:
        // Generic element
        mjmlElements += `\n        <mj-text font-size="14px" color="#666666">`;
        mjmlElements += `\n          [${element.type}: ${element.name}]`;
        mjmlElements += `\n        </mj-text>`;
    }
    
    // Add spacing between elements
    if (index < sortedElements.length - 1) {
      mjmlElements += `\n        <mj-spacer height="15px" />`;
    }
  });
  
  return mjmlElements;
}

/**
 * Generate MJML text element
 * @param {Object} element - Text element
 * @returns {string} MJML text component
 */
function generateTextElement(element) {
  const fontSize = element.fontSize || 14;
  const color = element.textColor || '#333333';
  const fontWeight = element.fontWeight > 500 ? 'bold' : 'normal';
  
  return `\n        <mj-text font-size="${fontSize}px" color="${color}" font-weight="${fontWeight}">`+
         `\n          ${element.text || 'Text content'}`+
         `\n        </mj-text>`;
}

/**
 * Generate MJML image element
 * @param {Object} element - Image element
 * @returns {string} MJML image component
 */
function generateImageElement(element) {
  const width = element.bounds ? `${element.bounds.width}px` : '100%';
  const alt = `Image: ${element.name || 'Untitled'}`;
  
  return `\n        <mj-image width="${width}" alt="${alt}" src="https://via.placeholder.com/${element.bounds?.width || 600}x${element.bounds?.height || 300}/f8f9fa/333333?text=Image+Placeholder" />`;
}

/**
 * Generate MJML box/container element
 * @param {Object} element - Box element
 * @returns {string} MJML spacer or divider component
 */
function generateBoxElement(element) {
  const bgColor = element.backgroundColor || 'transparent';
  const height = element.bounds?.height || 50;
  
  if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
    // Create a colored divider using mj-divider
    return `\n        <mj-divider border-color="${bgColor}" border-width="${Math.max(height, 2)}px" padding="5px 0" />`;
  }
  
  return `\n        <mj-spacer height="${height}px" />`;
}