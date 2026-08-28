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
  'stuff', 'thing', 'things', 'best', 'nice', 'great', 'amazing', 'item', 'bookmark'
]);

const SYNONYM_MAP = {
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
  'ai-agent': 'ai-agents',
  'prompting': 'prompt-engineering',

  // Video & Motion
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
  'motiongraphics': 'motion-design',
  'motion-graphics': 'motion-design',
  'graphicdesign': 'graphic-design',
  'visual-effects': 'fx',
  'vfx': 'fx',
  'speed-ramp': 'speed-ramping',
  'color-grading': 'color-grade',

  // Coding & Design
  'user-interface': 'ui',
  'user-experience': 'ux',
  'ui-ux': 'ui-ux',
  'uiux': 'ui-ux',
  'reactjs': 'react',
  'react-js': 'react',
  'nextjs': 'next-js',
  'next-js': 'next-js',
  'javascript': 'js',
  'typescript': 'ts',
  'tailwindcss': 'tailwind-css',
  'tailwind': 'tailwind-css',
  'shadcn-ui': 'shadcn',
  'webdev': 'web-development',
  'web-dev': 'web-development',
  'node-js': 'nodejs',
  'postgres': 'postgresql',
  'open-source-software': 'open-source',
  'opensource': 'open-source',
  'search-engine-optimization': 'seo',

  // Fitness & Business
  'bodyweight-training': 'calisthenics',
  'bodyweight': 'calisthenics',
  'personal-finance': 'finance',
  'cryptocurrency': 'crypto',
  'startups': 'startup',
  'micro-saas': 'saas',
};

const TOPIC_COLOR_MAP = {
  'tech': 'teal',
  'video-editing': 'violet',
  'design': 'pink',
  'finance': 'teal',
  'fitness': 'green',
  'business': 'cyan',
  'marketing': 'orange',
  'productivity': 'amber',
  'gaming': 'indigo',
  'ai': 'teal',
  'ml': 'teal',
  'generative-ai': 'teal',
  'premiere-pro': 'violet',
  'after-effects': 'violet',
  'davinci-resolve': 'violet',
  'capcut': 'violet',
  'motion-design': 'violet',
  'fx': 'violet',
  'speed-ramping': 'violet',
  'color-grade': 'violet',
  'ui': 'cyan',
  'ux': 'cyan',
  'ui-ux': 'cyan',
  'figma': 'pink',
  'web-development': 'teal',
  'react': 'cyan',
  'next-js': 'teal',
  'js': 'amber',
  'ts': 'teal',
  'tailwind-css': 'cyan',
  'shadcn': 'blue',
  'python': 'teal',
  'supabase': 'green',
  'saas': 'cyan',
  'startup': 'green',
  'seo': 'blue',
  'crypto': 'amber',
  'tutorial': 'green',
  'guide': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'calisthenics': 'green',
};

function getTagColor(tagName, index = 0) {
  const clean = tagName.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  if (TOPIC_COLOR_MAP[clean]) return TOPIC_COLOR_MAP[clean];

  for (const [k, v] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === k || clean.startsWith(k + '-') || clean.endsWith('-' + k)) return v;
  }
  const palette = ['teal', 'violet', 'cyan', 'green', 'amber', 'pink', 'orange', 'blue', 'indigo', 'red'];
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) hash = (hash + tagName.charCodeAt(i)) % palette.length;
  return palette[(hash + index) % palette.length];
}

function cleanAndNormalizeTags(rawTags) {
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
    .filter(tag => Boolean(tag) && tag.length >= 2 && tag.length <= 25)
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => !BANNED_GENERIC_TAGS.has(tag))
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
    .slice(0, 5);

  return cleaned.map((name, idx) => ({
    name,
    color: getTagColor(name, idx)
  }));
}

// Preprocess Platform Raw Input (High Signal Truncation)
function preprocessPlatformInput(payload) {
  const platform = (payload.platform || 'web').toLowerCase();
  const rawText = payload.text || '';
  const title = payload.title ? `Title: ${payload.title.trim()}\n` : '';
  const context = payload.context ? payload.context.trim() : '';

  switch (platform) {
    case 'youtube': {
      const descPart = rawText.slice(0, 500);
      const transcriptWords = context ? context.split(/\s+/).slice(0, 200).join(' ') : '';
      const transcriptPart = transcriptWords ? `\nTranscript: ${transcriptWords}` : '';
      return `${title}Description: ${descPart}${transcriptPart}`.trim().slice(0, 1000);
    }
    case 'instagram':
    case 'reels':
    case 'tiktok': {
      const caption = rawText.slice(0, 400);
      const audioText = context ? `\nAudio Transcript: ${context.slice(0, 150)}` : '';
      return `${title}Caption: ${caption}${audioText}`.trim().slice(0, 500);
    }
    case 'twitter':
    case 'x':
    case 'threads':
    case 'bluesky': {
      const quoteText = context ? `\nQuoted Tweet: ${context.slice(0, 250)}` : '';
      return `${title}Tweet: ${rawText}${quoteText}`.trim().slice(0, 500);
    }
    case 'reddit': {
      return `${title}Post Body: ${rawText}`.trim().slice(0, 1000);
    }
    case 'web':
    default: {
      return `${title}Content: ${rawText}`.trim().slice(0, 1200);
    }
  }
}

function hasPattern(text, pattern) {
  if (pattern.length <= 4) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return rx.test(text);
  }
  return text.includes(pattern);
}

// Local Semantic AI Classifier (Strict 3-5 Standardized Tags: 1 Category + 2-3 Topics + 1 Type)
function generateLocalAiTags(payload) {
  const textBlob = `${payload.title || ''} ${payload.text || ''} ${payload.url || ''} ${payload.context || ''}`.toLowerCase();
  
  let detectedCategory = null;
  const detectedTopics = [];
  let detectedType = null;

  // 1. Hashtags
  const hashtagRegex = /#([a-zA-Z0-9_-]{2,25})/g;
  let match;
  while ((match = hashtagRegex.exec(payload.text || '')) !== null) {
    const rawTag = match[1].toLowerCase().replace(/_/g, '-');
    const normalized = SYNONYM_MAP[rawTag] || rawTag;
    if (!BANNED_GENERIC_TAGS.has(normalized) && normalized.length >= 2 && !detectedTopics.includes(normalized)) {
      detectedTopics.push(normalized);
    }
  }

  // 2. Domain Taxonomy
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
    if (hasPattern(textBlob, 'fx') || hasPattern(textBlob, 'vfx')) detectedTopics.push('fx');
  } else if (
    hasPattern(textBlob, 'calisthenics') ||
    hasPattern(textBlob, 'bodyweight') ||
    hasPattern(textBlob, 'pullup') ||
    hasPattern(textBlob, 'pushup') ||
    hasPattern(textBlob, 'workout') ||
    hasPattern(textBlob, 'fitness') ||
    hasPattern(textBlob, 'gym')
  ) {
    detectedCategory = 'fitness';
    if (hasPattern(textBlob, 'calisthenics') || hasPattern(textBlob, 'bodyweight') || hasPattern(textBlob, 'pullup')) {
      detectedTopics.push('calisthenics');
    }
  } else if (
    hasPattern(textBlob, 'claude') ||
    hasPattern(textBlob, 'chatgpt') ||
    hasPattern(textBlob, 'gpt-4') ||
    hasPattern(textBlob, 'openai') ||
    hasPattern(textBlob, 'gemini') ||
    hasPattern(textBlob, 'deepseek') ||
    hasPattern(textBlob, 'llm') ||
    hasPattern(textBlob, 'prompt') ||
    hasPattern(textBlob, 'prompting') ||
    hasPattern(textBlob, 'agent') ||
    hasPattern(textBlob, 'generative ai') ||
    hasPattern(textBlob, 'genai') ||
    hasPattern(textBlob, 'machine learning')
  ) {
    detectedCategory = 'ai';
    if (hasPattern(textBlob, 'chatgpt') || hasPattern(textBlob, 'gpt')) detectedTopics.push('chatgpt');
    if (hasPattern(textBlob, 'claude')) detectedTopics.push('claude');
    if (hasPattern(textBlob, 'deepseek')) detectedTopics.push('deepseek');
    if (hasPattern(textBlob, 'agent')) detectedTopics.push('ai-agents');
    if (hasPattern(textBlob, 'prompt') || hasPattern(textBlob, 'prompting')) detectedTopics.push('prompt-engineering');
    if (hasPattern(textBlob, 'machine learning')) detectedTopics.push('ml');
  } else if (
    hasPattern(textBlob, 'next.js') ||
    hasPattern(textBlob, 'nextjs') ||
    hasPattern(textBlob, 'react') ||
    hasPattern(textBlob, 'tailwind') ||
    hasPattern(textBlob, 'shadcn') ||
    hasPattern(textBlob, 'typescript') ||
    hasPattern(textBlob, 'javascript') ||
    hasPattern(textBlob, 'supabase') ||
    hasPattern(textBlob, 'python') ||
    hasPattern(textBlob, 'docker') ||
    hasPattern(textBlob, 'github') ||
    hasPattern(textBlob, 'web dev')
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
    if (hasPattern(textBlob, 'github') || hasPattern(textBlob, 'open source')) detectedTopics.push('open-source');
    if (detectedTopics.length === 0) detectedTopics.push('web-development');
  } else if (
    hasPattern(textBlob, 'ui') ||
    hasPattern(textBlob, 'ux') ||
    hasPattern(textBlob, 'figma') ||
    hasPattern(textBlob, 'design system') ||
    hasPattern(textBlob, 'graphic design') ||
    hasPattern(textBlob, 'typography') ||
    hasPattern(textBlob, 'blender') ||
    hasPattern(textBlob, '3d')
  ) {
    detectedCategory = 'design';
    if (hasPattern(textBlob, 'ui') || hasPattern(textBlob, 'ux')) detectedTopics.push('ui-ux');
    if (hasPattern(textBlob, 'figma')) detectedTopics.push('figma');
    if (hasPattern(textBlob, 'typography') || hasPattern(textBlob, 'font')) detectedTopics.push('typography');
    if (hasPattern(textBlob, 'graphic')) detectedTopics.push('graphic-design');
    if (hasPattern(textBlob, '3d') || hasPattern(textBlob, 'blender')) detectedTopics.push('3d-design');
  } else if (
    hasPattern(textBlob, 'crypto') ||
    hasPattern(textBlob, 'bitcoin') ||
    hasPattern(textBlob, 'finance') ||
    hasPattern(textBlob, 'saas') ||
    hasPattern(textBlob, 'startup') ||
    hasPattern(textBlob, 'seo')
  ) {
    if (hasPattern(textBlob, 'saas') || hasPattern(textBlob, 'startup')) {
      detectedCategory = 'business';
      if (hasPattern(textBlob, 'saas')) detectedTopics.push('saas');
      if (hasPattern(textBlob, 'startup')) detectedTopics.push('startup');
    } else if (hasPattern(textBlob, 'seo')) {
      detectedCategory = 'marketing';
      detectedTopics.push('seo');
    } else {
      detectedCategory = 'finance';
      if (hasPattern(textBlob, 'crypto') || hasPattern(textBlob, 'bitcoin')) detectedTopics.push('crypto');
    }
  }

  // Fallback category
  if (!detectedCategory) {
    const platform = (payload.platform || 'web').toLowerCase();
    if (platform === 'youtube') detectedCategory = 'video-editing';
    else if (platform === 'instagram') detectedCategory = 'design';
    else detectedCategory = 'tech';
  }

  // Content type
  if (
    hasPattern(textBlob, 'tutorial') ||
    hasPattern(textBlob, 'how to') ||
    hasPattern(textBlob, 'learn') ||
    hasPattern(textBlob, 'course')
  ) {
    detectedType = 'tutorial';
  } else if (
    hasPattern(textBlob, 'tool') ||
    hasPattern(textBlob, 'app') ||
    hasPattern(textBlob, 'software') ||
    hasPattern(textBlob, 'plugin')
  ) {
    detectedType = 'tool';
  } else if (
    hasPattern(textBlob, 'guide') ||
    hasPattern(textBlob, 'cheatsheet')
  ) {
    detectedType = 'guide';
  } else if (
    hasPattern(textBlob, 'case study') ||
    hasPattern(textBlob, 'breakdown')
  ) {
    detectedType = 'case-study';
  } else if (
    hasPattern(textBlob, 'news') ||
    hasPattern(textBlob, 'launch') ||
    hasPattern(textBlob, 'release')
  ) {
    detectedType = 'news';
  } else if (
    hasPattern(textBlob, 'framework') ||
    hasPattern(textBlob, 'template')
  ) {
    detectedType = 'framework';
  } else {
    detectedType = detectedCategory === 'video-editing' ? 'tutorial' : 'resource';
  }

  // User custom tags
  if (payload.customTags && Array.isArray(payload.customTags)) {
    for (const ct of payload.customTags) {
      if (!detectedTopics.includes(ct)) detectedTopics.push(ct);
    }
  }

  // Ensure topics
  if (detectedTopics.length === 0) {
    if (detectedCategory === 'video-editing') detectedTopics.push('premiere-pro', 'video-editing');
    else if (detectedCategory === 'ai') detectedTopics.push('ai-tools', 'prompt-engineering');
    else if (detectedCategory === 'tech') detectedTopics.push('web-development', 'react');
    else if (detectedCategory === 'design') detectedTopics.push('ui-ux', 'figma');
    else if (detectedCategory === 'fitness') detectedTopics.push('calisthenics', 'fitness');
    else detectedTopics.push('resource');
  }

  const combined = [detectedCategory, ...detectedTopics.slice(0, 3), detectedType];
  const normalized = cleanAndNormalizeTags(combined);
  return normalized.length >= 3 ? normalized.slice(0, 5) : cleanAndNormalizeTags([detectedCategory, 'resource', 'guide', detectedType]);
}

// Background Gemini Tag Generator (Structured JSON Schema)
async function generateGeminiTags(payload, apiKey) {
  if (!apiKey) return null;

  const models = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];

  const systemInstruction = `You are an automated categorization and tagging engine for a personal knowledge vault.
Analyze the provided content metadata and generate clean, standardized tags in JSON format.

RULES FOR TAG GENERATION:
1. Generate minimum 3 and maximum 5 tags.
2. Format: STRICTLY lowercase, kebab-case (e.g., "video-editing", "ai-tools", "trading-strategy").
3. NO duplicates or near-synonyms (e.g., do not use both "ai" and "artificial-intelligence").
4. ALWAYS prefer shorter, industry-standard acronyms over long descriptions (e.g., use "ai" instead of "artificial-intelligence", "seo" instead of "search-engine-optimization", "fx" instead of "visual-effects").
5. Structure output:
   - "category": Broad domain (1 item: e.g., "tech", "video-editing", "design", "finance", "fitness", "productivity", "marketing", "business")
   - "topics": Core subject or tools mentioned (2-3 items: e.g., ["premiere-pro", "speed-ramping"])
   - "type": Nature of content (1 item: e.g., "tutorial", "tool", "resource", "news", "guide", "framework")
   - "all_tags": Combined ordered list of tags (strictly 3 to 5 items)

OUTPUT FORMAT (JSON ONLY):
{
  "category": "string",
  "topics": ["string", "string"],
  "type": "string",
  "all_tags": ["string", "string", "string", "string"]
}`;

  const preprocessed = preprocessPlatformInput(payload);
  const userContent = `Platform: ${payload.platform || 'web'}\nTitle: ${payload.title || ''}\nContent/Context: ${preprocessed}`;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemInstruction}\n\nINPUT:\n${userContent}\n\nOUTPUT (JSON ONLY):` }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 300,
          },
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      if (!rawText) continue;

      let tagArray = [];
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

      try {
        const parsed = JSON.parse(cleaned);
        tagArray = parsed.all_tags || [
          ...(parsed.category ? [parsed.category] : []),
          ...(Array.isArray(parsed.topics) ? parsed.topics : []),
          ...(parsed.type ? [parsed.type] : [])
        ];
      } catch {
        const objMatch = rawText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          try {
            const parsed = JSON.parse(objMatch[0]);
            tagArray = parsed.all_tags || [
              ...(parsed.category ? [parsed.category] : []),
              ...(Array.isArray(parsed.topics) ? parsed.topics : []),
              ...(parsed.type ? [parsed.type] : [])
            ];
          } catch {}
        }
      }

      const normalized = cleanAndNormalizeTags(tagArray);
      if (normalized.length >= 3) return normalized.slice(0, 5);
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
            context: payload.context,
          }),
        });
        if (tagRes.ok) {
          const tagData = await tagRes.json();
          if (tagData.tags && Array.isArray(tagData.tags) && tagData.tags.length >= 3) {
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

// Master Save Flow — AI Tags First, Then Save
async function saveBookmarkCore(payload) {
  const settings = await chrome.storage.local.get(['serverUrl', 'geminiApiKey', 'userId', 'recentSaves']);
  const userId = settings.userId || payload.userId || null;
  const apiKey = settings.geminiApiKey || undefined;
  const serverUrl = settings.serverUrl || DEFAULT_SERVER_URL;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const bookmarkId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Try to get REAL AI tags BEFORE saving (direct Gemini first if key set, then server endpoint, then local heuristics)
  let finalTags = null;

  // 1a. If user has Gemini API Key in extension settings, call Gemini directly
  if (apiKey) {
    try {
      const geminiTags = await generateGeminiTags(payload, apiKey);
      if (geminiTags && geminiTags.length >= 3) {
        finalTags = geminiTags;
      }
    } catch (gemErr) {
      // Gemini failed, try server endpoint next
    }
  }

  // 1b. Try server-side AI tagger endpoint (uses server's Gemini key)
  if (!finalTags || finalTags.length === 0) {
    try {
      const tagRes = await fetch(`${serverUrl}/api/ai/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: payload.title,
          text: payload.text || payload.title,
          url: payload.url,
          platform: payload.platform,
          context: payload.context,
        }),
      });
      if (tagRes.ok) {
        const tagData = await tagRes.json();
        if (tagData.tags && Array.isArray(tagData.tags) && tagData.tags.length >= 3) {
          finalTags = tagData.tags;
        }
      }
    } catch (srvErr) {
      // server unreachable, try next
    }
  }

  // 1c. Final fallback: local heuristic tags
  if (!finalTags || finalTags.length === 0) {
    finalTags = generateLocalAiTags(payload);
  }

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
    tags: finalTags,
    is_favorite: false,
    is_archived: false,
    note: payload.note || null,
    user_id: userId,
  };

  // 2. Save to Supabase with REAL AI tags (or Offline Queue if disconnected)
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

  // 3. Upsert tags into tags table (fire-and-forget)
  for (const t of finalTags) {
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
        user_id: userId,
      }),
    }).catch(() => {});
  }

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
