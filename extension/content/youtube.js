// YouTube Content Script for Valut
(function () {
  const BOOKMARK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-4.5 7 4.5V5c0-1.1-.9-2-2-2z"/></svg>`;
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
    }, 4500);
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
        <div class="valut-toast-title">Cannot connect to Valut</div>
        <div class="valut-toast-desc">${errMessage || 'Make sure your app is running ("npm run dev")'}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('valut-toast-hide');
      setTimeout(() => toast.remove(), 250);
    }, 5500);
  }

  async function handleSaveClick(button) {
    if (button.classList.contains('valut-saving')) return;

    button.classList.add('valut-saving');
    const iconEl = button.querySelector('.valut-yt-icon') || button.querySelector('.valut-player-icon-wrapper') || button;
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

    // 1. Inject into Actions Bar (EXACTLY AFTER THE SHARE BUTTON)
    const actionsBar = document.querySelector('#actions-inner #top-level-buttons-computed') ||
      document.querySelector('ytd-watch-metadata #actions #top-level-buttons-computed') ||
      document.querySelector('#actions #top-level-buttons-computed');

    if (actionsBar) {
      const existingBtn = actionsBar.querySelector('.valut-yt-btn');
      
      if (!existingBtn) {
        const btn = document.createElement('button');
        btn.className = 'valut-yt-btn';
        btn.title = 'Save to Valut with AI tags';
        btn.innerHTML = `
          <span class="valut-yt-icon">${BOOKMARK_ICON}</span>
          <span class="valut-yt-label">Valut</span>
        `;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveClick(btn);
        });

        // Find the Share button element
        let shareBtn = null;
        for (const child of actionsBar.children) {
          const text = (child.innerText || child.textContent || '').toLowerCase();
          const html = child.innerHTML.toLowerCase();
          if (text.includes('share') || html.includes('share') || child.querySelector('button[aria-label*="Share" i]')) {
            shareBtn = child;
            break;
          }
        }

        if (shareBtn) {
          shareBtn.after(btn);
        } else {
          // If share button is not yet rendered, insert after the like/dislike segmented group
          const likeGroup = actionsBar.querySelector('segmented-like-dislike-button-view-model') || actionsBar.firstElementChild;
          if (likeGroup && likeGroup.nextElementSibling) {
            likeGroup.nextElementSibling.after(btn);
          } else if (likeGroup) {
            likeGroup.after(btn);
          } else {
            actionsBar.appendChild(btn);
          }
        }
      } else {
        // Ensure it stays after Share button if DOM re-rendered
        let shareBtn = null;
        for (const child of actionsBar.children) {
          if (child === existingBtn) continue;
          const text = (child.innerText || child.textContent || '').toLowerCase();
          const html = child.innerHTML.toLowerCase();
          if (text.includes('share') || html.includes('share') || child.querySelector('button[aria-label*="Share" i]')) {
            shareBtn = child;
            break;
          }
        }
        if (shareBtn && shareBtn.nextElementSibling !== existingBtn) {
          shareBtn.after(existingBtn);
        }
      }
    }

    // 2. Inject into Video Player Control Bar (VERY FIRST ON THE RIGHT CONTROLS)
    const rightControls = document.querySelector('.ytp-right-controls');
    if (rightControls) {
      let playerBtn = rightControls.querySelector('.valut-yt-player-btn');
      if (!playerBtn) {
        playerBtn = document.createElement('button');
        playerBtn.className = 'valut-yt-player-btn ytp-button';
        playerBtn.title = 'Save to Valut (Alt+V)';
        playerBtn.innerHTML = `
          <div class="valut-player-icon-wrapper">
            ${BOOKMARK_ICON}
          </div>
        `;
        playerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSaveClick(playerBtn);
        });
        rightControls.prepend(playerBtn);
      } else if (rightControls.firstElementChild !== playerBtn) {
        rightControls.prepend(playerBtn);
      }
    }
  }

  // Run initial injection
  injectYouTubeButtons();

  // Continuous observer for YouTube dynamic SPA updates
  const observer = new MutationObserver(() => {
    injectYouTubeButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(injectYouTubeButtons, 400);
    setTimeout(injectYouTubeButtons, 1200);
  });
})();
