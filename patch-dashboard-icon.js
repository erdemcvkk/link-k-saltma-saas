const fs = require('fs');

let file = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// 1. Add state for newLinkIcon
if (!file.includes('const [newLinkIcon, setNewLinkIcon]')) {
  file = file.replace(
    'const [newUrl, setNewUrl] = useState("");',
    'const [newUrl, setNewUrl] = useState("");\n  const [newLinkIcon, setNewLinkIcon] = useState<string>("WEBSITE");'
  );
}

// 2. Add icon UI
const iconUI = `
                          <div className="pt-2">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-2">
                              {lang === "tr" ? "İkon Seçimi" : "Icon Selection"}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: "WEBSITE", label: "Web", icon: Globe },
                                { id: "INSTAGRAM", label: "Instagram", icon: Globe },
                                { id: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
                                { id: "TIKTOK", label: "TikTok", icon: Music },
                                { id: "PINTEREST", label: "Pinterest", icon: Image },
                                { id: "YOUTUBE", label: "YouTube", icon: Youtube },
                                { id: "X", label: "X", icon: Twitter },
                                { id: "REDDIT", label: "Reddit", icon: MessageCircle },
                                { id: "LINKEDIN", label: "LinkedIn", icon: Linkedin },
                              ].map(iconOption => (
                                <button
                                  key={iconOption.id}
                                  type="button"
                                  onClick={() => setNewLinkIcon(iconOption.id)}
                                  className={\`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all \${
                                    newLinkIcon === iconOption.id 
                                      ? "bg-emerald-500 text-white shadow-md" 
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }\`}
                                >
                                  <iconOption.icon className="h-4 w-4" />
                                  {iconOption.label}
                                </button>
                              ))}
                            </div>
                          </div>
`;

// Insert the UI just after the newUrl input
if (!file.includes('İkon Seçimi')) {
  file = file.replace(
    'placeholder={t.linkUrlPlaceholder}',
    'placeholder={t.linkUrlPlaceholder}\n                            />\n                          </div>\n' + iconUI + '\n                          {/* dummy replacement block to fix tags */}'
  );
  file = file.replace('\n                          {/* dummy replacement block to fix tags */}', '');
}

// 3. Update handleAddLink to use newLinkIcon
file = file.replace(
  'const typeParam = linkSelectedTemplate || "WEBSITE";',
  'const typeParam = linkSelectedTemplate || newLinkIcon;'
);

// 4. Update the reset state
file = file.replace(
  'setNewUrl("");\n                          }}',
  'setNewUrl("");\n                            setNewLinkIcon("WEBSITE");\n                          }}'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', file);
console.log('Done!');
