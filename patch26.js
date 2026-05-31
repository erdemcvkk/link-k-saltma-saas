const fs = require('fs');

const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Map/Grid Container
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/g,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">'
);

// 2. Child Map item
content = content.replace(
  /className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 \${/g,
  'className={`w-full max-w-full overflow-hidden p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 ${'
);

// 3. Main wrapper
content = content.replace(
  /className={`min-h-screen transition-colors duration-500 p-6 max-w-7xl mx-auto flex flex-col gap-6 font-corporate overflow-x-hidden \${/g,
  'className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500 p-3 md:p-6 max-w-7xl mx-auto flex flex-col gap-6 font-corporate ${'
);

// 4. Large paddings 
// In the left column: flex-1 w-full flex flex-col gap-8 min-w-0 pb-20
// Wait, replace any straggling p-8
content = content.replace(/(?<![:\w])p-8\b/g, 'p-3 md:p-8');
content = content.replace(/(?<![:\w])p-10\b/g, 'p-3 md:p-10');

// Fix duplicates
content = content.replace(/p-3\s+md:p-3\s+md:p-8/g, 'p-3 md:p-8');
content = content.replace(/p-3\s+md:p-3\s+md:p-10/g, 'p-3 md:p-10');

fs.writeFileSync(path, content);
console.log('Fixed dashboard map layout and outer constraints');
