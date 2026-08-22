import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

const toolbarIdx = html.indexOf('aria-label="Add Filters"');
if (toolbarIdx === -1) {
  const filterIdx = html.indexOf('Add Filters');
  console.log(html.substring(filterIdx - 300, filterIdx + 1500));
} else {
  console.log(html.substring(toolbarIdx - 300, toolbarIdx + 1500));
}
