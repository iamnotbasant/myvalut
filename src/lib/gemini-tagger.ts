import * as cheerio from 'cheerio';
import { TagColor, PlatformType } from '@/types/stashr';

// 1. Tag Colors Palette
export const TAG_COLORS: TagColor[] = [
  'violet',
  'amber',
  'teal',
  'green',
  'indigo',
  'orange',
  'pink',
  'blue',
  'cyan',
  'red'
];

// 2. Known mappings for standard industry tools and variations
export const SYNONYM_MAP: Record<string, string> = {
  'artificial intelligence': 'ai',
  'machine learning': 'ml',
  'deep learning': 'dl',
  'videoediting': 'video editing',
  'premier pro': 'premiere pro',
  'adobe premiere': 'premiere pro',
  'premiere': 'premiere pro',
  'aftereffects': 'after effects',
  'ae': 'after effects',
  'davinci': 'davinci resolve',
  'davinci resolve studio': 'davinci resolve',
  'reactjs': 'react',
  'nextjs': 'next js',
  'next.js': 'next js',
  'vuejs': 'vue',
  'tailwind css': 'tailwind',
  'tailwindcss': 'tailwind',
  'javascript': 'js',
  'typescript': 'ts',
  'gpt4': 'chatgpt',
  'gpt-4': 'chatgpt',
  'gpt-4o': 'chatgpt',
  'openai chatgpt': 'chatgpt',
  'midjourney ai': 'midjourney',
  'figma design': 'figma',
  'claude ai': 'claude',
  'gemini ai': 'gemini',
  'vscode': 'vs code',
  'visual studio code': 'vs code',
  'python programming': 'python',
  'grand theft auto vi': 'gta 6',
  'grand theft auto 6': 'gta 6',
  'grand theft auto v': 'gta 5',
  'grand theft auto 5': 'gta 5',
  'grand theft auto': 'gta',
  'playstation 5': 'ps5',
  'playstation 4': 'ps4',
  'xbox series x': 'xbox',
  'counter strike 2': 'cs2',
  'counter strike': 'cs',
  'red dead redemption 2': 'rdr2',
  'red dead redemption': 'rdr',
  'search engine optimization': 'seo',
  'user interface': 'ui ux',
  'user experience': 'ui ux'
};

// 3. Normalizer & Cleanup Function
export function normalizeAndCleanTags(rawTags: string[]): Array<{ name: string; color: TagColor }> {
  if (!Array.isArray(rawTags)) return [];

  const cleaned = rawTags
    .map(tag => {
      if (typeof tag !== 'string') return '';
      return tag
        .toLowerCase()
        .replace(/[-_]/g, ' ')             // Hyphens and underscores -> normal space
        .replace(/[^a-z0-9\s]/g, '')       // Remove special characters (#, @, etc.)
        .replace(/\s+/g, ' ')              // Collapse multiple spaces to single space
        .trim();
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => tag.length >= 2);       // Remove single-character junk

  // Deduplicate while preserving order
  const uniqueTagNames = Array.from(new Set(cleaned));

  // Dynamic cap: Minimum 2, maximum 6 tags
  const cappedTagNames = uniqueTagNames.slice(0, 6);

  // Assign deterministic, aesthetic colors
  return cappedTagNames.map((name, index) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % TAG_COLORS.length;
    return {
      name,
      color: TAG_COLORS[colorIndex] || TAG_COLORS[index % TAG_COLORS.length]
    };
  });
}

// 4. Safe Backend Processing (Safe-Pass & Sanitization)
export function processIncomingTags(tagsArray: any[]): Array<{ name: string; color: TagColor }> {
  if (!Array.isArray(tagsArray)) return [];

  const sanitized = tagsArray
    .map(tag => {
      return String(tag)
        .toLowerCase()
        .replace(/[-_]/g, ' ')           // Convert hyphens/underscores to spaces
        .replace(/[^a-z0-9\s]/g, '')     // Strip special chars (#, @, etc.)
        .replace(/\s+/g, ' ')            // Normalize multiple spaces
        .trim();
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => tag.length >= 2);     // Strip meaningless 1-letter noise

  // Deduplicate and hard-cap at 6
  const uniqueTagNames = Array.from(new Set(sanitized)).slice(0, 6);

  return uniqueTagNames.map((name, index) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % TAG_COLORS.length;
    return {
      name,
      color: TAG_COLORS[colorIndex] || TAG_COLORS[index % TAG_COLORS.length]
    };
  });
}

// Alias for backward compatibility
export const assembleFinalTags = (aiJson: any) => {
  if (!aiJson || typeof aiJson !== 'object') return [];
  const tags = Array.isArray(aiJson.tags)
    ? aiJson.tags
    : [aiJson.category, ...(Array.isArray(aiJson.tools) ? aiJson.tools : []), ...(Array.isArray(aiJson.topics) ? aiJson.topics : []), aiJson.content_format, ...(Array.isArray(aiJson.final_tags) ? aiJson.final_tags : [])];
  return processIncomingTags(tags);
};

// 5. Platform Detection
export function detectPlatformFromUrl(url: string): PlatformType {
  const lowercaseUrl = url.toLowerCase();
  if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'youtube';
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'twitter';
  if (lowercaseUrl.includes('reddit.com') || lowercaseUrl.includes('redd.it')) return 'reddit';
  if (lowercaseUrl.includes('instagram.com')) return 'instagram';
  if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
  if (lowercaseUrl.includes('pinterest.com')) return 'pinterest';
  if (lowercaseUrl.includes('bsky.app') || lowercaseUrl.includes('bluesky')) return 'bluesky';
  if (lowercaseUrl.includes('threads.net')) return 'threads';
  return 'web';
}

export interface ExtractedMetadata {
  title: string;
  text: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  imageUrl?: string;
  platform: PlatformType;
  url: string;
}

// 6. High-Signal Platform Scrapers
export async function scrapeUrlMetadata(inputUrl: string): Promise<ExtractedMetadata> {
  const platform = detectPlatformFromUrl(inputUrl);
  let title = '';
  let text = '';
  let displayName = 'Creator';
  let username = 'creator';
  let avatarUrl = '';
  let imageUrl = '';

  try {
    if (platform === 'youtube') {
      // 1. YouTube oEmbed & video details
      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(inputUrl)}&format=json`,
          { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } }
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          title = data.title || '';
          displayName = data.author_name || 'YouTube Creator';
          if (data.author_url) {
            const handleMatch = data.author_url.match(/@([^/?]+)/);
            if (handleMatch) {
              username = handleMatch[1].toLowerCase();
            } else {
              username = (data.author_name || 'youtube').toLowerCase().replace(/[^a-z0-9_]/g, '');
            }
          } else {
            username = (data.author_name || 'youtube').toLowerCase().replace(/[^a-z0-9_]/g, '');
          }
          imageUrl = data.thumbnail_url || '';
        }
      } catch (e) {
        console.warn('YouTube oembed fallback:', e);
      }

      // 2. YouTube HTML scraping for Channel Avatar & Real Description
      try {
        const pageRes = await fetch(inputUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          const $ = cheerio.load(html);

          if (!title) title = $('meta[name="title"]').attr('content') || $('title').text() || '';

          // Extract Channel Avatar from YouTube CDN
          const avatarRegex = /https:\/\/yt3\.ggpht\.com\/[a-zA-Z0-9_\-]+(=s[0-9]+-c-k-c0x[a-f0-9]+-no-rj)?/g;
          const avatars = html.match(avatarRegex);
          if (avatars && avatars.length > 0) {
            avatarUrl = avatars[0];
          }

          // Extract real video description (bypass generic YouTube meta description)
          let metaDesc =
            $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') ||
            '';

          if (!metaDesc || metaDesc.includes('Enjoy the videos and music you love')) {
            const descMatch = html.match(/"description":\{"simpleText":"(.*?)"\}/);
            if (descMatch) {
              metaDesc = descMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
            } else {
              const shortDescMatch = html.match(/"shortDescription":"(.*?)"/);
              if (shortDescMatch) {
                metaDesc = shortDescMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
              }
            }
          }

          text = metaDesc.trim().slice(0, 1500);
          if (!imageUrl) imageUrl = $('meta[property="og:image"]').attr('content') || '';
        }
      } catch (err) {
        console.warn('YouTube page scraping fallback:', err);
      }
    } else if (platform === 'reddit') {
      // Reddit JSON endpoint for public posts
      try {
        let cleanRedditUrl = inputUrl.split('?')[0].replace(/\/$/, '');
        if (!cleanRedditUrl.endsWith('.json')) cleanRedditUrl += '.json';

        const redditRes = await fetch(cleanRedditUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });

        if (redditRes.ok) {
          const data = await redditRes.json();
          const post = data?.[0]?.data?.children?.[0]?.data;
          if (post) {
            title = post.title || '';
            const subreddit = post.subreddit_name_prefixed || `r/${post.subreddit}`;
            displayName = subreddit;
            username = post.author || 'reddit_user';
            text = post.selftext ? post.selftext.slice(0, 1000) : title;
            imageUrl =
              post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') ||
              (post.thumbnail?.startsWith('http') ? post.thumbnail : '');

            // Subreddit Icon
            avatarUrl =
              post.sr_detail?.community_icon?.replace(/&amp;/g, '&') ||
              post.sr_detail?.icon_img?.replace(/&amp;/g, '&') ||
              `https://unavatar.io/reddit/${post.subreddit}`;
          }
        }
      } catch (e) {
        console.warn('Reddit json fallback:', e);
      }
    } else if (platform === 'twitter') {
      // X / Twitter syndication or fxtwitter API
      try {
        const fxUrl = inputUrl.replace(/twitter\.com|x\.com/, 'api.fxtwitter.com');
        const fxRes = await fetch(fxUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (fxRes.ok) {
          const data = await fxRes.json();
          const tweet = data.tweet;
          if (tweet) {
            text = tweet.text || '';
            displayName = tweet.author?.name || 'X User';
            username = tweet.author?.screen_name || 'xuser';
            avatarUrl = tweet.author?.avatar_url || `https://unavatar.io/x/${username}`;
            imageUrl = tweet.media?.photos?.[0]?.url || tweet.media?.videos?.[0]?.thumbnail_url || '';
            title = text.length > 60 ? `${text.slice(0, 60)}...` : text;
          }
        }
      } catch (e) {
        console.warn('Twitter fx fallback:', e);
      }

      // Twitter oEmbed fallback if fxtwitter fails
      if (!text) {
        try {
          const oembedRes = await fetch(
            `https://publish.twitter.com/oembed?url=${encodeURIComponent(inputUrl)}`
          );
          if (oembedRes.ok) {
            const data = await oembedRes.json();
            displayName = data.author_name || 'X User';
            const $ = cheerio.load(data.html || '');
            text = $('p').text() || '';
            title = text.length > 60 ? `${text.slice(0, 60)}...` : text;
            if (data.author_url) {
              const handle = data.author_url.split('/').filter(Boolean).pop();
              if (handle) {
                username = handle;
                avatarUrl = `https://unavatar.io/x/${handle}`;
              }
            }
          }
        } catch {}
      }
    } else {
      // General Web Page / Blog / GitHub scraper
      const pageRes = await fetch(inputUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const $ = cheerio.load(html);

        title =
          $('meta[property="og:title"]').attr('content') ||
          $('meta[name="twitter:title"]').attr('content') ||
          $('title').text() ||
          $('h1').first().text() ||
          '';

        const metaDesc =
          $('meta[property="og:description"]').attr('content') ||
          $('meta[name="description"]').attr('content') ||
          $('meta[name="twitter:description"]').attr('content') ||
          '';

        // Extract first 2 paragraphs for rich article context
        let bodyText = '';
        $('p').slice(0, 3).each((_, el) => {
          bodyText += $(el).text() + ' ';
        });

        text = (metaDesc + ' ' + bodyText).trim().slice(0, 1200);

        imageUrl =
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content') ||
          '';

        const siteName =
          $('meta[property="og:site_name"]').attr('content') ||
          $('meta[name="application-name"]').attr('content') ||
          new URL(inputUrl).hostname.replace(/^www\./, '');

        displayName = siteName;
        username = new URL(inputUrl).hostname.replace(/^www\./, '');

        // GitHub Avatar or High-Res Web Favicon
        if (inputUrl.includes('github.com')) {
          const userSegment = new URL(inputUrl).pathname.split('/').filter(Boolean)[0];
          if (userSegment) {
            username = userSegment;
            avatarUrl = `https://github.com/${userSegment}.png`;
          }
        }

        if (!avatarUrl) {
          avatarUrl =
            $('link[rel="apple-touch-icon"]').attr('href') ||
            $('link[rel="icon"]').attr('href') ||
            `https://www.google.com/s2/favicons?domain=${new URL(inputUrl).hostname}&sz=128`;
          
          if (avatarUrl && !avatarUrl.startsWith('http')) {
            try {
              avatarUrl = new URL(avatarUrl, inputUrl).toString();
            } catch {}
          }
        }
      }
    }
  } catch (err) {
    console.error('Error scraping URL:', err);
  }

  // Fallbacks if scraping couldn't find fields
  if (!title) {
    try {
      title = new URL(inputUrl).pathname.split('/').filter(Boolean).pop() || new URL(inputUrl).hostname;
    } catch {
      title = inputUrl;
    }
  }

  if (!text) {
    text = title;
  }

  return {
    title: title.trim(),
    text: text.trim(),
    displayName: displayName.trim() || 'Creator',
    username: username.trim() || 'creator',
    avatarUrl: avatarUrl || undefined,
    imageUrl: imageUrl || undefined,
    platform,
    url: inputUrl,
  };
}

// 7. Open-World Gemini System Prompt & Caller
const GEMINI_SYSTEM_PROMPT = `You are an autonomous, high-precision content indexing engine for a personal knowledge vault.
Analyze the given content and extract between 2 to 6 high-utility search tags based strictly on its actual substance.

EXTRACTION PRINCIPLES:
1. True Subject Identification: Detect the actual domain or primary theme organically without forcing pre-defined categories.
2. Entity Priority: If a specific software, tool, framework, person, device, method, or named concept is central to the content, tag it directly by name.
3. Depth-Driven Scaling (Dynamic 2-6):
   - Low information density (simple remark, short quote, basic image): Output 2-3 tags.
   - High information density (detailed guide, deep breakdown, technical post, multi-step process): Output 4-6 tags.
4. Search Utility: Every tag must be a phrase or term a user would naturally search to find this content later.
5. Strict Format Constraints:
   - Output must be purely lowercase words with normal spaces.
   - Strictly NO hyphens (-), NO hashtags (#), NO underscores (_).
   - Strictly NO duplicate tags or trivial variations (e.g., do not output both "chatgpt" and "gpt").
   - Maximum 6 tags, Minimum 2 tags.

INPUT:
Platform: {platform}
Title: {title}
Context: {content_text}

OUTPUT FORMAT (JSON ONLY):
{
  "content_density": "low" | "medium" | "high",
  "tags": ["string", "string", "string"]
}`;

export interface GeminiTagResponse {
  content_density: 'low' | 'medium' | 'high';
  tags: string[];
}

export async function generateGeminiTags(params: {
  platform: string;
  title: string;
  text: string;
  apiKey?: string;
}): Promise<{
  tags: Array<{ name: string; color: TagColor }>;
  rawDetails: GeminiTagResponse | null;
}> {
  const { platform, title, text, apiKey: providedKey } = params;

  // Resolve API Key: provided key > server GEMINI_API_KEY > NEXT_PUBLIC_GEMINI_API_KEY
  const apiKey =
    providedKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn('[Valut] No Gemini API key found — using intelligent heuristic fallback for tags.');
    return {
      tags: generateIntelligentFallbackTags(platform, title, text),
      rawDetails: null,
    };
  }

  const promptContent = `Platform: ${platform}
Title: ${title}
Context: ${text.slice(0, 3000)}`;

  // Correct Gemini model IDs (as of 2026)
  const modelCandidates = [
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ];

  try {
    let rawJsonText = '';

    for (const model of modelCandidates) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: GEMINI_SYSTEM_PROMPT }],
            },
            contents: [
              {
                parts: [{ text: promptContent }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) {
            rawJsonText = resultText;
            console.log(`[Valut] AI tags generated successfully via model: ${model}`);
            break;
          }
        } else {
          const errBody = await res.text().catch(() => '');
          console.warn(`[Valut] Model ${model} returned HTTP ${res.status}: ${errBody.slice(0, 200)}`);
        }
      } catch (innerErr) {
        console.warn(`[Valut] Model ${model} attempt failed:`, innerErr);
      }
    }

    if (!rawJsonText) {
      throw new Error('All Gemini model endpoints failed — check your API key (should start with "AIza")');
    }

    const parsed: GeminiTagResponse = JSON.parse(rawJsonText);
    const tagsToProcess = Array.isArray(parsed.tags) ? parsed.tags : [];
    const cleanTags = processIncomingTags(tagsToProcess);

    return {
      tags: cleanTags,
      rawDetails: parsed,
    };
  } catch (err: any) {
    console.error('[Valut] Gemini tag generation error:', err.message || err);
    console.warn('[Valut] Falling back to intelligent heuristic tagging.');
    return {
      tags: generateIntelligentFallbackTags(platform, title, text),
      rawDetails: null,
    };
  }
}

// 8. Intelligent Heuristic Fallback — used when Gemini API is unavailable
// Extracts meaningful multi-word phrases instead of just splitting title into words
function generateIntelligentFallbackTags(
  platform: string,
  title: string,
  text: string
): Array<{ name: string; color: TagColor }> {
  const combined = (title + ' ' + text).toLowerCase();

  // Stop words to filter out
  const STOP_WORDS = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its',
    'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did', 'let', 'say', 'she',
    'too', 'use', 'will', 'with', 'this', 'that', 'from', 'have', 'what', 'been',
    'more', 'when', 'some', 'them', 'than', 'each', 'make', 'like', 'long', 'look',
    'many', 'most', 'over', 'such', 'take', 'into', 'just', 'know', 'your', 'come',
    'could', 'about', 'other', 'would', 'after', 'their', 'which', 'these', 'being',
    'very', 'also', 'here', 'much', 'then', 'those', 'made', 'they', 'only',
    'first', 'where', 'does', 'doing', 'every', 'should', 'through', 'back',
    'video', 'watch', 'https', 'http', 'www', 'com', 'best', 'ever', 'real',
    'official', 'full', 'extended', 'look', 'part', 'episode', 'season',
  ]);

  // Known multi-word entity patterns to detect as single tags
  const KNOWN_ENTITIES: Array<{ pattern: RegExp; tag: string }> = [
    { pattern: /grand theft auto\s*(vi|6)/i, tag: 'gta 6' },
    { pattern: /grand theft auto\s*(v|5)/i, tag: 'gta 5' },
    { pattern: /grand theft auto/i, tag: 'gta' },
    { pattern: /red dead redemption\s*2/i, tag: 'rdr2' },
    { pattern: /red dead redemption/i, tag: 'rdr' },
    { pattern: /call of duty/i, tag: 'call of duty' },
    { pattern: /counter\s*strike\s*2/i, tag: 'cs2' },
    { pattern: /playstation\s*5/i, tag: 'ps5' },
    { pattern: /playstation\s*4/i, tag: 'ps4' },
    { pattern: /xbox series/i, tag: 'xbox' },
    { pattern: /nintendo switch/i, tag: 'nintendo switch' },
    { pattern: /artificial intelligence/i, tag: 'ai' },
    { pattern: /machine learning/i, tag: 'ml' },
    { pattern: /deep learning/i, tag: 'dl' },
    { pattern: /premiere pro/i, tag: 'premiere pro' },
    { pattern: /after effects/i, tag: 'after effects' },
    { pattern: /davinci resolve/i, tag: 'davinci resolve' },
    { pattern: /final cut/i, tag: 'final cut pro' },
    { pattern: /visual studio code|vs\s*code/i, tag: 'vs code' },
    { pattern: /next\.?js/i, tag: 'next js' },
    { pattern: /react\.?js|reactjs/i, tag: 'react' },
    { pattern: /tailwind\s*css/i, tag: 'tailwind' },
    { pattern: /open\s*ai/i, tag: 'openai' },
    { pattern: /chat\s*gpt|gpt[\s-]*4/i, tag: 'chatgpt' },
    { pattern: /web\s*development/i, tag: 'web dev' },
    { pattern: /game\s*play/i, tag: 'gameplay' },
    { pattern: /unreal engine/i, tag: 'unreal engine' },
    { pattern: /rockstar games/i, tag: 'rockstar' },
    { pattern: /elon musk/i, tag: 'elon musk' },
    { pattern: /iphone\s*\d*/i, tag: 'iphone' },
    { pattern: /apple\s*vision/i, tag: 'apple vision pro' },
    { pattern: /mr\.?\s*beast|mrbeast/i, tag: 'mrbeast' },
    { pattern: /mkbhd|marques brownlee/i, tag: 'mkbhd' },
    { pattern: /linus tech/i, tag: 'linus tech tips' },
    { pattern: /crypto\s*currency/i, tag: 'crypto' },
    { pattern: /block\s*chain/i, tag: 'blockchain' },
  ];

  // Content-type detection patterns
  const CONTENT_TYPES: Array<{ pattern: RegExp; tag: string }> = [
    { pattern: /\btutorial\b/i, tag: 'tutorial' },
    { pattern: /\breview\b/i, tag: 'review' },
    { pattern: /\btrailer\b/i, tag: 'trailer' },
    { pattern: /\bunboxing\b/i, tag: 'unboxing' },
    { pattern: /\bpodcast\b/i, tag: 'podcast' },
    { pattern: /\binterview\b/i, tag: 'interview' },
    { pattern: /\bbreaking news\b/i, tag: 'breaking news' },
    { pattern: /\bhow[\s-]to\b/i, tag: 'how to' },
    { pattern: /\bdiy\b/i, tag: 'diy' },
    { pattern: /\brecipe\b/i, tag: 'recipe' },
    { pattern: /\bvlog\b/i, tag: 'vlog' },
    { pattern: /\bshorts?\b/i, tag: 'short' },
    { pattern: /\bexplained\b/i, tag: 'explainer' },
    { pattern: /\bcooking\b/i, tag: 'cooking' },
    { pattern: /\bfitness|workout\b/i, tag: 'fitness' },
    { pattern: /\bmusic\b/i, tag: 'music' },
    { pattern: /\bcomedy|funny\b/i, tag: 'comedy' },
    { pattern: /\bscience\b/i, tag: 'science' },
    { pattern: /\bgaming\b/i, tag: 'gaming' },
    { pattern: /\bprogramming|coding\b/i, tag: 'programming' },
    { pattern: /\bdesign\b/i, tag: 'design' },
    { pattern: /\bphotography\b/i, tag: 'photography' },
    { pattern: /\banimation|animated\b/i, tag: 'animation' },
  ];

  // Domain/topic detection patterns
  const DOMAIN_PATTERNS: Array<{ pattern: RegExp; tag: string }> = [
    { pattern: /\bgame|gaming|gamer\b/i, tag: 'gaming' },
    { pattern: /\bcrypto|bitcoin|ethereum\b/i, tag: 'crypto' },
    { pattern: /\btech|technology\b/i, tag: 'tech' },
    { pattern: /\bsports?\b/i, tag: 'sports' },
    { pattern: /\bfashion|style\b/i, tag: 'fashion' },
    { pattern: /\btravel\b/i, tag: 'travel' },
    { pattern: /\bfood\b/i, tag: 'food' },
    { pattern: /\bhealth\b/i, tag: 'health' },
    { pattern: /\bpolitics|political\b/i, tag: 'politics' },
    { pattern: /\bfinance|investing|stock\b/i, tag: 'finance' },
    { pattern: /\bstartup\b/i, tag: 'startup' },
    { pattern: /\beducation|learn\b/i, tag: 'education' },
    { pattern: /\bfilm|movie|cinema\b/i, tag: 'film' },
    { pattern: /\banime|manga\b/i, tag: 'anime' },
    { pattern: /\bart|artist\b/i, tag: 'art' },
    { pattern: /\bcar|automotive|vehicle\b/i, tag: 'automotive' },
    { pattern: /\bspace|nasa|rocket\b/i, tag: 'space' },
  ];

  const extractedTags: string[] = [];

  // 1. Match known multi-word entities first
  for (const { pattern, tag } of KNOWN_ENTITIES) {
    if (pattern.test(combined) && !extractedTags.includes(tag)) {
      extractedTags.push(tag);
    }
  }

  // 2. Match content types
  for (const { pattern, tag } of CONTENT_TYPES) {
    if (pattern.test(combined) && !extractedTags.includes(tag)) {
      extractedTags.push(tag);
    }
  }

  // 3. Match domain/topic patterns
  for (const { pattern, tag } of DOMAIN_PATTERNS) {
    if (pattern.test(combined) && !extractedTags.includes(tag)) {
      extractedTags.push(tag);
    }
  }

  // 4. Extract significant standalone words from title (as last resort filler)
  if (extractedTags.length < 3) {
    const titleWords = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !STOP_WORDS.has(w));

    // Prefer words that appear in synonym map or are proper nouns (capitalized in original)
    for (const word of titleWords) {
      const mapped = SYNONYM_MAP[word] || word;
      if (!extractedTags.includes(mapped) && extractedTags.length < 5) {
        extractedTags.push(mapped);
      }
    }
  }

  // 5. Always include platform as context (but don't let it dominate)
  if (!extractedTags.includes(platform) && extractedTags.length < 6) {
    extractedTags.push(platform);
  }

  // Ensure minimum 2 tags
  if (extractedTags.length < 2) {
    // Use the full title as a tag if nothing else matched
    const titleTag = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 30);
    if (titleTag && !extractedTags.includes(titleTag)) {
      extractedTags.push(titleTag);
    }
  }

  return processIncomingTags(extractedTags.slice(0, 6));
}
