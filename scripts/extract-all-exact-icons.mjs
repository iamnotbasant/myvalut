import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

// Let's find all unique SVGs and their contexts
const svgs = [];
$('svg').each((i, el) => {
  const parent = $(el).parent().attr('class') || '';
  const label = $(el).parent().attr('aria-label') || $(el).attr('aria-label') || $(el).parent().text().trim();
  const rawSvg = $.html(el);
  svgs.push({
    index: i,
    label,
    parentClass: parent.substring(0, 100),
    svg: rawSvg
  });
});

fs.writeFileSync('scripts/all_svgs_extracted.json', JSON.stringify(svgs, null, 2), 'utf8');
console.log(`Extracted ${svgs.length} SVGs from html.htm`);
