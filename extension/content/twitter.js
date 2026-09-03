// X / Twitter Content Script for Valut
(function () {
  // 1. Exact Custom Valut Dashboard Bookmark Icon
  const VALUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z"/><path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z"/></svg>`;
  const SPINNER_ICON = `<svg class="valut-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="35 25" stroke-linecap="round" fill="none"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  function getCachedSavedUrls() {
    try {
      const item = localStorage.getItem('valut_saved_urls_cache');
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
        localStorage.setItem('valut_saved_urls_cache', JSON.stringify(list.slice(-500)));
      }
    } catch {}
  }

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
          return `<span class="valut-tag-pill" style="animation-delay: ${idx * 40 + 80}ms;">
            <span class="valut-tag-dot"></span>
            <span class="valut-tag-name">${t.name}</span>
          </span>`;
        }).join('')}
      </div>`;
    }

    const cleanDesc = desc ? desc.replace(/\n+/g, ' ').trim() : '';

    toast.innerHTML = `
      <div class="valut-toast-icon-wrapper">
        <div class="valut-toast-icon">
          <svg class="valut-check-svg" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div class="valut-toast-body">
        <div class="valut-toast-header">
          <span class="valut-toast-title">${title || 'Saved to Valut!'}</span>
        </div>
        ${cleanDesc ? `<div class="valut-toast-desc">${cleanDesc}</div>` : ''}
        ${tagsHtml}
      </div>
      <button class="valut-toast-close" title="Close" aria-label="Close">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
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
        } else if (response && response.error) {
          throw new Error(response.error);
        }
      } catch (e) {
        if (e && e.message && !e.message.toLowerCase().includes('offline')) {
          throw e;
        }
      }
    }

    const candidateEndpoints = [
      'https://myvalut.vercel.app/api/extension/save',
      'http://localhost:3000/api/extension/save',
      'http://127.0.0.1:3000/api/extension/save',
      'http://localhost:3001/api/extension/save',
    ];

    let lastFetchErr = null;
    for (const endpoint of candidateEndpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: saveData.url,
            platform: saveData.platform || 'twitter',
            title: saveData.title,
            text: saveData.text,
            displayName: saveData.displayName,
            username: saveData.username,
            avatarUrl: saveData.avatarUrl,
            imageUrl: saveData.imageUrl,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            return json;
          } else {
            lastFetchErr = new Error(json.error || 'Failed to save');
          }
        } else {
          try {
            const errJson = await res.json();
            lastFetchErr = new Error(errJson.error || `Server responded with ${res.status}`);
          } catch {
            lastFetchErr = new Error(`Server responded with ${res.status}`);
          }
        }
      } catch (err) {
        lastFetchErr = err;
      }
    }

    throw lastFetchErr || new Error('Please make sure Valut is running');
  }

  async function checkTweetSaved(tweetUrl) {
    if (!tweetUrl) return false;
    const cache = getCachedSavedUrls();
    if (cache.some(u => tweetUrl.includes(u) || u.includes(tweetUrl))) {
      return true;
    }

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: 'CHECK_BOOKMARK_SAVED', url: tweetUrl },
            (res) => {
              if (chrome.runtime.lastError) resolve(null);
              else resolve(res);
            }
          );
        });
        if (response && response.isSaved) {
          addUrlToCache(tweetUrl);
          return true;
        }
      } catch {}
    }
    return false;
  }

  function repairFragmentedUrls(str) {
    if (!str) return '';
    let res = str;
    // Fix dangling protocol: "https://\n  domain" or "https:// domain"
    res = res.replace(/(https?:\/\/)\s+([a-zA-Z0-9])/gi, '$1$2');
    // Fix multi-line URL breaks
    for (let i = 0; i < 5; i++) {
      const prev = res;
      res = res.replace(
        /(https?:\/\/[^\s\n]+)\n([a-zA-Z0-9_\-.~!*'();:@&=+$,/?%#[\]]+)/gi,
        '$1$2'
      );
      if (res === prev) break;
    }
    return res;
  }

  function extractCleanTweetText(tweetTextEl) {
    if (!tweetTextEl) return '';
    const clone = tweetTextEl.cloneNode(true);

    // 1. Process <a> tags inside tweet text
    const links = clone.querySelectorAll('a');
    links.forEach(a => {
      // Concatenate inner span texts to get the displayed URL without layout breaks
      const spanText = Array.from(a.querySelectorAll('span'))
        .map(s => s.textContent || '')
        .join('')
        .trim();

      const titleAttr = (a.getAttribute('title') || '').trim();
      const href = (a.getAttribute('href') || '').trim();

      let resolvedUrl = '';
      if (titleAttr.startsWith('http://') || titleAttr.startsWith('https://')) {
        resolvedUrl = titleAttr;
      } else if (spanText && (spanText.startsWith('http://') || spanText.startsWith('https://') || spanText.includes('.'))) {
        resolvedUrl = spanText;
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        resolvedUrl = href;
      } else if (a.textContent) {
        resolvedUrl = a.textContent.trim();
      }

      // Remove accidental internal whitespaces in the URL
      resolvedUrl = resolvedUrl.replace(/\s+/g, '');

      const textNode = document.createTextNode(resolvedUrl ? ` ${resolvedUrl} ` : (a.textContent || ''));
      a.replaceWith(textNode);
    });

    // 2. Replace emoji images with their alt text
    const emojis = clone.querySelectorAll('img[alt]');
    emojis.forEach(img => {
      const alt = img.getAttribute('alt') || '';
      img.replaceWith(document.createTextNode(alt));
    });

    // 3. Replace <br> with newlines
    const brs = clone.querySelectorAll('br');
    brs.forEach(br => {
      br.replaceWith(document.createTextNode('\n'));
    });

    // 4. Extract raw textContent (does not insert layout-based breaks between spans)
    let rawText = clone.textContent || '';

    // 5. Repair any fragmented protocol or URL breaks
    rawText = repairFragmentedUrls(rawText);

    // 6. Clean up excessive spaces while preserving intended newlines
    rawText = rawText
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return rawText;
  }

  async function handleSaveTweet(button, tweetUrl) {
    if (button.classList.contains('valut-saving')) return;

    if (button.classList.contains('valut-is-saved') || button.classList.contains('valut-saved')) {
      showToast('Already Saved in Valut!', 'This post is already saved in your Valut.');
      return;
    }

    button.classList.add('valut-saving');
    button.innerHTML = SPINNER_ICON;

    const article = button.closest('article');
    const tweetTextEl = article ? article.querySelector('[data-testid="tweetText"]') : null;
    const text = extractCleanTweetText(tweetTextEl);

    const userNameEl = article ? article.querySelector('[data-testid="User-Name"]') : null;
    const displayName = userNameEl ? (userNameEl.querySelector('span')?.innerText || '').trim() : '';
    const userLink = userNameEl ? userNameEl.querySelector('a[href^="/"]') : null;
    const username = userLink ? (userLink.getAttribute('href') || '').replace('/', '').split('/')[0] : '';

    const avatarImg = article ? article.querySelector('img[src*="profile_images"]') : null;
    const avatarUrl = avatarImg ? avatarImg.src : '';

    const photoImg = article ? article.querySelector('[data-testid="tweetPhoto"] img') : null;
    const imageUrl = photoImg ? photoImg.src : '';

    try {
      const response = await sendSaveRequest({
        url: tweetUrl,
        platform: 'twitter',
        title: '',
        text,
        displayName,
        username,
        avatarUrl,
        imageUrl,
      });

      if (response && response.success) {
        addUrlToCache(tweetUrl);
        button.innerHTML = VALUT_ICON;
        button.classList.remove('valut-saving');
        button.classList.add('valut-is-saved', 'valut-saved');
        button.title = 'Saved in Valut';

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || response.bookmark?.text || 'Post saved',
          response.tags || response.bookmark?.tags || []
        );
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      button.innerHTML = VALUT_ICON;
      button.classList.remove('valut-saving');
      showErrorToast(err.message || 'Failed to save post');
    }
  }

  function injectTwitterButtons() {
    const actionGroups = document.querySelectorAll('article div[role="group"]:not([data-valut-injected])');

    actionGroups.forEach(group => {
      group.setAttribute('data-valut-injected', 'true');

      const article = group.closest('article');
      const timeLink = article?.querySelector('time')?.closest('a');
      const rawUrl = timeLink ? timeLink.href : window.location.href;
      const tweetUrl = rawUrl ? rawUrl.split('?')[0] : window.location.href;

      const btnWrapper = document.createElement('div');
      btnWrapper.style.display = 'flex';
      btnWrapper.style.alignItems = 'center';

      const btn = document.createElement('button');
      btn.className = 'valut-x-btn';
      btn.title = 'Save to Valut (AI Tagging)';
      btn.innerHTML = VALUT_ICON;

      // Check if already saved
      checkTweetSaved(tweetUrl).then(isSaved => {
        if (isSaved) {
          btn.classList.add('valut-is-saved', 'valut-saved');
          btn.title = 'Saved in Valut';
        }
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSaveTweet(btn, tweetUrl);
      });

      btnWrapper.appendChild(btn);
      group.appendChild(btnWrapper);
    });
  }

  // Initial Injection
  setTimeout(injectTwitterButtons, 300);

  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(injectTwitterButtons, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
