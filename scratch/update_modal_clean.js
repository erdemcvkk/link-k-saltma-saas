const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/components/addons/addon-config-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize CRLF to LF for robust replacements
content = content.replace(/\r\n/g, '\n');

// 1. Replace Prop Types
const targetProps = `interface AddonConfigModalProps {
 addon: {
 id: string;
 addonType: string;
 isActive: boolean;
 config: string | null;
 };
 products?: any[];
 onClose: (config?: string, isActive?: boolean) => void;
 lang: string;
 username: string;
}`;

const replacementProps = `interface AddonConfigModalProps {
 addon: {
 id: string;
 addonType: string;
 isActive: boolean;
 config?: string | null;
 settings?: any;
 };
 products?: any[];
 onClose: (config?: string, isActive?: boolean) => void;
 lang: string;
 username: string;
}`;

if (content.includes(targetProps)) {
  content = content.replace(targetProps, replacementProps);
  console.log("Props replaced.");
} else {
  console.error("Target props not found.");
}

// 2. Replace state definitions
const targetStates = `  const [configData, setConfigData] = useState<any>(() => {
  try {
  return addon.config ? JSON.parse(addon.config) : {};
  } catch (e) {
  return {};
  }
  });
  const [isActive, setIsActive] = useState<boolean>(addon.isActive);`;

const replacementStates = `  const [configData, setConfigData] = useState<any>(() => {
    try {
      if (addon.settings) {
        return typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings;
      }
      return addon.config ? JSON.parse(addon.config) : {};
    } catch (e) {
      return {};
    }
  });
  const [isActive, setIsActive] = useState<boolean>(addon.isActive);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImageUrl, setNewProdImageUrl] = useState("");
  const [newProdBuyLink, setNewProdBuyLink] = useState("");`;

if (content.includes(targetStates)) {
  content = content.replace(targetStates, replacementStates);
  console.log("States replaced.");
} else {
  console.error("Target states not found.");
}

// 3. Add renderQaEditor after renderFaqEditor
const targetFaqEditorEnd = `  className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
  >
  + Soru Ekle
  </button>
  </div>
  );
  };`;

const replacementFaqEditorEnd = `  className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
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
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16 text-slate-600"
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

if (content.includes(targetFaqEditorEnd)) {
  content = content.replace(targetFaqEditorEnd, replacementFaqEditorEnd);
  console.log("Faq editor end / QA editor added.");
} else {
  console.error("Target FaqEditorEnd not found.");
}

// 4. Replace Storefront product management form in renderFields
const targetStorefrontFields = `  <div className="space-y-4">
  <div className="flex flex-wrap items-center justify-between">
  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
  <ShoppingBag className="h-4 w-4" />
  {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
  </h4>
  </div>
 
  {/* Add New Product Form */}
  <div className="p-4 md:p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
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
  } catch (err: any) { showAlert(err.message); }
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
  } catch (err: any) { showAlert(err.message); }
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
  showAlert(lang === "tr" ? "Lütfen başlık ve geçerli bir fiyat girin" : "Please enter title and valid price");
  return;
  }
  
  await addAddonProduct(title, type, price, description, fileUrl, imageUrl);
  (document.getElementById("newProdTitle") as HTMLInputElement).value = "";
  (document.getElementById("newProdPrice") as HTMLInputElement).value = "";
  (document.getElementById("newProdImageUrl") as HTMLInputElement).value = "";
  (document.getElementById("newProdFileUrl") as HTMLInputElement).value = "";
  (document.getElementById("newProdDesc") as HTMLTextAreaElement).value = "";
  showAlert(lang === "tr" ? "Ürün eklendi!" : "Product added!");
  router.refresh();
  } catch (err: any) {
  showAlert(err.message);
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
  <div key={p.id} className="flex flex-wrap items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-sm">
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
  showConfirm(lang === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure?", async () => {
  await deleteAddonProduct(p.id);
  router.refresh();
  });
  }}
  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
  >
  <Trash2 className="h-4 w-4" />
  </button>
  </div>
  ))
  )}
  </div>
  </div>`;

const replacementStorefrontFields = `  <div className="space-y-4">
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
  } catch (err: any) { showAlert(err.message); }
  }
  }}
  />
  </label>
  </div>
  </div>
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
  </div>`;

if (content.includes(targetStorefrontFields)) {
  content = content.replace(targetStorefrontFields, replacementStorefrontFields);
  console.log("Storefront fields replaced.");
} else {
  console.error("Target storefront fields not found.");
}

// 5. Replace QA under renderFields
const targetQaFields = `  case "QA":
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
  break;`;

const replacementQaFields = `  case "QA":
  specificFields = (
  <>
  {renderInput("boxTitle", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Soru & Cevap (AMA)" : "Ask Me Anything")}
  {renderQaEditor()}
  </>
  );
  break;`;

if (content.includes(targetQaFields)) {
  content = content.replace(targetQaFields, replacementQaFields);
  console.log("QA fields replaced.");
} else {
  console.error("Target QA fields not found.");
}

// 6. Replace Newsletter under renderFields
const targetNewsletterFields = `  case "NEWSLETTER":
  specificFields = (
  <>
  {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
  {renderTextarea("incentiveMsg", lang === "tr" ? "Teşvik Mesajı" : "Incentive Message", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
  {renderInput("serviceUrl", lang === "tr" ? "Mailchimp/Revue Abonelik Linki" : "Newsletter URL", "https://mailchimp.com/...")}
  {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
  </>
  );
  break;`;

const replacementNewsletterFields = `  case "NEWSLETTER":
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

if (content.includes(targetNewsletterFields)) {
  content = content.replace(targetNewsletterFields, replacementNewsletterFields);
  console.log("Newsletter fields replaced.");
} else {
  console.error("Target newsletter fields not found.");
}

// 7. Replace renderLivePreview() entirely!
const targetLivePreview = `  const renderLivePreview = () => {
  switch (addon.addonType) {
  case "MINI_STORE":
  case "NEO_BRUTAL":
  case "ORGANIC":
  case "RETRO":
  case "ACADEMIA":
  case "Y2K":
  return (
  <div className="w-full h-full relative overflow-hidden flex flex-col">
  <StorefrontPreview 
  theme={configData.theme || getDefaultTheme(addon.addonType)} 
  products={products.map(p => ({
  id: p.id,
  title: p.title,
  type: p.type,
  price: p.price.toString(),
  imageUrl: p.imageUrl || p.fileUrl,
  description: p.description || ""
  }))}
  storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
  username={configData.storeUsername}
  bio={configData.storeBio}
  avatarUrl={configData.storeAvatarUrl}
  buyButtonText={configData.buyButtonText}
  />
  </div>
  );
  // For other addons, we render a generic card that reacts to configData in real time.
  case "BOOKING":
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
  <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
  {configData.avatarUrl ? (
  <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-md" alt="Profile" />
  ) : (
  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
  <Calendar className="h-8 w-8" />
  </div>
  )}
  <div>
  <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}</h3>
  <p className="text-sm text-slate-500 mt-1">{configData.description || (lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}</p>
  </div>
  <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
  {configData.buttonText || (lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
  </div>
  </div>
  </div>
  );
  case "QA":
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
  <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4 transition-all">
  <div className="flex items-center gap-3">
  {configData.avatarUrl ? (
  <img src={configData.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" alt="Profile" />
  ) : (
  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
  <FileQuestion className="h-6 w-6" />
  </div>
  )}
  <h3 className="font-bold text-slate-800">{configData.boxTitle || (lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}</h3>
  </div>
  <p className="text-sm text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
  {configData.welcomeMessage || (lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "Ask anonymously.")}
  </p>
  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 h-24">
  <span className="text-xs text-zinc-400">{configData.placeholderText || (lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question...")}</span>
  </div>
  <div className="w-full py-3 rounded-xl bg-slate-900 text-white text-center font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
  {configData.buttonText || (lang === "tr" ? "Gönder" : "Send")}
  </div>
  </div>
  </div>
  );
case "FAQ":
  return (
  <div className="w-full h-full bg-zinc-50 flex flex-col pt-16 px-4">
  <h3 className="font-black text-2xl text-slate-800 mb-6 px-2">{configData.title || (lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ")}</h3>
  <div className="space-y-3 w-full">
  {(configData.faqPairs && configData.faqPairs.length > 0) ? (
  configData.faqPairs.map((p: any, idx: number) => (
  <div key={idx} className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">{p.q || "Soru?"}</h4>
  <p className="text-xs text-slate-500">{p.a || "Cevap..."}</p>
  </div>
  ))
  ) : (
  <div className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">Soru Örneği?</h4>
  <p className="text-xs text-slate-500">Cevap Örneği...</p>
  </div>
  )}
  </div>
  </div>
  );
  default:
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6 text-center">
  <div className="space-y-4">
  <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
  {icon}
  </div>
  <div>
  <h3 className="font-bold text-xl text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
  <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
  {lang === "tr" ? "Bu eklenti için canlı önizleme şu an desteklenmiyor, ancak ayarlarınız kaydedilecektir." : "Live preview not supported yet, but your settings will be saved."}
  </p>
  </div>
  </div>
  </div>
  );
  }
  };`;

const replacementLivePreview = `  const renderLivePreview = () => {
  switch (addon.addonType) {
  case "MINI_STORE":
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
  products={((configData.products && Array.isArray(configData.products)) ? configData.products : products).map((p: any) => ({
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
  case "NEWSLETTER":
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
  case "BOOKING":
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
  <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
  {configData.avatarUrl ? (
  <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-md" alt="Profile" />
  ) : (
  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
  <Calendar className="h-8 w-8" />
  </div>
  )}
  <div>
  <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}</h3>
  <p className="text-sm text-slate-500 mt-1">{configData.description || (lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}</p>
  </div>
  <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
  {configData.buttonText || (lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
  </div>
  </div>
  </div>
  );
  case "QA":
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
            <h3 className="font-bold text-slate-800">{configData.boxTitle || (lang === "tr" ? "Soru & Cevap (AMA)" : "Ask me anything!")}</h3>
          </div>
          {qaPairs.length > 0 ? (
            <div className="space-y-2.5 w-full">
              {qaPairs.map((p: any, idx: number) => (
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
  }
  case "FAQ":
  return (
  <div className="w-full h-full bg-zinc-50 flex flex-col pt-16 px-4">
  <h3 className="font-black text-2xl text-slate-800 mb-6 px-2">{configData.title || (lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ")}</h3>
  <div className="space-y-3 w-full">
  {(configData.faqPairs && configData.faqPairs.length > 0) ? (
  configData.faqPairs.map((p: any, idx: number) => (
  <div key={idx} className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">{p.q || "Soru?"}</h4>
  <p className="text-xs text-slate-500">{p.a || "Cevap..."}</p>
  </div>
  ))
  ) : (
  <div className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">Soru Örneği?</h4>
  <p className="text-xs text-slate-500">Cevap Örneği...</p>
  </div>
  )}
  </div>
  </div>
  );
  default:
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6 text-center">
  <div className="space-y-4">
  <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
  {icon}
  </div>
  <div>
  <h3 className="font-bold text-xl text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
  <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
  {lang === "tr" ? "Bu eklenti için canlı önizleme şu an desteklenmiyor, ancak ayarlarınız kaydedilecektir." : "Live preview not supported yet, but your settings will be saved."}
  </p>
  </div>
  </div>
  </div>
  );
  }
  };`;

if (content.includes(targetLivePreview)) {
  content = content.replace(targetLivePreview, replacementLivePreview);
  console.log("Live preview replaced.");
} else {
  console.error("Target live preview not found.");
}

// Write the clean modified code back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log("Clean update script executed successfully.");
