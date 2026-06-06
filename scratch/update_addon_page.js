const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', '[username]', '[addonSlug]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Replace Storefront case
const searchStorefront = /if\s*\(matchingAddon\.addonType\s*===\s*"MINI_STORE"[^]*?buyButtonText=\{parsedConfig\.buyButtonText\s*\|\|\s*"Satın Al"\}\s*\/>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const replacementStorefront = `if (matchingAddon.addonType === "MINI_STORE" || 
  matchingAddon.addonType === "NEO_BRUTAL" || 
  matchingAddon.addonType === "ORGANIC" || 
  matchingAddon.addonType === "RETRO" || 
  matchingAddon.addonType === "ACADEMIA" || 
  matchingAddon.addonType === "Y2K" ||
  matchingAddon.addonType === "PREMIUM_CREATOR") {
    
    const displayProducts = (parsedConfig.products && Array.isArray(parsedConfig.products) && parsedConfig.products.length > 0)
      ? parsedConfig.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          type: p.type || "PRODUCT",
          price: p.price?.toString() || "0",
          imageUrl: p.imageUrl || null,
          description: p.description || "",
          buyLink: p.buyLink || ""
        }))
      : (await db.product.findMany({
          where: { userId: user.id, isActive: true },
          orderBy: { createdAt: "desc" },
        })).map(p => ({
          id: p.id,
          title: p.title,
          type: p.type,
          price: p.price.toString(),
          imageUrl: p.imageUrl || p.fileUrl,
          description: p.description || "",
          buyLink: ""
        }));

    return (
      <div className="w-full min-h-screen bg-zinc-100 flex justify-center">
        <div className="w-full max-w-full md:w-[480px] min-h-screen relative shadow-2xl overflow-hidden bg-white">
          <StorefrontPreview 
            theme={parsedConfig.theme || getDefaultTheme(matchingAddon.addonType)} 
            onProductClick={undefined}
            products={displayProducts} 
            storeTitle={parsedConfig.storeTitle || user.username || "Mağazam"}
            storeCoverUrl={parsedConfig.storeCoverUrl || user.profile.background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"}
            avatarUrl={parsedConfig.storeAvatarUrl || user.profile.avatarUrl}
            username={parsedConfig.storeUsername || ("@" + user.username)}
            bio={parsedConfig.storeBio || user.profile.bio}
            buyButtonText={parsedConfig.buyButtonText || "Satın Al"}
          />
        </div>
      </div>
    );
  }`;

// 2. Replace QA case
const searchQA = /if\s*\(matchingAddon\.addonType\s*===\s*"QA"\)\s*\{[^]*?\{parsedConfig\.buttonText\s*\|\|\s*"Gönder"\}\s*<\/button>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const replacementQA = `if (matchingAddon.addonType === "QA") {
    const qaPairs = parsedConfig.qaPairs || [];
    return (
      <div className="w-full min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col">
          <div className="flex flex-col items-center text-center mb-6">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full object-cover shadow-sm mb-4" alt="Profile" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <span className="text-xl md:text-3xl">❓</span>
              </div>
            )}
            <h1 className="text-2xl font-black text-slate-800">{parsedConfig.boxTitle || "Soru & Cevap (AMA)"}</h1>
          </div>
          
          {qaPairs.length > 0 ? (
            <div className="space-y-3 w-full">
              {qaPairs.map((p: any, idx: number) => (
                <details key={idx} className="group border border-zinc-150 rounded-2xl bg-zinc-50 p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <span className="text-sm font-bold text-slate-800 pr-4">{p.q || "Soru"}</span>
                    <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" className="h-4 w-4"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-xs text-slate-650 mt-3 pl-1 leading-relaxed border-t border-zinc-200/60 pt-3 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-6">
              Henüz soru ve cevap eklenmemiş.
            </p>
          )}
        </div>
      </div>
    );
  }`;

let updated = false;

if (searchStorefront.test(content)) {
  content = content.replace(searchStorefront, replacementStorefront);
  updated = true;
  console.log("Storefront subpage layout scheduled.");
} else {
  console.log("Error: Storefront subpage layout regex not matched!");
}

if (searchQA.test(content)) {
  content = content.replace(searchQA, replacementQA);
  updated = true;
  console.log("QA subpage layout scheduled.");
} else {
  console.log("Error: QA subpage layout regex not matched!");
}

if (updated) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully wrote changes to standalone [addonSlug]/page.tsx!");
}
