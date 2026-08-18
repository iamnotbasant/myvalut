import fs from 'fs';
import path from 'path';

const files = [
  'archived-Bn8xqf1M.js',
  'account-YtJ0mOh1.js',
  'appearance-BOc0102d.js',
  'billing-C7ElHunr.js',
  'tags-DtFwoTXK.js',
  'index-SxYT1nKx.js',
  'index-BxkJ5lKZ.js',
  'index-DRsSBkXt.js',
  'index-C4suEvxg.js'
];

for (const file of files) {
  const filePath = path.join('scripts/extracted-chunks', file);
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, 'utf8');
    console.log(`\n=================== FILE: ${file} (${code.length} chars) ===================`);
    
    // Extract JSX classNames
    const classes = [...code.matchAll(/className:\s*["`][^"`]+["`]/g)].map(m => m[0]);
    console.log('Sample classes:', [...new Set(classes)].slice(0, 15));
    
    // Extract UI text strings
    const texts = [...code.matchAll(/children:\s*["'`]([^"'`]{2,80})["'`]/g)].map(m => m[1]);
    console.log('Sample text labels:', [...new Set(texts)].slice(0, 20));
  }
}
