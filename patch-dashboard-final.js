const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

content = content.replace(
  /setBackground\(template\.bgColor\);\s*setFontStyle\(template\.fontStyle\);\s*setTheme\("custom"\);\s*setSuccessMsg/g,
  'setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);\n                              setTheme("custom");\n                              setSuccessMsg'
);

content = content.replace(
  /setBackground\(template\.bgColor\);\s*setFontStyle\(template\.fontStyle\);\s*setTheme\("custom"\);\s*setCustomizingTemplateId/g,
  'setBackground(template.bgColor);\n                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);\n                              setTheme("custom");\n                              setCustomizingTemplateId'
);

// One more place: the reset button "Temizle/Sıfırla"
content = content.replace(
  /setBackground\(template\.bgColor\);\s*setFontStyle\(template\.fontStyle\);\s*setUsernameColor/g,
  'setBackground(template.bgColor);\n                                  setFontStyle(template.fontStyle);\n                                  setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);\n                                  setUsernameColor'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("dashboard-client.tsx patched 3.");
