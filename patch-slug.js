const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[addonSlug]/page.tsx', 'utf-8');

code = code.replace(
  `return parsed.customSlug && parsed.customSlug.toLowerCase() === addonSlug.toLowerCase();`,
  `return (parsed.customSlug && parsed.customSlug.toLowerCase() === addonSlug.toLowerCase()) || (addonSlug.toLowerCase() === 'store');`
);

fs.writeFileSync('src/app/[username]/[addonSlug]/page.tsx', code, 'utf-8');
console.log('Patched addonSlug routing');
