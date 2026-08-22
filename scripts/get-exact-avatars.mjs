import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

$('div.group\\/bookmarkcard').each((i, el) => {
  const name = $(el).find('span.truncate.font-medium').first().text().trim();
  const handle = $(el).find('span.truncate.text-muted-foreground').first().text().trim();
  const avatarImg = $(el).find('div.flex.items-center.gap-2 img').attr('src');
  const previewImg = $(el).find('img').not('div.flex.items-center.gap-2 img').attr('src');
  console.log(`Author: ${name} (${handle}) | Avatar: ${avatarImg} | Preview: ${previewImg}`);
});
