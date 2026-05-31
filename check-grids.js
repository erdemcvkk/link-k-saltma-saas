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
  const matches = content.match(/className=[\"\'\`][^\"\'\`]*grid-cols-[23456]/g);
  if (matches) {
    matches.forEach(m => {
       if (!m.includes('md:grid-cols') && !m.includes('sm:grid-cols') && !m.includes('lg:grid-cols')) {
           output.push(f.replace(process.cwd()+'\\', '') + ': ' + m);
       }
    });
  }
});
console.log(output);
