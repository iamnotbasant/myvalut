import fs from 'fs';

const html = fs.readFileSync('html.htm', 'utf8');
console.log('html.htm size:', html.length, 'bytes');

// Let's check for <aside>, <nav>, <main>, <header>, cards
const hasAside = html.includes('<aside');
const hasMain = html.includes('<main');
const hasHeader = html.includes('<header');
console.log({ hasAside, hasMain, hasHeader });

// Let's inspect the body tag and first few top-level containers
const bodyIdx = html.indexOf('<body');
if (bodyIdx !== -1) {
  console.log('\n--- Body opening snippet ---');
  console.log(html.substring(bodyIdx, bodyIdx + 1500));
}
