const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// The top buttons
content = content.replace(
  '<div className="flex items-center gap-2">\n            {initialUser.role === "ADMIN" && (',
  '<div className="flex flex-wrap items-center gap-2">\n            {initialUser.role === "ADMIN" && ('
);

// We also have tabs. The tabs use:
// <div className={`flex gap-2 border-b pb-3 overflow-x-auto scrollbar-none ${ ...
// which is already overflow-x-auto, so that's fine.

// What about other `flex items-center gap-X` that might cause overflow?
content = content.replace(/className="flex items-center gap-2"/g, 'className="flex flex-wrap items-center gap-2"');
content = content.replace(/className="flex items-center gap-3"/g, 'className="flex flex-wrap items-center gap-3"');
content = content.replace(/className="flex items-center gap-4"/g, 'className="flex flex-wrap items-center gap-4"');

// Wait, doing this globally might break some intended single-line horizontal flex boxes (like icon + text).
// I will just apply `flex-wrap` globally to the gap-2 and gap-3? No, that's dangerous.
// Let me revert the global replace and do it specifically for the containers that need it.

