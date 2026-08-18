import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');

// Find where oe and re are created
const searchInputIdx = code.indexOf('Search bookmarks');
if (searchInputIdx !== -1) {
  console.log('\n--- Context around "Search bookmarks" ---');
  console.log(code.substring(Math.max(0, searchInputIdx - 500), Math.min(code.length, searchInputIdx + 1500)));
}
