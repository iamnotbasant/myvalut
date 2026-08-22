import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

console.log("=== Inspecting Mosaic view in faltu/Stashr.html ===");

// Search for views in faltu
$('*').each((i, el) => {
  const cls = $(el).attr('class') || '';
  if (cls.includes('columns-') || cls.includes('grid-cols') || cls.includes('gap-4') || cls.includes('flex-1 flex flex-col')) {
    console.log("Container:", cls);
    console.log("Children count:", $(el).children().length);
    console.log("Child classes:", $(el).children().first().attr('class'));
    console.log("---");
  }
});
