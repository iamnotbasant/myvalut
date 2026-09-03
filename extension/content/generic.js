// Generic Web Content Script for Valut
(function () {
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
