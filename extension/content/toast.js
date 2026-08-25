// Valut Toast Notification & Sound Manager for Content Scripts
(function () {
  if (window.__valutToastManager) return;

  function playSaveChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Note 1: C6 (1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: G6 (1567.98 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.08);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.15, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function createToastContainer() {
    let container = document.getElementById('valut-toast-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'valut-toast-root';
      container.className = 'valut-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(options) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = 'valut-toast';

    const defaultTitle = options.title || 'Valut Bookmark';
    const serverUrl = options.serverUrl || 'https://myvalut.vercel.app';

    toast.innerHTML = `
      <div class="valut-toast-header">
        <div class="valut-toast-brand">
          <div class="valut-toast-logo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" fill="#ffffff"/>
            </svg>
          </div>
          <span>Valut</span>
        </div>
        <button class="valut-toast-close" title="Close">✕</button>
      </div>
      <div class="valut-toast-body">
        <div class="valut-toast-title">${escapeHtml(defaultTitle)}</div>
        <div class="valut-toast-status">
          ${options.loading ? '<span class="valut-spinner"></span>' : ''}
          <span class="valut-status-text">${escapeHtml(options.status || 'Saving to vault with smart tags...')}</span>
        </div>
        <div class="valut-toast-tags" style="display: none;"></div>
      </div>
      <div class="valut-toast-footer" style="display: none;">
        <span style="color: #64748b; font-size: 11px;">Saved to your vault</span>
        <a href="${serverUrl}" target="_blank" class="valut-toast-btn">Open Valut ↗</a>
      </div>
    `;

    container.appendChild(toast);

    // Entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('valut-toast-visible');
    });

    const closeBtn = toast.querySelector('.valut-toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    function dismissToast(target) {
      target.classList.remove('valut-toast-visible');
      target.classList.add('valut-toast-hiding');
      setTimeout(() => {
        if (target.parentNode) target.parentNode.removeChild(target);
      }, 300);
    }

    // Return controller methods
    return {
      updateSuccess(data) {
        playSaveChime();
        const statusEl = toast.querySelector('.valut-status-text');
        const spinner = toast.querySelector('.valut-spinner');
        const tagsContainer = toast.querySelector('.valut-toast-tags');
        const footer = toast.querySelector('.valut-toast-footer');

        if (spinner) spinner.remove();
        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color: #4ade80; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              ✓ Saved to Valut!
            </span>
          `;
        }

        if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
          tagsContainer.style.display = 'flex';
          tagsContainer.innerHTML = data.tags
            .map(
              t =>
                `<span class="valut-tag-badge"><span class="valut-toast-dot bg-${escapeHtml(t.color || 'blue')}"></span>${escapeHtml(t.name)}</span>`
            )
            .join('');
        }

        if (footer) {
          footer.style.display = 'flex';
        }

        // Auto dismiss after 3 seconds so it doesn't block the screen
        setTimeout(() => dismissToast(toast), 3000);
      },
      updateError(errorMessage) {
        const statusEl = toast.querySelector('.valut-status-text');
        const spinner = toast.querySelector('.valut-spinner');
        if (spinner) spinner.remove();
        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color: #f87171; font-weight: 500;">
              ✕ Failed: ${escapeHtml(errorMessage || 'Could not save')}
            </span>
          `;
        }
        setTimeout(() => dismissToast(toast), 4000);
      },
      dismiss() {
        dismissToast(toast);
      },
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
    playSaveChime,
  };
})();
