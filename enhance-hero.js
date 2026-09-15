const fs = require('fs');
let h = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Add gradient gold bar after the years timeline
// Find the years timeline closing div and add a gold accent bar
const yearsSearch = h.indexOf('years.map((year, index)');
if (yearsSearch > 0) {
  // Find the closing </div> of the years flex wrap
  let searchStart = yearsSearch;
  let divCount = 0;
  let pos = searchStart;
  while (pos < h.length) {
    if (h[pos] === '<' && h.substring(pos, pos+4) === '</di') {
      divCount++;
      if (divCount === 2) { // Found the second </div>
        break;
      }
    }
    pos++;
  }
  const insertPos = pos + 5; // include the </div>
  
  const goldBar = '\n              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-gold to-clay opacity-50 scale-100 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />';
  
  h = h.slice(0, insertPos) + goldBar + h.slice(insertPos);
  console.log('Added gold accent bar at position ' + insertPos);
}

// Save
fs.writeFileSync('src/components/Hero.tsx', h);
console.log('Done - enhanced Hero.tsx');