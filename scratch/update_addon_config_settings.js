const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'addons', 'addon-config-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');
let changeCount = 0;

function safeReplace(label, target, replacement) {
  const idx = content.indexOf(target);
  if (idx === -1) {
    console.error(`❌ FAILED: ${label} — target not found`);
    console.error(`   First 150 chars: ${JSON.stringify(target).slice(0, 150)}`);
    return false;
  }
  content = content.slice(0, idx) + replacement + content.slice(idx + target.length);
  changeCount++;
  console.log(`✅ ${label}`);
  return true;
}

function safeInsertAfter(label, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) {
    console.error(`❌ FAILED: ${label} — anchor not found`);
    return false;
  }
  const endIdx = idx + anchor.length;
  content = content.slice(0, endIdx) + insertion + content.slice(endIdx);
  changeCount++;
  console.log(`✅ ${label}`);
  return true;
}

const CR = '\r\n';

// ═══════════════════════════════════════════════════════════════
// 1. ADD NEW SLUGS TO getDefaultSlug
// ═══════════════════════════════════════════════════════════════
const slugAnchor = ' if (type === "PREMIUM_VIDEO") return "masterclass";\r\n';
const newSlugs = [
  ' if (type === "WEB3_NFT") return "web3-nft";',
  ' if (type === "EDITORIAL_LUX") return "editorial";',
  ' if (type === "GAMER_HUB") return "gamer-hub";',
  ' if (type === "CORP_EXEC") return "corporate";',
  ' if (type === "COMIC_MANGA") return "comic-manga";',
  ' if (type === "SPOTIFY_CLASSIC") return "spotify-player";',
  ' if (type === "VINYL_RETRO") return "vinyl-player";',
  ' if (type === "GLASS_AUDIO") return "glass-audio";',
  ' if (type === "NEON_CYBERPUNK") return "neon-player";',
  ' if (type === "MINIMAL_LIGHT_AUDIO") return "minimal-audio";',
  ' if (type === "MUSIC_PODCAST") return "music-podcast";',
  ' if (type === "PORTFOLIO_GALLERY") return "portfolio-gallery";',
  ' if (type === "COUNTDOWN_LAUNCH") return "countdown";',
  ' if (type === "TESTIMONIALS") return "testimonials";',
].join(CR) + CR;
safeInsertAfter('1. Add new slugs to getDefaultSlug', slugAnchor, newSlugs);

// ═══════════════════════════════════════════════════════════════
// 2. FIX DUPLICATE CASES IN getAddonDetails
// ═══════════════════════════════════════════════════════════════
// The duplicate block uses 4-space indent for first set, 2-space for second set
const dupTarget = '    case "COMIC_MANGA":\r\n  case "WEB3_NFT":\r\n  case "EDITORIAL_LUX":\r\n  case "GAMER_HUB":\r\n  case "CORP_EXEC":\r\n  case "COMIC_MANGA": return';
const dupReplacement = '    case "COMIC_MANGA": return';
safeReplace('2a. Remove duplicate getAddonDetails cases', dupTarget, dupReplacement);

// Remove dead code cases (lines 333-337 with "  case" 2-space indent)
const deadTarget = '  case "WEB3_NFT": return { icon: <Store className="h-5 w-5" />, title: "Web3 & NFT Showcase" };\r\n  case "EDITORIAL_LUX": return { icon: <Store className="h-5 w-5" />, title: "High-End Editorial" };\r\n  case "GAMER_HUB": return { icon: <Store className="h-5 w-5" />, title: "Streamer & Gamer Hub" };\r\n  case "CORP_EXEC": return { icon: <Store className="h-5 w-5" />, title: "Corporate Executive" };\r\n  case "COMIC_MANGA": return { icon: <Store className="h-5 w-5" />, title: "Comic & Manga Panel" };\r\n  default:';
const deadReplacement = '  default:';
safeReplace('2b. Remove dead getAddonDetails cases', deadTarget, deadReplacement);

// ═══════════════════════════════════════════════════════════════
// 3. ADD renderTestimonialsEditor FUNCTION
// ═══════════════════════════════════════════════════════════════
// Insert before " const getAddonDetails"
const getAddonAnchor = ' const getAddonDetails = () => {\r\n';
const testimonialsEditorFn = ` const renderTestimonialsEditor = () => {
    const items = configData.testimonials || [];
    return (
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Müşteri Yorumları Listesi" : "Testimonials List"}
        </label>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group space-y-2">
            <button
              type="button"
              onClick={() => {
                const newItems = [...items];
                newItems.splice(idx, 1);
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <input
              type="text"
              placeholder={lang === "tr" ? "Müşteri Adı" : "Client Name"}
              value={item.name || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], name: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none text-slate-800"
            />
            <textarea
              placeholder={lang === "tr" ? "Yorum Metni" : "Review Text"}
              value={item.text || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], text: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16 text-slate-600"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{lang === "tr" ? "Puan:" : "Rating:"}</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], rating: star };
                    setConfigData({ ...configData, testimonials: newItems });
                  }}
                  className={\`text-lg \${(item.rating || 5) >= star ? "text-yellow-400" : "text-zinc-300"} hover:scale-110 transition-transform cursor-pointer\`}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder={lang === "tr" ? "Müşteri Avatar URL (Opsiyonel)" : "Client Avatar URL (Optional)"}
              value={item.avatarUrl || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], avatarUrl: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-xs bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none text-slate-600"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newItems = [...items, { name: "", text: "", rating: 5, avatarUrl: "" }];
            setConfigData({ ...configData, testimonials: newItems });
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Yorum Ekle" : "Add New Testimonial"}</span>
        </button>
      </div>
    );
  };

`.split('\n').join('\r\n');

safeReplace('3. Add renderTestimonialsEditor function', getAddonAnchor, testimonialsEditorFn + getAddonAnchor);

// ═══════════════════════════════════════════════════════════════
// 4. ADD PREMIUM THEMES TO renderFields STORE CASE
// ═══════════════════════════════════════════════════════════════
const storeFieldsTarget = ' case "PREMIUM_CREATOR":\r\n specificFields = (\r\n <>\r\n <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">\r\n <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">\r\n <Store className="h-4 w-4" />';
const storeFieldsReplacement = ' case "PREMIUM_CREATOR":\r\n case "WEB3_NFT":\r\n case "EDITORIAL_LUX":\r\n case "GAMER_HUB":\r\n case "CORP_EXEC":\r\n case "COMIC_MANGA":\r\n specificFields = (\r\n <>\r\n <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">\r\n <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">\r\n <Store className="h-4 w-4" />';
safeReplace('4. Add premium themes to renderFields Store case', storeFieldsTarget, storeFieldsReplacement);

// ═══════════════════════════════════════════════════════════════
// 5-8. ADD NEW ADDON TYPE SETTINGS CASES (before default)
// ═══════════════════════════════════════════════════════════════
const defaultCaseTarget = ' default:\r\n specificFields = (\r\n <div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">\r\n {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}\r\n </div>\r\n );';

const newCasesCode = ` // ── MUSIC & AUDIO PLUGINS ──
 case "SPOTIFY_CLASSIC":
 case "VINYL_RETRO":
 case "GLASS_AUDIO":
 case "NEON_CYBERPUNK":
 case "MINIMAL_LIGHT_AUDIO":
 case "MUSIC_PODCAST":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Music className="h-4 w-4" />
 {lang === "tr" ? "Müzik & Ses Ayarları" : "Music & Audio Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Şarkı / Podcast Adı" : "Song / Podcast Name")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Bu parça hakkında kısa bir açıklama..." : "A short description about this track...")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", lang === "tr" ? "Beatmaker & Prodüktör" : "Beatmaker & Producer")}
 </div>

 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🎵 {lang === "tr" ? "Parça Detayları" : "Track Details"}
 </h4>
 {renderInput("trackName", lang === "tr" ? "Şarkı / Parça Adı" : "Track / Song Name", lang === "tr" ? "Gece Yağmuru" : "Night Rain")}
 {renderInput("artistName", lang === "tr" ? "Sanatçı / Prodüktör Adı" : "Artist / Producer Name", lang === "tr" ? "DJ Yağmur" : "DJ Rain")}
 {renderInput("trackUrl", lang === "tr" ? "Spotify / SoundCloud / Ses Linki" : "Spotify / SoundCloud / Audio URL", "https://open.spotify.com/track/...")}
 {renderInput("trackDuration", lang === "tr" ? "Parça Süresi (Opsiyonel)" : "Track Duration (Optional)", "3:45")}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🎨 {lang === "tr" ? "Görsel Özelleştirme" : "Visual Customization"}
 </h4>
 {renderImageUpload("albumCoverUrl", lang === "tr" ? "Albüm / Kapak Görseli" : "Album / Cover Image")}
 {renderInput("accentColor", lang === "tr" ? "Vurgu Rengi (HEX, Opsiyonel)" : "Accent Color (HEX, Optional)", "#1db954")}
 </div>
 </>
 );
 break;

 // ── PORTFOLIO & GALLERY ──
 case "PORTFOLIO_GALLERY":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Image className="h-4 w-4" />
 {lang === "tr" ? "Portfolyo Ayarları" : "Portfolio Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Galeri Başlığı" : "Gallery Title", lang === "tr" ? "Çalışmalarım" : "My Works")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Tasarımlarım ve projelerim." : "My designs and projects.")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "Visual Artist & Designer")}
 </div>

 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🖼️ {lang === "tr" ? "Galeri Görselleri" : "Gallery Images"}
 </h4>
 {renderImageUpload("galleryImage1", lang === "tr" ? "Görsel 1" : "Image 1")}
 {renderImageUpload("galleryImage2", lang === "tr" ? "Görsel 2" : "Image 2")}
 {renderImageUpload("galleryImage3", lang === "tr" ? "Görsel 3" : "Image 3")}
 {renderImageUpload("galleryImage4", lang === "tr" ? "Görsel 4" : "Image 4")}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🔗 {lang === "tr" ? "Bağlantılar" : "Links"}
 </h4>
 {renderInput("behanceUrl", lang === "tr" ? "Behance Linki (Opsiyonel)" : "Behance URL (Optional)", "https://behance.net/...")}
 {renderInput("dribbbleUrl", lang === "tr" ? "Dribbble Linki (Opsiyonel)" : "Dribbble URL (Optional)", "https://dribbble.com/...")}
 {renderInput("websiteUrl", lang === "tr" ? "Web Sitesi (Opsiyonel)" : "Website (Optional)", "https://...")}
 </div>
 </>
 );
 break;

 // ── COUNTDOWN & LAUNCH ──
 case "COUNTDOWN_LAUNCH":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Clock className="h-4 w-4" />
 {lang === "tr" ? "Geri Sayım Ayarları" : "Countdown Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Etkinlik / Lansman Başlığı" : "Event / Launch Title", lang === "tr" ? "Büyük Lansman" : "Big Launch")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Yeni ürünümüz çok yakında sizlerle!" : "Our new product is coming soon!")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "Product Launcher & Innovator")}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 ⏰ {lang === "tr" ? "Zamanlayıcı" : "Timer"}
 </h4>
 {renderInput("targetDate", lang === "tr" ? "Hedef Tarih & Saat" : "Target Date & Time", "2026-12-31T23:59:59")}
 {renderInput("buttonUrl", lang === "tr" ? "Yönlendirme Linki (Opsiyonel)" : "Redirect URL (Optional)", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı (Opsiyonel)" : "Button Text (Optional)", lang === "tr" ? "Detaylar" : "Details")}
 </div>
 </>
 );
 break;

 // ── TESTIMONIALS ──
 case "TESTIMONIALS":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <MessageCircle className="h-4 w-4" />
 {lang === "tr" ? "Yorum Modülü Ayarları" : "Testimonial Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Müşteri Yorumları" : "Client Testimonials")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Müşterilerimizin görüşleri." : "What our clients say.")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "E-Commerce Business Consultant")}
 </div>
 {renderTestimonialsEditor()}
 </>
 );
 break;

 default:
 specificFields = (
 <div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">
 {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
 </div>
 );`.split('\n').join('\r\n');

safeReplace('5-8. Add new addon settings cases before default', defaultCaseTarget, newCasesCode);

// ═══════════════════════════════════════════════════════════════
// 9. ADD PREMIUM THEMES TO renderLivePreview STORE CASE
// ═══════════════════════════════════════════════════════════════
const lpTarget = '  case "PREMIUM_CREATOR":\r\n  return (\r\n  <div className="w-full h-full relative overflow-hidden flex flex-col">\r\n  <StorefrontPreview';
const lpReplacement = '  case "PREMIUM_CREATOR":\r\n  case "WEB3_NFT":\r\n  case "EDITORIAL_LUX":\r\n  case "GAMER_HUB":\r\n  case "CORP_EXEC":\r\n  case "COMIC_MANGA":\r\n  return (\r\n  <div className="w-full h-full relative overflow-hidden flex flex-col">\r\n  <StorefrontPreview';
safeReplace('9. Add premium themes to renderLivePreview Store case', lpTarget, lpReplacement);

// ═══════════════════════════════════════════════════════════════
// WRITE OUTPUT
// ═══════════════════════════════════════════════════════════════
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Done! ${changeCount} changes applied to addon-config-modal.tsx`);
