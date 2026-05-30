import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add UniversalProfile import if missing
if (!content.includes('import UniversalProfile')) {
  const importStatement = `import UniversalProfile from "@/components/universal-profile";\n`;
  content = content.replace('import { parseButtonStyle } from "@/lib/parse-button-style";', importStatement + 'import { parseButtonStyle } from "@/lib/parse-button-style";');
}

// Normalize newlines to \n for easier manipulation
content = content.replace(/\r\n/g, '\n');

// 2. Replace the sandbox preview
const startPattern = '{(() => {\n            const isCustomImg = background';
const endPattern = '          })()}\n        </div>\n      </div>\n    );\n  };';

const indexOfStartPattern = content.indexOf(startPattern);
const indexOfEndPattern = content.indexOf(endPattern, indexOfStartPattern);

if (indexOfStartPattern !== -1 && indexOfEndPattern !== -1) {
  const before = content.substring(0, indexOfStartPattern);
  const after = content.substring(indexOfEndPattern + endPattern.length);

  const replacement = `{(() => {
            const previewTemplateId = customizingTemplateId;
            const previewTemplate = previewTemplateId ? ownedTemplates.find((t: any) => t.id === previewTemplateId) : null;
            const templateButtonOverrides = (previewTemplate && (previewTemplate as any).buttonStyle) 
              ? parseButtonStyle((previewTemplate as any).buttonStyle) 
              : {};

            const isLight = [
              "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
              "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
            ].includes(theme);

            const mappedLinks = links.map(link => {
              let blockMeta: any = {};
              if (link.metadata) {
                try { blockMeta = JSON.parse(link.metadata); } catch (e) {}
              }
              return {
                ...link,
                bgColor: templateButtonOverrides.bgColor ?? link.bgColor ?? null,
                textColor: templateButtonOverrides.textColor ?? link.textColor ?? null,
                borderColor: templateButtonOverrides.borderColor ?? link.borderColor ?? null,
                borderStyle: templateButtonOverrides.borderStyle ?? link.borderStyle ?? null,
                borderWidth: templateButtonOverrides.borderWidth ?? link.borderWidth ?? null,
                borderRadius: templateButtonOverrides.borderRadius ?? link.borderRadius ?? null,
                shadow: templateButtonOverrides.shadow ?? link.shadow ?? null,
                fontWeight: templateButtonOverrides.fontWeight ?? link.fontWeight ?? null,
                metadata: blockMeta
              };
            });

            return (
              <div id="sandbox-preview" className="relative rounded-[2.5rem] aspect-[9/18] overflow-hidden bg-zinc-950 flex flex-col justify-between transition-all duration-300 w-full h-full pointer-events-none p-0 border-0">
                <UniversalProfile 
                  data={{
                    username: username || "username",
                    bio: bio || "Enter profile bio details...",
                    avatarUrl: avatarUrl,
                    theme: theme,
                    customCss: activeTemplateCss,
                    background: background,
                    fontStyle: fontStyle,
                    usernameColor: usernameColor || (isLight ? "#0f172a" : "#ffffff"),
                    bioColor: bioColor || (isLight ? "#475569" : "rgba(255,255,255,0.7)"),
                    links: mappedLinks,
                  }} 
                  isCompactMode={true} 
                  isDarkContext={!isLight}
                />
              </div>
            );
          })()}
        </div>
      </div>
    );
  };`;

  content = before + replacement + after;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced sandbox preview!');
} else {
  console.log('Could not find sandbox preview indices.');
  console.log('indexOfStartPattern:', indexOfStartPattern);
  console.log('indexOfEndPattern:', indexOfEndPattern);
}
