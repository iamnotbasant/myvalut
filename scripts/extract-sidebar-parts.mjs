import fs from 'fs';

const code = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');

function inspectFn(name) {
  const idx = code.indexOf(`function ${name}(`);
  if (idx !== -1) {
    console.log(`\n=== function ${name} ===`);
    console.log(code.substring(idx, idx + 1500));
  }
}

inspectFn('Vm');
inspectFn('Gm');
inspectFn('$m');
inspectFn('Wm');
