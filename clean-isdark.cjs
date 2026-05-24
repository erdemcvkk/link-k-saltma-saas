const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace `isDark ? "dark-class" : "light-class"` with `"light-class"`
content = content.replace(/isDark\s*\?\s*"[^"]*"\s*:\s*"([^"]*)"/g, '"$1"');
content = content.replace(/isDark\s*\?\s*'[^']*'\s*:\s*'([^']*)'/g, "'$1'");
content = content.replace(/isDark\s*\?\s*`[^`]*`\s*:\s*`([^`]*)`/g, "`$1`");

// Also remove `const isDark = theme === "dark";` if we want, or just leave it.

fs.writeFileSync(file, content);
console.log('Done');
