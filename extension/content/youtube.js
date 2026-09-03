// YouTube Content Script for Valut
(function () {
  // 1. Exact Custom Valut Dashboard Bookmark Icon (22x22 scale to match YouTube player icons)
  const VALUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z"/><path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z"/></svg>`;
  
  // Clean circular rotating stroke spinner
  const SPINNER_ICON = `<svg class="valut-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="35 25" stroke-linecap="round" fill="none"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  let currentVideoId = null;
  let isCurrentVideoSaved = false;
  let isCheckingStatus = false;

  // Extract YouTube Video ID from URL (strictly 11 chars)
  function getYouTubeVideoId(url = window.location.href) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.startsWith('/watch')) {
          const v = urlObj.searchParams.get('v');
          return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
        }
        if (urlObj.pathname.startsWith('/shorts/')) {
          const s = urlObj.pathname.split('/shorts/')[1]?.split(/[?#/]/)[0];
          return s && /^[a-zA-Z0-9_-]{11}$/.test(s) ? s : null;
        }
        if (urlObj.pathname.startsWith('/live/')) {
          const l = urlObj.pathname.split('/live/')[1]?.split(/[?#/]/)[0];
          return l && /^[a-zA-Z0-9_-]{11}$/.test(l) ? l : null;
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        const b = urlObj.pathname.slice(1).split(/[?#/]/)[0];
        return b && /^[a-zA-Z0-9_-]{11}$/.test(b) ? b : null;
      }
    } catch {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    return null;
  }

  // Local storage cache for instant 0ms check
  function getCachedSavedVideoIds() {
    try {
      const item = localStorage.getItem('valut_yt_saved_vids');
      if (!item) return [];
      const list = JSON.parse(item);
      return Array.isArray(list) ? list.filter(id => typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id)) : [];
    } catch {
      return [];
    }
  }

  function addVideoIdToCache(vid) {
    if (!vid || typeof vid !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(vid)) return;
    try {
      const list = getCachedSavedVideoIds();
      if (!list.includes(vid)) {
        list.push(vid);
        localStorage.setItem('valut_yt_saved_vids', JSON.stringify(list.slice(-500)));
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

  // Toast UI notification
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

  // Send Save Request to Extension or Fallback API
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
      'http://localhost:3001/api/extension/save',
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
            platform: saveData.platform || 'youtube',
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

    throw new Error('Please make sure your Valut app is open / running');
  }

  // Check if current video is saved in Valut
  async function checkVideoSaveStatus(videoId, url) {
    if (!videoId || typeof videoId !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return false;
    }
    if (isCheckingStatus) return isCurrentVideoSaved;
    isCheckingStatus = true;

    try {
      // 1. Local storage cache check
      const localCache = getCachedSavedVideoIds();
      if (localCache.includes(videoId)) {
        isCheckingStatus = false;
        return true;
      }

      // 2. Check through Chrome Runtime
      if (
        typeof chrome !== 'undefined' &&
        chrome.runtime &&
        typeof chrome.runtime.sendMessage === 'function' &&
        chrome.runtime.id
      ) {
        try {
          const response = await new Promise((resolve) => {
            chrome.runtime.sendMessage(
              {
                action: 'CHECK_BOOKMARK_SAVED',
                url: url || window.location.href,
                videoId: videoId,
              },
              (res) => {
                if (chrome.runtime.lastError) resolve(null);
                else resolve(res);
              }
            );
          });

          if (response && response.isSaved) {
            addVideoIdToCache(videoId);
            isCheckingStatus = false;
            return true;
          }
        } catch {}
      }

      // 3. Check directly via check API endpoint
      const candidateEndpoints = [
        'https://myvalut.vercel.app/api/extension/check',
        'http://localhost:3000/api/extension/check',
        'http://127.0.0.1:3000/api/extension/check',
      ];

      for (const endpoint of candidateEndpoints) {
        try {
          const res = await fetch(`${endpoint}?url=${encodeURIComponent(url || window.location.href)}&videoId=${encodeURIComponent(videoId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.isSaved) {
              addVideoIdToCache(videoId);
              isCheckingStatus = false;
              return true;
            }
          }
        } catch {}
      }
    } finally {
      isCheckingStatus = false;
    }

    return false;
  }

  // Apply visual state to video player button (Blue icon when saved, white when unsaved)
  function renderSaveState(isSaved) {
    isCurrentVideoSaved = isSaved;

    const playerBtn = document.querySelector('.valut-yt-player-btn');
    if (playerBtn) {
      const playerIcon = playerBtn.querySelector('.valut-player-icon-wrapper');
      if (isSaved) {
        playerBtn.classList.add('valut-is-saved');
        playerBtn.classList.add('valut-saved');
        playerBtn.title = 'Saved in Valut (Click to view options)';
        if (playerIcon) playerIcon.innerHTML = VALUT_ICON;
      } else {
        playerBtn.classList.remove('valut-is-saved', 'valut-saved');
        playerBtn.title = 'Save to Valut (Alt+V)';
        if (playerIcon) playerIcon.innerHTML = VALUT_ICON;
      }
    }
  }

  // Handle Save Click from Player Control Bar
  async function handleSaveClick(targetBtn) {
    if (targetBtn.classList.contains('valut-saving')) return;

    const vid = getYouTubeVideoId();
    const videoUrl = window.location.href;

    // If already saved, give user friendly confirmation
    if (targetBtn.classList.contains('valut-is-saved') || targetBtn.classList.contains('valut-saved')) {
      showToast('Already Saved in Valut!', 'This YouTube video is saved in your Valut bookmarks.');
      return;
    }

    targetBtn.classList.add('valut-saving');
    const iconEl = targetBtn.querySelector('.valut-player-icon-wrapper') || targetBtn;
    if (iconEl) iconEl.innerHTML = SPINNER_ICON;

    try {
      const response = await sendSaveRequest({
        url: videoUrl,
        platform: 'youtube',
      });

      if (response && response.success) {
        if (vid) addVideoIdToCache(vid);
        targetBtn.classList.remove('valut-saving');
        
        // Turn icon BLUE immediately!
        renderSaveState(true);

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || document.title || 'YouTube Video',
          response.tags || response.bookmark?.tags || []
        );
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      targetBtn.classList.remove('valut-saving');
      renderSaveState(isCurrentVideoSaved);
      showErrorToast(err.message);
    }
  }

  // Inject Video Player Control Bar Button Only
  function injectYouTubeButtons() {
    if (!window.location.pathname.startsWith('/watch') && !window.location.pathname.startsWith('/shorts')) {
      return;
    }

    // Clean up any action bar button next to Share button if present
    document.querySelectorAll('.valut-yt-wrapper, ytd-menu-renderer .valut-yt-btn').forEach(el => el.remove());

    const vid = getYouTubeVideoId();
    if (vid) {
      if (vid !== currentVideoId) {
        currentVideoId = vid;
        // Immediately reset to false (unsaved / white) on new video!
        isCurrentVideoSaved = false;
        renderSaveState(false);

        const localCache = getCachedSavedVideoIds();
        if (localCache.includes(vid)) {
          isCurrentVideoSaved = true;
          renderSaveState(true);
        } else {
          checkVideoSaveStatus(vid, window.location.href).then(saved => {
            if (vid === currentVideoId) {
              renderSaveState(saved);
            }
          });
        }
      }
    }

    // Video Player Control Bar Button (Bottom Right)
    const rightControls = document.querySelector('.ytp-right-controls');
    if (rightControls) {
      let playerBtn = rightControls.querySelector('.valut-yt-player-btn');
      if (!playerBtn) {
        playerBtn = document.createElement('button');
        playerBtn.className = 'valut-yt-player-btn ytp-button';
        if (isCurrentVideoSaved) playerBtn.classList.add('valut-is-saved', 'valut-saved');
        playerBtn.title = isCurrentVideoSaved ? 'Saved in Valut' : 'Save to Valut (Alt+V)';
        playerBtn.setAttribute('aria-label', 'Save to Valut');
        playerBtn.innerHTML = `
          <div class="valut-player-icon-wrapper">
            ${VALUT_ICON}
          </div>
        `;
        playerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveClick(playerBtn);
        });
        rightControls.prepend(playerBtn);
      }
    }
  }

  // Initial Injection
  setTimeout(injectYouTubeButtons, 200);

  // Debounced execution
  let debounceTimer = null;
  function debouncedInject(delay = 300) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(injectYouTubeButtons, delay);
  }

  // Safe Observer that ignores mutations from Valut's own elements
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const m of mutations) {
      if (m.target) {
        const el = m.target;
        if (el.nodeType === 1) {
          if (el.classList?.contains('valut-yt-player-btn') || el.closest?.('.valut-yt-player-btn, .valut-toast-container')) {
            continue;
          }
        }
      }
      shouldCheck = true;
      break;
    }
    if (shouldCheck) {
      debouncedInject(350);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // YouTube navigation event listeners
  window.addEventListener('yt-navigate-finish', () => {
    debouncedInject(200);
    debouncedInject(800);
  });

  window.addEventListener('yt-page-data-updated', () => {
    debouncedInject(200);
  });

  window.addEventListener('popstate', () => {
    debouncedInject(200);
  });
})();
