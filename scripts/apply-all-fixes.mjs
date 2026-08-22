import fs from 'fs';

// 1. Update mock-data.ts with all 13 authentic posts (including Alain Alvarez at top)
const authenticMockData = `import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'qjahsf',
    icon: 'heart',
    count: 13
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'ai', color: 'orange', count: 6 },
  { id: 'tag-2', name: 'open source', color: 'green', count: 5 },
  { id: 'tag-3', name: 'github', color: 'orange', count: 3 },
  { id: 'tag-4', name: 'productivity', color: 'blue', count: 4 },
  { id: 'tag-5', name: 'ui', color: 'green', count: 2 },
  { id: 'tag-6', name: 'mobile', color: 'orange', count: 1 },
  { id: 'tag-7', name: 'health', color: 'amber', count: 1 },
  { id: 'tag-8', name: 'supplement', color: 'teal', count: 1 },
  { id: 'tag-9', name: 'web development', color: 'blue', count: 1 },
  { id: 'tag-10', name: 'Tagging..', color: 'violet', count: 1 }
];

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-1',
    platform: 'twitter',
    displayName: 'Alain Alvarez',
    username: 'alain_0012',
    avatarUrl: undefined,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340" fill="%23111113"><rect width="600" height="340" fill="%23111113"/><g transform="translate(180, 80)"><circle cx="40" cy="50" r="36" fill="%234A5568"/><circle cx="140" cy="40" r="42" fill="%23E2E8F0"/><circle cx="80" cy="110" r="30" fill="%239B2C2C"/><circle cx="160" cy="120" r="35" fill="%23D69E2E"/><circle cx="210" cy="80" r="28" fill="%23319795"/></g><circle cx="300" cy="170" r="32" fill="%231E293B" stroke="%2338BDF8" stroke-width="3"/><polygon points="292,156 314,170 292,184" fill="%23FFFFFF"/></svg>',
    title: undefined,
    text: 'deterministic avatars from any string.\\n\\nusernames, emails, ids — anything with a name gets a face. same input, same avatar, forever. no storage, no uploads.\\n\\nblobatar — react + vanilla, zero deps, ~3.7 KB\\n\\nnpm i blobatar',
    url: 'https://x.com/alain_0012',
    date: 'Aug 16, 2026',
    createdAt: Date.now() - 86400000 * 1,
    tags: [{ name: 'Tagging..', color: 'violet' }],
    isFavorite: true,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-2',
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
      { name: 'markdown', color: 'blue' },
      { name: 'obsidian', color: 'violet' },
      { name: 'tools', color: 'teal' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-3',
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
      { name: 'open source', color: 'green' },
      { name: 'gallery', color: 'blue' },
      { name: 'storage', color: 'amber' }
    ],
    isFavorite: true,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-4',
    platform: 'reddit',
    displayName: 'karanadhikari27',
    username: 'karanadhikari27',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: '🍿 TeleStremio v1.0.2 — Turn Your Telegram Channels Into a Personal Streaming Library',
    text: '📺 TeleStremio — Stream Telegram in Nuvio 🚀\\n\\nWant to stream your Telegram media in Nuvio without a VPS or self-hosted server? 🤔 TeleStremio turns your Android phone into a personal Nuvio addon and streams Movies, TV Shows & Anime directly from your Telegram channels. 🍿\\n\\n✨ Features\\n\\n🔒 Login with Telegram (Phone or QR)\\n🔴 Live on-demand...',
    url: 'https://reddit.com',
    date: 'Aug 2, 2026',
    createdAt: Date.now() - 86400000 * 15,
    tags: [
      { name: 'open source', color: 'green' },
      { name: 'github', color: 'orange' },
      { name: 'telegram', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-5',
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
  },
  {
    id: 'bm-6',
    platform: 'reddit',
    displayName: 'me_specific',
    username: 'me_specific',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'My Story: How Starting magnesium and vitamin D3 was the best thing I did to myself',
    text: 'So this story goes to my 2nd year of college. My hair were becoming so thin and I couldn’t sleep at all. Firstly I ignored this and was watching movies and used to sleep early morning but even I knew something is off.\\n\\nI went to doctor he suggested vitamins, Zinc and D3. I started using them and still using multivitamin and D3. I come from...',
    url: 'https://reddit.com',
    date: 'Jul 20, 2026',
    createdAt: Date.now() - 86400000 * 28,
    tags: [
      { name: 'health', color: 'amber' },
      { name: 'supplement', color: 'teal' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-7',
    platform: 'reddit',
    displayName: 'Responsible_Arm_8898',
    username: 'Responsible_Arm_8898',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: '[Promotion][App] Most Hybrid browser you will see on internet, media downloader, privacy and player.',
    text: 'I didn’t set out to build another browser. I wanted one app that respected my privacy while also handling everything I normally do on the web. That became **WebAura** — a privacy-first browser that also works as a complete web and media ecosystem.\\n\\nSome of the things it can do:\\n\\n• Private browsing with a powerful ad blocker, tracker...',
    url: 'https://reddit.com',
    date: 'Jul 13, 2026',
    createdAt: Date.now() - 86400000 * 35,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'web development', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-8',
    platform: 'reddit',
    displayName: 'Busy-Race-4648',
    username: 'Busy-Race-4648',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'What makes SaveSync the ultimate automated fix for digital hoarding!!!',
    text: 'SaveSync provides a comprehensive suite of features designed to streamline your workflow and manage your bookmarks efficiently:',
    url: 'https://reddit.com',
    date: 'Jul 11, 2026',
    createdAt: Date.now() - 86400000 * 37,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'productivity', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-9',
    platform: 'reddit',
    displayName: 'Busy-Race-4648',
    username: 'Busy-Race-4648',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'Made a chrome extension to autocategorise all your bookmarks with just one click.',
    text: 'Reposted from r/chrome_extensions',
    url: 'https://reddit.com',
    date: 'Jul 4, 2026',
    createdAt: Date.now() - 86400000 * 44,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'productivity', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-10',
    platform: 'reddit',
    displayName: 'Competitive-Paper992',
    username: 'Competitive-Paper992',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'VoicePad AI — 100% offline voice-to-text',
    text: 'VoicePad AI turns your voice into text, instantly, on any device — and it does it 100% offline.\\n\\nWhat it does: You talk, it types. Real-time dictation that drops clean text wherever you need it — documents, emails, chat, notes, code comments, forms. The speech recognition (Whisper) runs locally on your own hardware, so there’s no lag…',
    url: 'https://reddit.com',
    date: 'Jul 2, 2026',
    createdAt: Date.now() - 86400000 * 46,
    tags: [
      { name: 'ai', color: 'orange' },
      { name: 'productivity', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-11',
    platform: 'reddit',
    displayName: 'Warm-Plantain-1939',
    username: 'Warm-Plantain-1939',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'Top three Dynamic Island apps',
    text: 'Number 1: material capsule (for Android style)\\n\\nNumber 2 dynamic spot ( For iPhone style)\\n\\nNumber 3 Dynamic Notch Notification Bar (The most realistic iPhone Style)\\n\\nIf there are any better ones let me know',
    url: 'https://reddit.com',
    date: 'Jul 1, 2026',
    createdAt: Date.now() - 86400000 * 47,
    tags: [
      { name: 'ui', color: 'green' },
      { name: 'mobile', color: 'orange' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-12',
    platform: 'reddit',
    displayName: 'k3gn',
    username: 'k3gn',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'I made the universal patches to claim Ad rewards for free.',
    text: 'More info on the repo: https://github.com/Nai64/Nai64Patches\\n\\nStill working on more compatibility for more games. Please report the bugs and errors in the github issues.',
    url: 'https://reddit.com',
    date: 'Jun 30, 2026',
    createdAt: Date.now() - 86400000 * 48,
    tags: [
      { name: 'github', color: 'orange' },
      { name: 'game modding', color: 'violet' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-13',
    platform: 'reddit',
    displayName: 'Bladebutcher_',
    username: 'Bladebutcher_',
    avatarUrl: undefined,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    title: 'I built a Chrome extension because I kept forgetting why I downloaded files',
    text: 'This started with a really stupid problem.\\n\\nMy Downloads folder wasn’t huge, but every time I tried cleaning it up, I’d end up opening random files just to remember why I downloaded them.\\n\\nsetup.exe\\ndocument (12).pdf\\ndriver.zip\\nresume_final_v4.pdf\\n\\nWhen I downloaded them, I knew exactly why I needed them.\\n\\nA few weeks later, I had no idea…',
    url: 'https://reddit.com',
    date: 'Jun 29, 2026',
    createdAt: Date.now() - 86400000 * 49,
    tags: [
      { name: 'open source', color: 'green' },
      { name: 'productivity', color: 'blue' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  }
];
`;

fs.writeFileSync('src/components/sites/stashr-me/bookmarks/mock-data.ts', authenticMockData, 'utf8');
console.log('Saved 13 authentic bookmarks to mock-data.ts');
