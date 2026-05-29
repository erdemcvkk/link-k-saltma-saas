const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[addonSlug]/page.tsx', 'utf-8');

const additionalAddons = `
  if (matchingAddon.addonType === "BOOKING") {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
          {parsedConfig.avatarUrl ? (
            <img src={parsedConfig.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-md mb-6" alt="Profile" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <span className="text-3xl">📅</span>
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Birebir Görüşme Ayarla"}</h1>
          <p className="text-slate-500 mb-8">{parsedConfig.description || "Sizinle tanışmak için sabırsızlanıyorum."}</p>
          <a href={parsedConfig.calendarLink || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
            {parsedConfig.buttonText || "Takvimi Görüntüle"}
          </a>
        </div>
      </div>
    );
  }

  if (matchingAddon.addonType === "QA") {
    return (
      <div className="w-full min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl flex flex-col">
          <div className="flex flex-col items-center text-center mb-8">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full object-cover shadow-sm mb-4" alt="Profile" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <span className="text-3xl">❓</span>
              </div>
            )}
            <h1 className="text-2xl font-black text-slate-800">{parsedConfig.boxTitle || "Bana Soru Sor!"}</h1>
            <p className="text-slate-500 mt-2 bg-amber-50/50 p-4 rounded-2xl">{parsedConfig.welcomeMessage || "Sorularınızı anonim olarak sorabilirsiniz."}</p>
          </div>
          <textarea className="w-full min-h-[120px] p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all resize-none mb-4" placeholder={parsedConfig.placeholderText || "Sorunuzu buraya yazın..."}></textarea>
          <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
            {parsedConfig.buttonText || "Gönder"}
          </button>
        </div>
      </div>
    );
  }

  if (matchingAddon.addonType === "NEWSLETTER") {
    return (
      <div className="w-full min-h-screen bg-indigo-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
          {parsedConfig.avatarUrl ? (
            <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full object-cover shadow-sm mb-6" alt="Profile" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-6">
              <span className="text-3xl">✉️</span>
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Haftalık Bülten"}</h1>
          <p className="text-slate-500 mb-8">{parsedConfig.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
          <form action={parsedConfig.serviceUrl || "#"} method="POST" target="_blank" className="w-full flex flex-col gap-3">
            <input type="email" required placeholder="E-posta adresiniz..." className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-center" />
            <button type="submit" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
              {parsedConfig.buttonText || "Abone Ol"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (matchingAddon.addonType === "DONATION") {
    return (
      <div className="w-full min-h-screen bg-pink-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
          {parsedConfig.avatarUrl ? (
            <img src={parsedConfig.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-md mb-6" alt="Profile" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-6">
              <span className="text-3xl">☕</span>
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Bana Kahve Ismarla"}</h1>
          <p className="text-slate-500 mb-8">{parsedConfig.thankYouMsg || "Desteğiniz için teşekkürler!"}</p>
          <a href={parsedConfig.platformUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
            {parsedConfig.buttonText || "Destek Ol"}
          </a>
        </div>
      </div>
    );
  }

  // Fallback for other addon types`;

code = code.replace(`  // Fallback for other addon types`, additionalAddons);

fs.writeFileSync('src/app/[username]/[addonSlug]/page.tsx', code, 'utf-8');
console.log("Successfully patched page.tsx");
