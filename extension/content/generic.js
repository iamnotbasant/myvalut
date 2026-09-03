// Generic Web Content Script for Valut
(function () {
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
      setTimeout(() => toast.remove(), 260);
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

  // Listen for messages from background (e.g. keyboard shortcut or context menu)
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'SAVE_SUCCESS') {
      showToast(
        'Saved to Valut!',
        request.bookmark?.title || document.title,
        request.tags || request.bookmark?.tags || []
      );
    }
  });
})();
