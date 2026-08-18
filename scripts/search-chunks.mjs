import fs from 'fs';
import path from 'path';

const dir = 'scripts/extracted-chunks';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  console.log(`=== File: ${file} (${content.length} chars) ===`);
  
  // Search for bookmarks, sidebar, search, cards, tags
  const keywords = ['bookmarks', 'bookmark', 'sidebar', 'All bookmarks', 'Tags', 'Search', 'Filter', 'grid', 'list', 'favorite', 'archive'];
  for (const kw of keywords) {
    const count = (content.match(new RegExp(kw, 'gi')) || []).length;
    if (count > 0) {
      console.log(`  - Keyword "${kw}": ${count} occurrences`);
    }
  }
}
