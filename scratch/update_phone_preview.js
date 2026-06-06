const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'dashboard', 'phone-preview.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

const targetQA = `    // 3. QA Addon
    if (type === "QA") {
      return (
        <div className="w-full h-full bg-amber-50/20 flex items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col">
            <div className="flex flex-col items-center text-center mb-4">
              {parsedConfig.avatarUrl ? (
                <img src={parsedConfig.avatarUrl} className="w-12 h-12 rounded-full object-cover shadow-sm mb-2" alt="Profile" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2 text-xl">
                  ❓
                </div>
              )}
              <h1 className="text-sm font-black text-slate-800">{parsedConfig.boxTitle || "Bana Soru Sor!"}</h1>
            </div>
            <textarea disabled className="w-full min-h-[60px] p-2 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-[10px] resize-none mb-3" placeholder={parsedConfig.placeholderText || "Sorunuzu buraya yazın..."}></textarea>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Gönder"}
            </button>
          </div>
        </div>
      );
    }`;

const replacementQA = `    // 3. QA Addon
    if (type === "QA") {
      const qaPairs = parsedConfig.qaPairs || [];
      return (
        <div className="w-full h-full bg-amber-50/20 flex flex-col p-4 overflow-y-auto no-scrollbar">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col">
            <div className="flex flex-col items-center text-center mb-4">
              {parsedConfig.avatarUrl ? (
                <img src={parsedConfig.avatarUrl} className="w-12 h-12 rounded-full object-cover shadow-sm mb-2" alt="Profile" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2 text-xl">
                  ❓
                </div>
              )}
              <h1 className="text-sm font-black text-slate-800">{parsedConfig.boxTitle || "Soru & Cevap (AMA)"}</h1>
            </div>
            {qaPairs.length > 0 ? (
              <div className="space-y-2 w-full">
                {qaPairs.map((p: any, idx: number) => (
                  <details key={idx} className="group border border-zinc-100 rounded-xl bg-zinc-50 p-2.5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                      <span className="text-[10px] font-bold text-slate-850 pr-3">{p.q || "Soru"}</span>
                      <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-[9px] text-slate-600 mt-2 pl-0.5 leading-relaxed border-t border-zinc-200/60 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400 text-center py-4">
                Henüz soru ve cevap eklenmemiş.
              </p>
            )}
          </div>
        </div>
      );
    }

    // 3.5 Newsletter Addon
    if (type === "NEWSLETTER") {
      return (
        <div className="w-full h-full bg-emerald-50/20 flex items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 text-xl">
              ✉️
            </div>
            <h1 className="text-sm font-black text-slate-800 mb-1">{parsedConfig.title || "Haftalık Bülten"}</h1>
            <p className="text-[10px] text-slate-500 mb-4">{parsedConfig.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-left text-[10px] text-zinc-400 mb-3">
              email@example.com
            </div>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Abone Ol"}
            </button>
          </div>
        </div>
      );
    }`;

if (content.includes(targetQA)) {
  content = content.replace(targetQA, replacementQA);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("QA and Newsletter previews replaced literally successfully!");
} else {
  console.log("Error: QA literal target not found!");
}
