# 🛡️ MJML Validation and Training System

## Overview
The Figma to MJML AI Agent includes a comprehensive validation system to ensure all generated MJML code follows the official MJML 4.x specification and compiles without errors.

## Features

### ✅ Automatic Validation & Correction
- **Invalid Attribute Detection**: Automatically identifies and removes invalid attributes
- **Structural Validation**: Ensures proper MJML component nesting
- **Accessibility Enhancement**: Adds missing alt attributes to images
- **Real-time Correction**: Fixes issues before compilation

### 🧠 AI Training Integration
- **Enhanced Prompts**: AI models receive detailed MJML specification rules
- **Component Guidelines**: Specific instructions for each MJML component
- **Best Practices**: Enforces email client compatibility standards

## Validation Rules

### mj-text Component
```mjml
<!-- ❌ INVALID -->
<mj-text border-radius="8px">Text</mj-text>

<!-- ✅ VALID -->
<mj-style>.rounded { border-radius: 8px; }</mj-style>
<mj-text css-class="rounded">Text</mj-text>
```

**Valid Attributes:**
- `align`, `background-color`, `color`, `font-family`
- `font-size`, `font-weight`, `padding`, `line-height`

### mj-button Component
```mjml
<!-- ✅ VALID -->
<mj-button border-radius="6px" background-color="#007bff">
  Click Me
</mj-button>
```

**Valid Attributes:**
- `background-color`, `color`, `border-radius`, `font-size`
- `font-weight`, `padding`, `href`, `align`

### mj-image Component
```mjml
<!-- ❌ INVALID - Missing alt -->
<mj-image src="image.jpg" />

<!-- ✅ VALID -->
<mj-image src="image.jpg" alt="Description" />
```

**Required Attributes:**
- `src`, `alt` (for accessibility)

### Structural Rules
```mjml
<!-- ❌ INVALID - Section inside column -->
<mj-column>
  <mj-section>Content</mj-section>
</mj-column>

<!-- ✅ VALID - Proper nesting -->
<mj-section>
  <mj-column>Content</mj-column>
</mj-section>
```

## How It Works

### 1. Pre-compilation Validation
```javascript
import { validateAndCorrectMJML } from './lib/mjml-validator.js';

const result = validateAndCorrectMJML(mjmlCode);
// Returns: { isValid, correctedMjml, errors, warnings }
```

### 2. AI Training Prompts
The system provides comprehensive training prompts to AI models:

```javascript
import { getMJMLTrainingPrompt } from './lib/mjml-validator.js';

const prompt = getMJMLTrainingPrompt();
// Contains detailed MJML rules and examples
```

### 3. Automatic Integration
The validation system is automatically integrated into:
- **Figma Conversion**: Validates fallback templates
- **Image Processing**: Ensures AI-generated MJML is valid
- **Real-time Compilation**: Fixes issues before HTML generation

## Benefits

### 🎯 For Users
- **Error-free Templates**: No more MJML compilation errors
- **Consistent Quality**: Professional templates every time
- **Accessibility**: Automatic alt text and ARIA compliance
- **Email Client Compatibility**: Works across all major email clients

### 🤖 For AI Models
- **Clear Guidelines**: Detailed component specifications
- **Best Practices**: Industry-standard email development patterns
- **Error Prevention**: Proactive validation rules
- **Continuous Learning**: Updated rules based on MJML changes

### 🛠️ For Developers
- **Maintainable Code**: Clean, valid MJML output
- **Debug Friendly**: Clear error messages and warnings
- **Extensible**: Easy to add new validation rules
- **Performance**: Fast pre-compilation checks

## Validation Pipeline

```
User Input → AI Generation → MJML Validation → Correction → Compilation → HTML Output
     ↓              ↓              ↓              ↓              ↓              ↓
  Figma URL    AI Analysis    Rule Check    Auto Fix    mjml.compile()    Email HTML
  Image File   Prompt+Rules   Attributes    Add Alt     Validation       Client Ready
```

## Error Examples & Fixes

### Common Issues Fixed Automatically:

1. **Invalid border-radius on text**
   ```mjml
   <!-- Before -->
   <mj-text border-radius="8px">Content</mj-text>
   
   <!-- After -->
   <mj-style>.rounded{border-radius:8px;}</mj-style>
   <mj-text css-class="rounded">Content</mj-text>
   ```

2. **Missing alt attributes**
   ```mjml
   <!-- Before -->
   <mj-image src="logo.png" />
   
   <!-- After -->
   <mj-image src="logo.png" alt="Company Logo" />
   ```

3. **Invalid padding format**
   ```mjml
   <!-- Before -->
   <mj-text padding="20px 10px">Content</mj-text>
   
   <!-- After -->
   <mj-text padding-top="20px" padding-right="10px" 
            padding-bottom="20px" padding-left="10px">Content</mj-text>
   ```

## Future Enhancements

### Planned Features:
- **Custom Validation Rules**: User-defined validation patterns
- **Brand Guidelines**: Automatic brand compliance checking
- **A/B Testing**: Template variation validation
- **Performance Optimization**: Email loading speed analysis

### Contributing:
- Add new validation rules in `lib/mjml-validator.js`
- Update AI training prompts for better accuracy
- Submit MJML specification updates
- Report validation edge cases

---

**The MJML Validation System ensures every generated email template is professional, accessible, and error-free! 🎉**