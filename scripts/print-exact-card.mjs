import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const cardStart = main.indexOf('group/bookmarkcard');
if (cardStart !== -1) {
  console.log('--- EXACT BOOKMARK CARD HTML ---');
  const cardHTML = main.substring(cardStart - 12, cardStart + 2500);
  console.log(cardHTML);
}
