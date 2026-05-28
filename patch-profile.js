const fs = require('fs');
const path = 'src/app/[username]/profile-client.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import StorefrontPreview')) {
  content = content.replace(
    'import GlobalOverlayManager from',
    'import StorefrontPreview from "@/components/storefront-preview";\nimport GlobalOverlayManager from'
  );
}

const addonRenderBlock = `
        {/* Addons Grid */}
        {addons.length > 0 && (
          <div className="space-y-6 w-full">
            <h3 className={\`text-xs uppercase tracking-widest font-bold mb-2 \${isDark ? "text-zinc-500" : "text-zinc-400"}\`}>
              {lang === "tr" ? "Öne Çıkanlar" : "Highlights"}
            </h3>
            {addons.map(addon => {
              let parsedConfig = { theme: 'classic' };
              try { if(addon.config) parsedConfig = JSON.parse(addon.config); } catch(e){}
              
              if (addon.addonType === "MINI_STORE") {
                return (
                  <div key={addon.id} className="relative w-full h-[500px] bg-[#f8f9fa] rounded-[2rem] overflow-hidden border border-zinc-200 shadow-xl">
                    <StorefrontPreview 
                      theme={parsedConfig.theme as any} 
                      products={products.map(p => ({
                        id: p.id,
                        title: p.title,
                        type: p.type,
                        price: p.price.toString(),
                        imageUrl: p.fileUrl,
                        description: p.description || ""
                      }))} 
                      storeTitle={storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
                      storeCoverUrl={storeCoverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"}
                    />
                  </div>
                );
              }

              // Placeholder for other addons
              return (
                <div key={addon.id} className={\`p-6 rounded-[2rem] border \${currentStyles.cardBg} flex flex-col items-center justify-center text-center gap-3\`}>
                  <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center \${currentStyles.btnClass}\`}>
                    <Zap className="h-6 w-6" />
                  </div>
                  <h4 className={\`font-bold \${currentStyles.glowText}\`}>{addon.addonType} Modülü</h4>
                  <p className={\`text-xs \${isDark ? "text-zinc-400" : "text-zinc-500"}\`}>Bu eklentinin içeriği yapılandırılıyor...</p>
                </div>
              );
            })}
          </div>
        )}
`;

if (!content.includes('addons.map(addon =>')) {
  // Insert addons render block after Links Grid
  content = content.replace(
    '{/* Links Grid */}',
    addonRenderBlock + '\n\n        {/* Links Grid */}'
  );
}

fs.writeFileSync(path, content);
console.log('ProfileClient patched.');
