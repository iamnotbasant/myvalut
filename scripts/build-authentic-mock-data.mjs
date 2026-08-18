import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

// Find all text blocks inside group/bookmarkcard
const cardRegex = /class="[^"]*group\/bookmarkcard[^"]*"([\s\S]*?)(?=<div class="[^"]*group\/bookmarkcard|$)/g;
const cards = [...main.matchAll(cardRegex)];

console.log('Extracted cards from live main:', cards.length);

// User provided real links
const userLinks = [
  { url: "https://x.com/theayangfx/status/2083508791870738673", platform: "twitter", author: "TheAyanGfx", user: "theayangfx", text: "3D Blender visual showcase and typography layout design pack #design #3d", tag: "Design", color: "violet" },
  { url: "https://x.com/MAQIB135/status/2083571595810120015", platform: "twitter", author: "Aqib", user: "MAQIB135", text: "Minimalist UI interaction design experiments for modern web applications.", tag: "UI/UX", color: "indigo" },
  { url: "https://x.com/HakimiHamizi/status/2083559403807236581", platform: "twitter", author: "Hakimi Hamizi", user: "HakimiHamizi", text: "The ultimate typography and hierarchy guide for frontend engineers.", tag: "Typography", color: "teal" },
  { url: "https://x.com/loficosmos1/status/2084025812886376481", platform: "twitter", author: "Lofi Cosmos", user: "loficosmos1", text: "Ambient study sessions and creative flow state music playlist recommendation.", tag: "Inspiration", color: "amber" },
  { url: "https://x.com/JaejinBong/status/2083900392065442287", platform: "twitter", author: "Jaejin Bong", user: "JaejinBong", text: "Crafting fluid animations with Framer Motion and modern CSS transitions.", tag: "Development", color: "blue" },
  { url: "https://x.com/joseph_tsar_/status/2083651579886940446", platform: "twitter", author: "Joseph Tsar", user: "joseph_tsar_", text: "SaaS growth breakdown: From 0 to $50k MRR with clean design systems.", tag: "Marketing", color: "green" },
  { url: "https://x.com/arceyul/status/2083881692880683245", platform: "twitter", author: "Arce", user: "arceyul", text: "Poster collection and brutalist graphic design concepts for branding.", tag: "Design", color: "pink" },
  { url: "https://x.com/xiathis/status/2084021553931411865", platform: "twitter", author: "Xiathis", user: "xiathis", text: "Shader art and WebGL generative experiments running in real-time.", tag: "Development", color: "cyan" },
  { url: "https://x.com/vfxcarter/status/2084414167633523059", platform: "twitter", author: "Carter VFX", user: "vfxcarter", text: "Motion design breakdown: After Effects kinetic typography tips.", tag: "Design", color: "orange" },
  { url: "https://x.com/Manixh02/status/2085903702087610701", platform: "twitter", author: "Manish", user: "Manixh02", text: "Modern Tailwind CSS components and utility tips for Next.js developers.", tag: "Development", color: "blue" },
  { url: "https://x.com/hal__lee/status/2085635154236817524", platform: "twitter", author: "Hal Lee", user: "hal__lee", text: "Micro-interactions and subtle feedback loops that make web apps feel native.", tag: "UI/UX", color: "indigo" },
  { url: "https://x.com/kail_designs/status/2086838370421125481", platform: "twitter", author: "Kai L.", user: "kail_designs", text: "Design token architecture: Scaling color modes from Light to Dark seamlessly.", tag: "Design", color: "violet" },
  { url: "https://x.com/AdityaSur11/status/2087547151568269773", platform: "twitter", author: "Aditya Sur", user: "AdityaSur11", text: "Building high-performance web applications with React 19 and Next.js App Router.", tag: "Development", color: "blue" },
  { url: "https://x.com/Nozelcode/status/2087622539010814072", platform: "twitter", author: "Nozel", user: "Nozelcode", text: "Fullstack architecture patterns with TypeScript, drizzle ORM, and PostgreSQL.", tag: "Development", color: "teal" },
  { url: "https://x.com/fuyofulo/status/2088236952676184215", platform: "twitter", author: "Fuyo", user: "fuyofulo", text: "Iconography sets and pixel art vectors for game dev and indie hacker tools.", tag: "Design", color: "pink" },
  { url: "https://x.com/covacut/status/2087958248154648663", platform: "twitter", author: "CovaCut", user: "covacut", text: "Video editing shortcuts and premier color grading LUT presets.", tag: "Resources", color: "amber" },
  { url: "https://x.com/iannuttall/status/2089091747972333632", platform: "twitter", author: "Ian Nuttall", user: "iannuttall", text: "Building niche programmatic SEO directories and monetizing traffic efficiently.", tag: "Marketing", color: "green" },
  { url: "https://x.com/sondesix/status/2088632581302677529", platform: "twitter", author: "Sonde Six", user: "sondesix", text: "Synthwave soundscapes and audio design presets for retro futurism.", tag: "Inspiration", color: "violet" },
  { url: "https://www.reddit.com/r/Fitness_India/comments/1t789rp/m27_vitamin_deficiency_solution/", platform: "reddit", author: "r/Fitness_India", user: "Fitness_India", text: "M27 Vitamin deficiency solution and complete blood panel breakdown with diet recommendations.", tag: "Health", color: "green" },
  { url: "https://www.reddit.com/r/PiracyBackup/comments/1t649xv/use_your_real_debrid_as_you_unlimited_storage/", platform: "reddit", author: "r/PiracyBackup", user: "PiracyBackup", text: "How to use your Real Debrid as unlimited cloud storage mount with WebDAV / rclone.", tag: "Tools", color: "orange" },
  { url: "https://www.reddit.com/r/HowToMen/comments/1tfu5qz/promo_battery_hero_is_a_free_battery_app_with_no/", platform: "reddit", author: "r/HowToMen", user: "HowToMen", text: "[Promo] Battery Hero is a free battery monitoring app with no ads or analytics trackers.", tag: "Apps", color: "cyan" },
  { url: "https://www.reddit.com/r/HowToMen/comments/1teopm0/app_stop_forgetting_links_save_anything_get/", platform: "reddit", author: "r/HowToMen", user: "HowToMen", text: "[App] Stop forgetting links: Save anything, get automated AI categorization and tags.", tag: "Tools", color: "indigo" },
  { url: "https://www.reddit.com/r/MorpheApp/comments/1ujujnj/i_made_the_universal_patches_to_claim_ad_rewards/", platform: "reddit", author: "r/MorpheApp", user: "MorpheApp", text: "Universal patch notes and release log for ad rewards integration.", tag: "Tools", color: "teal" },
  { url: "https://www.reddit.com/r/HowToMen/comments/1uk9gg8/top_three_dynamic_island_apps/", platform: "reddit", author: "r/HowToMen", user: "HowToMen", text: "Top three dynamic island apps for Android with custom animations and music widgets.", tag: "Apps", color: "blue" },
  { url: "https://www.reddit.com/r/BookmarkManagers/comments/1ump7e4/made_a_chrome_extension_to_autocategorise_all/", platform: "reddit", author: "r/BookmarkManagers", user: "BookmarkManagers", text: "I made a Chrome extension to auto-categorise all incoming bookmarks with local embeddings.", tag: "Tools", color: "indigo" },
  { url: "https://www.reddit.com/r/BookmarkManagers/comments/1utjnm7/what_makes_savesync_the_ultimate_automated_fix/", platform: "reddit", author: "r/BookmarkManagers", user: "BookmarkManagers", text: "What makes SaveSync the ultimate automated cross-browser fix for link hoarding.", tag: "Tools", color: "blue" },
  { url: "https://www.reddit.com/r/HowToMen/comments/1uvcsk7/promotionapp_most_hybrid_browser_you_will_see_on/", platform: "reddit", author: "r/HowToMen", user: "HowToMen", text: "[Promotion] The most hybrid custom browser experience you will see on mobile devices.", tag: "Apps", color: "cyan" },
  { url: "https://www.reddit.com/r/PiracyArchive/comments/1vdnrm6/telestremio_v102_turn_your_telegram_channels_into/", platform: "reddit", author: "r/PiracyArchive", user: "PiracyArchive", text: "TeleStremio v1.0.2: Turn your Telegram media channels into Stremio streaming streams.", tag: "Tools", color: "orange" },
  { url: "https://www.reddit.com/r/TeenIndia/comments/1v6w6nx/is_this_normal_behaviour_for_a_dog/", platform: "reddit", author: "r/TeenIndia", user: "TeenIndia", text: "Is this normal behavior for a golden retriever puppy when playing with toys outdoors?", tag: "Community", color: "pink" },
  { url: "https://www.reddit.com/r/HowToMen/comments/1vkuxil/app_promo_i_spent_8_months_building_a_gallery_app/", platform: "reddit", author: "r/HowToMen", user: "HowToMen", text: "[App Promo] I spent 8 months building a modern offline gallery app with zero bloat.", tag: "Apps", color: "amber" }
];

console.log('Total user seed bookmarks:', userLinks.length);
