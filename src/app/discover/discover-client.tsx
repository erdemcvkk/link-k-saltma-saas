"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, BookOpen, Compass, Layers, BarChart3, Eye } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";

interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
  coverUrl: string;
  bgColor: string;
  fontStyle: string;
  buttonStyle: string;
  paymentLink?: string | null;
  paymentUrl?: string | null;
  isActive: boolean;
  isCoded: boolean;
  isComingSoon: boolean;
  customCss?: string | null;
  configJson?: string | null;
  customHtml?: string | null;
  containerClasses?: string | null;
  jsonConfig?: string | null;
  masterLayoutHtml?: string | null;
  avatarHtml?: string | null;
  headerHtml?: string | null;
  socialHtml?: string | null;
  linksHtml?: string | null;
  backgroundHtml?: string | null;
  customSchema?: any;
  createdAt: string;
}

interface DiscoverClientProps {
  initialTemplates: Template[];
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
}

const isLightColor = (color: string) => {
  if (!color) return false;
  const hex = color.replace('#', '');
  if (hex.length === 3 || hex.length === 6) {
    const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0,2), 16);
    const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2,4), 16);
    const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4,6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }
  return color.toLowerCase().includes('white') || color.toLowerCase().includes('yellow') || color.toLowerCase().includes('#fff') || color.toLowerCase().includes('#fdf') || color.toLowerCase() === '#f3f4f6';
};

const getDummyData = (template: Template): UniversalProfileData => {
  const dummyLinks = [
    { id: "1", title: "Instagram Hesabım", url: "#", type: "INSTAGRAM", blockType: "TEXT_LINK" },
    { id: "2", title: "Yeni Albümüm", url: "#", type: "MUSIC", blockType: "TEXT_LINK" },
    { id: "3", title: "Mağaza Vitrinim", url: "#", type: "STORE", blockType: "TEXT_LINK" }
  ];

  const isLight = isLightColor(template.bgColor) || [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram", "Sandstone Zen", "Swiss Minimalist", "Neo-Brutalist Grid"
  ].includes(template.name);

  return {
    templateId: template.id,
    username: "kullaniciadi",
    bio: "Dijital varlığınızı Clinkor ile özelleştirin.",
    avatarUrl: null,
    theme: template.name,
    background: template.bgColor,
    fontStyle: template.fontStyle,
    buttonClass: template.buttonStyle || null,
    customCss: template.customCss || null,
    usernameColor: isLight ? "#000000" : "#ffffff",
    bioColor: isLight ? "#4b5563" : "#9ca3af",
    links: dummyLinks,
    isCoded: template.isCoded,
    customHtml: template.customHtml,
    masterLayoutHtml: template.masterLayoutHtml,
    avatarHtml: template.avatarHtml,
    headerHtml: template.headerHtml,
    socialHtml: template.socialHtml,
    linksHtml: template.linksHtml,
    backgroundHtml: template.backgroundHtml,
    containerClasses: template.containerClasses,
    jsonConfig: template.jsonConfig || template.configJson,
    socialLinks: [
      { socialPlatform: "instagram", socialUrl: "#" },
      { socialPlatform: "twitter", socialUrl: "#" }
    ],
    socials: [
      { socialPlatform: "instagram", socialUrl: "#" },
      { socialPlatform: "twitter", socialUrl: "#" }
    ],
    isPremiumTemplateActive: false
  };
};

export default function DiscoverClient({ initialTemplates, userId, siteTitle, siteLogo }: DiscoverClientProps) {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setTheme(state.theme);
  };

  const isDark = theme === "dark";

  // Find targeted templates safely
  const swissTemplate = initialTemplates.find(t => t.name === "Swiss Noir") || initialTemplates[0];
  const auraTemplate = initialTemplates.find(t => t.name === "Aura Clay") || initialTemplates[1];

  return (
    <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden pb-32 ${
      isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Decorative Blur Backgrounds */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-indigo-500/5 opacity-100" : "bg-indigo-300/5 opacity-70"
      }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-sky-500/5 opacity-100" : "bg-sky-300/5 opacity-70"
      }`} />



      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-20 relative z-10">
        
        {/* Section 1: Hero & Introduction */}
        <section className="space-y-8 text-center md:text-left">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-widest mx-auto md:mx-0 ${
            isDark ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-400" : "bg-indigo-50 border-indigo-200 text-indigo-600"
          }`}>
            <BookOpen className="h-3.5 w-3.5" />
            Clinkor Kullanım Rehberi
          </div>
          <h1 className={`text-3xl md:text-5xl font-black tracking-tight leading-[1.1] ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Clinkor Yetenekleri: Dijital Kimliğinizi Özgürleştirin
          </h1>
          
          {/* 200 Word Capacity Intro Text */}
          <div className={`text-lg leading-[1.8] font-sans font-medium space-y-6 ${
            isDark ? "text-zinc-300" : "text-slate-700"
          }`}>
            <p>
              Clinkor, dijital dünyada kendinizi ifade etmenin en estetik ve en etkili yolunu sunmak üzere tasarlandı. Günümüzün hızla değişen sosyal medya ekosisteminde, tek bir bağlantı üzerinden tüm dijital varlığınızı kontrol etmek ve ziyaretçilerinize premium bir deneyim sunmak her zamankinden daha kritik bir hale geldi. Platformumuz, sosyal medya entegrasyonu, tasarım esnekliği ve güçlü veri analitiği gibi temel yetenekleri tek bir çatı altında birleştirir. Clinkor ile karmaşık kod yapılarıyla uğraşmadan, saniyeler içinde sosyal medya hesaplarınızı, dijital ürünlerinizi, bültenlerinizi veya portfolyolarınızı bir araya getirebilirsiniz. Gelişmiş tasarım esnekliğimiz sayesinde markanızın kurumsal kimliğine ve ruhuna en uygun temayı seçip özelleştirebilirsiniz. Ayrıca, entegre veri analitiği panelimiz ile sayfanızı ziyaret edenlerin hangi bağlantılara tıkladığını, hangi cihazlardan eriştiğini ve etkileşim oranlarınızı anlık olarak takip edebilirsiniz. Clinkor, dijital kimliğinizi sadece bir bağlantı listesi olarak değil, ziyaretçilerinizle etkileşim kuran ve kapıları açan dijital bir sanat eseri olarak kurgulamanıza yardımcı olur.
            </p>
          </div>
        </section>

        {/* Section 2: Curated Showcase (Side-by-Side Templates) */}
        <section className="space-y-10 border-t border-slate-100 dark:border-zinc-900 pt-16">
          <div className="space-y-2">
            <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-extrabold block">Tasarım Vitrini</span>
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Seçkin Şablon Modelleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Template 1: Swiss Noir */}
            {swissTemplate && (
              <div className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 ${
                isDark ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-slate-200/80 shadow-sm"
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-xl font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                      {swissTemplate.name}
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                      Minimalist
                    </span>
                  </div>
                  
                  {/* 3 Sentence Description */}
                  <p className={`text-sm leading-[1.8] font-sans ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                    Swiss Noir, keskin köşeleri ve güçlü monokrom renk paletiyle İsviçre minimalist tasarım ekolünün en belirgin temsilcisidir. Görsel hiyerarşiyi ön planda tutan bu şablon, gereksiz tüm süslemelerden arınarak içeriğinizin doğrudan ve etkileyici bir şekilde öne çıkmasını sağlar. Özellikle portfolyolarını, profesyonel yazılarını veya kurumsal bağlantılarını sergilemek isteyen vizyoner yaratıcılar için ideal bir tercihtir.
                  </p>
                </div>

                {/* Mockup Frame */}
                <div className="relative w-full aspect-[9/16] max-w-[260px] mx-auto bg-zinc-950 rounded-[2rem] p-1.5 shadow-inner border border-zinc-800 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-3 bg-zinc-900 z-20 rounded-b-xl w-[30%] mx-auto" />
                  <div className="relative w-full h-full bg-zinc-950 rounded-[1.6rem] overflow-hidden">
                    <UniversalProfile 
                      data={getDummyData(swissTemplate)} 
                      isCompactMode={true} 
                      isDarkContext={!isLightColor(swissTemplate.bgColor)} 
                      forcePremiumRender={true}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/sablonlar?intent=purchase_${swissTemplate.id}`}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    Şablonu Seç
                  </Link>
                </div>
              </div>
            )}

            {/* Template 2: Aura Minimalist (Aura Clay) */}
            {auraTemplate && (
              <div className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 ${
                isDark ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-slate-200/80 shadow-sm"
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-xl font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                      Aura Minimalist
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-purple-100 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400 px-2 py-0.5 rounded">
                      Premium
                    </span>
                  </div>

                  {/* 3 Sentence Description */}
                  <p className={`text-sm leading-[1.8] font-sans ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                    Aura Minimalist, yumuşak gölgeleri ve pastel tonlardaki geçişleri ile ekranlarda sakinleştirici ve davetkar bir atmosfer yaratır. Dokunsal derinlik hissi veren soft yapısı, ziyaretçilerinizde güven ve samimiyet duygusu uyandırmayı hedefler. Kişisel markasını daha samimi, modern ve estetik açıdan ferah bir dille anlatmak isteyen içerik üreticileri için mükemmel bir seçenektir.
                  </p>
                </div>

                {/* Mockup Frame */}
                <div className="relative w-full aspect-[9/16] max-w-[260px] mx-auto bg-zinc-950 rounded-[2rem] p-1.5 shadow-inner border border-zinc-800 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-3 bg-zinc-900 z-20 rounded-b-xl w-[30%] mx-auto" />
                  <div className="relative w-full h-full bg-zinc-950 rounded-[1.6rem] overflow-hidden">
                    <UniversalProfile 
                      data={getDummyData(auraTemplate)} 
                      isCompactMode={true} 
                      isDarkContext={!isLightColor(auraTemplate.bgColor)} 
                      forcePremiumRender={true}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/sablonlar?intent=purchase_${auraTemplate.id}`}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    Şablonu Seç
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Plugin Guide */}
        <section className="space-y-8 border-t border-slate-100 dark:border-zinc-900 pt-16">
          <div className="space-y-2">
            <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-extrabold block">Gelişmiş Entegrasyonlar</span>
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Premium Eklentiler
            </h2>
          </div>

          <div className="space-y-10">
            {/* Plugin 1 */}
            <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row gap-6 items-center ${
              isDark ? "bg-zinc-950/20 border-zinc-900" : "bg-white border-slate-200/80 shadow-sm"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Layers className="h-6 w-6" />
              </div>
              <div className="space-y-3 flex-1 text-left">
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Dinamik Sosyal Akış
                </h3>
                <p className={`text-sm leading-[1.8] font-sans ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  Nasıl Kullanılır: Bu eklentiyi profilinize dahil ettiğinizde, Instagram veya YouTube gibi sosyal ağlardaki en son içerikleriniz sayfanızda otomatik olarak listelenir. Ziyaretçileriniz Clinkor sayfanızdan ayrılmadan en güncel paylaşımlarınızı görebilir ve etkileşime geçebilir. Tek yapmanız gereken, eklenti ayarlarından sosyal medya hesaplarınızı bağlamak ve görünüm tarzını seçmektir; gerisini sistem sizin için halleder.
                </p>
              </div>
            </div>

            {/* Plugin 2 */}
            <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row gap-6 items-center ${
              isDark ? "bg-zinc-950/20 border-zinc-900" : "bg-white border-slate-200/80 shadow-sm"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="space-y-3 flex-1 text-left">
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  İstatistik Paneli
                </h3>
                <p className={`text-sm leading-[1.8] font-sans ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  Nasıl Kullanılır: Bu eklenti sayesinde sayfa trafiğinizi ve ziyaretçi davranışlarını anlık grafiklerle takip edebilirsiniz. Hangi linkin daha çok tıklandığını, hangi günlerde yoğunluk yaşandığını ve ziyaretçilerin coğrafi dağılımlarını tek bir ekrandan inceleyebilirsiniz. Paneldeki verileri düzenli analiz ederek link yerleşimlerinizi optimize edebilir ve dijital stratejinizi büyütebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Call To Action (CTA) */}
        <section className={`p-8 md:p-12 rounded-[2.5rem] border text-center relative overflow-hidden shadow-sm transition-all ${
          isDark ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-slate-200"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Kendi Hikayeni Başlat
            </h2>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-zinc-500" : "text-slate-500"}`}>
              Dijital dünyadaki premium duruşunuzu Clinkor'un esnek şablonları ve analiz altyapısı ile anında hayata geçirin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-neon-blue to-light-blue text-white font-black text-xs shadow-lg hover:opacity-90 transition-all border-0 text-center"
              >
                Hemen Ücretsiz Başla
              </Link>
              <Link
                href="/sablonlar"
                className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-xs hover:opacity-90 transition-all text-center"
              >
                Şablonları Keşfet
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
