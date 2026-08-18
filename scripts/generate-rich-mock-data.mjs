import fs from 'fs';

const mockDataCode = `import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b1',
    platform: 'twitter',
    displayName: 'TheAyanGfx',
    username: 'theayangfx',
    avatarUrl: '/demo/avatars/maya.jpg',
    imageUrl: '/demo/posts/ari.jpg',
    text: '3D Blender visual showcase and typography layout design pack. Clean geometry, realistic octane lighting, and modular assets.',
    url: 'https://x.com/theayangfx/status/2083508791870738673',
    date: '14 Feb 2026',
    isFavorite: true,
    tags: [
      { name: 'Design', color: 'violet' },
      { name: '3D', color: 'indigo' }
    ]
  },
  {
    id: 'b2',
    platform: 'twitter',
    displayName: 'Aqib',
    username: 'MAQIB135',
    avatarUrl: '/demo/avatars/ari.jpg',
    imageUrl: '/demo/posts/elena.jpg',
    text: 'Minimalist UI interaction design experiments for modern web applications. Focus on micro-interactions and smooth spring physics.',
    url: 'https://x.com/MAQIB135/status/2083571595810120015',
    date: '14 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'UI/UX', color: 'indigo' },
      { name: 'Motion', color: 'teal' }
    ]
  },
  {
    id: 'b3',
    platform: 'twitter',
    displayName: 'Hakimi Hamizi',
    username: 'HakimiHamizi',
    avatarUrl: '/demo/avatars/elena.jpg',
    text: 'The ultimate typography and hierarchy guide for frontend engineers. Balancing optical kerning, baseline grid, and line-heights.',
    url: 'https://x.com/HakimiHamizi/status/2083559403807236581',
    date: '14 Feb 2026',
    isFavorite: true,
    note: 'Check typography scale for the new dashboard redesign.',
    tags: [
      { name: 'Typography', color: 'teal' },
      { name: 'Design', color: 'violet' }
    ]
  },
  {
    id: 'b4',
    platform: 'reddit',
    displayName: 'r/Fitness_India',
    username: 'Fitness_India',
    avatarUrl: '/demo/avatars/jordan.jpg',
    text: 'M27 Vitamin deficiency solution and complete blood panel breakdown with diet recommendations and supplement protocol.',
    url: 'https://www.reddit.com/r/Fitness_India/comments/1t789rp/m27_vitamin_deficiency_solution/',
    date: '13 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'Health', color: 'green' }
    ]
  },
  {
    id: 'b5',
    platform: 'reddit',
    displayName: 'r/PiracyBackup',
    username: 'PiracyBackup',
    avatarUrl: '/demo/avatars/kai.jpg',
    text: 'How to use your Real Debrid as unlimited cloud storage mount with WebDAV / rclone configuration on Windows and Linux.',
    url: 'https://www.reddit.com/r/PiracyBackup/comments/1t649xv/use_your_real_debrid_as_you_unlimited_storage/',
    date: '13 Feb 2026',
    isFavorite: true,
    tags: [
      { name: 'Tools', color: 'orange' },
      { name: 'Cloud', color: 'blue' }
    ]
  },
  {
    id: 'b6',
    platform: 'reddit',
    displayName: 'r/HowToMen',
    username: 'HowToMen',
    avatarUrl: '/demo/avatars/samir.jpg',
    imageUrl: '/demo/posts/kai.jpg',
    text: '[Promo] Battery Hero is a free battery monitoring app with no ads or analytics trackers. Material You design and widget support.',
    url: 'https://www.reddit.com/r/HowToMen/comments/1tfu5qz/promo_battery_hero_is_a_free_battery_app_with_no/',
    date: '12 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'Apps', color: 'cyan' },
      { name: 'Android', color: 'green' }
    ]
  },
  {
    id: 'b7',
    platform: 'reddit',
    displayName: 'r/BookmarkManagers',
    username: 'BookmarkManagers',
    avatarUrl: '/demo/avatars/maya.jpg',
    text: 'I made a Chrome extension to auto-categorise all incoming bookmarks with local embeddings and fast search indexing.',
    url: 'https://www.reddit.com/r/BookmarkManagers/comments/1ump7e4/made_a_chrome_extension_to_autocategorise_all/',
    date: '11 Feb 2026',
    isFavorite: true,
    tags: [
      { name: 'Tools', color: 'indigo' },
      { name: 'AI', color: 'violet' }
    ]
  },
  {
    id: 'b8',
    platform: 'twitter',
    displayName: 'Jaejin Bong',
    username: 'JaejinBong',
    avatarUrl: '/demo/avatars/ari.jpg',
    text: 'Crafting fluid animations with Framer Motion and modern CSS transitions. Layout animations without jank.',
    url: 'https://x.com/JaejinBong/status/2083900392065442287',
    date: '10 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'Development', color: 'blue' },
      { name: 'React', color: 'cyan' }
    ]
  },
  {
    id: 'b9',
    platform: 'twitter',
    displayName: 'Joseph Tsar',
    username: 'joseph_tsar_',
    avatarUrl: '/demo/avatars/elena.jpg',
    text: 'SaaS growth breakdown: From 0 to $50k MRR with clean design systems, landing page conversions, and customer onboarding loops.',
    url: 'https://x.com/joseph_tsar_/status/2083651579886940446',
    date: '9 Feb 2026',
    isFavorite: true,
    tags: [
      { name: 'Marketing', color: 'green' },
      { name: 'SaaS', color: 'amber' }
    ]
  },
  {
    id: 'b10',
    platform: 'twitter',
    displayName: 'Arce',
    username: 'arceyul',
    avatarUrl: '/demo/avatars/jordan.jpg',
    imageUrl: '/demo/posts/ari.jpg',
    text: 'Brutalist poster collection and typography layout experiments for indie records and visual identities.',
    url: 'https://x.com/arceyul/status/2083881692880683245',
    date: '8 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'Design', color: 'pink' }
    ]
  },
  {
    id: 'b11',
    platform: 'twitter',
    displayName: 'Manish',
    username: 'Manixh02',
    avatarUrl: '/demo/avatars/kai.jpg',
    text: 'Modern Tailwind CSS v4 components and utility tips for Next.js 16 developers. Container queries and color-mix utilities.',
    url: 'https://x.com/Manixh02/status/2085903702087610701',
    date: '7 Feb 2026',
    isFavorite: true,
    tags: [
      { name: 'Development', color: 'blue' },
      { name: 'Tailwind', color: 'teal' }
    ]
  },
  {
    id: 'b12',
    platform: 'twitter',
    displayName: 'Kai L.',
    username: 'kail_designs',
    avatarUrl: '/demo/avatars/samir.jpg',
    imageUrl: '/demo/posts/elena.jpg',
    text: 'Design token architecture: Scaling color modes from Light to Dark seamlessly with oklch and CSS custom properties.',
    url: 'https://x.com/kail_designs/status/2086838370421125481',
    date: '6 Feb 2026',
    isFavorite: false,
    tags: [
      { name: 'Design', color: 'violet' },
      { name: 'Tokens', color: 'indigo' }
    ]
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'c1', name: 'Design Inspiration', icon: 'Sparkles', count: 5 },
  { id: 'c2', name: 'Frontend Resources', icon: 'Folder', count: 4 },
  { id: 'c3', name: 'Product Ideas', icon: 'Lightbulb', count: 3 }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 't1', name: 'Design', color: 'violet', count: 5 },
  { id: 't2', name: 'Development', color: 'blue', count: 4 },
  { id: 't3', name: 'UI/UX', color: 'indigo', count: 3 },
  { id: 't4', name: 'Tools', color: 'orange', count: 3 },
  { id: 't5', name: 'Marketing', color: 'green', count: 2 },
  { id: 't6', name: 'Typography', color: 'teal', count: 2 },
  { id: 't7', name: 'Apps', color: 'cyan', count: 2 },
  { id: 't8', name: 'Inspiration', color: 'amber', count: 2 }
];
`;

fs.writeFileSync('src/components/sites/stashr-me/bookmarks/mock-data.ts', mockDataCode, 'utf8');
console.log('Saved rich authentic mock data!');
