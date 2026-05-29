const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// 1. Add state variable for activeTemplateCss
// We'll add it after setBackground
content = content.replace(
  'const [background, setBackground] = useState<string | null>(initialUser.profile?.background ?? null);',
  'const [background, setBackground] = useState<string | null>(initialUser.profile?.background ?? null);\n  const [activeTemplateCss, setActiveTemplateCss] = useState<string | null>(initialUser.profile?.theme ? initialOwnedTemplates.find(t => t.name === initialUser.profile?.theme)?.customCss || null : null);'
);

// 2. Update 'İncele' button onClick
content = content.replace(
  '                              setFontStyle(template.fontStyle);\n                              setTheme("custom");\n                              setSuccessMsg(lang === "tr" ? "Sablon canli simülatörde önizleniyor!" : "Previewing template in simulator!");',
  '                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? template.customCss : null);\n                              setTheme("custom");\n                              setSuccessMsg(lang === "tr" ? "Sablon canli simülatörde önizleniyor!" : "Previewing template in simulator!");'
);

// 3. Update 'Uygula' button onClick
content = content.replace(
  '                              setFontStyle(template.fontStyle);\n                              setTheme("custom");\n                              setCustomizingTemplateId(customizingTemplateId === template.id ? null : template.id);',
  '                              setFontStyle(template.fontStyle);\n                              setActiveTemplateCss(template.isCoded ? template.customCss : null);\n                              setTheme("custom");\n                              setCustomizingTemplateId(customizingTemplateId === template.id ? null : template.id);'
);

// 4. Update another place where template is set (around line 3662)
content = content.replace(
  '                                  if (template.fontStyle) {\n                                    setFontStyle(template.fontStyle);\n                                  }\n                                  setTheme("custom");',
  '                                  if (template.fontStyle) {\n                                    setFontStyle(template.fontStyle);\n                                  }\n                                  setActiveTemplateCss(template.isCoded ? template.customCss : null);\n                                  setTheme("custom");'
);

// 5. Update Reset Button
content = content.replace(
  '                                  setFontStyle(template.fontStyle);\n                                  setUsernameColor("#ffffff");',
  '                                  setFontStyle(template.fontStyle);\n                                  setActiveTemplateCss(template.isCoded ? template.customCss : null);\n                                  setUsernameColor("#ffffff");'
);

// 6. Inject CSS into sandbox preview
content = content.replace(
  '              <div \n                className={`relative rounded-[2.5rem] aspect-[9/18] overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 ${bgClassName}`}',
  '              <div \n                id="sandbox-preview"\n                className={`relative rounded-[2.5rem] aspect-[9/18] overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 ${bgClassName}`}'
);

content = content.replace(
  '              >\n                {customVideoUrl && (\n                  <video',
  '              >\n                {activeTemplateCss && (\n                  <style dangerouslySetInnerHTML={{ \n                    __html: activeTemplateCss\n                      .replace(/body/g, `#sandbox-preview`)\n                      .replace(/\\.profile-card/g, `#sandbox-preview .profile-card`)\n                      .replace(/\\.btn-link/g, `#sandbox-preview .btn-link`)\n                      .replace(/\\.link-item/g, `#sandbox-preview .link-item`)\n                  }} />\n                )}\n                {customVideoUrl && (\n                  <video'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("dashboard-client.tsx patched.");
