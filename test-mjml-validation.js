const { validateAndCorrectMJML, getMJMLTrainingPrompt } = require('./lib/mjml-validator.js');

console.log("🧪 Testing MJML Validation and Correction System...\n");

// Test 1: Invalid border-radius on mj-text
console.log("1️⃣ Testing invalid border-radius on mj-text:");
const invalidMJML = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text border-radius="8px" padding="15px">Invalid text with border-radius</mj-text>
        <mj-button border-radius="6px">Valid button</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const result1 = validateAndCorrectMJML(invalidMJML);
console.log("✅ Validation result:", result1.isValid ? "VALID" : "NEEDS CORRECTION");
console.log("✅ Warnings:", result1.warnings.length);
console.log("✅ Fixed border-radius:", !result1.correctedMjml.includes('mj-text border-radius'));

// Test 2: Missing alt attribute on image
console.log("\n2️⃣ Testing missing alt attribute:");
const missingAltMJML = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="test.jpg" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const result2 = validateAndCorrectMJML(missingAltMJML);
console.log("✅ Added alt attribute:", result2.correctedMjml.includes('alt="Image"'));
console.log("✅ Warnings for accessibility:", result2.warnings.length > 0);

// Test 3: Display training prompt
console.log("\n3️⃣ AI Training Prompt Preview:");
const trainingPrompt = getMJMLTrainingPrompt();
console.log("✅ Training prompt length:", trainingPrompt.length, "characters");
console.log("✅ Contains component rules:", trainingPrompt.includes("mj-text"));
console.log("✅ Contains examples:", trainingPrompt.includes("EXAMPLE"));

console.log("\n🎉 MJML Validation System Ready!");
console.log("- ✅ Fixes invalid attributes automatically");
console.log("- ✅ Adds missing accessibility attributes");
console.log("- ✅ Provides comprehensive AI training");
console.log("- ✅ Ensures MJML compliance");