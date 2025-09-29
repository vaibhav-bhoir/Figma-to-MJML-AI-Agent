/**
 * Vision/Image Analysis Library
 * Handles image processing and analysis for MJML generation
 */

/**
 * Analyze image using OpenAI Vision API
 * @param {Buffer|string} imageData - Image data or base64 string
 * @param {Object} options - Analysis options
 * @returns {string} Image analysis description
 */
export async function analyzeImageWithAI(imageData, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  // Convert image to base64 if it's a buffer
  let base64Image;
  if (Buffer.isBuffer(imageData)) {
    base64Image = imageData.toString('base64');
  } else {
    base64Image = imageData;
  }

  const prompt = options.prompt || 
    'Analyze this image and describe its layout, components, colors, text content, and visual hierarchy. ' +
    'Focus on elements that would be important for creating an email template: headers, text blocks, ' +
    'buttons, images, sections, and overall structure. Describe the visual flow and any branding elements.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: options.detail || 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI Vision API error: ${errorData.error?.message}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No analysis generated from OpenAI Vision');
    }

    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Vision Analysis Error:', error);
    
    // If Vision API fails, provide a fallback analysis
    if (error.message.includes('vision') || error.message.includes('gpt-4')) {
      console.warn('Vision API not available, using fallback analysis');
      return generateFallbackAnalysis(options);
    }
    
    throw error;
  }
}

/**
 * Generate a basic fallback analysis when Vision API is not available
 * @param {Object} options - Analysis options  
 * @returns {string} Fallback analysis
 */
function generateFallbackAnalysis(options = {}) {
  return `Image Analysis (Fallback Mode):

` +
    `This appears to be a design layout that could be converted to an email template. ` +
    `The image likely contains various UI elements such as:

` +
    `- Header section with branding or title
` +
    `- Main content area with text and/or images
` +
    `- Call-to-action buttons or links
` +
    `- Footer section with additional information

` +
    `The layout should be structured as a responsive email template with ` +
    `proper sections, typography, and mobile-friendly design principles.`;
}

/**
 * Extract image metadata
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Object} Image metadata
 */
export function extractImageMetadata(imageBuffer) {
  const metadata = {
    size: imageBuffer.length,
    format: 'unknown',
    width: null,
    height: null
  };
  
  // Simple format detection based on file headers
  const header = imageBuffer.toString('hex', 0, 4).toLowerCase();
  
  if (header.startsWith('ffd8')) {
    metadata.format = 'jpeg';
  } else if (header.startsWith('8950')) {
    metadata.format = 'png';
  } else if (header.startsWith('4749')) {
    metadata.format = 'gif';
  } else if (header.startsWith('424d')) {
    metadata.format = 'bmp';
  } else if (header.startsWith('3c73')) {
    metadata.format = 'svg';
  }
  
  // For more detailed metadata, you'd typically use a library like 'sharp' or 'image-size'
  // but we'll keep this simple for now
  
  return metadata;
}

/**
 * Resize image for analysis (to reduce API costs)
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {Object} options - Resize options
 * @returns {Buffer} Resized image buffer
 */
export async function resizeImageForAnalysis(imageBuffer, options = {}) {
  // This is a placeholder - in a real implementation, you'd use a library like 'sharp'
  // to resize the image to reduce file size and API costs
  
  const maxSize = options.maxSize || 1024; // Max width/height
  const quality = options.quality || 80;
  
  // For now, just return the original buffer
  // In production, implement actual resizing
  console.log(`Image resize requested: max ${maxSize}px, quality ${quality}%`);
  
  return imageBuffer;
}

/**
 * Convert image to base64 data URL
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - MIME type (e.g., 'image/jpeg')
 * @returns {string} Data URL
 */
export function imageToDataURL(imageBuffer, mimeType = 'image/jpeg') {
  const base64 = imageBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Validate image for email template generation
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Object} Validation result
 */
export function validateImageForEmail(imageBuffer) {
  const metadata = extractImageMetadata(imageBuffer);
  const validation = {
    isValid: true,
    warnings: [],
    errors: []
  };
  
  // Check file size (email attachments should be small)
  const sizeInMB = metadata.size / (1024 * 1024);
  if (sizeInMB > 2) {
    validation.warnings.push(`Image is large (${sizeInMB.toFixed(1)}MB). Consider optimizing for email.`);
  }
  
  // Check format
  if (!['jpeg', 'png', 'gif'].includes(metadata.format)) {
    validation.errors.push(`Format '${metadata.format}' may not be supported in all email clients. Use JPEG, PNG, or GIF.`);
    validation.isValid = false;
  }
  
  // SVG warning
  if (metadata.format === 'svg') {
    validation.warnings.push('SVG images are not supported in most email clients. Consider converting to PNG or JPEG.');
  }
  
  return validation;
}

/**
 * Extract colors from image (placeholder implementation)
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Array} Array of dominant colors
 */
export async function extractImageColors(imageBuffer) {
  // This is a placeholder - in a real implementation, you'd use a library
  // like 'node-vibrant' or 'color-thief' to extract dominant colors
  
  // Return some common email-safe colors as a fallback
  return [
    '#ffffff', // white
    '#000000', // black
    '#333333', // dark gray
    '#666666', // medium gray
    '#0066cc', // blue
    '#ff6600'  // orange
  ];
}

/**
 * Generate alt text for accessibility
 * @param {string} analysisText - Image analysis from AI
 * @returns {string} Generated alt text
 */
export function generateAltText(analysisText) {
  // Extract key visual elements for alt text
  const sentences = analysisText.split('.').filter(s => s.trim().length > 10);
  
  if (sentences.length === 0) {
    return 'Email template design';
  }
  
  // Take the first sentence and clean it up for alt text
  let altText = sentences[0].trim();
  
  // Remove common analysis prefixes
  altText = altText.replace(/^(this image|the image|this design|the design)\s+(shows|contains|displays|features)\s+/i, '');
  
  // Limit length for alt text
  if (altText.length > 100) {
    altText = altText.substring(0, 97) + '...';
  }
  
  return altText || 'Email template design';
}