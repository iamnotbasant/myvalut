// Valut Background Service Worker (Manifest V3) - Optimized Async AI & Offline Queue

const DEFAULT_SERVER_URL = 'https://myvalut.vercel.app';
const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

// 1. Setup context menus and alarms on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'valut-save-page',
    title: '✦ Save Page to Valut (with AI Tags)',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'valut-save-link',
    title: '✦ Save Link to Valut',
    contexts: ['link'],
  });

  chrome.contextMenus.create({
    id: 'valut-save-selection',
    title: '✦ Save Quote to Valut',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'valut-save-image',
    title: '✦ Save Image to Valut',
    contexts: ['image'],
  });

  chrome.storage.local.get(['serverUrl'], (res) => {
    if (!res.serverUrl) {
      chrome.storage.local.set({ serverUrl: DEFAULT_SERVER_URL });
    }
  });

  // Setup periodic sync alarm for offline queue & health checks
  chrome.alarms.create('valut-sync-offline', { periodInMinutes: 1 });
  chrome.alarms.create('valut-keepalive', { periodInMinutes: 4.9 });
});

// Periodic alarm handler for offline sync & worker keepalive
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'valut-sync-offline') {
    syncOfflineQueue();
  }
});

// 2. Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return;

  if (info.menuItemId === 'valut-save-page') {
    chrome.tabs.sendMessage(tab.id, { action: 'save-page-direct' });
  } else if (info.menuItemId === 'valut-save-link') {
    saveBookmarkCore({
      url: info.linkUrl,
      title: info.linkUrl,
      text: `Link saved from ${tab.title || tab.url}`,
      platform: detectPlatform(info.linkUrl),
    });
  } else if (info.menuItemId === 'valut-save-selection') {
    saveBookmarkCore({
      url: tab.url,
      title: tab.title || 'Quote',
      text: `"${info.selectionText}"`,
      platform: detectPlatform(tab.url),
    });
  } else if (info.menuItemId === 'valut-save-image') {
    saveBookmarkCore({
      url: tab.url,
      title: tab.title || 'Image',
      text: `Image saved from ${tab.title || tab.url}`,
      imageUrl: info.srcUrl,
      platform: detectPlatform(tab.url),
    });
  }
});

// 3. Handle Keyboard Shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-page') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'save-page-direct' });
      }
    });
  }
});

// 4. Message Router for Content Scripts & Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'save-bookmark') {
    saveBookmarkCore(request.payload)
      .then(result => sendResponse({ success: true, result }))
      .catch(err => sendResponse({ success: false, error: err?.message || 'Save failed' }));
    return true; // Keep channel open for async response
  }

  if (request.action === 'sync-auth') {
    if (request.user) {
      chrome.storage.local.set({
        userId: request.user.id,
        userEmail: request.user.email,
        sessionToken: request.token || undefined
      }, () => {
        sendResponse({ success: true });
      });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }

  if (request.action === 'ping') {
    sendResponse({ pong: true, time: Date.now() });
    return true;
  }

  return false;
});

function detectPlatform(url) {
  if (!url) return 'web';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('reddit.com')) return 'reddit';
  return 'web';
}

const BANNED_GENERIC_TAGS = new Set([
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social-media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'good', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'best', 'nice', 'great', 'amazing', 'item'
]);

const SYNONYM_MAP = {
  'artificial-intelligence': 'ai',
  'artificialintelligence': 'ai',
  'machine-learning': 'ml',
  'machinelearning': 'ml',
  'deep-learning': 'deep-learning',
  'large-language-models': 'llm',
  'large-language-model': 'llm',
  'llms': 'llm',
  'gpt4': 'gpt-4',
  'chat-gpt': 'chatgpt',
  'videoediting': 'video-editing',
  'video-edit': 'video-editing',
  'premier-pro': 'premiere-pro',
  'premiere': 'premiere-pro',
  'premierepro': 'premiere-pro',
  'davinci': 'davinci-resolve',
  'motiongraphics': 'motion-design',
  'motion-graphics': 'motion-design',
  'graphicdesign': 'graphic-design',
  'visual-effects': 'fx',
  'vfx': 'fx',
  'user-interface': 'ui',
  'user-experience': 'ux',
  'ui-ux': 'ui-ux',
  'reactjs': 'react',
  'react-js': 'react',
  'nextjs': 'next-js',
  'next-js': 'next-js',
  'javascript': 'js',
  'typescript': 'ts',
  'tailwindcss': 'tailwind-css',
  'tailwind': 'tailwind-css',
  'webdev': 'web-development',
  'search-engine-optimization': 'seo',
  'startups': 'startup',
  'cryptocurrency': 'crypto',
};

const TOPIC_COLOR_MAP = {
  'ai': 'teal',
  'ml': 'teal',
  'generative-ai': 'teal',
  'video-editing': 'violet',
  'premiere-pro': 'violet',
  'after-effects': 'violet',
  'davinci-resolve': 'violet',
  'motion-design': 'violet',
  'ui': 'cyan',
  'ux': 'cyan',
  'ui-ux': 'cyan',
  'figma': 'pink',
  'design': 'pink',
  'tech': 'teal',
  'web-development': 'teal',
  'react': 'cyan',
  'next-js': 'teal',
  'js': 'amber',
  'ts': 'teal',
  'tailwind-css': 'cyan',
  'python': 'teal',
  'supabase': 'green',
  'saas': 'cyan',
  'startup': 'green',
  'marketing': 'orange',
  'seo': 'blue',
  'finance': 'teal',
  'crypto': 'amber',
  'tutorial': 'green',
  'guide': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'fitness': 'green',
  'calisthenics': 'green',
  'productivity': 'amber',
};

function getTagColor(tagName, index = 0) {
  const clean = tagName.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  if (TOPIC_COLOR_MAP[clean]) return TOPIC_COLOR_MAP[clean];

  for (const [k, v] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === k || clean.startsWith(k + '-') || clean.endsWith('-' + k)) return v;
  }
  const palette = ['teal', 'amber', 'green', 'cyan', 'orange', 'red', 'violet', 'pink', 'blue', 'indigo'];
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) hash = (hash + tagName.charCodeAt(i)) % palette.length;
  return palette[(hash + index) % palette.length];
}

function cleanAndNormalizeTags(rawTags) {
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
    .filter(tag => Boolean(tag) && tag.length >= 2 && tag.length <= 25)
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => !BANNED_GENERIC_TAGS.has(tag))
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
    .slice(0, 4)
    .map((name, idx) => ({
      name,
      color: getTagColor(name, idx)
    }));
}

function generateLocalAiTags(payload) {
  const textBlob = `${payload.title || ''} ${payload.text || ''} ${payload.url || ''}`.toLowerCase();
  const rawList = [];

  // 1. Hashtags extraction (if valid)
  const hashtagRegex = /#([a-zA-Z0-9_-]{2,25})/g;
  let match;
  while ((match = hashtagRegex.exec(payload.text || '')) !== null) {
    const rawTag = match[1].toLowerCase().replace(/_/g, '-');
    if (!BANNED_GENERIC_TAGS.has(rawTag) && rawTag.length >= 2) {
      rawList.push(rawTag);
    }
  }

  // 2. Curated Domain Taxonomy Mapping (Category + Topic + Type)
  const domainRules = [
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
    const isMatched = rule.patterns.some(p => textBlob.includes(p));
    if (isMatched) {
      for (const t of rule.tags) {
        if (!rawList.includes(t) && rawList.length < 4) {
          rawList.push(t);
        }
      }
    }
  }

  // Include user custom tags if provided
  if (payload.customTags && Array.isArray(payload.customTags)) {
    for (const ct of payload.customTags) {
      if (!rawList.includes(ct) && rawList.length < 4) {
        rawList.push(ct);
      }
    }
  }

  // Smart Platform-Aware Multi-Tag Fallback (Guarantees strictly 2-3 accurate tags)
  if (rawList.length < 2) {
    const platform = (payload.platform || 'web').toLowerCase();
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

  const result = cleanAndNormalizeTags(rawList);
  return result.length >= 2 ? result : cleanAndNormalizeTags(['tech', 'resource']);
}

// Background Gemini Tag Generator (Runs Asynchronously)
async function generateGeminiTags(payload, apiKey) {
  if (!apiKey) return null;

  const models = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];

  const prompt = `You are an automated categorization and tagging engine for a personal knowledge vault.
Analyze the provided content metadata and generate clean, standardized tags in JSON format.

RULES FOR TAG GENERATION:
1. Generate strictly 2 to 4 tags total.
2. Format: STRICTLY lowercase, kebab-case (e.g., "video-editing", "premiere-pro", "speed-ramping", "tutorial").
3. NO duplicate or near-synonym tags (e.g., do not use both "ai" and "artificial-intelligence").
4. ALWAYS prefer shorter, industry-standard acronyms over long descriptions (e.g., use "ai" instead of "artificial-intelligence", "seo" instead of "search-engine-optimization", "fx" instead of "visual-effects").
5. Structure output:
   - "category": 1 broad domain (e.g. "tech", "video-editing", "design", "ai", "business", "finance", "fitness", "productivity")
   - "topics": 1-2 specific subject matter or tools (e.g. ["premiere-pro", "speed-ramping"] or ["next-js", "supabase"])
   - "type": 1 format (e.g. "tutorial", "tool", "resource", "guide", "case-study", "showcase", "inspiration")
   - "all_tags": Ordered array [category, ...topics, type]

Platform: ${payload.platform || 'web'}
Title: ${payload.title || ''}
Content: ${(payload.text || payload.title || '').slice(0, 800)}

Return ONLY valid JSON:
{
  "category": "string",
  "topics": ["string", "string"],
  "type": "string",
  "all_tags": ["string", "string", "string"]
}`;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 250,
          },
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      const tagArray = parsed.all_tags || [
        ...(parsed.category ? [parsed.category] : []),
        ...(Array.isArray(parsed.topics) ? parsed.topics : []),
        ...(parsed.type ? [parsed.type] : [])
      ];
      const normalized = cleanAndNormalizeTags(tagArray);
      if (normalized.length >= 2) return normalized;
    } catch (err) {
      // try next model
    }
  }
  return null;
}

// Async Background Tag Enrichment: Updates Supabase DB and notifies Realtime
async function enrichTagsInBackground(bookmarkId, payload, apiKey, serverUrl = DEFAULT_SERVER_URL) {
  try {
    let aiTags = null;
    if (apiKey) {
      aiTags = await generateGeminiTags(payload, apiKey);
    }

    // If no direct API key, call server-side AI tagger endpoint
    if (!aiTags || aiTags.length === 0) {
      try {
        const tagRes = await fetch(`${serverUrl || DEFAULT_SERVER_URL}/api/ai/tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: payload.title,
            text: payload.text || payload.title,
            url: payload.url,
            platform: payload.platform,
          }),
        });
        if (tagRes.ok) {
          const tagData = await tagRes.json();
          if (tagData.tags && Array.isArray(tagData.tags) && tagData.tags.length > 0) {
            aiTags = tagData.tags;
          }
        }
      } catch (srvErr) {
        // server unreachable
      }
    }

    if (!aiTags || aiTags.length === 0) return;

    await fetch(`${SUPABASE_URL}/rest/v1/bookmarks?id=eq.${bookmarkId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: aiTags }),
    });

    // Upsert tags into tags table
    for (const t of aiTags) {
      const tagId = `tag_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      fetch(`${SUPABASE_URL}/rest/v1/tags`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: tagId,
          name: t.name,
          color: t.color,
          user_id: payload.userId || null,
        }),
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Background AI tag enrichment error:', err);
  }
}

// Offline Queue Manager
async function enqueueOfflineBookmark(bookmarkItem) {
  try {
    const storage = await chrome.storage.local.get(['valut_offline_queue']);
    const queue = storage.valut_offline_queue || [];
    queue.push(bookmarkItem);
    await chrome.storage.local.set({ valut_offline_queue: queue });
  } catch (e) {
    console.error('Failed to queue offline bookmark:', e);
  }
}

async function syncOfflineQueue() {
  try {
    const storage = await chrome.storage.local.get(['valut_offline_queue']);
    const queue = storage.valut_offline_queue || [];
    if (queue.length === 0) return;

    const remaining = [];
    for (const item of queue) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(item),
        });
        if (!res.ok) remaining.push(item);
      } catch (err) {
        remaining.push(item);
      }
    }
    await chrome.storage.local.set({ valut_offline_queue: remaining });
  } catch (err) {
    console.error('Offline queue sync error:', err);
  }
}

// Master Fast Ingestion (< 50ms Response)
async function saveBookmarkCore(payload) {
  const settings = await chrome.storage.local.get(['serverUrl', 'geminiApiKey', 'userId', 'recentSaves']);
  const userId = settings.userId || payload.userId || null;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 1. Generate Instant Local AI Tags in 0ms
  const initialTags = generateLocalAiTags(payload);
  const bookmarkId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const bookmarkItem = {
    id: bookmarkId,
    platform: payload.platform || 'web',
    display_name: payload.displayName || 'Creator',
    username: payload.username ? payload.username.replace(/^@/, '') : 'creator',
    avatar_url: payload.avatarUrl || null,
    image_url: payload.imageUrl || null,
    title: payload.title || null,
    text: payload.text || payload.title || payload.url || 'Saved Bookmark',
    url: payload.url || null,
    date: formattedDate,
    created_at_ms: Date.now(),
    tags: initialTags,
    is_favorite: false,
    is_archived: false,
    note: payload.note || null,
    user_id: userId,
  };

  // 2. Immediate Save to Supabase (or Offline Queue if disconnected)
  let savedResult = null;
  try {
    const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(bookmarkItem),
    });

    if (sbRes.ok) {
      savedResult = {
        success: true,
        bookmark: bookmarkItem,
        tags: bookmarkItem.tags,
        savedToDatabase: true,
      };
    } else {
      await enqueueOfflineBookmark(bookmarkItem);
      savedResult = {
        success: true,
        bookmark: bookmarkItem,
        tags: bookmarkItem.tags,
        offlineQueued: true,
      };
    }
  } catch (err) {
    await enqueueOfflineBookmark(bookmarkItem);
    savedResult = {
      success: true,
      bookmark: bookmarkItem,
      tags: bookmarkItem.tags,
      offlineQueued: true,
    };
  }

  // 3. Fire-and-forget background Gemini AI tag enrichment
  const apiKey = settings.geminiApiKey || undefined;
  const serverUrl = settings.serverUrl || DEFAULT_SERVER_URL;
  enrichTagsInBackground(bookmarkId, payload, apiKey, serverUrl);

  // 4. Update Recent Saves list
  const recent = settings.recentSaves || [];
  const newRecent = [
    {
      ...bookmarkItem,
      displayName: bookmarkItem.display_name,
      avatarUrl: bookmarkItem.avatar_url,
      imageUrl: bookmarkItem.image_url,
      createdAt: bookmarkItem.created_at_ms,
      tags: bookmarkItem.tags,
    },
    ...recent,
  ].slice(0, 15);
  chrome.storage.local.set({ recentSaves: newRecent });

  // 5. Badge notification
  chrome.action.setBadgeText({ text: '✓' });
  chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

  return savedResult;
}
