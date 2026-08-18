import fs from 'fs';

const aside = fs.readFileSync('scripts/extracted_aside.html', 'utf8');
const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

console.log('--- ASIDE FULL DECONSTRUCTION ---');
// Let's print out all direct sections of aside
const asideClean = aside.replace(/data:image\/[^"]+/g, 'DATA_URL');
console.log(asideClean.substring(0, 4000));

console.log('\n--- MAIN FIRST 4000 CHARS ---');
const mainClean = main.replace(/data:image\/[^"]+/g, 'DATA_URL');
console.log(mainClean.substring(0, 4000));
