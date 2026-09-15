const fs = require('fs');
let g = fs.readFileSync('src/app/globals.css', 'utf8');

// Replace the invalid selector - need to handle multiline
g = g.replace(
  /\.link-underline:hover::after,\s*\.\link-underline\[data-active=\"true\"\]::after /g,
  '.link-underline:hover::after '
);

fs.writeFileSync('src/app/globals.css', g);
console.log('Fixed - removed invalid pseudo-element selector');