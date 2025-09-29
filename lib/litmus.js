/**
 * Litmus Email Testing Integration
 * Handles sending email templates to Litmus for cross-client testing
 */

/**
 * Send HTML email to Litmus for testing
 * @param {string} html - Compiled HTML email
 * @param {Object} options - Testing options
 * @returns {Object} Litmus test result
 */
export async function sendToLitmus(html, options = {}) {
  const apiKey = process.env.LITMUS_API_KEY;
  const username = process.env.LITMUS_USERNAME;
  
  if (!apiKey || !username) {
    throw new Error('Litmus credentials not found. Please add LITMUS_API_KEY and LITMUS_USERNAME to your environment variables.');
  }

  const testConfig = {
    test_type: options.testType || 'email',
    email_source: html,
    subject: options.subject || 'Email Template Test',
    applications: options.applications || getDefaultApplications()
  };

  try {
    const response = await fetch('https://litmus.com/api/v1/tests.json', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Litmus API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      testId: result.test_id,
      testUrl: result.url_or_guid,
      message: 'Email sent to Litmus for testing',
      applications: testConfig.applications
    };
    
  } catch (error) {
    console.error('Litmus Integration Error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email to Litmus'
    };
  }
}

/**
 * Get default email client applications for testing
 * @returns {Array} List of email client codes
 */
function getDefaultApplications() {
  return [
    // Desktop clients
    'ol2019', // Outlook 2019
    'ol2016', // Outlook 2016
    'ol2013', // Outlook 2013
    'notes9', // IBM Notes 9
    'thunderbird', // Mozilla Thunderbird
    
    // Webmail
    'gmailnew', // Gmail (new)
    'outlookcom', // Outlook.com
    'yahoo', // Yahoo! Mail
    'aolmail', // AOL Mail
    
    // Mobile
    'iphone12', // iPhone 12 (iOS 14)
    'ipad', // iPad
    'android4', // Android 4.4
    'androidgmailapp', // Gmail App (Android)
    'gmailios', // Gmail App (iOS)
    
    // Popular specific versions
    'chromewebmail', // Chrome (Gmail)
    'ffwebmail', // Firefox (Gmail)
    'outlookios' // Outlook App (iOS)
  ];
}

/**
 * Get specific application sets for different testing scenarios
 * @param {string} scenario - Testing scenario (mobile, desktop, webmail, all)
 * @returns {Array} List of email client codes
 */
export function getApplicationsByScenario(scenario = 'popular') {
  const scenarios = {
    mobile: [
      'iphone12',
      'gmailios',
      'android4',
      'androidgmailapp',
      'outlookios'
    ],
    
    desktop: [
      'ol2019',
      'ol2016',
      'ol2013',
      'thunderbird',
      'notes9'
    ],
    
    webmail: [
      'gmailnew',
      'outlookcom',
      'yahoo',
      'aolmail',
      'chromewebmail',
      'ffwebmail'
    ],
    
    popular: [
      'gmailnew',
      'ol2019',
      'iphone12',
      'androidgmailapp',
      'outlookcom'
    ],
    
    outlook: [
      'ol2019',
      'ol2016',
      'ol2013',
      'outlookcom',
      'outlookios'
    ],
    
    gmail: [
      'gmailnew',
      'gmailios',
      'androidgmailapp',
      'chromewebmail'
    ],
    
    all: getDefaultApplications()
  };
  
  return scenarios[scenario] || scenarios.popular;
}

/**
 * Check test status on Litmus
 * @param {string} testId - Litmus test ID
 * @returns {Object} Test status information
 */
export async function checkTestStatus(testId) {
  const apiKey = process.env.LITMUS_API_KEY;
  const username = process.env.LITMUS_USERNAME;
  
  if (!apiKey || !username) {
    throw new Error('Litmus credentials not found');
  }

  try {
    const response = await fetch(`https://litmus.com/api/v1/tests/${testId}.json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${apiKey}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Litmus API error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      status: result.state,
      completedAt: result.completed_at,
      resultsUrl: result.url_or_guid,
      screenshots: result.test_set_versions || []
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a preview URL for sharing (mock implementation)
 * @param {string} html - HTML email content
 * @returns {string} Preview URL
 */
export function generatePreviewUrl(html) {
  // In a real implementation, this would upload the HTML to a temporary hosting service
  // and return a shareable URL. For now, we'll return a data URL.
  
  const encodedHtml = encodeURIComponent(html);
  return `data:text/html;charset=utf-8,${encodedHtml}`;
}

/**
 * Run spam analysis (basic implementation)
 * @param {string} html - HTML email content
 * @param {string} subject - Email subject line
 * @returns {Object} Spam analysis result
 */
export function analyzeSpamScore(html, subject = '') {
  const analysis = {
    score: 0,
    issues: [],
    suggestions: []
  };
  
  // Basic spam triggers (this would be more sophisticated in a real implementation)
  const spamTriggers = [
    { pattern: /free/gi, score: 1, message: 'Avoid overusing "free"' },
    { pattern: /!!!+/g, score: 2, message: 'Multiple exclamation marks can trigger spam filters' },
    { pattern: /\$\$+/g, score: 1, message: 'Multiple dollar signs may look spammy' },
    { pattern: /URGENT|IMMEDIATE/gi, score: 2, message: 'Urgent language can trigger spam filters' },
    { pattern: /click here/gi, score: 1, message: 'Use more descriptive link text than "click here"' },
    { pattern: /guarantee/gi, score: 1, message: 'Strong claims like "guarantee" can trigger filters' }
  ];
  
  const content = html + ' ' + subject;
  
  spamTriggers.forEach(trigger => {
    const matches = content.match(trigger.pattern);
    if (matches) {
      analysis.score += trigger.score * matches.length;
      analysis.issues.push(`${trigger.message} (found ${matches.length} time${matches.length > 1 ? 's' : ''})`);
    }
  });
  
  // Check for missing elements
  if (!html.includes('alt=')) {
    analysis.score += 1;
    analysis.suggestions.push('Add alt text to images for better deliverability');
  }
  
  if (!subject || subject.length < 10) {
    analysis.score += 2;
    analysis.suggestions.push('Subject line should be at least 10 characters');
  }
  
  if (subject && subject.length > 50) {
    analysis.score += 1;
    analysis.suggestions.push('Subject line is quite long, consider shortening');
  }
  
  // Overall assessment
  if (analysis.score <= 2) {
    analysis.assessment = 'Low spam risk';
  } else if (analysis.score <= 5) {
    analysis.assessment = 'Moderate spam risk';
  } else {
    analysis.assessment = 'High spam risk';
  }
  
  return analysis;
}

/**
 * Validate HTML for email compatibility
 * @param {string} html - HTML email content
 * @returns {Object} Validation result
 */
export function validateEmailHTML(html) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };
  
  // Check for unsupported CSS
  const unsupportedCSS = [
    { pattern: /position:\s*(absolute|fixed)/gi, message: 'Absolute/fixed positioning not supported in email' },
    { pattern: /float:\s*(left|right)/gi, message: 'CSS float may not work in all email clients' },
    { pattern: /display:\s*flex/gi, message: 'Flexbox not supported in many email clients' },
    { pattern: /display:\s*grid/gi, message: 'CSS Grid not supported in email clients' }
  ];
  
  unsupportedCSS.forEach(check => {
    if (check.pattern.test(html)) {
      validation.warnings.push(check.message);
    }
  });
  
  // Check for missing DOCTYPE
  if (!html.includes('<!DOCTYPE')) {
    validation.suggestions.push('Add DOCTYPE declaration for better rendering');
  }
  
  // Check for inline styles (recommended for email)
  const hasInlineStyles = html.includes('style=');
  const hasStyleTags = html.includes('<style');
  
  if (hasStyleTags && !hasInlineStyles) {
    validation.suggestions.push('Consider using inline styles for better email client support');
  }
  
  return validation;
}