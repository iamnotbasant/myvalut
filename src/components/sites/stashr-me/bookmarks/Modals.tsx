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
  Check
} from '@/components/icons';

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
  const [text, setText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('twitter');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen) return null;

  // Auto-detect platform from URL
  const handleUrlChange = (inputUrl: string) => {
    setUrl(inputUrl);
    if (inputUrl.includes('twitter.com') || inputUrl.includes('x.com')) {
      setPlatform('twitter');
    } else if (inputUrl.includes('reddit.com')) {
      setPlatform('reddit');
    } else if (inputUrl.includes('instagram.com')) {
      setPlatform('instagram');
    } else if (inputUrl.includes('tiktok.com')) {
      setPlatform('tiktok');
    } else if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) {
      setPlatform('youtube');
    } else if (inputUrl.startsWith('http')) {
      setPlatform('web');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !url.trim()) return;

    const tagsPayload = selectedTags.map(tagName => {
      const found = availableTags.find(t => t.name === tagName);
      return {
        name: tagName,
        color: (found?.color || 'blue') as TagColor
      };
    });

    onAdd({
      displayName: displayName.trim() || 'Basant',
      username: username.trim() || 'basant',
      platform,
      text: text.trim() || url,
      url: url.trim(),
      tags: tagsPayload,
      note: note.trim() || undefined,
      isFavorite
    });

    // Reset form
    setUrl('');
    setText('');
    setDisplayName('');
    setUsername('');
    setNote('');
    setSelectedTags([]);
    setIsFavorite(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-strong">
              Add new bookmark
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Source URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://x.com/username/status/..."
              className="h-8 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Content / Caption *
            </label>
            <textarea
              required
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              placeholder="Key insights, quote, or note from the save..."
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="h-8 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as PlatformType)}
                className="h-8 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus:border-ring"
              >
                <option value="twitter">Twitter / X</option>
                <option value="reddit">Reddit</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="web">Web</option>
              </select>
            </div>
          </div>

          {/* Tags Picker */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(t => {
                const isSelected = selectedTags.includes(t.name);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setSelectedTags(
                        isSelected
                          ? selectedTags.filter(x => x !== t.name)
                          : [...selectedTags, t.name]
                      );
                    }}
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                      isSelected
                        ? 'border-primary/40 bg-primary/10 text-primary font-medium'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <TagDot color={t.color} />
                    <span>{t.name}</span>
                    {isSelected && <Check className="size-3 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Personal Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Why this was saved..."
              className="h-8 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className={`size-3.5 ${isFavorite ? 'fill-amber-500' : ''}`} />
              <span>{isFavorite ? 'Starred' : 'Add to favorites'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                Save Bookmark
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
