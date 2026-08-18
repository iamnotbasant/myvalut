import fs from 'fs';
import path from 'path';

function inspectFile(name) {
  const filePath = path.join('scripts/extracted-chunks', name);
  if (fs.existsSync(filePath)) {
    console.log(`\n=================== ${name} ===================`);
    console.log(fs.readFileSync(filePath, 'utf8'));
  }
}

inspectFile('colors-Cca48CUE.js');
inspectFile('PlatformIcon-CEsZ3APA.js');
inspectFile('tag-g8NT4_zJ.js');
inspectFile('use-grid-columns-A00igA0Y.js');
inspectFile('UserAvatar-Doh7dSw_.js');
