import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// 1. Copy faltu/Stashr_files into public/assets/
const srcDir = 'faltu/Stashr_files';
const destDir = 'public/stashr_files';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log('Copied all assets from faltu/Stashr_files to public/stashr_files');

// 2. Read and parse faltu/Stashr.html
const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

console.log('Title:', $('title').text());

// Inspect all cards
const cards = [];
$('div.group\\/bookmarkcard').each((i, el) => {
  const authorName = $(el).find('span.truncate.font-medium').first().text().trim();
  const authorHandle = $(el).find('span.truncate.text-muted-foreground').first().text().trim();
  const avatarImg = $(el).find('img[data-slot="avatar-image"]').attr('src');
  const title = $(el).find('p.font-semibold.text-strong').text().trim();
  const text = $(el).find('div.space-y-3 p').text().trim();
  const imgPreview = $(el).find('img[data-slot="image"]').attr('src');
  const videoThumbnail = $(el).find('img[src*="video"], img[src*="preview"], img[src*="webp"]').first().attr('src');
  const date = $(el).find('span.text-muted-foreground.text-xs').text().trim();
  
  // Tags
  const tags = [];
  $(el).find('button:has(span[data-slot="badge"]), button:has(div.rounded-full)').each((_, tagEl) => {
    const tagName = $(tagEl).text().trim();
    if (tagName && !tagName.startsWith('+')) {
      tags.push(tagName);
    }
  });

  // Check platform from icon or class
  const isX = $(el).find('svg path[d*="18.244"]').length > 0 || $(el).text().includes('@') || $(el).find('svg').hasClass('size-2.5');

  cards.push({
    index: i,
    authorName,
    authorHandle,
    avatarImg,
    title,
    text,
    imgPreview: imgPreview || videoThumbnail,
    date,
    tags,
    rawHtml: $.html(el)
  });
});

console.log(`Found ${cards.length} cards in faltu/Stashr.html`);
fs.writeFileSync('scripts/parsed_faltu_cards.json', JSON.stringify(cards, null, 2), 'utf8');
console.log('Saved parsed_faltu_cards.json');
