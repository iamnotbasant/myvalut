// X / Twitter Content Script for Valut
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

  async function handleSaveTweet(button, tweetUrl) {
    if (button.classList.contains('valut-saving')) return;

    button.classList.add('valut-saving');
    button.innerHTML = SPINNER_ICON;

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'SAVE_BOOKMARK',
        data: {
          url: tweetUrl,
          platform: 'twitter'
        }
      });

      if (response && response.success) {
        button.innerHTML = CHECK_ICON;
        button.classList.remove('valut-saving');
        button.classList.add('valut-saved');

        showToast(
          'Saved to Valut!',
          response.bookmark?.title || response.bookmark?.text || 'Post saved',
          response.tags || response.bookmark?.tags || []
        );

        setTimeout(() => {
          button.innerHTML = BOOKMARK_ICON;
          button.classList.remove('valut-saved');
        }, 3000);
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Valut save error:', err);
      button.innerHTML = BOOKMARK_ICON;
      button.classList.remove('valut-saving');
    }
  }

  function injectTwitterButtons() {
    // Find all tweet action rows
    const actionGroups = document.querySelectorAll('article div[role="group"]:not([data-valut-injected])');

    actionGroups.forEach(group => {
      group.setAttribute('data-valut-injected', 'true');

      // Find tweet permalink
      const article = group.closest('article');
      const timeLink = article?.querySelector('time')?.closest('a');
      const tweetUrl = timeLink ? timeLink.href : window.location.href;

      const btnWrapper = document.createElement('div');
      btnWrapper.style.display = 'flex';
      btnWrapper.style.alignItems = 'center';

      const btn = document.createElement('button');
      btn.className = 'valut-x-btn';
      btn.title = 'Save to Valut (AI Tagging)';
      btn.innerHTML = BOOKMARK_ICON;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSaveTweet(btn, tweetUrl);
      });

      btnWrapper.appendChild(btn);
      group.appendChild(btnWrapper);
    });
  }

  injectTwitterButtons();

  const observer = new MutationObserver(() => {
    injectTwitterButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
