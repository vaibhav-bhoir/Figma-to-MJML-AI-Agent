/**
 * Figma API Integration Library
 * Handles fetching and processing Figma design files
 */

/**
 * Fetch Figma file data
 * @param {string} fileId - Figma file ID
 * @param {string} token - Figma API token
 * @returns {Object} Figma file data
 */
export async function fetchFigmaFile(fileId, token) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: {
      'X-Figma-Token': token,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Figma API error: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Fetch images from Figma file
 * @param {string} fileId - Figma file ID  
 * @param {Array} nodeIds - Array of node IDs to get images for
 * @param {string} token - Figma API token
 * @param {string} format - Image format (png, jpg, svg, pdf)
 * @returns {Object} Image URLs
 */
export async function fetchFigmaImages(fileId, nodeIds, token, format = 'png') {
  const nodeIdsString = nodeIds.join(',');
  const response = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${nodeIdsString}&format=${format}&scale=2`,
    {
      headers: {
        'X-Figma-Token': token,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Figma Images API error: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Extract layout information from Figma data
 * @param {Object} figmaData - Raw Figma file data
 * @returns {Object} Processed layout information
 */
export function extractLayoutFromFigma(figmaData) {
  const layouts = [];
  
  // Process each page
  figmaData.document.children.forEach(page => {
    if (!page.children) return;
    
    // Process frames in the page
    page.children.forEach(frame => {
      if (frame.type !== 'FRAME') return;
      
      // Skip frames that are too small (likely components or thumbnails)
      if (!frame.absoluteBoundingBox || 
          frame.absoluteBoundingBox.width < 200 || 
          frame.absoluteBoundingBox.height < 200) {
        return;
      }
      
      const layout = {
        id: frame.id,
        name: frame.name,
        page: page.name,
        width: Math.round(frame.absoluteBoundingBox.width),
        height: Math.round(frame.absoluteBoundingBox.height),
        x: Math.round(frame.absoluteBoundingBox.x),
        y: Math.round(frame.absoluteBoundingBox.y),
        backgroundColor: extractColor(frame.backgroundColor),
        elements: extractElements(frame.children || []),
        styles: extractStyles(frame)
      };
      
      layouts.push(layout);
    });
  });
  
  return {
    fileName: figmaData.name,
    lastModified: figmaData.lastModified,
    layouts: layouts.sort((a, b) => {
      // Sort by page name, then by position
      if (a.page !== b.page) return a.page.localeCompare(b.page);
      return a.y - b.y || a.x - b.x;
    })
  };
}

/**
 * Extract elements from Figma frame children
 * @param {Array} children - Figma frame children
 * @returns {Array} Processed elements
 */
function extractElements(children) {
  const elements = [];
  
  children.forEach(child => {
    const element = {
      id: child.id,
      name: child.name,
      type: child.type,
      visible: child.visible !== false
    };
    
    // Add bounding box if available
    if (child.absoluteBoundingBox) {
      element.bounds = {
        x: Math.round(child.absoluteBoundingBox.x),
        y: Math.round(child.absoluteBoundingBox.y),
        width: Math.round(child.absoluteBoundingBox.width),
        height: Math.round(child.absoluteBoundingBox.height)
      };
    }
    
    // Extract text content
    if (child.type === 'TEXT' && child.characters) {
      element.text = child.characters;
      element.fontSize = child.style?.fontSize;
      element.fontWeight = child.style?.fontWeight;
      element.textColor = extractColor(child.fills?.[0]?.color);
    }
    
    // Extract image information
    if (child.type === 'RECTANGLE' && child.fills) {
      const imageFill = child.fills.find(fill => fill.type === 'IMAGE');
      if (imageFill) {
        element.hasImage = true;
        element.imageRef = imageFill.imageRef;
      }
    }
    
    // Extract background color
    if (child.fills && child.fills.length > 0) {
      element.backgroundColor = extractColor(child.fills[0].color);
    }
    
    // Recursively extract children
    if (child.children && child.children.length > 0) {
      element.children = extractElements(child.children);
    }
    
    elements.push(element);
  });
  
  return elements;
}

/**
 * Extract styles from Figma node
 * @param {Object} node - Figma node
 * @returns {Object} CSS-like styles
 */
function extractStyles(node) {
  const styles = {};
  
  // Border radius
  if (node.cornerRadius) {
    styles.borderRadius = `${node.cornerRadius}px`;
  }
  
  // Padding
  if (node.paddingLeft || node.paddingTop || node.paddingRight || node.paddingBottom) {
    styles.padding = `${node.paddingTop || 0}px ${node.paddingRight || 0}px ${node.paddingBottom || 0}px ${node.paddingLeft || 0}px`;
  }
  
  // Effects (shadows, blurs)
  if (node.effects && node.effects.length > 0) {
    const shadows = node.effects
      .filter(effect => effect.type === 'DROP_SHADOW')
      .map(shadow => {
        const color = extractColor(shadow.color);
        return `${shadow.offset?.x || 0}px ${shadow.offset?.y || 0}px ${shadow.radius || 0}px ${color}`;
      });
    
    if (shadows.length > 0) {
      styles.boxShadow = shadows.join(', ');
    }
  }
  
  return styles;
}

/**
 * Extract color from Figma color object
 * @param {Object} colorObj - Figma color object
 * @returns {string} CSS color string
 */
function extractColor(colorObj) {
  if (!colorObj) return 'transparent';
  
  const { r = 0, g = 0, b = 0, a = 1 } = colorObj;
  
  // Convert from 0-1 range to 0-255
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  
  if (a === 1) {
    return `rgb(${red}, ${green}, ${blue})`;
  }
  
  return `rgba(${red}, ${green}, ${blue}, ${a})`;
}

/**
 * Get the most suitable frames for email conversion
 * @param {Array} layouts - Extracted layouts from Figma
 * @returns {Array} Filtered layouts suitable for email
 */
export function getEmailSuitableFrames(layouts) {
  return layouts.filter(layout => {
    // Prefer mobile-width frames (good for email)
    const isMobileWidth = layout.width >= 320 && layout.width <= 600;
    
    // Or desktop frames that aren't too wide
    const isReasonableWidth = layout.width <= 800;
    
    // Must have some height
    const hasContent = layout.height > 100;
    
    // Must have elements
    const hasElements = layout.elements && layout.elements.length > 0;
    
    return (isMobileWidth || isReasonableWidth) && hasContent && hasElements;
  }).slice(0, 5); // Limit to first 5 suitable frames
}