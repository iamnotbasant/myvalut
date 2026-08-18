import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');

// Find all code around "Maya Chen" and "Save your first bookmark"
const mayaIdx = code.indexOf('Maya Chen');
if (mayaIdx !== -1) {
  console.log('--- Context around Maya Chen ---');
  console.log(code.substring(Math.max(0, mayaIdx - 500), Math.min(code.length, mayaIdx + 2500)));
}

const firstBookmarkIdx = code.indexOf('Save your first bookmark');
if (firstBookmarkIdx !== -1) {
  console.log('\n--- Context around Empty State ---');
  console.log(code.substring(Math.max(0, firstBookmarkIdx - 300), Math.min(code.length, firstBookmarkIdx + 1200)));
}
