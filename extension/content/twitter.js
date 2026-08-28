// Twitter / X Content Script for Valut
(function () {
  const VALUT_ICON_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z" fill="currentColor" />
      <path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z" fill="currentColor" />
    </svg>
  `;

  function extractTweetData(tweetArticle) {
    let displayName = '';
    let username = '';
    let avatarUrl = '';
    let text = '';
    let imageUrl = '';
    let tweetUrl = window.location.href;

    const userEl = tweetArticle.querySelector('div[data-testid="User-Name"]');
    if (userEl) {
      const names = userEl.querySelectorAll('span');
      if (names.length > 0) displayName = names[0].textContent.trim();
      const handleEl = userEl.querySelector('a[tabindex="-1"]');
      if (handleEl) username = handleEl.textContent.trim().replace(/^@/, '');
    }

    const avatarEl = tweetArticle.querySelector('div[data-testid="Tweet-User-Avatar"] img');
    if (avatarEl) avatarUrl = avatarEl.getAttribute('src') || '';

    const textEl = tweetArticle.querySelector('div[data-testid="tweetText"]');
    if (textEl) text = textEl.innerText.trim();

    const photoEl = tweetArticle.querySelector('div[data-testid="tweetPhoto"] img');
    if (photoEl) imageUrl = photoEl.getAttribute('src') || '';

    const timeLink = tweetArticle.querySelector('time')?.closest('a');
    if (timeLink) tweetUrl = timeLink.href;

    return {
      url: tweetUrl,
      platform: 'twitter',
      title: `${displayName || username || 'Tweet'} on X`,
      text: text || 'Saved Tweet from X',
      displayName: displayName || 'X Creator',
      username: username || 'user',
      avatarUrl: avatarUrl || undefined,
      imageUrl: imageUrl || undefined,
    };
  }

  function extractSmartTags(text) {
    const lower = (text || '').toLowerCase();
    const tags = [];
    const add = (name, color) => {
      if (!tags.some(t => t.name === name) && tags.length < 4) {
        tags.push({ name, color });
      }
    };

    if (lower.includes('agent') || lower.includes('claude') || lower.includes('gpt') || lower.includes('llm') || lower.includes('deepseek') || lower.includes('ai') || lower.includes('prompt')) {
      add('ai', 'teal');
      if (lower.includes('agent') || lower.includes('crewai')) add('ai-agents', 'teal');
      else if (lower.includes('prompt')) add('prompt-engineering', 'teal');
      else add('tool', 'cyan');
    }
    if (lower.includes('react') || lower.includes('next.js') || lower.includes('nextjs') || lower.includes('frontend') || lower.includes('tailwind') || lower.includes('javascript') || lower.includes('typescript')) {
      add('tech', 'teal');
      if (lower.includes('react') || lower.includes('next')) add('react', 'cyan');
      else add('web-development', 'teal');
    }
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('figma') || lower.includes('animation') || lower.includes('motion')) {
      if (lower.includes('motion') || lower.includes('animation')) {
        add('motion-design', 'violet');
        add('animation', 'violet');
      } else {
        add('ui', 'cyan');
        add('design-inspiration', 'pink');
      }
    }
    if (lower.includes('saas') || lower.includes('startup') || lower.includes('mrr') || lower.includes('arr') || lower.includes('founder') || lower.includes('indie')) {
      add('saas', 'cyan');
      add('startup', 'green');
    }
    if (lower.includes('supabase') || lower.includes('postgres') || lower.includes('database') || lower.includes('backend') || lower.includes('python') || lower.includes('api')) {
      add('tech', 'teal');
      if (lower.includes('supabase')) add('supabase', 'green');
      else add('backend', 'teal');
    }
    if (lower.includes('guide') || lower.includes('how to') || lower.includes('thread') || lower.includes('tutorial') || lower.includes('tips')) {
      add('guide', 'green');
    }

    if (tags.length === 0) {
      tags.push({ name: 'tech', color: 'teal' }, { name: 'web-development', color: 'teal' }, { name: 'resource', color: 'blue' });
    } else if (tags.length === 1) {
      if (tags[0].name === 'ai' || tags[0].name === 'tech') tags.push({ name: 'resource', color: 'blue' });
      else if (tags[0].name === 'saas') tags.push({ name: 'case-study', color: 'amber' });
      else tags.push({ name: 'guide', color: 'green' });
    }

    return tags.slice(0, 4);
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
      buttonElement.title = 'Saved to Valut!';
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleSaveError(buttonElement, toast, errMsg) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-x-loading');
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

      const shareBtn = actionRow.querySelector('button[data-testid="share"], button[aria-label*="Share"]');
      if (shareBtn && shareBtn.parentNode === actionRow) {
        actionRow.insertBefore(container, shareBtn);
      } else {
        actionRow.appendChild(container);
      }
    });
  }

  const observer = new MutationObserver(() => injectTweetButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', injectTweetButtons);
  setInterval(injectTweetButtons, 1000);
  injectTweetButtons();
})();
