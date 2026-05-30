import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: activeTemplateCss initialization
const oldInit = `const [activeTemplateCss, setActiveTemplateCss] = useState<string | null>(initialUser.profile?.theme ? initialOwnedTemplates.find(t => t.name === initialUser.profile?.theme)?.customCss || null : null);`;
const newInit = `const [activeTemplateCss, setActiveTemplateCss] = useState<string | null>(initialUser.profile?.customCss ?? null);`;

if (content.includes(oldInit)) {
  content = content.replace(oldInit, newInit);
  console.log("Fixed activeTemplateCss initialization");
} else {
  console.log("Could not find activeTemplateCss initialization");
}

// Fix 2: Add setActiveTemplateCss inside customizingTemplateId effect
const oldEffect = `setBackground(template.bgColor);
        setFontStyle(template.fontStyle);
        
        // Parse button style from template definition as the source of truth`;

const newEffect = `setBackground(template.bgColor);
        setFontStyle(template.fontStyle);
        setTheme(template.name);
        setActiveTemplateCss(template.customCss || null);
        
        // Parse button style from template definition as the source of truth`;

if (content.includes(oldEffect)) {
  content = content.replace(oldEffect, newEffect);
  console.log("Fixed customizingTemplateId effect");
} else {
  console.log("Could not find customizingTemplateId effect");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Done");
