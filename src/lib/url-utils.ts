/**
 * Pure URL utility functions safe for both Server (Node/RSC/API routes) and Client environments.
 */

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
  for (let i = 0; i < 6; i++) {
    const prev = res;
    res = res.replace(
      /(https?:\/\/[^\s\n]+)\n([a-zA-Z0-9_\-.~!*'();:@&=+$,/?%#[\]]+)/gi,
      (match, p1, p2) => p1 + p2
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
