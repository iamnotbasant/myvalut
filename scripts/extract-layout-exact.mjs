import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

// Search for the top-level app layout structure
const layoutIdx = code.indexOf('h-screen');
if (layoutIdx !== -1) {
  console.log('--- Context around h-screen ---');
  console.log(code.substring(Math.max(0, layoutIdx - 300), Math.min(code.length, layoutIdx + 1200)));
}
