#!/usr/bin/env node

/**
 * Multi-Provider AI Demo Script
 * Tests all available AI providers and fallback systems
 */

import { generateMJMLWithFallback, getAvailableProviders } from '../lib/multi-ai.js';

// Sample layout data for testing
const sampleLayoutData = {
  fileName: "demo-email-design.fig",
  layouts: [{
    name: "Newsletter Template",
    width: 600,
    height: 800,
    elements: [
      {
        type: "TEXT",
        name: "Header",
        text: "Monthly Newsletter",
        fontSize: 24,
        fontWeight: 600,
        textColor: "#333333"
      },
      {
        type: "TEXT", 
        name: "Subtitle",
        text: "Stay updated with our latest news and updates",
        fontSize: 16,
        textColor: "#666666"
      },
      {
        type: "RECTANGLE",
        name: "Hero Image",
        backgroundColor: "#f0f0f0",
        hasImage: true
      },
      {
        type: "TEXT",
        name: "Content",
        text: "This is the main content area where you can add your newsletter content.",
        fontSize: 14,
        textColor: "#333333"
      }
    ]
  }]
};

async function runDemo() {
  console.log('🚀 Multi-Provider AI System Demo\n');
  
  // Check available providers
  console.log('📊 Available AI Providers:');
  const providers = getAvailableProviders();
  providers.forEach(provider => {
    const status = provider.available ? '✅ Available' : '❌ Not configured';
    const cost = provider.free ? '🆓 Free' : '💰 Paid';
    console.log(`  ${provider.name}: ${status} ${cost}`);
    if (provider.setup && !provider.available) {
      console.log(`    Setup: ${provider.setup}`);
    }
  });
  
  console.log('\n🎯 Testing Provider Chain...\n');
  
  // Test different provider combinations
  const testCases = [
    {
      name: 'Full Chain (OpenAI → Cohere → Fallback)',
      providers: ['openai', 'cohere', 'enhanced-fallback']
    },
    {
      name: 'Free Only (Cohere → Fallback)',  
      providers: ['cohere', 'enhanced-fallback']
    },
    {
      name: 'Fallback Only (No AI)',
      providers: ['enhanced-fallback']
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Test Case: ${testCase.name}`);
    console.log(`   Providers: ${testCase.providers.join(' → ')}`);
    
    try {
      const startTime = Date.now();
      const result = await generateMJMLWithFallback(sampleLayoutData, testCase.providers);
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ Success in ${duration}ms`);
      console.log(`   🤖 Provider used: ${result.provider}`);
      console.log(`   📝 AI used: ${!result.usedFallback ? 'Yes' : 'No'}`);
      console.log(`   📄 MJML length: ${result.mjml.length} characters`);
      
      if (result.analysis) {
        console.log(`   🧠 Analysis: ${result.analysis.layoutType || 'N/A'} layout detected`);
      }
      
      if (result.aiErrors && result.aiErrors.length > 0) {
        console.log(`   ⚠️  AI Errors: ${result.aiErrors.length} provider(s) failed`);
      }
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Demo Complete!\n');
  
  console.log('💡 Key Benefits:');
  console.log('  • No more quota exceeded errors');
  console.log('  • Multiple free AI options available');
  console.log('  • Intelligent fallback always works');
  console.log('  • Professional templates guaranteed');
  console.log('  • Cost-effective solution');
  
  console.log('\n🚀 Ready to use! Start your app:');
  console.log('  npm run dev');
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}

export { runDemo };
