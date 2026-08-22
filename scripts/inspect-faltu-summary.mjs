import fs from 'fs';

const rawCards = JSON.parse(fs.readFileSync('scripts/parsed_faltu_cards.json', 'utf8'));

console.log('Total cards:', rawCards.length);
rawCards.forEach((c, idx) => {
  console.log(`[${idx}] ${c.authorName} (${c.authorHandle || 'reddit'}) | Title: ${c.title || '(none)'} | Img: ${c.imgPreview || '(none)'} | Date: ${c.date} | Tags: ${c.tags.join(', ')}`);
});
