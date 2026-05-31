const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

const targetStr = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: General Design */}
                                <div className="space-y-5 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">`;

// We'll replace the structural parts.
// Let's use regex to find and replace the whole drawer UI again to make it simpler and more robust.
const startMarker = '{/* INLINE TEMPLATE CUSTOMIZATION CONTROL DRAWER */}';
const endMarker = '{/* Action Buttons */}';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacementDrawer = `{/* INLINE TEMPLATE CUSTOMIZATION CONTROL DRAWER */}
                          {customizingTemplateId === template.id && (
                            <div className="w-full mt-3 p-4 rounded-xl border border-zinc-200/80 bg-slate-50/50 shadow-sm space-y-6 text-left animate-in fade-in duration-200">
                              <h4 className="text-sm font-black text-zinc-800 uppercase tracking-widest border-b border-zinc-200/60 pb-3 flex items-center gap-2">
                                <Settings className="h-4 w-4 text-indigo-500" />
                                {lang === "tr" ? "Şablon Tasarımını Özelleştir" : "Customize Template Design"}
                              </h4>
                              
                              <div className="space-y-6">
                                {/* General Design */}
                                <div className="space-y-4 bg-white p-5 rounded-xl border border-zinc-150 shadow-sm">
                                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                    <Palette className="h-3.5 w-3.5" />
                                    {lang === "tr" ? "Genel Tasarım" : "General Design"}
                                  </h5>
                                  
                                  {/* Profile Image (Avatar) Input */}
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 block">
                                      {lang === "tr" ? "Profil Fotoğrafı" : "Profile Picture"}
                                    </label>
                                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-zinc-100">
                                      <div className="h-12 w-12 rounded-full border border-zinc-200 overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm">
                                        {avatarUrl ? (
                                          <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                          <User className="h-5 w-5 text-slate-300" />
                                        )}
                                      </div>
                                      <label className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 text-[11px] font-bold transition-all cursor-pointer select-none">
                                        {lang === "tr" ? "Fotoğraf Değiştir" : "Change Photo"}
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              if (event.target?.result) setAvatarUrl(event.target.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  {/* Background Input */}
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 block">
                                      {lang === "tr" ? "Arka Plan (Renk/CSS)" : "Background (Color/CSS)"}
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="#f2f2f2, linear-gradient..."
                                      value={background || ""}
                                      onChange={(e) => setBackground(e.target.value)}
                                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                                    />
                                  </div>

                                  {/* Font Style */}
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 block">
                                      {lang === "tr" ? "Yazı Tipi (Font)" : "Font Style"}
                                    </label>
                                    <select
                                      value={fontStyle}
                                      onChange={(e) => setFontStyle(e.target.value)}
                                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors cursor-pointer appearance-none"
                                    >
                                      {initialFonts.map(font => (
                                        <option key={font.value} value={font.value}>{font.name}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "İsim Rengi" : "Name Color"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={usernameColor || "#ffffff"}
                                          onChange={(e) => setUsernameColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={usernameColor || ""}
                                          onChange={(e) => setUsernameColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "Biyografi Rengi" : "Bio Color"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={bioColor || "#888888"}
                                          onChange={(e) => setBioColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={bioColor || ""}
                                          onChange={(e) => setBioColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Button & Icon Styles */}
                                <div className="space-y-4 bg-white p-5 rounded-xl border border-zinc-150 shadow-sm">
                                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                    <MousePointerClick className="h-3.5 w-3.5" />
                                    {lang === "tr" ? "Buton ve İkon Stili" : "Button & Icon Style"}
                                  </h5>
                                  
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "Arka Plan" : "Background"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={btnBgColor || "#ffffff"}
                                          onChange={(e) => setBtnBgColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={btnBgColor || ""}
                                          onChange={(e) => setBtnBgColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "Yazı Rengi" : "Text Color"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={btnTextColor || "#ffffff"}
                                          onChange={(e) => setBtnTextColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={btnTextColor || ""}
                                          onChange={(e) => setBtnTextColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "İkon Rengi" : "Icon Color"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={btnIconColor || "#ffffff"}
                                          onChange={(e) => setBtnIconColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={btnIconColor || ""}
                                          onChange={(e) => setBtnIconColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                          placeholder="Aynı"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 block">
                                        {lang === "tr" ? "Çerçeve Rengi" : "Border Color"}
                                      </label>
                                      <div className="flex gap-2">
                                        <input
                                          type="color"
                                          value={btnBorderColor || "#ffffff"}
                                          onChange={(e) => setBtnBorderColor(e.target.value)}
                                          className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={btnBorderColor || ""}
                                          onChange={(e) => setBtnBorderColor(e.target.value)}
                                          className="flex-1 min-w-0 px-2 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mt-4 pt-3 border-t border-zinc-100">
                                    <label className="text-[11px] font-bold text-slate-600 block">
                                      {lang === "tr" ? "Çerçeve Stili" : "Border Style"}
                                    </label>
                                    <select
                                      value={btnBorderStyle || "solid"}
                                      onChange={(e) => setBtnBorderStyle(e.target.value)}
                                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 outline-none bg-slate-50 hover:bg-white"
                                    >
                                      <option value="solid">{lang === "tr" ? "Düz (Solid)" : "Solid"}</option>
                                      <option value="dashed">{lang === "tr" ? "Kesik (Dashed)" : "Dashed"}</option>
                                      <option value="dotted">{lang === "tr" ? "Noktalı (Dotted)" : "Dotted"}</option>
                                      <option value="none">{lang === "tr" ? "Yok (None)" : "None"}</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* --- QUICK LINK ADDITION (Hızlı Link Ekleme) --- */}
                              <div className="pt-2">
                                <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-4">
                                  <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                    <Globe className="h-4 w-4" />
                                    {lang === "tr" ? "Yeni Link Ekle (Önizleme İçin)" : "Add New Link (For Preview)"}
                                  </h5>
                                  
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500">{lang === "tr" ? "Başlık" : "Title"}</label>
                                      <input
                                        type="text"
                                        placeholder="Link Başlığı"
                                        value={quickLinkTitle}
                                        onChange={(e) => setQuickLinkTitle(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500">{lang === "tr" ? "URL" : "URL"}</label>
                                      <input
                                        type="text"
                                        placeholder="https://..."
                                        value={quickLinkUrl}
                                        onChange={(e) => setQuickLinkUrl(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="pt-2 border-t border-zinc-100">
                                    <label className="text-[10px] font-bold text-slate-500 mb-2 block">
                                      {lang === "tr" ? "İkon Seçimi" : "Icon"}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        { id: "WEBSITE", icon: Globe },
                                        { id: "INSTAGRAM", icon: InstagramIcon },
                                        { id: "WHATSAPP", icon: MessageCircle },
                                        { id: "TIKTOK", icon: TiktokIcon },
                                        { id: "PINTEREST", icon: PinterestIcon },
                                        { id: "YOUTUBE", icon: YoutubeIcon },
                                        { id: "X", icon: TwitterIcon },
                                        { id: "REDDIT", icon: MessageCircle },
                                        { id: "LINKEDIN", icon: LinkedinIcon },
                                      ].map(iconOption => (
                                        <button
                                          key={iconOption.id}
                                          type="button"
                                          onClick={() => setQuickLinkIcon(iconOption.id)}
                                          className={\`p-2.5 rounded-xl flex items-center justify-center transition-all \${
                                            quickLinkIcon === iconOption.id 
                                              ? "bg-indigo-500 text-white shadow-md scale-105" 
                                              : "bg-slate-50 border border-zinc-200 text-zinc-500 hover:bg-white"
                                          }\`}
                                        >
                                          <iconOption.icon className="h-4 w-4" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="pt-2">
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1.5">
                                      {lang === "tr" ? "İkon Rengi (İsteğe Bağlı Özel Renk)" : "Custom Icon Color"}
                                    </label>
                                    <div className="flex gap-2">
                                      <input
                                        type="color"
                                        value={quickLinkIconColor || "#ffffff"}
                                        onChange={(e) => setQuickLinkIconColor(e.target.value)}
                                        className="h-9 w-10 rounded cursor-pointer border border-zinc-200 shrink-0"
                                      />
                                      <input
                                        type="text"
                                        value={quickLinkIconColor || ""}
                                        onChange={(e) => setQuickLinkIconColor(e.target.value)}
                                        className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 bg-slate-50 uppercase"
                                        placeholder="#FFFFFF"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (!quickLinkTitle || !quickLinkUrl) return;
                                      if (simulatedPlan === "FREE" && links.length >= 5) {
                                        triggerUpgradeModal(
                                          lang === "tr" ? "Link Sınırına Ulaştınız 🔒" : "Link Limit Reached 🔒",
                                          lang === "tr" 
                                            ? "Ücretsiz planda en fazla 5 link oluşturabilirsiniz. Sınırları kaldırmak için Premium pakete geçin!" 
                                            : "Free tier is limited to 5 links. Upgrade your plan to add unlimited links!"
                                        );
                                        return;
                                      }
                                      startTransition(async () => {
                                        try {
                                          const metaPayload = quickLinkIconColor ? JSON.stringify({ iconColor: quickLinkIconColor }) : null;
                                          const res = await addLink(
                                            initialUser.id,
                                            quickLinkTitle,
                                            quickLinkUrl,
                                            quickLinkIcon,
                                            "",
                                            "TEXT_LINK",
                                            metaPayload
                                          );
                                          if (res && res.error) throw new Error(res.error);

                                          const tempId = Math.random().toString();
                                          setLinks([
                                            ...links,
                                            {
                                              id: tempId,
                                              title: quickLinkTitle,
                                              url: quickLinkUrl,
                                              isActive: true,
                                              type: quickLinkIcon,
                                              clicks: [],
                                              blockType: "TEXT_LINK",
                                              metadata: metaPayload,
                                              bgColor: btnBgColor || null,
                                              textColor: btnTextColor || null,
                                              borderColor: btnBorderColor || null,
                                              borderStyle: btnBorderStyle || null,
                                              borderWidth: btnBorderWidth || null,
                                              borderRadius: btnBorderRadius || null,
                                              shadow: btnShadow || null,
                                              fontWeight: btnFontWeight || null
                                            }
                                          ]);
                                          setQuickLinkTitle("");
                                          setQuickLinkUrl("");
                                          setQuickLinkIcon("WEBSITE");
                                          setQuickLinkIconColor("");
                                          setSuccessMsg(lang === "tr" ? "Link başarıyla eklendi!" : "Link added successfully!");
                                          setTimeout(() => setSuccessMsg(""), 3000);
                                        } catch (err: any) {
                                          setErrorMsg(err.message || "Failed to add link");
                                          setTimeout(() => setErrorMsg(""), 4000);
                                        }
                                      });
                                    }}
                                    className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                  >
                                    <Globe className="h-4 w-4" />
                                    <span>{lang === "tr" ? "Listeye Ekle ve Önizle" : "Add to List & Preview"}</span>
                                  </button>
                                </div>
                              </div>

                              `;
  
  content = content.replace(content.substring(startIndex, endIndex), replacementDrawer);
  fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
  console.log("Drawer layout improved and made spacious");
} else {
  console.log("Could not find start/end markers");
}
