import fs from 'fs';

const content = fs.readFileSync('C:/Users/httpb/.gemini/antigravity-ide/brain/25fa4498-5fad-4b1a-9e84-7492892eb1bf/.system_generated/steps/44/content.md', 'utf8');

const jsAssets = content.match(/\/assets\/[a-zA-Z0-9_\-\.]+\.js/g) || [];
console.log('Unique JS assets:', [...new Set(jsAssets)]);

// Find all lazy imported chunks or route definitions
const dynamicImports = content.match(/import\(['"][^'"]+['"]\)/g) || [];
console.log('Dynamic imports:', [...new Set(dynamicImports)]);

// Find route paths
const pathMatches = content.match(/path:\s*['"][^'"]+['"]/g) || [];
console.log('Path matches:', [...new Set(pathMatches)]);
