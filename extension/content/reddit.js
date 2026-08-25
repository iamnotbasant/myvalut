// Reddit Content Script for Valut
(function () {
  const VALUT_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  `;

  const VALUT_CHECK_SVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  `;

  function extractRedditPostData(postElement) {
    let title = '';
    let author = 'redditor';
    let subreddit = 'reddit';
    let permalink = window.location.href;
    let text = '';
    let imageUrl = '';

    if (postElement.tagName.toLowerCase() === 'shreddit-post') {
      title = postElement.getAttribute('post-title') || postElement.querySelector('a[slot="title"], h1[slot="title"], [id*="post-title"]')?.textContent?.trim() || '';
      author = postElement.getAttribute('author') || 'redditor';
      subreddit = postElement.getAttribute('subreddit-prefixed-name') || 'reddit';
      const pl = postElement.getAttribute('permalink');
      if (pl) {
        permalink = pl.startsWith('http') ? pl : `https://www.reddit.com${pl}`;
      }
      const postTextEl = postElement.querySelector('div[slot="text-body"], div.text-neutral-content, div[id*="post-rtjson-content"]');
      text = postTextEl?.textContent?.trim() || title;

      const imgEl = postElement.querySelector('img[src*="preview.redd.it"], img[src*="i.redd.it"], img[slot="thumbnail"], shreddit-aspect-ratio img');
      imageUrl = imgEl?.getAttribute('src') || '';
    } else {
      const titleEl = postElement.querySelector('a.title, a.post-title');
      title = titleEl?.textContent?.trim() || document.title;
      const subEl = postElement.querySelector('a.subreddit, a[href^="/r/"]');
      subreddit = subEl?.textContent?.trim() || 'reddit';
      const userEl = postElement.querySelector('a.author, a[href^="/user/"]');
      author = userEl?.textContent?.trim() || 'redditor';
      text = title;
    }

    return {
      url: permalink,
      platform: 'reddit',
      title: title || `${subreddit} post`,
      text: `${subreddit} • ${text}`,
      displayName: subreddit,
      username: author,
      imageUrl: imageUrl || undefined,
    };
  }

  function extractSmartTags(text) {
    const lower = (text || '').toLowerCase();
    const tags = [];
    const add = (name, color) => {
      if (!tags.some(t => t.name === name) && tags.length < 3) {
        tags.push({ name, color });
      }
    };

    if (lower.includes('programming') || lower.includes('webdev') || lower.includes('react') || lower.includes('python') || lower.includes('coding')) {
      add('Coding', 'cyan');
    }
    if (lower.includes('artificial') || lower.includes('machinelearning') || lower.includes('chatgpt') || lower.includes('ai') || lower.includes('localllama')) {
      add('AI', 'indigo');
    }
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('web_design')) {
      add('Design', 'pink');
    }
    if (lower.includes('saas') || lower.includes('startups') || lower.includes('entrepreneur') || lower.includes('sideproject')) {
      add('SaaS', 'cyan');
    }
    if (lower.includes('productivity') || lower.includes('selfimprovement') || lower.includes('books')) {
      add('Productivity', 'amber');
    }
    if (tags.length === 0) {
      tags.push({ name: 'Community', color: 'orange' });
    }
    return tags;
  }

  const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

  async function directFallbackSave(payload) {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const smartTags = extractSmartTags(payload.text + ' ' + payload.title);

    const bookmarkItem = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      platform: 'reddit',
      display_name: payload.displayName || 'Reddit User',
      username: payload.username ? payload.username.replace(/^@/, '') : 'reddit',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Reddit Post',
      url: payload.url || null,
      date: formattedDate,
      created_at_ms: Date.now(),
      tags: smartTags,
      is_favorite: false,
      is_archived: false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(bookmarkItem),
    });

    if (!res.ok) throw new Error('Direct save failed');
    return { success: true, result: { tags: bookmarkItem.tags } };
  }

  function handleRedditSuccess(btn, toast, tags) {
    if (btn) {
      btn.classList.remove('valut-reddit-loading');
      btn.classList.add('valut-reddit-saved');
      btn.innerHTML = `${VALUT_CHECK_SVG} <span>Saved!</span>`;
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleRedditError(btn, toast, errMsg) {
    if (btn) {
      btn.classList.remove('valut-reddit-loading');
      btn.innerHTML = `${VALUT_ICON_SVG} <span>Valut</span>`;
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveRedditPost(postEl, btn) {
    const data = extractRedditPostData(postEl);
    const toast = window.__valutToastManager?.showToast({
      title: data.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (btn) {
      btn.classList.add('valut-reddit-loading');
      btn.innerHTML = `<span class="valut-spinner"></span> <span>Saving...</span>`;
    }

    try {
      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(data);
        handleRedditSuccess(btn, toast, fallbackRes.result.tags);
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload: data }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(data);
            handleRedditSuccess(btn, toast, fallbackRes.result.tags);
          } catch (fbErr) {
            handleRedditError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleRedditSuccess(btn, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave(data);
        handleRedditSuccess(btn, toast, fallbackRes.result.tags);
      } catch (fbErr) {
        handleRedditError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  function injectRedditButtons() {
    const posts = document.querySelectorAll('shreddit-post, div.thing.link, article');

    posts.forEach(post => {
      if (post.querySelector('.valut-reddit-btn')) return;

      let actionBar = post.querySelector('div[slot="actions"], shreddit-post-overflow-menu, div.flat-list.buttons, [slot="flatlist"]');
      if (!actionBar) {
        actionBar = post.querySelector('div.flex.items-center.gap-x-1, div[data-testid="post-action-bar"]');
      }

      if (!actionBar || post.querySelector('.valut-reddit-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'valut-reddit-btn';
      btn.innerHTML = `${VALUT_ICON_SVG} <span>Valut</span>`;
      btn.title = 'Save to Valut with AI Tags';

      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        saveRedditPost(post, btn);
      });

      actionBar.appendChild(btn);
    });
  }

  const observer = new MutationObserver(() => injectRedditButtons());
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  window.addEventListener('load', injectRedditButtons);
  setInterval(injectRedditButtons, 1200);
  injectRedditButtons();
})();
