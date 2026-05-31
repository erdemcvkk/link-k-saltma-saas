const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Phone mockup widths (e.g., w-[360px] -> w-full max-w-sm lg:w-[360px])
  content = content.replace(/(?<![:\w])w-\[3(\d{2})px\]/g, (match) => {
    return `w-full max-w-sm lg:${match}`;
  });

  // 2. Dashboard padding (p-6 -> p-4 md:p-6)
  // I already did some, but let's catch p-6 specifically on large layout wrappers
  // Actually, replace all p-6 with p-3 md:p-6
  content = content.replace(/(?<![:\w])p-6\b/g, 'p-3 md:p-6');
  // Clean up if it was already replaced
  content = content.replace(/p-3\s+md:p-4\s+md:p-6/g, 'p-3 md:p-6');
  content = content.replace(/p-3\s+md:p-3\s+md:p-6/g, 'p-3 md:p-6');

  // 3. Improve tap targets for `<button` and `<Link`
  // We can just add `min-h-[48px] md:min-h-0` to their className.
  // A simple regex to find className="..." on <button or <Link and inject it
  content = content.replace(/(<(?:button|Link) [^>]*className=(["'\{`])(?:(?!\bmin-h-\[48px\]\b).)*?)\2/g, (match, prefix, quote) => {
     if (match.includes('min-h-[48px]')) return match; // already has it
     // If it's an object with string interpolation like className={`...`}
     if (prefix.endsWith('`')) {
       return prefix + ' min-h-[48px] md:min-h-0`';
     } else if (prefix.endsWith('"') || prefix.endsWith("'")) {
       const q = prefix.slice(-1);
       return prefix.slice(0, -1) + ' min-h-[48px] md:min-h-0' + q;
     }
     return match;
  });

  // Also replace tap target paddings in flex/grid children if they are standalone
  content = content.replace(/(?<![:\w])py-1\b/g, 'py-2.5 md:py-1');
  content = content.replace(/(?<![:\w])py-2\b/g, 'py-3 md:py-2');

  // Ensure no duplicate md:
  content = content.replace(/py-2\.5\s+md:py-2\.5\s+md:py-1/g, 'py-2.5 md:py-1');
  content = content.replace(/py-3\s+md:py-3\s+md:py-2/g, 'py-3 md:py-2');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Patched UX in', file.replace(process.cwd() + '\\\\', ''));
  }
});

// Also fix layout.tsx body overflow
const layoutPath = 'src/app/layout.tsx';
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes('overflow-x-hidden')) {
    layoutContent = layoutContent.replace(/<body\s+className=["'`]([^"']+)["'`]/, (m, c) => {
      return `<body className="${c} overflow-x-hidden"`;
    });
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Added overflow-x-hidden to layout.tsx');
  }
}
