const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx')) results.push(file);
  });
  return results;
}
const files = walk('src');
let output = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/className=[\"\'\`][^\"\'\`]*flex-row/g);
  if (matches) {
    matches.forEach(m => {
       if (!m.includes('md:flex-row') && !m.includes('sm:flex-row') && !m.includes('lg:flex-row') && !m.includes('flex-col')) {
           output.push(f.replace(process.cwd()+'\\', '') + ': ' + m);
       }
    });
  }
});
console.log(output);
