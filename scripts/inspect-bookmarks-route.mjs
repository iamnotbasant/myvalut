import fs from 'fs';

const file = 'scripts/extracted-chunks/route-DGucVYvQ.js';
const code = fs.readFileSync(file, 'utf8');

// Find imports
const imports = code.match(/import\(['"][^'"]+['"]\)|from\s*['"][^'"]+['"]/g) || [];
console.log('Imports in route-DGucVYvQ.js:', [...new Set(imports)]);

// Search for BookmarkCard or Card or Grid or List
const strings = code.match(/["'`][^"'`]{4,80}["'`]/g) || [];
console.log('Sample strings:', [...new Set(strings.slice(0, 100))]);

// Look for platform names, icons, tags, actions
const platforms = ['twitter', 'x.com', 'reddit', 'youtube', 'instagram', 'tiktok', 'bluesky', 'github', 'web'];
for (const p of platforms) {
  const c = (code.match(new RegExp(p, 'gi')) || []).length;
  if (c > 0) console.log(`Platform ${p}: ${c} matches`);
}
