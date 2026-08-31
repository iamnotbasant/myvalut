import { BookmarkItem, Collection, Tag } from '@/types/stashr';

export const INITIAL_COLLECTIONS: Collection[] = [];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'graphic design', color: 'pink', count: 4 },
  { id: 'tag-2', name: 'photo editing', color: 'violet', count: 2 },
  { id: 'tag-3', name: 'motion design', color: 'violet', count: 3 },
  { id: 'tag-4', name: 'animation', color: 'violet', count: 3 },
  { id: 'tag-5', name: 'ui', color: 'cyan', count: 5 },
  { id: 'tag-6', name: 'ai', color: 'teal', count: 7 },
  { id: 'tag-7', name: 'ux', color: 'cyan', count: 2 },
  { id: 'tag-8', name: 'design inspiration', color: 'pink', count: 2 },
  { id: 'tag-9', name: 'open source', color: 'green', count: 5 },
  { id: 'tag-10', name: 'github', color: 'orange', count: 3 }
];

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-slani',
    platform: 'twitter',
    displayName: 'Slani | YouTube Strategist',
    username: 'arslanvisuals',
    avatarUrl: '/stashr_files/8b700a235ebcffd6.jpg',
    imageUrl: undefined,
    title: undefined,
    text: "This is how I make my client's face look 10X better in thumbnails.\n\nNo crazy Photoshop skills needed.\n\nHere's the exact process ↓ 🧵",
    url: 'https://x.com/arslanvisuals',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 60,
    tags: [
      { name: 'graphic design', color: 'pink' },
      { name: 'photo editing', color: 'violet' }
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
    avatarUrl: '/stashr_files/657ccdf6fd99feec.jpg',
    imageUrl: '/stashr_files/13_2088726615052181504.jpg.webp',
    title: undefined,
    text: "One of my favorite animations I made for Vince's video ✨",
    url: 'https://x.com/wailbranding',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 120,
    tags: [
      { name: 'motion design', color: 'violet' },
      { name: 'animation', color: 'violet' },
      { name: 'marketing', color: 'orange' }
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
    avatarUrl: '/stashr_files/62db0f69f5d36f21.jpg',
    imageUrl: '/stashr_files/13_2089550474404036608.jpg.webp',
    title: undefined,
    text: "AI can build beautiful animations if you describe what you want clearly enough 🫀\n\nBuilt this CD player with smooth subtle animations inspired by @itsdpark and @joshpuckett's concept using Claude Opus 5.\n\nAll I gave Claude was the design image and my master prompt describing...",
    url: 'https://x.com/thebuggeddev',
    date: 'Aug 18, 2026',
    createdAt: Date.now() - 1000 * 60 * 180,
    tags: [
      { name: 'ui', color: 'cyan' },
      { name: 'ai', color: 'teal' }
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
    avatarUrl: '/stashr_files/b218c4095252c807.jpg',
    imageUrl: undefined,
    title: undefined,
    text: "Uygulamalarınıza ekleyebileceğiniz açık kaynak kodlu 900'den fazla ses efekti. Mutlaka bir bakın. Kurumsal masaüstü uygulamalarıma bile koyasım geldi, o kadar şeker şerbet. uisfx.com",
    url: 'https://x.com/gorkemcetin',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 240,
    tags: [
      { name: 'ux', color: 'cyan' },
      { name: 'ui', color: 'cyan' }
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
    avatarUrl: '/stashr_files/8266259c9e4c4384.jpg',
    imageUrl: undefined,
    title: undefined,
    text: 'a thumbnail i made vs the inspiration',
    url: 'https://x.com/sparkskyemc',
    date: 'Aug 17, 2026',
    createdAt: Date.now() - 1000 * 60 * 300,
    tags: [
      { name: 'graphic design', color: 'pink' },
      { name: 'design inspiration', color: 'pink' }
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
    avatarUrl: '/stashr_files/6e91ff44b380a5e3.jpg',
    imageUrl: '/stashr_files/13_2089052058796052480.jpg.webp',
    title: undefined,
    text: 'deterministic avatars from any string.\n\nusernames, emails, ids — anything with a name gets a face. same input, same avatar, forever. no storage, no uploads.\n\nblobatar — react + vanilla, zero deps, ~3.7 KB\n\nnpm i blobatar',
    url: 'https://x.com/alain_0012',
    date: 'Aug 16, 2026',
    createdAt: Date.now() - 1000 * 60 * 360,
    tags: [
      { name: 'design', color: 'pink' },
      { name: 'ui', color: 'cyan' }
    ],
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
    text: 'tl;dr I built a bookmarking/read-it-later web app that uses markdown (with obsidian frontmatter) as its storage format for maximum portability and future proofing. It also has a bunch of cool AI and file conversion features. It’s entirely free, and I’m looking for a few folks to join the private beta and give feedback. It’s at saive.my\n\ntl:...',
    url: 'https://reddit.com',
    date: 'Aug 14, 2026',
    createdAt: Date.now() - 86400000 * 3,
    tags: [
      { name: 'ai', color: 'teal' },
      { name: 'open source', color: 'green' }
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
    text: 'I spent 8 months building a gallery app that gives you unlimited storage .\n\nYeah, I know - another gallery app, right? But hear me out.\n\nI was tired of Google Photos eating my data, locking me into subscriptions, and honestly, I didn’t had the option to pay to get more storage . So I built Telephoto.\n\nThe core idea is simple: your photos get...',
    url: 'https://reddit.com',
    date: 'Aug 11, 2026',
    createdAt: Date.now() - 86400000 * 6,
    tags: [
      { name: 'ai', color: 'teal' },
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
    text: '📺 TeleStremio — Stream Telegram in Nuvio 🚀\n\nWant to stream your Telegram media in Nuvio without a VPS or self-hosted server? 🤔 TeleStremio turns your Android phone into a personal Nuvio addon and streams Movies, TV Shows & Anime directly from your Telegram channels. 🍿\n\n✨ Features\n\n🔒 Login with Telegram (Phone or QR)\n🔴 Live on-demand...',
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
    imageUrl: '/stashr_files/preview.jpg.webp',
    title: 'Is this normal behaviour for a dog?',
    text: '',
    url: 'https://reddit.com',
    date: 'Jul 26, 2026',
    createdAt: Date.now() - 86400000 * 22,
    tags: [],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-me_specific',
    platform: 'reddit',
    displayName: 'me_specific',
    username: 'me_specific',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'My Story: How Starting magnesium and vitamin D3 was the best thing I did to myself',
    text: 'So this story goes to my 2nd year of college. My hair were becoming so thin and I couldn’t sleep at all. Firstly I ignored this and was watching movies and used to sleep early morning but even I knew something is off.\n\nI went to doctor he suggested vitamins, Zinc and D3. I started using them and still using multivitamin and D3. I come from...',
    url: 'https://reddit.com',
    date: 'Jul 20, 2026',
    createdAt: Date.now() - 86400000 * 28,
    tags: [
      { name: 'fitness', color: 'green' },
      { name: 'health', color: 'green' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-responsible',
    platform: 'reddit',
    displayName: 'Responsible_Arm_8898',
    username: 'Responsible_Arm_8898',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: '[Promotion][App] Most Hybrid browser you will see on internet, media downloader, privacy and player.',
    text: 'I didn’t set out to build another browser. I wanted one app that respected my privacy while also handling everything I normally do on the web. That became **WebAura** — a privacy-first browser that also works as a complete web and media ecosystem.\n\nSome of the things it can do:\n\n• Private browsing with a powerful ad blocker, tracker...',
    url: 'https://reddit.com',
    date: 'Jul 13, 2026',
    createdAt: Date.now() - 86400000 * 35,
    tags: [
      { name: 'ai', color: 'teal' },
      { name: 'web dev', color: 'teal' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-savesync-1',
    platform: 'reddit',
    displayName: 'Busy-Race-4648',
    username: 'Busy-Race-4648',
    avatarUrl: undefined,
    imageUrl: '/stashr_files/YXY1MXZiZzZubGNoMf0Tgh1124op-rdaqL87Vy_uCUWJyjv1ibyAlJ--4O5I.png',
    title: 'What makes SaveSync the ultimate automated fix for digital hoarding!!!',
    text: 'SaveSync provides a comprehensive suite of features designed to streamline your workflow and manage your bookmarks efficiently:',
    url: 'https://reddit.com',
    date: 'Jul 11, 2026',
    createdAt: Date.now() - 86400000 * 37,
    tags: [
      { name: 'ai', color: 'teal' },
      { name: 'productivity', color: 'amber' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-savesync-2',
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
      { name: 'ai', color: 'teal' },
      { name: 'productivity', color: 'amber' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-competitive',
    platform: 'reddit',
    displayName: 'Competitive-Paper992',
    username: 'Competitive-Paper992',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'VoicePad AI — 100% offline voice-to-text',
    text: 'VoicePad AI turns your voice into text, instantly, on any device — and it does it 100% offline.\n\nWhat it does: You talk, it types. Real-time dictation that drops clean text wherever you need it — documents, emails, chat, notes, code comments, forms. The speech recognition (Whisper) runs locally on your own hardware, so there’s no lag…',
    url: 'https://reddit.com',
    date: 'Jul 2, 2026',
    createdAt: Date.now() - 86400000 * 46,
    tags: [
      { name: 'ai', color: 'teal' },
      { name: 'productivity', color: 'amber' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-warm-plantain',
    platform: 'reddit',
    displayName: 'Warm-Plantain-1939',
    username: 'Warm-Plantain-1939',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'Top three Dynamic Island apps',
    text: 'Number 1: material capsule (for Android style)\n\nNumber 2 dynamic spot ( For iPhone style)\n\nNumber 3 Dynamic Notch Notification Bar (The most realistic iPhone Style)\n\nIf there are any better ones let me know',
    url: 'https://reddit.com',
    date: 'Jul 1, 2026',
    createdAt: Date.now() - 86400000 * 47,
    tags: [
      { name: 'ui', color: 'cyan' },
      { name: 'tool', color: 'cyan' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-k3gn',
    platform: 'reddit',
    displayName: 'k3gn',
    username: 'k3gn',
    avatarUrl: undefined,
    imageUrl: undefined,
    title: 'I made the universal patches to claim Ad rewards for free.',
    text: 'More info on the repo: https://github.com/Nai64/Nai64Patches\n\nStill working on more compatibility for more games. Please report the bugs and errors in the github issues.',
    url: 'https://reddit.com',
    date: 'Jun 30, 2026',
    createdAt: Date.now() - 86400000 * 48,
    tags: [
      { name: 'github', color: 'orange' },
      { name: 'open source', color: 'green' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  },
  {
    id: 'bm-bladebutcher',
    platform: 'reddit',
    displayName: 'Bladebutcher_',
    username: 'Bladebutcher_',
    avatarUrl: undefined,
    imageUrl: '/stashr_files/video.jpg.webp',
    title: 'I built a Chrome extension because I kept forgetting why I downloaded files',
    text: 'This started with a really stupid problem.\n\nMy Downloads folder wasn’t huge, but every time I tried cleaning it up, I’d end up opening random files just to remember why I downloaded them.\n\nsetup.exe\ndocument (12).pdf\ndriver.zip\nresume_final_v4.pdf\n\nWhen I downloaded them, I knew exactly why I needed them.\n\nA few weeks later, I had no idea…',
    url: 'https://reddit.com',
    date: 'Jun 29, 2026',
    createdAt: Date.now() - 86400000 * 49,
    tags: [
      { name: 'open source', color: 'green' },
      { name: 'productivity', color: 'amber' }
    ],
    isFavorite: false,
    isArchived: false,
    collectionId: 'col-1'
  }
];
