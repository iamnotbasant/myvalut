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

// 4. Platform Detection
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

// 5. High-Signal Platform Scrapers
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

// 6. Gemini System Prompt & Caller
const GEMINI_SYSTEM_PROMPT = `You are an ultra-intelligent, expert content analyzer and knowledge vault curator with deep cultural and industry awareness across Gaming, Tech, AI, Software, Cinema, Design, Finance, Fitness, and Pop Culture.

Your job is to deeply comprehend the essence, core subject, specific entities, and context of the provided content, then generate the MOST NATURAL, HIGH-ACCURACY, CANONICAL search tags that real humans and power users actually search for.

INTELLIGENCE & TAGGING RULES:
1. NATURAL CANONICAL NAMES (Crucial):
   - ALWAYS prefer widely used, canonical short-names and popular acronyms over clunky formal expansions.
   - For example: Use "gta 6" instead of "grand theft auto vi" or "grand theft auto 6", "ai" instead of "artificial intelligence", "ps5" instead of "playstation 5", "cs2" instead of "counter strike 2", "rdr2" instead of "red dead redemption 2", "vs code" instead of "visual studio code".
   - For software/tools: Use "premiere pro", "after effects", "chatgpt", "midjourney", "cursor", "tailwind", "next js", "blender", "figma".

2. MULTI-LAYER SEMANTIC UNDERSTANDING:
   - Identify the exact domain/category (e.g. "gaming", "video editing", "web development", "machine learning", "finance", "fitness").
   - Identify the primary subject/entity (e.g. "gta 6", "rockstar games", "nvidia", "apple", "react", "bitcoin").
   - Identify the specific sub-topic or feature (e.g. "trailer breakdown", "gameplay leak", "color grading", "state management", "pricing").
   - Identify the format/nature if relevant (e.g. "workflow", "case study", "benchmark", "tutorial", "news").

3. DYNAMIC COUNT (2 to 6 Tags):
   - Low density (simple tweet, short image, meme): 2–3 tags.
   - Medium/High density (tutorials, news breakdowns, deep discussions, reviews): 4–6 tags.

4. FORMATTING:
   - STRICTLY lowercase with normal single spaces.
   - NEVER use hyphens (-), hashtags (#), underscores (_), or special characters.
   - NEVER output duplicate or overlapping synonyms (do not output both "ai" and "artificial intelligence").
   - NEVER output low-intent generic fluff tags like "tips", "tricks", "information", "best", "useful", "guide", "post", "video", "content".

INPUT FORMAT:
Platform: {platform}
Title: {title}
Context: {content_text}

OUTPUT FORMAT (JSON ONLY):
{
  "content_density": "low" | "medium" | "high",
  "category": "string",
  "tools_and_entities": ["string", "string"],
  "core_topics": ["string"],
  "content_format": "string",
  "final_tags": ["string", "string", "string"]
}`;

export interface GeminiTagResponse {
  content_density: 'low' | 'medium' | 'high';
  category: string;
  tools_and_entities: string[];
  core_topics: string[];
  content_format?: string;
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

    // Collect tags from final_tags, category, and tools_and_entities
    const candidateTags: string[] = [];
    if (Array.isArray(parsed.final_tags) && parsed.final_tags.length > 0) {
      candidateTags.push(...parsed.final_tags);
    } else {
      if (parsed.category) candidateTags.push(parsed.category);
      if (Array.isArray(parsed.tools_and_entities)) candidateTags.push(...parsed.tools_and_entities);
      if (Array.isArray(parsed.core_topics)) candidateTags.push(...parsed.core_topics);
      if (parsed.content_format) candidateTags.push(parsed.content_format);
    }

    const cleanTags = normalizeAndCleanTags(candidateTags);
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
