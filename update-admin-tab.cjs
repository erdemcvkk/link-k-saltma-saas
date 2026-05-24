const fs = require('fs');
const file = 'src/app/admin/admin-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// The new homepage block we want to insert
const newHomepageTab = `
            {/* --- HOMEPAGE MANAGEMENT (Hoo.be Style) --- */}
            {sidebarTab === "homepage" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Landing Page Yönetimi (Hoo.be Stili)</h2>
                  <p className="text-sm mt-1 text-slate-500">
                    Ana sayfa metinlerini, kayan slider (Creator Carousel) ve özellik bloklarını (Zig-zag) yönetin.
                  </p>
                </div>

                {/* Hero Section Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Hero (Giriş) Alanı</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Ana Başlık (Örn: Your home)</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Vurgulu Kelime (Teal Rengi - Örn: on the web)</label>
                      <input
                        type="text"
                        value={settingsMap["hero_highlight"] || "on the web"}
                        onChange={(e) => setSettingsMap(prev => ({ ...prev, hero_highlight: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Alt Açıklama (Subtitle)</label>
                      <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Creator Carousel Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Creator Carousel (Yatay Kayan Slider)</h3>
                  <p className="text-xs text-slate-500 mb-4">Görselleri ve isimleri JSON formatında düzenleyin.</p>
                  <textarea
                    value={settingsMap["creators_data"] || ""}
                    onChange={(e) => setSettingsMap(prev => ({ ...prev, creators_data: e.target.value }))}
                    rows={8}
                    placeholder={'[\\n  { "id": "1", "name": "Metro Beats", "username": "metro_beats", "imageUrl": "https://..." }\\n]'}
                    className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm font-mono"
                  />
                </div>

                {/* Zigzag Features Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Özellik Blokları (Zig-Zag)</h3>
                  <p className="text-xs text-slate-500 mb-4">Özellikleri JSON formatında düzenleyin.</p>
                  <textarea
                    value={settingsMap["features_data"] || ""}
                    onChange={(e) => setSettingsMap(prev => ({ ...prev, features_data: e.target.value }))}
                    rows={12}
                    placeholder={'[\\n  { "id": "feat-1", "title": "Build your page", "highlightWords": "in minutes.", "description": "...", "imageUrl": "...", "listItems": [ { "text": "...", "icon": "layout" } ] }\\n]'}
                    className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm font-mono"
                  />
                </div>

                <button
                  onClick={async () => {
                    setIsSavingFeatures(true);
                    try {
                      await saveGlobalSetting(adminUserId, "hero_title", heroTitle);
                      await saveGlobalSetting(adminUserId, "hero_highlight", settingsMap["hero_highlight"] || "on the web");
                      await saveGlobalSetting(adminUserId, "hero_subtitle", heroSubtitle);
                      await saveGlobalSetting(adminUserId, "creators_data", settingsMap["creators_data"] || "");
                      await saveGlobalSetting(adminUserId, "features_data", settingsMap["features_data"] || "");
                      
                      setSuccessMsg("Landing Page ayarları başarıyla kaydedildi!");
                      setTimeout(() => setSuccessMsg(""), 3000);
                    } catch (e) {
                      alert(e.message || "Kaydedilemedi");
                    } finally {
                      setIsSavingFeatures(false);
                    }
                  }}
                  disabled={isSavingFeatures}
                  className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  {isSavingFeatures && <Loader2 className="h-4 w-4 animate-spin" />}
                  Değişiklikleri Kaydet
                </button>
              </div>
            )}
`;

// Find the start and end of the old homepage block
const startIdx = content.indexOf('{/* --- HOMEPAGE / SLIDER MANAGEMENT --- */}');
const endIdx = content.indexOf('{sidebarTab === "settings" && (');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newHomepageTab + "\\n            " + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Homepage tab updated successfully');
} else {
  console.log('Could not find the blocks to replace');
}
