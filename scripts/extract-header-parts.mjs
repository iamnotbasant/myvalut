import fs from 'fs';

const dtCode = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');
const dgCode = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');

function inspectFn(code, name) {
  const idx = code.indexOf(`function ${name}(`);
  if (idx !== -1) {
    console.log(`\n=== function ${name} ===`);
    console.log(code.substring(idx, idx + 2000));
  }
}

inspectFn(dtCode, 'Xd');
inspectFn(dtCode, 'eu');
inspectFn(dtCode, 'tu');

console.log('\n--- Route DG Export ---');
const dgExport = dgCode.indexOf('export{');
if (dgExport !== -1) {
  console.log(dgCode.substring(dgExport - 1000, dgExport + 100));
}
