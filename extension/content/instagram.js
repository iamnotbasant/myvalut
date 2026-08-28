// Instagram Content Script for Valut
(function () {
  const VALUT_ICON_SVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z" fill="currentColor" />
      <path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z" fill="currentColor" />
    </svg>
  `;

  function extractInstagramData(article) {
    let author = 'instagram_creator';
    let avatarUrl = '';
    let text = '';
    let imageUrl = '';
    let pageUrl = window.location.href;

    const authorLink = article.querySelector('header a[role="link"], header a[href^="/"]');
    if (authorLink) {
      author = authorLink.textContent?.trim() || authorLink.getAttribute('href')?.replace(/\//g, '') || 'instagram_creator';
    }

    const avatarImg = article.querySelector('header img, header canvas + img');
    if (avatarImg) {
      avatarUrl = avatarImg.getAttribute('src') || '';
    }

    const captionEl = article.querySelector('h1, span._aacl._aaco._aacu._aacx._aad7._aade');
    if (captionEl) {
      text = captionEl.textContent?.trim() || '';
    }

    const postImg = article.querySelector('div[role="button"] img[src*="cdninstagram"], img[src*="instagram"], img.x5yr21d');
    if (postImg) {
      imageUrl = postImg.getAttribute('src') || '';
    }

    return {
      url: pageUrl,
      platform: 'instagram',
      title: `${author} on Instagram`,
      text: text || `Instagram post by ${author}`,
      displayName: author,
      username: author,
      avatarUrl: avatarUrl || undefined,
      imageUrl: imageUrl || undefined,
    };
  }

  function extractSmartTags(text) {
    const lower = (text || '').toLowerCase();
    let category = 'design';
    const topics = [];
    let type = 'showcase';

    if (lower.includes('photo') || lower.includes('preset') || lower.includes('lightroom') || lower.includes('photoshop') || lower.includes('camera') || lower.includes('portrait') || lower.includes('retouch')) {
      topics.push('photo-editing', 'graphic-design');
    }
    if (lower.includes('motion') || lower.includes('animation') || lower.includes('reels') || lower.includes('transition') || lower.includes('vfx') || lower.includes('render')) {
      category = 'video-editing';
      topics.push('motion-design', 'animation');
    }
    if (lower.includes('graphic') || lower.includes('poster') || lower.includes('branding') || lower.includes('logo') || lower.includes('typography') || lower.includes('font')) {
      topics.push('graphic-design', 'typography');
    }
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('figma') || lower.includes('interface') || lower.includes('wireframe') || lower.includes('design system')) {
      topics.push('ui-ux', 'figma');
    }
    if (lower.includes('ai') || lower.includes('midjourney') || lower.includes('genai') || lower.includes('chatgpt') || lower.includes('flux')) {
      category = 'ai';
      topics.push('ai-tools', 'prompt-engineering');
      type = 'tool';
    }
    if (lower.includes('setup') || lower.includes('workspace') || lower.includes('desk') || lower.includes('minimal')) {
      topics.push('design-system', 'productivity');
    }
    if (lower.includes('growth') || lower.includes('business') || lower.includes('marketing') || lower.includes('founder') || lower.includes('creator')) {
      category = 'marketing';
      topics.push('startup', 'seo');
      type = 'guide';
    }

    if (topics.length === 0) {
      topics.push('design-inspiration', 'photo-editing');
    }

    const tagNames = [category, ...topics.slice(0, 3), type];
    const colorMap = {
      'design': 'pink',
      'video-editing': 'violet',
      'ai': 'teal',
      'marketing': 'orange',
      'photo-editing': 'violet',
      'graphic-design': 'pink',
      'motion-design': 'violet',
      'animation': 'violet',
      'typography': 'amber',
      'ui-ux': 'cyan',
      'figma': 'pink',
      'ai-tools': 'teal',
      'prompt-engineering': 'teal',
      'design-system': 'violet',
      'productivity': 'amber',
      'startup': 'green',
      'seo': 'blue',
      'design-inspiration': 'pink',
      'showcase': 'blue',
      'tool': 'cyan',
      'guide': 'green'
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

    const smartTags = extractSmartTags(payload.text + ' ' + payload.title);

    const bookmarkItem = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      platform: 'instagram',
      display_name: payload.displayName || 'Instagram Creator',
      username: payload.username ? payload.username.replace(/^@/, '') : 'instagram',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Instagram Post',
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

  function handleIgSuccess(btn, toast, tags) {
    if (btn) {
      btn.classList.remove('valut-ig-loading');
      btn.classList.add('valut-ig-saved');
    }
    if (toast) {
      toast.updateSuccess({ tags: tags || [] });
    }
  }

  function handleIgError(btn, toast, errMsg) {
    if (btn) {
      btn.classList.remove('valut-ig-loading');
    }
    if (toast) {
      toast.updateError(errMsg);
    }
  }

  async function saveInstagramPost(article, btn) {
    const postData = extractInstagramData(article);
    const toast = window.__valutToastManager?.showToast({
      title: postData.title,
      loading: true,
      status: 'Saving to vault with smart tags...',
    });

    if (btn) {
      btn.classList.add('valut-ig-loading');
    }

    try {
      const payload = { ...postData, openWebsite: true };

      if (!chrome.runtime?.id) {
        const fallbackRes = await directFallbackSave(payload);
        handleIgSuccess(btn, toast, fallbackRes.result?.tags || []);
        window.open('https://myvalut.vercel.app', '_blank');
        return;
      }

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fallbackRes = await directFallbackSave(payload);
            handleIgSuccess(btn, toast, fallbackRes.result?.tags || []);
            window.open('https://myvalut.vercel.app', '_blank');
          } catch (fbErr) {
            handleIgError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
          }
        } else {
          handleIgSuccess(btn, toast, res.result?.tags || []);
        }
      });
    } catch (e) {
      try {
        const fallbackRes = await directFallbackSave({ ...postData, openWebsite: true });
        handleIgSuccess(btn, toast, fallbackRes.result?.tags || []);
        window.open('https://myvalut.vercel.app', '_blank');
      } catch (fbErr) {
        handleIgError(btn, toast, 'Please refresh this tab once to connect the updated extension.');
      }
    }
  }

  function injectInstagramButtons() {
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
      if (article.querySelector('.valut-ig-btn')) return;

      const actionsBar = article.querySelector('section._aamu, section._aamv, div.x78zum5.x1q0g3np.xwib8y2, section');
      if (!actionsBar) return;

      const btn = document.createElement('button');
      btn.className = 'valut-ig-btn';
      btn.innerHTML = VALUT_ICON_SVG;
      btn.title = 'Save to Valut with AI Tags';

      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        saveInstagramPost(article, btn);
      });

      const bookmarkSection = actionsBar.querySelector('div.x12nagc, span._aamz, div:last-child');
      if (bookmarkSection) {
        bookmarkSection.appendChild(btn);
      } else {
        actionsBar.appendChild(btn);
      }
    });
  }

  const observer = new MutationObserver(() => injectInstagramButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', injectInstagramButtons);
  setInterval(injectInstagramButtons, 1200);
  injectInstagramButtons();
})();
