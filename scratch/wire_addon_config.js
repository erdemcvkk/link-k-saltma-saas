const fs = require('fs');
const path = require('path');

let totalChanges = 0;

function safeReplace(content, label, target, replacement) {
  const idx = content.indexOf(target);
  if (idx === -1) {
    console.error(`❌ FAILED: ${label}`);
    console.error(`   Target (first 120): ${JSON.stringify(target).slice(0, 120)}`);
    return content;
  }
  totalChanges++;
  console.log(`✅ ${label}`);
  return content.slice(0, idx) + replacement + content.slice(idx + target.length);
}

// ══════════════════════════════════════════════════════════════════
// SHARED: The new renderAddonInnerContent function body
// This replaces the inner switch cases to use config data
// ══════════════════════════════════════════════════════════════════

function buildNewRenderFunction(lineEnding) {
  const L = lineEnding;
  // We add a `config` parameter to the function signature
  // Then use config.trackName, config.albumCoverUrl, config.galleryImage1-4, config.targetDate, config.testimonials etc.
  return `function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string, config: any = {}) {${L}  switch (type) {${L}    case "SPOTIFY_CLASSIC":${L}      return (${L}        <div className="w-full h-full bg-zinc-950 flex flex-col p-8 text-white relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-850 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">${L}              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-white">{username}</span>${L}            <p className="text-xs text-green-500 font-bold mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-6">${L}            <div className="flex items-center justify-between">${L}              <div>${L}                <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>${L}                <p className="text-[10px] text-zinc-400">{config.artistName || desc}</p>${L}              </div>${L}              <div className="flex items-center gap-4">${L}                <span className="text-green-500 text-lg cursor-pointer">⏮</span>${L}                <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black border-0 shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer">${L}                  <span className="text-sm ml-0.5">▶</span>${L}                </button>${L}                <span className="text-green-500 text-lg cursor-pointer">⏭</span>${L}              </div>${L}            </div>${L}            ${L}            <div className="space-y-1">${L}              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">${L}                <div className="w-1/3 h-full bg-green-500 rounded-full"></div>${L}              </div>${L}              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">${L}                <span>1:12</span>${L}                <span>{config.trackDuration || "3:45"}</span>${L}              </div>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "VINYL_RETRO":${L}      return (${L}        <div className="w-full h-full bg-stone-900 flex flex-col p-8 text-orange-400 relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-6">${L}            <span className="text-sm font-bold text-stone-200">{username}</span>${L}            <p className="text-xs text-orange-400/70 mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="flex justify-center my-6">${L}            <div className="w-32 h-32 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">${L}              <div className="absolute inset-2 rounded-full border border-stone-850"></div>${L}              <div className="absolute inset-5 rounded-full border border-stone-850"></div>${L}              <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center p-0.5">${L}                <div className="w-3 h-3 rounded-full bg-stone-900"></div>${L}              </div>${L}            </div>${L}          </div>${L}          ${L}          <div className="bg-stone-950/85 rounded-2xl p-5 border border-stone-800 text-center space-y-4 mt-auto">${L}            <h4 className="text-xs font-bold text-stone-300">{config.trackName || title}</h4>${L}            <p className="text-[10px] text-stone-500">{config.artistName || desc}</p>${L}            <div className="flex items-center justify-center gap-6 text-orange-400">${L}              <span className="text-sm cursor-pointer">⏮</span>${L}              <button className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">${L}                <span className="text-xs ml-0.5">▶</span>${L}              </button>${L}              <span className="text-sm cursor-pointer">⏭</span>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "GLASS_AUDIO":${L}      return (${L}        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-8 text-white relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-20 h-20 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">${L}              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-white">{username}</span>${L}          </div>${L}          ${L}          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 mt-4 space-y-4 shadow-xl">${L}            <div className="text-center">${L}              <h4 className="text-sm font-extrabold text-white">{config.trackName || title}</h4>${L}              <p className="text-[10px] text-purple-100/80 mt-1">{config.artistName || desc}</p>${L}            </div>${L}            <div className="flex items-center justify-center gap-6 text-white pt-2">${L}              <span className="text-sm cursor-pointer">⏮</span>${L}              <button className="w-11 h-11 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">${L}                <span className="text-sm ml-0.5">▶</span>${L}              </button>${L}              <span className="text-sm cursor-pointer">⏭</span>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "NEON_CYBERPUNK":${L}      return (${L}        <div className="w-full h-full bg-black flex flex-col p-8 text-white relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]">${L}              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-xs font-black mt-3 uppercase tracking-widest text-pink-500">{username}</span>${L}          </div>${L}          ${L}          <div className="bg-black border border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] rounded-none p-5 mt-4 space-y-5">${L}            <div className="flex items-center justify-between">${L}              <div>${L}                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">{config.trackName || title}</h4>${L}                <p className="text-[9px] text-pink-400 uppercase mt-1">{config.artistName || desc}</p>${L}              </div>${L}              <button className="w-10 h-10 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(236,72,153,0.8)] cursor-pointer">${L}                <span className="text-xs">▶</span>${L}              </button>${L}            </div>${L}            <div className="w-full h-0.5 bg-zinc-900 relative">${L}              <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "MINIMAL_LIGHT_AUDIO":${L}      return (${L}        <div className="w-full h-full bg-slate-50 flex flex-col p-8 text-slate-800 relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">${L}              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-slate-800">{username}</span>${L}            <p className="text-xs text-slate-500 mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-5 mt-4 space-y-4">${L}            <div className="flex items-center justify-between">${L}              <div>${L}                <h4 className="text-sm font-semibold text-slate-800">{config.trackName || title}</h4>${L}                <p className="text-[10px] text-slate-500 mt-1">{config.artistName || desc}</p>${L}              </div>${L}              <button className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center border-0 shadow-sm cursor-pointer">${L}                <span className="text-sm ml-0.5">▶</span>${L}              </button>${L}            </div>${L}            <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">${L}              <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "MUSIC_PODCAST":${L}      return (${L}        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-8 text-white relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">${L}              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-purple-300">{username}</span>${L}            <p className="text-xs text-purple-200/60 mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mt-4 space-y-6">${L}            <div className="flex items-center justify-between">${L}              <div>${L}                <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>${L}                <p className="text-xs text-purple-300 mt-1">{config.artistName || desc}</p>${L}              </div>${L}              <button className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer">${L}                <span className="text-sm ml-0.5">▶</span>${L}              </button>${L}            </div>${L}            ${L}            <div className="flex items-end gap-1.5 justify-center h-10 pt-2">${L}              <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse"></div>${L}              <div className="w-1.5 bg-pink-500 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>${L}              <div className="w-1.5 bg-pink-500 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>${L}              <div className="w-1.5 bg-pink-500 h-10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>${L}              <div className="w-1.5 bg-pink-500 h-7 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>${L}              <div className="w-1.5 bg-pink-500 h-9 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>${L}              <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>${L}            </div>${L}          </div>${L}        </div>${L}      );${L}    case "PORTFOLIO_GALLERY":${L}      return (${L}        <div className="w-full h-full bg-slate-50 flex flex-col p-8 text-slate-800 relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-200 rounded-none border border-slate-300 overflow-hidden">${L}              <img src={avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-slate-700">{username}</span>${L}            <p className="text-xs text-slate-500 mt-1">{bio}</p>${L}          </div>${L}          ${L}          <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">{title}</h3>${L}          <p className="text-xs text-slate-500 mb-4 px-1">{desc}</p>${L}          ${L}          <div className="grid grid-cols-2 gap-3 mt-2">${L}            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">${L}              <img src={config.galleryImage1 || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />${L}            </div>${L}            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">${L}              <img src={config.galleryImage2 || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />${L}            </div>${L}            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">${L}              <img src={config.galleryImage3 || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />${L}            </div>${L}            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">${L}              <img src={config.galleryImage4 || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />${L}            </div>${L}          </div>${L}          ${L}          {(config.behanceUrl || config.dribbbleUrl || config.websiteUrl) && (${L}            <div className="flex items-center justify-center gap-3 mt-6">${L}              {config.behanceUrl && <a href={config.behanceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Behance</a>}${L}              {config.dribbbleUrl && <a href={config.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Dribbble</a>}${L}              {config.websiteUrl && <a href={config.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Website</a>}${L}            </div>${L}          )}${L}        </div>${L}      );${L}    case "COUNTDOWN_LAUNCH":${L}      {${L}        const now = new Date();${L}        const target = config.targetDate ? new Date(config.targetDate) : new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 59 * 60 * 1000);${L}        const diff = Math.max(0, target.getTime() - now.getTime());${L}        const days = Math.floor(diff / (1000 * 60 * 60 * 24));${L}        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));${L}        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));${L}        const seconds = Math.floor((diff % (1000 * 60)) / 1000);${L}        const pad = (n: number) => n.toString().padStart(2, '0');${L}      return (${L}        <div className="w-full h-full bg-orange-500 flex flex-col p-8 text-black relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">${L}              <img src={avatarUrl || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-black mt-3 uppercase tracking-wide">{username}</span>${L}            <p className="text-xs text-zinc-900/75 font-semibold mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="bg-black text-white rounded-3xl p-5 mt-4 border border-black/10 text-center space-y-4 shadow-lg">${L}            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">{title}</h4>${L}            <p className="text-[10px] text-zinc-400">{desc}</p>${L}            <div className="flex items-center justify-center gap-2">${L}              {days > 0 && (<>${L}                <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">${L}                  <span className="text-base font-black font-mono text-white">{pad(days)}</span>${L}                  <span className="block text-[8px] text-zinc-500 mt-0.5">GÜN</span>${L}                </div>${L}                <span className="text-zinc-600 font-bold">:</span>${L}              </>)}${L}              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">${L}                <span className="text-base font-black font-mono text-white">{pad(hours)}</span>${L}                <span className="block text-[8px] text-zinc-500 mt-0.5">SAAT</span>${L}              </div>${L}              <span className="text-zinc-600 font-bold">:</span>${L}              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">${L}                <span className="text-base font-black font-mono text-white">{pad(minutes)}</span>${L}                <span className="block text-[8px] text-zinc-500 mt-0.5">DAK</span>${L}              </div>${L}              <span className="text-zinc-600 font-bold">:</span>${L}              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">${L}                <span className="text-base font-black font-mono text-white">{pad(seconds)}</span>${L}                <span className="block text-[8px] text-zinc-500 mt-0.5">SN</span>${L}              </div>${L}            </div>${L}            {config.buttonUrl && config.buttonText && (${L}              <a href={config.buttonUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 bg-orange-500 text-black text-xs font-black uppercase tracking-wider rounded-full hover:bg-orange-400 transition-colors">{config.buttonText}</a>${L}            )}${L}          </div>${L}        </div>${L}      );${L}      }${L}    case "TESTIMONIALS":${L}      {${L}        const testimonials = config.testimonials && config.testimonials.length > 0 ? config.testimonials : [{ name: "Elif Y.", text: desc, rating: 5, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" }];${L}      return (${L}        <div className="w-full h-full bg-teal-50 flex flex-col p-8 text-zinc-800 relative z-0">${L}          <div className="flex flex-col items-center mt-12 mb-8">${L}            <div className="w-24 h-24 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">${L}              <img src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"} className="w-full h-full object-cover" />${L}            </div>${L}            <span className="text-sm font-bold mt-3 text-teal-800">{username}</span>${L}            <p className="text-xs text-teal-600 mt-1">{bio}</p>${L}          </div>${L}          ${L}          <div className="space-y-3">${L}            {testimonials.map((t: any, idx: number) => (${L}              <div key={idx} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-3">${L}                <div className="flex gap-0.5 text-yellow-400 text-sm">${L}                  {[1,2,3,4,5].map((s) => <span key={s} className={s <= (t.rating || 5) ? "text-yellow-400" : "text-zinc-200"}>★</span>)}${L}                </div>${L}                <p className="text-[11px] text-zinc-600 italic leading-relaxed">"{t.text || "Harika bir hizmet!"}"</p>${L}                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">${L}                  <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden">${L}                    {t.avatarUrl ? <img src={t.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-teal-200"></div>}${L}                  </div>${L}                  <span className="text-[10px] font-bold text-zinc-700">{t.name || "Anonim"}</span>${L}                </div>${L}              </div>${L}            ))}${L}          </div>${L}        </div>${L}      );${L}      }${L}    default:${L}      return null;${L}  }${L}}`;
}

// ══════════════════════════════════════════════════════════════════
// FILE 1: addon-config-modal.tsx
// ══════════════════════════════════════════════════════════════════
console.log('\n📄 Processing addon-config-modal.tsx...');
const modalPath = path.join(__dirname, '..', 'src', 'components', 'addons', 'addon-config-modal.tsx');
let modalContent = fs.readFileSync(modalPath, 'utf8');

// 1a. Update the call site to pass configData
const modalCallTarget = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}';
const modalCallReplacement = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, configData)}';
modalContent = safeReplace(modalContent, '[modal] Update renderAddonInnerContent call to pass configData', modalCallTarget, modalCallReplacement);

// 1b. Replace the entire renderAddonInnerContent function
const modalFnStart = 'function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string) {';
const modalFnEnd = '    default:\r\n      return null;\r\n  }\r\n}\r\n';
const modalFnStartIdx = modalContent.indexOf(modalFnStart);
const modalFnEndIdx = modalContent.indexOf(modalFnEnd, modalFnStartIdx);
if (modalFnStartIdx !== -1 && modalFnEndIdx !== -1) {
  const endPos = modalFnEndIdx + modalFnEnd.length;
  modalContent = modalContent.slice(0, modalFnStartIdx) + buildNewRenderFunction('\r\n') + '\r\n' + modalContent.slice(endPos);
  totalChanges++;
  console.log('✅ [modal] Replace renderAddonInnerContent function');
} else {
  console.error('❌ [modal] Could not find renderAddonInnerContent function boundaries');
}

fs.writeFileSync(modalPath, modalContent, 'utf8');

// ══════════════════════════════════════════════════════════════════
// FILE 2: [username]/[addonSlug]/page.tsx
// ══════════════════════════════════════════════════════════════════
console.log('\n📄 Processing [addonSlug]/page.tsx...');
const subpagePath = path.join(__dirname, '..', 'src', 'app', '[username]', '[addonSlug]', 'page.tsx');
let subpageContent = fs.readFileSync(subpagePath, 'utf8');

// 2a. Update the call site to pass parsedConfig
const subpageCallTarget = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}';
const subpageCallReplacement = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, parsedConfig)}';
subpageContent = safeReplace(subpageContent, '[subpage] Update renderAddonInnerContent call to pass parsedConfig', subpageCallTarget, subpageCallReplacement);

// 2b. Replace the entire renderAddonInnerContent function
const subFnStart = 'function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string) {';
const subFnEnd = '    default:\n      return null;\n  }\n}\n';
const subFnStartIdx = subpageContent.indexOf(subFnStart);
let subFnEndStr = subFnEnd;
let subFnEndIdx = subpageContent.indexOf(subFnEndStr, subFnStartIdx);
// Try with \r\n if \n fails
if (subFnEndIdx === -1) {
  subFnEndStr = '    default:\r\n      return null;\r\n  }\r\n}\r\n';
  subFnEndIdx = subpageContent.indexOf(subFnEndStr, subFnStartIdx);
}
if (subFnStartIdx !== -1 && subFnEndIdx !== -1) {
  const endPos = subFnEndIdx + subFnEndStr.length;
  const lineEnding = subpageContent.includes('\r\n') ? '\r\n' : '\n';
  subpageContent = subpageContent.slice(0, subFnStartIdx) + buildNewRenderFunction(lineEnding) + lineEnding + subpageContent.slice(endPos);
  totalChanges++;
  console.log('✅ [subpage] Replace renderAddonInnerContent function');
} else {
  console.error('❌ [subpage] Could not find renderAddonInnerContent function boundaries');
  console.error('   fnStart found:', subFnStartIdx !== -1);
  console.error('   fnEnd found:', subFnEndIdx !== -1);
}

fs.writeFileSync(subpagePath, subpageContent, 'utf8');

// ══════════════════════════════════════════════════════════════════
// FILE 3: universal-profile.tsx
// ══════════════════════════════════════════════════════════════════
console.log('\n📄 Processing universal-profile.tsx...');
const profilePath = path.join(__dirname, '..', 'src', 'components', 'universal-profile.tsx');
let profileContent = fs.readFileSync(profilePath, 'utf8');

// 3a. Find and update the call site
const profileCallTarget = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}';
const profileCallReplacement = '{renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, configData)}';
profileContent = safeReplace(profileContent, '[profile] Update renderAddonInnerContent call to pass configData', profileCallTarget, profileCallReplacement);

// 3b. Replace function
const profFnStart = 'function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string) {';
const profFnStartIdx = profileContent.indexOf(profFnStart);
let profFnEndStr = '    default:\r\n      return null;\r\n  }\r\n}\r\n';
let profFnEndIdx = profileContent.indexOf(profFnEndStr, profFnStartIdx);
if (profFnEndIdx === -1) {
  profFnEndStr = '    default:\n      return null;\n  }\n}\n';
  profFnEndIdx = profileContent.indexOf(profFnEndStr, profFnStartIdx);
}
if (profFnStartIdx !== -1 && profFnEndIdx !== -1) {
  const endPos = profFnEndIdx + profFnEndStr.length;
  const lineEnding = profileContent.includes('\r\n') ? '\r\n' : '\n';
  profileContent = profileContent.slice(0, profFnStartIdx) + buildNewRenderFunction(lineEnding) + lineEnding + profileContent.slice(endPos);
  totalChanges++;
  console.log('✅ [profile] Replace renderAddonInnerContent function');
} else {
  console.error('❌ [profile] Could not find renderAddonInnerContent function boundaries');
}

fs.writeFileSync(profilePath, profileContent, 'utf8');

// ══════════════════════════════════════════════════════════════════
// FILE 4: phone-preview.tsx
// ══════════════════════════════════════════════════════════════════
console.log('\n📄 Processing phone-preview.tsx...');
const phonePath = path.join(__dirname, '..', 'src', 'components', 'dashboard', 'phone-preview.tsx');
let phoneContent = fs.readFileSync(phonePath, 'utf8');

// 4a. Find and update the call site - it uses configData
const phoneCallTarget = 'renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)';
// Check if it exists (might be formatted differently)
if (phoneContent.includes(phoneCallTarget)) {
  phoneContent = safeReplace(phoneContent, '[phone] Update renderAddonInnerContent call to pass configData', phoneCallTarget, 'renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, configData)');
} else {
  console.log('⚠️  [phone] Call site may already include config or has different format, skipping');
}

// 4b. Replace function
const phoneFnStart = 'function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string) {';
const phoneFnStartIdx = phoneContent.indexOf(phoneFnStart);
let phoneFnEndStr = '    default:\r\n      return null;\r\n  }\r\n}\r\n';
let phoneFnEndIdx = phoneContent.indexOf(phoneFnEndStr, phoneFnStartIdx);
if (phoneFnEndIdx === -1) {
  phoneFnEndStr = '    default:\n      return null;\n  }\n}\n';
  phoneFnEndIdx = phoneContent.indexOf(phoneFnEndStr, phoneFnStartIdx);
}
if (phoneFnStartIdx !== -1 && phoneFnEndIdx !== -1) {
  const endPos = phoneFnEndIdx + phoneFnEndStr.length;
  const lineEnding = phoneContent.includes('\r\n') ? '\r\n' : '\n';
  phoneContent = phoneContent.slice(0, phoneFnStartIdx) + buildNewRenderFunction(lineEnding) + lineEnding + phoneContent.slice(endPos);
  totalChanges++;
  console.log('✅ [phone] Replace renderAddonInnerContent function');
} else {
  console.error('❌ [phone] Could not find renderAddonInnerContent function boundaries');
}

fs.writeFileSync(phonePath, phoneContent, 'utf8');

console.log(`\n🎉 Done! ${totalChanges} changes applied across 4 files.`);
