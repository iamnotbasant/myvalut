import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

// Find ViewTabs in html
const viewTabsIdx = html.indexOf('aria-label="Grid"');
console.log('--- VIEWTABS REGION ---');
console.log(html.substring(viewTabsIdx - 150, viewTabsIdx + 2000));
