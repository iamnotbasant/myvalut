// Reddit Content Script for Valut
(function () {
  // 1. Exact Custom Valut Dashboard Bookmark Icon
  const VALUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z"/><path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z"/></svg>`;
  const SPINNER_ICON = `<svg class="valut-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="35 25" stroke-linecap="round" fill="none"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  function getCachedSavedUrls() {
    try {
      const item = localStorage.getItem('valut_saved_reddit_cache');
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
        localStorage.setItem('valut_saved_reddit_cache', JSON.stringify(list.slice(-500)));
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
      tagsHtml = `<div class="valut-tags-preview">${tags.map(t => `<span class="valut-tag-pill">● ${t.name}</span>`).join('')}</div>`;
    }

    toast.innerHTML = `
      <div class="valut-toast-icon">${CHECK_ICON}</div>
      <div class="valut-toast-body">
        <div class="valut-toast-title">${title}</div>
        <div class="valut-toast-desc">${desc}</div>
        ${tagsHtml}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('valut-toast-hide');
      setTimeout(() => toast.remove(), 250);
    }, 4000);
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
            platform: saveData.platform || 'reddit',
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

  async function checkRedditSaved(url) {
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

  function repairFragmentedUrls(str) {
    if (!str) return '';
    let res = str;
    res = res.replace(/(https?:\/\/)\s+([a-zA-Z0-9])/gi, '$1$2');
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

  function extractCleanRedditText(textEl, fallbackTitle) {
    if (!textEl) return fallbackTitle || '';
    const clone = textEl.cloneNode(true);

    const links = clone.querySelectorAll('a');
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').trim();
      const text = a.textContent ? a.textContent.trim() : '';
      const resolved = (href.startsWith('http://') || href.startsWith('https://')) ? href : text;
      a.replaceWith(document.createTextNode(resolved ? ` ${resolved} ` : text));
    });

    clone.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')));
    let raw = clone.textContent || '';
    raw = repairFragmentedUrls(raw);
    return raw
      .split('\n')
      .map(l => l.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .trim() || fallbackTitle || '';
  }

  async function handleSaveReddit(button, postUrl, postEl) {
    if (button.classList.contains('valut-saving')) return;

    if (button.classList.contains('valut-is-saved') || button.classList.contains('valut-saved')) {
      showToast('Already Saved in Valut!', 'This Reddit post is already saved in your Valut.');
      return;
    }

    button.classList.add('valut-saving');
    button.innerHTML = `${SPINNER_ICON} <span>Saving...</span>`;

    const titleEl = postEl ? postEl.querySelector('[slot="title"], h1, h2, a[data-click-id="body"], a[slot="full-post-link"]') : null;
    const title = titleEl ? repairFragmentedUrls((titleEl.innerText || titleEl.textContent || '').trim()) : document.title || 'Reddit Post';

    const authorEl = postEl ? postEl.querySelector('[slot="authorName"], a[href*="/user/"], [author]') : null;
    const username = authorEl ? (authorEl.innerText || authorEl.textContent || '').replace(/^u\//, '').trim() : 'reddit_user';

    const subredditEl = postEl ? postEl.querySelector('a[href*="/r/"]') : null;
    const displayName = subredditEl ? (subredditEl.innerText || subredditEl.textContent || '').trim() : 'Reddit';

    const textEl = postEl ? postEl.querySelector('[slot="text-body"], .RichTextJSON-root, [data-click-id="text"]') : null;
    const text = extractCleanRedditText(textEl, title);

    const imgEl = postEl ? postEl.querySelector('shreddit-media-lightbox img, img[alt="Post image"], img[src*="preview.redd.it"], img[src*="i.redd.it"]') : null;
    const imageUrl = imgEl ? imgEl.src : '';

    try {
      const response = await sendSaveRequest({
        url: postUrl,
        platform: 'reddit',
        title,
        text,
        displayName,
        username,
        imageUrl,
      });

      if (response && response.success) {
        addUrlToCache(postUrl);
        button.classList.remove('valut-saving');
        button.classList.add('valut-is-saved', 'valut-saved');
        button.innerHTML = `${VALUT_ICON} <span>Saved</span>`;
        button.title = 'Saved in Valut';

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || title || 'Reddit post saved',
          response.tags || response.bookmark?.tags || []
        );
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      button.innerHTML = `${VALUT_ICON} <span>Valut</span>`;
      button.classList.remove('valut-saving');
    }
  }

  // Universal Reddit Injector Supporting All Reddit Versions (2024-2026+)
  function injectRedditButtons() {
    // 1. Target shreddit-post custom elements
    const shredditPosts = document.querySelectorAll('shreddit-post:not([data-valut-done])');
    shredditPosts.forEach(post => {
      // Look for the action row or share button inside shreddit-post
      let actionRow =
        post.querySelector('[slot="action-row"]') ||
        post.querySelector('shreddit-post-action-row') ||
        post.querySelector('div[class*="action-row"]') ||
        post.querySelector('div[class*="items-center"][class*="flex"]');

      const shareBtn = post.querySelector('shreddit-post-share-button, button[aria-label*="share" i], [name="share-button"], button:has(svg[icon-name*="share"])');
      const targetContainer = shareBtn?.parentElement || actionRow;

      if (targetContainer && !post.querySelector('.valut-reddit-btn')) {
        post.setAttribute('data-valut-done', 'true');

        let postUrl = post.getAttribute('permalink')
          ? `https://www.reddit.com${post.getAttribute('permalink')}`
          : post.getAttribute('content-href') || window.location.href;

        const btn = document.createElement('button');
        btn.className = 'valut-reddit-btn';
        btn.title = 'Save to Valut (AI Tagging)';
        btn.setAttribute('aria-label', 'Save to Valut');
        btn.innerHTML = `${VALUT_ICON} <span>Valut</span>`;

        checkRedditSaved(postUrl).then(isSaved => {
          if (isSaved) {
            btn.classList.add('valut-is-saved', 'valut-saved');
            btn.innerHTML = `${VALUT_ICON} <span>Saved</span>`;
            btn.title = 'Saved in Valut';
          }
        });

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveReddit(btn, postUrl, post);
        });

        if (shareBtn && shareBtn.parentElement === targetContainer) {
          shareBtn.after(btn);
        } else {
          targetContainer.appendChild(btn);
        }
      }
    });

    // 2. Legacy / Classical / Fallback Reddit Action Bars
    const fallbackBars = document.querySelectorAll(
      '[data-testid="post-container"] [role="toolbar"]:not([data-valut-done]), div[id^="t3_"] [role="toolbar"]:not([data-valut-done]), article [role="group"]:not([data-valut-done])'
    );

    fallbackBars.forEach(bar => {
      bar.setAttribute('data-valut-done', 'true');
      const post = bar.closest('[data-testid="post-container"], div[id^="t3_"], article');
      const linkEl = post?.querySelector('a[data-click-id="comments"], a[data-click-id="body"], a[href*="/comments/"]');
      const postUrl = linkEl ? linkEl.href : window.location.href;

      if (!bar.querySelector('.valut-reddit-btn')) {
        const btn = document.createElement('button');
        btn.className = 'valut-reddit-btn';
        btn.title = 'Save to Valut (AI Tagging)';
        btn.innerHTML = `${VALUT_ICON} <span>Valut</span>`;

        checkRedditSaved(postUrl).then(isSaved => {
          if (isSaved) {
            btn.classList.add('valut-is-saved', 'valut-saved');
            btn.innerHTML = `${VALUT_ICON} <span>Saved</span>`;
          }
        });

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveReddit(btn, postUrl, post);
        });

        bar.appendChild(btn);
      }
    });
  }

  // Initial Injection
  setTimeout(injectRedditButtons, 300);
  setTimeout(injectRedditButtons, 1000);

  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(injectRedditButtons, 250);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
