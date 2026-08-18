import fs from 'fs';

const aside = fs.readFileSync('scripts/extracted_aside.html', 'utf8');
const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');
const full = aside + '\n' + main;

const svgMatches = full.match(/<svg[^>]*>([\s\S]*?)<\/svg>/g) || [];
console.log('Total SVGs found in live HTML:', svgMatches.length);

const uniqueSvgs = [...new Set(svgMatches)];
console.log('Unique SVGs count:', uniqueSvgs.length);

fs.writeFileSync('scripts/extracted_all_svgs.json', JSON.stringify(uniqueSvgs, null, 2), 'utf8');
console.log('Saved extracted_all_svgs.json');
