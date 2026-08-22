import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

const contentDiv = $('main > div.flex-1 > div');
console.log("Content div HTML structure:");
console.log("Classes of content children:");
contentDiv.children().each((i, el) => {
  console.log(`Child ${i}: class="${$(el).attr('class')}", tag=${$(el).prop('tagName')}`);
  $(el).children().each((ci, cel) => {
    console.log(`  Subchild ${ci}: class="${$(cel).attr('class')}", tag=${$(cel).prop('tagName')}`);
  });
});
