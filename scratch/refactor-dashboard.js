const fs = require('fs');

const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the "My Templates" button from the main navigation
const templatesButtonRegex = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\("templates"\)\}[\s\S]*?<\/button>/;
content = content.replace(templatesButtonRegex, '');

// 2. Extract TAB 5 (ownedTemplates) block
const tab5Regex = /\{\/\* TAB 5: OWNED TEMPLATES \(SABLONLARIM\) \*\/\}([\s\S]*?)\{\/\* TAB 6: STORE \(EKLENTILER\) \*\/\}/;
const match = content.match(tab5Regex);
if (!match) {
    console.log("Could not find TAB 5 block");
    process.exit(1);
}

// We need to replace `{activeTab === "templates" && (` with `<>`
// and the final `)}` with `</>`
let tab5Content = match[1];
tab5Content = tab5Content.replace(/\{activeTab === "templates" && \(/, '<>');
tab5Content = tab5Content.replace(/\)\}\s*$/, '</>');
// Actually, it's safer to just replace `activeTab === "templates"` with `true` so we don't mess up brackets.
tab5Content = tab5Content.replace(/activeTab === "templates"/, 'appearanceMode === "templates"');

// Delete the TAB 5 block from its original place
content = content.replace(tab5Regex, '{/* TAB 6: STORE (EKLENTILER) */}');

// 3. Inject TAB 5 content into appearanceMode === "templates"
const injectionPointRegex = /\{appearanceMode === "custom" \? \([\s\S]*?<\/>\s*\) : \(\s*\)\}/;
// Wait, my previous edit added this:
//   {appearanceMode === "custom" ? (
//     <>
//       {/* ... */}
//     </>
//   ) : ( ... )}
// But I haven't closed it yet!

// Let me find the end of "Kendi Tasarımım" which is before `{/* SUB-TAB CONTENT: PROFILE */}`
const appearanceEndRegex = /\{\/\* SUB-TAB CONTENT: PROFILE \*\/\}/;
// I need to find the `</div>` that closes `<div className="w-full space-y-8 animate-in fade-in duration-200">` of the APPEARANCE sub-tab.
const parts = content.split('{/* SUB-TAB CONTENT: PROFILE */}');
if (parts.length < 2) {
    console.log("Could not find SUB-TAB CONTENT: PROFILE");
    process.exit(1);
}

// At the end of parts[0], we have:
//   </div>
// )}
// I want to inject `</>) : (` + tab5Content + `)}` right before the last `</div>`
let appearanceBlock = parts[0];

// The "1-Click Preset Themes" was around line 3406. I will remove it.
const presetThemesRegex = /\{\/\* 1-Click Preset Themes \*\/\}[\s\S]*?\{\/\* Hazır Renk Paleti Kombinasyonları \*\/\}/;
appearanceBlock = appearanceBlock.replace(presetThemesRegex, '{/* Hazır Renk Paleti Kombinasyonları */}');

// We need to close the `<>` and add the else branch for `appearanceMode === "templates"`
// The block ends with:
//               </div>
//             )}
// We will replace the LAST `</div>` and `)}` in appearanceBlock.
const lastClosingDivIndex = appearanceBlock.lastIndexOf('</div>');
appearanceBlock = appearanceBlock.substring(0, lastClosingDivIndex) + 
                  `\n</>\n) : (\n${tab5Content}\n)}\n</div>\n` + 
                  appearanceBlock.substring(lastClosingDivIndex + 6); // Skip the '</div>'

content = appearanceBlock + '{/* SUB-TAB CONTENT: PROFILE */}' + parts[1];

fs.writeFileSync(path, content, 'utf8');
console.log("Dashboard refactored successfully!");
