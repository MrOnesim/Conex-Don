const fs = require('fs');
let s = fs.readFileSync('src/components/sections.tsx', 'utf8');

// Replace image hover patterns
s = s.replace(
  'className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"',
  'className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 img-zoom"'
);
s = s.replace(
  'className="object-cover duotone transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"',
  'className="object-cover duotone transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 img-zoom"'
);
s = s.replace(
  'className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"',
  'className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 img-zoom"'
);

fs.writeFileSync('src/components/sections.tsx', s);
console.log('Done - added img-zoom to sections.tsx');