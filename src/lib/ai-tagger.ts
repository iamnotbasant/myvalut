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
}

export interface GeminiTagResponse {
  category?: string;
  topics?: string[];
  type?: string;
  all_tags?: string[];
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

// 1. Comprehensive Synonym Normalization Dictionary (Prevents duplicates and non-standard variants)
export const SYNONYM_MAP: Record<string, string> = {
  // AI & Machine Learning
  'artificial-intelligence': 'ai',
  'artificialintelligence': 'ai',
  'machine-learning': 'ml',
  'machinelearning': 'ml',
  'deep-learning': 'deep-learning',
  'large-language-models': 'llm',
  'large-language-model': 'llm',
  'llms': 'llm',
  'gpt4': 'gpt-4',
  'gpt-4o': 'gpt-4',
  'gpt4o': 'gpt-4',
  'chat-gpt': 'chatgpt',
  'chatgpt-4': 'chatgpt',
  'gen-ai': 'generative-ai',
  'genai': 'generative-ai',
  'generativeai': 'generative-ai',
  'agents': 'ai-agents',
  'agent': 'ai-agents',
  'ai-agent': 'ai-agents',
  'prompting': 'prompt-engineering',
  'prompts': 'prompt-engineering',
  'prompt': 'prompt-engineering',
  'claude-ai': 'claude',
  'deepseek-ai': 'deepseek',
  'deepseek-r1': 'deepseek',

  // Video Editing, VFX & Motion
  'videoediting': 'video-editing',
  'video-edit': 'video-editing',
  'video-edits': 'video-editing',
  'editing': 'video-editing',
  'adobe-premiere-pro': 'premiere-pro',
  'adobe-premiere': 'premiere-pro',
  'premier-pro': 'premiere-pro',
  'premiere': 'premiere-pro',
  'premierepro': 'premiere-pro',
  'davinci': 'davinci-resolve',
  'davinciresolve': 'davinci-resolve',
  'aftereffects': 'after-effects',
  'after-effect': 'after-effects',
  'adobe-after-effects': 'after-effects',
  'ae': 'after-effects',
  'cap-cut': 'capcut',
  'motiongraphics': 'motion-design',
  'motion-graphics': 'motion-design',
  'graphicdesign': 'graphic-design',
  'graphic-designs': 'graphic-design',
  'visual-effects': 'fx',
  'vfx': 'fx',
  'special-effects': 'fx',
  'sfx': 'sound-effects',
  'sound-design': 'sound-effects',
  'speed-ramp': 'speed-ramping',
  'speedramp': 'speed-ramping',
  'color-grading': 'color-grade',
  'colorgrade': 'color-grade',
  'luts': 'lut',
  '3d-animation': 'animation',
  '2d-animation': 'animation',

  // Design & UI/UX
  'user-interface': 'ui',
  'user-experience': 'ux',
  'ui-ux': 'ui-ux',
  'uiux': 'ui-ux',
  'ui-design': 'ui',
  'ux-design': 'ux',
  'web-design': 'ui',
  'landing-page': 'ui',
  'figjam': 'figma',
  'design-systems': 'design-system',

  // Coding & Web Development
  'reactjs': 'react',
  'react-js': 'react',
  'nextjs': 'next-js',
  'next-js': 'next-js',
  'next': 'next-js',
  'vuejs': 'vue',
  'vue-js': 'vue',
  'sveltejs': 'svelte',
  'svelte-kit': 'svelte',
  'javascript': 'js',
  'typescript': 'ts',
  'tailwindcss': 'tailwind-css',
  'tailwind': 'tailwind-css',
  'shadcn-ui': 'shadcn',
  'shadcn/ui': 'shadcn',
  'web-dev': 'web-development',
  'webdev': 'web-development',
  'webdevelopment': 'web-development',
  'node-js': 'nodejs',
  'node': 'nodejs',
  'postgres': 'postgresql',
  'open-source-software': 'open-source',
  'opensource': 'open-source',
  'git-repo': 'github',
  'search-engine-optimization': 'seo',
  'searchengineoptimization': 'seo',
  'frontend-development': 'frontend',
  'backend-development': 'backend',

  // Fitness & Lifestyle
  'bodyweight-training': 'calisthenics',
  'bodyweight-workout': 'calisthenics',
  'bodyweight': 'calisthenics',
  'working-out': 'fitness',
  'workout': 'fitness',
  'exercise': 'fitness',

  // Finance & Business
  'personal-finance': 'finance',
  'cryptocurrency': 'crypto',
  'cryptocurrencies': 'crypto',
  'bitcoin': 'crypto',
  'ethereum': 'crypto',
  'solana': 'crypto',
  'start-up': 'startup',
  'startups': 'startup',
  'micro-saas': 'saas',
  'indie-hacker': 'startup',
  'conversion-rate': 'marketing',
};

// Curated Semantic Color Map
const TOPIC_COLOR_MAP: Record<string, TagColor> = {
  // Categories (Broad Domain)
  'tech': 'teal',
  'video-editing': 'violet',
  'design': 'pink',
  'finance': 'teal',
  'fitness': 'green',
  'business': 'cyan',
  'marketing': 'orange',
  'productivity': 'amber',
  'education': 'blue',
  'lifestyle': 'pink',
  'gaming': 'indigo',

  // AI & Machine Learning
  'ai': 'teal',
  'ml': 'teal',
  'generative-ai': 'teal',
  'llm': 'teal',
  'gpt-4': 'teal',
  'chatgpt': 'teal',
  'claude': 'teal',
  'gemini': 'teal',
  'deepseek': 'teal',
  'ai-agents': 'teal',
  'prompt-engineering': 'teal',
  'ai-tools': 'teal',
  'rag': 'teal',

  // Video Editing, Motion & Creative
  'premiere-pro': 'violet',
  'after-effects': 'violet',
  'davinci-resolve': 'violet',
  'capcut': 'violet',
  'motion-design': 'violet',
  'animation': 'violet',
  'fx': 'violet',
  'speed-ramping': 'violet',
  'color-grade': 'violet',
  'sound-effects': 'pink',
  '3d-design': 'violet',
  'blender': 'orange',

  // Design, UI & UX
  'ui': 'cyan',
  'ux': 'cyan',
  'ui-ux': 'cyan',
  'figma': 'pink',
  'typography': 'amber',
  'design-system': 'violet',
  'design-inspiration': 'pink',
  'graphic-design': 'pink',
  'photo-editing': 'violet',

  // Web Development & Coding
  'web-development': 'teal',
  'frontend': 'cyan',
  'backend': 'teal',
  'react': 'cyan',
  'next-js': 'teal',
  'vue': 'green',
  'svelte': 'orange',
  'js': 'amber',
  'ts': 'teal',
  'tailwind-css': 'cyan',
  'shadcn': 'blue',
  'supabase': 'green',
  'postgresql': 'blue',
  'python': 'teal',
  'open-source': 'green',
  'github': 'orange',
  'devops': 'blue',

  // Business, SaaS & Marketing
  'saas': 'cyan',
  'startup': 'green',
  'seo': 'blue',
  'crypto': 'amber',

  // Fitness & Lifestyle
  'calisthenics': 'green',

  // Content Types (Formats)
  'tutorial': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'guide': 'green',
  'case-study': 'amber',
  'news': 'red',
  'framework': 'indigo',
  'opinion': 'orange',
  'showcase': 'blue',
  'inspiration': 'pink',
};

// Banned Generic / Useless Words
const BANNED_GENERIC_WORDS = new Set([
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social-media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'good', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'best', 'nice', 'great', 'amazing', 'item', 'bookmark'
]);

// 2. Preprocessing: Platform-Wise Input Data Truncation (High-Signal Context Only)
export function preprocessPlatformInput(input: TagInput): string {
  const platform = (input.platform || 'web').toLowerCase();
  const rawText = input.text || '';
  const title = input.title ? `Title: ${input.title.trim()}\n` : '';
  const context = input.context ? input.context.trim() : '';

  switch (platform) {
    case 'youtube': {
      // Title + First 500 chars of Description + First 200 words of Transcript (Ideal: ~800 - 1000 chars)
      const descPart = rawText.slice(0, 500);
      const transcriptWords = context ? context.split(/\s+/).slice(0, 200).join(' ') : '';
      const transcriptPart = transcriptWords ? `\nTranscript: ${transcriptWords}` : '';
      return `${title}Description: ${descPart}${transcriptPart}`.trim().slice(0, 1000);
    }
    case 'instagram':
    case 'reels':
    case 'tiktok': {
      // Caption + Extracted Audio Transcript (Short) (Ideal: ~500 chars)
      const caption = rawText.slice(0, 400);
      const audioText = context ? `\nAudio Transcript: ${context.slice(0, 150)}` : '';
      return `${title}Caption: ${caption}${audioText}`.trim().slice(0, 500);
    }
    case 'twitter':
    case 'x':
    case 'threads':
    case 'bluesky': {
      // Full Tweet Text + Quoted Tweet Text (Ideal: ~300 - 500 chars)
      const quoteText = context ? `\nQuoted Tweet: ${context.slice(0, 250)}` : '';
      return `${title}Tweet: ${rawText}${quoteText}`.trim().slice(0, 500);
    }
    case 'reddit': {
      // Post Title + Post Body (selftext) (Ideal: ~1000 chars max)
      return `${title}Post Body: ${rawText}`.trim().slice(0, 1000);
    }
    case 'web':
    default: {
      // Page <title> + Meta Description + First 2-3 Headings/Paragraphs (Ideal: ~1200 chars)
      return `${title}Content: ${rawText}`.trim().slice(0, 1200);
    }
  }
}

// 3. Backend Normalization Pipeline: Lowercase + Kebab + Synonym Map + Deduplication + Length Filter + Strictly 3-5 Cap
export function cleanAndNormalizeTags(rawTags: (string | null | undefined)[]): string[] {
  if (!Array.isArray(rawTags)) return [];

  const cleaned = rawTags
    .map(tag => {
      if (typeof tag !== 'string') return '';
      return tag
        .toLowerCase()
        .trim()
        .replace(/^#+/, '')
        .replace(/[_\s/]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter((tag, index, self) => {
      return (
        tag.length >= 2 &&
        tag.length <= 25 &&
        !BANNED_GENERIC_WORDS.has(tag) &&
        self.indexOf(tag) === index
      );
    });

  // Return strictly capped between 3 and 5 tags if available
  return cleaned.slice(0, 5);
}

export function getTagColor(tagName: string, index = 0): TagColor {
  const clean = tagName.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  const spaceKey = clean.replace(/-/g, ' ');

  if (TOPIC_COLOR_MAP[clean]) {
    return TOPIC_COLOR_MAP[clean];
  }
  if (TOPIC_COLOR_MAP[spaceKey]) {
    return TOPIC_COLOR_MAP[spaceKey];
  }

  for (const [key, color] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === key || clean.startsWith(key + '-') || clean.endsWith('-' + key)) {
      return color;
    }
  }

  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = (hash + tagName.charCodeAt(i)) % PALETTE_COLORS.length;
  }
  return PALETTE_COLORS[(hash + index) % PALETTE_COLORS.length];
}

export const DEFAULT_GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// 4. Production-Ready Google Gemini Structured JSON Prompt
export async function generateGeminiAiTags(input: TagInput, apiKey?: string): Promise<GeneratedTag[] | null> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;
  if (!geminiKey) return null;

  // Active Google Gemini model endpoints in order of preference
  const models = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
  ];

  const systemInstruction = `You are an automated categorization and tagging engine for a personal knowledge vault.
Analyze the provided content metadata and generate clean, standardized tags in JSON format.

RULES FOR TAG GENERATION:
1. Generate minimum 3 and maximum 5 tags.
2. Format: STRICTLY lowercase, kebab-case (e.g., "video-editing", "ai-tools", "trading-strategy").
3. NO duplicates or near-synonyms (e.g., do not use both "ai" and "artificial-intelligence").
4. ALWAYS prefer shorter, industry-standard acronyms over long descriptions (e.g., use "ai" instead of "artificial-intelligence", "seo" instead of "search-engine-optimization", "fx" instead of "visual-effects").
5. Structure the output into:
   - "category": Broad domain (1 item: e.g., "tech", "video-editing", "design", "finance", "fitness", "productivity", "marketing", "business", "gaming")
   - "topics": Core subject or tools mentioned (2-3 items: e.g., ["premiere-pro", "speed-ramping"] or ["chatgpt", "prompt-engineering"] or ["next-js", "react"])
   - "type": Nature of content (1 item: e.g., "tutorial", "tool", "resource", "news", "guide", "framework", "case-study", "showcase")
   - "all_tags": Combined ordered list of tags: [category, ...topics, type] (strictly 3 to 5 items)

OUTPUT FORMAT (JSON ONLY):
{
  "category": "string",
  "topics": ["string", "string"],
  "type": "string",
  "all_tags": ["string", "string", "string", "string"]
}`;

  const preprocessedContent = preprocessPlatformInput(input);
  const userContent = `Platform: ${input.platform || 'web'}
Title: ${input.title || 'Untitled'}
Content/Context: ${preprocessedContent}`;

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

      // Clean markdown code blocks if present (```json ... ```)
      let cleanedJson = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      try {
        const parsed: GeminiTagResponse = JSON.parse(cleanedJson);
        if (Array.isArray(parsed.all_tags) && parsed.all_tags.length >= 3) {
          rawTagList = parsed.all_tags;
        } else {
          const list: string[] = [];
          if (parsed.category) list.push(parsed.category);
          if (Array.isArray(parsed.topics)) list.push(...parsed.topics);
          if (parsed.type) list.push(parsed.type);
          rawTagList = list;
        }
      } catch {
        const objMatch = rawText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          try {
            const parsed = JSON.parse(objMatch[0]);
            if (Array.isArray(parsed.all_tags)) rawTagList = parsed.all_tags;
            else {
              const list: string[] = [];
              if (parsed.category) list.push(parsed.category);
              if (Array.isArray(parsed.topics)) list.push(...parsed.topics);
              if (parsed.type) list.push(parsed.type);
              rawTagList = list;
            }
          } catch {}
        }
        if (rawTagList.length === 0) {
          const arrMatch = rawText.match(/\[[\s\S]*\]/);
          if (arrMatch) {
            try {
              rawTagList = JSON.parse(arrMatch[0]);
            } catch {}
          }
        }
      }

      const normalizedTagStrings = cleanAndNormalizeTags(rawTagList);

      if (normalizedTagStrings.length >= 3) {
        return normalizedTagStrings.slice(0, 5).map((tagName, idx) => ({
          name: tagName,
          color: getTagColor(tagName, idx),
        }));
      }
    } catch {
      // Try next model fallback
      continue;
    }
  }

  return null;
}

// 5. Semantic Heuristic Fallback Engine (Strictly 3-5 Standardized Tags: 1 Category + 2-3 Topics + 1 Type)
export function extractHeuristicTags(input: TagInput): GeneratedTag[] {
  const textBlob = `${input.title || ''} ${input.text} ${input.url || ''} ${input.context || ''}`.toLowerCase();
  
  let detectedCategory: string | null = null;
  const detectedTopics: string[] = [];
  let detectedType: string | null = null;

  // 1. Hashtags extraction (if valid)
  const hashtagRegex = /#([a-zA-Z0-9_-]{2,25})/g;
  let match;
  while ((match = hashtagRegex.exec(input.text)) !== null) {
    const rawTag = match[1].toLowerCase().replace(/_/g, '-');
    const normalized = SYNONYM_MAP[rawTag] || rawTag;
    if (!BANNED_GENERIC_WORDS.has(normalized) && normalized.length >= 2 && !detectedTopics.includes(normalized)) {
      detectedTopics.push(normalized);
    }
  }

  // 2. Curated Taxonomy Mapping
  // Domain 1: Video Editing & Animation
  if (
    hasPattern(textBlob, 'premiere') ||
    hasPattern(textBlob, 'video edit') ||
    hasPattern(textBlob, 'davinci') ||
    hasPattern(textBlob, 'after effects') ||
    hasPattern(textBlob, 'capcut') ||
    hasPattern(textBlob, 'speed ramp') ||
    hasPattern(textBlob, 'color grade') ||
    hasPattern(textBlob, 'lut') ||
    hasPattern(textBlob, 'timeline') ||
    hasPattern(textBlob, 'b-roll') ||
    hasPattern(textBlob, 'transition') ||
    hasPattern(textBlob, 'motion graphic') ||
    hasPattern(textBlob, 'keyframe')
  ) {
    detectedCategory = 'video-editing';
    if (hasPattern(textBlob, 'premiere')) detectedTopics.push('premiere-pro');
    if (hasPattern(textBlob, 'after effects') || hasPattern(textBlob, 'ae')) detectedTopics.push('after-effects');
    if (hasPattern(textBlob, 'davinci')) detectedTopics.push('davinci-resolve');
    if (hasPattern(textBlob, 'capcut')) detectedTopics.push('capcut');
    if (hasPattern(textBlob, 'speed ramp')) detectedTopics.push('speed-ramping');
    if (hasPattern(textBlob, 'color grade') || hasPattern(textBlob, 'lut')) detectedTopics.push('color-grade');
    if (hasPattern(textBlob, 'motion') || hasPattern(textBlob, 'animation')) detectedTopics.push('motion-design');
    if (hasPattern(textBlob, 'fx') || hasPattern(textBlob, 'vfx') || hasPattern(textBlob, 'visual effect')) detectedTopics.push('fx');
  }

  // Domain 2: Fitness & Calisthenics
  else if (
    hasPattern(textBlob, 'calisthenics') ||
    hasPattern(textBlob, 'bodyweight') ||
    hasPattern(textBlob, 'pullup') ||
    hasPattern(textBlob, 'pullups') ||
    hasPattern(textBlob, 'pushup') ||
    hasPattern(textBlob, 'pushups') ||
    hasPattern(textBlob, 'workout') ||
    hasPattern(textBlob, 'fitness') ||
    hasPattern(textBlob, 'gym')
  ) {
    detectedCategory = 'fitness';
    if (hasPattern(textBlob, 'calisthenics') || hasPattern(textBlob, 'bodyweight') || hasPattern(textBlob, 'pullup')) {
      detectedTopics.push('calisthenics');
    }
  }

  // Domain 3: AI, LLMs & Machine Learning
  else if (
    hasPattern(textBlob, 'claude') ||
    hasPattern(textBlob, 'chatgpt') ||
    hasPattern(textBlob, 'gpt-4') ||
    hasPattern(textBlob, 'gpt4') ||
    hasPattern(textBlob, 'openai') ||
    hasPattern(textBlob, 'gemini') ||
    hasPattern(textBlob, 'deepseek') ||
    hasPattern(textBlob, 'llm') ||
    hasPattern(textBlob, 'prompt') ||
    hasPattern(textBlob, 'prompting') ||
    hasPattern(textBlob, 'agent') ||
    hasPattern(textBlob, 'ai agent') ||
    hasPattern(textBlob, 'generative ai') ||
    hasPattern(textBlob, 'genai') ||
    hasPattern(textBlob, 'machine learning') ||
    hasPattern(textBlob, 'pytorch') ||
    hasPattern(textBlob, 'rag')
  ) {
    detectedCategory = 'ai';
    if (hasPattern(textBlob, 'chatgpt') || hasPattern(textBlob, 'gpt')) detectedTopics.push('chatgpt');
    if (hasPattern(textBlob, 'claude') || hasPattern(textBlob, 'anthropic')) detectedTopics.push('claude');
    if (hasPattern(textBlob, 'deepseek')) detectedTopics.push('deepseek');
    if (hasPattern(textBlob, 'gemini')) detectedTopics.push('gemini');
    if (hasPattern(textBlob, 'agent')) detectedTopics.push('ai-agents');
    if (hasPattern(textBlob, 'prompt') || hasPattern(textBlob, 'prompting')) detectedTopics.push('prompt-engineering');
    if (hasPattern(textBlob, 'machine learning') || hasPattern(textBlob, 'model') || hasPattern(textBlob, 'neural') || hasPattern(textBlob, 'pytorch')) detectedTopics.push('ml');
  }

  // Domain 4: Coding & Web Development
  else if (
    hasPattern(textBlob, 'next.js') ||
    hasPattern(textBlob, 'nextjs') ||
    hasPattern(textBlob, 'react') ||
    hasPattern(textBlob, 'tailwind') ||
    hasPattern(textBlob, 'shadcn') ||
    hasPattern(textBlob, 'typescript') ||
    hasPattern(textBlob, 'javascript') ||
    hasPattern(textBlob, 'supabase') ||
    hasPattern(textBlob, 'postgres') ||
    hasPattern(textBlob, 'python') ||
    hasPattern(textBlob, 'docker') ||
    hasPattern(textBlob, 'github') ||
    hasPattern(textBlob, 'frontend') ||
    hasPattern(textBlob, 'backend') ||
    hasPattern(textBlob, 'web dev') ||
    hasPattern(textBlob, 'web development')
  ) {
    detectedCategory = 'tech';
    if (hasPattern(textBlob, 'react')) detectedTopics.push('react');
    if (hasPattern(textBlob, 'next') || hasPattern(textBlob, 'nextjs') || hasPattern(textBlob, 'next.js')) detectedTopics.push('next-js');
    if (hasPattern(textBlob, 'tailwind')) detectedTopics.push('tailwind-css');
    if (hasPattern(textBlob, 'shadcn')) detectedTopics.push('shadcn');
    if (hasPattern(textBlob, 'typescript') || hasPattern(textBlob, 'ts')) detectedTopics.push('ts');
    if (hasPattern(textBlob, 'javascript') || hasPattern(textBlob, 'js')) detectedTopics.push('js');
    if (hasPattern(textBlob, 'supabase')) detectedTopics.push('supabase');
    if (hasPattern(textBlob, 'python')) detectedTopics.push('python');
    if (hasPattern(textBlob, 'github') || hasPattern(textBlob, 'open source') || hasPattern(textBlob, 'opensource')) detectedTopics.push('open-source');
    if (detectedTopics.length === 0) detectedTopics.push('web-development');
  }

  // Domain 5: UI / UX & Design
  else if (
    hasPattern(textBlob, 'ui') ||
    hasPattern(textBlob, 'ux') ||
    hasPattern(textBlob, 'figma') ||
    hasPattern(textBlob, 'design system') ||
    hasPattern(textBlob, 'typography') ||
    hasPattern(textBlob, 'graphic design') ||
    hasPattern(textBlob, 'blender') ||
    hasPattern(textBlob, '3d') ||
    hasPattern(textBlob, 'photoshop')
  ) {
    detectedCategory = 'design';
    if (hasPattern(textBlob, 'ui') || hasPattern(textBlob, 'ux')) detectedTopics.push('ui-ux');
    if (hasPattern(textBlob, 'figma')) detectedTopics.push('figma');
    if (hasPattern(textBlob, 'typography') || hasPattern(textBlob, 'font')) detectedTopics.push('typography');
    if (hasPattern(textBlob, 'graphic design') || hasPattern(textBlob, 'graphic')) detectedTopics.push('graphic-design');
    if (hasPattern(textBlob, '3d') || hasPattern(textBlob, 'blender')) detectedTopics.push('3d-design');
  }

  // Domain 6: Finance, Crypto & Business / SaaS
  else if (
    hasPattern(textBlob, 'crypto') ||
    hasPattern(textBlob, 'bitcoin') ||
    hasPattern(textBlob, 'ethereum') ||
    hasPattern(textBlob, 'solana') ||
    hasPattern(textBlob, 'finance') ||
    hasPattern(textBlob, 'saas') ||
    hasPattern(textBlob, 'startup') ||
    hasPattern(textBlob, 'mrr') ||
    hasPattern(textBlob, 'arr') ||
    hasPattern(textBlob, 'marketing') ||
    hasPattern(textBlob, 'seo')
  ) {
    if (hasPattern(textBlob, 'saas') || hasPattern(textBlob, 'startup') || hasPattern(textBlob, 'mrr') || hasPattern(textBlob, 'arr')) {
      detectedCategory = 'business';
      if (hasPattern(textBlob, 'saas')) detectedTopics.push('saas');
      if (hasPattern(textBlob, 'startup')) detectedTopics.push('startup');
    } else if (hasPattern(textBlob, 'marketing') || hasPattern(textBlob, 'seo')) {
      detectedCategory = 'marketing';
      if (hasPattern(textBlob, 'seo')) detectedTopics.push('seo');
    } else {
      detectedCategory = 'finance';
      if (hasPattern(textBlob, 'crypto') || hasPattern(textBlob, 'bitcoin') || hasPattern(textBlob, 'ethereum')) detectedTopics.push('crypto');
    }
  }

  // Domain 7: Gaming
  else if (
    hasPattern(textBlob, 'game') ||
    hasPattern(textBlob, 'gaming') ||
    hasPattern(textBlob, 'gta') ||
    hasPattern(textBlob, 'playstation') ||
    hasPattern(textBlob, 'steam')
  ) {
    detectedCategory = 'gaming';
    if (hasPattern(textBlob, 'gta')) detectedTopics.push('gta');
  }

  // Fallback Category if not yet resolved
  if (!detectedCategory) {
    const platform = (input.platform || 'web').toLowerCase();
    if (platform === 'youtube') detectedCategory = 'video-editing';
    else if (platform === 'twitter' || platform === 'x' || platform === 'reddit') detectedCategory = 'tech';
    else if (platform === 'instagram') detectedCategory = 'design';
    else detectedCategory = 'tech';
  }

  // Content Type Detection (1 item)
  if (
    hasPattern(textBlob, 'tutorial') ||
    hasPattern(textBlob, 'how to') ||
    hasPattern(textBlob, 'step by step') ||
    hasPattern(textBlob, 'learn') ||
    hasPattern(textBlob, 'course')
  ) {
    detectedType = 'tutorial';
  } else if (
    hasPattern(textBlob, 'tool') ||
    hasPattern(textBlob, 'app') ||
    hasPattern(textBlob, 'software') ||
    hasPattern(textBlob, 'extension') ||
    hasPattern(textBlob, 'plugin')
  ) {
    detectedType = 'tool';
  } else if (
    hasPattern(textBlob, 'guide') ||
    hasPattern(textBlob, 'cheatsheet') ||
    hasPattern(textBlob, 'handbook')
  ) {
    detectedType = 'guide';
  } else if (
    hasPattern(textBlob, 'case study') ||
    hasPattern(textBlob, 'breakdown') ||
    hasPattern(textBlob, 'analysis')
  ) {
    detectedType = 'case-study';
  } else if (
    hasPattern(textBlob, 'news') ||
    hasPattern(textBlob, 'announce') ||
    hasPattern(textBlob, 'launch') ||
    hasPattern(textBlob, 'release')
  ) {
    detectedType = 'news';
  } else if (
    hasPattern(textBlob, 'framework') ||
    hasPattern(textBlob, 'library') ||
    hasPattern(textBlob, 'template')
  ) {
    detectedType = 'framework';
  } else if (
    hasPattern(textBlob, 'opinion') ||
    hasPattern(textBlob, 'thoughts') ||
    hasPattern(textBlob, 'review')
  ) {
    detectedType = 'opinion';
  } else {
    detectedType = detectedCategory === 'video-editing' ? 'tutorial' : 'resource';
  }

  // Include user custom tags if provided
  if (input.customTags && Array.isArray(input.customTags)) {
    for (const ct of input.customTags) {
      if (!detectedTopics.includes(ct)) {
        detectedTopics.push(ct);
      }
    }
  }

  // Ensure 2-3 topic tags
  if (detectedTopics.length === 0) {
    if (detectedCategory === 'video-editing') detectedTopics.push('premiere-pro', 'video-editing');
    else if (detectedCategory === 'ai') detectedTopics.push('ai-tools', 'prompt-engineering');
    else if (detectedCategory === 'tech') detectedTopics.push('web-development', 'react');
    else if (detectedCategory === 'design') detectedTopics.push('ui-ux', 'figma');
    else if (detectedCategory === 'fitness') detectedTopics.push('calisthenics', 'fitness');
    else if (detectedCategory === 'business') detectedTopics.push('startup', 'saas');
    else if (detectedCategory === 'marketing') detectedTopics.push('seo', 'growth');
    else if (detectedCategory === 'finance') detectedTopics.push('crypto', 'investing');
    else detectedTopics.push('web-development', 'resource');
  } else if (detectedTopics.length === 1) {
    if (detectedCategory === 'video-editing') detectedTopics.push('video-editing');
    else if (detectedCategory === 'ai') detectedTopics.push('ai-tools');
    else if (detectedCategory === 'tech') detectedTopics.push('web-development');
    else if (detectedCategory === 'design') detectedTopics.push('design-inspiration');
    else if (detectedCategory === 'fitness') detectedTopics.push('fitness');
    else detectedTopics.push('resource');
  }

  // Assemble strictly: [category, topic1, topic2, (topic3), type]
  const combinedRaw = [
    detectedCategory,
    ...detectedTopics.slice(0, 3),
    detectedType
  ];

  const normalized = cleanAndNormalizeTags(combinedRaw);

  // Guarantee strictly between 3 and 5 tags
  const safeList = normalized.length >= 3 ? normalized.slice(0, 5) : cleanAndNormalizeTags([detectedCategory, 'resource', 'guide', detectedType]);

  return safeList.slice(0, 5).map((tagName, idx) => ({
    name: tagName,
    color: getTagColor(tagName, idx),
  }));
}

// Master Tag Generation Pipeline: Gemini AI -> Semantic Fallback
export async function generateAutoTags(input: TagInput, geminiApiKey?: string): Promise<GeneratedTag[]> {
  // 1. Try Gemini AI with structured JSON and strict 3-5 tags
  const aiTags = await generateGeminiAiTags(input, geminiApiKey);
  if (aiTags && aiTags.length >= 3) {
    return aiTags.slice(0, 5);
  }

  // 2. High-precision semantic heuristic fallback (1 Category + 2-3 Topics + 1 Type)
  return extractHeuristicTags(input);
}
