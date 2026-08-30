// X / Twitter Content Script for Valut
(function () {
  const BOOKMARK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z"/><path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z"/></svg>`;
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
      } catch {
        // Fall through
      }
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
            platform: saveData.platform || 'twitter',
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

    throw new Error('Please refresh this page (Extension updated)');
  }

  async function handleSaveTweet(button, tweetUrl) {
    if (button.classList.contains('valut-saving')) return;

    button.classList.add('valut-saving');
    button.innerHTML = SPINNER_ICON;

    try {
      const response = await sendSaveRequest({
        url: tweetUrl,
        platform: 'twitter',
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
