// Reddit Content Script for Valut
(function () {
  const BOOKMARK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-4.5 7 4.5V5c0-1.1-.9-2-2-2z"/></svg>`;
  const SPINNER_ICON = `<svg class="valut-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

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

  async function handleSaveReddit(button, postUrl) {
    if (button.classList.contains('valut-saving')) return;

    button.classList.add('valut-saving');
    button.innerHTML = `${SPINNER_ICON} <span>Saving...</span>`;

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'SAVE_BOOKMARK',
        data: {
          url: postUrl,
          platform: 'reddit'
        }
      });

      if (response && response.success) {
        button.innerHTML = `${CHECK_ICON} <span>Saved ✓</span>`;
        button.classList.remove('valut-saving');
        button.classList.add('valut-saved');

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || 'Reddit Post',
          response.tags || response.bookmark?.tags || []
        );

        setTimeout(() => {
          button.innerHTML = `${BOOKMARK_ICON} <span>Valut</span>`;
          button.classList.remove('valut-saved');
        }, 3000);
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      button.innerHTML = `${BOOKMARK_ICON} <span>Valut</span>`;
      button.classList.remove('valut-saving');
    }
  }

  function injectRedditButtons() {
    // New Reddit & Shreddit support
    const actionRows = document.querySelectorAll('shreddit-post, div[data-testid="post-container"]');

    actionRows.forEach(post => {
      if (post.getAttribute('data-valut-injected')) return;
      post.setAttribute('data-valut-injected', 'true');

      let targetBar = post.querySelector('div[slot="action-row"]') ||
        post.querySelector('div[data-click-id="comments"]')?.parentElement ||
        post.querySelector('.flex.items-center');

      if (!targetBar) return;

      const postPermalink = post.getAttribute('permalink')
        ? `https://www.reddit.com${post.getAttribute('permalink')}`
        : window.location.href;

      const btn = document.createElement('button');
      btn.className = 'valut-reddit-btn';
      btn.innerHTML = `${BOOKMARK_ICON} <span>Valut</span>`;
      btn.title = 'Save post to Valut (AI Tagging)';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSaveReddit(btn, postPermalink);
      });

      targetBar.appendChild(btn);
    });
  }

  injectRedditButtons();

  const observer = new MutationObserver(() => {
    injectRedditButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
