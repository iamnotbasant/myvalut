import fs from 'fs';

const html = fs.readFileSync('faltu/Stashr.html', 'utf8');

function findSvgInside(elementStart, label) {
  const idx = html.indexOf(elementStart);
  if (idx === -1) {
    console.log(label, 'NOT FOUND');
    return;
  }
  const svgStart = html.indexOf('<svg', idx);
  const svgEnd = html.indexOf('</svg>', svgStart);
  console.log('=== ' + label + ' ===');
  console.log(html.substring(svgStart, svgEnd + 6));
}

findSvgInside('aria-label="Grid"', 'GRID ICON');
findSvgInside('aria-label="Row"', 'ROW ICON');
findSvgInside('aria-label="Timeline"', 'TIMELINE ICON');
findSvgInside('aria-label="Mosaic"', 'MOSAIC ICON');
findSvgInside('aria-label="Shuffle"', 'SHUFFLE ICON');
findSvgInside('Add Filters', 'ADD FILTERS ICON');
findSvgInside('Select', 'SELECT CURSOR ICON');
findSvgInside('Stashr extension installed', 'EXTENSION PUZZLE ICON');
findSvgInside('data-slot="avatar"', 'AVATAR IMG');
