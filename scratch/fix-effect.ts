import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /(setFontStyle\(template\.fontStyle\);[\r\n\s]+)(\/\/ Parse button style from template definition)/g;

if (regex.test(content)) {
  content = content.replace(regex, `$1setTheme(template.name);\r\n        setActiveTemplateCss(template.customCss || null);\r\n        \r\n        $2`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed customizingTemplateId effect successfully");
} else {
  console.log("Could not find regex match");
}
