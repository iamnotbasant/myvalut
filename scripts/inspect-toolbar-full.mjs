import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const toolbarStart = main.indexOf('<div class="flex h-[54px] shrink-0 items-stretch justify-between gap-4 border-b pr-2 pl-1.5">');
if (toolbarStart !== -1) {
  console.log('--- SECONDARY TOOLBAR FULL HTML ---');
  console.log(main.substring(toolbarStart, toolbarStart + 4000));
}
