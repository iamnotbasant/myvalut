import fs from 'fs';
import path from 'path';

const chunks = [
  'route-BlCvFUmG.js',
  'route-BAcCCwYH.js',
  'route-DGucVYvQ.js',
  'route-Cb1iZGMo.js',
  'route-DTsoYpM6.js',
  'archived-Bn8xqf1M.js',
  '_BookmarkId-BMeCxVqy.js',
  'tags-DtFwoTXK.js',
  'appearance-BOc0102d.js',
  'billing-C7ElHunr.js',
  'authorized-apps-BMiw7W7s.js',
  'api-keys-DiMdfItn.js',
  'account-YtJ0mOh1.js',
  'index-DRsSBkXt.js',
  'index-DKzD_NNv.js',
  'index-C4suEvxg.js',
  'index-DsMdvP6w.js',
  'index-Duh0SRoK.js',
  'index-CQF2VHTx.js',
  'index-CfpVPBPD.js',
  'index-BxkJ5lKZ.js',
  'index-SxYT1nKx.js',
  'home-B_JGxZ50.js'
];

const outDir = 'scripts/extracted-chunks';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function fetchChunks() {
  for (const chunk of chunks) {
    const url = `https://stashr.me/assets/${chunk}`;
    console.log(`Fetching ${url}...`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(outDir, chunk), text, 'utf8');
        console.log(`Saved ${chunk} (${text.length} bytes)`);
      } else {
        console.warn(`Failed ${chunk}: ${res.status}`);
      }
    } catch (e) {
      console.error(`Error fetching ${chunk}:`, e.message);
    }
  }
}

fetchChunks();
