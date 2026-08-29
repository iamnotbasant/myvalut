// YouTube Content Script for Valut
(function () {
  const BOOKMARK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  const SPINNER_ICON = `<svg class="valut-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

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
      <div class="valut-toast-icon">⚠️</div>
      <div class="valut-toast-body">
        <div class="valut-toast-title">Failed to save to Valut</div>
        <div class="valut-toast-desc">${errMessage || 'Make sure Valut app is running on localhost:3000'}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('valut-toast-hide');
      setTimeout(() => toast.remove(), 250);
    }, 4500);
  }

  async function handleSaveClick(button) {
    if (button.classList.contains('valut-saving')) return;

    button.classList.add('valut-saving');
    const iconEl = button.querySelector('.valut-yt-icon');
    const labelEl = button.querySelector('.valut-yt-label');

    if (iconEl) iconEl.innerHTML = SPINNER_ICON;
    if (labelEl) labelEl.innerText = 'Saving...';

    const videoUrl = window.location.href;

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'SAVE_BOOKMARK',
        data: {
          url: videoUrl,
          platform: 'youtube'
        }
      });

      if (response && response.success) {
        if (iconEl) iconEl.innerHTML = CHECK_ICON;
        if (labelEl) labelEl.innerText = 'Saved ✓';
        button.classList.remove('valut-saving');
        button.classList.add('valut-saved');

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || 'YouTube Video',
          response.tags || response.bookmark?.tags || []
        );

        setTimeout(() => {
          if (iconEl) iconEl.innerHTML = BOOKMARK_ICON;
          if (labelEl) labelEl.innerText = 'Valut';
          button.classList.remove('valut-saved');
        }, 3000);
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      if (iconEl) iconEl.innerHTML = BOOKMARK_ICON;
      if (labelEl) labelEl.innerText = 'Valut';
      button.classList.remove('valut-saving');
      showErrorToast(err.message);
    }
  }

  function injectYouTubeButtons() {
    if (!window.location.pathname.startsWith('/watch') && !window.location.pathname.startsWith('/shorts')) {
      return;
    }

    // 1. Inject into Main Actions Bar (next to Share, Download, Thanks, etc.)
    const actionsBar = document.querySelector('#actions-inner #top-level-buttons-computed') ||
      document.querySelector('ytd-watch-metadata #actions #top-level-buttons-computed') ||
      document.querySelector('#actions #top-level-buttons-computed');

    if (actionsBar && !actionsBar.querySelector('.valut-yt-btn')) {
      const btn = document.createElement('button');
      btn.className = 'valut-yt-btn';
      btn.title = 'Save video and generate AI tags in Valut';
      btn.innerHTML = `
        <span class="valut-yt-icon">${BOOKMARK_ICON}</span>
        <span class="valut-yt-label">Valut</span>
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSaveClick(btn);
      });

      // Insert as first button or before Share button
      actionsBar.insertBefore(btn, actionsBar.firstChild);
    }

    // 2. Inject into Video Player Control Bar
    const playerControls = document.querySelector('.ytp-right-controls') || document.querySelector('.ytp-left-controls');
    if (playerControls && !playerControls.querySelector('.valut-yt-player-btn')) {
      const playerBtn = document.createElement('button');
      playerBtn.className = 'valut-yt-player-btn ytp-button';
      playerBtn.title = 'Save to Valut (Alt+V)';
      playerBtn.innerHTML = BOOKMARK_ICON;
      playerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSaveClick(playerBtn);
      });
      playerControls.insertBefore(playerBtn, playerControls.firstChild);
    }
  }

  // Run on initial load and observe SPA DOM changes
  injectYouTubeButtons();

  const observer = new MutationObserver(() => {
    injectYouTubeButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // YouTube SPA page navigation events
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(injectYouTubeButtons, 500);
  });
})();
