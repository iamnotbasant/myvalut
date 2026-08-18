import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

const aside = $('aside');
fs.writeFileSync('scripts/exact_aside.html', aside.html(), 'utf8');
console.log('Saved exact_aside.html');

// Also extract all 12 cards with their full HTML and text details
const cards = [];
$('[class*="group/bookmarkcard"]').each((i, el) => {
  const card = $(el);
  const author = card.find('.truncate.font-medium.text-strong').first().text().trim();
  const title = card.find('> p.font-semibold.text-strong').first().text().trim();
  const text = card.find('.space-y-3').first().text().trim();
  const tags = [];
  card.find('button .truncate').each((_, t) => {
    tags.push($(t).text().trim());
  });
  const date = card.find('.text-muted-foreground.text-xs').last().text().trim();
  const img = card.find('img').attr('src') || card.find('img').attr('data-src') || null;
  const rawHtml = card.html();
  
  cards.push({
    id: `bm-${i + 1}`,
    author,
    title,
    text,
    tags,
    date,
    img,
    rawSnippet: rawHtml.substring(0, 300)
  });
});

fs.writeFileSync('scripts/extracted_cards.json', JSON.stringify(cards, null, 2), 'utf8');
console.log('Saved extracted_cards.json with', cards.length, 'cards');
