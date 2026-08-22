import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const toolbarIdx = html.indexOf('aria-label="Grid"');

console.log('--- ENTIRE TOOLBAR MARKUP ---');
console.log(html.substring(toolbarIdx - 200, toolbarIdx + 4000));
