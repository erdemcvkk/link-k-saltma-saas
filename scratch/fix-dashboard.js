const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// 1. Extract TAB 5 content
const t5StartStr = '          {/* TAB 5: OWNED TEMPLATES (ŞABLONLARIM) */}';
const t5EndStr = '        {/* TAB 2: TRAFFIC ANALYTICS */}';
const t5StartIdx = content.indexOf(t5StartStr);
const t5EndIdx = content.indexOf(t5EndStr);

if (t5StartIdx === -1 || t5EndIdx === -1) {
    console.error("Could not find TAB 5 boundaries.");
    process.exit(1);
}

const t5Raw = content.slice(t5StartIdx, t5EndIdx);
const t5Lines = t5Raw.split('\n');

// We know the structure is:
// 0:           {/* TAB 5...
// 1:         {activeTab === "templates" && (
// 2:           <div className="w-full space-y-8 animate-in...
// ...
// N-2:           </div>
// N-1:         )}
// N: (blank)

// We want lines from 0 to N-2, but we'll remove line 1
const t5InnerLines = t5Lines.slice();
// remove the wrapper:
t5InnerLines.splice(1, 1); // removes {activeTab === "templates" && (
// remove the closing parenthesis
const closeParenIdx = t5InnerLines.findIndex(l => l.trim() === ')}');
if (closeParenIdx !== -1) {
    t5InnerLines.splice(closeParenIdx, 1);
}
const tab5Content = t5InnerLines.join('\n');

// 2. Remove the old TAB 5 from content
content = content.slice(0, t5StartIdx) + content.slice(t5EndIdx);

// 3. Add imports
content = content.replace(
    '  Mail,\n  Puzzle\n} from "lucide-react";',
    '  Mail,\n  Puzzle,\n  Palette,\n  LayoutTemplate\n} from "lucide-react";'
);

// 4. Add state
content = content.replace(
    '  const [activeSubTab, setActiveSubTab] = useState<"links" | "appearance" | "profile">("links");',
    '  const [activeSubTab, setActiveSubTab] = useState<"links" | "appearance" | "profile">("links");\n  const [appearanceMode, setAppearanceMode] = useState<"custom" | "templates">("custom");'
);

// 5. Inject toggle buttons and wrap appearance content
const appearanceStartStr = '              {activeSubTab === "appearance" && (\n                <div className="w-full space-y-8 animate-in fade-in duration-200">\n                  {/* Yazı Tipi Özelleştirici */}';

const appearanceToggleInjection = `              {activeSubTab === "appearance" && (
                <div className="w-full space-y-8 animate-in fade-in duration-200">
                  <div className="flex bg-zinc-100 p-1.5 rounded-2xl w-full max-w-sm mx-auto shadow-inner">
                    <button
                      type="button"
                      onClick={() => setAppearanceMode("custom")}
                      className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                        appearanceMode === "custom"
                          ? "bg-white text-teal-600 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                      }\`}
                    >
                      <Palette className="h-4 w-4" />
                      {lang === "tr" ? "Kendi Tasarımım" : "Start from Scratch"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceMode("templates")}
                      className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                        appearanceMode === "templates"
                          ? "bg-white text-teal-600 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                      }\`}
                    >
                      <LayoutTemplate className="h-4 w-4" />
                      {lang === "tr" ? "Şablonlarım" : "My Templates"}
                    </button>
                  </div>

                  {appearanceMode === "custom" && (
                    <>
                  {/* Yazı Tipi Özelleştirici */}`;

content = content.replace(appearanceStartStr, appearanceToggleInjection);

// Close custom mode and insert templates mode
const appearanceEndStr = '                    <p className="text-[9px] text-teal-500 font-extrabold italic text-right mt-4">\n                      {lang === "tr" ? "+ Dahası Çok Yakında! (Creator Hub Plus)" : "+ More Premium Layouts Coming Soon!"}\n                    </p>\n                  </div>\n                )}\n              </div>\n            </div>\n          )}';

const appearanceEndInjection = `                    <p className="text-[9px] text-teal-500 font-extrabold italic text-right mt-4">
                      {lang === "tr" ? "+ Dahası Çok Yakında! (Creator Hub Plus)" : "+ More Premium Layouts Coming Soon!"}
                    </p>
                  </div>
                )}
              </div>
                  </>
                  )}
                  {appearanceMode === "templates" && (
${tab5Content}
                  )}
            </div>
          )}`;

content = content.replace(appearanceEndStr, appearanceEndInjection);

// 6. Remove 1-Click Preset Themes
// It starts at: {/* 1-Click Preset Themes */}
// Ends before: {/* Hazır Renk Paleti Kombinasyonları */}
const oneClickStart = content.indexOf('                          {/* 1-Click Preset Themes */}');
const oneClickEnd = content.indexOf('                          {/* Hazır Renk Paleti Kombinasyonları */}');
if (oneClickStart !== -1 && oneClickEnd !== -1) {
    content = content.slice(0, oneClickStart) + content.slice(oneClickEnd);
}

// 7. Remove sidebar templates button
const sidebarBtnStr = `        <button
          onClick={() => setActiveTab("templates")}
          className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer \${
            activeTab === "templates"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900"
          }\`}
        >
          <Palette className="h-3.5 w-3.5" />
          {lang === "tr" ? "Şablonlarım" : "My Templates"}
        </button>
`;
content = content.replace(sidebarBtnStr, '');

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Script completed fully');
