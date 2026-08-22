import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

const gridDiv = $('main div.p-4 > div');
console.log("Grid Div classes:", gridDiv.attr('class'));
gridDiv.children().each((i, el) => {
  console.log(`Grid child ${i}: class="${$(el).attr('class')}", tag=${$(el).prop('tagName')}`);
  $(el).children().each((ci, cel) => {
    console.log(`  Subchild ${ci}: class="${$(cel).attr('class')}", tag=${$(cel).prop('tagName')}`);
  });
});
