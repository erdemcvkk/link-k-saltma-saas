const fs = require('fs');
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add AddonItem interface
if (!content.includes('interface AddonItem')) {
  content = content.replace(
    'interface DashboardClientProps {',
    'export interface AddonItem { id: string; addonType: string; isActive: boolean; config: string | null; }\n\ninterface DashboardClientProps {'
  );
}

// Add initialAddons to props
if (!content.includes('initialAddons?: AddonItem[]')) {
  content = content.replace(
    'interface DashboardClientProps {',
    'interface DashboardClientProps {\n  initialAddons?: AddonItem[];'
  );
}

// Add initialAddons to function arguments
content = content.replace(
  'initialFeatures\n}: DashboardClientProps',
  'initialFeatures,\n  initialAddons\n}: DashboardClientProps'
);

// Add addons state
if (!content.includes('const [addons, setAddons] = useState')) {
  content = content.replace(
    'const [activeTab, setActiveTab] = useState<',
    'const [addons, setAddons] = useState<AddonItem[]>(initialAddons || []);\n  const [activeTab, setActiveTab] = useState<'
  );
}

// Update activeTab type to include addons
content = content.replace(
  /useState<"editor" \| "analytics" \| "qr" \| "seo" \| "templates" \| "store">/,
  'useState<"editor" | "analytics" | "qr" | "seo" | "templates" | "store" | "addons">'
);

// Add "Eklentilerim" Sidebar Button
const sidebarButton = `
        <button
          onClick={() => setActiveTab("addons")}
          className={\`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all \${
            activeTab === "addons"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
          }\`}
        >
          <div className={\`p-2 rounded-xl transition-colors \${
            activeTab === "addons" ? "bg-white/20" : "bg-zinc-100/80"
          }\`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3z"/><path d="M3 4h8s-1-1-2-1-2 1-2 1-2-1-2 1-2-1-2 1"/></svg>
          </div>
          Eklentilerim
        </button>
`;
if (!content.includes('setActiveTab("addons")')) {
  // Insert it before store or after templates
  content = content.replace(
    '<button\n          onClick={() => setActiveTab("store")}',
    sidebarButton + '\n        <button\n          onClick={() => setActiveTab("store")}'
  );
}

// Add Addons Tab Content
const addonsContent = `
        {activeTab === "addons" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Eklentilerim</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Satın aldığınız tüm premium modülleri buradan yönetebilir, temalarını özelleştirebilirsiniz.
              </p>
            </div>

            {addons.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                  <span className="text-2xl opacity-50">🛒</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Henüz Eklenti Yok</h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                  Premium eklentilerle profilinize Randevu, Mini Mağaza veya Soru-Cevap özellikleri ekleyebilirsiniz.
                </p>
                <a href="/eklentiler" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl text-sm hover:bg-zinc-800 transition-colors">
                  Eklenti Mağazasına Git
                </a>
              </div>
            ) : (
              <div className="grid gap-6">
                {addons.map(addon => {
                  let parsedConfig = { theme: 'classic' };
                  try { if(addon.config) parsedConfig = JSON.parse(addon.config); } catch(e){}
                  
                  return (
                    <div key={addon.id} className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">AKTİF</span>
                          <h3 className="text-lg font-bold text-zinc-900">{addon.addonType}</h3>
                        </div>
                        <p className="text-sm text-zinc-500">Mevcut Tema: <span className="font-bold text-zinc-700">{parsedConfig.theme}</span></p>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs font-bold text-zinc-500">Temayı Değiştir</label>
                        <select 
                          className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent cursor-pointer"
                          value={parsedConfig.theme}
                          onChange={async (e) => {
                            const newTheme = e.target.value;
                            const newConfigStr = JSON.stringify({ ...parsedConfig, theme: newTheme });
                            // Optimistic update
                            setAddons(prev => prev.map(a => a.id === addon.id ? {...a, config: newConfigStr} : a));
                            try {
                              await fetch('/api/user-addons', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ addonType: addon.addonType, config: newConfigStr })
                              });
                            } catch(err) {
                              alert("Tema güncellenemedi.");
                            }
                          }}
                        >
                          <option value="dark-drill">Dark Drill / Cyberpunk</option>
                          <option value="glassmorphism">Premium Glassmorphism</option>
                          <option value="minimalist">Minimalist & Clean</option>
                          <option value="vibrant-pop">Vibrant Creator Pop</option>
                          <option value="classic">Classic E-Commerce</option>
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
`;

if (!content.includes('activeTab === "addons"')) {
  content = content.replace(
    '{activeTab === "store" && (',
    addonsContent + '\n        {activeTab === "store" && ('
  );
}

fs.writeFileSync(path, content);
console.log('Patch complete.');
