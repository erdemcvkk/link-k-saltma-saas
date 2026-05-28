const fs = require('fs');
const file = 'src/components/addons/addon-config-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

const storeUI = `
      case "MINI_STORE":
        return (
          <>
            <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4" />
                {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
              </h4>
              {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
              <div className="grid grid-cols-2 gap-3">
                {renderInput("currency", lang === "tr" ? "Para Birimi" : "Currency", "₺, $, €")}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{lang === "tr" ? "Mağaza Teması" : "Store Theme"}</label>
                  <select
                    value={configData["theme"] || "classic"}
                    onChange={(e) => setConfigData({ ...configData, theme: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="classic">Classic Minimal</option>
                    <option value="vibrant-pop">Vibrant Pop</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="neo-brutalism">Neo Brutalism</option>
                    <option value="dark-drill">Dark Drill</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
                </h4>
              </div>

              {/* Add New Product Form */}
              <div className="p-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 space-y-3">
                <h5 className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
                </h5>
                <div className="space-y-2.5">
                  <input type="text" id="newProdTitle" placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} className="w-full p-2 rounded-xl border border-indigo-100 bg-white text-xs font-medium" />
                  <div className="flex gap-2">
                    <input type="number" id="newProdPrice" placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} className="w-1/3 p-2 rounded-xl border border-indigo-100 bg-white text-xs font-medium" />
                    <select id="newProdType" className="w-2/3 p-2 rounded-xl border border-indigo-100 bg-white text-xs font-medium">
                      <option value="PRESET">Lightroom Preset</option>
                      <option value="EBOOK">E-Book (PDF)</option>
                      <option value="BEAT">Audio Beat</option>
                      <option value="SAMPLE_PACK">Sample Pack</option>
                      <option value="VIDEO_COURSE">Video Course</option>
                      <option value="SOFTWARE">Software/App</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                  </div>
                  <input type="text" id="newProdFileUrl" placeholder={lang === "tr" ? "İndirme Linki (Dosya URL)" : "Download Link (File URL)"} className="w-full p-2 rounded-xl border border-indigo-100 bg-white text-xs font-medium" />
                  <textarea id="newProdDesc" placeholder={lang === "tr" ? "Ürün Açıklaması (Opsiyonel)" : "Description (Optional)"} className="w-full p-2 rounded-xl border border-indigo-100 bg-white text-xs font-medium h-16 resize-none" />
                  <button 
                    type="button"
                    onClick={async () => {
                      const title = (document.getElementById("newProdTitle") as HTMLInputElement).value;
                      const price = (document.getElementById("newProdPrice") as HTMLInputElement).value;
                      const type = (document.getElementById("newProdType") as HTMLSelectElement).value;
                      const fileUrl = (document.getElementById("newProdFileUrl") as HTMLInputElement).value;
                      const desc = (document.getElementById("newProdDesc") as HTMLTextAreaElement).value;
                      
                      if(!title || !price || !fileUrl) {
                        alert(lang === "tr" ? "Lütfen gerekli alanları (Ad, Fiyat, Link) doldurun." : "Please fill required fields.");
                        return;
                      }
                      
                      startTransition(async () => {
                        try {
                          await addAddonProduct(title, type, Number(price), desc, fileUrl);
                          (document.getElementById("newProdTitle") as HTMLInputElement).value = "";
                          (document.getElementById("newProdPrice") as HTMLInputElement).value = "";
                          (document.getElementById("newProdFileUrl") as HTMLInputElement).value = "";
                          (document.getElementById("newProdDesc") as HTMLTextAreaElement).value = "";
                        } catch(e:any) {
                          alert(e.message);
                        }
                      });
                    }}
                    className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    {lang === "tr" ? "Ürünü Kaydet" : "Save Product"}
                  </button>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {products.length === 0 ? (
                  <p className="text-xs text-center text-zinc-500 py-4">{lang === "tr" ? "Henüz eklenmiş ürün yok." : "No products added yet."}</p>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white">
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-slate-800">{p.title}</h6>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <span className="font-mono bg-zinc-100 px-1 rounded">{p.price}₺</span>
                          <span>{p.type}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if(confirm(lang === "tr" ? "Ürünü silmek istediğinize emin misiniz?" : "Are you sure?")) {
                            startTransition(async () => {
                              try {
                                await deleteAddonProduct(p.id);
                              } catch(e:any) {
                                alert(e.message);
                              }
                            });
                          }
                        }}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
`;

const oldStoreUI = /case "MINI_STORE":\s*return \(\s*<>\s*\{renderInput\("storeTitle".*?\n.*?\n.*?\n.*?\n\s*<\/>\s*\);/s;

content = content.replace(oldStoreUI, storeUI.trim());

fs.writeFileSync(file, content);
console.log('Patch 2 complete');
