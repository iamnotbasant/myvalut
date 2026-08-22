import fs from 'fs';

const css = fs.readFileSync('faltu/Stashr_files/index-CHQd4HDx.css', 'utf8');

// Find dialog-related CSS rules
const matches = css.match(/\[data-slot="dialog[^"]*"\][^\{]*\{[^\}]*\}/g) || [];
console.log('Dialog slots:', matches.slice(0, 10));

const modalMatches = css.match(/(\.fixed|\.bg-card|\.shadow-card|\.rounded-xl|\.rounded-2xl|\.border-border)[^\{]*\{[^\}]*\}/g) || [];
console.log('Sample modal utility matches:', modalMatches.slice(0, 10));
