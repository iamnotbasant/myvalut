import fs from 'fs';

const cssContent = fs.readFileSync('C:/Users/httpb/.gemini/antigravity-ide/brain/25fa4498-5fad-4b1a-9e84-7492892eb1bf/.system_generated/steps/38/content.md', 'utf8');

// Find all CSS variable declarations
const varMatches = cssContent.match(/--[a-zA-Z0-9_-]+:\s*[^;{}]+/g) || [];
console.log('CSS Variables:');
const uniqueVars = [...new Set(varMatches)];
console.log(uniqueVars.slice(0, 100));

// Find root and dark rules
const rootMatches = cssContent.match(/(:root|\.dark)[^{]*\{[^}]*\}/g) || [];
console.log('\nRoot/Dark rules:', rootMatches);
