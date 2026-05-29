const fs = require('fs');

const path = 'src/components/addons/addon-config-modal.tsx';
const lines = fs.readFileSync(path, 'utf-8').split('\\n');

const startIndex = lines.findIndex(l => l.includes('const renderFields = () => {'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('const renderLivePreview = () => {'));

if (startIndex !== -1 && endIndex !== -1) {
  const newFields = \`  const renderFields = () => {
    const renderSlugAndAvatar = () => (
      <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {lang === "tr" ? "Genel Ayarlar" : "General Settings"}
        </h4>
        <div className="space-y-1.5 mb-4">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Eklenti Linki (Opsiyonel)" : "Addon Link (Optional)"}</label>
          <div className="flex gap-0 items-center">
            <span className="px-3 py-3 bg-zinc-100 border border-zinc-200 border-r-0 rounded-l-xl text-sm text-zinc-500 font-medium whitespace-nowrap">
              {domain}/@{username}/
            </span>
            <input
              type="text"
              value={configData["customSlug"] || ""}
              onChange={(e) => setConfigData({ ...configData, customSlug: e.target.value })}
              placeholder={getDefaultSlug(addon?.addonType)}
              className="w-full px-4 py-3 border-y border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
            />
            <a
              href={\`http://\${domain}/@\${username}/\${activeSlug}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors border border-indigo-600 whitespace-nowrap"
            >
              {lang === "tr" ? "Git" : "Go"}
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(\`http://\${domain}/@\${username}/\${activeSlug}\`);
                alert(lang === "tr" ? "Link kopyalandı!" : "Link copied!");
              }}
              className="px-4 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-sm font-bold rounded-r-xl transition-colors border-y border-r border-zinc-300 whitespace-nowrap"
            >
              {lang === "tr" ? "Kopyala" : "Copy"}
            </button>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={configData["avatarUrl"] || ""}
              onChange={(e) => setConfigData({ ...configData, avatarUrl: e.target.value })}
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
                      setConfigData({ ...configData, avatarUrl: url });
                    } catch (err: any) { alert(err.message); }
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    );

    let specificFields = null;

    switch (addon.addonType) {
      case "MINI_STORE":
      case "NEO_BRUTAL":
      case "ORGANIC":
      case "RETRO":
      case "ACADEMIA":
      case "Y2K":
        specificFields = (
          <>
            <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4" />
                {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
              </h4>
              {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
              
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
                </h4>
              </div>

              {/* Add New Product Form */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
                <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
                </h5>
                <div className="space-y-3">
                  <input type="text" id="newProdTitle" placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
                  <div className="flex gap-2">
                    <input type="number" id="newProdPrice" placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} className="w-1/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
                    <select id="newProdType" className="w-2/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none">
                      <option value="PRESET">Lightroom Preset</option>
                      <option value="EBOOK">E-Book (PDF)</option>
                      <option value="BEAT">Audio Beat</option>
                      <option value="SAMPLE_PACK">Sample Pack</option>
                      <option value="VIDEO_COURSE">Video Course</option>
                      <option value="SOFTWARE">Software/App</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                  </div>
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
                          accept="*/*"
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
                  <textarea id="newProdDesc" placeholder={lang === "tr" ? "Ürün Açıklaması" : "Description"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none resize-none min-h-[80px]" />
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const title = (document.getElementById("newProdTitle") as HTMLInputElement).value;
                        const price = parseFloat((document.getElementById("newProdPrice") as HTMLInputElement).value);
                        const type = (document.getElementById("newProdType") as HTMLSelectElement).value;
                        const imageUrl = (document.getElementById("newProdImageUrl") as HTMLInputElement).value;
                        const fileUrl = (document.getElementById("newProdFileUrl") as HTMLInputElement).value;
                        const description = (document.getElementById("newProdDesc") as HTMLTextAreaElement).value;
                        
                        if (!title || isNaN(price)) {
                          alert(lang === "tr" ? "Lütfen başlık ve geçerli bir fiyat girin" : "Please enter title and valid price");
                          return;
                        }
                        
                        await addProduct({ title, price, type, imageUrl, fileUrl, description, isActive: true });
                        alert(lang === "tr" ? "Ürün eklendi!" : "Product added!");
                        window.location.reload();
                      } catch (err: any) {
                        alert(err.message);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                  >
                    {lang === "tr" ? "Ürünü Ekle" : "Add Product"}
                  </button>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                {products.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">
                    {lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}
                  </div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                          {(p.imageUrl || p.fileUrl) ? (
                            <img src={p.imageUrl || p.fileUrl || ""} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 m-auto mt-3.5 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">{p.price}₺</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.type}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (confirm(lang === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure?")) {
                            await deleteProduct(p.id);
                            window.location.reload();
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        break;
      case "BOOKING":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 Call")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}
            {renderInput("calendarLink", lang === "tr" ? "Takvim Linki (Calendly vb.)" : "Calendar URL", "https://calendly.com/...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
          </>
        );
        break;
      case "QA":
        specificFields = (
          <>
            {renderInput("boxTitle", lang === "tr" ? "Kutu Başlığı" : "Box Title", lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}
            {renderTextarea("welcomeMessage", lang === "tr" ? "Karşılama Mesajı" : "Welcome Message", lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "You can ask questions anonymously.")}
            {renderInput("placeholderText", lang === "tr" ? "Kutu İçi Yer Tutucu Metin" : "Input Placeholder", lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Gönder" : "Send")}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="allowAnonymous" className="rounded" checked={configData.allowAnonymous ?? true} onChange={(e) => setConfigData({ ...configData, allowAnonymous: e.target.checked })} />
              <label htmlFor="allowAnonymous" className="text-sm font-medium text-slate-700">
                {lang === "tr" ? "Anonim sorulara izin ver" : "Allow anonymous questions"}
              </label>
            </div>
          </>
        );
        break;
      case "NEWSLETTER":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
            {renderTextarea("incentiveMsg", lang === "tr" ? "Teşvik Mesajı" : "Incentive Message", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
            {renderInput("serviceUrl", lang === "tr" ? "Mailchimp/Revue Abonelik Linki" : "Newsletter URL", "https://mailchimp.com/...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
          </>
        );
        break;
      case "DONATION":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}
            {renderTextarea("thankYouMsg", lang === "tr" ? "Açıklama / Teşekkür Mesajı" : "Description / Thank You", lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}
            {renderInput("platformUrl", lang === "tr" ? "Bağış Platformu Linki (Örn: Patreon)" : "Donation URL", "https://patreon.com/yourname")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Destek Ol" : "Support Me")}
          </>
        );
        break;
      case "COUNTDOWN":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Etkinlik Başlığı" : "Event Title", lang === "tr" ? "Büyük Lansman" : "Big Launch")}
            {renderInput("targetDate", lang === "tr" ? "Hedef Tarih (Örn: 2026-12-31T23:59:59)" : "Target Date", "2026-12-31T23:59:59")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Yeni ürünümüz çok yakında sizlerle!" : "Our new product is coming soon!")}
            {renderInput("buttonUrl", lang === "tr" ? "Yönlendirme Linki (Opsiyonel)" : "Redirect URL (Optional)", "https://...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı (Opsiyonel)" : "Button Text (Optional)", lang === "tr" ? "Detaylar" : "Details")}
          </>
        );
        break;
      case "PORTFOLIO":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Benim Çalışmalarım" : "My Works")}
            {renderTextarea("description", lang === "tr" ? "Kısa Biyografi / Açıklama" : "Short Bio / Description", lang === "tr" ? "Yaratıcı tasarımcı ve geliştirici." : "Creative designer and developer.")}
            {renderInput("behanceUrl", lang === "tr" ? "Behance Profil Linki" : "Behance URL", "https://behance.net/...")}
            {renderInput("dribbbleUrl", lang === "tr" ? "Dribbble Profil Linki" : "Dribbble URL", "https://dribbble.com/...")}
            {renderInput("githubUrl", lang === "tr" ? "GitHub Profil Linki" : "GitHub URL", "https://github.com/...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Projelerime Göz At" : "View Projects")}
          </>
        );
        break;
      case "FAQ":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "S.S.S. Başlığı" : "FAQ Title", "Sıkça Sorulan Sorular")}
            {renderTextarea("questionsText", lang === "tr" ? "Sorular ve Cevaplar (Format: Soru|Cevap; Soru|Cevap;)" : "Questions & Answers (Format: Q|A; Q|A;)", "Kargo ne zaman ulaşır?|2-3 iş günü içinde.; İade var mı?|Evet, 14 gün içinde.;")}
            {renderInput("contactUrl", lang === "tr" ? "İletişim Linki" : "Contact URL", "mailto:info@domain.com")}
            {renderInput("buttonText", lang === "tr" ? "İletişim Butonu Yazısı" : "Contact Button Text", lang === "tr" ? "Bize Ulaşın" : "Contact Us")}
          </>
        );
        break;
      case "MAP":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Lokasyon Başlığı" : "Location Title", lang === "tr" ? "Bizi Ziyaret Edin" : "Visit Us")}
            {renderTextarea("address", lang === "tr" ? "Açık Adres" : "Full Address", "İstanbul, Türkiye")}
            {renderInput("googleMapsUrl", lang === "tr" ? "Google Maps Linki" : "Google Maps URL", "https://maps.app.goo.gl/...")}
            {renderInput("buttonText", lang === "tr" ? "Yol Tarifi Butonu" : "Directions Button Text", lang === "tr" ? "Yol Tarifi Al" : "Get Directions")}
          </>
        );
        break;
      case "WHATSAPP":
        specificFields = (
          <>
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", "WhatsApp İletişim")}
            {renderInput("phoneNumber", lang === "tr" ? "Telefon Numarası (Ülke kodu ile)" : "Phone Number (with country code)", "905551234567")}
            {renderTextarea("welcomeMessage", lang === "tr" ? "Karşılama Mesajı" : "Welcome Message", lang === "tr" ? "Merhaba, size nasıl yardımcı olabilirim?" : "Hello, how can I help you?")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Sohbete Başla" : "Start Chat")}
          </>
        );
        break;
      default:
        specificFields = (
          <div className="p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">
            {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
          </div>
        );
    }
    
    return (
      <div className="space-y-6">
        {addon.addonType !== "MINI_STORE" && 
         addon.addonType !== "NEO_BRUTAL" && 
         addon.addonType !== "ORGANIC" && 
         addon.addonType !== "RETRO" && 
         addon.addonType !== "ACADEMIA" && 
         addon.addonType !== "Y2K" ? renderSlugAndAvatar() : null}
        {specificFields}
      </div>
    );
  };
\`

  lines.splice(startIndex, endIndex - startIndex, newFields);
  fs.writeFileSync(path, lines.join('\\n'), 'utf-8');
  console.log("Replaced renderFields successfully!");
} else {
  console.log("Could not find start/end bounds for renderFields");
}
