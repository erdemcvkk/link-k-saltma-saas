const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'addons', 'addon-config-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. New states
const statesRegex = /const\s+\[isActive,\s*setIsActive\]\s*=\s*useState<boolean>\(addon\.isActive\);/;
const replacementStates = `const [isActive, setIsActive] = useState<boolean>(addon.isActive);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImageUrl, setNewProdImageUrl] = useState("");
  const [newProdBuyLink, setNewProdBuyLink] = useState("");`;

if (statesRegex.test(content)) {
  content = content.replace(statesRegex, replacementStates);
  console.log("States replaced successfully.");
} else {
  console.log("Error: States regex not matched.");
}

// 2. Q&A Editor function
const faqEndRegex = /className="w-full py-3 md:py-2\.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"\s*>\s*\+\s*Soru\s+Ekle\s*<\/button>\s*<\/div>\s*\);\s*\};/;
const replacementQaEditor = `className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
  >
  + Soru Ekle
  </button>
  </div>
  );
  };

  const renderQaEditor = () => {
    const pairs = configData.qaPairs || [];
    return (
      <div className="space-y-3 mt-4">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Soru & Cevap Akordiyon Listesi" : "Q&A Accordion List"}
        </label>
        {pairs.map((p, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group">
            <button
              type="button"
              onClick={() => {
                const newPairs = [...pairs];
                newPairs.splice(idx, 1);
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <input
              type="text"
              placeholder={lang === "tr" ? "Soru Metni" : "Question"}
              value={p.q || ""}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx] = { ...newPairs[idx], q: e.target.value };
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none mb-2 text-slate-800"
            />
            <textarea
              placeholder={lang === "tr" ? "Cevap Metni" : "Answer"}
              value={p.a || ""}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx] = { ...newPairs[idx], a: e.target.value };
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16 text-slate-650"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newPairs = [...pairs, { q: "", a: "" }];
            setConfigData({ ...configData, qaPairs: newPairs });
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Soru Ekle" : "Add New Question"}</span>
        </button>
      </div>
    );
  };`;

if (faqEndRegex.test(content)) {
  content = content.replace(faqEndRegex, replacementQaEditor);
  console.log("FAQ editor end regex matched and QA editor inserted.");
} else {
  console.log("Error: FAQ editor end regex not matched.");
}

// 3. Storefront products editor inside renderFields
const storefrontFormRegex = /<\s*div\s+className="space-y-4">\s*<\s*div\s+className="flex flex-wrap items-center justify-between">\s*<\s*h4\s+className="text-sm font-bold text-slate-800 flex items-center gap-2">[^]*?break;\s*(?=case\s+"BOOKING":)/;

const replacementStorefrontForm = `<div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between">
      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        {lang === "tr" ? "Ürün Yönetimi (Dinamik)" : "Product Management (Dynamic)"}
      </h4>
    </div>

    {/* Add New Product Form */}
    <div className="p-4 md:p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
      <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
      </h5>
      <div className="space-y-3">
        <input 
          type="text" 
          value={newProdTitle}
          onChange={(e) => setNewProdTitle(e.target.value)}
          placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} 
          className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
        />
        <div className="flex gap-2">
          <input 
            type="number" 
            value={newProdPrice}
            onChange={(e) => setNewProdPrice(e.target.value)}
            placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} 
            className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
          />
        </div>
        
        {/* Product Image URL with Upload Button */}
        <div className="flex gap-2">
          <div className="w-full flex gap-1 relative">
            <input 
              type="text" 
              value={newProdImageUrl}
              onChange={(e) => setNewProdImageUrl(e.target.value)}
              placeholder={lang === "tr" ? "Ürün Görseli (URL)" : "Product Image (URL)"} 
              className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" 
            />
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
                      setNewProdImageUrl(url);
                    } catch (err) { showAlert(err.message); }
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Purchase Link (Stripe, Shopier, etc.) */}
        <input 
          type="text" 
          value={newProdBuyLink}
          onChange={(e) => setNewProdBuyLink(e.target.value)}
          placeholder={lang === "tr" ? "Satın Alma Linki (Stripe/Shopier vb.)" : "Purchase Link (Stripe/Shopier, etc.)"} 
          className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
        />

        <button 
          type="button"
          onClick={() => {
            if (!newProdTitle || !newProdPrice) {
              showAlert(lang === "tr" ? "Lütfen başlık ve fiyat girin" : "Please enter title and price");
              return;
            }
            
            const newProduct = {
              id: Date.now().toString(),
              title: newProdTitle,
              price: parseFloat(newProdPrice) || 0,
              imageUrl: newProdImageUrl || null,
              buyLink: newProdBuyLink || "",
              type: "PRODUCT"
            };

            const currentProducts = configData.products || [];
            setConfigData({
              ...configData,
              products: [...currentProducts, newProduct]
            });

            // Reset fields
            setNewProdTitle("");
            setNewProdPrice("");
            setNewProdImageUrl("");
            setNewProdBuyLink("");
            showAlert(lang === "tr" ? "Ürün eklendi!" : "Product added!");
          }}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          {lang === "tr" ? "Ürünü Listeye Ekle" : "Add Product to List"}
        </button>
      </div>
    </div>

    {/* Product List */}
    <div className="space-y-3">
      {(!configData.products || configData.products.length === 0) ? (
        <div className="text-center py-6 text-slate-500 text-sm">
          {lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}
        </div>
      ) : (
        configData.products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-5 h-5 m-auto mt-3.5 text-zinc-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600">{p.price}₺</span>
                  {p.buyLink && (
                    <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">{p.buyLink}</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => {
                const newProducts = (configData.products || []).filter((prod) => prod.id !== p.id);
                setConfigData({ ...configData, products: newProducts });
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
  break;`;

if (storefrontFormRegex.test(content)) {
  content = content.replace(storefrontFormRegex, replacementStorefrontForm);
  console.log("Storefront form replaced successfully.");
} else {
  console.log("Error: Storefront form regex not matched.");
}

// 4. QA Case block inside renderFields
const qaCaseRegex = /case\s+"QA":\s*specificFields[^]*?break;\s*(?=case\s+"PREMIUM_VIDEO":)/;
const replacementQaCase = `case "QA":
  specificFields = (
  <>
  {renderInput("boxTitle", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Soru & Cevap (AMA)" : "Ask Me Anything")}
  {renderQaEditor()}
  </>
  );
  break;`;

if (qaCaseRegex.test(content)) {
  content = content.replace(qaCaseRegex, replacementQaCase);
  console.log("QA case block replaced successfully.");
} else {
  console.log("Error: QA case block regex not matched.");
}

// 5. Newsletter Case block inside renderFields
const newsletterCaseRegex = /case\s+"NEWSLETTER":\s*specificFields[^]*?break;\s*(?=case\s+"DONATION":)/;
const replacementNewsletterCase = `case "NEWSLETTER":
  specificFields = (
  <>
  {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
  {renderTextarea("incentiveMsg", lang === "tr" ? "Açıklama Metni" : "Description", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
  <div className="space-y-1.5 mb-4">
    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
      {lang === "tr" ? "Abonelik Tipi" : "Subscription Type"}
    </label>
    <select
      value={configData.integrationType || "MAILCHIMP"}
      onChange={(e) => setConfigData({ ...configData, integrationType: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
    >
      <option value="MAILCHIMP">{lang === "tr" ? "Yönlendirme Linki (Mailchimp, Substack vb.)" : "Redirect Link (Mailchimp, Substack, etc.)"}</option>
      <option value="DIRECT">{lang === "tr" ? "Doğrudan Veritabanına Kayıt (Simüle Edilir)" : "Direct Database Registration (Simulated)"}</option>
    </select>
  </div>
  {(configData.integrationType || "MAILCHIMP") === "MAILCHIMP" && renderInput("serviceUrl", lang === "tr" ? "Yönlendirme Linki (Mailchimp vb.)" : "Redirect URL", "https://mailchimp.com/...")}
  {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
  </>
  );
  break;`;

if (newsletterCaseRegex.test(content)) {
  content = content.replace(newsletterCaseRegex, replacementNewsletterCase);
  console.log("Newsletter case block replaced successfully.");
} else {
  console.log("Error: Newsletter case block regex not matched.");
}

// 6. Storefront inside renderLivePreview
const storefrontPreviewRegex = /case\s+"MINI_STORE":[^]*?StorefrontPreview[^]*?\/>\s*<\/div>\s*\);\s*(?=\/\/\s*For\s+other\s+addons|\s*case\s+"BOOKING":)/;
const replacementStorefrontPreview = `case "MINI_STORE":
  case "NEO_BRUTAL":
  case "ORGANIC":
  case "RETRO":
  case "ACADEMIA":
  case "Y2K":
  case "PREMIUM_CREATOR":
  return (
  <div className="w-full h-full relative overflow-hidden flex flex-col">
  <StorefrontPreview 
  theme={configData.theme || getDefaultTheme(addon.addonType)} 
  products={((configData.products && Array.isArray(configData.products)) ? configData.products : products).map((p) => ({
  id: p.id,
  title: p.title,
  type: p.type || "PRODUCT",
  price: p.price.toString(),
  imageUrl: p.imageUrl || p.fileUrl,
  description: p.description || "",
  buyLink: p.buyLink || ""
  }))}
  storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
  username={configData.storeUsername}
  bio={configData.storeBio}
  avatarUrl={configData.storeAvatarUrl}
  buyButtonText={configData.buyButtonText}
  />
  </div>
  );
  `;

if (storefrontPreviewRegex.test(content)) {
  content = content.replace(storefrontPreviewRegex, replacementStorefrontPreview);
  console.log("Storefront live preview replaced successfully.");
} else {
  console.log("Error: Storefront live preview regex not matched.");
}

// 7. QA inside renderLivePreview
const qaPreviewRegex = /case\s+"QA":\s*return\s*\(\s*<div\s+className="w-full h-full[^]*?\{configData\.buttonText\s*\|\|\s*\(lang\s*===\s*"tr"\s*\?\s*"Gönder"\s*:\s*"Send"\)\}[^]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*(?=case\s+"FAQ":)/;
const replacementQaPreview = `case "QA":
  {
    const qaPairs = configData.qaPairs || [];
    return (
      <div className="w-full h-full bg-zinc-50 flex flex-col p-4 overflow-y-auto no-scrollbar">
        <div className="w-full p-4 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-3">
            {configData.avatarUrl ? (
              <img src={configData.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" alt="Profile" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <FileQuestion className="h-6 w-6" />
              </div>
            )}
            <h3 className="font-bold text-slate-800">{configData.boxTitle || "Soru & Cevap (AMA)"}</h3>
          </div>
          {qaPairs.length > 0 ? (
            <div className="space-y-2.5 w-full">
              {qaPairs.map((p, idx) => (
                <details key={idx} className="group border border-zinc-100 rounded-xl bg-zinc-50 p-3 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <span className="text-xs font-bold text-slate-800 pr-4">{p.q || "Soru"}</span>
                    <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-[11px] text-slate-655 mt-2 pl-0.5 leading-relaxed border-t border-zinc-100 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-4">
              {lang === "tr" ? "Henüz soru ve cevap eklenmemiş." : "No questions or answers yet."}
            </p>
          )}
        </div>
      </div>
    );
  }`;

if (qaPreviewRegex.test(content)) {
  content = content.replace(qaPreviewRegex, replacementQaPreview);
  console.log("QA live preview replaced successfully.");
} else {
  console.log("Error: QA live preview regex not matched.");
}

// 8. Insert Newsletter inside renderLivePreview
const bookingPreviewRegex = /case\s+"BOOKING":/;
const replacementNewsletterPreview = `case "NEWSLETTER":
  return (
    <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
      <div className="w-full p-4 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1 text-xl">
          ✉️
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}</h3>
          <p className="text-xs text-slate-500 mt-1">{configData.incentiveMsg || (lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}</p>
        </div>
        <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-left text-xs text-zinc-400">
          email@example.com
        </div>
        <div className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md text-center">
          {configData.buttonText || (lang === "tr" ? "Abone Ol" : "Subscribe")}
        </div>
      </div>
    </div>
  );

  case "BOOKING":`;

if (bookingPreviewRegex.test(content)) {
  content = content.replace(bookingPreviewRegex, replacementNewsletterPreview);
  console.log("Newsletter live preview inserted successfully.");
} else {
  console.log("Error: Booking live preview regex not matched.");
}

// Save file
fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully.");
