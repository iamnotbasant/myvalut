import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

console.log("=== Main tag & containers in faltu/Stashr.html ===");
$('main').each((i, el) => {
  console.log("MAIN CLASS:", $(el).attr('class'));
  console.log("MAIN direct children:");
  $(el).children().each((ci, cel) => {
    console.log(`  Child ${ci}:`, $(cel).attr('class'), $(cel).prop('tagName'));
    $(cel).children().each((cgi, cgel) => {
      console.log(`    Subchild ${cgi}:`, $(cgel).attr('class'), $(cgel).prop('tagName'));
    });
  });
});
