import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

const cards = [];
$('[class*="group/bookmarkcard"]').each((i, el) => {
  const card = $(el);
  const author = card.find('.truncate.font-medium.text-strong').first().text().trim();
  const title = card.find('> p.font-semibold.text-strong').first().text().trim();
  
  // Extract all paragraphs in the content block
  const paragraphs = [];
  card.find('.space-y-3 p').each((_, p) => {
    paragraphs.push($(p).text().trim());
  });
  const text = paragraphs.join('\n\n');
  
  const tags = [];
  card.find('button .truncate').each((_, t) => {
    tags.push($(t).text().trim());
  });
  const date = card.find('.text-muted-foreground.text-xs').last().text().trim();
  
  // Check image src
  const img = card.find('img').attr('src') || card.find('img').attr('data-src') || null;
  
  // Check platform icon / style:
  // Usually the platform circle has style="background-color: rgb(255, 69, 0)" for Reddit or svg for X
  const platformStyle = card.find('.flex.items-center.justify-center.overflow-hidden.rounded-full.size-4').attr('style') || '';
  const isReddit = platformStyle.includes('255, 69, 0') || card.find('svg path').length > 0;
  
  cards.push({
    index: i,
    author,
    title,
    text,
    tags,
    date,
    hasImage: !!img,
    imgLength: img ? img.length : 0,
    platformStyle
  });
});

console.log(JSON.stringify(cards, null, 2));
