import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

const inner = $('main div.p-4 > div > div > div');
console.log("Inner style/classes:", inner.attr('class'), inner.attr('style'));
inner.children().each((i, el) => {
  console.log(`Column ${i}: class="${$(el).attr('class')}", style="${$(el).attr('style')}", children=${$(el).children().length}`);
});
