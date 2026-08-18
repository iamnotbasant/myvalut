import fs from 'fs';

function inspect(filename) {
  const code = fs.readFileSync(`scripts/extracted-chunks/${filename}`, 'utf8');
  console.log(`\n=================== ${filename} ===================`);
  console.log(code.substring(0, 3000));
}

inspect('account-YtJ0mOh1.js');
inspect('index-BxkJ5lKZ.js');
