/**
 * Test Figma API Connection
 * Quick script to verify Figma API token and file access
 */

require('dotenv').config({ path: '.env.local' });

async function testFigmaConnection() {
  const fileId = 'mcm7tiRZpPxY2uP5CVwTmK';
  const token = process.env.FIGMA_TOKEN;
  
  if (!token) {
    console.error('❌ FIGMA_TOKEN not found in .env.local');
    return;
  }

  console.log('🔍 Testing Figma API connection...');
  console.log(`📁 File ID: ${fileId}`);
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: { 'X-Figma-Token': token },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Successfully connected to Figma API!');
    console.log(`📋 File Name: ${data.name}`);
    console.log(`📅 Last Modified: ${data.lastModified}`);
    console.log(`📄 Pages: ${data.document.children.length}`);
    
    if (data.document.children.length > 0) {
      const firstPage = data.document.children[0];
      console.log(`🎨 First Page: '${firstPage.name}' with ${firstPage.children?.length || 0} frames`);
      
      if (firstPage.children && firstPage.children.length > 0) {
        console.log('🖼️  Frames found:');
        firstPage.children.slice(0, 10).forEach((frame, index) => {
          console.log(`   ${index + 1}. ${frame.name} (${frame.type})`);
        });
        if (firstPage.children.length > 10) {
          console.log(`   ... and ${firstPage.children.length - 10} more`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error connecting to Figma:', error.message);
    
    if (error.message.includes('403')) {
      console.log('💡 This might mean:');
      console.log('   - Invalid or expired Figma token');
      console.log('   - No access to this specific file');
      console.log('   - File is private and you don\'t have permissions');
    }
  }
}

// Check if we have fetch (Node 18+)
if (typeof fetch === 'undefined') {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}

testFigmaConnection();