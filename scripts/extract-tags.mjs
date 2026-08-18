import fs from 'fs';

const dtCode = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');
const dgCode = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');

function findTagUsage(code, tag) {
  const matches = [...code.matchAll(new RegExp(`["']${tag}["']`, 'g'))];
  console.log(`Tag <${tag}> in file: ${matches.length} occurrences`);
}

console.log('--- route-DTsoYpM6.js tags: ---');
['aside', 'nav', 'header', 'main', 'footer', 'button', 'input', 'form'].forEach(t => findTagUsage(dtCode, t));

console.log('\n--- route-DGucVYvQ.js tags: ---');
['aside', 'nav', 'header', 'main', 'footer', 'button', 'input', 'form'].forEach(t => findTagUsage(dgCode, t));
