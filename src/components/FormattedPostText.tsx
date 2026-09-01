'use client';

import React from 'react';
import { ExternalLink } from '@/components/icons';

/**
 * Automatically repairs URLs that were broken across lines or split by spans/spaces
 * e.g. "https://\n  github.com/buka-studio/ww\nw-marijanapav" -> "https://github.com/buka-studio/www-marijanapav"
 */
export function repairFragmentedUrls(text?: string | null): string {
  if (!text) return '';

  let res = text;

  // 1. Fix protocol followed by spaces/newlines: "https://\n  github.com" or "https:// github.com"
  res = res.replace(/(https?:\/\/)\s+([a-zA-Z0-9])/gi, '$1$2');

  // 2. Fix multi-line URL breaks where path or domain continued on next line without spaces
  // Repeat to stitch multi-segment breaks
  for (let i = 0; i < 6; i++) {
    const prev = res;
    res = res.replace(
      /(https?:\/\/[^\s\n]+)\n([a-zA-Z0-9_\-.~!*'();:@&=+$,/?%#[\]]+)/gi,
      (match, p1, p2) => {
        // If p2 starts with punctuation or doesn't have spaces, join cleanly
        return p1 + p2;
      }
    );
    if (res === prev) break;
  }

  // 3. Fix standalone domain breaks without http (e.g. "github.com/buka-studio/ww\nw-marijanapav")
  for (let i = 0; i < 4; i++) {
    const prev = res;
    res = res.replace(
      /([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s\n]+)?)\n([a-zA-Z0-9_\-.~!*'();:@&=+$,/?%#[\]]+)/gi,
      '$1$2'
    );
    if (res === prev) break;
  }

  return res;
}

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

  // Regex to match URLs (http://, https://, www.), @mentions, and #hashtags
  const tokenRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+|@[a-zA-Z0-9_]{1,50}|#[a-zA-Z0-9_\u0080-\uFFFF]+)/g;

  // Split into lines to preserve structure
  const lines = repairedText.split('\n');

  return (
    <div
      className={`space-y-1.5 whitespace-pre-line text-neutral-100 ${
        maxLines && !isExpanded ? `line-clamp-${maxLines}` : ''
      } ${className}`}
    >
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const parts: React.ReactNode[] = [];
        let lastIdx = 0;
        let match: RegExpExecArray | null;

        tokenRegex.lastIndex = 0;
        while ((match = tokenRegex.exec(line)) !== null) {
          const matchedStr = match[0];
          const matchStart = match.index;

          // Text before match
          if (matchStart > lastIdx) {
            parts.push(line.substring(lastIdx, matchStart));
          }

          // Format token
          if (
            matchedStr.startsWith('http://') ||
            matchedStr.startsWith('https://') ||
            matchedStr.startsWith('www.')
          ) {
            // Trim any trailing punctuation from URL (e.g. '.', ',', ')', ':', ';', '!')
            let cleanUrl = matchedStr;
            let trailingPunctuation = '';
            const punctMatch = cleanUrl.match(/[.,;:!?)]+$/);
            if (punctMatch) {
              trailingPunctuation = punctMatch[0];
              cleanUrl = cleanUrl.slice(0, -trailingPunctuation.length);
            }

            const href = cleanUrl.startsWith('www.') ? `https://${cleanUrl}` : cleanUrl;

            parts.push(
              <React.Fragment key={`url-${lineIdx}-${matchStart}`}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
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
                key={`mention-${lineIdx}-${matchStart}`}
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
                key={`tag-${lineIdx}-${matchStart}`}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {matchedStr}
              </span>
            );
          }

          lastIdx = match.index + matchedStr.length;
        }

        // Remaining text on the line
        if (lastIdx < line.length) {
          parts.push(line.substring(lastIdx));
        }

        return (
          <p key={lineIdx} className="leading-relaxed break-words">
            {parts}
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
