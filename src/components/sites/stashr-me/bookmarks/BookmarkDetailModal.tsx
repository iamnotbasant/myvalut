'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { BookmarkItem } from '@/types/stashr';
import { TagDot, PlatformIcon, RedditIcon, GitHubIcon, ExternalLink, Sparkles } from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';
import { FormattedPostText, repairFragmentedUrls, resolveBookmarkDisplayContent } from '@/components/FormattedPostText';

interface BookmarkDetailModalProps {
  bookmark: BookmarkItem | null;
  isOpen: boolean;
  isGeneratingTags?: boolean;
  isSummarizing?: boolean;
  onClose: () => void;
  onSelectTag?: (tagName: string) => void;
  onGenerateTags?: (bookmark: BookmarkItem) => void;
  onSummarize?: (bookmark: BookmarkItem) => void;
  onOpenImage?: (imageUrl: string) => void;
}

export function BookmarkDetailModal({
  bookmark,
  isOpen,
  isGeneratingTags = false,
  isSummarizing = false,
  onClose,
  onSelectTag,
  onGenerateTags,
  onSummarize,
  onOpenImage
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

  const isGitHub =
    bookmark.platform === 'github' ||
    (bookmark.url && bookmark.url.toLowerCase().includes('github.com'));

  const isSocialPlatform =
    ['youtube', 'twitter', 'reddit', 'instagram', 'tiktok', 'bluesky', 'threads'].includes(
      bookmark.platform
    ) && !isGitHub;

  const isVideo =
    bookmark.imageUrl?.includes('13_') ||
    bookmark.imageUrl?.includes('video') ||
    bookmark.text?.toLowerCase().includes('animation') ||
    bookmark.text?.toLowerCase().includes('video');

  const { showTitle, title: displayTitle, showText, text: displayText } = resolveBookmarkDisplayContent(bookmark);

  const cleanImageUrl = bookmark.imageUrl?.includes('hqdefault.jpg')
    ? bookmark.imageUrl.replace('hqdefault.jpg', 'maxresdefault.jpg')
    : bookmark.imageUrl;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex flex-col gap-4 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e] p-4 sm:p-6 pb-5 sm:pb-6 text-foreground shadow-[0_25px_60px_-15px_rgba(0,0,0,0.98)] ring-1 ring-white/10 animate-in zoom-in-95 duration-150 group/modal select-text"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Top Right Action Bar: Open Original Post Button + Close Button */}
        <div className="sticky top-0 z-20 -mt-1 flex items-center justify-end gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-[#0e0e0e]/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
            {bookmark.url && (
              <button
                type="button"
                onClick={handleOpenOriginalPost}
                title="Open original post in new tab"
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
        </div>

        {/* Header with Avatar & Author / Platform Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 -mt-6 pr-20 sm:pr-32">
          {isGitHub ? (
            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-11 ring-2 ring-white/20 bg-black text-white shadow-md">
              <GitHubIcon className="size-6 text-white" />
            </div>
          ) : bookmark.avatarUrl && isSocialPlatform ? (
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
              {bookmark.displayName ? bookmark.displayName.charAt(0).toUpperCase() : <PlatformIcon platform={bookmark.platform} url={bookmark.url} />}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <span className="truncate font-semibold text-white text-base leading-tight tracking-tight">
              {isGitHub ? 'GitHub' : bookmark.displayName || 'Web'}
            </span>
            {isSocialPlatform && bookmark.username && (
              <span className="truncate text-xs text-neutral-400 leading-tight mt-0.5">
                {bookmark.platform === 'reddit' ? `r/${bookmark.username}` : `@${bookmark.username}`}
              </span>
            )}
          </div>
        </div>

        {/* Title (Only if distinct video/article title) */}
        {showTitle && displayTitle && (
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-white text-base leading-snug flex-1">
              <FormattedPostText text={displayTitle} />
            </h2>
            {(bookmark.platform === 'youtube' || bookmark.platform === 'instagram') && onSummarize && (
              <button
                type="button"
                onClick={() => onSummarize(bookmark)}
                disabled={isSummarizing}
                className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-xs text-purple-200 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                title="Regenerate in-depth AI breakdown without touching tags"
              >
                <Sparkles className={`size-3 text-purple-400 ${isSummarizing ? 'animate-spin' : ''}`} />
                <span>{isSummarizing ? 'Synthesizing...' : 'Regenerate Summary'}</span>
              </button>
            )}
          </div>
        )}

        {/* Post Text or Live AI Synthesis Skeleton */}
        {isSummarizing ? (
          <div className="relative overflow-hidden rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-950/30 via-[#13111c] to-indigo-950/20 p-4 shadow-inner space-y-3 animate-in fade-in-50 duration-300">
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-tag-shimmer bg-gradient-to-r from-transparent via-purple-400/10 to-transparent" />
            <div className="flex items-center gap-2 text-purple-300 font-medium text-xs animate-pulse">
              <Sparkles className="size-3.5 text-purple-400 animate-spin" />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent font-medium text-xs tracking-wide">
                Synthesizing Deep Breakdown & Key Takeaways...
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gradient-to-r from-purple-500/15 via-indigo-400/20 to-purple-500/15 rounded animate-pulse" />
              <div className="h-3 w-11/12 bg-gradient-to-r from-purple-500/15 via-indigo-400/20 to-purple-500/15 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="h-3 w-4/5 bg-gradient-to-r from-purple-500/15 via-indigo-400/20 to-purple-500/15 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : showText && displayText ? (
          <div className="space-y-3 text-[14.5px] leading-relaxed text-neutral-100 font-normal">
            <FormattedPostText text={displayText} />
          </div>
        ) : null}

        {/* Media / Video Preview (100% Full Uncropped Original Display with Smooth Scroll) */}
        {cleanImageUrl && (
          <div
            onDoubleClick={handleOpenOriginalPost}
            title="Double-click to open original post | Click to enlarge"
            className="relative rounded-xl border border-white/10 bg-[#080808] w-full group/media shadow-inner cursor-pointer flex flex-col items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cleanImageUrl}
              alt={bookmark.displayName}
              onClick={() => onOpenImage?.(cleanImageUrl)}
              className="w-full object-contain max-h-[65vh] rounded-lg transition-transform group-hover/media:scale-[1.005]"
              loading="lazy"
            />
            {/* Circular Frosted Video Play Button Overlay */}
            {isVideo && (
              <div
                onClick={handleOpenOriginalPost}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="flex items-center justify-center rounded-full bg-black/70 ring-1 ring-white/30 backdrop-blur-md size-14 shadow-2xl transition-transform group-hover/media:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white ml-0.5">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Box */}
        {bookmark.note && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm italic text-neutral-200">
            <span className="font-semibold text-primary not-italic text-xs block mb-1">Attached Note:</span>
            {bookmark.note}
          </div>
        )}

        {/* Footer: Tags and Platform */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.06] mt-auto">
          {/* Tags list */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {isGeneratingTags ? (
              <div className="flex items-center gap-1.5 shrink min-w-0">
                <div className="relative inline-flex shrink-0 select-none items-center gap-1.5 rounded-md border border-purple-500/40 bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-indigo-950/70 px-2.5 py-1 text-xs text-purple-200 shadow-[0_0_14px_-2px_rgba(168,85,247,0.45)] overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full animate-tag-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-purple-400" />
                  </span>
                  <Sparkles className="size-3 text-purple-300 animate-spin" />
                  <span className="bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200 bg-clip-text text-transparent font-medium text-xs tracking-wide">
                    AI Tagging...
                  </span>
                </div>
                <div className="relative hidden sm:inline-flex shrink-0 items-center gap-1 rounded-md border border-indigo-500/30 bg-[#151221] px-2.5 py-1 h-6 overflow-hidden animate-pulse">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full animate-tag-shimmer bg-gradient-to-r from-transparent via-purple-400/15 to-transparent" />
                  <span className="size-1.5 rounded-full bg-indigo-400/40" />
                  <div className="h-2 w-12 rounded-full bg-indigo-400/25" />
                </div>
              </div>
            ) : bookmark.tags && bookmark.tags.length > 0 ? (
              <>
                {bookmark.tags.map((tag, idx) => (
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
                ))}
                {onGenerateTags && (
                  <button
                    type="button"
                    onClick={() => onGenerateTags(bookmark)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-purple-950/30 hover:border-purple-500/30 text-[11px] text-neutral-400 hover:text-purple-300 transition-colors cursor-pointer ml-1"
                    title="Generate or refresh AI tags"
                  >
                    <Sparkles className="size-2.5 text-purple-400" />
                    <span>Refresh Tags</span>
                  </button>
                )}
              </>
            ) : onGenerateTags ? (
              <button
                type="button"
                onClick={() => onGenerateTags(bookmark)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="size-3 text-purple-400" />
                <span>Generate AI Tags</span>
              </button>
            ) : (
              <span className="text-xs text-neutral-500">No tags</span>
            )}
          </div>

          {/* Date and Platform Badge */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-neutral-400 text-xs font-normal">{bookmark.date}</span>
            <div className="h-3.5 w-px bg-white/10"></div>
            <PlatformIcon platform={bookmark.platform} url={bookmark.url} />
          </div>
        </div>
      </div>
    </div>
  );
}
