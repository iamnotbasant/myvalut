import fs from 'fs';

const indexFile = fs.readFileSync('C:/Users/httpb/.gemini/antigravity-ide/brain/25fa4498-5fad-4b1a-9e84-7492892eb1bf/.system_generated/steps/44/content.md', 'utf8');

const svgDefs = indexFile.match(/d:\s*["'][^"']+["']/g) || [];
console.log('Total SVG paths in bundle:', svgDefs.length);

const brandingIcon = fs.readFileSync('public/branding/icon.svg', 'utf8');
console.log('\n--- Branding Icon SVG ---');
console.log(brandingIcon.substring(0, 300));
