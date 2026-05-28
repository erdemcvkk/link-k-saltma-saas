const fs = require('fs');
const file = 'src/components/addons/addon-config-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add customSlug field logic
const slugInputStr = `
              {renderInput("customSlug", lang === "tr" ? "Eklenti Linki (Opsiyonel)" : "Addon Link (Optional)", lang === "tr" ? "Örn: magazam (link-saas.com/@isim/magazam)" : "e.g. store")}
`;

// Insert the slug input inside Store Settings just below Store Title
content = content.replace(
  /(\{renderInput\("storeTitle".*?\)\})/s,
  `$1\n              ${slugInputStr.trim()}`
);

// 2. We need a handleFileUpload function
const handleFileUploadCode = `
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(lang === "tr" ? "Yükleme başarısız!" : "Upload failed!");
    const data = await res.json();
    return data.url;
  };
`;
// Insert inside the component
content = content.replace(
  /const handleSave = \(\) => \{/s,
  `${handleFileUploadCode.trim()}\n\n  const handleSave = () => {`
);

// 3. For the Store Avatar, we replace the old input with an input + file select combo
const avatarInputReplacement = `
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={configData["storeAvatarUrl"] || ""}
                    onChange={(e) => setConfigData({ ...configData, storeAvatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  />
                  <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
                    {lang === "tr" ? "Dosya Seç" : "Upload"}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file);
                            setConfigData({ ...configData, storeAvatarUrl: url });
                          } catch (err: any) { alert(err.message); }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
`;

content = content.replace(
  /\{renderInput\("storeAvatarUrl",[^}]+\)\}/s,
  avatarInputReplacement.trim()
);

// 4. Update the Product Image URL input to also have a file upload
const productImageReplacement = `
                  <div className="flex gap-2">
                    <div className="w-1/2 flex gap-1 relative">
                      <input type="text" id="newProdImageUrl" placeholder={lang === "tr" ? "Ürün Görseli (URL)" : "Product Image (URL)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
                      <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
                        {lang === "tr" ? "Dosya Seç" : "Upload"}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                (document.getElementById("newProdImageUrl") as HTMLInputElement).value = url;
                              } catch (err: any) { alert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="w-1/2 flex gap-1 relative">
                      <input type="text" id="newProdFileUrl" placeholder={lang === "tr" ? "İndirme Linki (Dosya)" : "Download Link (File)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
                      <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
                        {lang === "tr" ? "Dosya Seç" : "Upload"}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                (document.getElementById("newProdFileUrl") as HTMLInputElement).value = url;
                              } catch (err: any) { alert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
`;

content = content.replace(
  /<div className="flex gap-2">\s*<input type="text" id="newProdImageUrl"[^>]+>\s*<input type="text" id="newProdFileUrl"[^>]+>\s*<\/div>/s,
  productImageReplacement.trim()
);

fs.writeFileSync(file, content);
console.log("Updated AddonConfigModal");
