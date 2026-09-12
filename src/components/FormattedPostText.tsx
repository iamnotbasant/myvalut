'use client';

import React from 'react';
import { ExternalLink } from '@/components/icons';
import { repairFragmentedUrls } from '@/lib/url-utils';

export { repairFragmentedUrls };

interface FormattedPostTextProps {
  text?: string | null;
  className?: string;
  maxLines?: number;
  isExpanded?: boolean;
}

/**
 * Tokenizes and renders text with:
 * - Active, clickable, formatted hyperlinks (<a href="..." target="_blank">)
 * - Highlights for mentions (@user) and hashtags (#tag)
 * - Safe click handling (stopPropagation)
 * - Preservation of user linebreaks
 */
export function FormattedPostText({
  text,
  className = '',
  maxLines,
  isExpanded = true,
}: FormattedPostTextProps) {
  if (!text) return null;

  const repairedText = repairFragmentedUrls(text);

  // Regex to match URLs (http://, https://, www., domain shortlinks like t.ly/..., bit.ly/...), @mentions, and #hashtags
  const tokenRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+|\b(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|io|co|me|ly|ai|app|dev|sh|is|to|in|so|gg|tv|cc|xyz|store|tech|link|site)\b(?:\/[^\s<>"'{}|\\^`]*)?|@[a-zA-Z0-9_]{1,50}|#[a-zA-Z0-9_\u0080-\uFFFF]+)/g;

  // Split into lines to preserve structure
  const lines = repairedText.split('\n');

  const renderFormattedTokens = (rawText: string, lineKey: string | number) => {
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    tokenRegex.lastIndex = 0;
    while ((match = tokenRegex.exec(rawText)) !== null) {
      const matchedStr = match[0];
      const matchStart = match.index;

      // Text before match
      if (matchStart > lastIdx) {
        const textBefore = rawText.substring(lastIdx, matchStart);
        parts.push(...renderInlineWithBold(textBefore, `${lineKey}-pre-${lastIdx}`));
      }

      // Format token
      const isMention = matchedStr.startsWith('@');
      const isHashtag = matchedStr.startsWith('#');

      if (!isMention && !isHashtag) {
        // Trim any trailing punctuation from URL (e.g. '.', ',', ')', ':', ';', '!')
        let cleanUrl = matchedStr;
        let trailingPunctuation = '';
        const punctMatch = cleanUrl.match(/[.,;:!?)]+$/);
        if (punctMatch) {
          trailingPunctuation = punctMatch[0];
          cleanUrl = cleanUrl.slice(0, -trailingPunctuation.length);
        }

        const domainPart = cleanUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').trim();
        if (!domainPart || !domainPart.includes('.')) {
          parts.push(...renderInlineWithBold(matchedStr, `${lineKey}-u-${matchStart}`));
          lastIdx = match.index + matchedStr.length;
          continue;
        }

        const href = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
          ? cleanUrl
          : `https://${cleanUrl}`;

        parts.push(
          <React.Fragment key={`url-${lineKey}-${matchStart}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Open link: ${href}`}
              className="inline-flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 underline underline-offset-3 decoration-sky-400/40 hover:decoration-sky-300 break-all transition-colors cursor-pointer"
            >
              <span className="break-all">{cleanUrl}</span>
              <ExternalLink className="size-3 inline-block shrink-0 opacity-75" />
            </a>
            {trailingPunctuation}
          </React.Fragment>
        );
      } else if (matchedStr.startsWith('@')) {
        const username = matchedStr.slice(1);
        parts.push(
          <a
            key={`mention-${lineKey}-${matchStart}`}
            href={`https://x.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
          >
            {matchedStr}
          </a>
        );
      } else if (matchedStr.startsWith('#')) {
        parts.push(
          <span
            key={`tag-${lineKey}-${matchStart}`}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {matchedStr}
          </span>
        );
      }

      lastIdx = match.index + matchedStr.length;
    }

    if (lastIdx < rawText.length) {
      parts.push(...renderInlineWithBold(rawText.substring(lastIdx), `${lineKey}-post-${lastIdx}`));
    }

    return parts;
  };

  function renderInlineWithBold(plainText: string, keyPrefix: string): React.ReactNode[] {
    if (!plainText.includes('**')) return [plainText];
    const pieces: React.ReactNode[] = [];
    const segments = plainText.split(/(\*\*[^*]+\*\*)/g);
    segments.forEach((seg, i) => {
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
        pieces.push(
          <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-white tracking-tight">
            {seg.slice(2, -2)}
          </strong>
        );
      } else if (seg) {
        pieces.push(seg);
      }
    });
    return pieces;
  }

  return (
    <div className={`space-y-1.5 whitespace-pre-line text-neutral-100 ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Markdown Header 1/2 (# or ##)
        if (/^#{1,2}\s+/.test(trimmed)) {
          const headerText = trimmed.replace(/^#{1,2}\s+/, '');
          return (
            <h2
              key={lineIdx}
              className="text-base sm:text-lg font-bold text-white pt-2 pb-1 border-b border-white/10 tracking-tight"
            >
              {renderFormattedTokens(headerText, lineIdx)}
            </h2>
          );
        }

        // Markdown Header 3 (###)
        if (/^#{3,}\s+/.test(trimmed)) {
          const subText = trimmed.replace(/^#{3,}\s+/, '');
          return (
            <h3
              key={lineIdx}
              className="text-[13.5px] font-semibold text-purple-300 pt-2 pb-0.5 tracking-wide flex items-center gap-1.5"
            >
              {renderFormattedTokens(subText, lineIdx)}
            </h3>
          );
        }

        // Bullet point lines (• or - or *)
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 leading-relaxed">
              <span className="select-none mt-2 size-1.5 rounded-full bg-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">{renderFormattedTokens(bulletContent, lineIdx)}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed break-words">
            {renderFormattedTokens(line, lineIdx)}
          </p>
        );
      })}
    </div>
  );
}

export interface DisplayContentResult {
  showTitle: boolean;
  title: string;
  showText: boolean;
  text: string;
}

/**
 * Determines whether a bookmark should show a separate title header or just the post text.
 * For social media (Twitter/X, Threads, Bluesky, etc.) where posts don't have titles,
 * or whenever the title is just a duplicated snippet of the post text, this eliminates
 * the redundant bold title header and renders clean post text directly 1:1 with the original platform.
 */
export function resolveBookmarkDisplayContent(bookmark: {
  title?: string | null;
  text?: string | null;
  platform?: string | null;
}): DisplayContentResult {
  const cleanTitle = repairFragmentedUrls(bookmark.title?.trim() || '');
  const cleanText = repairFragmentedUrls(bookmark.text?.trim() || '');

  // Strip trailing ellipsis and collapse spaces for comparison
  const normTitle = cleanTitle.replace(/\.\.\.$/, '').replace(/[…\s]+/g, ' ').trim().toLowerCase();
  const normText = cleanText.replace(/[…\s]+/g, ' ').trim().toLowerCase();

  const isBoilerplate =
    normText.includes('enjoy the videos and music you love') ||
    normText.includes('upload original content') ||
    normText.includes('saved from valut extension');

  const validText = isBoilerplate ? '' : cleanText;
  const validNormText = isBoilerplate ? '' : normText;

  // Check if title is an excerpt of text (e.g. first line or first 80 chars of tweet)
  const isTitleExcerptOfText = Boolean(
    normTitle &&
    validNormText &&
    (validNormText === normTitle ||
     validNormText.startsWith(normTitle) ||
     (normTitle.length >= 15 && validNormText.includes(normTitle.slice(0, 30))))
  );

  // Social platforms without separate title (Twitter/X, Threads, Bluesky, Mastodon, Instagram)
  const isSocialPost = ['twitter', 'threads', 'bluesky', 'instagram', 'tiktok'].includes(bookmark.platform || '');

  // If text exists and it's a social post or title was just auto-extracted from text:
  // ONLY show the text without any redundant fake title heading!
  if (validText && (isTitleExcerptOfText || isSocialPost)) {
    return {
      showTitle: false,
      title: '',
      showText: true,
      text: validText,
    };
  }

  // If there's no body text, show title
  if (!validText) {
    return {
      showTitle: true,
      title: cleanTitle,
      showText: false,
      text: '',
    };
  }

  // Both distinct title and text (e.g. YouTube video title + description, or Article)
  const isTitleDuplicateOfText = normTitle === validNormText;
  return {
    showTitle: Boolean(cleanTitle && !isTitleDuplicateOfText),
    title: cleanTitle,
    showText: Boolean(validText),
    text: validText,
  };
}
