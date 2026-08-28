// YouTube Content Script for Valut
(function () {
  const VALUT_ICON_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z" fill="currentColor" />
      <path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z" fill="currentColor" />
    </svg>
  `;

  function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v') || null;
  }

  function extractYouTubeData() {
    const videoId = getVideoId();
    const isShorts = window.location.pathname.includes('/shorts/');

    let title = '';
    let authorName = '';
    let authorHandle = '';
    let avatarUrl = '';
    let text = '';
    let imageUrl = '';
    let pageUrl = window.location.href;
    let extractedKeywords = '';
    let transcriptText = '';

    // Extract meta keywords (contains video tags from creator)
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
    if (metaKeywords) {
      extractedKeywords = metaKeywords;
    }

    if (isShorts) {
      const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]') || document;
      title = activeReel.querySelector('#overlay ytd-reel-player-header-renderer h2, #title')?.textContent?.trim() || document.title;
      authorName = activeReel.querySelector('#channel-name a, yt-formatted-string.ytd-channel-name')?.textContent?.trim() || '';
      const avatarEl = activeReel.querySelector('#avatar-btn img, #avatar img, yt-img-shadow#avatar img');
      avatarUrl = avatarEl?.getAttribute('src') || avatarEl?.getAttribute('data-src') || '';
      text = title;
      const shortsId = window.location.pathname.split('/shorts/')[1]?.split('?')[0];
      if (shortsId) {
        imageUrl = `https://i.ytimg.com/vi/${shortsId}/maxresdefault.jpg`;
      }
    } else {
      const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, #title h1 yt-formatted-string, h1.title yt-formatted-string, #container h1');
      title = titleEl?.textContent?.trim() || document.querySelector('meta[name="title"]')?.getAttribute('content') || document.title.replace(' - YouTube', '');

      const channelEl = document.querySelector('#owner #channel-name a, ytd-video-owner-renderer #channel-name a, #upload-info #channel-name a, ytd-channel-name a');
      authorName = channelEl?.textContent?.trim() || 'YouTube Creator';
      authorHandle = authorName.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const avatarEl = document.querySelector('#owner #avatar img, ytd-video-owner-renderer #avatar-link img, #upload-info #avatar img, yt-img-shadow#avatar img, #avatar img');
      avatarUrl = avatarEl?.getAttribute('src') || avatarEl?.getAttribute('data-src') || '';

      const descEl = document.querySelector('#description-inline-expander yt-attributed-string, #description yt-formatted-string, #description-text');
      const rawDesc = descEl?.textContent?.trim() || document.querySelector('meta[name="description"]')?.getAttribute('content') || document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      
      // High-signal text combining description and creator tags
      text = rawDesc.slice(0, 600);
      if (extractedKeywords) {
        text = `${text}\nKeywords: ${extractedKeywords.slice(0, 300)}`.trim();
      }

      // Check if transcript drawer is open
      const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer yt-formatted-string, #segments-container yt-formatted-string');
      if (transcriptSegments.length > 0) {
        const words = Array.from(transcriptSegments).map(s => s.textContent.trim()).filter(Boolean).slice(0, 200).join(' ');
        if (words) transcriptText = words;
      }

      if (videoId) {
        imageUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // Extract chapters/timestamps if available
    const chapterEls = document.querySelectorAll('ytd-macro-markers-list-item-renderer #details h4, ytd-chapter-renderer #details h4, .ytd-macro-markers-list-item-renderer h4');
    let chapters = [];
    if (chapterEls.length > 0) {
      chapters = Array.from(chapterEls).map(el => el.textContent?.trim()).filter(Boolean).slice(0, 5);
    }

    return {
      url: pageUrl,
      platform: 'youtube',
      title: title || 'YouTube Video',
      text: text || title || 'Saved YouTube Video',
      context: transcriptText || extractedKeywords || undefined,
      chapters: chapters.length > 0 ? chapters : undefined,
      displayName: authorName || 'YouTube Creator',
      username: authorHandle || 'youtube',
      avatarUrl: avatarUrl || undefined,
      imageUrl: imageUrl || undefined,
      openWebsite: true,
    };
  }

  // Smart Dynamic Tag Taxonomy (Natural Spaced Tags)
  function extractSmartTags(text) {
    const lower = (text || '').toLowerCase();
    let category = 'video editing';
    const topics = [];
    let type = 'tutorial';

    if (lower.includes('premiere')) topics.push('premiere pro');
    if (lower.includes('after effects') || lower.includes('ae')) topics.push('after effects');
    if (lower.includes('davinci')) topics.push('davinci resolve');
    if (lower.includes('capcut')) topics.push('capcut');
    if (lower.includes('ffmpeg')) topics.push('ffmpeg');
    if (lower.includes('speed ramp')) topics.push('speed ramping');
    if (lower.includes('color grade') || lower.includes('lut')) topics.push('color grade');
    if (lower.includes('motion') || lower.includes('animation')) topics.push('motion design');
    if (lower.includes('transition') || lower.includes('fx') || lower.includes('vfx')) topics.push('vfx');

    if (topics.length === 0) {
      if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('claude') || lower.includes('prompt') || lower.includes('agent')) {
        category = 'ai';
        if (lower.includes('chatgpt')) topics.push('chatgpt');
        if (lower.includes('claude')) topics.push('claude');
        if (topics.length === 0) topics.push('ai agents', 'prompt engineering');
      } else if (lower.includes('code') || lower.includes('react') || lower.includes('next.js') || lower.includes('web dev') || lower.includes('programming')) {
        category = 'tech';
        if (lower.includes('react')) topics.push('react');
        if (lower.includes('next')) topics.push('next js');
        if (topics.length === 0) topics.push('web dev');
      } else if (lower.includes('design') || lower.includes('figma') || lower.includes('ui') || lower.includes('ux')) {
        category = 'design';
        topics.push('ui ux', 'figma');
      } else if (lower.includes('calisthenics') || lower.includes('workout') || lower.includes('fitness')) {
        category = 'fitness';
        topics.push('calisthenics');
      } else {
        topics.push('premiere pro');
      }
    }

    if (lower.includes('workflow')) {
      type = 'workflow';
    } else if (lower.includes('course') || lower.includes('how to') || lower.includes('guide') || lower.includes('walkthrough')) {
      type = 'tutorial';
    } else if (lower.includes('tool') || lower.includes('plugin') || lower.includes('extension') || lower.includes('preset')) {
      type = 'tool';
    } else if (lower.includes('case study') || lower.includes('breakdown')) {
      type = 'case study';
    } else {
      type = 'tutorial';
    }

    const tagNames = [category, ...topics.slice(0, 4), type];
    const colorMap = {
      'video editing': 'violet',
      'premiere pro': 'violet',
      'after effects': 'violet',
      'davinci resolve': 'violet',
      'capcut': 'violet',
      'ffmpeg': 'indigo',
      'speed ramping': 'violet',
      'color grade': 'violet',
      'motion design': 'violet',
      'vfx': 'violet',
      'ai': 'teal',
      'chatgpt': 'teal',
      'claude': 'teal',
      'ai agents': 'teal',
      'prompt engineering': 'teal',
      'tech': 'teal',
      'web dev': 'teal',
      'react': 'cyan',
      'next js': 'teal',
      'design': 'pink',
      'ui ux': 'cyan',
      'figma': 'pink',
      'fitness': 'green',
      'calisthenics': 'green',
      'workflow': 'amber',
      'tutorial': 'green',
      'tool': 'cyan',
      'case study': 'amber',
      'resource': 'blue'
    };

    const unique = Array.from(new Set(tagNames)).slice(0, 5);
    return unique.map(name => ({
      name,
      color: colorMap[name] || 'blue'
    }));
  }

  const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

  async function directFallbackSave(payload) {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const smartTags = extractSmartTags(payload.text + ' ' + payload.title + ' ' + (payload.context || ''));

    const bookmarkItem = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      platform: 'youtube',
      display_name: payload.displayName || 'YouTube Creator',
      username: payload.username || 'youtube',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved YouTube Video',
      url: payload.url || null,
      date: formattedDate,
      created_at_ms: Date.now(),
      tags: smartTags,
      is_favorite: false,
      is_archived: false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(bookmarkItem),
    });

    if (!res.ok) throw new Error('Direct save failed');
    return { success: true, result: { tags: bookmarkItem.tags } };
  }

  function handleYtSuccess(buttonElement, toast, tags) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-yt-loading');
      buttonElement.classList.add('valut-yt-saved');

      const label = buttonElement.querySelector('.valut-yt-btn-label');
      if (label) {
        label.textContent = 'Saved';
      }
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleYtError(buttonElement, toast, errMsg) {
    if (buttonElement) {
      buttonElement.classList.remove('valut-yt-loading');
      const label = buttonElement.querySelector('.valut-yt-btn-label');
      if (label) label.textContent = 'Retry';
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveCurrentYouTubeVideo(buttonElement) {
    const videoData = extractYouTubeData();
    const toast = window.__valutToastManager?.showToast({
      title: videoData.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (buttonElement) {
      buttonElement.classList.add('valut-yt-loading');
      const label = buttonElement.querySelector('.valut-yt-btn-label');
      if (label) label.textContent = 'Saving...';
    }

    try {
      const payload = { ...videoData, openWebsite: true };

      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(payload);
        handleYtSuccess(buttonElement, toast, fallbackRes.result?.tags || []);
        window.open('https://myvalut.vercel.app', '_blank');
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(payload);
            handleYtSuccess(buttonElement, toast, fallbackRes.result?.tags || []);
            window.open('https://myvalut.vercel.app', '_blank');
          } catch (fbErr) {
            handleYtError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleYtSuccess(buttonElement, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave({ ...videoData, openWebsite: true });
        handleYtSuccess(buttonElement, toast, fallbackRes.result?.tags || []);
        window.open('https://myvalut.vercel.app', '_blank');
      } catch (fbErr) {
        handleYtError(buttonElement, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  // 1. Inject into YouTube Watch Metadata Action Bar (Native Pill Placement & SPA Support)
  function injectWatchPageButton() {
    const isWatchPage = window.location.pathname.includes('/watch') || window.location.search.includes('v=');
    if (!isWatchPage) return;

    const candidates = [
      'ytd-watch-flexy:not([hidden]) ytd-watch-metadata:not([hidden]) #actions #top-level-buttons-computed',
      'ytd-watch-metadata:not([hidden]) #actions #top-level-buttons-computed',
      'ytd-watch-metadata:not([hidden]) #actions-inner #menu #top-level-buttons-computed',
      '#actions #top-level-buttons-computed',
      'ytd-watch-metadata #actions #top-level-buttons-computed',
      'ytd-menu-renderer #top-level-buttons-computed',
    ];

    let target = null;
    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el) {
        target = el;
        break;
      }
    }

    if (!target) return;

    // Check if target ALREADY contains our button
    if (target.querySelector('#valut-yt-watch-btn') || target.querySelector('.valut-yt-btn')) {
      return;
    }

    // Clean up any stale buttons in detached/inactive elements from previous video
    const existingBtns = document.querySelectorAll('#valut-yt-watch-btn');
    existingBtns.forEach(b => {
      if (!target.contains(b)) {
        b.remove();
      }
    });

    const btn = document.createElement('button');
    btn.id = 'valut-yt-watch-btn';
    btn.className = 'valut-yt-btn';
    btn.innerHTML = `${VALUT_ICON_SVG} <span class="valut-yt-btn-label">Valut</span>`;
    btn.title = 'Save to Valut with AI Auto-Tags';

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(btn);
    });

    const moreBtn = target.querySelector('ytd-menu-renderer, #flexible-item-buttons, ytd-button-renderer:last-child');
    if (moreBtn && moreBtn.parentNode === target) {
      target.insertBefore(btn, moreBtn);
    } else {
      target.appendChild(btn);
    }
  }

  // 2. Inject into YouTube Video Player Control Bar (.ytp-right-controls)
  function injectPlayerControlsButton() {
    const isWatchPage = window.location.pathname.includes('/watch') || window.location.search.includes('v=');
    if (!isWatchPage) return;

    const rightControls = document.querySelector('.html5-video-player:not([hidden]) .ytp-right-controls, .ytp-right-controls');
    if (!rightControls) return;

    if (rightControls.querySelector('#valut-yt-player-btn') || rightControls.querySelector('.valut-yt-player-control-btn')) {
      return;
    }

    const pBtn = document.createElement('button');
    pBtn.id = 'valut-yt-player-btn';
    pBtn.className = 'ytp-button valut-yt-player-control-btn';
    pBtn.innerHTML = VALUT_ICON_SVG;
    pBtn.title = 'Save Video to Valut with AI Tags';

    pBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(pBtn);
    });

    rightControls.insertBefore(pBtn, rightControls.firstChild);
  }

  // 3. Inject into YouTube Shorts Actions Bar
  function injectShortsButton() {
    const isShorts = window.location.pathname.includes('/shorts');
    if (!isShorts) return;

    const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
    if (!activeReel) return;

    const actionsContainer = activeReel.querySelector('#actions');
    if (!actionsContainer || activeReel.querySelector('.valut-shorts-btn')) return;

    const shortsBtn = document.createElement('div');
    shortsBtn.className = 'valut-shorts-btn';
    shortsBtn.innerHTML = `
      <div class="valut-shorts-icon-circle">
        ${VALUT_ICON_SVG}
      </div>
      <span class="valut-shorts-label">Valut</span>
    `;

    shortsBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCurrentYouTubeVideo(shortsBtn);
    });

    actionsContainer.appendChild(shortsBtn);
  }

  function runInjection() {
    if (window.location.pathname.includes('/watch') || window.location.search.includes('v=')) {
      injectWatchPageButton();
      injectPlayerControlsButton();
    } else if (window.location.pathname.includes('/shorts')) {
      injectShortsButton();
    }
  }

  function triggerInjectionCycle() {
    runInjection();
    setTimeout(runInjection, 150);
    setTimeout(runInjection, 400);
    setTimeout(runInjection, 800);
    setTimeout(runInjection, 1500);
    setTimeout(runInjection, 3000);
  }

  // Observe DOM additions continuously for instant injection
  const observer = new MutationObserver(() => runInjection());
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // YouTube SPA navigation lifecycle listeners
  window.addEventListener('yt-navigate-finish', triggerInjectionCycle);
  window.addEventListener('yt-page-data-updated', triggerInjectionCycle);
  window.addEventListener('yt-visibility-refresh', triggerInjectionCycle);
  window.addEventListener('yt-action', triggerInjectionCycle);
  window.addEventListener('spfdone', triggerInjectionCycle);
  window.addEventListener('popstate', triggerInjectionCycle);
  window.addEventListener('load', triggerInjectionCycle);
  document.addEventListener('DOMContentLoaded', triggerInjectionCycle);

  // Background keepalive interval so button is ALWAYS injected without needing refresh
  setInterval(runInjection, 800);

  triggerInjectionCycle();
})();
