const fs = require('fs');

const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let code = fs.readFileSync(path, 'utf-8');

// I will find the EXACT index of `addons.map` and replace the block around it carefully.
const lines = code.split('\n');
const mapIndex = lines.findIndex(l => l.includes('{addons.map(addon => ('));

if (mapIndex !== -1) {
  // Let's find the closing `))}` of this map.
  let closeIndex = mapIndex;
  for (let i = mapIndex; i < mapIndex + 50; i++) {
    if (lines[i].includes('))}')) {
      closeIndex = i;
      break;
    }
  }
  
  if (closeIndex > mapIndex) {
    const newLines = `                  {addons.map(addon => {
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
                  )})} `;
                  
    lines.splice(mapIndex, closeIndex - mapIndex + 1, newLines);
    fs.writeFileSync(path, lines.join('\n'), 'utf-8');
    console.log("Safely patched addons map!");
  } else {
    console.log("Could not find closing parenthesis.");
  }
} else {
  console.log("Could not find addons.map");
}
