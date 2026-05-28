const fs = require('fs');
const file = 'src/components/addons/addon-config-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the MINI_STORE renderFields
const storeSettingsStr = `
            <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4" />
                {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
              </h4>
              {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
              
              {/* NEW FIELDS */}
              {renderInput("storeAvatarUrl", lang === "tr" ? "Profil Fotoğrafı (Görsel URL)" : "Profile Image (URL)", "https://...")}
              <div className="grid grid-cols-2 gap-3">
                {renderInput("storeUsername", lang === "tr" ? "Mağaza Kullanıcı Adı" : "Store Username", "@username")}
                {renderInput("buyButtonText", lang === "tr" ? "Satın Al Butonu Metni" : "Buy Button Text", "Satın Al")}
              </div>
              {renderTextarea("storeBio", lang === "tr" ? "Mağaza Açıklaması (Bio)" : "Store Bio", lang === "tr" ? "Yazar & Kariyer Danışmanı" : "Author & Consultant")}

              <div className="grid grid-cols-2 gap-3">
                {renderInput("currency", lang === "tr" ? "Para Birimi" : "Currency", "₺, $, €")}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Mağaza Teması" : "Store Theme"}</label>
                  <select
                    value={configData["theme"] || "classic"}
                    onChange={(e) => setConfigData({ ...configData, theme: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  >
                    <option value="classic">Classic Minimal</option>
                    <option value="vibrant-pop">Vibrant Pop</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="neo-brutalism">Neo Brutalism</option>
                    <option value="dark-drill">Dark Drill</option>
                    <option value="organic-earth">Organic Earth</option>
                    <option value="retro-arcade">Retro Arcade</option>
                    <option value="dark-academia">Dark Academia</option>
                    <option value="y2k-holographic">Y2K Holographic</option>
                  </select>
                </div>
              </div>
            </div>
`;

// Replace the old Store Settings section
content = content.replace(/<div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">.*?<\/div>\s*<\/div>/s, storeSettingsStr.trim());

// Also update the StorefrontPreview in renderLivePreview to pass the new props
const newLivePreview = `
                <StorefrontPreview 
                  theme={configData.theme || "classic"} 
                  products={products.map(p => ({
                    id: p.id,
                    title: p.title,
                    type: p.type,
                    price: p.price.toString(),
                    imageUrl: p.imageUrl || p.fileUrl,
                    description: p.description || ""
                  }))}
                  storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
                  avatarUrl={configData.storeAvatarUrl}
                  username={configData.storeUsername}
                  bio={configData.storeBio}
                  buyButtonText={configData.buyButtonText || (lang === "tr" ? "Satın Al" : "Buy")}
                />
`;

content = content.replace(/<StorefrontPreview[^>]+hideHeader=\{true\}\s*\/>/s, newLivePreview.trim());
content = content.replace(/<StorefrontPreview[^>]+\/>/s, newLivePreview.trim());

fs.writeFileSync(file, content);
console.log('Updated AddonConfigModal successfully');
