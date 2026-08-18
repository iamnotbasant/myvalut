import fs from 'fs';

const html = fs.readFileSync('html.htm', 'utf8');

// Extract <aside ... </aside>
const asideStart = html.indexOf('<aside');
const asideEnd = html.indexOf('</aside>', asideStart);
if (asideStart !== -1 && asideEnd !== -1) {
  const asideHTML = html.substring(asideStart, asideEnd + 8);
  fs.writeFileSync('scripts/extracted_aside.html', asideHTML, 'utf8');
  console.log('Saved extracted_aside.html (' + asideHTML.length + ' bytes)');
}

// Extract <main ... </main>
const mainStart = html.indexOf('<main');
const mainEnd = html.lastIndexOf('</main>');
if (mainStart !== -1 && mainEnd !== -1) {
  const mainHTML = html.substring(mainStart, mainEnd + 7);
  fs.writeFileSync('scripts/extracted_main.html', mainHTML, 'utf8');
  console.log('Saved extracted_main.html (' + mainHTML.length + ' bytes)');
}

// Let's inspect the first 2000 chars of extracted_aside.html
const asideSnippet = fs.readFileSync('scripts/extracted_aside.html', 'utf8');
console.log('\n--- ASIDE SNIPPET (First 2000 chars) ---');
console.log(asideSnippet.substring(0, 2000));
