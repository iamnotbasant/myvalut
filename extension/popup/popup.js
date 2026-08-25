// Valut Extension Popup Controller
const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  const statusDot = document.getElementById('server-status-dot');
  const statusText = document.getElementById('server-status-text');

  const platformBadge = document.getElementById('platform-badge');
  const platformIconCircle = document.getElementById('platform-icon-circle');
  const pageHostname = document.getElementById('page-hostname');
  const pageTitle = document.getElementById('page-title');
  const pageDesc = document.getElementById('page-text');
  const pageImage = document.getElementById('page-image');
  const pageImageWrapper = document.getElementById('page-image-wrapper');
  const videoOverlay = document.getElementById('video-overlay');
  const tagsPreview = document.getElementById('tags-preview');
  const customNote = document.getElementById('custom-note');
  const btnSave = document.getElementById('btn-save-current');
  const btnSaveText = document.getElementById('btn-save-text');

  const recentList = document.getElementById('recent-list');
  const recentCount = document.getElementById('recent-count');
  const inputServerUrl = document.getElementById('setting-server-url');
  const inputGeminiKey = document.getElementById('setting-gemini-key');
  const inputAutoTag = document.getElementById('setting-auto-tag');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const linkOpenDashboard = document.getElementById('link-open-dashboard');
  const presetVercel = document.getElementById('preset-vercel');
  const presetLocalhost = document.getElementById('preset-localhost');

  // Account Elements
  const accountLoggedIn = document.getElementById('account-logged-in');
  const accountLoggedOut = document.getElementById('account-logged-out');
  const userAvatarBadge = document.getElementById('user-avatar-badge');
  const userEmailText = document.getElementById('user-email-text');
  const btnSignOut = document.getElementById('btn-sign-out');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const btnLogin = document.getElementById('btn-login');
  const btnLoginText = document.getElementById('btn-login-text');
  const loginError = document.getElementById('login-error');

  let currentTabPayload = null;

  // 1. Tab Switching
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(`pane-${btn.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');

      if (btn.dataset.tab === 'recent') {
        loadRecentSaves();
      }
    });
  });

  // 2. Load Settings & Auth
  const settings = await chrome.storage.local.get([
    'serverUrl',
    'geminiApiKey',
    'autoTag',
    'userId',
    'userEmail',
    'recentSaves',
  ]);

  const serverUrl = settings.serverUrl || 'https://myvalut.vercel.app';
  inputServerUrl.value = serverUrl;
  if (settings.geminiApiKey) inputGeminiKey.value = settings.geminiApiKey;
  if (settings.autoTag !== undefined) inputAutoTag.checked = settings.autoTag;
  if (linkOpenDashboard) linkOpenDashboard.href = serverUrl;

  renderAccountState(settings.userId, settings.userEmail);
  checkServerStatus(serverUrl);

  // Presets
  presetVercel?.addEventListener('click', () => {
    inputServerUrl.value = 'https://myvalut.vercel.app';
    chrome.storage.local.set({ serverUrl: 'https://myvalut.vercel.app' });
    checkServerStatus('https://myvalut.vercel.app');
  });

  presetLocalhost?.addEventListener('click', () => {
    inputServerUrl.value = 'http://localhost:3000';
    chrome.storage.local.set({ serverUrl: 'http://localhost:3000' });
    checkServerStatus('http://localhost:3000');
  });

  // 3. Extract Active Tab Metadata
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.url) {
      const url = new URL(activeTab.url);
      pageHostname.textContent = url.hostname.replace(/^www\./, '');

      let platform = 'web';
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) platform = 'youtube';
      else if (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) platform = 'twitter';
      else if (url.hostname.includes('instagram.com')) platform = 'instagram';
      else if (url.hostname.includes('reddit.com')) platform = 'reddit';

      updatePlatformBadge(platform);

      try {
        chrome.tabs.sendMessage(activeTab.id, { action: 'extract-page-data' }, (response) => {
          if (chrome.runtime.lastError || !response) {
            currentTabPayload = {
              url: activeTab.url,
              platform,
              title: activeTab.title || url.hostname,
              text: activeTab.title || activeTab.url,
              displayName: url.hostname,
              username: url.hostname,
            };
          } else {
            currentTabPayload = response;
          }
          renderCurrentTabPreview(currentTabPayload);
        });
      } catch {
        currentTabPayload = {
          url: activeTab.url,
          platform,
          title: activeTab.title || url.hostname,
          text: activeTab.title || activeTab.url,
          displayName: url.hostname,
          username: url.hostname,
        };
        renderCurrentTabPreview(currentTabPayload);
      }
    }
  } catch (err) {
    console.error('Error fetching tab:', err);
    pageTitle.textContent = 'Could not load active tab';
  }

  function updatePlatformBadge(platform) {
    platformBadge.textContent = platform === 'twitter' ? 'X / Twitter' : platform;
    platformIconCircle.className = `platform-icon-circle ${platform}`;

    if (platform === 'youtube') {
      platformIconCircle.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>`;
    } else if (platform === 'twitter') {
      platformIconCircle.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    } else if (platform === 'instagram') {
      platformIconCircle.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>`;
    } else if (platform === 'reddit') {
      platformIconCircle.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>`;
    } else {
      platformIconCircle.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>`;
    }
  }

  function renderCurrentTabPreview(data) {
    pageTitle.textContent = data.title || 'Untitled Page';
    pageDesc.textContent = data.text || data.url;

    if (data.imageUrl) {
      pageImage.src = data.imageUrl;
      pageImageWrapper.style.display = 'block';
      if (data.platform === 'youtube' || data.text?.toLowerCase().includes('video')) {
        videoOverlay.style.display = 'flex';
      } else {
        videoOverlay.style.display = 'none';
      }
    } else {
      pageImageWrapper.style.display = 'none';
    }

    const previewTags = extractPreviewTags(data.title + ' ' + data.text, data.platform);
    tagsPreview.innerHTML = previewTags
      .map(t => `<span class="tag-pill"><span class="tag-dot bg-${t.color}"></span>${t.name}</span>`)
      .join('');
  }

  function extractPreviewTags(text, platform) {
    const t = (text || '').toLowerCase();
    const tags = [];
    if (t.includes('ai') || t.includes('gpt') || t.includes('agent') || t.includes('claude')) tags.push({ name: 'AI', color: 'indigo' });
    if (t.includes('react') || t.includes('next') || t.includes('web') || t.includes('code') || t.includes('ts')) tags.push({ name: 'Frontend', color: 'blue' });
    if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('figma')) tags.push({ name: 'Design', color: 'pink' });
    if (t.includes('finance') || t.includes('money') || t.includes('crypto') || t.includes('saas')) tags.push({ name: 'Product', color: 'teal' });

    if (platform && platform !== 'web') {
      tags.push({ name: platform.charAt(0).toUpperCase() + platform.slice(1), color: 'amber' });
    }

    if (tags.length === 0) tags.push({ name: 'Bookmark', color: 'blue' });
    return tags.slice(0, 3);
  }

  // 4. Save Button Click
  btnSave.addEventListener('click', async () => {
    if (!currentTabPayload) return;

    btnSave.disabled = true;
    btnSaveText.textContent = 'Saving with AI tags...';

    const payload = {
      ...currentTabPayload,
      note: customNote.value.trim() || undefined,
    };

    chrome.runtime.sendMessage({ action: 'save-bookmark', payload }, (res) => {
      if (chrome.runtime.lastError || !res || !res.success) {
        btnSaveText.textContent = '✕ Save Failed';
        btnSave.style.background = '#ef4444';
        btnSave.style.color = '#ffffff';
        setTimeout(() => {
          btnSave.disabled = false;
          btnSaveText.textContent = '✦ Save to Valut';
          btnSave.style.background = '';
          btnSave.style.color = '';
        }, 2500);
      } else {
        btnSaveText.textContent = '✓ Saved to Valut!';
        btnSave.style.background = '#22c55e';
        btnSave.style.color = '#ffffff';

        if (res.result?.tags && res.result.tags.length > 0) {
          tagsPreview.innerHTML = res.result.tags
            .map(t => `<span class="tag-pill"><span class="tag-dot bg-${t.color || 'blue'}"></span>${t.name}</span>`)
            .join('');
        }

        setTimeout(() => {
          btnSave.disabled = false;
          btnSaveText.textContent = '✦ Save to Valut';
          btnSave.style.background = '';
          btnSave.style.color = '';
        }, 2500);
      }
    });
  });

  // 5. Account & Login
  function renderAccountState(userId, userEmail) {
    if (userId && userEmail) {
      accountLoggedIn.style.display = 'block';
      accountLoggedOut.style.display = 'none';
      userAvatarBadge.textContent = userEmail.charAt(0).toUpperCase();
      userEmailText.textContent = userEmail;
    } else {
      accountLoggedIn.style.display = 'none';
      accountLoggedOut.style.display = 'block';
    }
  }

  btnLogin?.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) return;

    btnLogin.disabled = true;
    btnLoginText.textContent = 'Signing in...';
    loginError.style.display = 'none';

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error_description || data.msg || 'Invalid login credentials');
      }

      const user = data.user;
      await chrome.storage.local.set({
        userId: user.id,
        userEmail: user.email,
        sessionToken: data.access_token,
      });

      renderAccountState(user.id, user.email);
      btnLoginText.textContent = 'Sign In';
      btnLogin.disabled = false;
    } catch (err) {
      loginError.textContent = err.message || 'Login failed';
      loginError.style.display = 'block';
      btnLoginText.textContent = 'Sign In';
      btnLogin.disabled = false;
    }
  });

  btnSignOut?.addEventListener('click', async () => {
    await chrome.storage.local.remove(['userId', 'userEmail', 'sessionToken']);
    renderAccountState(null, null);
  });

  // 6. Recent Saves Loader
  async function loadRecentSaves() {
    const { recentSaves } = await chrome.storage.local.get('recentSaves');
    if (!recentSaves || recentSaves.length === 0) {
      recentCount.textContent = '0 items';
      recentList.innerHTML = `
        <div class="empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: #64748b; margin-bottom: 8px;">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
          <p>No recent saves yet.</p>
          <span class="empty-sub">Save pages using the Save button or 1-click on YouTube, X, Reddit & Instagram!</span>
        </div>
      `;
      return;
    }

    recentCount.textContent = `${recentSaves.length} items`;
    recentList.innerHTML = recentSaves
      .map(
        item => `
        <a href="${escapeHtml(item.url || 'https://myvalut.vercel.app')}" target="_blank" rel="noopener noreferrer" class="recent-item">
          <div class="recent-item-top">
            <div class="recent-item-title">${escapeHtml(item.title || item.text)}</div>
            <span class="platform-chip" style="padding: 1px 6px; font-size: 10px;">${escapeHtml(item.platform || 'web')}</span>
          </div>
          <div class="tags-container" style="margin-top: 2px;">
            ${(item.tags || [])
              .map(t => `<span class="tag-pill" style="font-size: 10px; padding: 1.5px 6px;"><span class="tag-dot bg-${t.color || 'blue'}" style="width: 5px; height: 5px;"></span>${escapeHtml(t.name)}</span>`)
              .join('')}
          </div>
          <div class="recent-item-meta">
            <span>${escapeHtml(item.displayName || 'Saved Link')}</span>
            <span>${escapeHtml(item.date || '')}</span>
          </div>
        </a>
      `
      )
      .join('');
  }

  // 7. Settings Save
  btnSaveSettings.addEventListener('click', async () => {
    const newUrl = inputServerUrl.value.trim() || 'https://myvalut.vercel.app';
    const newKey = inputGeminiKey.value.trim();
    const autoTag = inputAutoTag.checked;

    await chrome.storage.local.set({
      serverUrl: newUrl,
      geminiApiKey: newKey,
      autoTag,
    });

    btnSaveSettings.textContent = '✓ Settings Saved!';
    btnSaveSettings.style.background = '#22c55e';
    btnSaveSettings.style.color = '#ffffff';

    checkServerStatus(newUrl);

    setTimeout(() => {
      btnSaveSettings.textContent = 'Save Settings';
      btnSaveSettings.style.background = '';
      btnSaveSettings.style.color = '';
    }, 2000);
  });

  // 8. Check server status
  async function checkServerStatus() {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Ready';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/tags?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (res.ok) {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Connected';
        return;
      }
      throw new Error();
    } catch {
      statusDot.className = 'status-dot offline';
      statusText.textContent = 'Offline';
    }
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
});
