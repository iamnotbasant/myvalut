import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const rowIdx = html.indexOf('aria-label="Row"');
console.log(html.substring(rowIdx, rowIdx + 3000));
