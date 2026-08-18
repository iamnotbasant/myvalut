import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const mosaicIdx = main.indexOf('Mosaic');
if (mosaicIdx !== -1) {
  console.log('--- AFTER MOSAIC ---');
  console.log(main.substring(mosaicIdx, mosaicIdx + 3000));
}
