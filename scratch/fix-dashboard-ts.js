const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// 1. fileUrl
content = content.replace(/fileUrl:\s*string;/g, 'fileUrl: string | null;');

// 2. initialFeatures
content = content.replace(/initialFeatures\?:\s*any\[\];/g, '');

// 3. links
content = content.replace(/initialUser\.links\?\.\[0\]/g, 'initialLinks?.[0]');

// 4. templateButtonOverrides
content = content.replace(/const templateButtonOverrides =/g, 'const templateButtonOverrides: any =');

// 5. username prop
content = content.replace(/username=\{initialUser\.username\}/g, 'username={initialUser.username || ""}');

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Fixed dashboard TS with regex');
