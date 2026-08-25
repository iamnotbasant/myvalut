// YouTube Content Script for Valut
(function () {
  const VALUT_ICON_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  `;

  const VALUT_CHECK_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  `;

  function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v') || null;
  }

  function extractYouTubeData() {
    const videoId = getVideoId();
    const isShorts = window.location.pathname.includes('/shorts/');

    let title = '';
    let authorName = '';
    let authorHandle = '';
    let avatarUrl = '';
    let text = '';
    let imageUrl = '';
    let pageUrl = window.location.href;

    if (isShorts) {
      const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]') || document;
      title = activeReel.querySelector('#overlay ytd-reel-player-header-renderer h2, #title')?.textContent?.trim() || document.title;
      authorName = activeReel.querySelector('#channel-name a, yt-formatted-string.ytd-channel-name')?.textContent?.trim() || '';
      const avatarEl = activeReel.querySelector('#avatar-btn img, #avatar img, yt-img-shadow#avatar img');
      avatarUrl = avatarEl?.getAttribute('src') || avatarEl?.getAttribute('data-src') || '';
      text = title;
      const shortsId = window.location.pathname.split('/shorts/')[1]?.split('?')[0];
      if (shortsId) {
        imageUrl = `https://i.ytimg.com/vi/${shortsId}/maxresdefault.jpg`;
      }
    } else {
      const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, #title h1 yt-formatted-string, h1.title yt-formatted-string, #container h1');
      title = titleEl?.textContent?.trim() || document.title.replace(' - YouTube', '');

      const channelEl = document.querySelector('#owner #channel-name a, ytd-video-owner-renderer #channel-name a, #upload-info #channel-name a, ytd-channel-name a');
      authorName = channelEl?.textContent?.trim() || 'YouTube Creator';
      authorHandle = authorName.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const avatarEl = document.querySelector('#owner #avatar img, ytd-video-owner-renderer #avatar-link img, #upload-info #avatar img, yt-img-shadow#avatar img, #avatar img');
      avatarUrl = avatarEl?.getAttribute('src') || avatarEl?.getAttribute('data-src') || '';

      const descEl = document.querySelector('#description-inline-expander yt-attributed-string, #description yt-formatted-string, #description-text');
      text = descEl?.textContent?.trim()?.slice(0, 800) || title;

      if (videoId) {
        imageUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    return {
      url: pageUrl,
      platform: 'youtube',
      title: title || 'YouTube Video',
      text: text || title || 'Saved YouTube Video',
      displayName: authorName || 'YouTube Creator',
      username: authorHandle || 'youtube',
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

    if (lower.includes('tutorial') || lower.includes('course') || lower.includes('how to') || lower.includes('guide')) {
      add('Tutorial', 'green');
    }
    if (lower.includes('ai') || lower.includes('llm') || lower.includes('gpt') || lower.includes('agent') || lower.includes('claude')) {
      add('AI', 'indigo');
    }
    if (lower.includes('code') || lower.includes('programming') || lower.includes('react') || lower.includes('next.js') || lower.includes('developer')) {
      add('Coding', 'cyan');
    }
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('animation') || lower.includes('3d')) {
      add('Design', 'pink');
    }
    if (lower.includes('finance') || lower.includes('stock') || lower.includes('money') || lower.includes('crypto')) {
      add('Finance', 'teal');
    }
    if (tags.length === 0) {
      tags.push({ name: 'Video', color: 'indigo' });
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
      platform: 'youtube',
      display_name: payload.displayName || 'YouTube Creator',
      username: payload.username ? payload.username.replace(/^@/, '') : 'youtube',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Video',
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

  function handleYtSuccess(buttonElement, toast, tags) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-yt-loading');
      buttonElement.classList.add('valut-yt-saved');
      const label = buttonElement.querySelector('span, .valut-yt-btn-label');
      if (label) label.textContent = 'Saved!';
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleYtError(buttonElement, toast, errMsg) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-yt-loading');
      const label = buttonElement.querySelector('span, .valut-yt-btn-label');
      if (label) label.textContent = 'Retry';
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveCurrentYouTubeVideo(buttonElement) {
    const videoData = extractYouTubeData();
    const toast = window.__valutToastManager?.showToast({
      title: videoData.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (buttonElement) {
      buttonElement.classList.add('valut-yt-loading');
      const label = buttonElement.querySelector('span, .valut-yt-btn-label');
      if (label) label.textContent = 'Saving...';
    }

    try {
      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(videoData);
        handleYtSuccess(buttonElement, toast, fallbackRes.result.tags);
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload: videoData }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(videoData);
            handleYtSuccess(buttonElement, toast, fallbackRes.result.tags);
          } catch (fbErr) {
            handleYtError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleYtSuccess(buttonElement, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave(videoData);
        handleYtSuccess(buttonElement, toast, fallbackRes.result.tags);
      } catch (fbErr) {
        handleYtError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  // 1. Inject into YouTube Watch Metadata Action Bar
  function injectWatchPageButton() {
    if (document.getElementById('valut-yt-watch-btn')) return;

    const candidates = [
      '#actions #top-level-buttons-computed',
      'ytd-watch-metadata #actions-inner #menu #top-level-buttons-computed',
      'ytd-menu-renderer #top-level-buttons-computed',
      'ytd-watch-metadata #actions',
      '#actions.ytd-watch-metadata',
      '#owner',
    ];

    let target = null;
    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el) {
        target = el;
        break;
      }
    }

    if (!target) return;

    const btn = document.createElement('button');
    btn.id = 'valut-yt-watch-btn';
    btn.className = 'valut-yt-btn';
    btn.innerHTML = `${VALUT_ICON_SVG} <span class="valut-yt-btn-label">Valut</span>`;
    btn.title = 'Save to Valut with AI Auto-Tags';

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(btn);
    });

    target.appendChild(btn);
  }

  // 2. Inject into YouTube Video Player Control Bar (.ytp-right-controls)
  function injectPlayerControlsButton() {
    if (document.getElementById('valut-yt-player-btn')) return;

    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls) return;

    const pBtn = document.createElement('button');
    pBtn.id = 'valut-yt-player-btn';
    pBtn.className = 'ytp-button valut-yt-player-control-btn';
    pBtn.innerHTML = VALUT_ICON_SVG;
    pBtn.title = 'Save Video to Valut with AI Tags';

    pBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(pBtn);
    });

    rightControls.insertBefore(pBtn, rightControls.firstChild);
  }

  // 3. Inject into YouTube Shorts Actions Bar
  function injectShortsButton() {
    const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
    if (!activeReel) return;

    const actionsContainer = activeReel.querySelector('#actions');
    if (!actionsContainer || activeReel.querySelector('.valut-shorts-btn')) return;

    const shortsBtn = document.createElement('div');
    shortsBtn.className = 'valut-shorts-btn';
    shortsBtn.innerHTML = `
      <div class="valut-shorts-icon-circle">
        ${VALUT_ICON_SVG}
      </div>
      <span class="valut-shorts-label">Valut</span>
    `;

    shortsBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(shortsBtn);
    });

    actionsContainer.appendChild(shortsBtn);
  }

  function runInjection() {
    if (window.location.pathname.includes('/watch') || window.location.search.includes('v=')) {
      injectWatchPageButton();
      injectPlayerControlsButton();
    } else if (window.location.pathname.includes('/shorts')) {
      injectShortsButton();
    }
  }

  // Active polling + MutationObserver for instant attachment during YouTube SPA transitions
  const observer = new MutationObserver(() => runInjection());
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  window.addEventListener('yt-navigate-finish', runInjection);
  window.addEventListener('yt-page-data-updated', runInjection);
  window.addEventListener('spfdone', runInjection);
  window.addEventListener('load', runInjection);

  setInterval(runInjection, 1000);
  runInjection();
})();
