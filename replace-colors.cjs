const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace remaining hardcoded dark colors to match a light theme
content = content.replace(/bg-zinc-[89]00(\/\d+)?/g, 'bg-gray-50');
content = content.replace(/bg-zinc-950(\/\d+)?/g, 'bg-white');
content = content.replace(/border-zinc-[89]00(\/\d+)?/g, 'border-gray-100');
content = content.replace(/text-zinc-500/g, 'text-slate-500'); // make zinc-500 slate-500
content = content.replace(/text-zinc-400/g, 'text-slate-500'); // same for 400
content = content.replace(/text-white/g, 'text-slate-900'); // Change hardcoded white text to dark slate
content = content.replace(/bg-purple-600/g, 'bg-teal-500'); // Change brand color to teal (hoo.be style)
content = content.replace(/bg-purple-500/g, 'bg-teal-400');
content = content.replace(/text-purple-[456]00/g, 'text-teal-500');
content = content.replace(/focus:ring-purple-500/g, 'focus:ring-teal-500');
content = content.replace(/border-purple-500/g, 'border-teal-500');
content = content.replace(/shadow-\[0_0_15px_rgba\(168,85,247,0\.25\)\]/g, 'shadow-[0_0_15px_rgba(45,212,191,0.25)]');

fs.writeFileSync(file, content);
console.log('Colors updated');
