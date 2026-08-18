import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const toolbarStart = main.indexOf('<div class="flex h-[54px] shrink-0 items-stretch justify-between gap-4 border-b pr-2 pl-1.5">');
const toolbarHTML = main.substring(toolbarStart, toolbarStart + 8000);

const buttons = toolbarHTML.match(/<button[\s\S]*?<\/button>/g) || [];
console.log('Total buttons in toolbar:', buttons.length);

buttons.forEach((b, i) => {
  const ariaLabel = b.match(/aria-label="([^"]+)"/)?.[1] || 'no-label';
  const text = b.replace(/<[^>]+>/g, '').trim();
  console.log(`Button #${i}: label="${ariaLabel}", text="${text}"`);
});
