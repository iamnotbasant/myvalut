import React, { useEffect } from 'react';
import Image from 'next/image';
import { BookmarkItem } from '@/types/stashr';
import { TagDot, PlatformIcon, RedditIcon, ExternalLink, Sparkles } from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';

interface BookmarkDetailModalProps {
  bookmark: BookmarkItem | null;
  isOpen: boolean;
  isGeneratingTags?: boolean;
  onClose: () => void;
  onSelectTag?: (tagName: string) => void;
  onGenerateTags?: (bookmark: BookmarkItem) => void;
}

export function BookmarkDetailModal({
  bookmark,
  isOpen,
  isGeneratingTags = false,
  onClose,
  onSelectTag,
  onGenerateTags
}: BookmarkDetailModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bookmark) return null;

  const handleOpenOriginalPost = () => {
    if (bookmark.url) {
      soundFx.playClickSound();
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };

  const isVideo =
    bookmark.imageUrl?.includes('13_') ||
    bookmark.imageUrl?.includes('video') ||
    bookmark.text?.toLowerCase().includes('animation') ||
    bookmark.text?.toLowerCase().includes('video');

  const isTextIdenticalToTitle = Boolean(
    bookmark.title &&
    bookmark.text &&
    (bookmark.text.trim().toLowerCase() === bookmark.title.trim().toLowerCase() ||
     bookmark.text.trim().replace(/\s+/g, ' ').toLowerCase() === bookmark.title.trim().replace(/\s+/g, ' ').toLowerCase() ||
     (bookmark.text.length < bookmark.title.length + 10 && bookmark.title.toLowerCase().includes(bookmark.text.toLowerCase().slice(0, 30))))
  );
  const hasDistinctText = Boolean(bookmark.text && !isTextIdenticalToTitle);

  const cleanImageUrl = bookmark.imageUrl?.includes('hqdefault.jpg')
    ? bookmark.imageUrl.replace('hqdefault.jpg', 'maxresdefault.jpg')
    : bookmark.imageUrl;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        onDoubleClick={handleOpenOriginalPost}
        title="Double-click to open original post in a new tab"
        className="relative flex flex-col gap-4 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e] p-5 text-foreground shadow-[0_25px_60px_-15px_rgba(0,0,0,0.98)] ring-1 ring-white/10 animate-in zoom-in-95 duration-150 scrollbar-none select-none group/modal"
      >
        {/* Top Right Action Bar: Open Original Post Button + Close Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {bookmark.url && (
            <button
              type="button"
              onClick={handleOpenOriginalPost}
              title="Open original post (or double-click anywhere)"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Open Post</span>
              <ExternalLink className="size-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onClose();
            }}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Header with Avatar & Author */}
        <div className="flex items-center gap-3 pr-32">
          {bookmark.avatarUrl ? (
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-11 ring-2 ring-white/20 bg-muted relative shadow-md">
              <Image
                src={bookmark.avatarUrl}
                alt={bookmark.displayName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : bookmark.platform === 'reddit' ? (
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-11 ring-2 ring-white/20 shadow-md">
              <RedditIcon className="size-full" />
            </div>
          ) : (
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-11 ring-2 ring-white/20 bg-accent text-sm font-semibold text-strong shadow-md">
              {bookmark.displayName ? bookmark.displayName.charAt(0).toUpperCase() : <PlatformIcon platform={bookmark.platform} />}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <span className="truncate font-semibold text-white text-base leading-tight tracking-tight">
              {bookmark.displayName}
            </span>
            {bookmark.username && (
              <span className="truncate text-xs text-neutral-400 leading-tight mt-0.5">
                {bookmark.platform === 'reddit' ? `r/${bookmark.username}` : `@${bookmark.username}`}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        {bookmark.title && (
          <h2 className="font-semibold text-white text-base leading-snug">
            {bookmark.title}
          </h2>
        )}

        {/* Post Text */}
        {hasDistinctText && bookmark.text && (
          <div className="space-y-3 whitespace-pre-line text-[14.5px] leading-relaxed text-neutral-100 font-normal">
            <p>{bookmark.text}</p>
          </div>
        )}

        {/* Media / Video Preview */}
        {cleanImageUrl && (
          <div
            onDoubleClick={handleOpenOriginalPost}
            title="Double-click to open original post"
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#080808] w-full group/media shadow-inner cursor-pointer ${
              bookmark.platform === 'youtube' ? 'aspect-video' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cleanImageUrl}
              alt={bookmark.displayName}
              className={`w-full object-cover transition-transform duration-300 group-hover/media:scale-[1.01] ${
                bookmark.platform === 'youtube' ? 'aspect-video h-full' : 'h-auto max-h-[32rem]'
              }`}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('maxresdefault.jpg')) {
                  target.src = target.src.replace('maxresdefault.jpg', 'mqdefault.jpg');
                }
              }}
            />

            {/* Subtle Overlay Badge on Hover */}
            <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 group-hover/media:opacity-100 transition-opacity bg-black/70 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-medium text-neutral-200 flex items-center gap-1.5 shadow-lg">
              <span>Double-click to open post</span>
              <ExternalLink className="size-3" />
            </div>

            {/* Video Play Button Overlay */}
            {isVideo && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center rounded-full bg-black/75 ring-1 ring-white/30 backdrop-blur-md size-13 shadow-2xl transition-transform group-hover/media:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white ml-0.5">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer: Tags and Platform */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Tags list */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {isGeneratingTags ? (
              <div className="inline-flex shrink-0 select-none items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 text-xs text-purple-200 shadow-[0_0_12px_-2px_rgba(168,85,247,0.35)] animate-pulse">
                <Sparkles className="size-3.5 text-purple-400 animate-spin" />
                <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent font-medium text-xs tracking-wide">
                  Generating tags...
                </span>
              </div>
            ) : bookmark.tags && bookmark.tags.length > 0 ? (
              bookmark.tags.map((tag, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onSelectTag?.(tag.name);
                    onClose();
                  }}
                  className="inline-flex select-none items-center justify-center whitespace-nowrap border border-white/10 bg-[#171717] hover:bg-[#222222] hover:border-white/20 rounded-lg font-normal text-xs h-6 text-neutral-200 hover:text-white gap-1.5 px-2.5 py-0.5 cursor-pointer transition-all active:scale-95"
                >
                  <TagDot color={tag.color} />
                  <span>{tag.name}</span>
                </button>
              ))
            ) : onGenerateTags ? (
              <button
                type="button"
                onClick={() => onGenerateTags(bookmark)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="size-3 text-purple-400" />
                <span>Generate AI tags</span>
              </button>
            ) : (
              <span className="text-xs text-neutral-500">No tags</span>
            )}
          </div>

          {/* Date and Centered Platform Icon */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-neutral-400 text-xs font-normal">{bookmark.date}</span>
            <div className="h-3.5 w-px bg-white/10"></div>
            <PlatformIcon platform={bookmark.platform} />
          </div>
        </div>
      </div>
    </div>
  );
}
