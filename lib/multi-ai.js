/**
 * Multi-Provider AI System
 * Supports OpenAI, free alternatives, and enhanced fallbacks
 */

/**
 * Available AI providers with their configurations
 */
const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    free: false,
    setup: 'Requires OpenAI API key'
  },
  huggingface: {
    name: 'Hugging Face',
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
    model: 'microsoft/DialoGPT-large',
    free: true,
    setup: 'Free tier available'
  },
  cohere: {
    name: 'Cohere',
    endpoint: 'https://api.cohere.com/v1/chat',
    model: 'command-r-plus',
    free: true,
    setup: 'Free tier: 1M tokens/month (Updated Chat API)'
  },
  together: {
    name: 'Together AI',
    endpoint: 'https://api.together.xyz/inference',
    model: 'togethercomputer/llama-2-70b-chat',
    free: true,
    setup: 'Free tier available'
  },
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-8b-8192',
    free: true,
    setup: 'Free tier: Fast inference'
  }
};

/**
 * Generate MJML using multiple AI providers with fallback
 * @param {Object} layoutData - Layout information
 * @param {Array} providers - Ordered list of providers to try
 * @returns {Object} Generated MJML and metadata
 */
export async function generateMJMLWithFallback(layoutData, providers = ['openai', 'groq', 'cohere', 'enhanced-fallback']) {
  const errors = [];
  
  for (const provider of providers) {
    try {
      console.log(`🤖 Trying ${provider} provider...`);
      
      if (provider === 'enhanced-fallback') {
        const result = await generateEnhancedFallbackMJML(layoutData);
        return { ...result, provider: 'enhanced-fallback', usedFallback: true };
      }
      
      const result = await generateWithProvider(provider, layoutData);
      if (result.success) {
        console.log(`✅ Success with ${provider}`);
        return { ...result, provider, usedFallback: false };
      }
    } catch (error) {
      console.log(`❌ ${provider} failed:`, error.message);
      errors.push({ provider, error: error.message });
    }
  }
  
  // If all AI providers fail, use enhanced fallback
  console.log('🔄 All AI providers failed, using enhanced fallback');
  const fallbackResult = await generateEnhancedFallbackMJML(layoutData);
  return { ...fallbackResult, provider: 'enhanced-fallback', usedFallback: true, aiErrors: errors };
}

/**
 * Generate MJML using a specific provider
 */
async function generateWithProvider(providerKey, layoutData) {
  const provider = AI_PROVIDERS[providerKey];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerKey}`);
  }
  
  switch (providerKey) {
    case 'openai':
      return await generateWithOpenAI(layoutData);
    case 'cohere':
      return await generateWithCohere(layoutData);
    case 'huggingface':
      return await generateWithHuggingFace(layoutData);
    case 'together':
      return await generateWithTogether(layoutData);
    case 'groq':
      return await generateWithGroq(layoutData);
    default:
      throw new Error(`Provider ${providerKey} not implemented`);
  }
}

/**
 * OpenAI provider implementation
 */
async function generateWithOpenAI(layoutData) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }
  
  const prompt = createMJMLPrompt(layoutData);
  
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
          content: getMJMLSystemPrompt()
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
  const mjmlCode = extractMJMLFromResponse(data.choices[0].message.content);
  
  return {
    success: true,
    mjml: mjmlCode,
    usage: data.usage,
    model: 'gpt-3.5-turbo'
  };
}

/**
 * Cohere provider implementation (FREE - Updated to Chat API)
 */
async function generateWithCohere(layoutData) {
  const apiKey = process.env.COHERE_API_KEY;
  
  if (!apiKey || apiKey === 'demo-key') {
    throw new Error('Cohere API key required. Get free key at cohere.com');
  }
  
  const prompt = createMJMLPrompt(layoutData);
  const systemPrompt = getMJMLSystemPrompt();
  
  const response = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-r-plus',
      message: prompt,
      preamble: systemPrompt,
      max_tokens: 1500,
      temperature: 0.3,
      chat_history: [],
      prompt_truncation: 'AUTO'
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cohere API error: ${response.status} - ${errorData.message || response.statusText}`);
  }
  
  const data = await response.json();
  const mjmlCode = extractMJMLFromResponse(data.text);
  
  return {
    success: true,
    mjml: mjmlCode,
    usage: { 
      input_tokens: data.meta?.tokens?.input_tokens || 0,
      output_tokens: data.meta?.tokens?.output_tokens || 0
    },
    model: 'command-r-plus'
  };
}

/**
 * Groq provider implementation (FREE - Fast inference)
 */
async function generateWithGroq(layoutData) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key required. Get free key at console.groq.com');
  }
  
  const prompt = createMJMLPrompt(layoutData);
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: getMJMLSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  const mjmlCode = extractMJMLFromResponse(data.choices[0].message.content);
  
  return {
    success: true,
    mjml: mjmlCode,
    usage: data.usage,
    model: 'llama3-8b-8192'
  };
}

/**
 * Enhanced fallback that creates intelligent templates
 */
async function generateEnhancedFallbackMJML(layoutData) {
  console.log('🧠 Generating intelligent fallback MJML...');
  
  const { fileName, layouts } = layoutData;
  const primaryLayout = layouts[0];
  
  // Analyze layout elements to create intelligent template
  const analysis = analyzeLayoutElements(primaryLayout);
  const mjml = generateIntelligentMJML(analysis, fileName, primaryLayout);
  
  return {
    success: true,
    mjml: mjml,
    aiUsed: false,
    analysis: analysis,
    model: 'intelligent-fallback'
  };
}

/**
 * Analyze layout elements for intelligent template generation
 */
function analyzeLayoutElements(layout) {
  const { elements = [], width, height, name } = layout;
  
  const analysis = {
    hasText: false,
    hasImages: false,
    hasButtons: false,
    hasColoredSections: false,
    textElements: [],
    imageElements: [],
    coloredElements: [],
    layoutType: 'unknown',
    primaryColors: [],
    aspectRatio: width && height ? width / height : 1
  };
  
  elements.forEach(element => {
    switch (element.type) {
      case 'TEXT':
        analysis.hasText = true;
        analysis.textElements.push({
          text: element.text || 'Sample Text',
          fontSize: element.fontSize || 16,
          color: element.textColor || '#333333',
          weight: element.fontWeight || 400
        });
        break;
        
      case 'RECTANGLE':
      case 'FRAME':
        if (element.hasImage) {
          analysis.hasImages = true;
          analysis.imageElements.push(element);
        } else if (element.backgroundColor && element.backgroundColor !== 'transparent') {
          analysis.hasColoredSections = true;
          analysis.coloredElements.push(element);
          if (!analysis.primaryColors.includes(element.backgroundColor)) {
            analysis.primaryColors.push(element.backgroundColor);
          }
        }
        break;
    }
  });
  
  // Determine layout type
  if (analysis.hasText && analysis.hasImages && analysis.hasColoredSections) {
    analysis.layoutType = 'rich-content';
  } else if (analysis.hasText && analysis.hasColoredSections) {
    analysis.layoutType = 'text-focused';
  } else if (analysis.hasImages) {
    analysis.layoutType = 'image-focused';
  } else {
    analysis.layoutType = 'minimal';
  }
  
  return analysis;
}

/**
 * Generate intelligent MJML based on analysis
 */
function generateIntelligentMJML(analysis, fileName, layout) {
  const { name, width, height } = layout;
  const primaryColor = analysis.primaryColors[0] || '#007bff';
  const textColor = getContrastColor(primaryColor);
  
  let mjml = `<mjml>
  <mj-head>
    <mj-title>${fileName} - ${name}</mj-title>
    <mj-preview>Intelligent email template generated from ${name}</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Poppins', Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="20px" />
    </mj-attributes>
    <mj-style inline="inline">
      .header { background-color: ${primaryColor}; }
      .primary-color { color: ${primaryColor}; }
      .rounded { border-radius: 8px; padding: 15px; background-color: #f8f9fa; }
      @media only screen and (max-width: 480px) {
        .mobile-center { text-align: center !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body>`;

  // Header based on layout type
  mjml += `
    <mj-section css-class="header" padding="30px 20px">
      <mj-column>
        <mj-text align="center" font-size="28px" font-weight="600" color="${textColor}">
          ${name || 'Your Email Template'}
        </mj-text>`;
  
  if (analysis.layoutType === 'rich-content') {
    mjml += `
        <mj-text align="center" font-size="16px" color="${textColor}" padding-top="10px">
          🎨 Rich content email with ${analysis.textElements.length} text sections
        </mj-text>`;
  }
  
  mjml += `
      </mj-column>
    </mj-section>`;
  
  // Content based on analysis
  mjml += `
    <mj-section padding="40px 20px">
      <mj-column>`;
  
  // Add text content if found
  if (analysis.hasText && analysis.textElements.length > 0) {
    analysis.textElements.slice(0, 3).forEach((textEl, index) => {
      mjml += `
        <mj-text font-size="${textEl.fontSize}px" color="${textEl.color}" font-weight="${textEl.weight > 500 ? '600' : '400'}">
          ${textEl.text}
        </mj-text>`;
      if (index < analysis.textElements.length - 1) {
        mjml += `
        <mj-spacer height="15px" />`;
      }
    });
  }
  
  // Add colored sections representation
  if (analysis.hasColoredSections) {
    mjml += `
        <mj-spacer height="30px" />
        <mj-text css-class="rounded">
          🎨 <strong>Design Elements Found:</strong><br/>
          • ${analysis.coloredElements.length} colored sections<br/>
          • Primary colors: ${analysis.primaryColors.slice(0, 2).join(', ')}<br/>
          • Layout type: ${analysis.layoutType}
        </mj-text>`;
  }
  
  // Add images representation
  if (analysis.hasImages) {
    mjml += `
        <mj-spacer height="20px" />
        <mj-image src="https://via.placeholder.com/600x300/f8f9fa/333333?text=Image+Placeholder" alt="Content Image" width="100%" />`;
  }
  
  // Call to action
  mjml += `
        <mj-spacer height="30px" />
        <mj-button background-color="${primaryColor}" color="${textColor}" border-radius="6px" font-weight="500" padding="12px 30px">
          Get Started
        </mj-button>
        
        <mj-spacer height="20px" />
        
        <mj-text align="center" font-size="12px" color="#666666">
          💡 <strong>Template Info:</strong> Generated from ${fileName} (${width}×${height}px)<br/>
          Layout type: ${analysis.layoutType} | Elements: ${layout.elements?.length || 0}
        </mj-text>
      </mj-column>
    </mj-section>`;
  
  // Footer
  mjml += `
    <mj-section padding="10px 20px">
      <mj-column>
        <mj-divider border-color="#e9ecef" />
      </mj-column>
    </mj-section>
    <mj-section padding="20px">
      <mj-column>
        <mj-text align="center" font-size="12px" color="#999999">
          Generated with 🧠 <strong>Intelligent Fallback System</strong><br/>
          No AI quota needed • Always available • Smart analysis
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

  return mjml;
}

/**
 * Helper functions
 */
function createMJMLPrompt(layoutData) {
  const { fileName, layouts } = layoutData;
  const primaryLayout = layouts[0];
  
  return `Create a responsive MJML email template based on this Figma design:

**Design Info:**
- File: ${fileName}
- Frame: ${primaryLayout.name} (${primaryLayout.width}×${primaryLayout.height}px)
- Elements: ${primaryLayout.elements?.length || 0}

**Layout Elements:**
${primaryLayout.elements?.map(el => `- ${el.type}: ${el.name || 'Unnamed'}`).join('\n') || 'No specific elements found'}

Generate a complete, valid MJML template that represents this design structure.`;
}

function getMJMLSystemPrompt() {
  return `You are an expert MJML email template generator. Create valid, responsive email templates.

CRITICAL RULES:
1. NEVER use border-radius on mj-text
2. NEVER nest mj-section inside mj-column  
3. ALWAYS include alt attribute on mj-image
4. Use CSS classes for complex styling
5. Ensure mobile responsiveness

Generate clean, valid MJML code only.`;
}

function extractMJMLFromResponse(response) {
  // Extract MJML code from AI response
  const mjmlMatch = response.match(/```mjml\n([\s\S]*?)\n```/) || response.match(/<mjml>[\s\S]*<\/mjml>/);
  return mjmlMatch ? (mjmlMatch[1] || mjmlMatch[0]) : response;
}

function getContrastColor(bgColor) {
  // Simple contrast logic
  if (bgColor && (bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('#000') || bgColor === 'black')) {
    return 'white';
  }
  return '#333333';
}

/**
 * Get available providers and their status
 */
export function getAvailableProviders() {
  return Object.entries(AI_PROVIDERS).map(([key, config]) => ({
    key,
    ...config,
    available: checkProviderAvailability(key)
  }));
}

function checkProviderAvailability(provider) {
  switch (provider) {
    case 'openai':
      return !!process.env.OPENAI_API_KEY;
    case 'cohere':
      return !!process.env.COHERE_API_KEY;
    case 'groq':
      return !!process.env.GROQ_API_KEY;
    case 'huggingface':
      return !!process.env.HUGGINGFACE_API_KEY;
    case 'together':
      return !!process.env.TOGETHER_API_KEY;
    default:
      return false;
  }
}