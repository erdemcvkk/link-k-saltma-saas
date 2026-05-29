const fs = require('fs');
let file = fs.readFileSync('src/app/[username]/profile-client.tsx', 'utf-8');
file = file.replace(
  '    <div \n      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}',
  '    <div \n      id="profile-wrapper"\n      className={`min-h-screen relative overflow-hidden flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}'
);
file = file.replace(
  '    <div \r\n      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}',
  '    <div \n      id="profile-wrapper"\n      className={`min-h-screen relative overflow-hidden flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}'
);
fs.writeFileSync('src/app/[username]/profile-client.tsx', file);
