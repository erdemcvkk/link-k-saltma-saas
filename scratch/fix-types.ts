import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /initialFeatures\?:\s*any\[\];\r?\n/g;
if (regex.test(content)) {
  content = content.replace(regex, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed duplicate initialFeatures");
} else {
  console.log("Could not find duplicate initialFeatures");
}
