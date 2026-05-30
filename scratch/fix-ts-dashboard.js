const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// 1. Fix ProductItem type
content = content.replace(
    '  description: string | null;\n  fileUrl: string;\n  isActive: boolean;',
    '  description: string | null;\n  fileUrl: string | null;\n  isActive: boolean;'
);

// 2. Remove duplicate initialFeatures
content = content.replace(
    '  initialFeatures?: any[];\n  initialOwnedTemplates?: {\n    userTemplateId: string;',
    '  initialOwnedTemplates?: {\n    userTemplateId: string;'
);

// 3. Fix initialUser.links -> initialLinks
content = content.replace(
    '  const firstLink = initialUser.links?.[0];',
    '  const firstLink = initialLinks?.[0];'
);

// 4. Fix templateButtonOverrides type
content = content.replace(
    'const templateButtonOverrides = (previewTemplate && (previewTemplate as any).buttonStyle) ? JSON.parse((previewTemplate as any).buttonStyle) : {};',
    'const templateButtonOverrides: any = (previewTemplate && (previewTemplate as any).buttonStyle) ? JSON.parse((previewTemplate as any).buttonStyle) : {};'
);

// 5. Fix AddonConfigModal username prop
content = content.replace(
    '          lang={lang}\n          username={initialUser.username}\n        />',
    '          lang={lang}\n          username={initialUser.username || ""}\n        />'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Fixed TS in dashboard-client.tsx');
