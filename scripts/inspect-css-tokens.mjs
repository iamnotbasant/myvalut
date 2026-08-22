import fs from 'fs';

const css = fs.readFileSync('faltu/Stashr_files/index-CHQd4HDx.css', 'utf8');

// Search for card styles or background
console.log('CSS length:', css.length);

const rules = css.match(/--card:[^;]+|--background:[^;]+|--ring:[^;]+|--border:[^;]+|--shadow[^;]+/g);
console.log('Tokens found:', rules);
