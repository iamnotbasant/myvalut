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

// 4. Safe Backend Assembly (Prompt Fail-Safe)
export function assembleFinalTags(aiJson: any): Array<{ name: string; color: TagColor }> {
  if (!aiJson || typeof aiJson !== 'object') return [];

  const category = (aiJson.category || '').toLowerCase().trim();
  const format = (aiJson.content_format || '').toLowerCase().trim();
  const tools = Array.isArray(aiJson.tools) ? aiJson.tools : [];
  const topics = Array.isArray(aiJson.topics) ? aiJson.topics : [];
  const finalTags = Array.isArray(aiJson.final_tags) ? aiJson.final_tags : [];

  // Merge: Category + Tools + Topics + Content Format + final_tags
  const rawList = [category, ...tools, ...topics, format, ...finalTags];

  return normalizeAndCleanTags(rawList);
}

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
      // YouTube oEmbed & video details
      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(inputUrl)}&format=json`,
          { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } }
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          title = data.title || '';
          displayName = data.author_name || 'YouTube Creator';
          username = (data.author_name || 'youtube').toLowerCase().replace(/\s+/g, '');
          imageUrl = data.thumbnail_url || '';
        }
      } catch (e) {
        console.warn('YouTube oembed fallback:', e);
      }

      // YouTube HTML scraping for rich context description / chapters
      try {
        const pageRes = await fetch(inputUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          const $ = cheerio.load(html);
          if (!title) title = $('meta[name="title"]').attr('content') || $('title').text() || '';
          const metaDesc =
            $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') ||
            '';
          text = metaDesc.slice(0, 1000);
          if (!imageUrl) imageUrl = $('meta[property="og:image"]').attr('content') || '';
        }
      } catch {}
    } else if (platform === 'reddit') {
      // Reddit JSON endpoint for public posts
      try {
        let cleanRedditUrl = inputUrl.split('?')[0].replace(/\/$/, '');
        if (!cleanRedditUrl.endsWith('.json')) cleanRedditUrl += '.json';

        const redditRes = await fetch(cleanRedditUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
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
              post.thumbnail?.startsWith('http')
                ? post.thumbnail
                : '';
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
            avatarUrl = tweet.author?.avatar_url || '';
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

// 7. Gemini System Prompt & Caller
const GEMINI_SYSTEM_PROMPT = `You are the core categorization engine for a knowledge curation app (Vault).
Analyze the provided content and generate strictly structured, high-utility searchable tags in JSON format.

TAG COMPOSITION RULES (MANDATORY HIERARCHY):
1. Every item MUST have 3 layers of tags:
   - Layer 1 (Broad Category - Exactly 1): High-level domain for global sidebar navigation. Must be one of: "ai", "tech", "video editing", "coding", "finance", "fitness", "productivity", "marketing", "design", "general".
   - Layer 2 (Tools & Topics - 1 to 4): The exact names of software, apps, tools, frameworks, or core subjects (e.g., "calliope", "chatgpt", "premiere pro", "cursor", "faceless video", "2d animation", "ffmpeg"). NEVER use generic words like "tips", "video", "software", or "tricks".
   - Layer 3 (Content Format - Exactly 1): The nature of the content for type-filtering. Must be one of: "tool", "tutorial", "workflow", "resource", "case study", "opinion", "news".

2. FORMATTING RULES:
   - STRICTLY lowercase with natural spaces.
   - DO NOT use hyphens ("-"), underscores ("_"), or hashtags ("#"). (e.g., write "faceless video", NOT "faceless-video").
   - Max 6 tags total, Min 3 tags total.
   - Deduplicate near-synonyms.

INPUT:
Platform: {platform}
Title: {title}
Context: {content_text}

OUTPUT FORMAT (JSON ONLY):
{
  "category": "ai",
  "tools": ["calliope"],
  "topics": ["faceless video", "2d animation"],
  "content_format": "tool",
  "final_tags": ["ai", "calliope", "faceless video", "2d animation", "tool"]
}`;

export interface GeminiTagResponse {
  category: string;
  tools: string[];
  topics: string[];
  content_format: string;
  final_tags: string[];
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
    // Fallback heuristic tags if no API key is configured
    const fallbackWords = (title + ' ' + text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'what'].includes(w));
    const fallbackTags = normalizeAndCleanTags([platform, ...fallbackWords.slice(0, 3)]);
    return {
      tags: fallbackTags,
      rawDetails: null,
    };
  }

  const promptContent = `Platform: ${platform}
Title: ${title}
Context: ${text.slice(0, 3000)}`;

  const modelCandidates = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
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
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            rawJsonText = text;
            break;
          }
        }
      } catch (innerErr) {
        console.warn(`Model ${model} attempt failed:`, innerErr);
      }
    }

    if (!rawJsonText) {
      throw new Error('All Gemini model endpoints failed');
    }

    const parsed: GeminiTagResponse = JSON.parse(rawJsonText);
    const cleanTags = assembleFinalTags(parsed);

    return {
      tags: cleanTags,
      rawDetails: parsed,
    };
  } catch (err: any) {
    console.error('Gemini tag generation error:', err);
    const fallback = normalizeAndCleanTags([platform, ...title.toLowerCase().split(/\s+/).slice(0, 3)]);
    return {
      tags: fallback,
      rawDetails: null,
    };
  }
}
