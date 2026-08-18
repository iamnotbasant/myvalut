import fs from 'fs';

const main = fs.readFileSync('scripts/extracted_main.html', 'utf8');

// Match articles
const articles = main.match(/<article[\s\S]*?<\/article>/g) || [];
console.log('Total articles found:', articles.length);

const parsedBookmarks = [];

articles.forEach((art, i) => {
  // Extract author display name & handle
  const nameMatch = art.match(/class="[^"]*truncate[^"]*font-medium[^"]*"[^>]*>([^<]+)<\/span>/);
  const handleMatch = art.match(/class="[^"]*truncate[^"]*text-muted-foreground[^"]*"[^>]*>([^<]+)<\/span>/);
  const textMatch = art.match(/<p class="[^"]*line-clamp-3[^"]*"[^>]*>([\s\S]*?)<\/p>/) ||
                    art.match(/<div class="[^"]*line-clamp-3[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const imgMatch = art.match(/<img[^>]*src="([^"]+)"/g);
  const dateMatch = art.match(/(\d{1,2}\s+[A-Za-z]{3}\s+\d{4}|\d+\s+(?:days?|hours?|mins?|months?)\s+ago)/);
  const linkMatch = art.match(/href="([^"]+)"/);

  console.log(`Bookmark #${i}:`, {
    name: nameMatch?.[1] || 'Unknown',
    handle: handleMatch?.[1] || '',
    date: dateMatch?.[1] || 'Recently',
    link: linkMatch?.[1] || '',
    imagesCount: imgMatch?.length || 0
  });
});
