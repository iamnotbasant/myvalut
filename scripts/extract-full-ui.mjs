import fs from 'fs';
import path from 'path';

// Let's inspect filter-menu-oyalYEMa.js, ViewTabs-Bjh2T3QA.js, and route-DTsoYpM6.js
const routeLayout = fs.readFileSync('scripts/extracted-chunks/route-DTsoYpM6.js', 'utf8');
const bookmarksView = fs.readFileSync('scripts/extracted-chunks/route-DGucVYvQ.js', 'utf8');
const viewTabs = fs.readFileSync('scripts/extracted-chunks/ViewTabs-Bjh2T3QA.js', 'utf8');
const filterMenu = fs.readFileSync('scripts/extracted-chunks/filter-menu-oyalYEMa.js', 'utf8');

console.log('=== ROUTE LAYOUT SNIPPETS ===');
// Search for sidebar links, icons, navigation items
const navMatches = routeLayout.match(/href:["'][^"']+["']/g) || [];
console.log('Nav hrefs:', [...new Set(navMatches)]);

// Search for sidebar item labels
const sidebarLabels = [
  'All Bookmarks', 'Bookmarks', 'Favorites', 'Archived', 'Tags', 'Collections', 
  'Settings', 'Appearance', 'Account', 'Billing', 'API Keys', 'Feedback', 'New Bookmark', 'Add Bookmark'
];
for (const label of sidebarLabels) {
  const found = routeLayout.includes(label) || bookmarksView.includes(label);
  console.log(`Label "${label}": ${found}`);
}

// Find view options (Grid, List, Mosaic, etc.)
console.log('\n=== VIEW TABS ===');
const viewModes = viewTabs.match(/(grid|list|mosaic|compact|table)/gi) || [];
console.log('View modes found:', [...new Set(viewModes)]);

// Find filter categories
console.log('\n=== FILTER MENU ===');
const filterCategories = ['platform', 'tag', 'media', 'author', 'date', 'type'];
for (const f of filterCategories) {
  const count = (filterMenu.match(new RegExp(f, 'gi')) || []).length;
  console.log(`Filter "${f}": ${count} matches`);
}
