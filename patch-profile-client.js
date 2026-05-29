const fs = require('fs');

let file = fs.readFileSync('src/app/[username]/profile-client.tsx', 'utf-8');

// Use #profile-wrapper instead of #mobile-container to make the customCss span the whole window if needed
file = file.replace(
  '<div \n      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}',
  '<div \n      id="profile-wrapper"\n      className={`min-h-screen relative overflow-hidden flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}'
);

// Update replacing
file = file.replace(
  '.replace(/body/g, `#mobile-container`)',
  '.replace(/body/g, `#profile-wrapper`)'
);

fs.writeFileSync('src/app/[username]/profile-client.tsx', file);
console.log('Patched profile-client.tsx!');
