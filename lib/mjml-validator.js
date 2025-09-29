/**
 * MJML Validation and Correction System
 * Ensures generated MJML follows official MJML specification
 */

/**
 * Valid MJML component attributes based on MJML 4.x documentation
 */
const MJML_COMPONENT_ATTRIBUTES = {
  'mj-text': [
    'align', 'color', 'container-background-color',
    'css-class', 'font-family', 'font-size', 'font-style', 'font-weight',
    'height', 'letter-spacing', 'line-height', 'padding', 'padding-bottom',
    'padding-left', 'padding-right', 'padding-top', 'text-decoration', 
    'text-transform', 'vertical-align'
  ],
  'mj-button': [
    'align', 'background-color', 'border', 'border-bottom', 'border-left',
    'border-radius', 'border-right', 'border-top', 'color', 'container-background-color',
    'css-class', 'font-family', 'font-size', 'font-style', 'font-weight',
    'height', 'href', 'inner-padding', 'letter-spacing', 'line-height',
    'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
    'rel', 'target', 'text-align', 'text-decoration', 'text-transform',
    'title', 'vertical-align', 'width'
  ],
  'mj-section': [
    'background-color', 'background-position', 'background-position-x',
    'background-position-y', 'background-repeat', 'background-size',
    'background-url', 'border', 'border-bottom', 'border-left',
    'border-radius', 'border-right', 'border-top', 'css-class',
    'direction', 'full-width', 'padding', 'padding-bottom',
    'padding-left', 'padding-right', 'padding-top', 'text-align'
  ],
  'mj-column': [
    'background-color', 'border', 'border-bottom', 'border-left',
    'border-radius', 'border-right', 'border-top', 'css-class',
    'inner-background-color', 'padding', 'padding-bottom',
    'padding-left', 'padding-right', 'padding-top', 'vertical-align',
    'width'
  ],
  'mj-image': [
    'align', 'alt', 'border', 'border-bottom', 'border-left',
    'border-radius', 'border-right', 'border-top', 'container-background-color',
    'css-class', 'fluid-on-mobile', 'height', 'href', 'name',
    'padding', 'padding-bottom', 'padding-left', 'padding-right',
    'padding-top', 'rel', 'sizes', 'src', 'srcset', 'target',
    'title', 'usemap', 'width'
  ],
  'mj-spacer': [
    'container-background-color', 'css-class', 'height',
    'padding', 'padding-bottom', 'padding-left', 'padding-right',
    'padding-top'
  ],
  'mj-divider': [
    'align', 'border-color', 'border-style', 'border-width',
    'container-background-color', 'css-class', 'padding',
    'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
    'width'
  ]
};

/**
 * Validate and correct MJML components and attributes
 * @param {string} mjmlString - The MJML string to validate
 * @returns {Object} - { isValid: boolean, correctedMjml: string, errors: array, warnings: array }
 */
export function validateAndCorrectMJML(mjmlString) {
  const errors = [];
  const warnings = [];
  let correctedMjml = mjmlString;

  // Fix common invalid attribute issues
  correctedMjml = fixInvalidAttributes(correctedMjml, errors, warnings);
  
  // Fix structural issues
  correctedMjml = fixStructuralIssues(correctedMjml, errors, warnings);
  
  // Add missing required attributes
  correctedMjml = addRequiredAttributes(correctedMjml, warnings);

  return {
    isValid: errors.length === 0,
    correctedMjml,
    errors,
    warnings
  };
}

/**
 * Fix invalid attributes on MJML components
 */
function fixInvalidAttributes(mjmlString, errors, warnings) {
  let corrected = mjmlString;
  
  // Fix border-radius on mj-text (move to wrapper div via CSS)
  corrected = corrected.replace(
    /<mj-text([^>]*?)\s+border-radius="([^"]*?)"([^>]*?)>/g,
    (match, before, radius, after) => {
      warnings.push({
        type: 'invalid-attribute',
        message: `border-radius is not valid on mj-text. Use CSS classes or mj-wrapper instead.`,
        fix: `Removed border-radius="${radius}" from mj-text`
      });
      return `<mj-text${before}${after}>`;
    }
  );
  
  // Fix invalid padding formats
  corrected = corrected.replace(
    /padding="(\d+px\s+\d+px)"/g,
    (match, padding) => {
      const [top, right] = padding.split(' ');
      warnings.push({
        type: 'padding-format',
        message: `Converted shorthand padding to individual attributes`,
        fix: `padding="${padding}" → padding-top="${top}" padding-right="${right}" padding-bottom="${top}" padding-left="${right}"`
      });
      return `padding-top="${top}" padding-right="${right}" padding-bottom="${top}" padding-left="${right}"`;
    }
  );

  return corrected;
}

/**
 * Fix structural MJML issues
 */
function fixStructuralIssues(mjmlString, errors, warnings) {
  let corrected = mjmlString;
  
  // Ensure proper nesting - no sections inside columns
  const sectionInColumnRegex = /<mj-column[^>]*>[\s\S]*?<mj-section/g;
  if (sectionInColumnRegex.test(corrected)) {
    errors.push({
      type: 'structural-error',
      message: 'mj-section cannot be nested inside mj-column'
    });
  }
  
  return corrected;
}

/**
 * Add required attributes where missing
 */
function addRequiredAttributes(mjmlString, warnings) {
  let corrected = mjmlString;
  
  // Add alt attribute to images without it
  corrected = corrected.replace(
    /<mj-image(?![^>]*alt=)([^>]*?)>/g,
    (match, attributes) => {
      warnings.push({
        type: 'missing-attribute',
        message: 'Added missing alt attribute to mj-image for accessibility'
      });
      return `<mj-image${attributes} alt="Image">`;
    }
  );
  
  return corrected;
}

/**
 * Generate AI training prompt for MJML generation
 * @returns {string} - Comprehensive prompt for AI training
 */
export function getMJMLTrainingPrompt() {
  return `
You are an expert MJML email template generator. Follow these strict rules:

## VALID MJML COMPONENTS & ATTRIBUTES:

### mj-text (Text content):
- VALID: align, background-color, color, font-family, font-size, font-weight, padding, line-height
- INVALID: border-radius, margin, display, width, height
- USE: For all text content, headings, paragraphs

### mj-button (Call-to-action buttons):
- VALID: background-color, color, border-radius, font-size, font-weight, padding, href
- INVALID: margin, display, position
- USE: For clickable buttons and CTAs

### mj-section (Horizontal containers):
- VALID: background-color, padding, border-radius, full-width
- INVALID: margin, display, flex
- USE: For horizontal layout sections

### mj-column (Vertical containers inside sections):
- VALID: width, background-color, padding, border-radius
- INVALID: height, margin, display
- USE: Inside mj-section for column layouts

### mj-image (Images):
- VALID: src, alt, width, height, align, padding, border-radius
- REQUIRED: src, alt (for accessibility)
- USE: For all images, logos, graphics

### mj-spacer (Vertical spacing):
- VALID: height, padding
- INVALID: margin, width
- USE: For vertical spacing between elements

### mj-divider (Horizontal lines):
- VALID: border-color, border-width, padding, width
- INVALID: margin, height
- USE: For horizontal separators

## STRICT RULES:
1. NEVER use border-radius on mj-text
2. NEVER nest mj-section inside mj-column
3. ALWAYS include alt attribute on mj-image
4. ALWAYS use proper padding format: padding="20px" not padding="20px 10px"
5. ALWAYS validate component nesting: mj-body > mj-section > mj-column > content
6. USE CSS classes for complex styling instead of invalid attributes
7. PREFER mj-wrapper for complex layouts needing border-radius on text areas

## EXAMPLE VALID STRUCTURE:
\`\`\`mjml
<mjml>
  <mj-head>
    <mj-style>
      .rounded-box { background-color: #f0f0f0; border-radius: 8px; padding: 15px; }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text css-class="rounded-box">Text with rounded background</mj-text>
        <mj-button border-radius="6px">Valid Button</mj-button>
        <mj-image src="image.jpg" alt="Description" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
\`\`\`

REMEMBER: When in doubt, check the official MJML documentation. Invalid attributes will cause compilation errors.
`;
}

/**
 * Get component-specific validation rules
 */
export function getComponentValidationRules(componentName) {
  return MJML_COMPONENT_ATTRIBUTES[componentName] || [];
}