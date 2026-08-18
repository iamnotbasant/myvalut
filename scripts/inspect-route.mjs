import fs from 'fs';

const file = 'scripts/extracted-chunks/route-DTsoYpM6.js';
const code = fs.readFileSync(file, 'utf8');

// Find JSX elements or key text strings
const textMatches = code.match(/["'>][A-Za-z0-9\s,\.\?!_\-\/]{3,50}[<"']/g) || [];
console.log('Text samples:', [...new Set(textMatches.map(s => s.slice(1, -1)))].slice(0, 100));

// Find SVG paths / Lucide icon names
const svgMatches = code.match(/d="[^"]+"/g) || [];
console.log('SVG path count:', svgMatches.length);

// Extract sidebar structure
const sidebarIdx = code.indexOf('sidebar');
if (sidebarIdx !== -1) {
  console.log('\n--- Sidebar Code Snippet ---');
  console.log(code.substring(Math.max(0, sidebarIdx - 200), Math.min(code.length, sidebarIdx + 1000)));
}
