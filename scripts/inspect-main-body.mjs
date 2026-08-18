import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const headerEnd = main.indexOf('</header>');
const bodyAfterHeader = main.substring(headerEnd + 9);

console.log('--- BODY AFTER HEADER (First 4000 chars) ---');
const cleanBody = bodyAfterHeader.replace(/data:image\/[^"]+/g, 'DATA_URL');
console.log(cleanBody.substring(0, 4000));
