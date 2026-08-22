import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const searchIndex = html.indexOf('Search bookmarks');
if (searchIndex !== -1) {
  console.log('--- FOUND SEARCH / TOOLBAR ---');
  console.log(html.substring(Math.max(0, searchIndex - 1500), searchIndex + 2500));
} else {
  console.log('Search bookmarks placeholder not found directly in static HTML (rendered via JS).');
}
