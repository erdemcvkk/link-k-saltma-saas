const fs = require('fs');
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\\n');

// 1. Add appearanceMode state
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const [activeSubTab, setActiveSubTab] = useState<"links" | "appearance" | "profile">("links");')) {
        lines.splice(i+1, 0, '  const [appearanceMode, setAppearanceMode] = useState<"custom" | "templates">("custom");');
        break;
    }
}

// 2. Add imports
for (let i = 0; i < 200; i++) {
    if (lines[i].includes('} from "lucide-react";')) {
        lines[i-1] = lines[i-1].replace(',', '') + ',\n  Palette,\n  LayoutTemplate';
        break;
    }
}

// 3. Inject Toggle Buttons inside APPEARANCE
const appearanceStartIdx = lines.findIndex(l => l.includes('{/* SUB-TAB CONTENT: APPEARANCE */}'));
if (appearanceStartIdx !== -1) {
    let divIdx = appearanceStartIdx + 1;
    while (!lines[divIdx].includes('<div className="w-full space-y-8 animate-in fade-in duration-200">')) {
        divIdx++;
    }
    const toggleButtons = `
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
                    <>`;
    lines.splice(divIdx + 1, 0, toggleButtons);
}

// 4. Find the exact place where the Appearance tab ends, before activeSubTab === "links"
const linksStartIdx = lines.findIndex(l => l.includes('activeSubTab === "links" && ('));
if (linksStartIdx !== -1) {
    let j = linksStartIdx - 1;
    while (!lines[j].includes('</div>')) j--;
    if (j > 0) {
        lines.splice(j, 0, '              </>', '            )}', '            {appearanceMode === "templates" && (', '              <div id="owned-templates-injected"></div>', '            )}');
    }
}

// 5. Remove 1-click themes safely
const presetStart = lines.findIndex(l => l.includes('{/* 1-Click Preset Themes */}'));
const presetEnd = lines.findIndex(l => l.includes('{/* Hazır Renk Paleti Kombinasyonları */}'));
if (presetStart !== -1 && presetEnd !== -1) {
    lines.splice(presetStart, presetEnd - presetStart);
}

// 6. Move TAB 5 content into <div id="owned-templates-injected"></div>
const tab5Start = lines.findIndex(l => l.includes('TAB 5: OWNED TEMPLATES'));
let tab5End = -1;
for (let i = tab5Start + 1; i < lines.length; i++) {
    if (lines[i].includes('TAB 6:') || lines[i].includes('activeTab === "addons"')) {
        tab5End = i - 1;
        break;
    }
}
if (tab5End === -1) {
    tab5End = tab5Start;
    while(tab5End < lines.length) {
        if (lines[tab5End].includes('</main>') || lines[tab5End].includes('TAB 6')) break;
        tab5End++;
    }
    tab5End -= 3;
}

if (tab5Start !== -1 && tab5End !== -1) {
    let tab5Lines = lines.slice(tab5Start, tab5End + 1);
    lines.splice(tab5Start, tab5End - tab5Start + 1);
    
    // Remove the wrapper `activeTab === "templates"` from tab5Lines
    const wrapIndex = tab5Lines.findIndex(l => l.includes('activeTab === "templates" && ('));
    if (wrapIndex !== -1) {
        tab5Lines.splice(wrapIndex, 1); // remove open
        // remove close
        for (let i = tab5Lines.length - 1; i >= 0; i--) {
            if (tab5Lines[i].includes(')}')) {
                tab5Lines.splice(i, 1);
                break;
            }
        }
    }

    let content = lines.join('\\n');
    content = content.replace('<div id="owned-templates-injected"></div>', tab5Lines.join('\\n'));
    lines = content.split('\\n');
}

// 7. Remove the Sidebar button safely
const sidebarBtnIndex = lines.findIndex(l => l.includes('onClick={() => setActiveTab("templates")}'));
if (sidebarBtnIndex !== -1) {
    let sStart = sidebarBtnIndex;
    while (!lines[sStart].includes('<button')) sStart--;
    let sEnd = sidebarBtnIndex;
    while (!lines[sEnd].includes('</button>')) sEnd++;
    lines.splice(sStart, sEnd - sStart + 1);
}

fs.writeFileSync(path, lines.join('\\n'), 'utf8');
console.log("Refactored smoothly!");
