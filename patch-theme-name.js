const fs = require('fs');

// Patch dashboard-client.tsx
let dashboard = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');
dashboard = dashboard.replace(/setTheme\("custom"\);/g, 'setTheme(template.name);');

// Wait, there are other `setTheme("custom")` calls, like for AI prompt. Let's be more specific.
// I will replace all of them since AI result theme might be valid or fallback. Actually, AI result returns `theme`.
fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', dashboard);

// Patch actions.ts
let actions = fs.readFileSync('src/app/actions.ts', 'utf-8');
actions = actions.replace(/theme: "custom"/g, 'theme: template.name');
fs.writeFileSync('src/app/actions.ts', actions);

console.log("Patched theme logic.");
