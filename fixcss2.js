const fs = require('fs');
let g = fs.readFileSync('src/app/globals.css', 'utf8');

// Remove the invalid .link-underline:hover::after line and the focus rules that follow
// The ::after transition is already defined in the ::after rule above

// Find and replace the problematic section
const oldSection = `.link-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 1px;
  width: 100%;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease-out-expo);
}
.link-underline:hover::after 
/* Focus visible states */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 4px;
}`;

const newSection = `.link-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 1px;
  width: 100%;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease-out-expo);
}`;

g = g.replace(oldSection, newSection);
fs.writeFileSync('src/app/globals.css', g);
console.log('Fixed - removed invalid ::after hover selector');