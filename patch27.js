const fs = require('fs');

const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// Color Swatches should sit side-by-side on mobile, not stack vertically
content = content.replace(/grid-cols-1 md:grid-cols-5/g, 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5');

// There's a generic "grid grid-cols-1 sm:grid-cols-2" at 2342 which might be text colors. Let's make them side-by-side too.
content = content.replace(/grid-cols-1 sm:grid-cols-2 gap-3/g, 'grid-cols-2 gap-3');

// Remove border, shadow, and rounded-[2.5rem] on the main panel on mobile.
// Wait, the main wrapper:
// className={`p-3 md:p-6 rounded-[2.5rem] border shadow-2xl transition-all duration-500
// It should be:
// className={`p-0 md:p-6 rounded-none md:rounded-[2.5rem] border-0 md:border-x md:border-y shadow-none md:shadow-2xl transition-all duration-500
content = content.replace(
  /className={`p-3 md:p-6 rounded-\[2\.5rem\] border shadow-2xl transition-all duration-500/g,
  'className={`p-0 md:p-6 rounded-none md:rounded-[2.5rem] border-0 md:border shadow-none md:shadow-2xl transition-all duration-500'
);

// We should also remove the main padding p-3 md:p-6 on the outer layout on mobile to give edge-to-edge feel
content = content.replace(
  /p-3 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 font-corporate overflow-x-hidden/g,
  'p-0 sm:p-3 md:p-6 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 font-corporate overflow-x-hidden'
);

// We need to add padding to the top header because it lost its parent padding
content = content.replace(
  /<div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6/g,
  '<div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b px-4 pt-6 pb-4 md:p-0 md:pb-6'
);

// And the Tab Bar needs padding
content = content.replace(
  /<div className={`flex gap-2 border-b pb-3 overflow-x-auto scrollbar-none/g,
  '<div className={`flex gap-2 border-b pb-3 px-4 md:px-0 overflow-x-auto scrollbar-none'
);

// And the Inner Content needs padding because we removed it from the parent
content = content.replace(
  /<div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">/g,
  '<div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 px-4 md:px-0">'
);

fs.writeFileSync(path, content);
console.log('Fixed swatches and panel edge-to-edge on mobile');
