/**
 * Test OpenAI API Connection
 * Quick script to verify OpenAI API key and model access
 */

require('dotenv').config({ path: '.env.local' });

async function testOpenAIConnection() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    console.log('💡 To get an API key:');
    console.log('   1. Go to https://platform.openai.com/api-keys');
    console.log('   2. Create a new secret key');
    console.log('   3. Add it to your .env.local file as OPENAI_API_KEY=your_key_here');
    return;
  }

  console.log('🤖 Testing OpenAI API connection...');
  console.log('─'.repeat(50));
  
  try {
    // Test with a simple completion request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'Hello! Just testing the API connection. Please respond with "API working!"'
        }],
        max_tokens: 10,
        temperature: 0
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error?.message || response.statusText}`);
    }

    console.log('✅ Successfully connected to OpenAI API!');
    console.log(`🤖 Model: gpt-3.5-turbo`);
    console.log(`💬 Test Response: "${data.choices[0].message.content.trim()}"`);
    console.log(`⚡ Usage: ${data.usage.total_tokens} tokens`);
    console.log('');
    console.log('🎉 Your OpenAI API is ready for MJML conversion!');
    
  } catch (error) {
    console.error('❌ Error connecting to OpenAI:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 This means your API key is invalid or expired');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded - try again in a moment');
    } else if (error.message.includes('quota')) {
      console.log('💡 Quota exceeded - you need to add billing/credits to your OpenAI account');
      console.log('   Go to https://platform.openai.com/settings/organization/billing');
    } else if (error.message.includes('model')) {
      console.log('💡 Model access issue - your account might not have access to GPT models');
    }
  }
}

// Check if we have fetch (Node 18+)
if (typeof fetch === 'undefined') {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}

testOpenAIConnection();