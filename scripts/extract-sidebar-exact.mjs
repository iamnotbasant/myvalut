import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

// Find the sidebar component definition in route-DTsoYpM6.js
// Look for strings like "Bookmarks", "Archived", "Creators", "Connections"
const bookmarksIdx = code.indexOf('"Bookmarks"');
if (bookmarksIdx !== -1) {
  console.log('--- Context around Bookmarks Nav in route-DTsoYpM6.js ---');
  console.log(code.substring(Math.max(0, bookmarksIdx - 1000), Math.min(code.length, bookmarksIdx + 2000)));
}
