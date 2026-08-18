import fs from 'fs';
import path from 'path';

function inspect(name) {
  const filePath = path.join('scripts/extracted-chunks', name);
  if (fs.existsSync(filePath)) {
    console.log(`\n=================== ${name} ===================`);
    console.log(fs.readFileSync(filePath, 'utf8').substring(0, 3000));
  }
}

inspect('ViewTabs-Bjh2T3QA.js');
inspect('use-view-CKBwKyrL.js');
