import fs from 'fs';

const viewTabsCode = fs.readFileSync('scripts/extracted-chunks/ViewTabs-Bjh2T3QA.js', 'utf8');
const routeDGCode = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');
const routeDTCode = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

console.log('=== ViewTabs-Bjh2T3QA.js length:', viewTabsCode.length);
console.log('=== route-DGucVYvQ.js length:', routeDGCode.length);
console.log('=== route-DTsoYpM6.js length:', routeDTCode.length);

// Let's find all className strings in ViewTabs
const classMatches = viewTabsCode.match(/className:\s*["`][^"`]+["`]/g) || [];
console.log('\n--- ViewTabs ClassNames ---');
console.log([...new Set(classMatches)].slice(0, 50));

// Let's find all className strings in route-DGucVYvQ.js
const classMatchesDG = routeDGCode.match(/className:\s*["`][^"`]+["`]/g) || [];
console.log('\n--- Route DG ClassNames ---');
console.log([...new Set(classMatchesDG)].slice(0, 50));

// Let's find all className strings in route-DTsoYpM6.js
const classMatchesDT = routeDTCode.match(/className:\s*["`][^"`]+["`]/g) || [];
console.log('\n--- Route DT ClassNames ---');
console.log([...new Set(classMatchesDT)].slice(0, 50));
