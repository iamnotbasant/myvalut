import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

function extractSvgNear(text, length = 1000) {
  const idx = html.indexOf(text);
  if (idx === -1) return 'NOT FOUND';
  const start = html.lastIndexOf('<svg', idx + 200);
  const end = html.indexOf('</svg>', start);
  return html.substring(start, end + 6);
}

console.log('Sidebar Toggle:', extractSvgNear('Bookmarks</span>'));
console.log('Extension Puzzle:', extractSvgNear('Stashr extension installed'));
console.log('Grid Tab:', extractSvgNear('aria-label="Grid"'));
console.log('Row Tab:', extractSvgNear('aria-label="Row"'));
console.log('Timeline Tab:', extractSvgNear('aria-label="Timeline"'));
console.log('Mosaic Tab:', extractSvgNear('aria-label="Mosaic"'));
console.log('Search Icon:', extractSvgNear('aria-label="Search bookmarks"'));
console.log('Shuffle Icon:', extractSvgNear('aria-label="Shuffle"'));
console.log('Add Filters:', extractSvgNear('Add Filters'));
console.log('Select Icon:', extractSvgNear('Select'));
console.log('Collection Button:', extractSvgNear('Collection'));
