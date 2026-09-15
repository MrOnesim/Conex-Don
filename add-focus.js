const fs = require('fs');
let g = fs.readFileSync('src/app/globals.css', 'utf8');

// Add focus-visible utility and enhanced focus states at the end, before the reduced motion media query
// Find the location after .link-underline and before .no-scrollbar

// Add focus-visible styles
const focusStyles = \`
/* Focus visible states for keyboard navigation */
.focus-visible {
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.focus-visible-ring {
  outline: none;
}

.focus-visible-ring:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
}

/* Enhanced link focus states */
.link-enhanced {
  position: relative;
  transition: color 0.2s ease;
}

.link-enhanced:focus-visible {
  color: var(--color-gold);
}

.link-enhanced:focus-visible::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-gold);
  transform: scaleX(1);
  transition: transform 0.2s ease;
}

.link-enhanced:not(:focus-visible):hover {
  color: var(--color-clay);
}

/* Button focus states */
.btn-enhanced {
  position: relative;
  overflow: hidden;
}

.btn-enhanced:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

/* Reduced motion adjustments for focus */
@media (prefers-reduced-motion: reduce) {
  .focus-visible-ring:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: 2px;
  }
}
\`;

// Insert focus styles before the .no-scrollbar section (after .link-underline)
const linkUnderlineIndex = g.indexOf('.link-underline {');
if (linkUnderlineIndex > 0) {
  // Find the closing brace of .link-underline
  let braceCount = 0;
  let pos = linkUnderlineIndex;
  while (pos < g.length) {
    if (g[pos] === '{') braceCount++;
    if (g[pos] === '}') {
      braceCount--;
      if (braceCount === 0) {
        break;
      }
    }
    pos++;
  }
  const insertPos = pos + 1;
  
  g = g.slice(0, insertPos) + focusStyles + g.slice(insertPos);
  console.log('Added focus-visible styles at position ' + insertPos);
}

// Save
fs.writeFileSync('src/app/globals.css', g);
console.log('Done - added focus-visible styles');