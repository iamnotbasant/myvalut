import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('html.htm', 'utf8');
const $ = cheerio.load(html);

const rawCards = [];
$('[class*="group/bookmarkcard"]').each((i, el) => {
  const card = $(el);
  const author = card.find('.truncate.font-medium.text-strong').first().text().trim();
  const title = card.find('> p.font-semibold.text-strong').first().text().trim();
  
  const paragraphs = [];
  card.find('.space-y-3 p').each((_, p) => {
    paragraphs.push($(p).text().trim());
  });
  const text = paragraphs.join('\n\n');
  
  const tags = [];
  card.find('button.group\\/button').each((_, btn) => {
    const tagName = $(btn).find('.truncate').text().trim();
    if (tagName) {
      const dotClass = $(btn).find('div[class*="rounded-full"]').attr('class') || '';
      let color = 'orange';
      if (dotClass.includes('bg-green-500')) color = 'green';
      else if (dotClass.includes('bg-blue-500')) color = 'blue';
      else if (dotClass.includes('bg-purple-500') || dotClass.includes('bg-violet-500')) color = 'violet';
      else if (dotClass.includes('bg-amber-500')) color = 'amber';
      else if (dotClass.includes('bg-teal-500')) color = 'teal';
      else if (dotClass.includes('bg-red-500')) color = 'red';
      else if (dotClass.includes('bg-pink-500')) color = 'pink';
      tags.push({ name: tagName, color });
    }
  });

  const date = card.find('.text-muted-foreground.text-xs').last().text().trim();
  const img = card.find('img').attr('src') || null;

  rawCards.push({
    id: `bm-${i + 1}`,
    author,
    title,
    text,
    tags,
    date,
    img
  });
});

// The order in the live screenshot is:
// 1. Honest-Common-1303 (Aug 14, 2026)
// 2. rumon-07 (Aug 11, 2026)
// 3. karanadhikari27 (Aug 2, 2026)
// 4. illbedeletedvrysoon (Jul 26, 2026)
// 5. me_specific (Jul 20, 2026)
// 6. Responsible_Arm_8898 (Jul 13, 2026)
// 7. Busy-Race-4648 (SaveSync) (Jul 11, 2026)
// 8. Busy-Race-4648 (autocategorise) (Jul 4, 2026)
// 9. Competitive-Paper992 (Jul 2, 2026)
// 10. Warm-Plantain-1939 (Jul 1, 2026)
// 11. k3gn (Jun 30, 2026)
// 12. Bladebutcher_ (Jun 29, 2026)

// Let's sort rawCards in reverse chronological order matching the screenshot
const sortedCards = [...rawCards].reverse();

const mockDataCode = `import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'qjahsf',
    icon: 'heart',
    count: 12
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'ai', color: 'orange', count: 6 },
  { id: 'tag-2', name: 'open source', color: 'green', count: 4 },
  { id: 'tag-3', name: 'github', color: 'orange', count: 2 },
  { id: 'tag-4', name: 'productivity', color: 'blue', count: 4 },
  { id: 'tag-5', name: 'ui', color: 'green', count: 1 },
  { id: 'tag-6', name: 'mobile', color: 'orange', count: 1 },
  { id: 'tag-7', name: 'health', color: 'amber', count: 1 },
  { id: 'tag-8', name: 'supplement', color: 'teal', count: 1 },
  { id: 'tag-9', name: 'web development', color: 'blue', count: 1 },
  { id: 'tag-10', name: 'game modding', color: 'purple', count: 1 }
];

export const INITIAL_BOOKMARKS: BookmarkItem[] = ${JSON.stringify(
  sortedCards.map((c, idx) => ({
    id: `bm-${idx + 1}`,
    platform: 'reddit',
    displayName: c.author,
    username: c.author,
    avatarUrl: undefined,
    imageUrl: c.img || undefined,
    title: c.title || undefined,
    text: c.text,
    url: 'https://reddit.com',
    date: c.date,
    createdAt: Date.now() - idx * 86400000 * 3,
    tags: c.tags.length > 0 ? c.tags : [{ name: 'reddit', color: 'orange' }],
    isFavorite: idx === 0 || idx === 3,
    isArchived: false,
    collectionId: 'col-1'
  })),
  null,
  2
)};
`;

fs.writeFileSync('src/components/sites/stashr-me/bookmarks/mock-data.ts', mockDataCode, 'utf8');
console.log('Successfully generated authentic mock-data.ts with', sortedCards.length, 'posts!');
