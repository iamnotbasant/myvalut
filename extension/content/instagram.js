// Instagram Content Script for Valut
(function () {
  // 1. Exact Custom Valut Dashboard Bookmark Icon (24x24 scale for Instagram)
  const VALUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z"/><path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z"/></svg>`;
  const SPINNER_ICON = `<svg class="valut-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="35 25" stroke-linecap="round" fill="none"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  function getCachedSavedUrls() {
    try {
      const item = localStorage.getItem('valut_saved_ig_cache');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  }

  function addUrlToCache(url) {
    if (!url) return;
    try {
      const list = getCachedSavedUrls();
      if (!list.includes(url)) {
        list.push(url);
        localStorage.setItem('valut_saved_ig_cache', JSON.stringify(list.slice(-500)));
      }
    } catch {}
  }

  const COLOR_MAP = {
    violet: { bg: 'rgba(139, 92, 246, 0.16)', border: 'rgba(139, 92, 246, 0.35)', text: '#c4b5fd', dot: '#a78bfa' },
    teal: { bg: 'rgba(20, 184, 166, 0.16)', border: 'rgba(20, 184, 166, 0.35)', text: '#5eead4', dot: '#2dd4bf' },
    amber: { bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.35)', text: '#fcd34d', dot: '#fbbf24' },
    green: { bg: 'rgba(16, 185, 129, 0.16)', border: 'rgba(16, 185, 129, 0.35)', text: '#6ee7b7', dot: '#34d399' },
    indigo: { bg: 'rgba(99, 102, 241, 0.16)', border: 'rgba(99, 102, 241, 0.35)', text: '#a5b4fc', dot: '#818cf8' },
    orange: { bg: 'rgba(249, 115, 22, 0.16)', border: 'rgba(249, 115, 22, 0.35)', text: '#fdba74', dot: '#fb923c' },
    pink: { bg: 'rgba(236, 72, 153, 0.16)', border: 'rgba(236, 72, 153, 0.35)', text: '#f472b6', dot: '#f43f5e' },
    blue: { bg: 'rgba(59, 130, 246, 0.16)', border: 'rgba(59, 130, 246, 0.35)', text: '#93c5fd', dot: '#60a5fa' },
    cyan: { bg: 'rgba(6, 182, 212, 0.16)', border: 'rgba(6, 182, 212, 0.35)', text: '#67e8f9', dot: '#22d3ee' },
    red: { bg: 'rgba(239, 68, 68, 0.16)', border: 'rgba(239, 68, 68, 0.35)', text: '#fca5a5', dot: '#f87171' },
  };

  function showToast(title, desc, tags = []) {
    let container = document.querySelector('.valut-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'valut-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'valut-toast valut-toast-success';

    let tagsHtml = '';
    if (tags && tags.length > 0) {
      tagsHtml = `<div class="valut-tags-preview">
        ${tags.map((t, idx) => {
          const theme = COLOR_MAP[t.color] || COLOR_MAP.violet;
          return `<span class="valut-tag-pill" style="--tag-bg: ${theme.bg}; --tag-border: ${theme.border}; --tag-text: ${theme.text}; --tag-dot: ${theme.dot}; animation-delay: ${idx * 65 + 160}ms;">
            <span class="valut-tag-dot"></span>
            <span class="valut-tag-name">${t.name}</span>
          </span>`;
        }).join('')}
      </div>`;
    }

    const cleanDesc = desc ? desc.replace(/\n+/g, ' ').trim() : '';

    toast.innerHTML = `
      <div class="valut-toast-shimmer"></div>
      <div class="valut-toast-icon-wrapper">
        <div class="valut-icon-pulse-ring"></div>
        <div class="valut-toast-icon">
          <svg class="valut-check-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div class="valut-toast-body">
        <div class="valut-toast-header">
          <span class="valut-toast-title">${title || 'Saved to Valut'}</span>
          ${tags && tags.length > 0 ? '<span class="valut-ai-badge">✦ AI Tagged</span>' : ''}
        </div>
        ${cleanDesc ? `<div class="valut-toast-desc">${cleanDesc}</div>` : ''}
        ${tagsHtml}
      </div>
      <button class="valut-toast-close" title="Close" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="valut-toast-progress">
        <div class="valut-toast-progress-bar"></div>
      </div>
    `;

    const closeBtn = toast.querySelector('.valut-toast-close');
    let hideTimeout;

    const dismissToast = () => {
      if (toast.classList.contains('valut-toast-hide')) return;
      toast.classList.add('valut-toast-hide');
      setTimeout(() => toast.remove(), 280);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(hideTimeout);
        dismissToast();
      });
    }

    container.appendChild(toast);

    let remainingTime = 4200;
    let startTime = Date.now();

    const startTimer = () => {
      startTime = Date.now();
      hideTimeout = setTimeout(dismissToast, remainingTime);
    };

    toast.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      remainingTime -= (Date.now() - startTime);
      if (remainingTime < 1000) remainingTime = 1000;
    });

    toast.addEventListener('mouseleave', () => {
      startTimer();
    });

    startTimer();
  }

  function showErrorToast(errMessage) {
    let container = document.querySelector('.valut-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'valut-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'valut-toast valut-toast-error';

    toast.innerHTML = `
      <div class="valut-toast-icon-wrapper">
        <div class="valut-icon-pulse-ring"></div>
        <div class="valut-toast-icon">!</div>
      </div>
      <div class="valut-toast-body">
        <div class="valut-toast-header">
          <span class="valut-toast-title">Save Failed</span>
        </div>
        <div class="valut-toast-desc">${errMessage || 'Could not connect to Valut'}</div>
      </div>
      <button class="valut-toast-close" title="Close" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="valut-toast-progress">
        <div class="valut-toast-progress-bar"></div>
      </div>
    `;

    const closeBtn = toast.querySelector('.valut-toast-close');
    let hideTimeout;

    const dismissToast = () => {
      if (toast.classList.contains('valut-toast-hide')) return;
      toast.classList.add('valut-toast-hide');
      setTimeout(() => toast.remove(), 280);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(hideTimeout);
        dismissToast();
      });
    }

    container.appendChild(toast);
    hideTimeout = setTimeout(dismissToast, 5000);
  }

  async function sendSaveRequest(saveData) {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      typeof chrome.runtime.sendMessage === 'function' &&
      chrome.runtime.id
    ) {
      try {
        const response = await new Promise((resolve) => {
          try {
            chrome.runtime.sendMessage(
              {
                action: 'SAVE_BOOKMARK',
                data: saveData,
              },
              (res) => {
                if (chrome.runtime.lastError) {
                  resolve(null);
                } else {
                  resolve(res);
                }
              }
            );
          } catch {
            resolve(null);
          }
        });
        if (response && response.success) {
          return response;
        }
      } catch {}
    }

    const candidateEndpoints = [
      'https://myvalut.vercel.app/api/extension/save',
      'http://localhost:3000/api/extension/save',
      'http://127.0.0.1:3000/api/extension/save',
    ];

    for (const endpoint of candidateEndpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: saveData.url,
            platform: 'instagram',
            title: saveData.title,
            text: saveData.text,
            displayName: saveData.displayName,
            username: saveData.username,
            imageUrl: saveData.imageUrl,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            return json;
          }
        }
      } catch {}
    }

    throw new Error('Please make sure Valut is running');
  }

  async function checkInstagramSaved(url) {
    if (!url) return false;
    const cache = getCachedSavedUrls();
    if (cache.some(u => url.includes(u) || u.includes(url))) {
      return true;
    }

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: 'CHECK_BOOKMARK_SAVED', url },
            (res) => {
              if (chrome.runtime.lastError) resolve(null);
              else resolve(res);
            }
          );
        });
        if (response && response.isSaved) {
          addUrlToCache(url);
          return true;
        }
      } catch {}
    }
    return false;
  }

  async function handleSaveInstagram(button, postUrl, containerEl) {
    if (button.classList.contains('valut-saving')) return;

    if (button.classList.contains('valut-is-saved') || button.classList.contains('valut-saved')) {
      showToast('Already Saved in Valut!', 'This Instagram post is saved in your Valut.');
      return;
    }

    button.classList.add('valut-saving');
    button.innerHTML = SPINNER_ICON;

    const usernameEl = containerEl ? containerEl.querySelector('header a[href^="/"], a[role="link"][href^="/"]') : null;
    const username = usernameEl ? (usernameEl.innerText || usernameEl.textContent || '').trim().replace('/', '') : 'instagram_user';

    const captionEl = containerEl ? containerEl.querySelector('h1, span._ap3a, div._a9zs, span[dir="auto"]') : null;
    const text = captionEl ? (captionEl.innerText || captionEl.textContent || '').trim() : '';
    const title = text ? (text.length > 80 ? `${text.slice(0, 80)}...` : text) : `Instagram post by @${username}`;

    const imgEl = containerEl ? containerEl.querySelector('img[src*="cdninstagram"], img[srcset], video') : null;
    const imageUrl = imgEl ? (imgEl.src || imgEl.getAttribute('poster') || '') : '';

    try {
      const response = await sendSaveRequest({
        url: postUrl,
        platform: 'instagram',
        title,
        text,
        displayName: `@${username}`,
        username,
        imageUrl,
      });

      if (response && response.success) {
        addUrlToCache(postUrl);
        button.classList.remove('valut-saving');
        button.classList.add('valut-is-saved', 'valut-saved');
        button.innerHTML = VALUT_ICON;
        button.title = 'Saved in Valut';

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || title,
          response.tags || response.bookmark?.tags || []
        );
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      button.innerHTML = VALUT_ICON;
      button.classList.remove('valut-saving');
    }
  }

  // Inject buttons on Instagram Feed Posts and Reels
  function injectInstagramButtons() {
    // 1. Feed Posts & Dialogs (Image 2)
    const actionSections = document.querySelectorAll('section:not([data-valut-injected])');
    actionSections.forEach(section => {
      const likeOrShareBtn = section.querySelector(
        'button svg[aria-label*="Like" i], button svg[aria-label*="Comment" i], button svg[aria-label*="Share" i], svg[aria-label*="Direct" i], svg[aria-label*="Save" i]'
      );

      if (likeOrShareBtn && !section.querySelector('.valut-ig-btn')) {
        section.setAttribute('data-valut-injected', 'true');

        const article = section.closest('article, div[role="dialog"], div[role="presentation"], main');
        const linkEl = article?.querySelector('a[href*="/p/"], a[href*="/reel/"]');
        const postUrl = linkEl ? linkEl.href : window.location.href;

        const btn = document.createElement('button');
        btn.className = 'valut-ig-btn';
        btn.title = 'Save to Valut (AI Tagging)';
        btn.setAttribute('aria-label', 'Save to Valut');
        btn.innerHTML = VALUT_ICON;

        checkInstagramSaved(postUrl).then(isSaved => {
          if (isSaved) {
            btn.classList.add('valut-is-saved', 'valut-saved');
            btn.title = 'Saved in Valut';
          }
        });

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveInstagram(btn, postUrl, article);
        });

        // Insert right after the save ribbon or after the share icon
        const saveIcon = section.querySelector('svg[aria-label*="Save" i], svg[aria-label*="Remove" i]');
        if (saveIcon) {
          const saveBtn = saveIcon.closest('button') || saveIcon.parentElement;
          saveBtn.before(btn);
        } else {
          section.appendChild(btn);
        }
      }
    });

    // 2. Instagram Reels (Image 3)
    const reelSidebars = document.querySelectorAll(
      'div[class*="x1pi30zi"]:not([data-valut-injected]), div[role="button"]:has(svg[aria-label*="Like" i])'
    );

    document.querySelectorAll('div:has(> div > div > button svg[aria-label*="Share" i])').forEach(reelGroup => {
      if (!reelGroup.getAttribute('data-valut-injected') && !reelGroup.querySelector('.valut-ig-reel-btn')) {
        reelGroup.setAttribute('data-valut-injected', 'true');

        const reelContainer = reelGroup.closest('div[role="dialog"], main, article, section') || reelGroup.parentElement;
        const postUrl = window.location.href;

        const btn = document.createElement('button');
        btn.className = 'valut-ig-reel-btn';
        btn.title = 'Save to Valut (AI Tagging)';
        btn.setAttribute('aria-label', 'Save to Valut');
        btn.innerHTML = VALUT_ICON;

        checkInstagramSaved(postUrl).then(isSaved => {
          if (isSaved) {
            btn.classList.add('valut-is-saved', 'valut-saved');
            btn.title = 'Saved in Valut';
          }
        });

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveInstagram(btn, postUrl, reelContainer);
        });

        reelGroup.appendChild(btn);
      }
    });
  }

  // Initial Injection
  setTimeout(injectInstagramButtons, 300);
  setTimeout(injectInstagramButtons, 1000);

  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(injectInstagramButtons, 250);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
