const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

content = content.replace(
  /className="flex items-center gap-2">\s*\{initialUser\.role === "ADMIN"/,
  'className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">\n          {initialUser.role === "ADMIN"'
);

// Just in case, let's also ensure the title text wraps if it's too long
content = content.replace(
  'className="text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500"',
  'className="text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 break-words"'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Fixed top header wrap');
