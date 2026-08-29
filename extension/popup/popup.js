// Valut Popup JS
document.addEventListener('DOMContentLoaded', async () => {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const detectedPlatform = document.getElementById('detected-platform');
  const pageTitle = document.getElementById('page-title');
  const pageUrl = document.getElementById('page-url');
  const saveBtn = document.getElementById('save-current-btn');
  const saveIcon = document.getElementById('save-icon');
  const saveLabel = document.getElementById('save-label');
  const resultBox = document.getElementById('result-box');
  const generatedTags = document.getElementById('generated-tags');
  const toggleSettings = document.getElementById('toggle-settings');
  const settingsDrawer = document.getElementById('settings-drawer');
  const serverUrlInput = document.getElementById('server-url-input');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveConfigBtn = document.getElementById('save-config-btn');

  let currentTab = null;

  // 1. Load active tab details
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      currentTab = tabs[0];
      pageTitle.innerText = currentTab.title || 'Untitled Page';
      pageUrl.innerText = currentTab.url || '';

      // Detect platform
      const url = currentTab.url || '';
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        detectedPlatform.innerText = 'YouTube';
        detectedPlatform.style.color = '#ef4444';
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        detectedPlatform.innerText = 'X / Twitter';
        detectedPlatform.style.color = '#38bdf8';
      } else if (url.includes('reddit.com')) {
        detectedPlatform.innerText = 'Reddit';
        detectedPlatform.style.color = '#f97316';
      } else if (url.includes('github.com')) {
        detectedPlatform.innerText = 'GitHub';
        detectedPlatform.style.color = '#e4e4e7';
      } else {
        detectedPlatform.innerText = 'Web Article';
        detectedPlatform.style.color = '#10b981';
      }
    }
  } catch (err) {
    console.warn('Tab query error:', err);
  }

  // 2. Load stored config & test connection
  chrome.storage.sync.get(['serverUrl', 'apiKey'], async (data) => {
    const serverUrl = data.serverUrl || 'https://myvalut.vercel.app';
    serverUrlInput.value = serverUrl;
    apiKeyInput.value = data.apiKey || '';

    try {
      const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/extension/status`, {
        method: 'GET'
      });
      if (res.ok) {
        statusIndicator.className = 'status-badge connected';
        statusText.innerText = 'App Connected';
      } else {
        throw new Error();
      }
    } catch {
      statusIndicator.className = 'status-badge error';
      statusText.innerText = 'Offline (Start App)';
    }
  });

  // 3. Toggle settings drawer
  toggleSettings.addEventListener('click', () => {
    settingsDrawer.classList.toggle('hidden');
  });

  // 4. Save Config
  saveConfigBtn.addEventListener('click', () => {
    const serverUrl = serverUrlInput.value.trim() || 'http://localhost:3000';
    const apiKey = apiKeyInput.value.trim();

    chrome.storage.sync.set({ serverUrl, apiKey }, () => {
      saveConfigBtn.innerText = 'Saved!';
      setTimeout(() => {
        saveConfigBtn.innerText = 'Save Settings';
        settingsDrawer.classList.add('hidden');
      }, 1000);
    });
  });

  // 5. Save Current Page Button Click
  saveBtn.addEventListener('click', async () => {
    if (!currentTab || !currentTab.url) return;

    saveBtn.classList.add('saving');
    saveIcon.innerHTML = `<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>`;
    saveLabel.innerText = 'AI Categorizing...';

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'SAVE_BOOKMARK',
        data: {
          url: currentTab.url,
          title: currentTab.title
        }
      });

      if (response && response.success) {
        saveBtn.classList.remove('saving');
        saveBtn.classList.add('saved');
        saveIcon.innerHTML = `✓`;
        saveLabel.innerText = 'Saved to Valut';

        // Render AI tags
        const tags = response.tags || response.bookmark?.tags || [];
        if (tags.length > 0) {
          generatedTags.innerHTML = tags.map(t => `<span class="tag-badge">● ${t.name}</span>`).join('');
          resultBox.classList.remove('hidden');
        }
      } else {
        throw new Error(response?.error || 'Failed to save');
      }
    } catch (error) {
      saveBtn.classList.remove('saving');
      saveLabel.innerText = 'Save Failed';
      alert('Save Error: ' + error.message);
    }
  });
});
