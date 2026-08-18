import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const searchIdx = main.indexOf('Search bookmarks...');
if (searchIdx !== -1) {
  console.log('--- REST OF TOOLBAR AFTER SEARCH ---');
  console.log(main.substring(searchIdx, searchIdx + 4000));
}
