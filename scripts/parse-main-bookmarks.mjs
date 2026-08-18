import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

// Find all article or card tags in main
const articles = main.match(/<article[\s\S]*?<\/article>/g) || [];
console.log('Total articles / cards in main:', articles.length);

if (articles.length > 0) {
  console.log('\n--- FIRST ARTICLE RAW HTML ---');
  console.log(articles[0].substring(0, 2500));
}

// Extract the toolbar inside main
const headerIdx = main.indexOf('<header');
const headerEnd = main.indexOf('</header>');
if (headerIdx !== -1 && headerEnd !== -1) {
  console.log('\n--- MAIN HEADER HTML ---');
  console.log(main.substring(headerIdx, headerEnd + 9));
}

// Find any toolbar below header
const toolbarIdx = main.indexOf('Add filters');
if (toolbarIdx !== -1) {
  console.log('\n--- TOOLBAR AROUND "Add filters" ---');
  console.log(main.substring(Math.max(0, toolbarIdx - 200), Math.min(main.length, toolbarIdx + 1500)));
}
