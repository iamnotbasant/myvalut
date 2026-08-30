'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookmarkItem, Collection, PlatformType, Tag, TagColor } from '@/types/stashr';
import {
  X,
  Plus,
  PlatformIcon,
  TagDot,
  Folder,
  Sparkles,
  Lightbulb,
  Heart,
  Star,
  Flag,
  Bookmark,
  Check,
  Trash2,
  Pencil
} from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';

// 1. Add Bookmark Modal
interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bookmark: Omit<BookmarkItem, 'id' | 'date'>) => void;
  availableTags: Tag[];
}

export function AddBookmarkModal({
  isOpen,
  onClose,
  onAdd,
  availableTags
}: AddBookmarkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('web');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<{ name: string; color: TagColor }[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [note, setNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const getSavedApiKey = () => {
    try {
      return localStorage.getItem('gemini_api_key') || undefined;
    } catch {
      return undefined;
    }
  };

  const runUrlIngest = async (inputUrl: string) => {
    if (!inputUrl.trim() || !inputUrl.startsWith('http')) return;

    setIsIngesting(true);
    setIngestStatus('Analyzing link with Gemini AI...');

    try {
      const apiKey = getSavedApiKey();
      const res = await fetch('/api/ai/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim(), apiKey }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        if (item.title) setTitle(item.title);
        if (item.text) setText(item.text);
        if (item.displayName) setDisplayName(item.displayName);
        if (item.username) setUsername(item.username);
        if (item.platform) setPlatform(item.platform);
        if (item.imageUrl) setImageUrl(item.imageUrl);
        if (item.avatarUrl) setAvatarUrl(item.avatarUrl);

        if (Array.isArray(item.tags) && item.tags.length > 0) {
          setSelectedTags(item.tags);
        }

        soundFx.playAiSuccessSound();
        setIngestStatus('Auto-tagged & metadata extracted!');
        setTimeout(() => setIngestStatus(null), 3000);
      } else {
        setIngestStatus(null);
      }
    } catch (err) {
      console.error('Ingest error:', err);
      setIngestStatus(null);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleUrlChange = (inputUrl: string) => {
    setUrl(inputUrl);

    // Auto-detect platform icon immediately
    const lower = inputUrl.toLowerCase();
    if (lower.includes('twitter.com') || lower.includes('x.com')) setPlatform('twitter');
    else if (lower.includes('reddit.com') || lower.includes('redd.it')) setPlatform('reddit');
    else if (lower.includes('instagram.com')) setPlatform('instagram');
    else if (lower.includes('tiktok.com')) setPlatform('tiktok');
    else if (lower.includes('youtube.com') || lower.includes('youtu.be')) setPlatform('youtube');
    else if (lower.includes('pinterest.com')) setPlatform('pinterest');
    else if (lower.includes('bsky.app')) setPlatform('bluesky');
    else if (lower.includes('threads.net')) setPlatform('threads');
    else if (inputUrl.startsWith('http')) setPlatform('web');
  };

  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && pasted.startsWith('http')) {
      handleUrlChange(pasted);
      setTimeout(() => runUrlIngest(pasted), 100);
    }
  };

  const handleTriggerAiTag = async () => {
    if (!text.trim() && !url.trim() && !title.trim()) return;

    setIsIngesting(true);
    setIngestStatus('Generating AI tags...');
    soundFx.playClickSound();

    try {
      const apiKey = getSavedApiKey();
      const res = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          text: text || title,
          platform,
          title: title || displayName,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.tags && Array.isArray(data.tags)) {
        soundFx.playAiSuccessSound();
        setSelectedTags(data.tags);
        setIngestStatus('AI Tags updated!');
        setTimeout(() => setIngestStatus(null), 2500);
      }
    } catch (e) {
      console.error('AI Tag error:', e);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const cleanName = customTagInput.trim().toLowerCase().replace(/[-_]/g, ' ');
    if (!selectedTags.some(t => t.name === cleanName)) {
      soundFx.playTagSound();
      const defaultColors: TagColor[] = ['teal', 'blue', 'violet', 'amber', 'pink', 'indigo'];
      const color = defaultColors[selectedTags.length % defaultColors.length];
      setSelectedTags([...selectedTags, { name: cleanName, color }]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagName: string) => {
    soundFx.playTagSound();
    setSelectedTags(selectedTags.filter(t => t.name !== tagName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !url.trim() && !title.trim()) return;

    soundFx.playSaveSound();

    onAdd({
      displayName: displayName.trim() || (platform === 'youtube' ? 'YouTube Creator' : platform === 'reddit' ? 'Reddit' : 'Basant'),
      username: username.trim() || (platform === 'youtube' ? 'youtube' : 'user'),
      platform,
      title: title.trim() || undefined,
      text: text.trim() || title.trim() || url,
      url: url.trim() || undefined,
      imageUrl: imageUrl || undefined,
      avatarUrl: avatarUrl || undefined,
      tags: selectedTags.length > 0 ? selectedTags : [{ name: platform, color: 'blue' }],
      note: note.trim() || undefined,
      isFavorite,
    });

    // Reset form
    setUrl('');
    setTitle('');
    setText('');
    setDisplayName('');
    setUsername('');
    setImageUrl(undefined);
    setAvatarUrl(undefined);
    setNote('');
    setSelectedTags([]);
    setIsFavorite(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white">
              <Plus className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">
                Add to Vault
              </h3>
              <p className="text-[11px] text-neutral-400">
                Paste any YouTube, X, Reddit, or web link for auto-tagging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Source URL with Ingest button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-300">
                Source URL
              </label>
              {url.startsWith('http') && (
                <button
                  type="button"
                  onClick={() => runUrlIngest(url)}
                  disabled={isIngesting}
                  className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="size-3" />
                  <span>Fetch & Auto-Tag</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={e => handleUrlChange(e.target.value)}
                onPaste={handleUrlPaste}
                placeholder="https://youtube.com/watch?v=... or https://x.com/..."
                className="h-9 w-full rounded-xl border border-white/10 bg-white/5 px-3 pr-10 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isIngesting ? (
                  <span className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : (
                  <PlatformIcon platform={platform} />
                )}
              </div>
            </div>
            {ingestStatus && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 animate-in fade-in">
                <Sparkles className="size-3" />
                <span>{ingestStatus}</span>
              </p>
            )}
          </div>

          {/* Thumbnail preview if detected */}
          {imageUrl && (
            <div className="relative h-32 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setImageUrl(undefined)}
                className="absolute top-2 right-2 rounded-md bg-black/70 p-1 text-neutral-300 hover:text-white hover:bg-black transition-colors"
                title="Remove image preview"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Title / Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 10min Premiere Pro Tutorial with Whisper AI"
              className="h-8.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
            />
          </div>

          {/* Content / Summary */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Content / Summary *
            </label>
            <textarea
              required
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              placeholder="Key insights, quote, script, or notes..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
            />
          </div>

          {/* Author Name & Platform */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Author / Channel Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="h-8.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as PlatformType)}
                className="h-8.5 w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-2 text-xs text-white outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter / X</option>
                <option value="reddit">Reddit</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="pinterest">Pinterest</option>
                <option value="bluesky">Bluesky</option>
                <option value="threads">Threads</option>
                <option value="web">Web</option>
              </select>
            </div>
          </div>

          {/* AI Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-neutral-300">
                Tags (Dynamic 2-6 Clean Tokens)
              </label>
              <button
                type="button"
                onClick={handleTriggerAiTag}
                disabled={isIngesting}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/10 hover:bg-primary/20 px-2.5 py-0.5 rounded-full active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="size-3" />
                <span>✦ AI Auto-Tag</span>
              </button>
            </div>

            {/* Selected Tag Pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-white/10 bg-black/30">
              {selectedTags.length === 0 ? (
                <span className="text-[11px] text-neutral-500 italic py-0.5">
                  No tags yet. Paste a link or click AI Auto-Tag above.
                </span>
              ) : (
                selectedTags.map(t => (
                  <span
                    key={t.name}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-neutral-200"
                  >
                    <TagDot color={t.color} />
                    <span>{t.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t.name)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Custom Tag input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Type custom tag and press Enter..."
                className="h-8 flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="h-8 rounded-lg border border-white/10 bg-white/10 px-3 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Personal Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Why this is in your vault..."
              className="h-8.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isFavorite ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Star className={`size-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              <span>{isFavorite ? 'Starred' : 'Star bookmark'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8.5 rounded-xl border border-white/10 bg-white/5 px-3.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8.5 rounded-xl bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
              >
                Save to Vault
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Add Collection Modal
interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (collection: { name: string; icon: string }) => void;
}

export function AddCollectionModal({
  isOpen,
  onClose,
  onAdd
}: AddCollectionModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Folder');

  if (!isOpen) return null;

  const icons = [
    { name: 'Folder', component: Folder },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Lightbulb', component: Lightbulb },
    { name: 'Heart', component: Heart },
    { name: 'Bookmark', component: Bookmark },
    { name: 'Flag', component: Flag }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), icon });
    setName('');
    setIcon('Folder');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-semibold text-sm text-strong">New collection</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Collection Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. TikTok Recipes"
              className="h-8 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Icon
            </label>
            <div className="flex items-center gap-2">
              {icons.map(ic => {
                const IconComponent = ic.component;
                const isSelected = icon === ic.name;
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIcon(ic.name)}
                    className={`flex size-8 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <IconComponent className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Note Modal
interface NoteModalProps {
  bookmark: BookmarkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, note: string) => void;
}

export function NoteModal({
  bookmark,
  isOpen,
  onClose,
  onSave
}: NoteModalProps) {
  const [note, setNote] = useState(bookmark?.note || '');

  React.useEffect(() => {
    if (bookmark) setNote(bookmark.note || '');
  }, [bookmark]);

  if (!isOpen || !bookmark) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={bookmark.platform} className="size-3.5" />
            <h3 className="font-semibold text-sm text-strong truncate max-w-[280px]">
              Note for {bookmark.displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="line-clamp-2 text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
            &quot;{bookmark.text}&quot;
          </p>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={5}
            placeholder="Write your thoughts or tags for this bookmark..."
            className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              onClick={onClose}
              className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(bookmark.id, note);
                onClose();
              }}
              className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Image Lightbox Modal
export function ImageLightboxModal({
  imageUrl,
  isOpen,
  onClose
}: {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white backdrop-blur-xs transition-colors"
        >
          <X className="size-5" />
        </button>
        <Image
          src={imageUrl}
          alt="Full preview"
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}

// 5. Feedback Modal
export function FeedbackModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-semibold text-sm text-strong">Send Feedback</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="flex size-10 mx-auto items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="size-5" />
            </div>
            <h4 className="text-sm font-medium text-strong">Thank you!</h4>
            <p className="text-xs text-muted-foreground">Your feedback has been received.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFeedback('');
                onClose();
              }}
              className="mt-4 inline-flex h-8 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-4 space-y-3"
          >
            <textarea
              required
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              placeholder="What do you think of Stashr? Any features you want to see?"
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-ring"
            />
            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 6. Edit Collection Modal
interface EditCollectionModalProps {
  isOpen: boolean;
  collection: Collection | null;
  onClose: () => void;
  onSave: (id: string, updates: { name: string; icon: string }) => void;
  onDelete: (id: string) => void;
}

export function EditCollectionModal({
  isOpen,
  collection,
  onClose,
  onSave,
  onDelete
}: EditCollectionModalProps) {
  const [name, setName] = useState(collection?.name || '');
  const [icon, setIcon] = useState(collection?.icon || 'Folder');

  React.useEffect(() => {
    if (collection) {
      setName(collection.name);
      setIcon(collection.icon || 'Folder');
    }
  }, [collection]);

  if (!isOpen || !collection) return null;

  const icons = [
    { name: 'Folder', component: Folder },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Lightbulb', component: Lightbulb },
    { name: 'Heart', component: Heart },
    { name: 'Bookmark', component: Bookmark },
    { name: 'Flag', component: Flag }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(collection.id, { name: name.trim(), icon });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Pencil className="size-4 text-primary" />
            <h3 className="font-semibold text-sm text-strong">Edit collection</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Collection Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Design Inspiration"
              className="h-8 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Icon
            </label>
            <div className="flex items-center gap-2">
              {icons.map(ic => {
                const IconComponent = ic.component;
                const isSelected = icon === ic.name;
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIcon(ic.name)}
                    className={`flex size-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <IconComponent className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                onDelete(collection.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// 7. Confirm Dialog Modal
interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialogModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onClose
}: ConfirmDialogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150 select-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-strong">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border mt-5 pt-3.5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-8 rounded-lg px-4 text-xs font-medium transition-all shadow-xs cursor-pointer ${
              isDestructive
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. Edit Tags Modal
interface EditTagsModalProps {
  isOpen: boolean;
  bookmark: BookmarkItem | null;
  availableTags: Tag[];
  onClose: () => void;
  onSave: (bookmarkId: string, updatedTags: Array<{ name: string; color: TagColor }>) => Promise<void> | void;
  onGenerateTags?: (bookmark: BookmarkItem) => Promise<void> | void;
}

export function EditTagsModal({
  isOpen,
  bookmark,
  availableTags,
  onClose,
  onSave,
  onGenerateTags
}: EditTagsModalProps) {
  const [currentTags, setCurrentTags] = useState<Array<{ name: string; color: TagColor }>>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [selectedColor, setSelectedColor] = useState<TagColor>('cyan');
  const [isSaving, setIsSaving] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  React.useEffect(() => {
    if (bookmark) {
      setCurrentTags(bookmark.tags ? [...bookmark.tags] : []);
      setCustomTagInput('');
    }
  }, [bookmark, isOpen]);

  if (!isOpen || !bookmark) return null;

  const handleAddTag = (name: string, color: TagColor) => {
    const cleanName = name.trim().toLowerCase();
    if (!cleanName) return;
    if (currentTags.some(t => t.name.toLowerCase() === cleanName)) return;

    soundFx.playTagSound();
    setCurrentTags(prev => [...prev, { name: cleanName, color }]);
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagName: string) => {
    soundFx.playTagSound();
    setCurrentTags(prev => prev.filter(t => t.name.toLowerCase() !== tagName.toLowerCase()));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(bookmark.id, currentTags);
      soundFx.playAiSuccessSound();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (!onGenerateTags) return;
    setIsAIGenerating(true);
    try {
      await onGenerateTags(bookmark);
      const updatedBookmarks = JSON.parse(localStorage.getItem('stashr_bookmarks_v3') || '[]');
      const target = updatedBookmarks.find((b: any) => b.id === bookmark.id);
      if (target && target.tags) {
        setCurrentTags(target.tags);
      }
    } finally {
      setIsAIGenerating(false);
    }
  };

  const colors: TagColor[] = ['cyan', 'teal', 'blue', 'indigo', 'violet', 'pink', 'amber', 'orange', 'green', 'red'];

  const unassignedAvailableTags = availableTags.filter(
    avail => !currentTags.some(curr => curr.name.toLowerCase() === avail.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <TagDot color="cyan" />
            <h2 className="text-sm font-semibold text-white">Edit Tags</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Bookmark Info */}
        <div className="rounded-xl border border-white/[0.06] bg-black/30 p-2.5">
          <p className="text-xs font-medium text-white line-clamp-1">
            {bookmark.title || bookmark.text || 'Untitled Bookmark'}
          </p>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">
            {bookmark.displayName || bookmark.username || bookmark.platform}
          </span>
        </div>

        {/* Current Active Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-300">Active Tags ({currentTags.length})</label>
            {onGenerateTags && (
              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={isAIGenerating}
                className="inline-flex items-center gap-1.5 text-[11px] text-purple-300 hover:text-purple-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`size-3 text-purple-400 ${isAIGenerating ? 'animate-spin' : ''}`} />
                <span>{isAIGenerating ? 'Generating...' : 'AI Auto-Suggest'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 min-h-10 rounded-xl border border-white/10 bg-black/40 p-2.5">
            {currentTags.length === 0 ? (
              <span className="text-xs text-neutral-500 italic">No tags attached to this bookmark.</span>
            ) : (
              currentTags.map(tag => (
                <span
                  key={tag.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.06] text-xs text-neutral-200 group/tagpill"
                >
                  <TagDot color={tag.color} />
                  <span>{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.name)}
                    className="text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer ml-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Add New Custom Tag */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300">Add New Tag</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTagInput}
              onChange={e => setCustomTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(customTagInput, selectedColor);
                }
              }}
              placeholder="Type tag name and press Enter..."
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddTag(customTagInput, selectedColor)}
              disabled={!customTagInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {/* Color selector */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-neutral-400 mr-1">Color:</span>
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`size-4.5 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                  selectedColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <TagDot color={c} />
              </button>
            ))}
          </div>
        </div>

        {/* Suggested / Available Tags from Catalog */}
        {unassignedAvailableTags.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-neutral-400">Available from Vault</label>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {unassignedAvailableTags.slice(0, 15).map(avail => (
                <button
                  key={avail.id}
                  type="button"
                  onClick={() => handleAddTag(avail.name, avail.color)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="size-2.5 text-neutral-400" />
                  <TagDot color={avail.color} />
                  <span>{avail.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-white/[0.08] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Tags'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. Add Tag Modal (Sidebar / Global)
interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, color: TagColor) => void;
  existingTags?: Tag[];
}

export function AddTagModal({
  isOpen,
  onClose,
  onAdd,
  existingTags = []
}: AddTagModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<TagColor>('cyan');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colors: TagColor[] = ['cyan', 'teal', 'blue', 'indigo', 'violet', 'pink', 'amber', 'orange', 'green', 'red'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toLowerCase();
    if (!cleanName) {
      setError('Tag name is required');
      return;
    }
    if (existingTags.some(t => t.name.toLowerCase() === cleanName)) {
      setError('Tag already exists with this name');
      return;
    }

    soundFx.playTagSound();
    onAdd(cleanName, color);
    setName('');
    setColor('cyan');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <TagDot color={color} />
            <h2 className="text-sm font-semibold text-white">Create New Tag</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tag Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Tag Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. design system, finance, tutorials..."
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none"
            />
            {error && <p className="text-[11px] text-rose-400">{error}</p>}
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Tag Color</label>
            <div className="flex items-center gap-2 py-1">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121214] scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <TagDot color={c} />
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-black/30 p-2.5">
            <span className="text-[11px] text-neutral-400 block mb-1">Preview</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.06] text-xs text-neutral-200">
              <TagDot color={color} />
              <span>{name.trim() || 'preview tag'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-white/[0.08] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              Create Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 11. Edit / Manage Tag Modal
interface EditTagModalProps {
  isOpen: boolean;
  tag: Tag | null;
  onClose: () => void;
  onSave: (id: string, name: string, color: TagColor) => void;
  onDelete?: (id: string) => void;
}

export function EditTagModal({
  isOpen,
  tag,
  onClose,
  onSave,
  onDelete
}: EditTagModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<TagColor>('cyan');

  React.useEffect(() => {
    if (tag) {
      setName(tag.name);
      setColor(tag.color);
    }
  }, [tag, isOpen]);

  if (!isOpen || !tag) return null;

  const colors: TagColor[] = ['cyan', 'teal', 'blue', 'indigo', 'violet', 'pink', 'amber', 'orange', 'green', 'red'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toLowerCase();
    if (!cleanName) return;

    soundFx.playTagSound();
    onSave(tag.id, cleanName, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <TagDot color={color} />
            <h2 className="text-sm font-semibold text-white">Edit Tag</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tag Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tag name"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Tag Color</label>
            <div className="flex items-center gap-2 py-1">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121214] scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <TagDot color={c} />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(tag.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Save Tag
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
