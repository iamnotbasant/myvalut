import fs from 'fs';

const mockDataContent = `import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'qjahsf',
    icon: 'heart',
    count: 15
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

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-slani',
    platform: 'twitter',
    displayName: 'Slani | YouTube Strategist',
    username: 'arslanvisuals',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: undefined,
    text: "This is how I make my client's face look 10X better in thumbnails.\\n\\nNo crazy Photoshop skills needed.\\n\\nHere's the exact process ↓ 🧵",
    url: 'https://x.com/arslanvisuals',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 60,
    tags: [
      { name: 'graphic design', color: 'blue' },
      { name: 'photo editing', color: 'violet' },
      { name: 'thumbnails', color: 'amber' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-wail',
    platform: 'twitter',
    displayName: 'Wail Beghoul',
    username: 'wailbranding',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340" fill="%2318181b"><rect width="600" height="340" fill="%2318181b"/><path d="M220 100 L380 100 L320 200 L320 260 L280 260 L280 200 Z" fill="none" stroke="%2371717a" stroke-width="2" stroke-dasharray="4,4"/><circle cx="300" cy="170" r="30" fill="%2327272a" stroke="%2352525b" stroke-width="2"/><polygon points="294,158 312,170 294,182" fill="%23ffffff"/></svg>',
    title: undefined,
    text: "One of my favorite animations I made for Vince's video ✨",
    url: 'https://x.com/wailbranding',
    date: 'Aug 17, 2028',
    createdAt: Date.now() - 1000 * 60 * 120,
    tags: [
      { name: 'motion design', color: 'violet' },
      { name: 'animation', color: 'pink' },
      { name: 'video', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-bugged',
    platform: 'twitter',
    displayName: 'The Bugged Dev',
    username: 'thebuggeddev',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23ffffff"><rect width="600" height="400" fill="%23ffffff" rx="16"/><circle cx="300" cy="150" r="90" fill="%23f4f4f5" stroke="%23e4e4e7" stroke-width="4"/><circle cx="300" cy="150" r="28" fill="%23ffffff" stroke="%23d4d4d8" stroke-width="2"/><g transform="translate(180, 270)"><circle cx="30" cy="30" r="16" fill="%23f87171"/><circle cx="80" cy="30" r="16" fill="%23fb923c"/><circle cx="130" cy="30" r="16" fill="%2338bdf8"/><circle cx="180" cy="30" r="16" fill="%234ade80"/><circle cx="230" cy="30" r="16" fill="%23c084fc"/></g><circle cx="300" cy="270" r="24" fill="%2318181b"/><polygon points="296,260 308,270 296,280" fill="%23ffffff"/></svg>',
    title: undefined,
    text: "AI can build beautiful animations if you describe what you want clearly enough 🫀\\n\\nBuilt this CD player with smooth subtle animations inspired by @itsdpark and @joshpuckett's concept using Claude Opus 5.\\n\\nAll I gave Claude was the design image and my master prompt describing...",
    url: 'https://x.com/thebuggeddev',
    date: 'Aug 18, 2026',
    createdAt: Date.now() - 1000 * 60 * 180,
    tags: [
      { name: 'ui', color: 'green' },
      { name: 'ai', color: 'orange' },
      { name: 'claude', color: 'violet' },
      { name: 'animation', color: 'pink' },
      { name: 'web', color: 'blue' }
    ],
    isFavorite: true,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-gorkem',
    platform: 'twitter',
    displayName: 'Görkem Çetin',
    username: 'gorkemcetin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: undefined,
    text: "Uygulamalarınıza ekleyebileceğiniz açık kaynak kodlu 900'den fazla ses efekti. Mutlaka bir bakın. Kurumsal masaüstü uygulamalarıma bile koyasım geldi, o kadar şeker şerbet. uisfx.com",
    url: 'https://x.com/gorkemcetin',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 240,
    tags: [
      { name: 'ux', color: 'amber' },
      { name: 'ui', color: 'green' },
      { name: 'sound', color: 'blue' },
      { name: 'tools', color: 'violet' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-sparkskye',
    platform: 'twitter',
    displayName: 'sparkskye',
    username: 'sparkskyemc',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: undefined,
    text: 'a thumbnail i made vs the inspiration',
    url: 'https://x.com/sparkskyemc',
    date: 'Aug 17, 2028',
    createdAt: Date.now() - 1000 * 60 * 300,
    tags: [
      { name: 'graphic design', color: 'blue' },
      { name: 'design inspiration', color: 'red' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-alain',
    platform: 'twitter',
    displayName: 'Alain Alvarez',
    username: 'alain_0012',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: undefined,
    text: 'deterministic avatars from any string.\\n\\nusernames, emails, ids — anything with a name gets a face. same input, same avatar, forever. no storage, no uploads.\\n\\nblobatar — react + vanilla, zero deps, ~3.7 KB\\n\\nnpm i blobatar',
    url: 'https://x.com/alain_0012',
    date: 'Aug 16, 2026',
    createdAt: Date.now() - 1000 * 60 * 360,
    tags: [{ name: 'Tagging..', color: 'violet' }],
    isFavorite: true,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-honest',
    platform: 'reddit',
    displayName: 'Honest-Common-1303',
    username: 'Honest-Common-1303',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'I made a bookmarking/read later app that saves to markdown',
    text: 'tl;dr I built a bookmarking/read-it-later web app that uses markdown (with obsidian frontmatter) as its storage format for maximum portability and future proofing. It also has a bunch of cool AI and file conversion features. It’s entirely free, and I’m looking for a few folks to join the private beta and give feedback. It’s at saive.my\\n\\ntl:...',
    url: 'https://reddit.com',
    date: 'Aug 14, 2026',
    createdAt: Date.now() - 86400000 * 3,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'open source', color: 'green' },
      { name: 'markdown', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-rumon',
    platform: 'reddit',
    displayName: 'rumon-07',
    username: 'rumon-07',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: '[App] [Promo] I spent 8 months building a gallery app that gives you unlimited storage .',
    text: 'I spent 8 months building a gallery app that gives you unlimited storage .\\n\\nYeah, I know - another gallery app, right? But hear me out.\\n\\nI was tired of Google Photos eating my data, locking me into subscriptions, and honestly, I didn’t had the option to pay to get more storage . So I built Telephoto.\\n\\nThe core idea is simple: your photos get...',
    url: 'https://reddit.com',
    date: 'Aug 11, 2026',
    createdAt: Date.now() - 86400000 * 6,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'open source', color: 'green' }
    ],
    isFavorite: true,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-karan',
    platform: 'reddit',
    displayName: 'karanadhikari27',
    username: 'karanadhikari27',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: '🍿 TeleStremio v1.0.2 — Turn Your Telegram Channels Into a Personal Streaming Library',
    text: '📺 TeleStremio — Stream Telegram in Nuvio 🚀\\n\\nWant to stream your Telegram media in Nuvio without a VPS or self-hosted server? 🤔 TeleStremio turns your Android phone into a personal Nuvio addon and streams Movies, TV Shows & Anime directly from your Telegram channels. 🍿',
    url: 'https://reddit.com',
    date: 'Aug 2, 2026',
    createdAt: Date.now() - 86400000 * 15,
    tags: [
      { name: 'open source', color: 'green' },
      { name: 'github', color: 'orange' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-dog',
    platform: 'reddit',
    displayName: 'illbedeletedvrysoon',
    username: 'illbedeletedvrysoon',
    avatarUrl: undefined,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    title: 'Is this normal behaviour for a dog?',
    text: '',
    url: 'https://reddit.com',
    date: 'Jul 26, 2026',
    createdAt: Date.now() - 86400000 * 22,
    tags: [{ name: 'pets', color: 'amber' }],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  }
];
`;

fs.writeFileSync('src/components/sites/stashr-me/bookmarks/mock-data.ts', mockDataContent, 'utf8');
console.log('Saved exact latest bookmarks to mock-data.ts');
