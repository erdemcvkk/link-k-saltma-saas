import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix templateButtonOverrides type
content = content.replace(
  `parseButtonStyle((previewTemplate as any).buttonStyle) \n              : {};`,
  `parseButtonStyle((previewTemplate as any).buttonStyle) \n              : {} as any;`
);

// Fallback in case spacing is different
content = content.replace(
  `? parseButtonStyle((previewTemplate as any).buttonStyle) \r\n              : {};`,
  `? parseButtonStyle((previewTemplate as any).buttonStyle) \r\n              : {} as any;`
);

content = content.replace(
  `: {};\n\n            const isLight`,
  `: {} as any;\n\n            const isLight`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed sandbox TS errors');
