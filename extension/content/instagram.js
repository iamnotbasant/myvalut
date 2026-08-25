// Instagram Content Script for Valut
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

  function extractInstagramData(article) {
    let author = 'instagram_creator';
    let avatarUrl = '';
    let text = '';
    let imageUrl = '';
    let pageUrl = window.location.href;

    const authorLink = article.querySelector('header a[role="link"], header a[href^="/"]');
    if (authorLink) {
      author = authorLink.textContent?.trim() || authorLink.getAttribute('href')?.replace(/\//g, '') || 'instagram_creator';
    }

    const avatarImg = article.querySelector('header img, header canvas + img');
    if (avatarImg) {
      avatarUrl = avatarImg.getAttribute('src') || '';
    }

    const captionEl = article.querySelector('h1, span._aacl._aaco._aacu._aacx._aad7._aade');
    if (captionEl) {
      text = captionEl.textContent?.trim() || '';
    }

    const postImg = article.querySelector('div[role="button"] img[src*="cdninstagram"], img[src*="instagram"], img.x5yr21d');
    if (postImg) {
      imageUrl = postImg.getAttribute('src') || '';
    }

    return {
      url: pageUrl,
      platform: 'instagram',
      title: `${author} on Instagram`,
      text: text || `Instagram post by ${author}`,
      displayName: author,
      username: author,
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

    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('graphic') || lower.includes('art')) {
      add('Design', 'pink');
    }
    if (lower.includes('tech') || lower.includes('code') || lower.includes('setup') || lower.includes('developer')) {
      add('Tech', 'blue');
    }
    if (lower.includes('ai') || lower.includes('robot') || lower.includes('future') || lower.includes('model')) {
      add('AI', 'indigo');
    }
    if (lower.includes('growth') || lower.includes('business') || lower.includes('marketing') || lower.includes('founder')) {
      add('Marketing', 'orange');
    }
    if (tags.length === 0) {
      tags.push({ name: 'Creative', color: 'violet' });
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
      platform: 'instagram',
      display_name: payload.displayName || 'Instagram Creator',
      username: payload.username ? payload.username.replace(/^@/, '') : 'instagram',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Instagram Post',
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

  function handleIgSuccess(btn, toast, tags) {
    if (btn) {
      btn.classList.remove('valut-ig-loading');
      btn.classList.add('valut-ig-saved');
      btn.innerHTML = VALUT_CHECK_SVG;
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleIgError(btn, toast, errMsg) {
    if (btn) {
      btn.classList.remove('valut-ig-loading');
      btn.innerHTML = VALUT_ICON_SVG;
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveInstagramPost(article, btn) {
    const postData = extractInstagramData(article);
    const toast = window.__valutToastManager?.showToast({
      title: postData.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (btn) {
      btn.classList.add('valut-ig-loading');
      btn.innerHTML = `<span class="valut-spinner"></span>`;
    }

    try {
      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(postData);
        handleIgSuccess(btn, toast, fallbackRes.result.tags);
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload: postData }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(postData);
            handleIgSuccess(btn, toast, fallbackRes.result.tags);
          } catch (fbErr) {
            handleIgError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleIgSuccess(btn, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave(postData);
        handleIgSuccess(btn, toast, fallbackRes.result.tags);
      } catch (fbErr) {
        handleIgError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  function injectInstagramButtons() {
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
      if (article.querySelector('.valut-ig-btn')) return;

      const actionsRow = article.querySelector('section._aamu, section');
      if (!actionsRow) return;

      const btn = document.createElement('button');
      btn.className = 'valut-ig-btn';
      btn.innerHTML = VALUT_ICON_SVG;
      btn.title = 'Save to Valut with AI Tags';

      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        saveInstagramPost(article, btn);
      });

      actionsRow.appendChild(btn);
    });
  }

  const observer = new MutationObserver(() => injectInstagramButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', injectInstagramButtons);
  setInterval(injectInstagramButtons, 1200);
  injectInstagramButtons();
})();
