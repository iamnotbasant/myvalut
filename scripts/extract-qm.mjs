import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

const qmIdx = code.indexOf('function Qm(');
if (qmIdx !== -1) {
  console.log('--- function Qm in route-DTsoYpM6.js ---');
  console.log(code.substring(qmIdx, qmIdx + 3000));
}
