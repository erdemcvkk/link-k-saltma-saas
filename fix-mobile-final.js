const fs = require('fs');

const filePath = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// ===================================================================
// ROOT CAUSE: The outer container uses `px-4` padding BUT the inner
// flex/grid children (especially the right-column simulator placeholder
// with `lg:w-[360px]`) force the container wider than 100vw.
// The `overflow-x-hidden` on the parent CLIPS but does NOT prevent
// layout from calculating wider than viewport, causing the scroll.
//
// ALSO: The `max-w-7xl` (1280px) is irrelevant on mobile (375px)
// but the flex children don't have proper width constraints.
//
// FIX: Force `max-w-full` and `w-full` on ALL major containers,
// and add `box-border` to ensure padding is included in width calc.
// ===================================================================

// 1. OUTER WRAPPER - add w-full max-w-full box-border
c = c.replace(
  'min-h-screen transition-colors duration-500 px-4 py-4 sm:p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 font-corporate overflow-x-hidden',
  'min-h-screen w-full max-w-full md:max-w-7xl transition-colors duration-500 px-3 py-3 sm:p-4 md:p-6 mx-auto flex flex-col gap-3 sm:gap-4 md:gap-6 font-corporate overflow-x-hidden box-border'
);

// 2. CORE TABS WORKSPACES container - add max-w-full overflow-hidden
c = c.replace(
  'className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full items-start justify-start"',
  'className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden"'
);

// 3. LEFT COLUMN - already has min-w-0, add max-w-full
c = c.replace(
  'className="flex-1 space-y-6 md:space-y-8 max-w-3xl w-full min-w-0 overflow-hidden"',
  'className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden"'
);

// 4. TAB CONTENT WRAPPERS - space-y-6 animate-in containers: ensure w-full max-w-full
c = c.replace(
  /className="w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden"/g,
  'className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden"'
);

c = c.replace(
  /className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-200 overflow-hidden"/g,
  'className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in duration-200 overflow-hidden"'
);

// 5. PANEL CARDS - ensure they don't exceed parent width
// The cards with p-3 md:p-6 or p-4 md:p-8 need max-w-full
c = c.replace(
  /className={`p-3 md:p-6 rounded-2xl border space-y-6/g,
  'className={`p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden'
);

c = c.replace(
  /className={`p-4 md:p-8 rounded-2xl border space-y-6/g,
  'className={`p-3 sm:p-4 md:p-8 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden'
);

// 6. LINK TEMPLATE GRID - cards inside "Yeni Link Ekle" 
// The link template buttons have long text descriptions that overflow
// On mobile, make them grid-cols-2 so they fit nicely
c = c.replace(
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"',
  'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full"'
);

// 7. Each link template button card - add overflow-hidden and text truncation
c = c.replace(
  /className={`p-4 md:p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all relative group cursor-pointer/g,
  'className={`p-3 sm:p-4 md:p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all relative group cursor-pointer overflow-hidden'
);

// 8. HEADER - make description text wrap properly
c = c.replace(
  'className={"text-slate-500 text-sm"}',
  'className={"text-slate-500 text-xs sm:text-sm break-words"}'
);

// 9. HEADER TITLE - slightly smaller on mobile
c = c.replace(
  'className="text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 break-words"',
  'className="text-lg sm:text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 break-words"'
);

// 10. RIGHT COLUMN SIMULATOR - already hidden on mobile, but the SPACER div
// at the bottom still takes up layout space. Make it truly hidden on mobile
c = c.replace(
  'className="hidden lg:block w-full max-w-sm lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0"',
  'className="hidden lg:block lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0"'
);

// 11. SUB-TABS (Linkler | Görünüm | Profil) - they're using flex gap-2
// but on small screens the flex items can push out. Add overflow-hidden
c = c.replace(
  'className="flex gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200"',
  'className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200 w-full max-w-full overflow-hidden"'
);

// Sub-tab button text size - make slightly smaller on mobile
c = c.replace(
  /flex-1 flex items-center justify-center gap-2 py-3\.5 rounded-xl text-xs font-black transition-all cursor-pointer/g,
  'flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer'
);

// 12. TEMPLATE CARDS in "Şablonlarım" tab - ensure overflow hidden
c = c.replace(
  /className="w-full max-w-full overflow-hidden p-4 md:p-5 rounded-2xl/g,
  'className="w-full max-w-full overflow-hidden p-3 sm:p-4 md:p-5 rounded-2xl'
);

// 13. Header buttons row - ensure flex-wrap works properly on smallest screens
c = c.replace(
  'className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0"',
  'className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto"'
);

// 14. Global overlay and modals - make them fit mobile
c = c.replace(
  'className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"',
  'className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"'
);

// 15. Appearance tab panels - color picker grids
// Already grid-cols-3, that's good

// 16. Fix any remaining p-4 md:p-5 patterns on cards to be mobile-smaller
// (but don't touch the ones we already fixed above)

// 17. Double space cleanup
c = c.replace(/  +/g, ' ');

fs.writeFileSync(filePath, c);
console.log('Applied definitive mobile overflow fixes');
