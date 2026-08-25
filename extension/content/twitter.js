// Twitter / X Content Script for Valut
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

  function extractTweetData(tweetArticle) {
    const timeEl = tweetArticle.querySelector('time');
    const linkEl = timeEl?.closest('a') || tweetArticle.querySelector('a[href*="/status/"]');
    const tweetUrl = linkEl ? (linkEl.href.startsWith('http') ? linkEl.href : `https://x.com${linkEl.getAttribute('href')}`) : window.location.href;

    const userNameContainer = tweetArticle.querySelector('div[data-testid="User-Name"]');
    let displayName = 'Twitter User';
    let username = 'user';

    if (userNameContainer) {
      const nameSpans = userNameContainer.querySelectorAll('span');
      if (nameSpans.length > 0) {
        displayName = nameSpans[0].textContent.trim();
      }
      const handleA = userNameContainer.querySelector('a[href^="/"]');
      if (handleA) {
        username = handleA.getAttribute('href').replace('/', '').trim();
      }
    }

    let avatarUrl = '';
    const avatarEl = tweetArticle.querySelector('div[data-testid="Tweet-User-Avatar"] img, img[src*="profile_images"]');
    if (avatarEl) {
      avatarUrl = avatarEl.getAttribute('src') || '';
      avatarUrl = avatarUrl.replace('_normal.', '_bigger.').replace('_mini.', '_bigger.');
    }

    const textEl = tweetArticle.querySelector('div[data-testid="tweetText"]');
    let text = textEl?.textContent?.trim() || '';

    // Extract Link Card Title & Description if present
    const cardEl = tweetArticle.querySelector('div[data-testid*="card.layout"]');
    if (cardEl) {
      const cardText = cardEl.textContent?.trim();
      if (cardText && !text.includes(cardText)) {
        text += `\n[Link Preview: ${cardText}]`;
      }
    }

    // Extract Quoted Tweet if present
    const quoteEl = tweetArticle.querySelector('div[data-testid="quoteTweet"], div[role="blockquote"]');
    if (quoteEl) {
      const quoteText = quoteEl.textContent?.trim();
      if (quoteText && !text.includes(quoteText)) {
        text += `\n[Quoted: ${quoteText}]`;
      }
    }

    // Extract High-Res Photo or Video Poster
    let imageUrl = '';
    const photoEl = tweetArticle.querySelector('div[data-testid="tweetPhoto"] img, div[data-testid="videoPlayer"] video, div[data-testid="videoPlayer"] poster, div[data-testid*="card.layout"] img');
    if (photoEl) {
      imageUrl = photoEl.getAttribute('src') || photoEl.getAttribute('poster') || '';
      if (imageUrl.includes('format=') && !imageUrl.includes('name=large')) {
        imageUrl = imageUrl.replace(/name=[a-z0-9_]+/i, 'name=large');
      }
    }

    return {
      url: tweetUrl,
      platform: 'twitter',
      title: `${displayName} on X`,
      text: text || `Tweet by ${displayName}`,
      displayName,
      username,
      avatarUrl: avatarUrl || undefined,
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

    if (lower.includes('agent') || lower.includes('claude') || lower.includes('gpt') || lower.includes('llm') || lower.includes('deepseek') || lower.includes('ai')) {
      add('AI Agents', 'indigo');
    }
    if (lower.includes('react') || lower.includes('next.js') || lower.includes('nextjs') || lower.includes('frontend') || lower.includes('tailwind')) {
      add('Frontend', 'blue');
    }
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('figma') || lower.includes('animation')) {
      add('UI/UX', 'pink');
    }
    if (lower.includes('saas') || lower.includes('startup') || lower.includes('mrr') || lower.includes('growth')) {
      add('SaaS', 'cyan');
    }
    if (lower.includes('python') || lower.includes('backend') || lower.includes('database') || lower.includes('supabase')) {
      add('Backend', 'teal');
    }
    if (tags.length === 0) {
      tags.push({ name: 'Inspiration', color: 'indigo' });
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

    const smartTags = extractSmartTags(payload.text);

    const bookmarkItem = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      platform: payload.platform || 'twitter',
      display_name: payload.displayName || 'Creator',
      username: payload.username ? payload.username.replace(/^@/, '') : 'creator',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Bookmark',
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

  function handleSaveSuccess(buttonElement, toast, tags) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-x-loading');
      buttonElement.classList.add('valut-x-saved');
      buttonElement.innerHTML = VALUT_CHECK_SVG;
      buttonElement.title = 'Saved to Valut!';
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleSaveError(buttonElement, toast, errMsg) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-x-loading');
      buttonElement.innerHTML = VALUT_ICON_SVG;
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveTweet(tweetArticle, buttonElement) {
    const tweetData = extractTweetData(tweetArticle);
    const toast = window.__valutToastManager?.showToast({
      title: tweetData.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (buttonElement) {
      buttonElement.classList.add('valut-x-loading');
      buttonElement.innerHTML = `<span class="valut-spinner"></span>`;
    }

    try {
      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(tweetData);
        handleSaveSuccess(buttonElement, toast, fallbackRes.result.tags);
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload: tweetData }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(tweetData);
            handleSaveSuccess(buttonElement, toast, fallbackRes.result.tags);
          } catch (fbErr) {
            handleSaveError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleSaveSuccess(buttonElement, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave(tweetData);
        handleSaveSuccess(buttonElement, toast, fallbackRes.result.tags);
      } catch (fbErr) {
        handleSaveError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  function injectTweetButtons() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');

    tweets.forEach(tweet => {
      const actionRow = tweet.querySelector('div[role="group"]');
      if (!actionRow) return;

      if (actionRow.querySelector('.valut-x-action')) return;

      const container = document.createElement('div');
      container.className = 'valut-x-action';

      const btn = document.createElement('button');
      btn.className = 'valut-x-btn';
      btn.innerHTML = VALUT_ICON_SVG;
      btn.title = 'Save to Valut with AI Tags';
      btn.setAttribute('aria-label', 'Save to Valut');

      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        saveTweet(tweet, btn);
      });

      container.appendChild(btn);
      actionRow.appendChild(container);
    });
  }

  const observer = new MutationObserver(() => injectTweetButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', injectTweetButtons);
  injectTweetButtons();
})();
