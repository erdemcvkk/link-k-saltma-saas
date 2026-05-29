const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?\{addons\.map\(addon => \([\s\S]*?<\/div>\s*<\/div>\s*\)\)}\s*<\/div>/;

const newAddonsGrid = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addons.map(addon => {
                      const getDefaultSlug = (type: string) => {
                        if (type === "MINI_STORE") return "store";
                        if (type === "NEO_BRUTAL") return "neo-brutal";
                        if (type === "ORGANIC") return "organic";
                        if (type === "RETRO") return "retro";
                        if (type === "ACADEMIA") return "academia";
                        if (type === "Y2K") return "y2k";
                        if (type === "BOOKING") return "booking";
                        if (type === "NEWSLETTER") return "newsletter";
                        if (type === "QA") return "qa";
                        if (type === "DONATION") return "donation";
                        return type.toLowerCase();
                      };
                      
                      let addonLink = \`/\${initialUser.username}/store\`;
                      try {
                        const config = addon.config ? JSON.parse(addon.config) : {};
                        addonLink = \`/\${initialUser.username}/\${(config.customSlug || getDefaultSlug(addon.addonType)).toLowerCase()}\`;
                      } catch(e) {}

                      return (
                      <div key={addon.id} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between h-48">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                              <Puzzle className="h-5 w-5 text-zinc-700" />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-zinc-900">{addon.addonType}</h3>
                              {addon.isActive ? (
                                <div className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                                  {lang === "tr" ? "Yayında" : "Published"}
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold text-zinc-500 mt-0.5 px-2 py-0.5 rounded-md bg-zinc-100 inline-block border border-zinc-200">
                                  {lang === "tr" ? "Taslak" : "Draft"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2">
                          <button 
                            onClick={() => setEditingAddon(addon)}
                            className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            {lang === "tr" ? "Ayarla" : "Config"}
                          </button>
                          {addon.isActive && (
                            <a 
                              href={addonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              {lang === "tr" ? "Linke Git" : "Visit Link"}
                            </a>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>`;

if (regex.test(code)) {
  code = code.replace(regex, newAddonsGrid);
  fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', code, 'utf-8');
  console.log('Successfully patched dashboard addons mapping');
} else {
  console.log('Could not match regex in dashboard-client.tsx');
}
