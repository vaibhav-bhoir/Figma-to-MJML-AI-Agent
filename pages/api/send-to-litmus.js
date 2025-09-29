/**
 * API Route: Send Email to Litmus for Testing
 * Handles sending compiled HTML emails to Litmus for cross-client testing
 */

import { analyzeSpamScore, getApplicationsByScenario, sendToLitmus, validateEmailHTML } from '../../lib/litmus';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { html, subject, scenario = 'popular', options = {} } = req.body;
    
    if (!html) {
      return res.status(400).json({ 
        error: 'Missing HTML content',
        success: false 
      });
    }

    // Validate Litmus credentials
    const hasLitmusCredentials = process.env.LITMUS_API_KEY && process.env.LITMUS_USERNAME;
    
    if (!hasLitmusCredentials) {
      return res.status(500).json({
        error: 'Litmus credentials not configured',
        success: false,
        message: 'Please add LITMUS_API_KEY and LITMUS_USERNAME to your environment variables'
      });
    }
    
    console.log('🧪 Preparing email for Litmus testing...');
    
    // Validate HTML for email compatibility
    const htmlValidation = validateEmailHTML(html);
    
    // Analyze spam score
    const spamAnalysis = analyzeSpamScore(html, subject);
    
    // Get applications for testing scenario
    const applications = getApplicationsByScenario(scenario);
    
    console.log(`📧 Testing in ${applications.length} email clients...`);
    
    // Send to Litmus
    const litmusResult = await sendToLitmus(html, {
      subject: subject || 'Email Template Test',
      applications,
      testType: options.testType || 'email',
      ...options
    });
    
    if (!litmusResult.success) {
      return res.status(500).json({
        success: false,
        error: litmusResult.error,
        message: 'Failed to send email to Litmus'
      });
    }
    
    console.log(`✅ Email sent to Litmus successfully! Test ID: ${litmusResult.testId}`);
    
    return res.status(200).json({
      success: true,
      testId: litmusResult.testId,
      testUrl: litmusResult.testUrl,
      applications,
      scenario,
      analysis: {
        htmlValidation,
        spamAnalysis
      },
      message: `Email test started with ${applications.length} email clients`
    });
    
  } catch (error) {
    console.error('❌ Litmus integration error:', error);
    
    let errorMessage = error.message;
    let errorCode = 500;
    
    if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = 'Invalid Litmus credentials';
      errorCode = 401;
    } else if (error.message.includes('429')) {
      errorMessage = 'Litmus API rate limit exceeded';
      errorCode = 429;
    }
    
    return res.status(errorCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}