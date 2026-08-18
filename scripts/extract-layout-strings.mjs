import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

// Find all string literals that look like UI labels or button texts
const stringRegex = /"([^"\\]|\\.)*"/g;
const matches = code.match(stringRegex) || [];
const cleanStrings = matches
  .map(m => m.slice(1, -1))
  .filter(s => s.length > 2 && s.length < 60 && !s.startsWith('./') && !s.includes(';') && !s.includes('{'))
  .filter(s => !s.startsWith('http') && !s.startsWith('rgba') && !s.startsWith('var('));

console.log('Total UI strings found:', cleanStrings.length);
console.log('Sample UI strings:');
console.log([...new Set(cleanStrings)].slice(0, 150));
