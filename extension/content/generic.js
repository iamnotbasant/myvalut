// Generic Web Content Script for Valut
(function () {
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
