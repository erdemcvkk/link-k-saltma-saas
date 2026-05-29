const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

const oldButtonLogic = `<a href={\`/\${initialUser.username}/store\`} target="_blank" className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                      {lang === "tr" ? "Mağazayı İncele" : "Visit Store"}
                    </a>`;

const newButtonLogic = `{(() => {
                      const activeAddon = addons.find(a => a.isActive);
                      const getDefaultSlug = (type: string) => {
                        if (type === "MINI_STORE" || type === "NEO_BRUTAL" || type === "ORGANIC" || type === "RETRO" || type === "ACADEMIA" || type === "Y2K") return "store";
                        if (type === "BOOKING") return "booking";
                        if (type === "NEWSLETTER") return "newsletter";
                        if (type === "QA") return "qa";
                        if (type === "DONATION") return "donation";
                        return type.toLowerCase();
                      };
                      let addonLink = \`/\${initialUser.username}/store\`;
                      let btnText = lang === "tr" ? "Mağazayı İncele" : "Visit Store";
                      
                      if (activeAddon) {
                        try {
                          const config = activeAddon.config ? JSON.parse(activeAddon.config) : {};
                          addonLink = \`/\${initialUser.username}/\${(config.customSlug || getDefaultSlug(activeAddon.addonType)).toLowerCase()}\`;
                          if (activeAddon.addonType === "BOOKING") btnText = lang === "tr" ? "Randevu Sayfası" : "Booking Page";
                          if (activeAddon.addonType === "NEWSLETTER") btnText = lang === "tr" ? "Bülten Sayfası" : "Newsletter Page";
                          if (activeAddon.addonType === "QA") btnText = lang === "tr" ? "Soru-Cevap Sayfası" : "Q&A Page";
                          if (activeAddon.addonType === "DONATION") btnText = lang === "tr" ? "Bağış Sayfası" : "Donation Page";
                        } catch(e) {}
                      }

                      return (
                        <a href={addonLink} target="_blank" className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                          {btnText}
                        </a>
                      );
                    })()}`;

if (code.includes(oldButtonLogic)) {
  code = code.replace(oldButtonLogic, newButtonLogic);
  fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', code, 'utf-8');
  console.log("Patched dashboard-client.tsx for dynamic addon links");
} else {
  // Try to find the exact string it's using if it varies slightly
  console.log("Could not find the exact oldButtonLogic string.");
}
