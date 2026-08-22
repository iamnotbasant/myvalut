import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

// Find the header or main toolbar
const headerIndex = html.indexOf('Bookmarks');
if (headerIndex !== -1) {
  console.log('--- FOUND HEADER NEAR Bookmarks ---');
  console.log(html.substring(Math.max(0, headerIndex - 1000), headerIndex + 3000));
} else {
  console.log('Bookmarks not found directly in HTML');
}
