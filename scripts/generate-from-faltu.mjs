import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');
const $ = cheerio.load(html);

const items = [];
const colorMap = {
  'bg-blue-500': 'blue',
  'bg-violet-500': 'violet',
  'bg-green-500': 'green',
  'bg-amber-500': 'amber',
  'bg-orange-500': 'orange',
  'bg-red-500': 'red',
  'bg-pink-500': 'pink',
  'bg-teal-500': 'teal'
};

$('div.group\\/bookmarkcard').each((i, el) => {
  const card = $(el);
  const authorName = card.find('span.truncate.font-medium').first().text().trim();
  const authorHandle = card.find('span.truncate.text-muted-foreground').first().text().trim().replace(/^@/, '');
  let avatarImg = card.find('img[data-slot="avatar-image"]').attr('src');
  if (avatarImg && avatarImg.startsWith('./Stashr_files/')) {
    avatarImg = avatarImg.replace('./Stashr_files/', '/stashr_files/');
  }

  const title = card.find('p.font-semibold.text-strong').text().trim() || undefined;
  
  // Extract text body paragraphs
  const paragraphs = [];
  card.find('div.space-y-3 p, div.space-y-3 h1, div.space-y-3 li').each((_, p) => {
    const t = $(p).text().trim();
    if (t) paragraphs.push(t);
  });
  const text = paragraphs.join('\n\n') || card.find('div.space-y-3').text().trim();

  // Media preview
  let imgPreview = card.find('img[data-slot="image"]').attr('src') || card.find('img[src*="Stashr_files"]').not('[data-slot="avatar-image"]').attr('src');
  if (imgPreview && imgPreview.startsWith('./Stashr_files/')) {
    imgPreview = imgPreview.replace('./Stashr_files/', '/stashr_files/');
  }

  // Date
  let dateText = card.find('div.flex.shrink-0.items-center.gap-2 span.text-muted-foreground.text-xs').text().trim();
  if (!dateText) {
    dateText = card.find('span.text-muted-foreground.text-xs').last().text().trim();
  }

  // Tags
  const tags = [];
  card.find('button:has(div.size-2.rounded-full)').each((_, tagEl) => {
    const tagName = $(tagEl).find('span.truncate').text().trim();
    const dotClass = $(tagEl).find('div.size-2.rounded-full').attr('class') || '';
    let color = 'blue';
    for (const [cls, col] of Object.entries(colorMap)) {
      if (dotClass.includes(cls)) {
        color = col;
        break;
      }
    }
    if (tagName) {
      tags.push({ name: tagName, color });
    }
  });

  const isTwitter = Boolean(authorHandle) || card.find('svg path[d*="18.244"]').length > 0 || card.text().includes('@');

  items.push({
    id: `bm-${i + 1}`,
    platform: isTwitter ? 'twitter' : 'reddit',
    displayName: authorName,
    username: authorHandle || authorName,
    avatarUrl: avatarImg || undefined,
    imageUrl: imgPreview || undefined,
    title,
    text,
    url: isTwitter ? `https://x.com/${authorHandle}` : 'https://reddit.com',
    date: dateText,
    createdAt: Date.now() - i * 1000 * 60 * 60,
    tags,
    isFavorite: i % 3 === 0,
    isArchived: false,
    collectionId: 'col-1'
  });
});

console.log(`Generated ${items.length} authentic items.`);

// Reorder so that X posts from the top of the grid come first (Slani, Wail, Bugged Dev, Gorkem, sparkskye, Alain, etc.)
// In Stashr.html, reverse order might be needed or as is. Let's see:
// Items 17 down to 0 or 0 to 17:
// In the screenshot:
// Top row: Slani, Wail Beghoul, The Bugged Dev
// 2nd row: Gorkem Cetin, sparkskye, Alain Alvarez
// 3rd row: Honest-Common-1303, rumon-07, karanadhikari27

const targetOrder = [
  'Slani | YouTube Strategist',
  'Wail Beghoul',
  'The Bugged Dev',
  'Görkem Çetin',
  'sparkskye',
  'Alain Alvarez',
  'Honest-Common-1303',
  'rumon-07',
  'karanadhikari27',
  'illbedeletedvrysoon',
  'me_specific',
  'Responsible_Arm_8898',
  'Busy-Race-4648',
  'Competitive-Paper992',
  'Warm-Plantain-1939',
  'k3gn',
  'Bladebutcher_'
];

const orderedItems = [];
targetOrder.forEach(name => {
  const match = items.find(it => it.displayName === name);
  if (match) orderedItems.push(match);
});

// Add any remaining
items.forEach(it => {
  if (!orderedItems.some(o => o.id === it.id)) {
    orderedItems.push(it);
  }
});

const fileContent = `import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'qjahsf',
    icon: 'heart',
    count: ${orderedItems.length}
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'graphic design', color: 'blue', count: 4 },
  { id: 'tag-2', name: 'photo editing', color: 'violet', count: 2 },
  { id: 'tag-3', name: 'motion design', color: 'violet', count: 3 },
  { id: 'tag-4', name: 'animation', color: 'pink', count: 3 },
  { id: 'tag-5', name: 'ui', color: 'green', count: 5 },
  { id: 'tag-6', name: 'ai', color: 'orange', count: 7 },
  { id: 'tag-7', name: 'ux', color: 'amber', count: 2 },
  { id: 'tag-8', name: 'design inspiration', color: 'red', count: 2 },
  { id: 'tag-9', name: 'open source', color: 'green', count: 5 },
  { id: 'tag-10', name: 'github', color: 'orange', count: 3 }
];

export const INITIAL_BOOKMARKS: BookmarkItem[] = ${JSON.stringify(orderedItems, null, 2)};
`;

fs.writeFileSync('src/components/sites/stashr-me/bookmarks/mock-data.ts', fileContent, 'utf8');
console.log('Saved 100% exact live mock-data.ts');
