const fs = require('fs');
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replacement 1
content = content.replace(
  `        const template = ownedTemplates.find(t => t.id === customizingTemplateId);
        if (template) {
          setBackground(template.bgColor);
          setFontStyle(template.fontStyle);
          
          setTheme(template.name);
          setActiveTemplateCss(template.customCss || null);`,
  `        const template = ownedTemplates.find(t => t.id === customizingTemplateId);
        if (template) {
          setBackground(template.bgColor);
          setFontStyle(template.fontStyle);
          
          setTheme(template.name);
          setButtonClass(template.buttonStyle || null);
          setActiveTemplateCss(template.customCss || null);`
);

// Replacement 2
content = content.replace(
  `                              onClick={() => {
                                setBackground(template.bgColor);
                                setFontStyle(template.fontStyle);
                                setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);
                                setTheme(template.name);
                                setCustomizingTemplateId(customizingTemplateId === template.id ? null : template.id);
                              }}`,
  `                              onClick={() => {
                                setBackground(template.bgColor);
                                setFontStyle(template.fontStyle);
                                setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);
                                setTheme(template.name);
                                setButtonClass(template.buttonStyle || null);
                                setCustomizingTemplateId(customizingTemplateId === template.id ? null : template.id);
                              }}`
);

// Replacement 3
content = content.replace(
  `                                      if (res.isActive) {
                                        setBackground(template.bgColor);
                                        if (template.fontStyle) setFontStyle(template.fontStyle);
                                        setTheme(template.name);
                                        if (template.buttonStyle) {`,
  `                                      if (res.isActive) {
                                        setBackground(template.bgColor);
                                        if (template.fontStyle) setFontStyle(template.fontStyle);
                                        setTheme(template.name);
                                        setButtonClass(template.buttonStyle || null);
                                        if (template.buttonStyle) {`
);

fs.writeFileSync(path, content);
console.log('dashboard-client.tsx patched successfully');
