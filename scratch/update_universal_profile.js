const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'universal-profile.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Replace the renderAddonBlockHelper invocation in UniversalProfile
const searchCall = /\{addons\.map\(\(addon: any\) => renderAddonBlockHelper\(addon, currentStyles\.cardBg, currentStyles\.btnClass, isDark, products\)\)\}/;
const replacementCall = `{addons.map((addon: any) => renderAddonBlockHelper(addon, currentStyles.cardBg, currentStyles.btnClass, isDark, products, username, isCompactMode))}`;

if (searchCall.test(content)) {
  content = content.replace(searchCall, replacementCall);
  console.log("Updated renderAddonBlockHelper call in UniversalProfile.");
} else {
  console.log("Error: renderAddonBlockHelper call not found!");
}

// 2. Replace the entire renderAddonBlockHelper function
const searchFunction = /function renderAddonBlockHelper\(addon: any, cardBg: string, btnClass: string, isDark: boolean, products: any\[\]\) \{[^]*?\}\s*$/;

const replacementFunction = `function renderAddonBlockHelper(addon: any, cardBg: string, btnClass: string, isDark: boolean, products: any[], username: string, isCompactMode: boolean) {
  let configData: any = {};
  if (addon.settings) {
    configData = typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings;
  }

  const type = addon.addonType;

  const cardClassName = \`p-4 w-full rounded-2xl border backdrop-blur-md flex flex-col gap-3 text-left \${cardBg}\`;
  const btnClassName = \`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all \${btnClass}\`;
  
  const getSlug = (t: string, config: any) => {
    if (config.customSlug) return config.customSlug;
    if (t === "MINI_STORE") return "store";
    if (t === "NEO_BRUTAL") return "neo-brutal";
    if (t === "ORGANIC") return "organic";
    if (t === "RETRO") return "retro";
    if (t === "ACADEMIA") return "academia";
    if (t === "Y2K") return "y2k";
    if (t === "BOOKING") return "booking";
    if (t === "NEWSLETTER") return "newsletter";
    if (t === "QA") return "qa";
    if (t === "DONATION") return "donation";
    if (t === "PREMIUM_CREATOR") return "creator-store";
    if (t === "PREMIUM_VIDEO") return "masterclass";
    return t.toLowerCase();
  };

  const CardWrapper = ({ children, slug }: { children: React.ReactNode, slug: string }) => {
    const href = \`/@\${username}/\${slug.toLowerCase()}\`;
    if (isCompactMode) {
      return <div className={cardClassName}>{children}</div>;
    }
    return (
      <a href={href} className={cardClassName + " transition-transform hover:scale-[1.01] block cursor-pointer"}>
        {children}
      </a>
    );
  };

  switch (type) {
    case "BOOKING":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || (isDark ? "Book a 1:1 Call" : "Birebir Görüşme Ayarla")}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Sizinle tanışmak için sabırsızlanıyorum."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Takvimi Görüntüle"}
          </div>
        </CardWrapper>
      );
    case "QA":
      {
        const qaPairs = configData.qaPairs || [];
        return (
          <div key={addon.id} className={cardClassName}>
            <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{configData.boxTitle || "Soru & Cevap (AMA)"}</h4>
              </div>
              {!isCompactMode && (
                <a href={\`/@\${username}/\${getSlug(type, configData)}\`} className="text-slate-400 hover:text-slate-600 transition-colors" title="Detaylar">
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            {qaPairs.length > 0 ? (
              <div className="space-y-2.5 w-full">
                {qaPairs.map((p: any, idx: number) => (
                  <details key={idx} className="group border border-slate-100 rounded-xl bg-black/5 p-3 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                      <span className="text-xs font-bold text-slate-855 pr-4">{p.q || "Soru"}</span>
                      <span className="transition group-open:rotate-180 text-slate-400 shrink-0">
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-xs text-slate-650 mt-2 pl-1 leading-relaxed border-t border-black/5 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">
                {isDark ? "No questions or answers yet." : "Henüz soru ve cevap bulunmuyor."}
              </p>
            )}
          </div>
        );
      }
    case "DONATION":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bana Kahve Ismarla"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.thankYouMsg || "Desteğiniz için teşekkürler!"}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Destek Ol"}
          </div>
        </CardWrapper>
      );
    case "NEWSLETTER":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Haftalık Bülten"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
            </div>
          </div>
          <div className="w-full bg-black/5 border border-black/10 rounded-lg p-2 h-10 flex items-center">
            <span className="text-xs opacity-45">email@example.com</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Abone Ol"}
          </div>
        </CardWrapper>
      );
    case "PREMIUM_VIDEO":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="w-full aspect-video rounded-xl bg-zinc-900 overflow-hidden relative border border-white/5">
            {configData.coverUrl ? (
              <img src={configData.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-650">
                <Play className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <span className="ml-1">▶</span>
              </div>
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Premium Video"}</h4>
          <p className="text-xs opacity-70">{configData.description || "Video açıklaması."}</p>
          <div className={btnClassName}>
            {configData.buttonText || "Tamamını İzle"}
          </div>
        </CardWrapper>
      );
    case "COUNTDOWN":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "Geri Sayım"}</h4>
          </div>
          <p className="text-xs opacity-70">{configData.description}</p>
          <div className="grid grid-cols-4 gap-2 w-full">
            {['14', '08', '45', '22'].map((val, i) => (
              <div key={i} className="bg-black/10 rounded-lg py-2 flex flex-col items-center">
                <span className="text-sm font-bold font-mono">{val}</span>
                <span className="text-[8px] opacity-60">{['Gün', 'Saat', 'Dk', 'Sn'][i]}</span>
              </div>
            ))}
          </div>
          {configData.buttonText && (
            <div className={btnClassName}>
              {configData.buttonText}
            </div>
          )}
        </CardWrapper>
      );
    case "FAQ":
      {
        const qas = (configData.questionsText || "Soru Örneği?|Cevap Örneği.;")
          .split(';')
          .map((pair: string) => pair.split('|'))
          .filter((pair: string[]) => pair.length === 2 && pair[0].trim() !== "");
        return (
          <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "FAQ"}</h4>
            <div className="space-y-2 w-full">
              {qas.map(([q, a]: [string, string], i: number) => (
                <div key={i} className="bg-black/5 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-800">{q.trim()}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">{a.trim()}</p>
                </div>
              ))}
            </div>
            {configData.contactUrl && (
              <div className={btnClassName}>
                {configData.buttonText || "Bize Ulaşın"}
              </div>
            )}
          </CardWrapper>
        );
      }
    case "MAP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bizi Ziyaret Edin"}</h4>
          <div className="bg-black/5 p-2 rounded-lg flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <span className="text-xs truncate">{configData.address || "İstanbul, Türkiye"}</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Yol Tarifi Al"}
          </div>
        </CardWrapper>
      );
    case "WHATSAPP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "WhatsApp İletişim"}</h4>
          <p className="text-xs opacity-70 bg-green-500/5 p-2 rounded-lg border border-green-500/10 text-green-600">
            {configData.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}
          </p>
          <div className={btnClassName}>
            {configData.buttonText || "Sohbete Başla"}
          </div>
        </CardWrapper>
      );
    case "MINI_STORE":
    case "NEO_BRUTAL":
    case "ORGANIC":
    case "RETRO":
    case "ACADEMIA":
    case "Y2K":
    case "PREMIUM_CREATOR":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.storeTitle || "Dijital Mağaza"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.storeBio || "Ürünlerimi incelemek için tıklayın."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buyButtonText || "Mağazayı Gör"}
          </div>
        </CardWrapper>
      );
    default:
      return null;
  }
}
`;

if (content.includes("function renderAddonBlockHelper")) {
  content = content.replace(searchFunction, replacementFunction);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced renderAddonBlockHelper function in universal-profile.tsx!");
} else {
  console.log("Error: renderAddonBlockHelper not matched!");
}
