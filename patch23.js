const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// Fix the invalid grid string
content = content.replace(
  'grid-cols-1 md:grid-cols-2 md:grid-cols-4',
  'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
);

// Fix the wrapper for the top buttons
content = content.replace(
  '<div className="flex items-center gap-2">\n            {initialUser.role === "ADMIN" && (',
  '<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">\n            {initialUser.role === "ADMIN" && ('
);

// We need to also check if any other `flex` or `w-full` breaks the layout
// Let's ensure the main dashboard wrapper does not overflow
content = content.replace(
  'max-w-7xl mx-auto flex flex-col gap-6 font-corporate',
  'max-w-7xl mx-auto flex flex-col gap-6 font-corporate overflow-x-hidden'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Fixed overlapping classes and overflow-x');
