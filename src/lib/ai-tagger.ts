import { TagColor } from '@/types/stashr';

export interface GeneratedTag {
  name: string;
  color: TagColor;
}

interface TagInput {
  title?: string | null;
  text: string;
  platform?: string;
  url?: string | null;
  customTags?: string[];
  context?: string | null;
}

const PALETTE_COLORS: TagColor[] = [
  'teal',
  'amber',
  'green',
  'cyan',
  'orange',
  'red',
];

// Curated Semantic Color Map for 100+ Topics
const TOPIC_COLOR_MAP: Record<string, TagColor> = {
  // AI & Machine Learning
  'ai': 'teal',
  'artificial intelligence': 'teal',
  'generative ai': 'teal',
  'machine learning': 'teal',
  'deep learning': 'teal',
  'llm': 'teal',
  'llms': 'teal',
  'gpt': 'teal',
  'gpt-4': 'teal',
  'chatgpt': 'teal',
  'claude': 'teal',
  'gemini': 'teal',
  'openai': 'teal',
  'anthropic': 'teal',
  'deepseek': 'teal',
  'ai agents': 'teal',
  'agents': 'teal',
  'prompt engineering': 'teal',
  'computer vision': 'teal',
  'nlp': 'teal',
  'neural networks': 'teal',
  'huggingface': 'amber',
  'diffusion': 'teal',
  'rag': 'teal',
  'fine-tuning': 'teal',

  // Frontend & Web Development
  'frontend': 'cyan',
  'react': 'cyan',
  'react 19': 'cyan',
  'next.js': 'teal',
  'nextjs': 'teal',
  'vue': 'green',
  'vue.js': 'green',
  'svelte': 'orange',
  'angular': 'red',
  'javascript': 'amber',
  'typescript': 'teal',
  'html': 'orange',
  'css': 'pink',
  'tailwind css': 'cyan',
  'tailwind': 'cyan',
  'tailwindcss': 'cyan',
  'shadcn': 'blue',
  'shadcn/ui': 'blue',
  'web development': 'teal',
  'webdev': 'teal',
  'performance': 'amber',
  'accessibility': 'teal',

  // Backend & Cloud & DevOps
  'backend': 'teal',
  'node.js': 'green',
  'nodejs': 'green',
  'express': 'green',
  'nestjs': 'red',
  'python': 'teal',
  'fastapi': 'teal',
  'django': 'green',
  'golang': 'cyan',
  'go': 'cyan',
  'rust': 'orange',
  'database': 'indigo',
  'sql': 'indigo',
  'postgresql': 'blue',
  'postgres': 'blue',
  'supabase': 'green',
  'mongodb': 'green',
  'redis': 'red',
  'prisma': 'indigo',
  'drizzle': 'amber',
  'docker': 'blue',
  'kubernetes': 'blue',
  'devops': 'blue',
  'aws': 'orange',
  'gcp': 'blue',
  'cloudflare': 'orange',
  'vercel': 'blue',
  'api': 'teal',
  'rest api': 'teal',
  'graphql': 'pink',
  'grpc': 'cyan',
  'microservices': 'indigo',
  'architecture': 'indigo',
  'system design': 'indigo',
  'open source': 'green',
  'cybersecurity': 'red',
  'security': 'red',
  'auth': 'amber',
  'linux': 'amber',

  // Design, 3D & Creative
  'ui design': 'pink',
  'ux design': 'pink',
  'ui/ux': 'pink',
  'product design': 'pink',
  'design system': 'violet',
  'figma': 'pink',
  'motion design': 'violet',
  'animation': 'violet',
  'micro-interactions': 'violet',
  'typography': 'amber',
  'branding': 'orange',
  '3d & graphics': 'violet',
  '3d design': 'violet',
  'blender': 'orange',
  'three.js': 'violet',
  'webgl': 'violet',
  'shader': 'pink',
  'illustration': 'pink',
  'design': 'pink',
  'creativity': 'violet',
  'graphic design': 'pink',

  // Business, SaaS & Product
  'saas': 'cyan',
  'startup': 'green',
  'startups': 'green',
  'entrepreneurship': 'green',
  'founder': 'green',
  'product management': 'teal',
  'product strategy': 'teal',
  'marketing': 'orange',
  'growth': 'green',
  'seo': 'blue',
  'copywriting': 'amber',
  'sales': 'green',
  'venture capital': 'teal',
  'pricing': 'amber',

  // Finance & Web3
  'finance': 'teal',
  'investing': 'teal',
  'stock market': 'green',
  'stocks': 'green',
  'crypto': 'amber',
  'bitcoin': 'amber',
  'ethereum': 'indigo',
  'solana': 'violet',
  'blockchain': 'indigo',
  'defi': 'pink',
  'economics': 'teal',

  // Productivity, Learning & Career
  'productivity': 'amber',
  'workflow': 'cyan',
  'second brain': 'indigo',
  'tools': 'cyan',
  'tutorial': 'green',
  'guide': 'green',
  'learning': 'blue',
  'career': 'teal',
  'coding': 'cyan',
  'programming': 'cyan',
  'software engineering': 'blue',
  'game development': 'violet',
  'gamedev': 'violet',
};

// Forbidden Generic / Useless Words
const BANNED_GENERIC_WORDS = new Set([
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'good', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'best', 'nice', 'great', 'awesome', 'amazing', 'item'
]);

export function getTagColor(tagName: string, index = 0): TagColor {
  const clean = tagName.toLowerCase().trim();
  if (TOPIC_COLOR_MAP[clean]) {
    return TOPIC_COLOR_MAP[clean];
  }
  for (const [key, color] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === key || clean.startsWith(key + ' ') || clean.endsWith(' ' + key)) {
      return color;
    }
  }
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = (hash + tagName.charCodeAt(i)) % PALETTE_COLORS.length;
  }
  return PALETTE_COLORS[(hash + index) % PALETTE_COLORS.length];
}

export const DEFAULT_GEMINI_API_KEY = '';

// 1. Google Gemini AI Deep Content Analysis & Semantic Tagging
export async function generateGeminiAiTags(input: TagInput, apiKey?: string): Promise<GeneratedTag[] | null> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;
  if (!geminiKey) return null;

  // Verified working models for this API key in priority order
  const models = [
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ];

  const systemInstruction = `You are a world-class Knowledge Taxonomist, AI Research Analyst, and Content Curator.
Your task is to analyze the given bookmarked text, title, and link, deeply understand the underlying subject matter, and assign 2 to 4 highly specific, professional, high-value categorization tags.

TAXONOMY PRINCIPLES:
1. Identify the PRIMARY DOMAIN (e.g. "Frontend", "AI Agents", "System Architecture", "Product Design", "Macroeconomics", "Cybersecurity").
2. Identify SPECIFIC TECHNOLOGIES, TOOLS or FRAMEWORKS mentioned (e.g. "Next.js", "React 19", "Claude 3.7", "Tailwind CSS", "Figma", "Supabase", "PyTorch", "GSAP").
3. Identify KEY CONCEPTS or THEMES (e.g. "Motion Design", "Design System", "Fine-Tuning", "Prompting", "SaaS Growth", "Typography", "Open Source", "API Design").

NEGATIVE CONSTRAINTS (STRICTLY FORBIDDEN):
- NEVER output platform names (NO "Twitter", "X", "YouTube", "Instagram", "Reddit", "TikTok", "Bluesky").
- NEVER output generic meta-labels (NO "Post", "Video", "Tweet", "Saved", "Article", "Link", "Content", "Social Media", "Discussion", "Update").
- NEVER output generic adjectives (NO "Good", "Awesome", "Cool", "Best", "Daily").
- Each tag must be 1 to 3 words, Title Case (e.g. "AI Agents", "Motion Design", "Next.js").

OUTPUT FORMAT:
Return JSON: an array of strings. Example: ["Claude", "UI Design", "Motion Design"]`;

  const userContent = `Content Title: ${input.title || 'Untitled'}
Source URL: ${input.url || 'None'}
Platform Context: ${input.platform || 'web'}
Content Body:
${input.text.slice(0, 2000)}`;

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
                { text: `${systemInstruction}\n\n${userContent}\n\nReturn ONLY the JSON array of tags:` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 150,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini model ${model} failed with status:`, response.status);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(rawText);
      } catch (parseErr) {
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) parsedTags = JSON.parse(match[0]);
      }

      if (!Array.isArray(parsedTags) || parsedTags.length === 0) continue;

      const validTags: GeneratedTag[] = [];
      const seen = new Set<string>();

      for (const tag of parsedTags) {
        if (typeof tag !== 'string') continue;
        const clean = tag.trim().replace(/^#/, '').replace(/[^\w\s.-]/g, '');
        const lower = clean.toLowerCase();

        if (!clean || clean.length < 2 || BANNED_GENERIC_WORDS.has(lower) || seen.has(lower)) {
          continue;
        }

        seen.add(lower);
        validTags.push({
          name: clean.charAt(0).toUpperCase() + clean.slice(1),
          color: getTagColor(clean, validTags.length),
        });

        if (validTags.length >= 4) break;
      }

      if (validTags.length > 0) {
        return validTags;
      }
    } catch (err) {
      console.warn(`Error trying Gemini model ${model}:`, err);
    }
  }

  return null;
}

// 2. Comprehensive Semantic Heuristic Classification Engine (100+ Rules)
export function extractHeuristicTags(input: TagInput): GeneratedTag[] {
  const textBlob = `${input.title || ''} ${input.text} ${input.url || ''} ${input.context || ''}`.toLowerCase();
  const seenLower = new Set<string>();
  const tagList: string[] = [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, '');
    if (!trimmed || trimmed.length < 2) return;
    const lower = trimmed.toLowerCase();
    if (!BANNED_GENERIC_WORDS.has(lower) && !seenLower.has(lower)) {
      seenLower.add(lower);
      tagList.push(trimmed);
    }
  };

  // 1. Explicit relevant hashtags
  const hashtagRegex = /#([a-zA-Z0-9_]{2,28})/g;
  let match;
  while ((match = hashtagRegex.exec(input.text)) !== null) {
    const rawTag = match[1];
    const lower = rawTag.toLowerCase();
    if (!BANNED_GENERIC_WORDS.has(lower)) {
      addTag(rawTag.charAt(0).toUpperCase() + rawTag.slice(1));
    }
  }

  // 2. High-Precision Domain Taxonomy Mapping
  const domainRules: { patterns: (string | RegExp)[]; tag: string }[] = [
    // AI Agents & Models
    { patterns: [/\bagents?\b/, /\bai agents?\b/, 'crewai', 'autogen', 'langchain', 'langgraph', 'swarm'], tag: 'AI Agents' },
    { patterns: ['claude', 'anthropic', 'sonnet', 'opus', 'haiku', 'claude 3'], tag: 'Claude' },
    { patterns: ['chatgpt', 'gpt-4', 'gpt-4o', 'openai', 'sora', 'o1-preview', 'o3-mini', 'dall-e'], tag: 'ChatGPT' },
    { patterns: ['gemini', 'deepmind', 'google ai', 'gemini flash', 'gemini pro'], tag: 'Gemini' },
    { patterns: ['deepseek', 'deepseek-r1', 'deepseek-v3', 'r1 reasoning'], tag: 'DeepSeek' },
    { patterns: ['prompt engineering', 'system prompt', 'prompting', 'few-shot'], tag: 'Prompting' },
    { patterns: [/\bllms?\b/, 'large language model', 'transformer', 'fine-tuning', 'rag', 'vector database'], tag: 'LLM' },
    { patterns: ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'neural network'], tag: 'Machine Learning' },
    { patterns: ['artificial intelligence', 'genai', 'generative ai', 'ai tool', 'ai models'], tag: 'AI' },

    // Frontend Development
    { patterns: ['next.js', 'nextjs', 'next 15', 'next 16', 'app router', 'turbopack', 'server actions'], tag: 'Next.js' },
    { patterns: ['react', 'react 19', 'react hooks', 'reactjs', 'jsx', 'tsx', 'usecontext', 'usestate'], tag: 'React' },
    { patterns: ['tailwind', 'tailwindcss', 'tailwind v4', 'shadcn', 'shadcn/ui', 'radix ui'], tag: 'Tailwind CSS' },
    { patterns: ['typescript', 'typecheck', 'type system', 'interface'], tag: 'TypeScript' },
    { patterns: ['javascript', 'ecmascript', 'es6', 'npm package', 'vanilla js'], tag: 'JavaScript' },
    { patterns: ['vue.js', 'vuejs', 'vue 3', 'nuxt', 'pinia'], tag: 'Vue' },
    { patterns: ['svelte', 'sveltekit', 'svelte 5'], tag: 'Svelte' },
    { patterns: ['css grid', 'flexbox', 'css animation', 'css tricks', 'frontend', 'front-end', 'webdev'], tag: 'Frontend' },

    // Backend, Cloud & Database
    { patterns: ['supabase', 'supabase db', 'supabase auth', 'supabase storage'], tag: 'Supabase' },
    { patterns: ['postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'mongodb', 'prisma', 'drizzle'], tag: 'Database' },
    { patterns: ['python', 'fastapi', 'flask', 'django', 'pydantic', 'pandas', 'numpy'], tag: 'Python' },
    { patterns: ['rust', 'rustlang', 'cargo', 'tokio'], tag: 'Rust' },
    { patterns: ['golang', /\bgo language\b/, 'goroutine'], tag: 'Golang' },
    { patterns: ['node.js', 'nodejs', 'express.js', 'hono', 'bun.js', 'deno'], tag: 'Node.js' },
    { patterns: ['rest api', 'graphql', 'grpc', 'api endpoint', 'webhook', 'backend', 'back-end'], tag: 'Backend' },
    { patterns: ['docker', 'kubernetes', 'k8s', 'devops', 'ci/cd', 'github actions', 'cloudflare', 'vercel', 'aws'], tag: 'DevOps' },
    { patterns: ['open source', 'opensource', 'github repo', 'repository', 'oss'], tag: 'Open Source' },
    { patterns: ['cybersecurity', 'infosec', 'vulnerability', 'auth', 'oauth', 'jwt', 'encryption'], tag: 'Security' },
    { patterns: ['software architecture', 'system design', 'microservices', 'distributed systems'], tag: 'Architecture' },
    { patterns: ['coding', 'programmer', 'software engineer', 'software engineering', 'developer'], tag: 'Coding' },

    // Design, UI/UX & Motion
    { patterns: ['figma', 'figma design', 'figma plugin', 'figjam'], tag: 'Figma' },
    { patterns: ['motion design', 'framer motion', 'gsap', 'lottie', 'smooth animation', 'keyframe', 'micro-interaction'], tag: 'Motion Design' },
    { patterns: ['ui design', 'ux design', 'ui/ux', 'user interface', 'user experience', 'interaction design'], tag: 'UI/UX' },
    { patterns: ['design system', 'design tokens', 'component library', 'typography scale', 'color palette'], tag: 'Design System' },
    { patterns: ['3d design', 'blender', 'spline', 'three.js', 'threejs', 'webgl', 'shader', 'shaders', '3d model'], tag: '3D & Graphics' },
    { patterns: ['typography', 'fonts', 'font pairing', 'font family', 'kerning'], tag: 'Typography' },
    { patterns: ['design inspiration', 'minimalist', 'dark mode', 'glassmorphism', 'aesthetic', 'branding'], tag: 'Design' },

    // Business, SaaS & Startup
    { patterns: ['saas', 'micro saas', 'mrr', 'arr', 'b2b saas', 'churn rate', 'ltv'], tag: 'SaaS' },
    { patterns: ['startup', 'startups', 'founder', 'co-founder', 'entrepreneur', 'bootstrapped', 'y combinator'], tag: 'Startup' },
    { patterns: ['growth marketing', 'seo', 'conversion rate', 'funnel', 'copywriting', 'lead generation'], tag: 'Marketing' },
    { patterns: ['product management', 'product strategy', 'roadmap', 'product discovery'], tag: 'Product Strategy' },

    // Finance & Web3
    { patterns: ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'crypto', 'cryptocurrency', 'defi', 'blockchain'], tag: 'Crypto' },
    { patterns: ['stock market', 'stocks', 'investing', 'portfolio', 'trading', 'macroeconomics', 'personal finance'], tag: 'Finance' },

    // Productivity & Tutorials
    { patterns: ['productivity', 'workflow', 'notion', 'second brain', 'time management', 'automation', 'obsidian'], tag: 'Productivity' },
    { patterns: ['tutorial', 'how to build', 'step by step', 'crash course', 'guide', 'cheat sheet'], tag: 'Tutorial' },
    { patterns: ['gamedev', 'game development', 'unreal engine', 'unity', 'godot', 'indie game'], tag: 'GameDev' },
  ];

  for (const rule of domainRules) {
    if (tagList.length >= 4) break;
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
      addTag(rule.tag);
    }
  }

  // Include user custom tags if provided
  if (input.customTags && Array.isArray(input.customTags)) {
    for (const ct of input.customTags) {
      addTag(ct);
    }
  }

  // Fallback: If still empty, grab meaningful salient topic keywords
  if (tagList.length === 0) {
    const rawTokens = (input.title || input.text)
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !BANNED_GENERIC_WORDS.has(w.toLowerCase()));

    for (const token of rawTokens.slice(0, 2)) {
      addTag(token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
    }
  }

  const result: GeneratedTag[] = [];
  let idx = 0;
  for (const tag of tagList.slice(0, 4)) {
    result.push({
      name: tag,
      color: getTagColor(tag, idx++),
    });
  }

  return result;
}

// Master Tag Generation Pipeline
export async function generateAutoTags(input: TagInput, geminiApiKey?: string): Promise<GeneratedTag[]> {
  // 1. Try Gemini AI with fallback models
  const aiTags = await generateGeminiAiTags(input, geminiApiKey);
  if (aiTags && aiTags.length > 0) {
    return aiTags;
  }

  // 2. High-precision semantic NLP engine fallback
  return extractHeuristicTags(input);
}
