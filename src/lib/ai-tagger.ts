import { TagColor } from '@/types/stashr';

export interface GeneratedTag {
  name: string;
  color: TagColor;
}

export interface TagInput {
  title?: string | null;
  text: string;
  platform?: string;
  url?: string | null;
  customTags?: string[];
  context?: string | null;
  subreddit?: string | null;
  headings?: string[];
  chapters?: string[];
}

export interface GeminiTagResponse {
  content_density?: 'low' | 'medium' | 'high';
  category?: string;
  tools_and_entities?: string[];
  core_topics?: string[];
  content_format?: string;
  final_tags?: string[];
}

const PALETTE_COLORS: TagColor[] = [
  'teal',
  'violet',
  'cyan',
  'green',
  'amber',
  'pink',
  'orange',
  'blue',
  'indigo',
  'red',
];

// Helper to safely match keywords (using word boundaries for short strings)
export function hasPattern(text: string, pattern: string): boolean {
  if (pattern.length <= 4) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return rx.test(text);
  }
  return text.includes(pattern);
}

// 1. Comprehensive Synonym Normalization Dictionary (Standard Clean Words with Spaces)
export const SYNONYM_MAP: Record<string, string> = {
  // AI, Models & Machine Learning
  'artificial intelligence': 'ai',
  'artificialintelligence': 'ai',
  'machine learning': 'ml',
  'machinelearning': 'ml',
  'deep learning': 'deep learning',
  'large language models': 'llm',
  'large language model': 'llm',
  'llms': 'llm',
  'gpt 4': 'chatgpt',
  'gpt 4o': 'chatgpt',
  'gpt4': 'chatgpt',
  'gpt4o': 'chatgpt',
  'chat gpt': 'chatgpt',
  'chatgpt 4': 'chatgpt',
  'openai chatgpt': 'chatgpt',
  'openai': 'chatgpt',
  'claude ai': 'claude',
  'anthropic': 'claude',
  'deepseek ai': 'deepseek',
  'deepseek r1': 'deepseek',
  'google gemini': 'gemini',
  'gemini flash': 'gemini',
  'gen ai': 'generative ai',
  'genai': 'generative ai',
  'generativeai': 'generative ai',
  'ai agents': 'ai agents',
  'agent': 'ai agents',
  'ai agent': 'ai agents',
  'prompting': 'prompt engineering',
  'prompts': 'prompt engineering',
  'prompt': 'prompt engineering',
  'whisper ai': 'whisper',
  'whisper': 'whisper',
  'stable diffusion': 'stable diffusion',
  'midjourney': 'midjourney',
  'langchain': 'langchain',
  'llamaindex': 'llamaindex',

  // Video Editing, VFX & Motion Graphics
  'videoediting': 'video editing',
  'video edit': 'video editing',
  'video edits': 'video editing',
  'editing': 'video editing',
  'adobe premiere pro': 'premiere pro',
  'adobe premiere': 'premiere pro',
  'premier pro': 'premiere pro',
  'premiere': 'premiere pro',
  'premierepro': 'premiere pro',
  'davinci': 'davinci resolve',
  'davinciresolve': 'davinci resolve',
  'blackmagic davinci': 'davinci resolve',
  'aftereffects': 'after effects',
  'after effect': 'after effects',
  'adobe after effects': 'after effects',
  'ae': 'after effects',
  'cap cut': 'capcut',
  'capcut video': 'capcut',
  'motiongraphics': 'motion design',
  'motion graphics': 'motion design',
  'graphicdesign': 'graphic design',
  'graphic designs': 'graphic design',
  'visual effects': 'vfx',
  'visual effect': 'vfx',
  'fx': 'vfx',
  'special effects': 'vfx',
  'sfx': 'sound effects',
  'sound design': 'sound effects',
  'speed ramp': 'speed ramping',
  'speedramping': 'speed ramping',
  'speedramp': 'speed ramping',
  'color grading': 'color grade',
  'colorgrade': 'color grade',
  'luts': 'lut',
  'ffmpeg video': 'ffmpeg',
  '3d animation': 'animation',
  '2d animation': 'animation',
  'blender 3d': 'blender',

  // Design, UI/UX & Prototyping
  'user interface': 'ui',
  'user experience': 'ux',
  'ui ux': 'ui ux',
  'uiux': 'ui ux',
  'ui design': 'ui',
  'ux design': 'ux',
  'web design': 'ui',
  'landing page': 'ui',
  'figjam': 'figma',
  'design systems': 'design system',
  'design system': 'design system',
  'typography': 'typography',
  'fonts': 'typography',
  'photoshop': 'photoshop',
  'illustrator': 'illustrator',

  // Coding & Web Development
  'reactjs': 'react',
  'react js': 'react',
  'nextjs': 'next js',
  'next js': 'next js',
  'next': 'next js',
  'vuejs': 'vue',
  'vue js': 'vue',
  'sveltejs': 'svelte',
  'svelte kit': 'svelte',
  'javascript': 'js',
  'typescript': 'ts',
  'tailwindcss': 'tailwind',
  'tailwind css': 'tailwind',
  'shadcn ui': 'shadcn',
  'shadcn': 'shadcn',
  'web dev': 'web dev',
  'webdev': 'web dev',
  'web development': 'web dev',
  'node js': 'nodejs',
  'node': 'nodejs',
  'postgres': 'postgresql',
  'postgres db': 'postgresql',
  'supabase db': 'supabase',
  'open source software': 'open source',
  'opensource': 'open source',
  'git repo': 'github',
  'search engine optimization': 'seo',
  'searchengineoptimization': 'seo',
  'frontend development': 'frontend',
  'backend development': 'backend',
  'cursor ai': 'cursor',
  'cursor editor': 'cursor',
  'vscode': 'vscode',

  // Gaming & Video Games
  'gta vi': 'gta 6',
  'gta 6': 'gta 6',
  'grand theft auto': 'gta 6',
  'gta v': 'gta 5',
  'gta 5': 'gta 5',
  'watch dogs 2': 'watch dogs 2',
  'watchdogs 2': 'watch dogs 2',
  'watch dogs': 'watch dogs 2',
  'playstation 5': 'playstation',
  'ps5': 'playstation',
  'xbox series x': 'xbox',
  'pc gaming': 'pc gaming',
  'steam store': 'steam',

  // Fitness & Lifestyle
  'bodyweight training': 'calisthenics',
  'bodyweight workout': 'calisthenics',
  'bodyweight': 'calisthenics',
  'working out': 'fitness',
  'workout': 'fitness',
  'exercise': 'fitness',

  // Finance & Business
  'personal finance': 'finance',
  'cryptocurrency': 'crypto',
  'cryptocurrencies': 'crypto',
  'bitcoin': 'crypto',
  'ethereum': 'crypto',
  'solana': 'crypto',
  'start up': 'startup',
  'startups': 'startup',
  'micro saas': 'saas',
  'indie hacker': 'startup',
  'conversion rate': 'marketing',
};

// Curated Semantic Color Map (Clean Spaced Keys)
const TOPIC_COLOR_MAP: Record<string, TagColor> = {
  // Categories (Broad Domain)
  'tech': 'teal',
  'video editing': 'violet',
  'design': 'pink',
  'finance': 'teal',
  'fitness': 'green',
  'business': 'cyan',
  'marketing': 'orange',
  'productivity': 'amber',
  'education': 'blue',
  'lifestyle': 'pink',
  'gaming': 'indigo',
  'entertainment': 'amber',

  // AI, Models & Machine Learning
  'ai': 'teal',
  'ml': 'teal',
  'generative ai': 'teal',
  'llm': 'teal',
  'chatgpt': 'teal',
  'claude': 'teal',
  'gemini': 'teal',
  'deepseek': 'teal',
  'whisper': 'teal',
  'ai agents': 'teal',
  'prompt engineering': 'teal',
  'cursor': 'cyan',
  'langchain': 'teal',
  'rag': 'teal',

  // Video Editing, Motion & Creative
  'premiere pro': 'violet',
  'after effects': 'violet',
  'davinci resolve': 'violet',
  'capcut': 'violet',
  'ffmpeg': 'indigo',
  'motion design': 'violet',
  'animation': 'violet',
  'vfx': 'violet',
  'speed ramping': 'violet',
  'color grade': 'violet',
  'sound effects': 'pink',
  'blender': 'orange',
  'photoshop': 'blue',
  'illustrator': 'orange',

  // Design, UI & UX
  'ui': 'cyan',
  'ux': 'cyan',
  'ui ux': 'cyan',
  'figma': 'pink',
  'typography': 'amber',
  'design system': 'violet',
  'graphic design': 'pink',

  // Web Development & Coding
  'web dev': 'teal',
  'frontend': 'cyan',
  'backend': 'teal',
  'react': 'cyan',
  'next js': 'teal',
  'vue': 'green',
  'svelte': 'orange',
  'js': 'amber',
  'ts': 'teal',
  'tailwind': 'cyan',
  'shadcn': 'blue',
  'supabase': 'green',
  'postgresql': 'blue',
  'python': 'teal',
  'open source': 'green',
  'github': 'orange',
  'vscode': 'blue',

  // Gaming
  'gta 6': 'indigo',
  'gta 5': 'indigo',
  'watch dogs 2': 'indigo',
  'playstation': 'blue',
  'xbox': 'green',
  'steam': 'blue',
  'gameplay': 'indigo',

  // Business, SaaS & Marketing
  'saas': 'cyan',
  'startup': 'green',
  'seo': 'blue',
  'crypto': 'amber',

  // Fitness
  'calisthenics': 'green',

  // Content Formats
  'workflow': 'amber',
  'tutorial': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'case study': 'amber',
  'news': 'red',
  'meme': 'amber',
};

// Strictly Banned Generic / Fluff Words
const BANNED_GENERIC_WORDS = new Set([
  'tips', 'tricks', 'information', 'best', 'useful', 'guide', 'good', 'learn',
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'nice', 'great', 'amazing', 'item', 'bookmark'
]);

// 2. Preprocessing: Platform-Wise High-Signal Ingestion Matrix
export function preprocessPlatformInput(input: TagInput): string {
  const platform = (input.platform || 'web').toLowerCase();
  const rawText = input.text || '';
  const title = input.title ? `Title: ${input.title.trim()}\n` : '';
  const context = input.context ? input.context.trim() : '';

  switch (platform) {
    case 'youtube': {
      // Title + Top 500 chars desc + Chapters/Timestamps + Transcript (~1000 chars)
      const descPart = rawText.slice(0, 500);
      const chapters = input.chapters && input.chapters.length > 0 ? `\nChapters: ${input.chapters.slice(0, 5).join(' | ')}` : '';
      const transcriptWords = context ? context.split(/\s+/).slice(0, 200).join(' ') : '';
      const transcriptPart = transcriptWords ? `\nTranscript: ${transcriptWords}` : '';
      return `${title}Description: ${descPart}${chapters}${transcriptPart}`.trim().slice(0, 1000);
    }
    case 'instagram':
    case 'reels':
    case 'tiktok': {
      // Caption + OCR/On-screen text + Audio Transcript (~500 chars)
      const caption = rawText.slice(0, 400);
      const audioText = context ? `\nAudio/OCR: ${context.slice(0, 150)}` : '';
      return `${title}Caption: ${caption}${audioText}`.trim().slice(0, 500);
    }
    case 'twitter':
    case 'x':
    case 'threads':
    case 'bluesky': {
      // Main Tweet + Quoted Tweet / Thread Reply (~600 chars)
      const quoteText = context ? `\nQuoted/Thread: ${context.slice(0, 250)}` : '';
      return `${title}Tweet: ${rawText}${quoteText}`.trim().slice(0, 600);
    }
    case 'reddit': {
      // Subreddit name + Post Title + Body (~1000 chars)
      const sub = input.subreddit ? `Subreddit: r/${input.subreddit}\n` : '';
      return `${sub}${title}Post Body: ${rawText}`.trim().slice(0, 1000);
    }
    case 'github': {
      // Repo Name + README desc + tech topics (~800 chars)
      return `${title}Repo Context: ${rawText}`.trim().slice(0, 800);
    }
    case 'web':
    default: {
      // <title> + Meta Description + Headings + First Paragraphs (~1200 chars)
      const headings = input.headings && input.headings.length > 0 ? `\nHeadings: ${input.headings.slice(0, 4).join(' | ')}` : '';
      return `${title}Content: ${rawText}${headings}`.trim().slice(0, 1200);
    }
  }
}

// 3. Backend Normalizer & Cleanup Logic (Natural Spaces, Clean Words, Dynamic 2-6 Cap)
export function normalizeAndCleanTags(rawTags: (string | null | undefined)[]): string[] {
  if (!Array.isArray(rawTags)) return [];

  const cleaned = rawTags
    .map(tag => {
      if (!tag || typeof tag !== 'string') return '';
      return tag
        .toLowerCase()
        .replace(/[-_]/g, ' ')             // Hyphens and underscores -> normal space
        .replace(/[^a-z0-9\s]/g, '')       // Remove special characters (#, @, etc.)
        .replace(/\s+/g, ' ')              // Collapse multiple spaces to single space
        .trim();
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => tag.length >= 2 && !BANNED_GENERIC_WORDS.has(tag));

  // Remove duplicates while maintaining order
  const uniqueTags = Array.from(new Set(cleaned));

  // Dynamic cap: Minimum 2, maximum 6
  return uniqueTags.slice(0, 6);
}

export function getTagColor(tagName: string, index = 0): TagColor {
  const clean = tagName.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');

  if (TOPIC_COLOR_MAP[clean]) {
    return TOPIC_COLOR_MAP[clean];
  }

  for (const [key, color] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === key || clean.startsWith(key + ' ') || clean.endsWith(' ' + key)) {
      return color;
    }
  }

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash + clean.charCodeAt(i)) % PALETTE_COLORS.length;
  }
  return PALETTE_COLORS[(hash + index) % PALETTE_COLORS.length];
}

function getResolvedGeminiKey(customKey?: string): string {
  if (customKey && customKey.trim()) return customKey.trim();
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  try {
    if (typeof atob !== 'undefined') {
      return atob('QVEuQWI4Uk42SXFWTm1YMjNubEdhbTVXSlVNNGFOeVhZOFUzZ1lERXJLVjNRQ3BaQUkxaWc=');
    }
    return Buffer.from('QVEuQWI4Uk42SXFWTm1YMjNubEdhbTVXSlVNNGFOeVhZOFUzZ1lERXJLVjNRQ3BaQUkxaWc=', 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

export const DEFAULT_GEMINI_API_KEY = getResolvedGeminiKey();

// 4. Production Gemini Structured JSON Prompt
export async function generateGeminiAiTags(input: TagInput, apiKey?: string): Promise<GeneratedTag[] | null> {
  const geminiKey = getResolvedGeminiKey(apiKey);
  if (!geminiKey) return null;

  const models = [
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.1-pro-preview',
  ];

  const systemInstruction = `You are a precise content classification and knowledge extraction engine for a personal knowledge vault.
Analyze the provided content metadata and extract high-utility, highly searchable, relevant tags.

DYNAMIC TAGGING RULES (MIN 2, MAX 6 TAGS):
1. Knowledge & Depth-Based Tag Count:
   - For RICH, DETAILED, or KNOWLEDGE-HEAVY content (tutorials, multi-step guides, tech stacks, deep breakdowns, workflow tips, tool comparisons, specific techniques): Generate 4 to 6 specific tags.
   - For SHORT, SIMPLE, or MINIMAL content (brief thoughts, simple links, short memes): Generate 2 to 3 concise tags.
2. Format: STRICTLY lowercase text with standard spaces. NEVER use hyphens, hashtags, underscores, or special characters (e.g. use "video editing" instead of "video-editing" or "#videoediting").
3. High-Value Specificity: ALWAYS prioritize specific named tools, software, libraries, frameworks, models, and core mechanics over vague concepts (e.g. prefer "chatgpt", "premiere pro", "speed ramping", "cursor", "ffmpeg", "tailwind", "after effects", "motion design" over "software" or "tips").
4. Deduplication: Never include redundant synonyms (e.g. do not output both "ai" and "artificial intelligence").
5. NO Fluff: Never use low-intent generic words like "tips", "tricks", "information", "best", "useful", "guide", "post".

OUTPUT FORMAT (JSON ONLY):
{
  "content_density": "low" | "medium" | "high",
  "category": "string",
  "tools_and_entities": ["string", "string"],
  "core_topics": ["string", "string"],
  "content_format": "string",
  "final_tags": ["string", "string"]
}`;

  const preprocessedContent = preprocessPlatformInput(input);
  const userContent = `Platform: ${input.platform || 'web'}
Title: ${input.title || 'Untitled'}
Context: ${preprocessedContent}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\nINPUT:\n${userContent}\n\nOUTPUT (JSON ONLY):` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      if (!rawText) continue;

      let rawTagList: string[] = [];
      const cleanedJson = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      try {
        const parsed: GeminiTagResponse = JSON.parse(cleanedJson);
        if (Array.isArray(parsed.final_tags) && parsed.final_tags.length >= 2) {
          rawTagList = parsed.final_tags;
        } else {
          const list: string[] = [];
          if (parsed.category) list.push(parsed.category);
          if (Array.isArray(parsed.tools_and_entities)) list.push(...parsed.tools_and_entities);
          if (Array.isArray(parsed.core_topics)) list.push(...parsed.core_topics);
          if (parsed.content_format) list.push(parsed.content_format);
          rawTagList = list;
        }
      } catch {
        const objMatch = rawText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          try {
            const parsed = JSON.parse(objMatch[0]);
            if (Array.isArray(parsed.final_tags)) rawTagList = parsed.final_tags;
            else {
              const list: string[] = [];
              if (parsed.category) list.push(parsed.category);
              if (Array.isArray(parsed.tools_and_entities)) list.push(...parsed.tools_and_entities);
              if (Array.isArray(parsed.core_topics)) list.push(...parsed.core_topics);
              if (parsed.content_format) list.push(parsed.content_format);
              rawTagList = list;
            }
          } catch {}
        }
      }

      const normalizedTagStrings = normalizeAndCleanTags(rawTagList);

      if (normalizedTagStrings.length >= 2) {
        return normalizedTagStrings.slice(0, 6).map((tagName, idx) => ({
          name: tagName,
          color: getTagColor(tagName, idx),
        }));
      }
    } catch {
      continue;
    }
  }

  return null;
}

// 5. Semantic Heuristic Fallback Engine (Clean Spaces, Specific Tools First, Dynamic 2-6 Tags)
export function extractHeuristicTags(input: TagInput): GeneratedTag[] {
  const textBlob = `${input.title || ''} ${input.text} ${input.url || ''} ${input.context || ''}`.toLowerCase();
  
  let detectedCategory: string | null = null;
  const detectedEntities: string[] = [];
  let detectedFormat: string | null = null;

  // 1. Tool & Entity Detection (High Priority)
  // Video & Graphic Design Tools & Skills
  if (hasPattern(textBlob, 'premiere')) detectedEntities.push('premiere pro');
  if (hasPattern(textBlob, 'after effects') || hasPattern(textBlob, 'ae')) detectedEntities.push('after effects');
  if (hasPattern(textBlob, 'davinci')) detectedEntities.push('davinci resolve');
  if (hasPattern(textBlob, 'capcut')) detectedEntities.push('capcut');
  if (hasPattern(textBlob, 'ffmpeg')) detectedEntities.push('ffmpeg');
  if (hasPattern(textBlob, 'speed ramp') || hasPattern(textBlob, 'speedramping')) detectedEntities.push('speed ramping');
  if (hasPattern(textBlob, 'color grade') || hasPattern(textBlob, 'colorgrade') || hasPattern(textBlob, 'lut')) detectedEntities.push('color grade');
  if (hasPattern(textBlob, 'blender')) detectedEntities.push('blender');
  if (hasPattern(textBlob, 'photoshop')) detectedEntities.push('photoshop');
  if (hasPattern(textBlob, 'illustrator')) detectedEntities.push('illustrator');
  if (hasPattern(textBlob, 'thumbnail') || hasPattern(textBlob, 'thumbnails')) detectedEntities.push('thumbnails');
  if (hasPattern(textBlob, 'photo edit') || hasPattern(textBlob, 'photo-edit') || hasPattern(textBlob, 'retouch')) detectedEntities.push('photo editing');
  if (hasPattern(textBlob, 'motion design') || hasPattern(textBlob, 'motion graphic') || hasPattern(textBlob, 'animation')) detectedEntities.push('motion design');
  if (hasPattern(textBlob, 'sound effect') || hasPattern(textBlob, 'sfx') || hasPattern(textBlob, 'sound design')) detectedEntities.push('sound effects');
  if (hasPattern(textBlob, 'vfx') || hasPattern(textBlob, 'visual effect')) detectedEntities.push('vfx');

  // AI & Dev Tools
  if (hasPattern(textBlob, 'chatgpt') || hasPattern(textBlob, 'gpt 4') || hasPattern(textBlob, 'gpt4') || hasPattern(textBlob, 'openai')) detectedEntities.push('chatgpt');
  if (hasPattern(textBlob, 'claude') || hasPattern(textBlob, 'anthropic')) detectedEntities.push('claude');
  if (hasPattern(textBlob, 'cursor')) detectedEntities.push('cursor');
  if (hasPattern(textBlob, 'deepseek')) detectedEntities.push('deepseek');
  if (hasPattern(textBlob, 'gemini')) detectedEntities.push('gemini');
  if (hasPattern(textBlob, 'whisper')) detectedEntities.push('whisper');
  if (hasPattern(textBlob, 'langchain')) detectedEntities.push('langchain');
  if (hasPattern(textBlob, 'ai agent') || hasPattern(textBlob, 'agents') || hasPattern(textBlob, 'agentic')) detectedEntities.push('ai agents');
  if (hasPattern(textBlob, 'prompt') || hasPattern(textBlob, 'prompting')) detectedEntities.push('prompt engineering');
  if (hasPattern(textBlob, 'react')) detectedEntities.push('react');
  if (hasPattern(textBlob, 'next js') || hasPattern(textBlob, 'nextjs')) detectedEntities.push('next js');
  if (hasPattern(textBlob, 'tailwind')) detectedEntities.push('tailwind');
  if (hasPattern(textBlob, 'shadcn')) detectedEntities.push('shadcn');
  if (hasPattern(textBlob, 'supabase')) detectedEntities.push('supabase');
  if (hasPattern(textBlob, 'python')) detectedEntities.push('python');
  if (hasPattern(textBlob, 'open source') || hasPattern(textBlob, 'opensource') || hasPattern(textBlob, 'github')) detectedEntities.push('open source');

  // Gaming Entities
  if (hasPattern(textBlob, 'gta 6') || hasPattern(textBlob, 'gta vi') || hasPattern(textBlob, 'gta')) detectedEntities.push('gta 6');
  if (hasPattern(textBlob, 'watch dogs 2') || hasPattern(textBlob, 'watch dogs')) detectedEntities.push('watch dogs 2');
  if (hasPattern(textBlob, 'playstation') || hasPattern(textBlob, 'ps5')) detectedEntities.push('playstation');
  if (hasPattern(textBlob, 'xbox')) detectedEntities.push('xbox');
  if (hasPattern(textBlob, 'steam')) detectedEntities.push('steam');

  // Design Entities
  if (hasPattern(textBlob, 'figma')) detectedEntities.push('figma');
  if (hasPattern(textBlob, 'typography') || hasPattern(textBlob, 'font') || hasPattern(textBlob, 'fonts')) detectedEntities.push('typography');
  if (hasPattern(textBlob, 'design system') || hasPattern(textBlob, 'design-system')) detectedEntities.push('design system');

  // Fitness
  if (hasPattern(textBlob, 'calisthenics') || hasPattern(textBlob, 'bodyweight') || hasPattern(textBlob, 'pullup') || hasPattern(textBlob, 'pushup')) {
    detectedEntities.push('calisthenics');
  }

  // 2. Category Detection
  if (
    hasPattern(textBlob, 'premiere') ||
    hasPattern(textBlob, 'video edit') ||
    hasPattern(textBlob, 'davinci') ||
    hasPattern(textBlob, 'after effects') ||
    hasPattern(textBlob, 'capcut') ||
    hasPattern(textBlob, 'ffmpeg') ||
    hasPattern(textBlob, 'speed ramp') ||
    hasPattern(textBlob, 'color grade') ||
    hasPattern(textBlob, 'timeline') ||
    hasPattern(textBlob, 'b roll') ||
    hasPattern(textBlob, 'transition')
  ) {
    detectedCategory = 'video editing';
  } else if (
    hasPattern(textBlob, 'thumbnail') ||
    hasPattern(textBlob, 'photoshop') ||
    hasPattern(textBlob, 'illustrator') ||
    hasPattern(textBlob, 'graphic design') ||
    hasPattern(textBlob, 'photo edit')
  ) {
    detectedCategory = 'graphic design';
  } else if (
    hasPattern(textBlob, 'game') ||
    hasPattern(textBlob, 'gaming') ||
    hasPattern(textBlob, 'gta') ||
    hasPattern(textBlob, 'watch dogs') ||
    hasPattern(textBlob, 'playstation') ||
    hasPattern(textBlob, 'xbox') ||
    hasPattern(textBlob, 'steam') ||
    hasPattern(textBlob, 'gameplay')
  ) {
    detectedCategory = 'gaming';
  } else if (
    hasPattern(textBlob, 'claude') ||
    hasPattern(textBlob, 'chatgpt') ||
    hasPattern(textBlob, 'openai') ||
    hasPattern(textBlob, 'gemini') ||
    hasPattern(textBlob, 'deepseek') ||
    hasPattern(textBlob, 'llm') ||
    hasPattern(textBlob, 'prompt') ||
    hasPattern(textBlob, 'ai agent') ||
    hasPattern(textBlob, 'generative ai')
  ) {
    detectedCategory = 'ai';
  } else if (
    hasPattern(textBlob, 'react') ||
    hasPattern(textBlob, 'next js') ||
    hasPattern(textBlob, 'tailwind') ||
    hasPattern(textBlob, 'coding') ||
    hasPattern(textBlob, 'typescript') ||
    hasPattern(textBlob, 'javascript') ||
    hasPattern(textBlob, 'supabase') ||
    hasPattern(textBlob, 'github')
  ) {
    detectedCategory = 'tech';
  } else if (
    hasPattern(textBlob, 'figma') ||
    hasPattern(textBlob, 'ui') ||
    hasPattern(textBlob, 'ux') ||
    hasPattern(textBlob, 'typography') ||
    hasPattern(textBlob, 'graphic design')
  ) {
    detectedCategory = 'design';
  } else if (
    hasPattern(textBlob, 'calisthenics') ||
    hasPattern(textBlob, 'fitness') ||
    hasPattern(textBlob, 'workout')
  ) {
    detectedCategory = 'fitness';
  } else if (
    hasPattern(textBlob, 'saas') ||
    hasPattern(textBlob, 'startup') ||
    hasPattern(textBlob, 'revenue') ||
    hasPattern(textBlob, 'business')
  ) {
    detectedCategory = 'business';
  } else if (
    hasPattern(textBlob, 'meme') ||
    hasPattern(textBlob, 'funny') ||
    hasPattern(textBlob, 'joke')
  ) {
    detectedCategory = 'entertainment';
  } else {
    const platform = (input.platform || 'web').toLowerCase();
    if (platform === 'youtube') detectedCategory = 'video editing';
    else if (platform === 'instagram') detectedCategory = 'design';
    else detectedCategory = 'tech';
  }

  // 3. Format Detection
  if (hasPattern(textBlob, 'workflow')) {
    detectedFormat = 'workflow';
  } else if (hasPattern(textBlob, 'tutorial') || hasPattern(textBlob, 'how to') || hasPattern(textBlob, 'step by step')) {
    detectedFormat = 'tutorial';
  } else if (hasPattern(textBlob, 'case study') || hasPattern(textBlob, 'breakdown')) {
    detectedFormat = 'case study';
  } else if (hasPattern(textBlob, 'meme') || hasPattern(textBlob, 'funny')) {
    detectedFormat = 'meme';
  } else if (hasPattern(textBlob, 'gameplay') || hasPattern(textBlob, 'trailer')) {
    detectedFormat = 'gameplay';
  } else if (hasPattern(textBlob, 'tool') || hasPattern(textBlob, 'software') || hasPattern(textBlob, 'app')) {
    detectedFormat = 'tool';
  }

  const rawTags = [
    detectedCategory,
    ...detectedEntities,
    detectedFormat || undefined,
  ];

  const cleaned = normalizeAndCleanTags(rawTags);

  // Guarantee minimum 2 tags
  const safeList = cleaned.length >= 2 ? cleaned : [detectedCategory || 'tech', 'resource'];

  return safeList.slice(0, 6).map((tagName, idx) => ({
    name: tagName,
    color: getTagColor(tagName, idx),
  }));
}

// Master Tag Generation Pipeline: Gemini AI -> Semantic Fallback (Dynamic 2-6 Tags)
export async function generateAutoTags(input: TagInput, geminiApiKey?: string): Promise<GeneratedTag[]> {
  const aiTags = await generateGeminiAiTags(input, geminiApiKey);
  if (aiTags && aiTags.length >= 2) {
    return aiTags.slice(0, 6);
  }

  return extractHeuristicTags(input);
}
