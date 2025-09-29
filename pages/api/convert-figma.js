/**
 * API Route: Convert Figma Design to MJML
 * Handles the complete conversion pipeline from Figma to email template
 */

import { generateMJMLFromLayout } from '../../lib/ai';
import { generateFallbackMJML } from '../../lib/fallback-mjml';
import { extractLayoutFromFigma, fetchFigmaFile, getEmailSuitableFrames } from '../../lib/figma';
import { compileMJML, validateMJML } from '../../lib/mjml';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  
  try {
    const { fileId, options = {} } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ 
        error: 'Missing fileId parameter',
        success: false 
      });
    }

    // Validate environment variables
    const figmaToken = process.env.FIGMA_TOKEN;
    if (!figmaToken) {
      return res.status(500).json({ 
        error: 'Figma token not configured',
        success: false 
      });
    }

    console.log(`🎨 Starting Figma conversion for file: ${fileId}`);
    
    // Step 1: Fetch Figma file data
    console.log('📡 Fetching Figma data...');
    const figmaData = await fetchFigmaFile(fileId, figmaToken);
    
    // Step 2: Extract layout information
    console.log('🔍 Extracting layout information...');
    const layoutData = extractLayoutFromFigma(figmaData);
    
    if (!layoutData.layouts || layoutData.layouts.length === 0) {
      return res.status(400).json({
        error: 'No suitable layouts found in Figma file',
        success: false,
        metadata: {
          fileName: layoutData.fileName,
          totalFrames: 0
        }
      });
    }
    
    // Step 3: Filter for email-suitable frames
    const emailFrames = getEmailSuitableFrames(layoutData.layouts);
    
    if (emailFrames.length === 0) {
      return res.status(400).json({
        error: 'No email-suitable frames found. Try frames with width 320-800px and height > 100px.',
        success: false,
        metadata: {
          fileName: layoutData.fileName,
          totalFrames: layoutData.layouts.length,
          availableFrames: layoutData.layouts.map(f => ({ 
            name: f.name, 
            size: `${f.width}×${f.height}` 
          }))
        }
      });
    }
    
    console.log(`✅ Found ${emailFrames.length} suitable frames for email conversion`);
    
    // Step 4: Generate MJML
    let mjmlCode;
    let usedFallback = false;
    const hasOpenAI = process.env.OPENAI_API_KEY;
    
    if (hasOpenAI) {
      try {
        console.log('🤖 Generating MJML with AI...');
        mjmlCode = await generateMJMLFromLayout({
          fileName: layoutData.fileName,
          layouts: emailFrames
        });
        console.log('✨ AI generation successful');
      } catch (aiError) {
        console.warn('⚠️ AI generation failed, using fallback:', aiError.message);
        mjmlCode = generateFallbackMJML({
          fileName: layoutData.fileName,
          layouts: emailFrames
        });
        usedFallback = true;
      }
    } else {
      console.log('📝 Using fallback MJML generation (no OpenAI key)');
      mjmlCode = generateFallbackMJML({
        fileName: layoutData.fileName,
        layouts: emailFrames
      });
      usedFallback = true;
    }
    
    // Step 5: Validate MJML
    console.log('🔍 Validating MJML...');
    const validation = validateMJML(mjmlCode);
    
    if (!validation.isValid && validation.errors.length > 0) {
      console.warn('⚠️ MJML validation issues:', validation.errors);
      // Continue anyway for soft validation
    }
    
    // Step 6: Compile to HTML
    console.log('⚙️ Compiling MJML to HTML...');
    const compilation = compileMJML(mjmlCode, {
      beautify: true,
      validationLevel: 'soft'
    });
    
    if (!compilation.success) {
      return res.status(500).json({
        error: 'MJML compilation failed',
        details: compilation.errors,
        success: false
      });
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`🎉 Conversion completed in ${processingTime}ms`);
    
    // Step 7: Return results
    return res.status(200).json({
      success: true,
      mjml: mjmlCode,
      html: compilation.html,
      usedFallback,
      metadata: {
        fileName: layoutData.fileName,
        lastModified: layoutData.lastModified,
        frameCount: emailFrames.length,
        primaryFrame: emailFrames[0] ? {
          name: emailFrames[0].name,
          width: emailFrames[0].width,
          height: emailFrames[0].height
        } : null,
        processingTime,
        aiUsed: !usedFallback
      },
      validation: {
        errors: compilation.errors || [],
        warnings: compilation.warnings || []
      }
    });
    
  } catch (error) {
    console.error('❌ Conversion error:', error);
    
    const processingTime = Date.now() - startTime;
    
    // Provide specific error messages
    let errorMessage = error.message;
    let errorCode = 500;
    
    if (error.message.includes('403') || error.message.includes('401')) {
      errorMessage = 'Invalid Figma token or no access to file';
      errorCode = 403;
    } else if (error.message.includes('404')) {
      errorMessage = 'Figma file not found';
      errorCode = 404;
    } else if (error.message.includes('quota') || error.message.includes('billing')) {
      errorMessage = 'OpenAI quota exceeded. Please check your billing.';
      errorCode = 429;
    }
    
    return res.status(errorCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      processingTime
    });
  }
}