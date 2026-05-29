const fs = require('fs');

let file = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// 1. Update updateProfile calls to include activeTemplateCss
// First one (line ~1076)
file = file.replace(
  'await updateProfile(initialUser.id, bio, theme, username, avatarUrl, background, fontStyle, bioColor, usernameColor);',
  'await updateProfile(initialUser.id, bio, theme, username, avatarUrl, background, fontStyle, bioColor, usernameColor, activeTemplateCss);'
);

// 2. Insert Icon UI
const iconUI = `
                          <div className="pt-2 pb-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-2">
                              {lang === "tr" ? "İkon Seçimi" : "Icon Selection"}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: "WEBSITE", label: "Web", icon: Globe },
                                { id: "INSTAGRAM", label: "Instagram", icon: InstagramIcon },
                                { id: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
                                { id: "TIKTOK", label: "TikTok", icon: TiktokIcon },
                                { id: "PINTEREST", label: "Pinterest", icon: PinterestIcon },
                                { id: "YOUTUBE", label: "YouTube", icon: YoutubeIcon },
                                { id: "X", label: "X", icon: TwitterIcon },
                                { id: "REDDIT", label: "Reddit", icon: MessageCircle },
                                { id: "LINKEDIN", label: "LinkedIn", icon: LinkedinIcon },
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

// Insert the UI just above the "submit" button logic.
// Find the submit button:
const buttonMatch = file.match(/<button[\s\S]*?type="submit"[\s\S]*?disabled={isPending \|\| !newTitle[\s\S]*?>/);
if (buttonMatch) {
  file = file.replace(buttonMatch[0], iconUI + '\n                        ' + buttonMatch[0]);
}

// 3. Reset newLinkIcon state when form closes/resets
file = file.replace(
  'setNewUrl("");\n                          }}',
  'setNewUrl("");\n                            setNewLinkIcon("WEBSITE");\n                          }}'
);

file = file.replace(
  'setNewUrl("");\n        setLinkSelectedTemplate(null);',
  'setNewUrl("");\n        setNewLinkIcon("WEBSITE");\n        setLinkSelectedTemplate(null);'
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', file);
console.log('Patched dashboard-client.tsx!');
