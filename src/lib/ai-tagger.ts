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
  category: string;
  topics: string[];
  type: string;
  all_tags?: string[];
}

const PALETTE_COLORS: TagColor[] = [
  'teal',
  'amber',
  'green',
  'cyan',
  'orange',
  'red',
  'violet',
  'pink',
  'blue',
  'indigo',
];

// 1. Synonym Normalization Dictionary (Prevents duplicate/variant tags)
export const SYNONYM_MAP: Record<string, string> = {
  // AI & ML
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
  'chat-gpt': 'chatgpt',
  'gen-ai': 'generative-ai',
  'genai': 'generative-ai',
  'agents': 'ai-agents',
  'agent': 'ai-agents',

  // Video & Design
  'videoediting': 'video-editing',
  'video-edit': 'video-editing',
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
  'motiongraphics': 'motion-design',
  'motion-graphics': 'motion-design',
  'graphicdesign': 'graphic-design',
  'graphic-designs': 'graphic-design',
  'visual-effects': 'fx',
  'vfx': 'fx',
  'sfx': 'sound-effects',
  'user-interface': 'ui',
  'user-experience': 'ux',
  'ui-ux': 'ui-ux',
  'uiux': 'ui-ux',
  'speed-ramp': 'speed-ramping',
  'color-grading': 'color-grade',

  // Coding & Web Development
  'reactjs': 'react',
  'react-js': 'react',
  'nextjs': 'next-js',
  'next-js': 'next-js',
  'vuejs': 'vue',
  'vue-js': 'vue',
  'sveltejs': 'svelte',
  'javascript': 'js',
  'typescript': 'ts',
  'tailwindcss': 'tailwind-css',
  'tailwind': 'tailwind-css',
  'web-dev': 'web-development',
  'webdev': 'web-development',
  'webdevelopment': 'web-development',
  'node-js': 'nodejs',
  'postgres': 'postgresql',
  'open-source-software': 'open-source',
  'opensource': 'open-source',
  'search-engine-optimization': 'seo',
  'searchengineoptimization': 'seo',
  'frontend-development': 'frontend',
  'backend-development': 'backend',

  // Fitness & Lifestyle
  'bodyweight-training': 'calisthenics',
  'bodyweight-workout': 'calisthenics',
  'working-out': 'fitness',
  'workout': 'fitness',

  // Finance & Business
  'personal-finance': 'finance',
  'cryptocurrency': 'crypto',
  'cryptocurrencies': 'crypto',
  'start-up': 'startup',
  'startups': 'startup',
  'micro-saas': 'saas',
};

// Curated Semantic Color Map (Supports both kebab-case and spaced keys)
const TOPIC_COLOR_MAP: Record<string, TagColor> = {
  // Categories (Broad Domains)
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
  'machine-learning': 'teal',
  'deep-learning': 'teal',
  'llm': 'teal',
  'gpt': 'teal',
  'gpt-4': 'teal',
  'chatgpt': 'teal',
  'claude': 'teal',
  'gemini': 'teal',
  'openai': 'teal',
  'anthropic': 'teal',
  'deepseek': 'teal',
  'ai-agents': 'teal',
  'prompt-engineering': 'teal',
  'computer-vision': 'teal',
  'nlp': 'teal',
  'rag': 'teal',

  // Video & Motion & Creative
  'premiere-pro': 'violet',
  'after-effects': 'violet',
  'davinci-resolve': 'violet',
  'motion-design': 'violet',
  'animation': 'violet',
  'fx': 'violet',
  'speed-ramping': 'violet',
  'color-grade': 'violet',
  'sound-effects': 'pink',
  '3d-design': 'violet',
  'blender': 'orange',
  'three-js': 'violet',

  // Design, UI/UX
  'ui': 'cyan',
  'ux': 'cyan',
  'ui-ux': 'cyan',
  'product-design': 'pink',
  'design-system': 'violet',
  'figma': 'pink',
  'typography': 'amber',
  'branding': 'orange',
  'graphic-design': 'pink',

  // Frontend & Web Development
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
  'coding': 'cyan',

  // Backend & Cloud & Database
  'python': 'teal',
  'rust': 'orange',
  'go': 'cyan',
  'database': 'indigo',
  'postgresql': 'blue',
  'supabase': 'green',
  'docker': 'blue',
  'kubernetes': 'blue',
  'devops': 'blue',
  'open-source': 'green',
  'security': 'red',

  // Business & Marketing & Finance
  'saas': 'cyan',
  'startup': 'green',
  'growth': 'green',
  'seo': 'blue',
  'crypto': 'amber',
  'investing': 'teal',

  // Content Types (Formats)
  'tutorial': 'green',
  'guide': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'case-study': 'amber',
  'opinion': 'orange',
  'news': 'red',
  'framework': 'indigo',
  'workflow': 'amber',
  'calisthenics': 'green',
};

// Banned Generic / Useless Words
const BANNED_GENERIC_WORDS = new Set([
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social-media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'good', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'best', 'nice', 'great', 'amazing', 'item'
]);

// 2. Preprocessing: Platform-Wise Input Data Truncation (High-Signal Context Only)
export function preprocessPlatformInput(input: TagInput): string {
  const platform = (input.platform || 'web').toLowerCase();
  const rawText = input.text || '';
  const title = input.title ? `Title: ${input.title.trim()}\n` : '';
  const context = input.context ? input.context.trim() : '';

  switch (platform) {
    case 'youtube': {
      // Title + First 500 chars of Description + First 200 words of Transcript (Ideal: ~800-1000 chars)
      const descPart = rawText.slice(0, 500);
      const transcriptWords = context ? context.split(/\s+/).slice(0, 200).join(' ') : '';
      const transcriptPart = transcriptWords ? `\nTranscript: ${transcriptWords}` : '';
      return `${title}Description: ${descPart}${transcriptPart}`.trim().slice(0, 1000);
    }
    case 'instagram':
    case 'reels':
    case 'tiktok': {
      // Caption + Short Extracted Audio Transcript (Ideal: ~500 chars)
      const caption = rawText.slice(0, 400);
      const audioText = context ? `\nAudio Transcript: ${context.slice(0, 150)}` : '';
      return `${title}Caption: ${caption}${audioText}`.trim().slice(0, 550);
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

// 3. Backend Normalization Pipeline: Lowercase + Kebab + Synonym Map + Deduplication + Length Filter + Cap
export function cleanAndNormalizeTags(rawTags: (string | null | undefined)[]): string[] {
  if (!Array.isArray(rawTags)) return [];

  return rawTags
    .map(tag => {
      if (typeof tag !== 'string') return '';
      return tag
        .toLowerCase()
        .trim()
        .replace(/^#+/, '')
        .replace(/[_\s]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter((tag, index, self) => {
      return (
        tag.length >= 2 &&
        !BANNED_GENERIC_WORDS.has(tag) &&
        !BANNED_GENERIC_WORDS.has(tag.replace(/-/g, ' ')) &&
        self.indexOf(tag) === index
      );
    })
    .slice(0, 5); // Hard cap at 5 tags for consistent UI/DB
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

  const models = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite',
  ];

  const systemInstruction = `You are an automated categorization and tagging engine for a personal knowledge vault.
Analyze the provided content metadata and generate clean, standardized tags in JSON format.

RULES FOR TAG GENERATION:
1. Generate strictly 3 to 5 tags total.
2. Format: STRICTLY lowercase, kebab-case (e.g., "video-editing", "premiere-pro", "speed-ramping", "tutorial").
3. NO duplicate or near-synonym tags (e.g., do not use both "ai" and "artificial-intelligence").
4. ALWAYS prefer shorter, industry-standard acronyms over long descriptions (e.g., use "ai" instead of "artificial-intelligence", "seo" instead of "search-engine-optimization", "fx" instead of "visual-effects").
5. Structure the output into 3 exact tiers:
   - "category": 1 broad domain (e.g., "tech", "video-editing", "finance", "fitness", "design", "business", "marketing", "productivity", "education")
   - "topics": 2-3 specific subject matter or tools mentioned (e.g., ["premiere-pro", "speed-ramping"] or ["next-js", "supabase"] or ["chatgpt", "prompt-engineering"])
   - "type": 1 nature/format of content (e.g., "tutorial", "tool", "resource", "guide", "case-study", "framework", "opinion", "news", "workflow")
   - "all_tags": Ordered combined array: [category, ...topics, type]

INPUT FORMAT:
Platform: {platform}
Title: {title}
Content/Context: {content_text}

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
                { text: `${systemInstruction}\n\n${userContent}\n\nReturn JSON output matching the schema:` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 250,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini model ${model} returned status:`, response.status);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      let rawTagList: string[] = [];

      try {
        const parsed: GeminiTagResponse = JSON.parse(rawText);
        if (Array.isArray(parsed.all_tags) && parsed.all_tags.length > 0) {
          rawTagList = parsed.all_tags;
        } else {
          const list: string[] = [];
          if (parsed.category) list.push(parsed.category);
          if (Array.isArray(parsed.topics)) list.push(...parsed.topics);
          if (parsed.type) list.push(parsed.type);
          rawTagList = list;
        }
      } catch (parseErr) {
        // Fallback array regex parse
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            rawTagList = JSON.parse(match[0]);
          } catch {
            // ignore
          }
        }
      }

      // Run through Backend Normalization Pipeline
      const normalizedTagStrings = cleanAndNormalizeTags(rawTagList);

      if (normalizedTagStrings.length >= 2) {
        return normalizedTagStrings.map((tagName, idx) => ({
          name: tagName,
          color: getTagColor(tagName, idx),
        }));
      }
    } catch (err) {
      console.warn(`Error trying Gemini model ${model}:`, err);
    }
  }

  return null;
}

// 5. Semantic Heuristic Fallback Engine (Normalized to lowercase-kebab-case)
export function extractHeuristicTags(input: TagInput): GeneratedTag[] {
  const textBlob = `${input.title || ''} ${input.text} ${input.url || ''} ${input.context || ''}`.toLowerCase();
  const rawList: string[] = [];

  // Hashtags extraction
  const hashtagRegex = /#([a-zA-Z0-9_-]{2,28})/g;
  let match;
  while ((match = hashtagRegex.exec(input.text)) !== null) {
    rawList.push(match[1]);
  }

  // Domain Taxonomy Mapping (Category + Topic + Type)
  const domainRules: { patterns: (string | RegExp)[]; category: string; topic: string; type?: string }[] = [
    // Gaming & Esports
    { patterns: ['gta 6', 'gta6', 'gta', 'grand theft auto', 'rockstar games', 'rockstar', 'gameplay', 'gaming', 'playstation', 'ps5', 'xbox', 'steam', 'fortnite', 'minecraft', 'valorant', 'esports'], category: 'gaming', topic: 'gta-6', type: 'trailer' },
    
    // Entertainment, Streaming, Movies & Documentaries
    { patterns: ['netflix', 'documentary', 'docuseries', 'extended look', 'episode', 'series', 'cinema', 'hollywood', 'anime', 'movie', 'film'], category: 'entertainment', topic: 'documentary', type: 'reaction' },
    { patterns: ['reaction', 'reacting', 'live reaction'], category: 'entertainment', topic: 'reaction', type: 'opinion' },
    { patterns: ['leak', 'leaks', 'cyberleek', 'rumor', 'insider'], category: 'entertainment', topic: 'news', type: 'case-study' },

    // Social Media, Instagram & Creators
    { patterns: ['instagram', 'reels', 'insta', 'photo', 'influencer'], category: 'social-media', topic: 'instagram', type: 'showcase' },
    { patterns: ['twitter', 'tweet', 'threads', 'bluesky'], category: 'social-media', topic: 'news', type: 'opinion' },

    // Video Editing & Media
    { patterns: ['premiere pro', 'premiere', 'video edit', 'video editing', 'davinci', 'capcut', 'after effects', 'vfx', 'speed ramp'], category: 'video-editing', topic: 'premiere-pro', type: 'tutorial' },
    { patterns: ['motion design', 'framer motion', 'gsap', 'lottie', 'animation'], category: 'design', topic: 'motion-design', type: 'resource' },
    
    // AI & Agents
    { patterns: [/\bagents?\b/, 'crewai', 'autogen', 'langchain', 'langgraph'], category: 'tech', topic: 'ai-agents', type: 'tool' },
    { patterns: ['claude', 'anthropic', 'sonnet', 'opus'], category: 'tech', topic: 'claude', type: 'tool' },
    { patterns: ['chatgpt', 'gpt-4', 'openai', 'o3-mini'], category: 'tech', topic: 'chatgpt', type: 'tool' },
    { patterns: ['gemini', 'deepmind', 'google ai'], category: 'tech', topic: 'gemini', type: 'tool' },
    { patterns: ['deepseek', 'deepseek-r1'], category: 'tech', topic: 'deepseek', type: 'tool' },
    { patterns: ['prompt engineering', 'system prompt', 'prompting'], category: 'tech', topic: 'prompt-engineering', type: 'guide' },
    { patterns: ['machine learning', 'deep learning', 'pytorch'], category: 'tech', topic: 'ml', type: 'guide' },
    { patterns: ['artificial intelligence', 'genai', 'ai tool', /\bai\b/], category: 'tech', topic: 'ai', type: 'resource' },

    // Frontend Development
    { patterns: ['next.js', 'nextjs', 'app router', 'turbopack'], category: 'tech', topic: 'next-js', type: 'framework' },
    { patterns: ['react', 'react 19', 'react hooks', 'reactjs'], category: 'tech', topic: 'react', type: 'framework' },
    { patterns: ['tailwind', 'tailwindcss', 'shadcn'], category: 'tech', topic: 'tailwind-css', type: 'tool' },
    { patterns: ['typescript', 'type system'], category: 'tech', topic: 'ts', type: 'resource' },
    { patterns: ['javascript', 'es6', 'vanilla js'], category: 'tech', topic: 'js', type: 'tutorial' },
    { patterns: ['css grid', 'flexbox', 'webdev', 'frontend'], category: 'tech', topic: 'web-development', type: 'tutorial' },

    // Backend, Cloud & Database
    { patterns: ['supabase', 'supabase db'], category: 'tech', topic: 'supabase', type: 'tool' },
    { patterns: ['postgresql', 'postgres', 'sqlite', 'database'], category: 'tech', topic: 'postgresql', type: 'resource' },
    { patterns: ['python', 'fastapi', 'flask', 'django'], category: 'tech', topic: 'python', type: 'tutorial' },
    { patterns: ['rust', 'cargo', 'tokio'], category: 'tech', topic: 'rust', type: 'resource' },
    { patterns: ['docker', 'kubernetes', 'devops', 'ci/cd'], category: 'tech', topic: 'devops', type: 'tool' },
    { patterns: ['open source', 'opensource', 'github repo'], category: 'tech', topic: 'open-source', type: 'resource' },

    // Design, UI/UX
    { patterns: ['figma', 'figma design', 'figjam'], category: 'design', topic: 'figma', type: 'tool' },
    { patterns: ['ui design', 'ux design', 'ui/ux', 'user interface'], category: 'design', topic: 'ui-ux', type: 'guide' },
    { patterns: ['design system', 'design tokens'], category: 'design', topic: 'design-system', type: 'case-study' },
    { patterns: ['3d design', 'blender', 'three.js', 'webgl'], category: 'design', topic: '3d-design', type: 'resource' },

    // Business & Finance
    { patterns: ['saas', 'micro saas', 'mrr', 'arr'], category: 'business', topic: 'saas', type: 'case-study' },
    { patterns: ['startup', 'founder', 'entrepreneur'], category: 'business', topic: 'startup', type: 'opinion' },
    { patterns: ['seo', 'conversion rate', 'marketing'], category: 'marketing', topic: 'seo', type: 'guide' },
    { patterns: ['bitcoin', 'ethereum', 'crypto', 'blockchain'], category: 'finance', topic: 'crypto', type: 'news' },
    { patterns: ['stock market', 'investing', 'trading'], category: 'finance', topic: 'investing', type: 'guide' },

    // Fitness & Productivity
    { patterns: ['calisthenics', 'bodyweight', 'pullups', 'pushups'], category: 'fitness', topic: 'calisthenics', type: 'tutorial' },
    { patterns: ['productivity', 'workflow', 'notion', 'second brain'], category: 'productivity', topic: 'workflow', type: 'tool' },
  ];

  for (const rule of domainRules) {
    if (rawList.length >= 4) break;
    const isMatched = rule.patterns.some(pattern => {
      if (typeof pattern === 'string') {
        if (pattern.length <= 4) {
          const rx = new RegExp(`\\b${pattern}\\b`, 'i');
          return rx.test(textBlob);
        }
        return textBlob.includes(pattern);
      }
      return pattern.test(textBlob);
    });

    if (isMatched) {
      if (!rawList.includes(rule.category)) rawList.push(rule.category);
      if (!rawList.includes(rule.topic)) rawList.push(rule.topic);
      if (rule.type && !rawList.includes(rule.type)) rawList.push(rule.type);
    }
  }

  // Include user custom tags if provided
  if (input.customTags && Array.isArray(input.customTags)) {
    rawList.push(...input.customTags);
  }

  // Fallback keyword entity extraction to ensure 3-5 tags
  const cleanTokens = (input.title || input.text || '')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.toLowerCase().trim())
    .filter(w => w.length >= 3 && !BANNED_GENERIC_WORDS.has(w) && !['the', 'and', 'for', 'with', 'from', 'this', 'that', 'here', 'into', 'three', 'minutes', 'seconds'].includes(w));

  for (const tok of cleanTokens) {
    if (rawList.length >= 4) break;
    if (!rawList.includes(tok)) {
      rawList.push(tok);
    }
  }

  if (rawList.length < 3) {
    const platform = (input.platform || 'web').toLowerCase();
    if (platform === 'youtube') rawList.push('youtube', 'video', 'tutorial');
    else if (platform === 'twitter' || platform === 'x') rawList.push('social-media', 'news', 'opinion');
    else if (platform === 'instagram') rawList.push('social-media', 'instagram', 'showcase');
    else if (platform === 'reddit') rawList.push('discussion', 'community', 'guide');
    else rawList.push('resource', 'guide', 'tech');
  }

  const normalized = cleanAndNormalizeTags(rawList);

  return normalized.map((tagName, idx) => ({
    name: tagName,
    color: getTagColor(tagName, idx),
  }));
}

// Master Tag Generation Pipeline
export async function generateAutoTags(input: TagInput, geminiApiKey?: string): Promise<GeneratedTag[]> {
  // 1. Try Gemini AI with fallback models and structured JSON
  const aiTags = await generateGeminiAiTags(input, geminiApiKey);
  if (aiTags && aiTags.length >= 2) {
    return aiTags;
  }

  // 2. High-precision normalized semantic heuristic fallback
  return extractHeuristicTags(input);
}
