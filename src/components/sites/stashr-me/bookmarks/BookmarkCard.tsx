'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { BookmarkItem, ViewMode } from '@/types/stashr';
import {
  PlatformIcon,
  TagDot,
  Star,
  FileText,
  ExternalLink,
  MoreHorizontal,
  Archive,
  Trash2,
  Copy,
  Check
} from '@/components/icons';

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
  onOpenImage
}: BookmarkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmark.url) {
      navigator.clipboard.writeText(bookmark.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. ROW VIEW VARIANT (Compact Table Row)
  if (viewMode === 'row') {
    return (
      <article
        onClick={isSelectionMode ? onToggleSelect : undefined}
        className={`group/row relative flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-foreground text-xs shadow-xs ring-1 ring-foreground/5 transition-all hover:bg-accent/30 ${
          isSelected ? 'bg-primary/5 ring-primary' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isSelectionMode && (
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40'
              }`}
            >
              {isSelected && <Check className="size-3" />}
            </div>
          )}

          <div className="relative size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/10 bg-muted">
            {bookmark.avatarUrl ? (
              <Image
                src={bookmark.avatarUrl}
                alt={bookmark.displayName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-accent text-[10px] font-medium text-strong">
                {bookmark.displayName.charAt(0)}
              </div>
            )}
          </div>

          <span className="font-medium text-strong truncate text-xs min-w-24">
            {bookmark.displayName}
          </span>

          <PlatformIcon platform={bookmark.platform} className="size-3.5 shrink-0" />

          <p className="line-clamp-1 flex-1 text-foreground min-w-0">
            {bookmark.text}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1">
            {bookmark.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                <TagDot color={tag.color} />
                <span>{tag.name}</span>
              </span>
            ))}
          </div>

          <span className="text-[11px] font-mono text-muted-foreground">
            {bookmark.date}
          </span>

          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(bookmark.id);
            }}
            className={`rounded p-1 transition-colors ${
              bookmark.isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className={`size-3.5 ${bookmark.isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </article>
    );
  }

  // 2. TIMELINE VIEW VARIANT (Expanded Feed Item)
  if (viewMode === 'timeline') {
    return (
      <article
        onClick={isSelectionMode ? onToggleSelect : undefined}
        className={`group/timeline relative mx-auto max-w-xl flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-foreground text-sm shadow-card ring-1 ring-foreground/10 transition-all hover:shadow-md ${
          isSelected ? 'bg-primary/5 ring-primary ring-2' : ''
        }`}
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/10 bg-muted">
              {bookmark.avatarUrl ? (
                <Image
                  src={bookmark.avatarUrl}
                  alt={bookmark.displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-accent text-xs font-semibold text-strong">
                  {bookmark.displayName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm text-strong">{bookmark.displayName}</div>
              <div className="text-xs text-muted-foreground">@{bookmark.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PlatformIcon platform={bookmark.platform} className="size-4" />
            <span className="text-xs font-mono text-muted-foreground">{bookmark.date}</span>
          </div>
        </header>

        <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
          {bookmark.text}
        </p>

        {bookmark.imageUrl && (
          <div
            onClick={e => {
              e.stopPropagation();
              onOpenImage?.(bookmark.imageUrl!);
            }}
            className="relative h-64 w-full overflow-hidden rounded-xl object-cover ring-1 ring-foreground/10 cursor-pointer"
          >
            <Image
              src={bookmark.imageUrl}
              alt={bookmark.displayName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <footer className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5">
            {bookmark.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
              >
                <TagDot color={tag.color} />
                <span>{tag.name}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(bookmark.id);
              }}
              className={`rounded-md p-1.5 transition-colors ${
                bookmark.isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Star className={`size-4 ${bookmark.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            {bookmark.url && (
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent transition-colors"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </footer>
      </article>
    );
  }

  // 3. GRID & MOSAIC VIEW VARIANT (Exact Stashr Card)
  return (
    <div
      onClick={isSelectionMode ? onToggleSelect : undefined}
      className={`group/bookmarkcard relative flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-3 text-foreground text-sm shadow-card ring-1 ring-foreground/10 ${
        isSelected ? 'ring-primary ring-2' : ''
      }`}
    >
      <div className="absolute top-1 right-1 z-10 flex items-center gap-0.5">
        <div className="flex items-center gap-0.5 rounded-lg bg-linear-to-l from-card from-60% to-transparent pl-8 opacity-0 transition-opacity group-hover/bookmarkcard:opacity-100 has-focus-visible:opacity-100">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-haspopup="menu"
              className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 size-8"
              aria-expanded={isMenuOpen}
            >
              <MoreHorizontal className="size-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={e => {
                    handleCopyLink(e);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copied ? 'Copied link' : 'Copy link'}</span>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onOpenNote(bookmark);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <FileText className="size-3.5" />
                  <span>{bookmark.note ? 'Edit note' : 'Add note'}</span>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onArchive(bookmark.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Archive className="size-3.5" />
                  <span>{bookmark.isArchived ? 'Restore' : 'Archive'}</span>
                </button>

                <div className="my-1 border-t border-border" />

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
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              if (bookmark.url) {
                window.open(bookmark.url, '_blank', 'noopener,noreferrer');
              } else {
                onOpenNote(bookmark);
              }
            }}
            aria-label="View"
            className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 size-8"
          >
            {bookmark.url ? <ExternalLink className="size-4" /> : <FileText className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full image-transparent-border size-10 bg-muted relative">
          {bookmark.avatarUrl ? (
            <Image
              src={bookmark.avatarUrl}
              alt={bookmark.displayName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-xs font-semibold">{bookmark.displayName.charAt(0)}</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <span className="truncate font-medium text-strong">
            {bookmark.displayName}
          </span>
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
      <div className="space-y-3 whitespace-pre-line text-foreground text-sm">
        <p>
          <span>{bookmark.text}</span>
        </p>
      </div>

      {bookmark.imageUrl && (
        <div
          onClick={e => {
            e.stopPropagation();
            onOpenImage?.(bookmark.imageUrl!);
          }}
          className="relative h-64 w-full overflow-hidden rounded-xl object-cover ring-1 ring-foreground/10 cursor-pointer"
        >
          <Image
            src={bookmark.imageUrl}
            alt={bookmark.displayName}
            fill
            className="object-cover transition-transform duration-300 hover:scale-102"
            unoptimized
          />
        </div>
      )}

      {bookmark.note && (
        <div
          onClick={e => {
            e.stopPropagation();
            onOpenNote(bookmark);
          }}
          className="flex items-start gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-2 text-xs italic text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <FileText className="size-3 shrink-0 text-primary mt-0.5" />
          <span className="line-clamp-2">{bookmark.note}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto pt-2">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="flex min-w-0 items-center gap-1.5">
            {bookmark.tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                className="group/button inline-flex select-none items-center justify-center whitespace-nowrap border bg-clip-padding outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50 rounded-[min(var(--radius-md),10px)] font-normal text-xs h-5 text-muted-foreground dark:border-border gap-1 px-1.5 py-0.25 min-w-0 shrink"
              >
                <TagDot color={tag.color} />
                <span className="truncate">{tag.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-muted-foreground text-xs">{bookmark.date}</span>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center justify-center overflow-hidden rounded-full size-4 shrink-0 bg-muted relative">
            <PlatformIcon platform={bookmark.platform} className="size-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
