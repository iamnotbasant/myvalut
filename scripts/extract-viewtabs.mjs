import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const viewTabsIdx = html.indexOf('aria-label="Grid"');
console.log(html.substring(viewTabsIdx, viewTabsIdx + 3000));
