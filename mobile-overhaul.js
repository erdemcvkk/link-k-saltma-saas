const fs = require('fs');

const filePath = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// ============================================================
// STEP 1: REVERT BAD PREVIOUS PATCHES - Clean slate on key areas
// ============================================================

// Revert the bad edge-to-edge p-0 on outer wrapper — keep clean minimal mobile padding
c = c.replace(
  'p-0 sm:p-3 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 font-corporate overflow-x-hidden',
  'px-4 py-4 sm:p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 font-corporate overflow-x-hidden'
);

// Remove the bad px-4 pt-6 pb-4 md:p-0 on header — just use simple responsive padding
c = c.replace(
  'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b px-4 pt-6 pb-4 md:p-0 md:pb-6',
  'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 md:pb-6'
);

// Remove extra px-4 md:px-0 from tab bar since parent now has padding
c = c.replace(
  'flex gap-2 border-b pb-3 px-4 md:px-0 overflow-x-auto scrollbar-none',
  'flex gap-2 border-b pb-3 overflow-x-auto scrollbar-none'
);

// Remove extra px-4 md:px-0 from workspace content divs
c = c.replace(
  /className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 px-4 md:px-0"/g,
  'className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350"'
);

// ============================================================
// STEP 2: FIX TAB BAR - Make it scroll horizontally on mobile (pill-style, no wrapping)
// ============================================================
// Tab buttons should have whitespace-nowrap so text doesn't break
c = c.replace(
  /className={`flex items-center gap-2 px-4 py-3 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer/g,
  'className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer whitespace-nowrap'
);

// The "Share" button in tab bar
c = c.replace(
  'className="flex items-center gap-2 px-4 py-3 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer bg-slate-900',
  'className="flex items-center gap-2 px-3 sm:px-4 py-2.5 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer whitespace-nowrap bg-slate-900'
);

// ============================================================
// STEP 3: FIX INNER PANEL CARDS - consistent mobile padding
// ============================================================

// Panel cards: p-4 md:p-8 → p-4 md:p-6 (slightly less extreme)
// Actually the profile card has p-4 md:p-8 which is fine, but some have p-3 md:p-6
// Let's keep them consistent

// Fix input containers - username field with link-saas.vercel.app/
// The URL prefix can overflow on mobile, let it wrap
c = c.replace(
  '<span className="text-slate-500 text-sm">link-saas.vercel.app/</span>',
  '<span className="text-slate-500 text-[11px] sm:text-sm shrink-0">link-saas.vercel.app/</span>'
);

// ============================================================
// STEP 4: FIX COLOR SWATCH GRIDS - They should be usable on mobile
// ============================================================
// Color swatch grids currently use grid-cols-3 sm:grid-cols-4 md:grid-cols-5
// This is actually fine, but let's ensure they have overflow-hidden
c = c.replace(
  /grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3/g,
  'grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3'
);

// ============================================================
// STEP 5: FIX ALL REMAINING OVERFLOW ISSUES
// ============================================================

// Fix links list - each link card should have overflow-hidden
c = c.replace(
  /className="w-full max-w-full overflow-hidden p-5 rounded-2xl/g,
  'className="w-full max-w-full overflow-hidden p-4 md:p-5 rounded-2xl'
);

// Fix the "Satın Alınan Şablonlarım" header row
c = c.replace(
  'className="flex flex-wrap items-center justify-between border-b border-zinc-150 pb-5"',
  'className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-150 pb-4 md:pb-5"'
);

// Fix the Şablon Önizleme Bağlantısı link display  
c = c.replace(
  'className="text-sm font-bold text-zinc-800 flex items-start sm:items-center gap-1.5 break-all"',
  'className="text-xs sm:text-sm font-bold text-zinc-800 flex items-start sm:items-center gap-1.5 break-all min-w-0"'
);

// Fix the "Kopyala" button area in templates
c = c.replace(
  'className="flex items-center gap-2 w-full sm:w-auto">',
  'className="flex flex-wrap items-center gap-2 w-full sm:w-auto">'
);

// ============================================================
// STEP 6: FIX HEADER BUTTONS - they should wrap properly
// ============================================================
// The top header buttons group already has flex-wrap, that's fine.
// But buttons themselves could be smaller on mobile
c = c.replace(
  /className="flex items-center gap-1\.5 px-4 py-3 md:py-2 rounded-full bg-red-950\/20 border border-red-500\/20 hover:border-red-400 text-red-400 text-xs font-bold transition-all"/g,
  'className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-red-950/20 border border-red-500/20 hover:border-red-400 text-red-400 text-xs font-bold transition-all"'
);

// Fix billing/live site/logout buttons - too tall on mobile with py-3
c = c.replace(
  /className={`flex items-center gap-1\.5 px-4 py-3 md:py-2 rounded-full border text-xs font-semibold transition-all \$\{/g,
  'className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs font-semibold transition-all ${'
);

// ============================================================  
// STEP 7: FIX ANALYTICS TAB - Charts need max-w-full
// ============================================================
// Make sure Recharts containers don't overflow
c = c.replace(
  /className={`p-3 md:p-6 rounded-2xl border space-y-4 md:space-y-6 \$\{/g,
  'className={`p-3 md:p-6 rounded-2xl border space-y-4 md:space-y-6 overflow-hidden ${'
);

// ============================================================
// STEP 8: FIX ALL PANEL WRAPPERS WITH SPACE-Y OVERFLOW  
// ============================================================
// All workspace content divs should prevent overflow
c = c.replace(
  /className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350"/g,
  'className="w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden"'
);

c = c.replace(
  /className="w-full space-y-8 animate-in fade-in duration-200"/g,
  'className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-200 overflow-hidden"'
);

// ============================================================
// STEP 9: FIX THE MAIN LEFT COLUMN - ensure it stays bounded
// ============================================================
c = c.replace(
  'className="flex-1 space-y-8 max-w-3xl w-full"',
  'className="flex-1 space-y-6 md:space-y-8 max-w-3xl w-full min-w-0 overflow-hidden"'
);

// ============================================================
// STEP 10: CLEAN UP DUPLICATE/NESTED RESPONSIVE CLASSES
// ============================================================
// py-3 md:py-2.5 md:py-1.5 → just py-2 md:py-1.5
c = c.replace(/py-3 md:py-2\.5 md:py-1\.5/g, 'py-2.5 md:py-1.5');

// py-3 md:py-2.5 → py-2.5 md:py-2 (simpler)
c = c.replace(/py-3 md:py-2\.5/g, 'py-2.5');

// py-3 md:py-2 → py-2.5 (mobile friendly but not too big)
// Actually let's keep a mild mobile boost
c = c.replace(/py-3 md:py-2/g, 'py-2.5 md:py-2');

// px-4.5 → px-4 (4.5 is not a standard Tailwind value)
c = c.replace(/px-4\.5/g, 'px-4');

// gap-4 md:gap-4 md:gap-6 → gap-4 md:gap-6  
c = c.replace(/gap-4 md:gap-4 md:gap-6/g, 'gap-4 md:gap-6');
c = c.replace(/gap-4 md:gap-4 md:gap-8/g, 'gap-4 md:gap-8');

// p-4 md:p-4 md:p-5 → p-4 md:p-5
c = c.replace(/p-4 md:p-4 md:p-5/g, 'p-4 md:p-5');

// min-h-\[48px\] md:min-h-0 — Remove these globally, they were making buttons too tall
c = c.replace(/ min-h-\[48px\] md:min-h-0/g, '');

// py-2.5 md:py-1 — revert to just py-2
c = c.replace(/py-2\.5 md:py-1/g, 'py-2');

// Double space cleanup
c = c.replace(/  +/g, ' ');

fs.writeFileSync(filePath, c);
console.log('Done: Full mobile responsive cleanup applied to dashboard-client.tsx');
