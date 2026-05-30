import * as fs from 'fs';
import * as path from 'path';

function fixFile(relPath: string) {
  const filePath = path.join(process.cwd(), relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\\`/g, "`");
  content = content.replace(/\\\$/g, "$");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed", relPath);
}

fixFile('src/components/universal-profile.tsx');
fixFile('src/app/sablonlar/sablonlar-client.tsx');
