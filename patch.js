const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Puzzle icon
content = content.replace('Users,\n  Mail,\n} from', 'Users,\n  Mail,\n  Puzzle,\n} from');

// 2. Fix the button
const badButton = `<button
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
        </button>`;

const goodButton = `<button
          onClick={() => setActiveTab("addons")}
          className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer \${
            activeTab === "addons"
              ? "bg-rose-500 border-rose-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          }\`}
        >
          <Puzzle className="h-3.5 w-3.5" />
          {lang === "tr" ? "Eklentilerim" : "My Add-ons"}
        </button>`;

content = content.replace(badButton, goodButton);

// 3. Add the addons tab content
const addonsContent = `
          {/* ADDONS TAB CONTENT */}
          {activeTab === "addons" && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
              {addons.length === 0 ? (
                <div className={\`p-8 rounded-2xl border flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] \${
                  "bg-white border-zinc-200 shadow-sm"
                }\`}>
                  <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center mb-2">
                    <Puzzle className="h-8 w-8 text-rose-500" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-black text-slate-900">
                      {lang === "tr" ? "Henüz Bir Eklentiniz Yok" : "You Don't Have Any Add-ons Yet"}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {lang === "tr" 
                        ? "Mağazamızdan satın aldığınız tüm premium eklenti ve temalar burada görünecektir. Bu eklentileri buradan kolayca yapılandırabilirsiniz."
                        : "All premium add-ons and themes you purchase from our store will appear here. You can configure them easily."}
                    </p>
                  </div>
                  <a 
                    href="/eklentiler" 
                    target="_blank"
                    className="px-6 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-500 transition-colors shadow-sm"
                  >
                    {lang === "tr" ? "Mağazayı İncele" : "Visit Store"}
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addons.map(addon => (
                    <div key={addon.id} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between h-48">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                            <Puzzle className="h-5 w-5 text-zinc-700" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-zinc-900">{addon.addonType}</h3>
                            <div className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                              Aktif (Active)
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2">
                        <button 
                          className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          {lang === "tr" ? "Özellikleri Yönet" : "Manage Features"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
`;

content = content.replace('          {/* STORE TAB CONTENT */}', addonsContent + '\n          {/* STORE TAB CONTENT */}');

fs.writeFileSync(file, content);
console.log('Script completed');
