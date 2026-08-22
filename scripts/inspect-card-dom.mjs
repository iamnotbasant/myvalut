import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

$('div.group\\/bookmarkcard').each((i, el) => {
  const text = $(el).text();
  if (text.includes('Wail Beghoul') || text.includes('illbedeletedvrysoon')) {
    console.log(`\n=================== CARD ${i} ===================`);
    console.log($.html(el));
  }
});
