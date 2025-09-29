/**
 * API Route: Convert Image to MJML
 * Handles image upload and conversion to email template
 */

import formidable from 'formidable';
import { promises as fs } from 'fs';
import { generateMJMLFromImage } from '../../lib/ai';
import { generateFallbackMJMLFromImage } from '../../lib/fallback-mjml';
import { compileMJML } from '../../lib/mjml';
import { analyzeImageWithAI, extractImageMetadata, validateImageForEmail } from '../../lib/vision';

// Disable default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  
  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });
    
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ 
        error: 'No image file provided',
        success: false 
      });
    }
    
    console.log(`🖼️ Processing image: ${imageFile.originalFilename}`);
    
    // Read image file
    const imageBuffer = await fs.readFile(imageFile.filepath);
    
    // Extract metadata
    const metadata = extractImageMetadata(imageBuffer);
    console.log('📄 Image metadata:', metadata);
    
    // Validate image for email use
    const validation = validateImageForEmail(imageBuffer);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Image validation failed',
        details: validation.errors,
        success: false
      });
    }
    
    // Step 1: Analyze image with multi-provider AI
    let imageAnalysisResult;
    let usedFallback = false;
    
    try {
      console.log('🔍 Analyzing image with multi-provider AI...');
      imageAnalysisResult = await analyzeImageWithAI(imageBuffer, {
        detail: 'high',
        prompt: 'Analyze this image for email template conversion. Describe the layout, text content, visual elements, colors, and structure that would be relevant for creating a responsive email template.'
      });
      
      console.log('✨ Image analysis completed');
      usedFallback = !imageAnalysisResult.metadata?.aiUsed;
      
    } catch (error) {
      console.warn('⚠️ Image analysis failed:', error.message);
      imageAnalysisResult = {
        success: false,
        analysis: 'Image uploaded for email template conversion. Using basic template structure.',
        metadata: { aiUsed: false }
      };
      usedFallback = true;
    }
    
    // Extract analysis text for MJML generation
    const imageAnalysis = imageAnalysisResult.analysis || imageAnalysisResult;
    
    // Step 2: Generate MJML with multi-provider system
    let mjmlCode;
    
    try {
      console.log('🚀 Generating MJML from image with multi-provider AI...');
      mjmlCode = await generateMJMLFromImage(imageAnalysis, {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        filename: imageFile.originalFilename,
        analysisMetadata: imageAnalysisResult.metadata
      });
      console.log('✨ Multi-provider MJML generation successful');
    } catch (error) {
      console.warn('⚠️ All providers failed, using basic fallback:', error.message);
      mjmlCode = generateFallbackMJMLFromImage({
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        filename: imageFile.originalFilename
      });
      usedFallback = true;
    }
    
    // Step 3: Compile MJML to HTML
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
    
    // Clean up temporary file
    try {
      await fs.unlink(imageFile.filepath);
    } catch (cleanupError) {
      console.warn('Could not clean up temporary file:', cleanupError.message);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`🎉 Image conversion completed in ${processingTime}ms`);
    
    // Return results
    return res.status(200).json({
      success: true,
      mjml: mjmlCode,
      html: compilation.html,
      usedFallback,
      imageAnalysis: usedFallback ? undefined : imageAnalysis,
      metadata: {
        filename: imageFile.originalFilename,
        size: metadata.size,
        format: metadata.format,
        dimensions: {
          width: metadata.width,
          height: metadata.height
        },
        processingTime,
        aiUsed: !usedFallback
      },
      validation: {
        errors: compilation.errors || [],
        warnings: [...(validation.warnings || []), ...(compilation.warnings || [])]
      }
    });
    
  } catch (error) {
    console.error('❌ Image conversion error:', error);
    
    const processingTime = Date.now() - startTime;
    
    let errorMessage = error.message;
    let errorCode = 500;
    
    if (error.message.includes('File too large')) {
      errorMessage = 'Image file too large. Maximum size is 10MB.';
      errorCode = 413;
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