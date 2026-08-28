'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { BookmarkItem, ViewMode } from '@/types/stashr';
import {
  PlatformIcon,
  RedditIcon,
  TagDot,
  Star,
  FileText,
  Archive,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ExternalLink
} from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  viewMode?: ViewMode;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onToggleSelect?: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenNote: (bookmark: BookmarkItem) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenImage?: (url: string) => void;
  onOpenDetail?: (bookmark: BookmarkItem) => void;
  isTagging?: boolean;
  onAutoTag?: () => void;
  onSelectTag?: (tagName: string) => void;
}

function getCleanImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  // If it's a YouTube URL, keep it valid
  return url;
}

export function BookmarkCard({
  bookmark,
  viewMode = 'grid',
  isSelected = false,
  isSelectionMode = false,
  onToggleSelect,
  onToggleFavorite,
  onOpenNote,
  onArchive,
  onDelete,
  onOpenImage,
  onOpenDetail,
  isTagging = false,
  onAutoTag,
  onSelectTag
}: BookmarkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(getCleanImageUrl(bookmark.imageUrl));
  const [hasImageError, setHasImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgSrc(getCleanImageUrl(bookmark.imageUrl));
    setHasImageError(false);
    setIsImageLoaded(false);
  }, [bookmark.imageUrl]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageError = () => {
    if (!imgSrc) {
      setHasImageError(true);
      return;
    }

    // YouTube multi-stage fallback ladder
    if (imgSrc.includes('maxresdefault.jpg')) {
      setImgSrc(imgSrc.replace('maxresdefault.jpg', 'hqdefault.jpg'));
    } else if (imgSrc.includes('hqdefault.jpg')) {
      setImgSrc(imgSrc.replace('hqdefault.jpg', 'mqdefault.jpg'));
    } else if (imgSrc.includes('mqdefault.jpg')) {
      setImgSrc(imgSrc.replace('mqdefault.jpg', '0.jpg'));
    } else {
      setHasImageError(true);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmark.url) {
      navigator.clipboard.writeText(bookmark.url);
      soundFx.playClickSound();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [rightClickMenu, setRightClickMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    position: { x: 0, y: 0 }
  });

  const handleCardContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRightClickMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const bookmarkMenuItems: ContextMenuItem[] = [
    {
      id: 'favorite',
      label: bookmark.isFavorite ? 'Unfavorite' : 'Favorite',
      icon: <Star className={`size-3.5 ${bookmark.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />,
      onClick: () => onToggleFavorite(bookmark.id)
    },
    {
      id: 'note',
      label: bookmark.note ? 'Edit Note' : 'Add Note',
      icon: <FileText className="size-3.5" />,
      onClick: () => onOpenNote(bookmark)
    },
    {
      id: 'autotag',
      label: 'Auto-Tag with AI',
      icon: <Sparkles className="size-3.5 text-primary" />,
      onClick: () => onAutoTag?.()
    },
    {
      id: 'copy',
      label: copied ? 'Copied Link!' : 'Copy Link',
      icon: copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />,
      onClick: () => {
        if (bookmark.url) {
          navigator.clipboard.writeText(bookmark.url);
          soundFx.playClickSound();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    },
    ...(bookmark.url ? [{
      id: 'open',
      label: 'Open in New Tab',
      icon: <ExternalLink className="size-3.5" />,
      onClick: () => {
        if (bookmark.url) window.open(bookmark.url, '_blank', 'noopener,noreferrer');
      }
    }] : []),
    {
      id: 'archive',
      label: bookmark.isArchived ? 'Unarchive' : 'Archive',
      icon: <Archive className="size-3.5" />,
      onClick: () => onArchive(bookmark.id)
    },
    {
      id: 'sep',
      label: '',
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete Bookmark',
      icon: <Trash2 className="size-3.5" />,
      danger: true,
      onClick: () => onDelete(bookmark.id)
    }
  ];

  const isVideo =
    bookmark.platform === 'youtube' ||
    bookmark.imageUrl?.includes('13_') ||
    bookmark.imageUrl?.includes('video') ||
    bookmark.imageUrl?.includes('YXY1') ||
    bookmark.text?.toLowerCase().includes('animation') ||
    bookmark.text?.toLowerCase().includes('video');

  // 1. ROW VIEW VARIANT (Horizontal Feed Card - Image 1 Match)
  if (viewMode === 'row') {
    return (
      <article
        onContextMenu={handleCardContextMenu}
        onClick={() => {
          if (isSelectionMode) {
            onToggleSelect?.();
          } else if (onOpenDetail) {
            onOpenDetail(bookmark);
          } else if (imgSrc && !hasImageError) {
            onOpenImage?.(imgSrc);
          }
        }}
        className={`group/row relative flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-4 text-foreground text-sm shadow-[0_10px_25px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-all hover:border-white/[0.18] hover:shadow-[0_16px_35px_-10px_rgba(0,0,0,0.9)] cursor-pointer ${
          isSelected ? 'ring-primary ring-2 border-primary bg-primary/5' : ''
        }`}
      >
        {/* Top Header: Avatar, Name, Handle, Selection Checkbox */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20 bg-muted">
              {bookmark.avatarUrl ? (
                <Image
                  src={bookmark.avatarUrl}
                  alt={bookmark.displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : bookmark.platform === 'reddit' ? (
                <RedditIcon className="size-full" />
              ) : (
                <div className="flex size-full items-center justify-center bg-accent text-xs font-semibold text-strong">
                  {bookmark.displayName ? bookmark.displayName.charAt(0) : 'V'}
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2 min-w-0 truncate">
              <span className="font-semibold text-white text-[13.5px] truncate">
                {bookmark.displayName}
              </span>
              {bookmark.username && (
                <span className="text-xs text-neutral-400 truncate">
                  @{bookmark.username}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSelectionMode ? (
              <div
                className={`flex size-4.5 items-center justify-center rounded border transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-black'
                    : 'border-neutral-600 bg-transparent'
                }`}
              >
                {isSelected && <Check className="size-3 stroke-[3]" />}
              </div>
            ) : (
              <div className="size-4 rounded border border-neutral-700/60 opacity-0 group-hover/row:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Middle Content & Optional Right Thumbnail */}
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 text-[13.5px] leading-relaxed text-neutral-200 line-clamp-3">
            {bookmark.text}
          </p>

          {imgSrc && !hasImageError && (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-900 group/thumb">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={bookmark.displayName}
                className={`size-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                } ${bookmark.platform === 'youtube' ? 'aspect-video' : ''}`}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                onError={handleImageError}
              />
              {isVideo && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex size-7 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/30 backdrop-blur-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white ml-0.5">
                      <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Tags + Date & Platform Badge */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {isTagging || (!bookmark.tags || bookmark.tags.length === 0) ? (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium shadow-[0_0_12px_rgba(168,85,247,0.25)] animate-pulse">
                <Sparkles className="size-3 text-purple-400 animate-spin" />
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-medium">✦ AI Tagging...</span>
              </div>
            ) : bookmark.tags && bookmark.tags.length > 0 ? (
              <>
                {bookmark.tags.slice(0, 3).map((tag, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectTag?.(tag.name);
                    }}
                    className="inline-flex select-none items-center justify-center whitespace-nowrap border border-neutral-700/70 bg-[#27272a]/70 hover:bg-[#3f3f46] hover:border-primary/40 rounded-lg font-normal text-xs h-6 text-neutral-300 hover:text-white gap-1.5 px-2.5 py-0.5 cursor-pointer transition-all active:scale-95"
                  >
                    <TagDot color={tag.color} />
                    <span>{tag.name}</span>
                  </button>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className="inline-flex select-none items-center justify-center whitespace-nowrap border border-neutral-700/70 bg-[#27272a]/70 rounded-lg font-normal text-xs h-6 text-neutral-400 px-2 py-0.5">
                    +{bookmark.tags.length - 3}
                  </span>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onAutoTag?.();
                }}
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors py-0.5 cursor-pointer"
              >
                <Sparkles className="size-3 text-neutral-400" />
                <span>✦ Auto-Tag</span>
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-neutral-400 text-xs font-normal">{bookmark.date}</span>
            <div className="h-3 w-px bg-neutral-700"></div>
            <PlatformIcon platform={bookmark.platform} />
          </div>
        </div>

        <ContextMenu
          isOpen={rightClickMenu.isOpen}
          position={rightClickMenu.position}
          items={bookmarkMenuItems}
          onClose={() => setRightClickMenu({ isOpen: false, position: { x: 0, y: 0 } })}
        />
      </article>
    );
  }

  // 2. TIMELINE VIEW VARIANT (Expanded Feed Card - Image 2 Match)
  if (viewMode === 'timeline') {
    return (
      <article
        onContextMenu={handleCardContextMenu}
        onClick={() => {
          if (isSelectionMode) {
            onToggleSelect?.();
          } else if (onOpenDetail) {
            onOpenDetail(bookmark);
          } else if (imgSrc && !hasImageError) {
            onOpenImage?.(imgSrc);
          }
        }}
        className={`group/timeline relative flex flex-col gap-3.5 rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-5 text-foreground text-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-all hover:border-white/[0.18] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9)] cursor-pointer ${
          isSelected ? 'ring-primary ring-2 border-primary bg-primary/5' : ''
        }`}
      >
        {/* Top Header: Avatar, Name, Handle, Menu & Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 bg-muted">
              {bookmark.avatarUrl ? (
                <Image
                  src={bookmark.avatarUrl}
                  alt={bookmark.displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : bookmark.platform === 'reddit' ? (
                <RedditIcon className="size-full" />
              ) : (
                <div className="flex size-full items-center justify-center bg-accent text-xs font-semibold text-strong">
                  {bookmark.displayName ? bookmark.displayName.charAt(0) : 'V'}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-white text-sm truncate">
                {bookmark.displayName}
              </span>
              {bookmark.username && (
                <span className="text-xs text-neutral-400 truncate">
                  @{bookmark.username}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(bookmark.id);
              }}
              className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Star className={`size-4 ${bookmark.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <PlatformIcon platform={bookmark.platform} />
          </div>
        </div>

        {/* Content text */}
        <p className="text-[14px] leading-relaxed text-neutral-200 whitespace-pre-line">
          {bookmark.text}
        </p>

        {/* Big Media Container */}
        {imgSrc && !hasImageError && (
          <div className="relative overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-900 group/media w-full">
            {!isImageLoaded && (
              <div className="w-full aspect-video bg-white/5 animate-pulse" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={bookmark.displayName}
              className={`w-full object-cover transition-opacity duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              } ${bookmark.platform === 'youtube' ? 'aspect-video' : 'max-h-[38rem]'}`}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              onError={handleImageError}
            />
            {isVideo && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                <div className="flex size-12 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/30 backdrop-blur-xs shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white ml-0.5">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer: Tags & Date */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {bookmark.tags && bookmark.tags.length > 0 && bookmark.tags.map((tag, idx) => (
              <button
                type="button"
                key={idx}
                onClick={e => {
                  e.stopPropagation();
                  onSelectTag?.(tag.name);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-neutral-700/70 bg-[#27272a]/70 hover:bg-[#3f3f46] text-xs text-neutral-300 hover:text-white"
              >
                <TagDot color={tag.color} />
                <span>{tag.name}</span>
              </button>
            ))}
          </div>
          <span className="text-neutral-400 text-xs shrink-0">{bookmark.date}</span>
        </div>

        <ContextMenu
          isOpen={rightClickMenu.isOpen}
          position={rightClickMenu.position}
          items={bookmarkMenuItems}
          onClose={() => setRightClickMenu({ isOpen: false, position: { x: 0, y: 0 } })}
        />
      </article>
    );
  }

  // 3. GRID & MOSAIC VIEW (Default - Image 5 Match)
  return (
    <div
      onContextMenu={handleCardContextMenu}
      onClick={() => {
        if (isSelectionMode) {
          onToggleSelect?.();
        } else if (onOpenDetail) {
          onOpenDetail(bookmark);
        } else if (imgSrc && !hasImageError) {
          onOpenImage?.(imgSrc);
        }
      }}
      className={`group/bookmarkcard relative flex flex-col gap-3.5 overflow-hidden rounded-2xl bg-[#0d0d0d] p-3.5 text-foreground text-sm border border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9)] hover:border-white/[0.18] transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-primary ring-2 border-primary' : ''
      }`}
    >
      {/* Top Right Floating Hover Action Bar */}
      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5">
        <div className="flex items-center gap-0.5 rounded-lg bg-gradient-to-l from-[#0d0d0d] from-60% to-transparent pl-8 opacity-0 transition-opacity group-hover/bookmarkcard:opacity-100 has-[:focus-visible]:opacity-100">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-all hover:bg-white/10 hover:text-white size-8 text-neutral-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12.0045" cy="12.5" r="1" fill="currentColor"/>
                <circle cx="18.0045" cy="12.5" r="1" fill="currentColor"/>
                <circle cx="6.0045" cy="12.5" r="1" fill="currentColor"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-white/10 bg-[#121212] p-1 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95"
              >
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onToggleFavorite(bookmark.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Star className={`size-3.5 ${bookmark.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{bookmark.isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onAutoTag?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Sparkles className="size-3.5 text-neutral-400" />
                  <span>Re-Tag with AI</span>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onOpenNote(bookmark);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="size-3.5" />
                  <span>{bookmark.note ? 'Edit Note' : 'Add Note'}</span>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onArchive(bookmark.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Archive className="size-3.5" />
                  <span>{bookmark.isArchived ? 'Unarchive' : 'Archive'}</span>
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onDelete(bookmark.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* View Popout Link Button (Exact Stashr SVG) */}
          <button
            type="button"
            aria-label="View"
            onClick={e => {
              e.stopPropagation();
              if (onOpenDetail) {
                onOpenDetail(bookmark);
              } else if (bookmark.url) {
                window.open(bookmark.url, '_blank', 'noopener,noreferrer');
              }
            }}
            className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-all hover:bg-white/10 hover:text-white size-8 text-neutral-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8.19915 15.8008L15.8008 8.19915M8.19915 15.8008C7.75558 15.3573 8.19018 13.2652 8.19915 12.6335M8.19915 15.8008C8.64273 16.2444 10.7348 15.8098 11.3665 15.8008M15.8008 8.19915C15.3573 7.75558 13.2652 8.19018 12.6335 8.19916M15.8008 8.19915C16.2444 8.64273 15.8098 10.7348 15.8008 11.3665" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Header with Avatar & Author */}
      <div className="flex items-center gap-2.5">
        {bookmark.avatarUrl ? (
          <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-10 ring-2 ring-white/20 bg-muted relative shadow-sm">
            <Image
              src={bookmark.avatarUrl}
              alt={bookmark.displayName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : bookmark.platform === 'reddit' ? (
          <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-10 ring-2 ring-white/20 shadow-sm">
            <RedditIcon className="size-full" />
          </div>
        ) : (
          <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full size-10 ring-2 ring-white/20 bg-accent text-xs font-semibold text-strong shadow-sm">
            {bookmark.displayName ? bookmark.displayName.charAt(0).toUpperCase() : <PlatformIcon platform={bookmark.platform} />}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="truncate font-semibold text-white text-[14.5px] leading-tight tracking-tight">
            {bookmark.displayName}
          </span>
          {bookmark.username && (
            <span className="truncate text-xs text-neutral-400 leading-tight">
              {bookmark.platform === 'reddit' ? `r/${bookmark.username}` : `@${bookmark.username}`}
            </span>
          )}
        </div>
        {isSelectionMode && (
          <div
            className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ml-auto mr-1 ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40'
            }`}
          >
            {isSelected && <Check className="size-3" />}
          </div>
        )}
      </div>

      {/* Title */}
      {bookmark.title && (
        <p className="font-semibold text-white text-sm leading-snug">
          {bookmark.title}
        </p>
      )}

      {/* Post Text & Show More */}
      {bookmark.text && (
        <div className="space-y-2 whitespace-pre-line text-[13.5px] leading-relaxed text-neutral-200">
          <p className={!isExpanded && bookmark.text.length > 220 ? "line-clamp-4" : ""}>
            <span>{bookmark.text}</span>
          </p>
          {bookmark.text.length > 220 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-xs text-neutral-400 hover:text-white font-medium transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Image / Video Preview (Natural Sizing with max-h-[34rem]) */}
      {imgSrc && !hasImageError && (
        <button
          type="button"
          aria-label="Open media"
          onClick={e => {
            e.stopPropagation();
            if (onOpenDetail) {
              onOpenDetail(bookmark);
            } else if (imgSrc) {
              onOpenImage?.(imgSrc);
            }
          }}
          className={`overflow-hidden rounded-xl border border-white/[0.08] bg-[#121214] relative block w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 group/media text-left ${
            bookmark.platform === 'youtube' ? 'aspect-video' : ''
          }`}
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={bookmark.displayName}
            className={`w-full object-cover transition-all duration-300 group-hover/media:scale-101 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              bookmark.platform === 'youtube' ? 'aspect-video h-full' : 'h-auto max-h-[34rem]'
            }`}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError}
          />
          {/* Circular Frosted Video Play Button Overlay */}
          {isVideo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center rounded-full bg-black/65 ring-1 ring-white/30 backdrop-blur-md size-12 shadow-2xl transition-transform group-hover/media:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white ml-0.5">
                  <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          )}
        </button>
      )}

      {/* Note Attachment Box */}
      {bookmark.note && (
        <div
          onClick={e => {
            e.stopPropagation();
            onOpenNote(bookmark);
          }}
          className="flex items-start gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 text-xs italic text-neutral-300 hover:bg-white/10 cursor-pointer transition-colors"
        >
          <FileText className="size-3 shrink-0 text-primary mt-0.5" />
          <span className="line-clamp-2">{bookmark.note}</span>
        </div>
      )}

      {/* Footer with Tags and Date/Platform */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <div className="flex min-w-0 flex-1 items-center">
          {isTagging || (!bookmark.tags || bookmark.tags.length === 0) ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium shadow-[0_0_12px_rgba(168,85,247,0.25)] animate-pulse">
              <Sparkles className="size-3 text-purple-400 animate-spin" />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-medium">✦ AI Tagging...</span>
            </div>
          ) : bookmark.tags && bookmark.tags.length > 0 ? (
            <div className="flex min-w-0 items-center gap-1.5">
              {bookmark.tags.slice(0, 2).map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectTag?.(tag.name);
                  }}
                  className="group/button inline-flex select-none items-center justify-center whitespace-nowrap border border-white/[0.08] bg-[#171717] hover:bg-[#222222] hover:border-white/20 rounded-lg font-normal text-xs h-5.5 text-neutral-300 hover:text-white gap-1.5 px-2 py-0.5 min-w-0 shrink transition-all cursor-pointer active:scale-95"
                >
                  <TagDot color={tag.color} />
                  <span className="truncate">{tag.name}</span>
                </button>
              ))}
              {bookmark.tags.length > 2 && (
                <div className="relative group/tagtooltip">
                  <button
                    type="button"
                    className="group/button inline-flex select-none items-center justify-center whitespace-nowrap border border-white/[0.08] bg-[#171717] hover:bg-[#222222] rounded-lg font-normal text-xs h-5.5 text-neutral-400 gap-1 px-2 py-0.5 shrink-0 transition-colors cursor-pointer"
                  >
                    +{bookmark.tags.length - 2}
                  </button>
                  {/* Floating Tag Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tagtooltip:flex flex-col items-center z-50">
                    <div className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#141414] px-2.5 py-1 text-xs text-neutral-200 shadow-2xl backdrop-blur-md whitespace-nowrap">
                      {bookmark.tags.slice(2).map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onSelectTag?.(tag.name);
                          }}
                          className="flex items-center gap-1.5 font-medium hover:text-white cursor-pointer"
                        >
                          <TagDot color={tag.color} />
                          <span>{tag.name}</span>
                          {idx < bookmark.tags.length - 3 && <span className="text-neutral-400">,</span>}
                        </button>
                      ))}
                    </div>
                    <div className="size-2 -mt-1 rotate-45 border-r border-b border-white/15 bg-[#141414]" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* + Add tags button when no tags */
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onAutoTag?.();
              }}
              className="group/addtag inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors py-0.5 cursor-pointer"
            >
              <Sparkles className="size-3 text-neutral-400" />
              <span className="font-medium text-[11px]">✦ Auto-Tag with AI</span>
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-neutral-400 text-xs font-normal">{bookmark.date}</span>
          <div className="h-3.5 w-px bg-white/[0.15]"></div>
          <PlatformIcon platform={bookmark.platform} />
        </div>
      </div>

      <ContextMenu
        isOpen={rightClickMenu.isOpen}
        position={rightClickMenu.position}
        items={bookmarkMenuItems}
        onClose={() => setRightClickMenu({ isOpen: false, position: { x: 0, y: 0 } })}
      />
    </div>
  );
}
