import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

// Extract exact SVGs from sidebar
const sidebarSvgMap = {};
$('aside svg').each((i, el) => {
  const text = $(el).parent().text().trim() || $(el).parent().attr('aria-label') || `svg-${i}`;
  sidebarSvgMap[text] = $.html(el);
});

console.log('Sidebar SVGs found:', Object.keys(sidebarSvgMap));

// Extract exact SVGs from header & toolbar
const toolbarSvgMap = {};
$('main header svg, main [class*="h-[54px]"] svg').each((i, el) => {
  const text = $(el).parent().text().trim() || $(el).parent().attr('aria-label') || `tb-svg-${i}`;
  toolbarSvgMap[text] = $.html(el);
});

console.log('Toolbar SVGs found:', Object.keys(toolbarSvgMap));

// Let's print out the exact SVG code for Bookmarks, Archived, Creators, Connections, Grid, Row, Timeline, Mosaic, Search, Shuffle, Select, etc.
fs.writeFileSync('scripts/extracted_clean_svgs.json', JSON.stringify({ sidebar: sidebarSvgMap, toolbar: toolbarSvgMap }, null, 2), 'utf8');
console.log('Saved extracted_clean_svgs.json');
