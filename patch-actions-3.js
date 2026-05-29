const fs = require('fs');

let content = fs.readFileSync('src/app/actions.ts', 'utf-8');

// Fix Luxury Emerald
content = content.replace(
  'buttonStyle: "bg-emerald-500 hover:bg-emerald-450 text-white rounded-xl border border-emerald-400/50 shadow-[0_4px_20px_rgba(16,185,129,0.2)]",',
  'buttonStyle: "bg-green-500 hover:bg-green-600 text-white rounded-xl border border-green-400/50 shadow-[0_4px_20px_rgba(22,163,74,0.2)]",'
);

// Fix Forest Whisper
content = content.replace(
  'buttonStyle: "bg-emerald-950 text-emerald-250 border border-emerald-800 rounded-lg",',
  'buttonStyle: "bg-green-950/80 hover:bg-green-900 text-green-100 border border-green-800/40 rounded-xl",'
);

// Fix Bright Gold
content = content.replace(
  'buttonStyle: "bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-full font-bold",',
  'buttonStyle: "bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full font-bold shadow-md shadow-amber-500/10",'
);

// Fix Royal Velvet
content = content.replace(
  'buttonStyle: "bg-amber-500 hover:bg-amber-450 text-white rounded-lg shadow-lg border border-amber-400/40",',
  'buttonStyle: "bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-lg border border-amber-400/40",'
);

fs.writeFileSync('src/app/actions.ts', content);
console.log("actions.ts patched successfully.");
