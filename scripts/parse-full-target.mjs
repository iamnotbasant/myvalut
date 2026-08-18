import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

console.log('=== SIDEBAR (<aside>) ===');
const aside = $('aside');
console.log('Aside outer classes:', aside.attr('class'));
console.log('Aside HTML (first 2000 chars):');
console.log(aside.html()?.substring(0, 2000));
console.log('\nAside HTML (last 2000 chars):');
const asideHtml = aside.html() || '';
console.log(asideHtml.substring(Math.max(0, asideHtml.length - 2000)));

console.log('\n=== CARD COUNT ===');
const cards = $('[class*="group/bookmarkcard"]');
console.log('Found bookmark cards:', cards.length);

cards.slice(0, 5).each((i, el) => {
  console.log(`\n--- Card ${i + 1} ---`);
  console.log($(el).html()?.substring(0, 800));
});
