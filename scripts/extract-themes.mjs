import fs from 'fs';

const cssContent = fs.readFileSync('C:/Users/httpb/.gemini/antigravity-ide/brain/25fa4498-5fad-4b1a-9e84-7492892eb1bf/.system_generated/steps/38/content.md', 'utf8');

// Find all :root and .dark variable declarations
const rootMatch = cssContent.match(/:root\s*\{[^}]+\}/g);
console.log('--- ALL ROOT RULES ---');
for (const r of rootMatch || []) {
  if (r.includes('--background') || r.includes('--sidebar') || r.includes('--foreground')) {
    console.log(r);
  }
}

const darkMatch = cssContent.match(/\.dark\s*\{[^}]+\}/g);
console.log('\n--- ALL DARK RULES ---');
for (const d of darkMatch || []) {
  if (d.includes('--background') || d.includes('--sidebar') || d.includes('--foreground')) {
    console.log(d);
  }
}
