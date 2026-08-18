import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

const timelineIdx = main.indexOf('Timeline');
if (timelineIdx !== -1) {
  console.log('--- RIGHT SIDE OF TOOLBAR ---');
  console.log(main.substring(timelineIdx, timelineIdx + 3000));
}
