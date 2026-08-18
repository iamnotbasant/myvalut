import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

const mainIdx = code.indexOf('"main"');
if (mainIdx !== -1) {
  console.log('--- Context around "main" in route-DTsoYpM6.js ---');
  console.log(code.substring(Math.max(0, mainIdx - 800), Math.min(code.length, mainIdx + 1500)));
}
