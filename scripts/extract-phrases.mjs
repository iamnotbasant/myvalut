import fs from 'fs';

const code1 = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');
const code2 = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');

function extractPhrases(text) {
  const matches = text.match(/"([^"\\]|\\.)*"/g) || [];
  return [...new Set(matches.map(m => m.slice(1, -1)))]
    .filter(s => s.length >= 3 && !s.startsWith('./') && !s.includes(';') && !s.includes('{') && /[A-Z]/.test(s));
}

console.log('--- Phrases in route-DTsoYpM6.js ---');
console.log(extractPhrases(code1).filter(s => s.length > 5 && s.length < 50).slice(0, 100));

console.log('\n--- Phrases in route-DGucVYvQ.js ---');
console.log(extractPhrases(code2).filter(s => s.length > 5 && s.length < 50).slice(0, 100));
