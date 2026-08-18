import fs from 'fs';
import path from 'path';

const chunks = [
  'PlatformIcon-CEsZ3APA.js',
  'filter-menu-oyalYEMa.js',
  'ViewTabs-Bjh2T3QA.js',
  'TagSelector-petweHfi.js',
  'UserAvatar-Doh7dSw_.js',
  'tag-g8NT4_zJ.js',
  'colors-Cca48CUE.js',
  'Settings01Icon-ocyK-NEa.js',
  'ChatFeedback01Icon-CCYMY1xO.js',
  'SparklesIcon-CdRvcB8R.js',
  'use-view-CKBwKyrL.js',
  'use-grid-columns-A00igA0Y.js',
  'PortableContent-ClJoynGP.js',
  'Pricing-DYzU2CSk.js',
  'FeedbackDialog-1cZqQHsx.js'
];

const outDir = 'scripts/extracted-chunks';

async function fetchMore() {
  for (const chunk of chunks) {
    const url = `https://stashr.me/assets/${chunk}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(outDir, chunk), text, 'utf8');
        console.log(`Saved ${chunk} (${text.length} bytes)`);
      }
    } catch (e) {
      console.error(`Failed ${chunk}`, e.message);
    }
  }
}

fetchMore();
