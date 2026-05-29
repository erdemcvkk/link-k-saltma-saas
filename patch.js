const fs = require('fs');
let code = fs.readFileSync('src/components/addons/addon-config-modal.tsx', 'utf-8');

const imageUploadHelper = `
  const renderImageUpload = (key: string, label: string) => (
    <div className="space-y-1.5 mb-4">
      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-3">
        {configData[key] && (
          <img src={configData[key]} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-zinc-100" />
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={configData[key] || ""}
            onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 outline-none pr-24"
          />
          <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-lg cursor-pointer transition-colors">
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
                    setConfigData({ ...configData, [key]: url });
                  } catch (err: any) { alert(err.message); }
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
`;

if (!code.includes("renderImageUpload")) {
  code = code.replace(
    `  const renderTextarea = (key: string, label: string, placeholder: string) => (`,
    imageUploadHelper + `\n  const renderTextarea = (key: string, label: string, placeholder: string) => (`
  );
}

const bookingConfig = `      case "BOOKING":
        return (
          <>
            {renderImageUpload("avatarUrl", lang === "tr" ? "Profil Fotoğrafı" : "Profile Photo")}
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}
            {renderInput("calendarLink", lang === "tr" ? "Takvim/Randevu Linki (Calendly vb.)" : "Calendar Link", "https://calendly.com/yourname")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
          </>
        );`;

const qaConfig = `      case "QA":
        return (
          <>
            {renderImageUpload("avatarUrl", lang === "tr" ? "Profil Fotoğrafı" : "Profile Photo")}
            {renderInput("boxTitle", lang === "tr" ? "Soru Kutusu Başlığı" : "Box Title", lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}
            {renderTextarea("welcomeMessage", lang === "tr" ? "Hoş Geldin Mesajı" : "Welcome Message", lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "Ask anonymously.")}
            {renderInput("placeholderText", lang === "tr" ? "Kutu İçi Yer Tutucu Metin" : "Input Placeholder", lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Gönder" : "Send")}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="allowAnonymous" className="rounded" checked={configData.allowAnonymous ?? true} onChange={(e) => setConfigData({ ...configData, allowAnonymous: e.target.checked })} />
              <label htmlFor="allowAnonymous" className="text-sm font-medium text-slate-700">
                {lang === "tr" ? "Anonim sorulara izin ver" : "Allow anonymous questions"}
              </label>
            </div>
          </>
        );`;
        
const newsletterConfig = `      case "NEWSLETTER":
        return (
          <>
            {renderImageUpload("avatarUrl", lang === "tr" ? "Profil Fotoğrafı" : "Profile Photo")}
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
            {renderTextarea("incentiveMsg", lang === "tr" ? "Teşvik Mesajı" : "Incentive Message", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
            {renderInput("serviceUrl", lang === "tr" ? "Mailchimp/Revue Abonelik Linki" : "Newsletter URL", "https://mailchimp.com/...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
          </>
        );`;
        
const donationConfig = `      case "DONATION":
        return (
          <>
            {renderImageUpload("avatarUrl", lang === "tr" ? "Profil Fotoğrafı" : "Profile Photo")}
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}
            {renderTextarea("thankYouMsg", lang === "tr" ? "Açıklama / Teşekkür Mesajı" : "Description / Thank You", lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}
            {renderInput("platformUrl", lang === "tr" ? "Bağış Platformu Linki (Örn: Patreon)" : "Donation URL", "https://patreon.com/yourname")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Destek Ol" : "Support Me")}
          </>
        );`;

// Split the file into inputs block and preview block based on renderLivePreview function
const parts = code.split("const renderLivePreview = () => {");
let inputsPart = parts[0];
let previewPart = "const renderLivePreview = () => {" + parts[1];

inputsPart = inputsPart.replace(/case "BOOKING":[\s\S]*?(?=case "QA":)/, bookingConfig + "\n");
inputsPart = inputsPart.replace(/case "QA":[\s\S]*?(?=case "NEWSLETTER":|case "COUNTDOWN":)/, qaConfig + "\n");
inputsPart = inputsPart.replace(/case "NEWSLETTER":[\s\S]*?(?=case "DONATION":)/, newsletterConfig + "\n");
inputsPart = inputsPart.replace(/case "DONATION":[\s\S]*?(?=case "COUNTDOWN":)/, donationConfig + "\n");

// Replace live previews

const bookingPreview = `      case "BOOKING":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
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
        );`;
        
const qaPreview = `      case "QA":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4 transition-all">
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
        );`;
        
const newsletterPreview = `      case "NEWSLETTER":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
              {configData.avatarUrl ? (
                <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-sm" alt="Profile" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Mail className="h-8 w-8" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}</h3>
                <p className="text-sm text-slate-500 mt-1">{configData.incentiveMsg || (lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}</p>
              </div>
              <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex justify-start items-center">
                <span className="text-xs text-zinc-400">E-posta adresiniz...</span>
              </div>
              <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
                {configData.buttonText || (lang === "tr" ? "Abone Ol" : "Subscribe")}
              </div>
            </div>
          </div>
        );`;
        
const donationPreview = `      case "DONATION":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
              {configData.avatarUrl ? (
                <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-sm" alt="Profile" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}</h3>
                <p className="text-sm text-slate-500 mt-1">{configData.thankYouMsg || (lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}</p>
              </div>
              <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
                {configData.buttonText || (lang === "tr" ? "Destek Ol" : "Support Me")}
              </div>
            </div>
          </div>
        );`;

previewPart = previewPart.replace(/case "BOOKING":[\s\S]*?(?=case "QA":)/, bookingPreview + "\n");
previewPart = previewPart.replace(/case "QA":[\s\S]*?(?=case "FAQ":)/, qaPreview + "\n");
previewPart = previewPart.replace(/case "NEWSLETTER":[\s\S]*?(?=case "DONATION":)/, newsletterPreview + "\n");
previewPart = previewPart.replace(/case "DONATION":[\s\S]*?(?=case "COUNTDOWN":)/, donationPreview + "\n");

fs.writeFileSync('src/components/addons/addon-config-modal.tsx', inputsPart + previewPart, 'utf-8');
console.log("Successfully patched AddonConfigModal.tsx");
