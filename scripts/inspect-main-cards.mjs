import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

// Find occurrences of links or text in main
const hrefMatches = [...main.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
console.log('Total hrefs in main:', hrefMatches.length);
console.log('Sample hrefs in main:', hrefMatches.slice(0, 20));

// Find div with card classes
const cardMatches = [...main.matchAll(/class="([^"]*rounded-xl[^"]*)"/g)].map(m => m[1]);
console.log('\nSample rounded-xl classes in main:', cardMatches.slice(0, 10));
