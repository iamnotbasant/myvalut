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

// 2. Known mappings for standard industry tools, popular acronyms, and variations
export const SYNONYM_MAP: Record<string, string> = {
  // AI, Machine Learning, Data Science popular short forms
  'large language models': 'llm',
  'large language model': 'llm',
  'retrieval augmented generation': 'rag',
  'natural language processing': 'nlp',
  'natural language understanding': 'nlu',
  'generative ai': 'genai',
  'generative artificial intelligence': 'genai',
  'artificial intelligence': 'ai',
  'machine learning': 'ml',
  'deep learning': 'dl',
  'neural network': 'nn',
  'neural networks': 'nn',
  'convolutional neural network': 'cnn',
  'recurrent neural network': 'rnn',
  'reinforcement learning': 'rl',
  'reinforcement learning from human feedback': 'rlhf',
  'optical character recognition': 'ocr',
  'automatic speech recognition': 'asr',
  'text to speech': 'tts',
  'speech to text': 'stt',
  'vision language model': 'vlm',
  'vision language models': 'vlm',

  // Dev, Software & Web Architecture
  'application programming interface': 'api',
  'application programming interfaces': 'api',
  'software development kit': 'sdk',
  'software development kits': 'sdk',
  'command line interface': 'cli',
  'graphical user interface': 'gui',
  'user interface': 'ui',
  'user experience': 'ux',
  'ui ux': 'ui ux',
  'user interface user experience': 'ui ux',
  'user interface and user experience': 'ui ux',
  'single page application': 'spa',
  'progressive web app': 'pwa',
  'server side rendering': 'ssr',
  'static site generation': 'ssg',
  'client side rendering': 'csr',
  'continuous integration': 'ci',
  'continuous deployment': 'cd',
  'continuous integration continuous deployment': 'ci cd',
  'object oriented programming': 'oop',
  'functional programming': 'fp',
  'content delivery network': 'cdn',
  'domain name system': 'dns',
  'virtual private network': 'vpn',
  'structured query language': 'sql',
  'relational database management system': 'rdbms',
  'relational database': 'rdbms',
  'cross origin resource sharing': 'cors',
  'cross site scripting': 'xss',
  'distributed denial of service': 'ddos',
  'denial of service': 'dos',
  'software as a service': 'saas',
  'platform as a service': 'paas',
  'infrastructure as a service': 'iaas',
  'operating system': 'os',
  'operating systems': 'os',
  'internet of things': 'iot',

  // Hardware & Performance
  'central processing unit': 'cpu',
  'graphics processing unit': 'gpu',
  'tensor processing unit': 'tpu',
  'neural processing unit': 'npu',
  'random access memory': 'ram',
  'solid state drive': 'ssd',
  'frames per second': 'fps',
  'high definition': 'hd',
  'ultra high definition': 'uhd',

  // Media, Audio & Video
  'visual effects': 'vfx',
  'sound effects': 'sfx',
  'special effects': 'sfx',
  'virtual reality': 'vr',
  'augmented reality': 'ar',
  'mixed reality': 'mr',

  // Marketing, Business & Web3
  'search engine optimization': 'seo',
  'search engine marketing': 'sem',
  'key performance indicator': 'kpi',
  'key performance indicators': 'kpi',
  'return on investment': 'roi',
  'call to action': 'cta',
  'customer relationship management': 'crm',
  'business to business': 'b2b',
  'business to consumer': 'b2c',
  'cost per click': 'cpc',
  'click through rate': 'ctr',
  'decentralized finance': 'defi',
  'non fungible token': 'nft',
  'non fungible tokens': 'nft',
  'proof of work': 'pow',
  'proof of stake': 'pos',
  'decentralized autonomous organization': 'dao',
  'decentralized application': 'dapp',

  // Creative Tools & Aliases
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
  'red dead redemption': 'rdr'
};

// 3. Hard Blacklist for Clickbait verbs, fillers, and Platform noise
export const HARD_BLACKLIST = new Set([
  'tells', 'tell', 'know', 'youtube', 'video', 'videos', 
  'tips', 'tricks', 'secret', 'secrets', 'best', 'watch',
  'learn', 'using', 'insane', 'things', 'stop', 'make',
  'twitter', 'x', 'reddit', 'instagram', 'tiktok', 'threads',
  'just', 'won', 'post', 'view', 'read', 'with', 'this', 'that',
  'from', 'your', 'about', 'more', 'into', 'some', 'what', 'when',
  'will', 'have', 'been', 'music', 'content', 'channel', 'share',
  'good', 'great', 'check', 'here', 'look', 'link', 'click'
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
    .map(tag => {
      // 1. Direct synonym match
      if (SYNONYM_MAP[tag]) return SYNONYM_MAP[tag];
      // 2. Singular match if ending with 's' (e.g. "large language models" -> "large language model")
      if (tag.endsWith('s')) {
        const singular = tag.slice(0, -1);
        if (SYNONYM_MAP[singular]) return SYNONYM_MAP[singular];
      }
      return tag;
    })
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

/**
 * Fetches timed text captions/transcript for a YouTube video.
 * Parses XML timedtext and concatenates spoken dialogue.
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return '';

  try {
    // 1. Fetch video watch page to find captionTracks
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const html = await res.text();
      const captionsMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
      if (captionsMatch) {
        try {
          const tracks = JSON.parse(captionsMatch[1]);
          if (Array.isArray(tracks) && tracks.length > 0) {
            const preferredTracks = tracks.filter((t: { languageCode?: string }) => t.languageCode?.startsWith('en'));
            const candidateTracks = preferredTracks.length > 0 ? [...preferredTracks, ...tracks] : tracks;

            for (const track of candidateTracks) {
              if (!track?.baseUrl) continue;
              try {
                const captionRes = await fetch(track.baseUrl, {
                  headers: { 'User-Agent': 'Mozilla/5.0' },
                  signal: AbortSignal.timeout(5000),
                });
                if (captionRes.ok) {
                  const xml = await captionRes.text();
                  const $ = cheerio.load(xml, { xmlMode: true });
                  const texts: string[] = [];
                  $('text').each((_, el) => {
                    const t = $(el).text().trim();
                    if (t) texts.push(t);
                  });
                  const transcript = texts.join(' ').replace(/\s+/g, ' ').trim();
                  if (transcript.length > 30) {
                    return transcript.slice(0, 16000);
                  }
                }
              } catch {}
            }
          }
        } catch (e) {
          console.warn('[YouTube Transcript] Error parsing captionTracks JSON:', e);
        }
      }
    }

    // 2. Direct timedtext endpoint fallback
    try {
      const directRes = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000),
      });
      if (directRes.ok) {
        const xml = await directRes.text();
        if (xml.includes('<text')) {
          const $ = cheerio.load(xml, { xmlMode: true });
          const texts: string[] = [];
          $('text').each((_, el) => {
            const t = $(el).text().trim();
            if (t) texts.push(t);
          });
          const transcript = texts.join(' ').replace(/\s+/g, ' ').trim();
          if (transcript.length > 30) {
            return transcript.slice(0, 16000);
          }
        }
      }
    } catch {}
  } catch (err) {
    console.warn('[YouTube Transcript] Failed to fetch transcript for video', videoId, err);
  }

  return '';
}

/**
 * Uses Gemini AI to synthesize video transcripts or Reel captions into
 * structured executive summaries with key takeaways.
 */
export async function generateMediaSummary(params: {
  platform: 'youtube' | 'instagram' | string;
  title: string;
  transcriptOrText: string;
  creator?: string;
  apiKey?: string;
}): Promise<string> {
  const { platform, title, transcriptOrText, creator, apiKey: providedKey } = params;

  if (!transcriptOrText || transcriptOrText.trim().length < 20) {
    return '';
  }

  const FALLBACK_B64_KEY = 'QVEuQWI4Uk42SXFWTm1YMjNubEdhbTVXSlVNNGFOeVhZOFUzZ1lERXJLVjNRQ3BaQUkxaWc=';
  const getFallbackKey = () => {
    try {
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(FALLBACK_B64_KEY, 'base64').toString('utf-8');
      }
      if (typeof atob !== 'undefined') {
        return atob(FALLBACK_B64_KEY);
      }
    } catch {}
    return '';
  };

  const apiKey =
    providedKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
    getFallbackKey();

  if (!apiKey) return '';

  const isReel = platform === 'instagram';
  const systemInstruction = isReel
    ? `You are an expert content distiller for Instagram Reels.
Your task is to analyze this Reel's caption, audio transcription, or spoken dialogue, and generate a rich, high-value structured summary.

FORMAT REQUIREMENTS:
✨ Reel Executive Summary:
[A punchy 2-paragraph overview explaining what the Reel demonstrates, discusses, or showcases, including exact techniques, tools, or tips mentioned]

Key Takeaways:
• [Takeaway 1: Specific actionable technique or advice]
• [Takeaway 2: Key workflow, software, or tool shown]
• [Takeaway 3: Practical outcome or lesson learned]
• [Takeaway 4: Caveat, tip, or limitation]

RULES:
- No meta commentary like "In this reel..." or "The creator shows...". Get right to the point.
- Keep bullet points actionable and specific.
- Never truncate or cut off mid-sentence; write complete thoughts.`
    : `You are an elite video research analyst and content distiller.
Your task is to analyze the provided YouTube video transcript and produce an insightful, comprehensive, and well-structured breakdown.

FORMAT REQUIREMENTS:
✨ AI Executive Summary:
[Write a thorough, high-value 2-paragraph overview:
Paragraph 1: The core premise, problem being addressed, and primary thesis or breakthrough presented in the video.
Paragraph 2: The actual implementation, workflow, or technical mechanism demonstrated, with specific names of tools, apps, commands, or settings.]

Key Takeaways & Insights:
• [Takeaway 1: Specific finding or step explained with context]
• [Takeaway 2: Key workflow, software, or configuration mentioned]
• [Takeaway 3: Practical benefits, performance metrics, or comparisons highlighted]
• [Takeaway 4: Crucial caveats, limitations, or prerequisites]
• [Takeaway 5: Final conclusion or actionable recommendation]

RULES:
- Ground everything strictly in the provided transcript and content.
- Do NOT use filler meta commentary like "In this video...", "The creator starts by...", "The video explains...". Get straight to the substance.
- Be specific, authoritative, and informative so the reader gains deep, practical value without needing to watch the whole video.
- Never truncate or cut off mid-sentence; always complete all thoughts cleanly.`;

  const userPrompt = `Title: ${title || 'Video / Reel'}
Creator: ${creator || 'Creator'}
Platform: ${platform}
Content / Transcript:
${transcriptOrText.slice(0, 16000)}`;

  const modelCandidates = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-3.6-flash',
    'gemini-2.0-flash-lite',
  ];

  for (const model of modelCandidates) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 2048,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 60) {
          return text.trim();
        }
      }
    } catch (e) {
      console.warn(`[Media Summary AI] Model ${model} failed:`, e);
    }
  }

  return '';
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
      let ytVideoId = '';
      const ytIdMatch = inputUrl.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytIdMatch) ytVideoId = ytIdMatch[1];

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
          imageUrl = ytVideoId ? `https://i.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg` : (data.thumbnail_url || '');
        }
      } catch (e) {
        console.warn('YouTube oembed fallback:', e);
      }

      // 2. YouTube HTML scraping for Channel Avatar & Real Description
      let metaDesc = '';
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
          metaDesc =
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
          if (!imageUrl && ytVideoId) {
            imageUrl = `https://i.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`;
          } else if (!imageUrl) {
            imageUrl = $('meta[property="og:image"]').attr('content') || '';
          }
        }
      } catch (err) {
        console.warn('YouTube page scraping fallback:', err);
      }

      // 3. Extract spoken transcript and summarize with Gemini AI
      if (ytVideoId) {
        try {
          const transcript = await fetchYouTubeTranscript(ytVideoId);
          const contentToSummarize = transcript || text || metaDesc || title;
          if (contentToSummarize && contentToSummarize.length > 30) {
            const summary = await generateMediaSummary({
              platform: 'youtube',
              title,
              transcriptOrText: contentToSummarize,
              creator: displayName,
            });
            if (summary) {
              text = summary;
            } else if (transcript) {
              text = transcript.slice(0, 1500);
            }
          }
        } catch (sumErr) {
          console.warn('[YouTube AI Summarizer] Error generating video summary:', sumErr);
        }
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
            text = post.selftext ? post.selftext.slice(0, 3000) : title;
            // Only attach image if this post genuinely has media attachments (not a text-only selfpost)
            const isSelfPost = Boolean(post.is_self);
            const hasRealMedia = post.post_hint === 'image' || post.post_hint === 'link' || Boolean(post.preview?.images?.length);
            const cleanThumb =
              post.thumbnail &&
              post.thumbnail.startsWith('http') &&
              !['default', 'self', 'nsfw', 'spoiler'].includes(post.thumbnail)
                ? post.thumbnail
                : '';

            if (!isSelfPost && hasRealMedia) {
              imageUrl =
                post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') ||
                cleanThumb;
            } else {
              imageUrl = '';
            }

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
      let tweetId = '';
      let tweetUser = '';
      const statusMatch = inputUrl.match(/(?:twitter\.com|x\.com)\/([^/?#]+)\/status\/(\d+)/i);
      if (statusMatch) {
        tweetUser = statusMatch[1];
        tweetId = statusMatch[2];
      } else {
        const idMatch = inputUrl.match(/status\/(\d+)/i);
        if (idMatch) tweetId = idMatch[1];
      }

      // 1. Try fxtwitter API
      if (tweetId) {
        try {
          const fxEndpoint = tweetUser
            ? `https://api.fxtwitter.com/${tweetUser}/status/${tweetId}`
            : `https://api.fxtwitter.com/status/${tweetId}`;

          const fxRes = await fetch(fxEndpoint, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });

          if (fxRes.ok) {
            const data = await fxRes.json();
            const tweet = data.tweet;
            if (tweet && tweet.text) {
              text = tweet.text.trim();
              displayName = tweet.author?.name || tweetUser || 'X User';
              username = tweet.author?.screen_name || tweetUser || 'xuser';
              avatarUrl = tweet.author?.avatar_url || (username ? `https://unavatar.io/x/${username}` : undefined);
              
              // Only attach image if tweet actually contains attached photos or videos
              const hasAttachedMedia =
                (tweet.media?.photos && tweet.media.photos.length > 0) ||
                (tweet.media?.videos && tweet.media.videos.length > 0);

              if (hasAttachedMedia) {
                imageUrl = tweet.media?.photos?.[0]?.url || tweet.media?.videos?.[0]?.thumbnail_url || '';
              } else {
                imageUrl = '';
              }

              title = text.length > 80 ? `${text.slice(0, 80)}...` : text;
            }
          }
        } catch (e) {
          console.warn('[Valut] Twitter fxtwitter API error:', e);
        }
      }

      // 2. Try vxtwitter OpenGraph HTML scraper (Bypasses Twitter login wall)
      if (!text && tweetId) {
        try {
          const vxUrl = `https://vxtwitter.com/${tweetUser || 'i'}/status/${tweetId}`;
          const vxRes = await fetch(vxUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });

          if (vxRes.ok) {
            const html = await vxRes.text();
            const $ = cheerio.load(html);
            const ogDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
            const ogTitle = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || '';
            const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';

            if (ogDesc) {
              text = ogDesc.trim();
              title = text.length > 80 ? `${text.slice(0, 80)}...` : text;
            }
            if (ogTitle) {
              const parsedName = ogTitle.split('(')[0].trim();
              if (parsedName) displayName = parsedName;
              const handleMatch = ogTitle.match(/\(@([^)]+)\)/);
              if (handleMatch) username = handleMatch[1];
            }
            // Ignore tweet card previews or author avatars disguised as og:image for text tweets
            const isSyntheticCard = ogImage.includes('profile_images') || ogImage.includes('/card') || ogImage.includes('tweet_card');
            if (ogImage && !isSyntheticCard && (ogImage.includes('media') || ogImage.includes('video'))) {
              imageUrl = ogImage;
            } else {
              imageUrl = '';
            }
            if (username && !avatarUrl) avatarUrl = `https://unavatar.io/x/${username}`;
          }
        } catch (e) {
          console.warn('[Valut] Twitter vxtwitter OpenGraph error:', e);
        }
      }

      // 3. Twitter oEmbed fallback
      if (!text) {
        try {
          const oembedRes = await fetch(
            `https://publish.twitter.com/oembed?url=${encodeURIComponent(inputUrl)}`
          );
          if (oembedRes.ok) {
            const data = await oembedRes.json();
            displayName = data.author_name || displayName || 'X User';
            const $ = cheerio.load(data.html || '');
            text = $('p').text() || '';
            title = text.length > 80 ? `${text.slice(0, 80)}...` : text;
            imageUrl = ''; // oEmbed text tweets should never have fake images
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
    } else if (platform === 'instagram') {
      try {
        const oembedRes = await fetch(
          `https://api.instagram.com/oembed/?url=${encodeURIComponent(inputUrl)}`,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(5000),
          }
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          displayName = data.author_name ? `@${data.author_name}` : 'Instagram';
          username = data.author_name || 'instagram_user';
          avatarUrl = `https://unavatar.io/instagram/${username}`;
          if (data.title) {
            text = data.title.trim();
            title = text.length > 80 ? `${text.slice(0, 80)}...` : text;
          }
          if (data.thumbnail_url) {
            imageUrl = data.thumbnail_url;
          }
        }
      } catch (igErr) {
        console.warn('Instagram oembed fallback:', igErr);
      }

      // If text/caption exists, summarize reel content with Gemini AI
      if (text && text.length > 25) {
        try {
          const summary = await generateMediaSummary({
            platform: 'instagram',
            title: title || text.slice(0, 80),
            transcriptOrText: text,
            creator: username,
          });
          if (summary) {
            text = summary;
          }
        } catch (sumErr) {
          console.warn('[Instagram AI Summarizer] Error generating summary:', sumErr);
        }
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
        $('p').slice(0, 6).each((_, el) => {
          bodyText += $(el).text() + ' ';
        });

        text = (metaDesc + ' ' + bodyText).trim().slice(0, 2500);

        imageUrl =
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content') ||
          '';

        let hostname = '';
        try {
          hostname = new URL(inputUrl).hostname.replace(/^www\./, '');
        } catch {}

        let siteName =
          $('meta[property="og:site_name"]').attr('content') ||
          $('meta[name="application-name"]').attr('content') ||
          hostname;

        if (inputUrl.includes('github.com')) {
          displayName = 'GitHub';
          username = 'github';
          avatarUrl = 'https://github.githubassets.com/favicons/favicon.svg';
        } else {
          // Derive a distinct creator name and username from the website brand/domain
          const domainParts = hostname ? hostname.split('.').filter(Boolean) : [];
          const domainRoot = domainParts.length > 1 ? domainParts[domainParts.length - 2] : (domainParts[0] || '');
          const cleanRoot = domainRoot.toLowerCase().replace(/[^a-z0-9_]/g, '');
          const cleanBrand = cleanRoot ? cleanRoot.charAt(0).toUpperCase() + cleanRoot.slice(1) : (siteName || 'Website');
          displayName = (siteName && siteName.length < 40 && siteName.toLowerCase() !== 'creator' ? siteName : cleanBrand).trim();
          username = cleanRoot || hostname || 'website';
        }

        if (!avatarUrl && !inputUrl.includes('github.com')) {
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

  // Fallback domain derivation for website creators - NEVER fall back to generic 'creator'
  let finalUsername = username.trim();
  if (platform === 'web' || !finalUsername || finalUsername.toLowerCase() === 'creator') {
    if (!finalUsername || finalUsername.toLowerCase() === 'creator') {
      try {
        const parsedHost = new URL(inputUrl).hostname.replace(/^www\./, '');
        const domainParts = parsedHost.split('.').filter(Boolean);
        const rootDomain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : (domainParts[0] || '');
        finalUsername = rootDomain.toLowerCase().replace(/[^a-z0-9_]/g, '') || parsedHost || 'website';
      } catch {
        finalUsername = (displayName || 'web').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'website';
      }
    }
  }

  let finalDisplayName = displayName.trim();
  if (platform === 'web' || !finalDisplayName || finalDisplayName.toLowerCase() === 'creator') {
    if (!finalDisplayName || finalDisplayName.toLowerCase() === 'creator') {
      try {
        const parsedHost = new URL(inputUrl).hostname.replace(/^www\./, '');
        const domainParts = parsedHost.split('.').filter(Boolean);
        const rootDomain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : (domainParts[0] || '');
        finalDisplayName = rootDomain ? rootDomain.charAt(0).toUpperCase() + rootDomain.slice(1) : parsedHost;
      } catch {
        finalDisplayName = 'Website';
      }
    }
  }

  return {
    title: title.trim(),
    text: text.trim(),
    displayName: finalDisplayName || 'Website',
    username: finalUsername || 'website',
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
1. PREFER POPULAR SHORT FORMS / ACRONYMS FOR WELL-KNOWN CONCEPTS:
   - When a technical term, concept, or domain has a universally recognized popular short form or acronym, ALWAYS output that standard short form instead of spelling out the entire long multi-word phrase!
   - What to SHORTEN (Always use short forms for these):
     * Output "llm" (NEVER "large language models" or "large language model")
     * Output "ai" (NEVER "artificial intelligence")
     * Output "ml" (NEVER "machine learning")
     * Output "dl" (NEVER "deep learning")
     * Output "nlp" (NEVER "natural language processing")
     * Output "rag" (NEVER "retrieval augmented generation")
     * Output "genai" (NEVER "generative artificial intelligence")
     * Output "api" (NEVER "application programming interface")
     * Output "sdk" (NEVER "software development kit")
     * Output "cli" (NEVER "command line interface")
     * Output "gui" (NEVER "graphical user interface")
     * Output "ui ux" (NEVER "user interface user experience")
     * Output "seo" (NEVER "search engine optimization")
     * Output "saas" (NEVER "software as a service")
     * Output "os" (NEVER "operating system")
     * Output "vr" / "ar" (NEVER "virtual reality" / "augmented reality")
     * Output "vpn" (NEVER "virtual private network")
     * Output "cdn" (NEVER "content delivery network")
     * Output "fps" (NEVER "frames per second")
     * Output "vfx" / "sfx" (NEVER "visual effects" / "sound effects")
   - What to KEEP NATURAL (Do NOT invent fake short forms):
     * Multi-word product names, model versions, frameworks, and specific creative disciplines that do NOT have a widely known acronym MUST be preserved naturally (e.g., "gpt 6 astra", "claude 3.7", "premiere pro", "davinci resolve", "sound design", "video editing", "color grading", "motion graphics", "state management", "cyber security").

2. COMPOUND NOUN PHRASES ONLY:
   - Output domain/tool concepts (e.g. "sound design", "video editing", "color grading", "web dev", "machine learning").
   - NEVER split multi-word concepts into separate words.
   - NEVER output single generic verbs or common English noise words ("just", "won", "make", "this", "look", "good").

3. STRICT FORBIDDEN WORDS (NEVER TAG THESE):
   - NO Clickbait Fillers: "tells", "know", "learn", "using", "secret", "secrets", "insane", "best", "tips", "tricks", "watch", "things", "stop", "make".
   - NO Platform Names or Generic Media Types: DO NOT output "youtube", "twitter", "x", "reddit", "video", "videos", "music", "content" unless it is specifically a technical guide about that exact system.

4. BOILERPLATE CONTAMINATION HANDLING:
   - If description contains platform fallback text (e.g., "Enjoy the videos and music you love..."), IGNORE IT COMPLETELY. 
   - Rely strictly on the Title, Channel/Author name, and infer the core technical discipline.

5. TAGGING PRIORITY & DENSITY (2 TO 6 TAGS):
   - Primary Discipline (e.g., "sound design", "video editing", "ui ux", "coding", "ai")
   - Specific Tools / Frameworks / Entities (e.g., "nextjs", "premiere pro", "davinci resolve", "figma", "tailwind", "llm", "openai")
   - Technique / Sub-topic (e.g., "audio mixing", "typography", "state management", "cinematography", "rag")
   - Format / Intent (e.g., "tutorial", "breakdown", "workflow")

6. FORMAT REQUIREMENTS:
   - Strictly lowercase words with normal spaces.
   - Absolutely NO hyphens (-), NO hashtags (#), NO underscores (_).
   - Return valid JSON array only.

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

  const FALLBACK_B64_KEY = 'QVEuQWI4Uk42SXFWTm1YMjNubEdhbTVXSlVNNGFOeVhZOFUzZ1lERXJLVjNRQ3BaQUkxaWc=';
  const getFallbackKey = () => {
    try {
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(FALLBACK_B64_KEY, 'base64').toString('utf-8');
      }
      if (typeof atob !== 'undefined') {
        return atob(FALLBACK_B64_KEY);
      }
    } catch {}
    return '';
  };

  // Resolve API Key: provided key > server GEMINI_API_KEY > NEXT_PUBLIC_GEMINI_API_KEY > Fallback
  const apiKey =
    providedKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
    getFallbackKey();

  if (!apiKey) {
    console.warn('[Valut AI] No Gemini API key configured. Skipping tag generation.');
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
    cleanContent = `Focus strictly on title domain. Channel: ${channelName}`;
  }

  const promptContent = `Title: ${title}
Author/Channel: ${channelName}
Platform: ${platform}
Content/Description: ${cleanContent.slice(0, 3000)}`;

  const modelCandidates = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-2.0-flash-lite',
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
            console.log(`[Valut AI] Tags successfully generated via model ${model}`);
            break;
          }
        } else {
          const errBody = await res.text().catch(() => '');
          console.warn(`[Valut AI] Model ${model} returned HTTP ${res.status}: ${errBody.slice(0, 200)}`);
        }
      } catch (innerErr) {
        console.warn(`[Valut AI] Model ${model} attempt failed:`, innerErr);
      }
    }

    if (!rawJsonText) {
      console.warn('[Valut AI] All Gemini model endpoints failed. No tags generated.');
      return {
        tags: [],
        rawDetails: null,
      };
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
    console.error('[Valut AI] Gemini tag generation error:', err.message || err);
    return {
      tags: [],
      rawDetails: null,
    };
  }
}
