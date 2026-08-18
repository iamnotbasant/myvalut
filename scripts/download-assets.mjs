import fs from 'fs';
import path from 'path';

const assets = [
  'demo/avatars/maya.jpg',
  'demo/avatars/ari.jpg',
  'demo/avatars/elena.jpg',
  'demo/avatars/jordan.jpg',
  'demo/avatars/kai.jpg',
  'demo/avatars/samir.jpg',
  'demo/posts/ari.jpg',
  'demo/posts/elena.jpg',
  'demo/posts/kai.jpg',
  'branding/icon.svg',
  'branding/favicon-16x16.png',
  'branding/favicon-32x32.png',
  'branding/og-image.jpg',
  'images/auth-meadow.webp'
];

const publicDir = 'public';

async function downloadAssets() {
  for (const asset of assets) {
    const url = `https://stashr.me/${asset}`;
    const outPath = path.join(publicDir, asset);
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(outPath, Buffer.from(buffer));
        console.log(`Downloaded ${asset} (${buffer.byteLength} bytes)`);
      } else {
        console.warn(`Failed ${asset}: ${res.status}`);
      }
    } catch (e) {
      console.error(`Error ${asset}:`, e.message);
    }
  }
}

downloadAssets();
