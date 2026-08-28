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
        tag.length <= 25 &&
        !BANNED_GENERIC_WORDS.has(tag) &&
        self.indexOf(tag) === index
      );
    })
    .slice(0, 4); // Max 4 tags for clean UI/DB
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
1. Generate strictly 2 to 4 tags total.
2. Format: STRICTLY lowercase, kebab-case (e.g., "video-editing", "premiere-pro", "speed-ramping", "tutorial").
3. NO duplicate or near-synonym tags (e.g., do not use both "ai" and "artificial-intelligence").
4. ALWAYS prefer shorter, industry-standard acronyms over long descriptions (e.g., use "ai" instead of "artificial-intelligence", "seo" instead of "search-engine-optimization", "fx" instead of "visual-effects").
5. Structure output:
   - "category": 1 broad domain (e.g. "tech", "video-editing", "design", "ai", "business", "finance", "fitness", "productivity")
   - "topics": 1-2 specific subject matter or tools (e.g. ["premiere-pro", "speed-ramping"] or ["next-js", "supabase"] or ["ui", "figma"])
   - "type": 1 nature/format (e.g. "tutorial", "tool", "resource", "guide", "case-study", "showcase", "inspiration")
   - "all_tags": Ordered combined array: [category, ...topics, type]

Platform: ${input.platform || 'web'}
Title: ${input.title || ''}
Content: ${(input.text || input.title || '').slice(0, 800)}

Return JSON ONLY:
{
  "category": "string",
  "topics": ["string", "string"],
  "type": "string",
  "all_tags": ["string", "string", "string"]
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
      } catch {
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            rawTagList = JSON.parse(match[0]);
          } catch {}
        }
      }

      const normalizedTagStrings = cleanAndNormalizeTags(rawTagList);

      if (normalizedTagStrings.length >= 2) {
        return normalizedTagStrings.map((tagName, idx) => ({
          name: tagName,
          color: getTagColor(tagName, idx),
        }));
      }
    } catch {
      // try next model
    }
  }

  return null;
}

// 5. Semantic Heuristic Fallback Engine (Strictly Curated Taxonomy, No Random Words)
export function extractHeuristicTags(input: TagInput): GeneratedTag[] {
  const textBlob = `${input.title || ''} ${input.text} ${input.url || ''} ${input.context || ''}`.toLowerCase();
  const rawList: string[] = [];

  // Hashtags extraction (only if valid kebab-tag)
  const hashtagRegex = /#([a-zA-Z0-9_-]{2,25})/g;
  let match;
  while ((match = hashtagRegex.exec(input.text)) !== null) {
    const rawTag = match[1].toLowerCase().replace(/_/g, '-');
    if (!BANNED_GENERIC_WORDS.has(rawTag) && rawTag.length >= 2) {
      rawList.push(rawTag);
    }
  }

  // Curated Domain Taxonomy Mapping (Category + Topic + Type)
  const domainRules: { patterns: (string | RegExp)[]; tags: string[] }[] = [
    // Video Editing & Animation
    { patterns: ['premiere pro', 'premiere', 'video edit', 'video editing', 'davinci resolve', 'davinci', 'capcut', 'after effects', 'speed ramp', 'speed ramping', 'color grading', 'lut', 'transition', 'b-roll', 'timeline edit'], tags: ['video-editing', 'premiere-pro', 'tutorial'] },
    { patterns: ['motion design', 'motion graphics', 'framer motion', 'gsap', 'lottie', 'rive', '2d animation', '3d animation', 'smooth animation', 'keyframe'], tags: ['motion-design', 'animation', 'resource'] },
    { patterns: ['thumbnail', 'photo editing', 'photoshop', 'lightroom', 'retouching', 'poster design', 'graphic design'], tags: ['graphic-design', 'photo-editing', 'design-inspiration'] },

    // Design, UI & UX
    { patterns: ['ui design', 'ux design', 'ui/ux', 'user interface', 'user experience', 'figma', 'figjam', 'wireframe', 'prototype', 'ui component', 'dark mode', 'design system', 'design tokens', 'typography', 'landing page design', 'hero section', 'web design'], tags: ['ui', 'ux', 'design-inspiration'] },
    { patterns: ['3d design', 'blender', 'three.js', 'webgl', 'spline', 'cinema 4d', 'render'], tags: ['design', '3d-design', 'resource'] },

    // AI, LLMs & Agents
    { patterns: ['claude opus', 'claude sonnet', 'claude', 'anthropic', 'chatgpt', 'gpt-4', 'openai', 'gemini', 'deepseek', 'deepseek-r1', 'llm', 'large language model', 'prompt engineering', 'system prompt', 'prompting', 'ai agent', 'agents', 'crewai', 'langchain', 'langgraph', 'generative ai', 'genai', 'cursor ai', 'v0.dev', 'copilot'], tags: ['ai', 'prompt-engineering', 'tool'] },
    { patterns: ['machine learning', 'deep learning', 'neural network', 'pytorch', 'tensorflow', 'model weights', 'rag', 'vector database'], tags: ['ai', 'ml', 'guide'] },

    // Web Development & Frontend
    { patterns: ['next.js', 'nextjs', 'react 19', 'react hooks', 'reactjs', 'react', 'tailwind css', 'tailwindcss', 'shadcn', 'shadcn/ui', 'radix', 'frontend', 'webdev', 'typescript', 'javascript', 'css grid', 'flexbox', 'html5', 'responsive design'], tags: ['tech', 'web-development', 'react'] },
    { patterns: ['vue', 'vuejs', 'svelte', 'sveltekit', 'astro', 'remix', 'angular', 'vite'], tags: ['tech', 'web-development', 'framework'] },

    // Backend, Database & Cloud
    { patterns: ['supabase', 'postgresql', 'postgres', 'sqlite', 'prisma', 'drizzle', 'database', 'sql', 'backend', 'api', 'rest api', 'graphql'], tags: ['tech', 'supabase', 'tool'] },
    { patterns: ['python', 'fastapi', 'flask', 'django', 'rust', 'golang', 'node.js', 'nodejs', 'bun', 'deno'], tags: ['tech', 'backend', 'tutorial'] },
    { patterns: ['docker', 'kubernetes', 'devops', 'aws', 'gcp', 'cloudflare', 'vercel', 'deploy', 'ci/cd'], tags: ['tech', 'devops', 'resource'] },
    { patterns: ['github', 'open source', 'opensource', 'git repo', 'repository'], tags: ['open-source', 'github', 'resource'] },

    // Business, SaaS & Marketing
    { patterns: ['micro saas', 'saas', 'mrr', 'arr', 'bootstrapped', 'indie hacker', 'build in public', 'launching', 'product hunt'], tags: ['saas', 'startup', 'case-study'] },
    { patterns: ['marketing', 'seo', 'conversion rate', 'copywriting', 'growth hack', 'distribution', 'audience'], tags: ['marketing', 'seo', 'guide'] },
    { patterns: ['crypto', 'bitcoin', 'ethereum', 'solana', 'investing', 'trading', 'stocks', 'personal finance'], tags: ['finance', 'crypto', 'news'] },

    // Productivity & Fitness
    { patterns: ['calisthenics', 'bodyweight', 'pullups', 'pushups', 'workout', 'fitness', 'gym'], tags: ['fitness', 'calisthenics', 'tutorial'] },
    { patterns: ['productivity', 'workflow', 'notion', 'second brain', 'obsidian', 'time management', 'automation'], tags: ['productivity', 'workflow', 'tool'] },
    { patterns: ['gta 6', 'gta6', 'gta', 'gaming', 'playstation', 'ps5', 'xbox', 'steam', 'gameplay'], tags: ['gaming', 'trailer', 'showcase'] },
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
      for (const t of rule.tags) {
        if (!rawList.includes(t) && rawList.length < 4) {
          rawList.push(t);
        }
      }
    }
  }

  // Include user custom tags if provided
  if (input.customTags && Array.isArray(input.customTags)) {
    for (const ct of input.customTags) {
      if (!rawList.includes(ct) && rawList.length < 4) {
        rawList.push(ct);
      }
    }
  }

  // Platform-Aware Smart Multi-Tag Fallback (Guarantees strictly 2-3 accurate tags)
  if (rawList.length < 2) {
    const platform = (input.platform || 'web').toLowerCase();
    if (platform === 'youtube') {
      rawList.push('video-editing', 'tutorial', 'resource');
    } else if (platform === 'instagram' || platform === 'reels') {
      rawList.push('design-inspiration', 'photo-editing', 'showcase');
    } else if (platform === 'twitter' || platform === 'x' || platform === 'threads') {
      rawList.push('tech', 'web-development', 'resource');
    } else if (platform === 'reddit') {
      rawList.push('tech', 'open-source', 'guide');
    } else if (platform === 'tiktok') {
      rawList.push('motion-design', 'video-editing', 'showcase');
    } else {
      rawList.push('tech', 'resource', 'guide');
    }
  }

  const normalized = cleanAndNormalizeTags(rawList);

  // Fallback safety to guarantee at least 2 tags
  const safeList = normalized.length >= 2 ? normalized : ['tech', 'resource'];

  return safeList.slice(0, 4).map((tagName, idx) => ({
    name: tagName,
    color: getTagColor(tagName, idx),
  }));
}

// Master Tag Generation Pipeline
export async function generateAutoTags(input: TagInput, geminiApiKey?: string): Promise<GeneratedTag[]> {
  // 1. Try Gemini AI with fallback models and structured JSON
  const aiTags = await generateGeminiAiTags(input, geminiApiKey);
  if (aiTags && aiTags.length >= 2) {
    return aiTags.slice(0, 4);
  }

  // 2. High-precision normalized semantic heuristic fallback
  return extractHeuristicTags(input);
}
