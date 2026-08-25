// Valut Background Service Worker (Manifest V3)

const DEFAULT_SERVER_URL = 'https://myvalut.vercel.app';
const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

// 1. Setup context menus on installation
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
  'creator', 'content', 'social', 'media', 'social media', 'online', 'website',
  'page', 'today', 'daily', 'new', 'update', 'share', 'good', 'cool', 'awesome',
  'photo', 'image', 'picture', 'text', 'comment', 'discussion', 'feed', 'timeline'
]);

function getTagColor(tagName, index = 0) {
  const clean = tagName.toLowerCase().trim();
  const map = {
    'ai': 'indigo',
    'artificial intelligence': 'indigo',
    'machine learning': 'indigo',
    'deep learning': 'indigo',
    'llm': 'indigo',
    'gpt': 'indigo',
    'chatgpt': 'indigo',
    'claude': 'indigo',
    'gemini': 'indigo',
    'openai': 'indigo',
    'agents': 'indigo',
    'deepseek': 'indigo',
    'frontend': 'blue',
    'react': 'cyan',
    'next.js': 'blue',
    'nextjs': 'blue',
    'javascript': 'amber',
    'typescript': 'blue',
    'css': 'pink',
    'tailwind': 'cyan',
    'tailwindcss': 'cyan',
    'webdev': 'teal',
    'backend': 'teal',
    'node.js': 'green',
    'python': 'teal',
    'database': 'indigo',
    'sql': 'indigo',
    'supabase': 'green',
    'devops': 'blue',
    'architecture': 'indigo',
    'open source': 'green',
    'security': 'red',
    'ui/ux': 'pink',
    'ui design': 'pink',
    'figma': 'pink',
    'motion design': 'violet',
    'animation': 'violet',
    'design system': 'violet',
    'design': 'pink',
    'saas': 'cyan',
    'startup': 'green',
    'marketing': 'orange',
    'crypto': 'amber',
    'finance': 'teal',
    'productivity': 'amber',
    'tutorial': 'green',
    'gamedev': 'violet',
  };
  if (map[clean]) return map[clean];
  for (const [k, v] of Object.entries(map)) {
    if (clean.includes(k) || k.includes(clean)) return v;
  }
  const palette = ['indigo', 'blue', 'cyan', 'teal', 'green', 'amber', 'orange', 'pink', 'violet', 'red'];
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) hash = (hash + tagName.charCodeAt(i)) % palette.length;
  return palette[(hash + index) % palette.length];
}

// Built-in NLP AI Tag Generator with Strict Domain Taxonomy
function generateLocalAiTags(input) {
  const textBlob = `${input.title || ''} ${input.text || ''} ${input.url || ''}`.toLowerCase();
  const tagList = [];
  const seen = new Set();

  const add = (name) => {
    if (!name) return;
    const clean = name.trim().replace(/^#/, '');
    const lower = clean.toLowerCase();
    if (!BANNED_GENERIC_TAGS.has(lower) && !seen.has(lower)) {
      seen.add(lower);
      tagList.push({ name: clean.charAt(0).toUpperCase() + clean.slice(1), color: getTagColor(clean, tagList.length) });
    }
  };

  const hashtagRegex = /#([a-zA-Z0-9_]{2,24})/g;
  let match;
  while ((match = hashtagRegex.exec(input.text || '')) !== null) {
    const rawTag = match[1];
    add(rawTag);
  }

  const rules = [
    { kw: ['agent', 'agents', 'ai agent', 'autonomous'], tag: 'AI Agents' },
    { kw: ['claude', 'anthropic', 'sonnet', 'opus'], tag: 'Claude' },
    { kw: ['chatgpt', 'gpt-4', 'openai', 'sora', 'o1'], tag: 'ChatGPT' },
    { kw: ['gemini', 'deepmind'], tag: 'Gemini' },
    { kw: ['deepseek', 'deepseek-r1'], tag: 'DeepSeek' },
    { kw: ['llm', 'llms', 'large language model'], tag: 'LLM' },
    { kw: ['machine learning', 'deep learning', 'neural network'], tag: 'Machine Learning' },
    { kw: ['ai', 'artificial intelligence', 'genai'], tag: 'AI' },
    { kw: ['next.js', 'nextjs', 'next 15', 'next 16'], tag: 'Next.js' },
    { kw: ['react', 'react 19', 'reactjs', 'jsx', 'tsx'], tag: 'React' },
    { kw: ['tailwind', 'tailwindcss', 'shadcn'], tag: 'Tailwind CSS' },
    { kw: ['typescript', 'ts types'], tag: 'TypeScript' },
    { kw: ['javascript', 'es6', 'js'], tag: 'JavaScript' },
    { kw: ['frontend', 'front-end', 'web dev', 'web development'], tag: 'Frontend' },
    { kw: ['supabase', 'postgresql', 'postgres'], tag: 'Supabase' },
    { kw: ['database', 'sql query', 'prisma', 'drizzle'], tag: 'Database' },
    { kw: ['python', 'fastapi', 'flask', 'django'], tag: 'Python' },
    { kw: ['backend', 'back-end', 'api endpoint', 'rest api'], tag: 'Backend' },
    { kw: ['docker', 'kubernetes', 'devops', 'cloudflare', 'vercel'], tag: 'DevOps' },
    { kw: ['open source', 'opensource', 'github'], tag: 'Open Source' },
    { kw: ['figma', 'figma design'], tag: 'Figma' },
    { kw: ['motion design', 'animation', 'micro-interaction'], tag: 'Motion Design' },
    { kw: ['ui/ux', 'ui design', 'ux design'], tag: 'UI/UX' },
    { kw: ['design system', 'typography', 'branding'], tag: 'Design System' },
    { kw: ['saas', 'micro saas', 'mrr', 'arr'], tag: 'SaaS' },
    { kw: ['startup', 'founder', 'entrepreneur'], tag: 'Startup' },
    { kw: ['marketing', 'seo', 'growth'], tag: 'Marketing' },
    { kw: ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth'], tag: 'Crypto' },
    { kw: ['finance', 'investing', 'stocks'], tag: 'Finance' },
    { kw: ['productivity', 'workflow', 'automation'], tag: 'Productivity' },
    { kw: ['tutorial', 'guide', 'how to build'], tag: 'Tutorial' },
  ];

  for (const r of rules) {
    if (tagList.length >= 4) break;
    if (r.kw.some(k => textBlob.includes(k))) {
      add(r.tag);
    }
  }

  return tagList.slice(0, 4);
}

const DEFAULT_GEMINI_API_KEY = '';

// Call Google Gemini API with Multi-Model Cascades & JSON Mode
async function generateGeminiTags(input, apiKey) {
  const activeKey = apiKey || DEFAULT_GEMINI_API_KEY;
  if (!activeKey) return null;

  const models = [
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ];

  const prompt = `You are a world-class Knowledge Taxonomist.
Analyze this bookmarked content and assign 2 to 4 highly specific, professional categorization tags.

TAXONOMY PRINCIPLES:
1. Identify primary domain (e.g. "Frontend", "AI Agents", "Architecture", "Product Design", "Macroeconomics").
2. Identify specific technologies/tools (e.g. "Next.js", "React 19", "Claude 3.7", "Tailwind CSS", "Figma", "Supabase").
3. Identify core themes (e.g. "Motion Design", "Design System", "SaaS Growth", "Prompting", "Open Source").

STRICT NEGATIVE CONSTRAINTS:
- NEVER output platform names (NO "Twitter", "X", "YouTube", "Instagram", "Reddit").
- NEVER output generic meta-words (NO "Post", "Video", "Tweet", "Saved", "Article", "Link", "Content").
- Return ONLY a JSON array of strings (e.g. ["Claude", "UI Design", "Motion Design"]).

Content Title: ${input.title || ''}
Source URL: ${input.url || ''}
Content Text:
${(input.text || '').slice(0, 1500)}`;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 150,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!res.ok) {
        console.warn(`Gemini model ${model} returned status:`, res.status);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      let parsed = [];
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) continue;

      const validTags = [];
      const seen = new Set();

      for (const tag of parsed) {
        if (typeof tag !== 'string') continue;
        const clean = tag.trim().replace(/^#/, '').replace(/[^\w\s.-]/g, '');
        const lower = clean.toLowerCase();
        if (!clean || clean.length < 2 || BANNED_GENERIC_TAGS.has(lower) || seen.has(lower)) continue;

        seen.add(lower);
        const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
        validTags.push({ name: formatted, color: getTagColor(formatted, validTags.length) });

        if (validTags.length >= 4) break;
      }

      if (validTags.length > 0) {
        return validTags;
      }
    } catch (err) {
      console.warn(`Gemini Tagging attempt with ${model} failed:`, err);
    }
  }

  return null;
}

// Master Dual-Save Strategy: Server API -> Direct Supabase Fallback
async function saveBookmarkCore(payload) {
  const settings = await chrome.storage.local.get(['serverUrl', 'geminiApiKey', 'userId', 'recentSaves']);
  const serverUrl = settings.serverUrl || DEFAULT_SERVER_URL;
  const userId = settings.userId || payload.userId || null;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 1. Generate AI Tags (Gemini or Local NLP)
  let tags = await generateGeminiTags(payload, settings.geminiApiKey || DEFAULT_GEMINI_API_KEY);
  if (!tags || tags.length === 0) {
    tags = generateLocalAiTags(payload);
  }

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
    tags,
    is_favorite: false,
    is_archived: false,
    note: payload.note || null,
    user_id: userId,
  };

  let savedResult = null;

  // Attempt 1: Call Web App Next.js API
  try {
    const response = await fetch(`${serverUrl}/api/extension/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.geminiApiKey ? { 'x-gemini-key': settings.geminiApiKey } : {}),
      },
      body: JSON.stringify({
        ...payload,
        userId,
        geminiApiKey: settings.geminiApiKey || undefined,
      }),
    });

    if (response.ok) {
      savedResult = await response.json();
    }
  } catch (serverErr) {
    console.warn('Server API save failed, attempting direct Supabase save:', serverErr);
  }

  // Attempt 2: Direct Supabase REST API Fallback
  if (!savedResult) {
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

        // Also upsert tags
        for (const t of bookmarkItem.tags) {
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
      } else {
        const errorText = await sbRes.text();
        throw new Error(`Supabase error: ${errorText}`);
      }
    } catch (sbErr) {
      console.error('Direct Supabase save failed:', sbErr);
      throw sbErr;
    }
  }

  // Store in Recent Saves list
  const recent = settings.recentSaves || [];
  const newRecent = [
    {
      ...bookmarkItem,
      displayName: bookmarkItem.display_name,
      avatarUrl: bookmarkItem.avatar_url,
      imageUrl: bookmarkItem.image_url,
      createdAt: bookmarkItem.created_at_ms,
      tags: savedResult.tags || bookmarkItem.tags,
    },
    ...recent,
  ].slice(0, 15);
  chrome.storage.local.set({ recentSaves: newRecent });

  // Badge notification
  chrome.action.setBadgeText({ text: '✓' });
  chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

  return savedResult;
}
