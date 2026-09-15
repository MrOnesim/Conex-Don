const fs = require('fs');
let g = fs.readFileSync('src/app/globals.css', 'utf8');

// Add focus-visible styles before .no-scrollbar section
const focusStyles = `
/* Focus visible states */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Enhanced button hover */
.button-hover {
  transition: transform 0.2s var(--ease-out-expo), box-shadow 0.2s var(--ease-out-expo);
}

.button-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

/* Link hover enhancement */
.link-enhance {
  position: relative;
  transition: color 0.2s ease;
}

.link-enhance:hover {
  color: var(--color-clay);
}

.link-enhance:focus-visible {
  color: var(--color-gold);
}

.link-enhance:focus-visible::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-gold);
  transform: scaleX(1);
  transition: transform 0.2s ease;
}

/* Reduced motion adjustments */
@media (prefers-reduced-motion: reduce) {
  .button-hover:hover {
    transform: none;
    box-shadow: none;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: 2px;
  }
}
`;

// Insert before .no-scrollbar::-webkit-scrollbar {
const marker = '.no-scrollbar::-webkit-scrollbar {';
const mi = g.indexOf(marker);
if (mi > 0) {
  // Find the opening brace position
  let pos = mi;
  while (pos > 0 && g[pos] !== '{') pos--;
  const insertPos = pos;
  
  g = g.slice(0, insertPos) + focusStyles + g.slice(insertPos);
  console.log('Inserted focus styles at position ' + insertPos);
  fs.writeFileSync('src/app/globals.css', g);
  console.log('Done');
} else {
  console.log('Could not find insertion point');
}