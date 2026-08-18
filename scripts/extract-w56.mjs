import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

const w56Idx = code.indexOf('w-56');
if (w56Idx !== -1) {
  console.log('--- Context around w-56 ---');
  console.log(code.substring(Math.max(0, w56Idx - 400), Math.min(code.length, w56Idx + 1500)));
}
