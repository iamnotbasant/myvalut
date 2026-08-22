import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('structure.html', 'utf8');
const $ = cheerio.load(html);

// Find the container holding the bookmark cards
const cardParent = $('div.group\\/bookmarkcard').first().parent();
console.log('Card parent tag and classes:', cardParent.prop('tagName'), cardParent.attr('class'));
console.log('Card parent style:', cardParent.attr('style'));
console.log('Card grand-parent tag and classes:', cardParent.parent().prop('tagName'), cardParent.parent().attr('class'));

// Let's check how columns are laid out
const allParentChildren = cardParent.children();
console.log('Number of children in card parent:', allParentChildren.length);
allParentChildren.each((i, el) => {
  console.log(`Child ${i}:`, $(el).prop('tagName'), $(el).attr('class'));
});
