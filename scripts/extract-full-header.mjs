import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const startIdx = html.indexOf('<header');
const mainIdx = html.indexOf('<main');

console.log('--- ENTIRE HEADER AND TOOLBAR REGION ---');
console.log(html.substring(startIdx, startIdx + 8000));
