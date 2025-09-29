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
  const fileName = metadata.fileName || 'uploaded image';
  
  return `<mjml>
  <mj-head>
    <mj-title>Email Template from ${fileName}</mj-title>
    <mj-preview>AI-generated email template from your uploaded image</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Poppins', Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="20px" />
    </mj-attributes>
    <mj-style inline="inline">
      .header { background-color: #007bff; }
      .content { background-color: #ffffff; }
      .footer { background-color: #f8f9fa; }
      .highlight { background-color: #e3f2fd; border-radius: 8px; }
      @media only screen and (max-width: 480px) {
        .mobile-center { text-align: center !important; }
        .mobile-padding { padding: 15px !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <!-- Header Section -->
    <mj-section css-class="header" padding="30px 20px">
      <mj-column>
        <mj-text align="center" font-size="28px" font-weight="600" color="white">
          📧 Your Email Template
        </mj-text>
        <mj-text align="center" font-size="16px" color="#e3f2fd" padding-top="10px">
          Generated from your image design
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Main Content Section -->
    <mj-section css-class="content" padding="40px 20px">
      <mj-column>
        <mj-text font-size="18px" font-weight="500" color="#333333">
          🎯 Template Ready for Customization
        </mj-text>
        
        <mj-spacer height="20px" />
        
        <mj-text css-class="highlight" padding="15px">
          <strong>📊 Source Image:</strong> ${fileName} (${width}×${height}px)<br/>
          <strong>🤖 AI Status:</strong> Fallback mode - OpenAI quota exceeded<br/>
          <strong>⚡ Generated:</strong> ${new Date().toLocaleDateString()}
        </mj-text>
        
        <mj-spacer height="30px" />
        
        <mj-text font-size="16px">
          <strong>🚀 Next Steps:</strong>
        </mj-text>
        
        <mj-spacer height="15px" />
        
        <mj-text>
          <strong>✏️ Customize Content:</strong><br/>
          Replace this template text with your actual email message and branding.
        </mj-text>
        
        <mj-spacer height="10px" />
        
        <mj-text>
          <strong>🎨 Update Design:</strong><br/>
          Modify colors, fonts, and layout to match your brand guidelines.
        </mj-text>
        
        <mj-spacer height="10px" />
        
        <mj-text>
          <strong>📸 Add Images:</strong><br/>
          Include your actual product images, logos, and visual assets.
        </mj-text>
        
        <mj-spacer height="30px" />
        
        <mj-button background-color="#007bff" color="white" border-radius="8px" font-weight="500" font-size="16px" padding="15px 30px">
          🎯 Start Customizing
        </mj-button>
        
        <mj-spacer height="20px" />
        
        <mj-text align="center" font-size="12px" color="#666666">
          💡 <strong>Tip:</strong> Add OpenAI credits for AI-powered smart conversion
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Features Section -->
    <mj-section background-color="#f8f9fa" padding="30px 20px">
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="500" color="#333333">
          📱 Mobile Responsive
        </mj-text>
        <mj-text font-size="14px" color="#666666">
          Optimized for all devices and email clients.
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="500" color="#333333">
          ⚡ Ready to Use
        </mj-text>
        <mj-text font-size="14px" color="#666666">
          Copy the MJML code and start customizing immediately.
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Footer Section -->
    <mj-section css-class="footer" padding="20px">
      <mj-column>
        <mj-divider border-color="#dee2e6" />
        
        <mj-spacer height="15px" />
        
        <mj-text align="center" font-size="12px" color="#999999">
          Generated with ❤️ by <strong>Figma to MJML AI Agent</strong><br/>
          Transform your designs into responsive email templates
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
  
  // Always add header content
  mjml += `\n        <mj-text align="center" font-size="24px" font-weight="600" color="#333333">`;
  mjml += `\n          ${name || 'Email Template'}`;
  mjml += `\n        </mj-text>`;
  mjml += `\n        <mj-spacer height="20px" />`;
  
  // Process elements if available
  if (elements && elements.length > 0) {
    mjml += generateElementsFromLayout(elements);
    mjml += `\n        <mj-spacer height="30px" />`;
  }
  
  // Always add meaningful content
  mjml += `\n        <mj-text font-size="16px" color="#333333">`;
  mjml += `\n          This email template was generated from your Figma design "${name}" (${width}×${height}px).`;
  mjml += `\n        </mj-text>`;
  mjml += `\n        <mj-spacer height="20px" />`;
  
  mjml += `\n        <mj-text>`;
  mjml += `\n          <strong>✨ Ready to customize:</strong><br/>`;
  mjml += `\n          • Replace this text with your email content<br/>`;
  mjml += `\n          • Add your brand colors and images<br/>`;
  mjml += `\n          • Include call-to-action buttons<br/>`;
  mjml += `\n          • Test across email clients`;
  mjml += `\n        </mj-text>`;
  mjml += `\n        <mj-spacer height="30px" />`;
  
  mjml += `\n        <mj-button background-color="#007bff" color="white" border-radius="6px" font-weight="500" padding="12px 24px">`;
  mjml += `\n          Get Started`;
  mjml += `\n        </mj-button>`;
  
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
 * @returns {string} MJML components representing the box element
 */
function generateBoxElement(element) {
  const bgColor = element.backgroundColor || 'transparent';
  const height = element.bounds?.height || 50;
  const width = element.bounds?.width || 300;
  let mjmlContent = '';
  
  // Add a descriptive text for the element
  if (element.name && element.name !== 'Rectangle') {
    mjmlContent += `\n        <mj-text font-size="14px" color="#666666" font-style="italic">`;
    mjmlContent += `\n          📦 Design Element: ${element.name}`;
    mjmlContent += `\n        </mj-text>`;
    mjmlContent += `\n        <mj-spacer height="10px" />`;
  }
  
  if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
    // Create a colored section with content
    mjmlContent += `\n        <mj-text background-color="${bgColor}" color="${getContrastColor(bgColor)}" padding="15px" font-size="14px">`;
    mjmlContent += `\n          🎨 Colored section from your design (${width}×${height}px)`;
    mjmlContent += `\n        </mj-text>`;
  } else {
    // Add spacing with a note
    mjmlContent += `\n        <mj-text font-size="12px" color="#999999" padding="10px 0">`;
    mjmlContent += `\n          ⬜ Layout spacing (${height}px)`;
    mjmlContent += `\n        </mj-text>`;
  }
  
  return mjmlContent;
}

/**
 * Get contrasting text color for backgrounds
 * @param {string} bgColor - Background color
 * @returns {string} Contrasting text color
 */
function getContrastColor(bgColor) {
  // Simple contrast logic - for dark colors use white, for light colors use dark
  if (bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('#000')) {
    return 'white';
  }
  return '#333333';
}