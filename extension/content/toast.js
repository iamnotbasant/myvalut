// Valut Notification & Event Manager (Silent Mode - No Screen Popups)
(function () {
  if (window.__valutToastManager) return;

  function showToast(options) {
    // Silent mode: Do not render screen-covering popup cards.
    // The button on YouTube/Twitter/Reddit will show "Saved!" inline.
    return {
      updateSuccess(data) {
        // Silent success
      },
      updateError(errorMessage) {
        console.warn('Valut save error:', errorMessage);
      },
      dismiss() {},
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.__valutToastManager = {
    showToast,
    escapeHtml,
    playSaveChime: () => {},
  };
})();
