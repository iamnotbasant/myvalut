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

// 3. Hard Blacklist for Clickbait verbs and Platform words
export const HARD_BLACKLIST = new Set([
  'tells', 'tell', 'know', 'youtube', 'video', 'videos', 
  'tips', 'tricks', 'secret', 'secrets', 'best', 'watch',
  'learn', 'using', 'insane', 'things', 'stop', 'make',
  'twitter', 'x', 'reddit', 'instagram', 'tiktok', 'threads'
]);

// 4. Normalizer & Cleanup Function with Post-Filter Guardrail
export function normalizeVaultTags(rawTags: string[]): string[] {
  if (!Array.isArray(rawTags)) return [];

  const cleaned = rawTags
    .map(tag => 
      String(tag)
        .toLowerCase()
        .replace(/[-_]/g, ' ')             // Hyphens -> Spaces
        .replace(/[^a-z0-9\s]/g, '')       // Special characters removed
        .replace(/\s+/g, ' ')              // Extra spacing removed
        .trim()
    )
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => tag.length >= 2 && !HARD_BLACKLIST.has(tag));

  return Array.from(new Set(cleaned)).slice(0, 6);
}

// 5. Safe Backend Processing (Assigns deterministic colors)
export function processIncomingTags(tagsArray: any[]): Array<{ name: string; color: TagColor }> {
  const cleanTagNames = normalizeVaultTags(tagsArray);

  return cleanTagNames.map((name, index) => {
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
export const normalizeAndCleanTags = processIncomingTags;

export const assembleFinalTags = (aiJson: any) => {
  if (!aiJson || typeof aiJson !== 'object') return [];
  const tags = Array.isArray(aiJson.tags)
    ? aiJson.tags
    : [aiJson.category, ...(Array.isArray(aiJson.tools) ? aiJson.tools : []), ...(Array.isArray(aiJson.topics) ? aiJson.topics : []), aiJson.content_format, ...(Array.isArray(aiJson.final_tags) ? aiJson.final_tags : [])];
  return processIncomingTags(tags);
};

// 6. Platform Detection
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

// 7. High-Signal Platform Scrapers
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

          const YOUTUBE_BOILERPLATE = 'enjoy the videos and music you love, upload original content';
          if (metaDesc.toLowerCase().includes(YOUTUBE_BOILERPLATE)) {
            const descMatch = html.match(/"description":\{"simpleText":"(.*?)"\}/);
            if (descMatch) {
              metaDesc = descMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
            } else {
              const shortDescMatch = html.match(/"shortDescription":"(.*?)"/);
              if (shortDescMatch) {
                metaDesc = shortDescMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
              } else {
                metaDesc = '';
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

// 8. Exact Knowledge Vault Production Prompt
const TAGGER_SYSTEM_PROMPT = `
You are the core metadata extraction and search-indexing engine for a knowledge vault.
Your job is to generate 2 to 6 high-utility search tags from the provided content metadata.

CRITICAL EXTRACTION RULES:
1. COMPOUND NOUN PHRASES ONLY:
   - NEVER split multi-word concepts into separate words.
   - Example: Output "sound design", NEVER "sound" and "design".
   - Example: Output "video editing", NEVER "video" and "editing".
   - Example: Output "audio mixing", NEVER "audio" and "mixing".

2. STRICT FORBIDDEN WORDS (NEVER TAG THESE):
   - NO Common Verbs / Clickbait Fillers: "tells", "know", "learn", "using", "secret", "secrets", "insane", "best", "tips", "tricks", "watch", "things", "stop", "make".
   - NO Platform Names: DO NOT output "youtube", "twitter", "x", "reddit", "instagram" unless the video is specifically an analytical guide about that platform's algorithm.

3. BOILERPLATE CONTAMINATION HANDLING:
   - If the description/content contains generic platform fallback text (e.g., "Enjoy the videos and music you love, upload original content..."), IGNORE IT COMPLETELY. 
   - Rely strictly on the Title, Channel/Author name, and infer the core technical discipline.

4. TAGGING PRIORITY & DENSITY (DYNAMIC 2-6 TAGS):
   - Primary Subject / Discipline (e.g., "sound design", "video editing", "color grading")
   - Specific Tools / Assets / Entities (e.g., "sfx", "epidemic sound", "premiere pro", "davinci resolve")
   - Technique / Sub-topic (e.g., "audio mixing", "foley", "sound variation")
   - Format / Intent (e.g., "tutorial", "breakdown", "workflow")

5. FORMAT REQUIREMENTS:
   - Strictly lowercase words with normal spaces.
   - Absolutely NO hyphens (-), NO hashtags (#), NO underscores (_).
   - Maximum 6 tags, Minimum 2 tags.

INPUT FORMAT:
Title: {title}
Author/Channel: {author}
Platform: {platform}
Content/Description: {content}

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "tags": ["string", "string", "string"]
}
`;

export interface GeminiTagResponse {
  tags: string[];
}

// 9. Pure Gemini AI Tagger
export async function generateGeminiTags(params: {
  platform: string;
  title: string;
  text: string;
  displayName?: string;
  author?: string;
  username?: string;
  apiKey?: string;
}): Promise<{
  tags: Array<{ name: string; color: TagColor }>;
  rawDetails: GeminiTagResponse | null;
}> {
  const { platform, title, text, displayName, author, username, apiKey: providedKey } = params;

  // Resolve API Key: provided key > server GEMINI_API_KEY > NEXT_PUBLIC_GEMINI_API_KEY
  const apiKey =
    providedKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn('[Valut] No Gemini API key configured. Skipping AI tagging.');
    return {
      tags: [],
      rawDetails: null,
    };
  }

  const channelName = author || displayName || username || 'Creator';

  // Step 1: Input Sanitization (Drop boilerplate before sending to Gemini)
  let cleanContent = text || '';
  const YOUTUBE_BOILERPLATE = 'enjoy the videos and music you love, upload original content';

  if (cleanContent.toLowerCase().includes(YOUTUBE_BOILERPLATE)) {
    cleanContent = `YouTube video by ${channelName}. Focus strictly on title domain.`;
  }

  const promptContent = `Title: ${title}
Author/Channel: ${channelName}
Platform: ${platform}
Content/Description: ${cleanContent.slice(0, 3000)}`;

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
              parts: [{ text: TAGGER_SYSTEM_PROMPT }],
            },
            contents: [
              {
                parts: [{ text: promptContent }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
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
      throw new Error('All Gemini model endpoints failed');
    }

    const parsed: GeminiTagResponse = JSON.parse(rawJsonText);
    const tagsToProcess = Array.isArray(parsed.tags) ? parsed.tags : [];
    
    // Step 3: Normalizer & Guardrail
    const cleanTags = processIncomingTags(tagsToProcess);

    return {
      tags: cleanTags,
      rawDetails: parsed,
    };
  } catch (err: any) {
    console.error('[Valut] Gemini tag generation error:', err.message || err);
    return {
      tags: [],
      rawDetails: null,
    };
  }
}
