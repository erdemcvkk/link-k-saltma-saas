const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// 1. Fix the "Template Preview Link" container so the long URL wraps
content = content.replace(
  '<div className="text-sm font-bold text-zinc-800 flex items-center gap-1.5">',
  '<div className="text-sm font-bold text-zinc-800 flex items-start sm:items-center gap-1.5 break-all">'
);

// 2. Fix the "Custom Template Link" input and its container
content = content.replace(
  '<span className="text-xs font-bold text-zinc-400">link-saas.vercel.app/</span>',
  '<span className="text-xs font-bold text-zinc-400 whitespace-nowrap">link-saas.vercel.app/</span>'
);

content = content.replace(
  '<div className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-50/50 border border-zinc-100">',
  '<div className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-50/50 border border-zinc-100 overflow-hidden w-full">'
);

content = content.replace(
  '<div className="flex items-center gap-2">\n                            <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">link-saas.vercel.app/</span>\n                            <input',
  '<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-hidden w-full">\n                            <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">link-saas.vercel.app/</span>\n                            <input'
);

// We should also make sure inputs have w-full and min-w-0
content = content.replace(
  'type="text"\n                              placeholder={lang === "tr" ? "kampanyam" : "my-campaign"}\n                              defaultValue',
  'type="text"\n                              className="w-full min-w-0 bg-transparent border-b border-zinc-200 outline-none focus:border-teal-500 py-1 text-sm font-semibold"\n                              placeholder={lang === "tr" ? "kampanyam" : "my-campaign"}\n                              defaultValue'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Fixed URL overflows');
