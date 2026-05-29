const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// Update İncele button
content = content.replace(
  '                              setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setTheme("custom");\n                              setSuccessMsg',
  '                              setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);\n                              setTheme("custom");\n                              setSuccessMsg'
);

// Update Düzenle button
content = content.replace(
  '                              setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setTheme("custom");\n                              setCustomizingTemplateId',
  '                              setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);\n                              setTheme("custom");\n                              setCustomizingTemplateId'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("dashboard-client.tsx patched 2.");
