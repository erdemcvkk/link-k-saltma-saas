const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/dark:[^\s"'\`]+/g, '');
// Also replace dark backgrounds and text colors that aren't prefixed
// Example: bg-zinc-950 or bg-zinc-900 (often used in dashboard)
// Actually let's just remove the explicit dark mode classes first to see how it looks.
fs.writeFileSync(file, content);
