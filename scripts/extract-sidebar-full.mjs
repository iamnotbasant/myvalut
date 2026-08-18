import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

// Find the sidebar layout component
const sidebarClasses = [
  'w-64', 'w-60', 'w-56', 'w-52', 'w-72',
  'group-data-[collapsible=icon]',
  'sidebar',
  'Stashr'
];

for (const sc of sidebarClasses) {
  const matches = [...code.matchAll(new RegExp(sc, 'g'))];
  console.log(`Class/Keyword "${sc}": ${matches.length} occurrences`);
}

// Extract the section around the logo / sidebar header
const logoIdx = code.indexOf('/branding/icon.svg');
if (logoIdx !== -1) {
  console.log('\n--- Context around Branding Icon ---');
  console.log(code.substring(Math.max(0, logoIdx - 300), Math.min(code.length, logoIdx + 1000)));
}
