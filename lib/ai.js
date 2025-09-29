/**
 * AI Integration Library with Multi-Provider Support
 * Handles multiple AI providers for converting designs to MJML
 */
import { generateMJMLWithFallback } from './multi-ai.js';

/**
 * Generate MJML from layout data using multiple AI providers
 * @param {Object} layoutData - Processed layout information from Figma
 * @returns {Object} Generated MJML with metadata
 */
export async function generateMJMLFromLayout(layoutData) {
  try {
    // Try providers in order: OpenAI → Groq (fast & free) → Cohere (updated Chat API) → Enhanced fallback
    const providers = ['openai', 'groq', 'cohere', 'enhanced-fallback'];
    
    console.log('🚀 Starting multi-provider AI generation...');
    const result = await generateMJMLWithFallback(layoutData, providers);
    
    if (result.usedFallback) {
      console.log('ℹ️  Used intelligent fallback due to AI provider limits');
    } else {
      console.log(`✅ Generated with ${result.provider} provider`);
    }
    
    return result.mjml;
  } catch (error) {
    console.error('❌ All providers failed, using basic fallback:', error);
    return generateFallbackMJML(layoutData);
  }
}

/**
 * Legacy single-provider generation (kept for compatibility)
 * @param {Object} layoutData - Processed layout information from Figma
 * @param {string} model - OpenAI model to use (default: gpt-3.5-turbo)
 * @returns {string} Generated MJML code
 */
export async function generateMJMLFromLayoutLegacy(layoutData, model = 'gpt-3.5-turbo') {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, using fallback');
    return generateFallbackMJML(layoutData);
  }

  const prompt = createMJMLPrompt(layoutData);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an expert email template developer who specializes in converting design layouts to MJML (responsive email markup). You create clean, professional, and mobile-responsive email templates that work across all email clients.

CRITICAL MJML RULES - FOLLOW STRICTLY:
1. NEVER use border-radius on mj-text components - use CSS classes instead
2. NEVER nest mj-section inside mj-column - only use mj-section at root level in mj-body
3. ALWAYS include alt attribute on mj-image components for accessibility
4. VALID mj-text attributes: align, background-color, color, font-family, font-size, font-weight, padding, line-height
5. VALID mj-button attributes: background-color, color, border-radius, font-size, font-weight, padding, href
6. For rounded text backgrounds, use CSS classes with border-radius in mj-style
7. Use proper padding format: padding="20px" not padding="20px 10px"

EXAMPLE of correct rounded text:
<mj-style>.rounded { background-color: #f0f0f0; border-radius: 8px; }</mj-style>
<mj-text css-class="rounded" padding="15px">Content</mj-text>

Generate valid MJML that will compile without errors.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    return extractMJMLFromResponse(data.choices[0].message.content);
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}

/**
 * Create a detailed prompt for MJML generation
 * @param {Object} layoutData - Layout information
 * @returns {string} Formatted prompt
 */
function createMJMLPrompt(layoutData) {
  const { fileName, layouts } = layoutData;
  
  if (!layouts || layouts.length === 0) {
    throw new Error('No layouts provided for MJML generation');
  }
  
  // Focus on the first/most suitable layout
  const primaryLayout = layouts[0];
  
  let prompt = `Convert this design layout to a responsive MJML email template:

`;
  
  prompt += `**File:** ${fileName}\n`;
  prompt += `**Frame:** ${primaryLayout.name} (${primaryLayout.width}x${primaryLayout.height}px)\n\n`;
  
  prompt += `**Layout Structure:**\n`;
  
  // Analyze and describe the elements
  const elementsSummary = analyzeElements(primaryLayout.elements);
  prompt += elementsSummary;
  
  prompt += `\n**Requirements:**\n`;
  prompt += `1. Create a fully responsive MJML email template\n`;
  prompt += `2. Use proper MJML components (mj-section, mj-column, mj-text, mj-button, mj-image, etc.)\n`;
  prompt += `3. Maintain the visual hierarchy and spacing\n`;
  prompt += `4. Use web-safe fonts and colors\n`;
  prompt += `5. Ensure mobile responsiveness\n`;
  prompt += `6. Include proper email client compatibility\n`;
  prompt += `7. Add fallback colors and styles\n\n`;
  
  prompt += `**Output Format:**\n`;
  prompt += `Please provide only the complete MJML code wrapped in \`\`\`mjml code blocks. Do not include any explanations or additional text outside the code block.`;
  
  return prompt;
}

/**
 * Analyze elements and create a structured description
 * @param {Array} elements - Array of layout elements
 * @returns {string} Formatted description
 */
function analyzeElements(elements) {
  if (!elements || elements.length === 0) {
    return '- Empty layout or no visible elements\n';
  }
  
  let description = '';
  const elementTypes = {};
  const textElements = [];
  const imageElements = [];
  
  elements.forEach((element, index) => {
    // Count element types
    elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
    
    // Collect text elements
    if (element.type === 'TEXT' && element.text) {
      textElements.push({
        text: element.text.substring(0, 50) + (element.text.length > 50 ? '...' : ''),
        bounds: element.bounds,
        fontSize: element.fontSize
      });
    }
    
    // Collect image elements
    if (element.hasImage || (element.type === 'RECTANGLE' && element.bounds)) {
      imageElements.push({
        name: element.name,
        bounds: element.bounds
      });
    }
  });
  
  description += `**Element Summary:**\n`;
  Object.entries(elementTypes).forEach(([type, count]) => {
    description += `- ${count} ${type} element${count > 1 ? 's' : ''}\n`;
  });
  
  if (textElements.length > 0) {
    description += `\n**Text Content:**\n`;
    textElements.slice(0, 5).forEach((text, i) => {
      description += `${i + 1}. "${text.text}"${text.fontSize ? ` (${text.fontSize}px)` : ''}\n`;
    });
    if (textElements.length > 5) {
      description += `... and ${textElements.length - 5} more text elements\n`;
    }
  }
  
  if (imageElements.length > 0) {
    description += `\n**Images/Graphics:**\n`;
    imageElements.slice(0, 3).forEach((img, i) => {
      const size = img.bounds ? `${img.bounds.width}x${img.bounds.height}px` : 'unknown size';
      description += `${i + 1}. ${img.name} (${size})\n`;
    });
    if (imageElements.length > 3) {
      description += `... and ${imageElements.length - 3} more images\n`;
    }
  }
  
  return description;
}

/**
 * Extract MJML code from AI response
 * @param {string} response - AI response text
 * @returns {string} Clean MJML code
 */
function extractMJMLFromResponse(response) {
  // Look for MJML code blocks
  const mjmlBlockMatch = response.match(/```(?:mjml)?\n([\s\S]*?)\n```/);
  
  if (mjmlBlockMatch) {
    return mjmlBlockMatch[1].trim();
  }
  
  // Look for <mjml> tags if no code block found
  const mjmlTagMatch = response.match(/<mjml[\s\S]*<\/mjml>/);
  
  if (mjmlTagMatch) {
    return mjmlTagMatch[0].trim();
  }
  
  // If no structured code found, return the response but warn
  console.warn('Could not extract MJML code block from AI response');
  return response.trim();
}

/**
 * Generate MJML from image analysis
 * @param {string} imageAnalysis - Description of the image content
 * @param {Object} metadata - Image metadata (width, height, etc.)
 * @returns {string} Generated MJML code
 */
export async function generateMJMLFromImage(imageAnalysis, metadata = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Convert this image description into a responsive MJML email template:

**Image Analysis:**
${imageAnalysis}

**Image Metadata:**
- Dimensions: ${metadata.width || 'unknown'} x ${metadata.height || 'unknown'}
- Format: ${metadata.format || 'unknown'}

**CRITICAL MJML RULES - FOLLOW STRICTLY:**
1. NEVER use border-radius on mj-text - use CSS classes instead
2. NEVER nest mj-section inside mj-column
3. ALWAYS include alt attribute on mj-image
4. VALID mj-text attributes ONLY: align, background-color, color, font-family, font-size, font-weight, padding, line-height
5. For rounded backgrounds: use <mj-style>.rounded{border-radius:8px;}</mj-style> then css-class="rounded"

**Requirements:**
1. Create a complete MJML email template based on the image content
2. Use ONLY valid MJML components and attributes
3. Ensure mobile responsiveness
4. Include proper email client compatibility
5. Use web-safe fonts and colors

**Output Format:**
Provide only the complete MJML code wrapped in \`\`\`mjml code blocks.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email template developer who creates MJML templates from image descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message}`);
    }

    const data = await response.json();
    return extractMJMLFromResponse(data.choices[0].message.content);
    
  } catch (error) {
    console.error('AI Image Generation Error:', error);
    throw error;
  }
}