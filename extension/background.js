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

// Banned Generic / Fluff Words
const BANNED_GENERIC_TAGS = new Set([
  'tips', 'tricks', 'information', 'best', 'useful', 'guide', 'good', 'learn',
  'twitter', 'x', 'youtube', 'instagram', 'reddit', 'tiktok', 'threads', 'bluesky',
  'post', 'video', 'tweet', 'saved', 'thread', 'web', 'article', 'link', 'user',
  'creator', 'content', 'social', 'media', 'social media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline',
  'status', 'read', 'view', 'click', 'here', 'look', 'check', 'out', 'this', 'that',
  'stuff', 'thing', 'things', 'nice', 'great', 'amazing', 'item', 'bookmark'
]);

const SYNONYM_MAP = {
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
  'aftereffects': 'after effects',
  'after effect': 'after effects',
  'adobe after effects': 'after effects',
  'ae': 'after effects',
  'cap cut': 'capcut',
  'motiongraphics': 'motion design',
  'motion graphics': 'motion design',
  'graphicdesign': 'graphic design',
  'graphic designs': 'graphic design',
  'visual effects': 'vfx',
  'visual effect': 'vfx',
  'fx': 'vfx',
  'speed ramp': 'speed ramping',
  'speedramping': 'speed ramping',
  'color grading': 'color grade',
  'colorgrade': 'color grade',
  'user interface': 'ui',
  'user experience': 'ux',
  'ui ux': 'ui ux',
  'uiux': 'ui ux',
  'reactjs': 'react',
  'react js': 'react',
  'nextjs': 'next js',
  'next js': 'next js',
  'next': 'next js',
  'tailwindcss': 'tailwind',
  'tailwind css': 'tailwind',
  'javascript': 'js',
  'typescript': 'ts',
  'shadcn ui': 'shadcn',
  'shadcn': 'shadcn',
  'web dev': 'web dev',
  'webdev': 'web dev',
  'web development': 'web dev',
  'node js': 'nodejs',
  'postgres': 'postgresql',
  'open source software': 'open source',
  'opensource': 'open source',
  'git repo': 'github',
  'search engine optimization': 'seo',
  'gta vi': 'gta 6',
  'gta 6': 'gta 6',
  'grand theft auto': 'gta 6',
  'watch dogs 2': 'watch dogs 2',
  'watchdogs 2': 'watch dogs 2',
  'bodyweight training': 'calisthenics',
  'bodyweight': 'calisthenics',
  'personal finance': 'finance',
  'cryptocurrency': 'crypto',
  'startups': 'startup',
  'micro saas': 'saas',
};

const TOPIC_COLOR_MAP = {
  'tech': 'teal',
  'video editing': 'violet',
  'design': 'pink',
  'finance': 'teal',
  'fitness': 'green',
  'business': 'cyan',
  'marketing': 'orange',
  'productivity': 'amber',
  'gaming': 'indigo',
  'entertainment': 'amber',
  'ai': 'teal',
  'ml': 'teal',
  'generative ai': 'teal',
  'premiere pro': 'violet',
  'after effects': 'violet',
  'davinci resolve': 'violet',
  'capcut': 'violet',
  'ffmpeg': 'indigo',
  'motion design': 'violet',
  'vfx': 'violet',
  'speed ramping': 'violet',
  'color grade': 'violet',
  'ui': 'cyan',
  'ux': 'cyan',
  'ui ux': 'cyan',
  'figma': 'pink',
  'web dev': 'teal',
  'react': 'cyan',
  'next js': 'teal',
  'js': 'amber',
  'ts': 'teal',
  'tailwind': 'cyan',
  'shadcn': 'blue',
  'python': 'teal',
  'supabase': 'green',
  'saas': 'cyan',
  'startup': 'green',
  'seo': 'blue',
  'crypto': 'amber',
  'tutorial': 'green',
  'tool': 'cyan',
  'resource': 'blue',
  'workflow': 'amber',
  'case study': 'amber',
  'calisthenics': 'green',
  'gta 6': 'indigo',
  'watch dogs 2': 'indigo',
};

function getTagColor(tagName, index = 0) {
  const clean = tagName.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
  if (TOPIC_COLOR_MAP[clean]) return TOPIC_COLOR_MAP[clean];

  for (const [k, v] of Object.entries(TOPIC_COLOR_MAP)) {
    if (clean === k || clean.startsWith(k + ' ') || clean.endsWith(' ' + k)) return v;
  }
  const palette = ['teal', 'violet', 'cyan', 'green', 'amber', 'pink', 'orange', 'blue', 'indigo', 'red'];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash + clean.charCodeAt(i)) % palette.length;
  return palette[(hash + index) % palette.length];
}

function cleanAndNormalizeTags(rawTags) {
  if (!Array.isArray(rawTags)) return [];
  const cleaned = rawTags
    .map(tag => {
      if (!tag || typeof tag !== 'string') return '';
      return tag
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    })
    .map(tag => SYNONYM_MAP[tag] || tag)
    .filter(tag => Boolean(tag) && tag.length >= 2 && !BANNED_GENERIC_TAGS.has(tag));

  const unique = Array.from(new Set(cleaned)).slice(0, 6);

  return unique.map((name, idx) => ({
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
      return `${title}Tweet: ${rawText}${quoteText}`.trim().slice(0, 600);
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

// Local Semantic AI Classifier (Natural Space Tags, Specific Tools First, Dynamic 2-6 Tags)
function generateLocalAiTags(payload) {
  const textBlob = `${payload.title || ''} ${payload.text || ''} ${payload.url || ''} ${payload.context || ''}`.toLowerCase();
  
  let detectedCategory = null;
  const detectedEntities = [];
  let detectedFormat = null;

  // Specific Tools & Entities
  if (hasPattern(textBlob, 'premiere')) detectedEntities.push('premiere pro');
  if (hasPattern(textBlob, 'after effects') || hasPattern(textBlob, 'ae')) detectedEntities.push('after effects');
  if (hasPattern(textBlob, 'davinci')) detectedEntities.push('davinci resolve');
  if (hasPattern(textBlob, 'capcut')) detectedEntities.push('capcut');
  if (hasPattern(textBlob, 'ffmpeg')) detectedEntities.push('ffmpeg');
  if (hasPattern(textBlob, 'speed ramp')) detectedEntities.push('speed ramping');
  if (hasPattern(textBlob, 'color grade')) detectedEntities.push('color grade');
  if (hasPattern(textBlob, 'chatgpt') || hasPattern(textBlob, 'gpt 4')) detectedEntities.push('chatgpt');
  if (hasPattern(textBlob, 'claude')) detectedEntities.push('claude');
  if (hasPattern(textBlob, 'cursor')) detectedEntities.push('cursor');
  if (hasPattern(textBlob, 'deepseek')) detectedEntities.push('deepseek');
  if (hasPattern(textBlob, 'gemini')) detectedEntities.push('gemini');
  if (hasPattern(textBlob, 'whisper')) detectedEntities.push('whisper');
  if (hasPattern(textBlob, 'react')) detectedEntities.push('react');
  if (hasPattern(textBlob, 'next js') || hasPattern(textBlob, 'nextjs')) detectedEntities.push('next js');
  if (hasPattern(textBlob, 'tailwind')) detectedEntities.push('tailwind');
  if (hasPattern(textBlob, 'shadcn')) detectedEntities.push('shadcn');
  if (hasPattern(textBlob, 'supabase')) detectedEntities.push('supabase');
  if (hasPattern(textBlob, 'gta 6') || hasPattern(textBlob, 'gta')) detectedEntities.push('gta 6');
  if (hasPattern(textBlob, 'watch dogs 2') || hasPattern(textBlob, 'watch dogs')) detectedEntities.push('watch dogs 2');
  if (hasPattern(textBlob, 'playstation')) detectedEntities.push('playstation');
  if (hasPattern(textBlob, 'xbox')) detectedEntities.push('xbox');
  if (hasPattern(textBlob, 'figma')) detectedEntities.push('figma');
  if (hasPattern(textBlob, 'typography')) detectedEntities.push('typography');
  if (hasPattern(textBlob, 'calisthenics') || hasPattern(textBlob, 'bodyweight')) detectedEntities.push('calisthenics');

  // Category
  if (
    hasPattern(textBlob, 'premiere') ||
    hasPattern(textBlob, 'video edit') ||
    hasPattern(textBlob, 'davinci') ||
    hasPattern(textBlob, 'after effects') ||
    hasPattern(textBlob, 'capcut') ||
    hasPattern(textBlob, 'ffmpeg')
  ) {
    detectedCategory = 'video editing';
  } else if (
    hasPattern(textBlob, 'game') ||
    hasPattern(textBlob, 'gaming') ||
    hasPattern(textBlob, 'gta') ||
    hasPattern(textBlob, 'watch dogs') ||
    hasPattern(textBlob, 'playstation') ||
    hasPattern(textBlob, 'xbox')
  ) {
    detectedCategory = 'gaming';
  } else if (
    hasPattern(textBlob, 'claude') ||
    hasPattern(textBlob, 'chatgpt') ||
    hasPattern(textBlob, 'openai') ||
    hasPattern(textBlob, 'gemini') ||
    hasPattern(textBlob, 'deepseek') ||
    hasPattern(textBlob, 'llm') ||
    hasPattern(textBlob, 'prompt')
  ) {
    detectedCategory = 'ai';
  } else if (
    hasPattern(textBlob, 'react') ||
    hasPattern(textBlob, 'next js') ||
    hasPattern(textBlob, 'tailwind') ||
    hasPattern(textBlob, 'coding') ||
    hasPattern(textBlob, 'typescript') ||
    hasPattern(textBlob, 'supabase')
  ) {
    detectedCategory = 'tech';
  } else if (
    hasPattern(textBlob, 'figma') ||
    hasPattern(textBlob, 'ui') ||
    hasPattern(textBlob, 'ux') ||
    hasPattern(textBlob, 'typography')
  ) {
    detectedCategory = 'design';
  } else if (
    hasPattern(textBlob, 'calisthenics') ||
    hasPattern(textBlob, 'fitness')
  ) {
    detectedCategory = 'fitness';
  } else if (
    hasPattern(textBlob, 'saas') ||
    hasPattern(textBlob, 'startup')
  ) {
    detectedCategory = 'business';
  } else if (
    hasPattern(textBlob, 'meme') ||
    hasPattern(textBlob, 'funny')
  ) {
    detectedCategory = 'entertainment';
  } else {
    const platform = (payload.platform || 'web').toLowerCase();
    if (platform === 'youtube') detectedCategory = 'video editing';
    else if (platform === 'instagram') detectedCategory = 'design';
    else detectedCategory = 'tech';
  }

  // Format
  if (hasPattern(textBlob, 'workflow')) detectedFormat = 'workflow';
  else if (hasPattern(textBlob, 'tutorial') || hasPattern(textBlob, 'how to')) detectedFormat = 'tutorial';
  else if (hasPattern(textBlob, 'case study')) detectedFormat = 'case study';
  else if (hasPattern(textBlob, 'meme')) detectedFormat = 'meme';
  else if (hasPattern(textBlob, 'gameplay')) detectedFormat = 'gameplay';
  else if (hasPattern(textBlob, 'tool')) detectedFormat = 'tool';

  const rawTags = [detectedCategory, ...detectedEntities, detectedFormat || undefined];
  const normalized = cleanAndNormalizeTags(rawTags);
  return normalized.length >= 2 ? normalized : cleanAndNormalizeTags([detectedCategory || 'tech', 'resource']);
}

async function generateGeminiTags(payload, apiKey) {
  let effectiveKey = apiKey;
  if (!effectiveKey) {
    try {
      effectiveKey = atob('QVEuQWI4Uk42SXFWTm1YMjNubEdhbTVXSlVNNGFOeVhZOFUzZ1lERXJLVjNRQ3BaQUkxaWc=');
    } catch {
      effectiveKey = '';
    }
  }
  if (!effectiveKey) return null;

  const models = [
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.1-pro-preview'
  ];

  const systemInstruction = `You are a precise content classification and knowledge extraction engine for a personal knowledge vault.
Analyze the provided content metadata and extract high-utility, highly searchable tags.

DYNAMIC TAGGING RULES (MIN 2, MAX 6 TAGS):
1. Knowledge & Depth-Based Tag Count: Generate 4 to 6 tags for rich/knowledge-heavy posts, and 2 to 3 tags for brief/simple content.
2. Format: STRICTLY lowercase text with standard spaces. NEVER use hyphens, hashtags, underscores, or special characters.
3. High-Value Specificity: ALWAYS prioritize specific named tools, software, frameworks, models, and core mechanics over vague concepts.
4. Deduplication: Never include redundant synonyms.
5. NO Fluff: Never use low-intent generic words.

OUTPUT FORMAT (JSON ONLY):
{
  "content_density": "low" | "medium" | "high",
  "category": "string",
  "tools_and_entities": ["string", "string"],
  "core_topics": ["string"],
  "content_format": "string",
  "final_tags": ["string", "string", "string"]
}`;

  const preprocessed = preprocessPlatformInput(payload);
  const userContent = `Platform: ${payload.platform || 'web'}\nTitle: ${payload.title || ''}\nContext: ${preprocessed}`;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`, {
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
        tagArray = parsed.final_tags || [
          ...(parsed.category ? [parsed.category] : []),
          ...(Array.isArray(parsed.tools_and_entities) ? parsed.tools_and_entities : []),
          ...(Array.isArray(parsed.core_topics) ? parsed.core_topics : []),
          ...(parsed.content_format ? [parsed.content_format] : [])
        ];
      } catch {
        const objMatch = rawText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          try {
            const parsed = JSON.parse(objMatch[0]);
            tagArray = parsed.final_tags || [
              ...(parsed.category ? [parsed.category] : []),
              ...(Array.isArray(parsed.tools_and_entities) ? parsed.tools_and_entities : []),
              ...(Array.isArray(parsed.core_topics) ? parsed.core_topics : []),
              ...(parsed.content_format ? [parsed.content_format] : [])
            ];
          } catch {}
        }
      }

      const normalized = cleanAndNormalizeTags(tagArray);
      if (normalized.length >= 2) return normalized.slice(0, 6);
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

// Master Save Flow — Save Instantly & Open Website for Live AI Tagging
async function saveBookmarkCore(payload) {
  const settings = await chrome.storage.local.get(['serverUrl', 'geminiApiKey', 'userId', 'recentSaves']);
  const userId = settings.userId || payload.userId || null;
  const serverUrl = settings.serverUrl || DEFAULT_SERVER_URL;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const bookmarkId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Save with empty tags initially so the website runs the AI tagger with live visual indicator
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
    tags: [],
    is_favorite: false,
    is_archived: false,
    note: payload.note || null,
    user_id: userId,
  };

  // 1. Immediate Save to Supabase (or Offline Queue)
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
        tags: [],
        savedToDatabase: true,
      };
    } else {
      await enqueueOfflineBookmark(bookmarkItem);
      savedResult = {
        success: true,
        bookmark: bookmarkItem,
        tags: [],
        offlineQueued: true,
      };
    }
  } catch (err) {
    await enqueueOfflineBookmark(bookmarkItem);
    savedResult = {
      success: true,
      bookmark: bookmarkItem,
      tags: [],
      offlineQueued: true,
    };
  }

  // 2. Open Valut Website Tab so user sees processing and tags applied live!
  if (payload.openWebsite !== false) {
    try {
      chrome.tabs.create({ url: serverUrl });
    } catch {}
  }

  // 3. Update Recent Saves list
  const recent = settings.recentSaves || [];
  const newRecent = [
    {
      ...bookmarkItem,
      displayName: bookmarkItem.display_name,
      avatarUrl: bookmarkItem.avatar_url,
      imageUrl: bookmarkItem.image_url,
      createdAt: bookmarkItem.created_at_ms,
      tags: [],
    },
    ...recent,
  ].slice(0, 15);
  chrome.storage.local.set({ recentSaves: newRecent });

  // 4. Badge notification
  chrome.action.setBadgeText({ text: '✓' });
  chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

  return savedResult;
}
