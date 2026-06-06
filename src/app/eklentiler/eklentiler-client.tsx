"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Zap, CreditCard, ChevronRight, Search, ArrowUpDown, ChevronDown } from "lucide-react";
import StorefrontPreview, { StoreThemeType, DummyProduct } from "@/components/storefront-preview";
import { buyAddonAction } from "../actions";

interface AddonTypeData {
 id: string;
 name: string;
 desc: string;
 color: string;
 theme: StoreThemeType;
 mockProducts: DummyProduct[];
 price: string;
 username: string;
 bio: string;
 avatarUrl: string;
 coverUrl?: string;
 category: string;
}

export const ADDON_TYPES: AddonTypeData[] = [
  { 
    id: "MINI_STORE", 
    name: "Dijital Mağaza Modülü", 
    desc: "Dijital veya fiziksel ürünlerinizi doğrudan profilinizde satmaya başlayın.", 
    color: "bg-orange-500",
    theme: "vibrant-pop",
    price: "99",
    username: "@creative.zeynep",
    bio: "İçerik Üreticisi & YouTuber",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    category: "Satış & Gelir",
    mockProducts: [
      { id: "p1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "99", imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
      { id: "p2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "99", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
    ]
  },
  { 
    id: "CORP_EXEC", 
    name: "Modern Alışveriş Vitrini", 
    desc: "Ürünlerinizi modern, temiz ve profesyonel bir tasarımla sergileyin.", 
    color: "bg-blue-600",
    theme: "classic",
    price: "99",
    username: "@ceo.exec",
    bio: "C-Level Executive Consultant",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "ce1", title: "Q3 Business Strategy Plan", type: "Şablon", price: "99", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80" },
      { id: "ce2", title: "Corporate Restructuring Guide", type: "E-Kitap", price: "99", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80" }
    ]
  },
  { 
    id: "COMIC_MANGA", 
    name: "Şık & Sade Mağaza", 
    desc: "Sade, şık ve minimal bir tasarımla ürünlerinizi ön plana çıkarın.", 
    color: "bg-[#000000]",
    theme: "neo-brutalism",
    price: "99",
    username: "@manga.artisan",
    bio: "Comic Artist & Illustrator",
    avatarUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "cm1", title: "Digital Ink Brushes Pack", type: "Fırça", price: "99", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80" },
      { id: "cm2", title: "Chapter 1 Manga Panels (RAW)", type: "Comic", price: "99", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80" }
    ]
  },
  { 
    id: "RETRO", 
    name: "Klasik Retro Mağaza", 
    desc: "8-bit atari ve retro oyun estetiğine sahip nostaljik mağaza tasarımı.", 
    color: "bg-[#00ffc8]",
    theme: "retro-arcade",
    price: "99",
    username: "@PIXEL_DEV",
    bio: "Indie Oyun Geliştiricisi",
    avatarUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "ra1", title: "16-Bit Sprite Paketi", type: "Asset", price: "99", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
      { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "99", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
    ]
  },
  { 
    id: "ACADEMIA", 
    name: "Kolej Modülü", 
    desc: "Dark academia tarzında, kitaplar, yazarlar ve eğitmenler için şık tasarım.", 
    color: "bg-[#b4963c]",
    theme: "dark-academia",
    price: "99",
    username: "@the.quill",
    bio: "Yazar & Şair",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "da1", title: "Gotik Şiir Derlemesi (PDF)", type: "E-Kitap", price: "99", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
      { id: "da2", title: "Daktilo Yazı Fontu", type: "Font", price: "99", imageUrl: "https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&q=80" },
    ]
  },
  { 
    id: "NEO_BRUTAL", 
    name: "Neo Brutalist Vitrin", 
    desc: "Kalın çizgiler ve yüksek kontrastlı renklerle modern brutalist tasarım.", 
    color: "bg-[#caff4a]",
    theme: "neo-brutalism",
    price: "99",
    username: "@dev.manifest",
    bio: "Full-Stack Geliştirici & Tasarımcı",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "nb1", title: "Terminal VS Code Eklentisi", type: "Eklenti", price: "99", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
      { id: "nb2", title: "Brutalist React Kit", type: "Kod", price: "99", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&q=80" },
    ]
  },
  { 
    id: "ORGANIC", 
    name: "Organik & Doğal Vitrin", 
    desc: "Doğal tonlar ve yumuşak hatlarla organik ürünleriniz için yeşil tasarım.", 
    color: "bg-[#8fbc6a]",
    theme: "organic-earth",
    price: "99",
    username: "@naturel.coach",
    bio: "Holistik Sağlık & Beslenme Koçu",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "99", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80" },
      { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "99", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
    ]
  },
  { 
    id: "Y2K", 
    name: "Neon & Gece Hayatı Vitrin", 
    desc: "Fütüristik neon ışıkları ve holografik esintiler sunan özel tasarım.", 
    color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
    theme: "y2k-holographic",
    price: "99",
    username: "@glitter.queen",
    bio: "Moda & Lifestyle Influencer",
    avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "y1", title: "2000'ler Nostalji Filtreleri", type: "Filtre", price: "99", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80" },
      { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "99", imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80" },
    ]
  },
  { 
    id: "EDITORIAL_LUX", 
    name: "Editöryel & Lüks Vitrin", 
    desc: "Dergi kapağı zarafetinde, lüks ve moda markaları için ultra elit tasarım.", 
    color: "bg-[#0f172a]",
    theme: "minimalist",
    price: "99",
    username: "@maison.luxury",
    bio: "High-End Fashion Label",
    avatarUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "e1", title: "Summer Collection Catalog", type: "PDF", price: "99", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80" },
      { id: "e2", title: "Private Styling Session", type: "Toplantı", price: "99", imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80" }
    ]
  },
  { 
    id: "GAMER_HUB", 
    name: "Canlı & Popüler Vitrin", 
    desc: "Yayıncılar, gamerlar ve esporcular için dinamik ve enerjik vitrin.", 
    color: "bg-green-500",
    theme: "vibrant-pop",
    price: "99",
    username: "@phoenix.gg",
    bio: "Twitch Partner & Pro Gamer",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "g1", title: "Gamer Setup Presets", type: "Şablon", price: "99", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
      { id: "g2", title: "1-on-1 Coaching Session", type: "Koçluk", price: "99", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" }
    ]
  },
  { 
    id: "PREMIUM_CREATOR", 
    name: "Premium Creator Vitrini", 
    desc: "Dijital ürünlerinizi en üst düzey lüks ve zarafetle sunan yaratıcı şablon.", 
    color: "bg-zinc-900",
    theme: "premium-creator",
    price: "99",
    username: "@kreator",
    bio: "Premium Beatmaker & Eğitmen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "pc1", title: "Mastering Eğitimi (Video)", type: "Eğitim", price: "99", imageUrl: "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=500&q=80" },
      { id: "pc2", title: "Özel Lo-Fi Beat Paketi", type: "Beat", price: "99", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
    ]
  },
  { 
    id: "PREMIUM_VIDEO", 
    name: "Premium Video Eğitimi", 
    desc: "Eğitim veya masterclass videolarınızı sinematik şekilde sunup izletin.", 
    color: "bg-red-500",
    theme: "premium-video",
    price: "99",
    username: "@masterclass",
    bio: "Video Eğitimi",
    avatarUrl: "",
    category: "Satış & Gelir",
    mockProducts: []
  },
  { 
    id: "MUSIC_PODCAST", 
    name: "Müzik & Podcast Çalar", 
    desc: "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin.", 
    color: "bg-purple-600",
    theme: "classic",
    price: "99",
    username: "@podcast.wave",
    bio: "Beatmaker & Podcaster",
    avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "PORTFOLIO_GALLERY", 
    name: "Portfolyo & Galeri", 
    desc: "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin.", 
    color: "bg-slate-400",
    theme: "classic",
    price: "99",
    username: "@art.portfolio",
    bio: "Visual Artist & Designer",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: []
  },
  { 
    id: "COUNTDOWN_LAUNCH", 
    name: "Geri Sayım & Lansman", 
    desc: "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç.", 
    color: "bg-orange-500",
    theme: "classic",
    price: "99",
    username: "@launch.timer",
    bio: "Product Launcher & Innovator",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: []
  },
  { 
    id: "TESTIMONIALS", 
    name: "Müşteri Yorumları", 
    desc: "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.", 
    color: "bg-teal-500",
    theme: "classic",
    price: "99",
    username: "@trust.reviews",
    bio: "E-Commerce Business Consultant",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    category: "Etkileşim & Araçlar",
    mockProducts: []
  },
  { 
    id: "SPOTIFY_CLASSIC", 
    name: "Spotify Classic Player", 
    desc: "Orijinal ve ikonik Spotify görünümünde parça veya çalma listesi oynatıcısı.", 
    color: "bg-[#1db954]",
    theme: "classic",
    price: "99",
    username: "@spotify.classic",
    bio: "Original Spotify Look",
    avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "VINYL_RETRO", 
    name: "Retro Plak Oynatıcı", 
    desc: "Nostaljik ruhu yaşatan, şarkı çalarken dönen retro plak görünümlü oynatıcı.", 
    color: "bg-amber-700",
    theme: "classic",
    price: "99",
    username: "@vinyl.collector",
    bio: "Vintage Plak Sever",
    avatarUrl: "https://images.unsplash.com/photo-1539625318667-15c0b90c6b1b?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "GLASS_AUDIO", 
    name: "Modern Cam Efekti", 
    desc: "Albüm renklerine uyum sağlayan yarı saydam lüks cam tasarımı.", 
    color: "bg-indigo-400",
    theme: "classic",
    price: "99",
    username: "@glass.synth",
    bio: "Ambient & Synthwave Producer",
    avatarUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "NEON_CYBERPUNK", 
    name: "Neon Cyberpunk Player", 
    desc: "Elektronik müzik ve synthwave tutkunları için parlayan neon tasarımlı oynatıcı.", 
    color: "bg-pink-500",
    theme: "classic",
    price: "99",
    username: "@cyberpunk.wave",
    bio: "Synthwave & Cyberpunk Creator",
    avatarUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "MINIMAL_LIGHT_AUDIO", 
    name: "Minimalist Light Player", 
    desc: "Ferah, aydınlık ve dikkat dağıtmayan net tasarımda müzik oynatıcı.", 
    color: "bg-slate-350",
    theme: "classic",
    price: "99",
    username: "@clean.acoustic",
    bio: "Acoustic & Folk Sessions",
    avatarUrl: "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "WEB3_NFT", 
    name: "Web3 & NFT Koleksiyonu", 
    desc: "Kripto, NFT ve Web3 projelerinizi fütüristik karanlık sergi alanında sergileyin.", 
    color: "bg-[#8b5cf6]",
    theme: "dark-drill",
    price: "99",
    username: "@cryptopunk.eth",
    bio: "NFT Artist & Web3 Dev",
    avatarUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&q=80",
    category: "Premium Temalar",
    mockProducts: [
      { id: "w1", title: "Genesis NFT Collectible", type: "NFT", price: "99", imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80" },
      { id: "w2", title: "Solidity Smart Contract Template", type: "Kod", price: "99", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80" }
    ]
  },
  { 
    id: "FAQ", 
    name: "Sıkça Sorulan Sorular", 
    desc: "Sıkça sorulan soruları profilinizde listeleyerek kullanıcılarınızı bilgilendirin.", 
    color: "bg-emerald-500",
    theme: "classic",
    price: "99",
    username: "@pixelcraft.design",
    bio: "Sıkça Sorulan Sorular",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    category: "Etkileşim & Araçlar",
    mockProducts: []
  },
  { 
    id: "BOOKING", 
    name: "Randevu & İletişim", 
    desc: "1-1 Görüşmeler, toplantılar veya randevular ayarlayıp takviminizi yönetin.", 
    color: "bg-zinc-800",
    theme: "minimalist",
    price: "99",
    username: "@coach.mehmet",
    bio: "Yazar & Kariyer Danışmanı",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "Etkileşim & Araçlar",
    mockProducts: [
      { id: "b1", title: "1 Saatlik UI/UX Danışmanlığı", type: "Toplantı", price: "99", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" },
      { id: "b2", title: "Hızlı Kod İncelemesi", type: "Toplantı", price: "99", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
    ]
  },
  { 
    id: "NEWSLETTER", 
    name: "Bülten Aboneliği", 
    desc: "Takipçilerinizden e-posta toplayarak bülten aboneleri kazanın.", 
    color: "bg-purple-500",
    theme: "glassmorphism",
    price: "99",
    username: "@artisan.studio",
    bio: "Dijital Sanatçı & Fotoğrafçı",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    category: "Etkileşim & Araçlar",
    mockProducts: [
      { id: "n1", title: "Haftalık Tasarım Bülteni", type: "Abonelik", price: "99", imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80" },
    ]
  },
  { 
    id: "DONATION", 
    name: "Dijital Kahve İkramı", 
    desc: "Takipçilerinizden destek alın ve dijital kahve ısmarlamalarını sağlayın.", 
    color: "bg-blue-500",
    theme: "classic",
    price: "99",
    username: "@pixelcraft.design",
    bio: "Premium Dijital Ürün Mağazası",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    category: "Satış & Gelir",
    mockProducts: [
      { id: "d1", title: "Bana Bir Kahve Ismarla", type: "Destek", price: "99", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
      { id: "d2", title: "Büyük Destek", type: "Destek", price: "99", imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=500&q=80" },
    ]
  }
];

interface EklentilerClientProps {
  products?: DummyProduct[];
  settings?: Record<string, string>;
  userId?: string | null;
  dbUserId?: string | null;
  purchasedAddons?: string[];
}

export default function EklentilerClient({ products, settings, userId = null, dbUserId = null, purchasedAddons = [] }: EklentilerClientProps = {}) {
  const lang = "tr";
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string[]>(purchasedAddons);
  const [visibleCount, setVisibleCount] = useState(26);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const handlePurchase = async (addonType: string) => {
    setPurchasing(addonType);
    try {
      await buyAddonAction(addonType);
      setPurchased(prev => [...prev, addonType]);
      alert("Eklenti başarıyla satın alındı ve paneline eklendi!");
    } catch (err) {
      alert("Satın alma sırasında bir hata oluştu veya oturumunuz açık değil.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400" />
            <span className="text-xl font-black tracking-tight text-white">Ana Sayfa</span>
          </Link>
          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs md:text-sm transition-all"
              >
                Yönetim Paneli
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue to-light-blue text-white font-bold text-xs md:text-sm transition-all"
              >
                Hemen Üye Ol
              </Link>
            )}
          </div>
        </div>
      </nav>

 <main className="max-w-full md:w-[1800px] mx-auto px-6 py-16">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-3 md:py-2 rounded-full bg-neon-blue/10 text-neon-blue font-bold text-sm mb-6">
 <Zap className="h-4 w-4" />
 <span>26 Premium Eklenti Vitrini</span>
 </div>
 <h1 className="text-2xl md:text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
 Profilinize <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-light-blue">Güç Katın</span>
 </h1>
 <p className="text-lg text-zinc-400 font-medium">
 İhtiyacınıza uygun modülü seçin, tek seferlik ödemeyle ömür boyu kullanın. 26 farklı premium eklenti ve tema arasından seçim yapın.
 </p>
 </div>

 {/* Search + Sort bar */}
 <div className="flex flex-col gap-4 bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm max-w-4xl mx-auto mb-12">
 <div className="flex flex-col sm:flex-row gap-3 items-center">
 <div className="relative flex-1 w-full">
 <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
 <Search className="h-4 w-4" />
 </span>
 <input
 type="text"
 placeholder="Eklenti ara..."
 value={searchQuery}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setVisibleCount(26);
 }}
 className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-neon-blue text-white placeholder-zinc-500 transition-colors"
 />
 </div>

 <div className="relative w-full sm:w-56">
 <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
 <select
 value={sortOption}
 onChange={(e) => {
 setSortOption(e.target.value);
 setVisibleCount(26);
 }}
 className="w-full pl-10 pr-8 py-3 md:py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-neon-blue text-white appearance-none cursor-pointer transition-colors"
 >
 <option value="default">Varsayılan Sıralama</option>
 <option value="name-asc">A → Z (İsim)</option>
 <option value="name-desc">Z → A (İsim)</option>
 <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
 <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
 </select>
 <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
 </div>
 </div>
  {/* Category Pills */}
  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-zinc-800/60 mt-1">
    {["Tümü", "Müzik & Audio", "Satış & Gelir", "Etkileşim & Araçlar", "Premium Temalar"].map((cat) => (
      <button
        key={cat}
        type="button"
        onClick={() => {
          setSelectedCategory(cat);
          setVisibleCount(26);
        }}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
          selectedCategory === cat
            ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-md shadow-neon-blue/10"
            : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>

 <div className="text-center">
 <span className="text-xs font-bold text-zinc-500">
 {(() => {
 const filtered = ADDON_TYPES.filter(a => {
  const name = (settings?.[ `theme_NAME_${a.id}` ] || a.name).toLowerCase();
  const desc = (settings?.[ `theme_DESC_${a.id}` ] || a.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || a.category === selectedCategory;
  return matchesSearch && matchesCategory;
  });
 return `${filtered.length} eklenti bulundu`;
 })()}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-12">
 {ADDON_TYPES
 .filter((addon) => {
  const name = (settings?.[ `theme_NAME_${addon.id}` ] || addon.name).toLowerCase();
  const desc = (settings?.[ `theme_DESC_${addon.id}` ] || addon.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || addon.category === selectedCategory;
  return matchesSearch && matchesCategory;
  })
 .sort((a, b) => {
 const nameA = settings?.[`theme_NAME_${a.id}`] || a.name;
 const nameB = settings?.[`theme_NAME_${b.id}`] || b.name;
 const priceA = Number(settings?.[`theme_PRICE_${a.id}`] || a.price);
 const priceB = Number(settings?.[`theme_PRICE_${b.id}`] || b.price);
 switch (sortOption) {
 case "name-asc": return nameA.localeCompare(nameB, "tr");
 case "name-desc": return nameB.localeCompare(nameA, "tr");
 case "price-asc": return priceA - priceB;
 case "price-desc": return priceB - priceA;
 default: return 0;
 }
 })
 .slice(0, visibleCount).map((addon) => {
 const isPurchased = purchased.includes(addon.id);
 const isProcessing = purchasing === addon.id;
 
 // Eğer veritabanından gelen products varsa ve bu MINI_STORE ise (veya hepsi için), ürünleri ez:
 const displayProducts = (products && products.length > 0 && addon.id === "MINI_STORE") 
 ? products 
 : addon.mockProducts;
 
 // Eğer admin panelinden fiyat güncellendiyse (override) onu kullan
 const displayPrice = settings?.[`theme_PRICE_${addon.id}`] || addon.price;
 const displayName = settings?.[`theme_NAME_${addon.id}`] || addon.name;
 const displayDesc = settings?.[`theme_DESC_${addon.id}`] || addon.desc;
 const paymentUrl = settings?.[`theme_PAYMENT_${addon.id}`];
 
 return (
 <div key={addon.id} className="flex flex-col items-center">
 
 <div className="text-center mb-6 px-4">
 <div className={`w-3 h-3 rounded-full mb-3 mx-auto ${addon.color} animate-pulse`} />
 <h3 className="text-xl font-bold text-white mb-2">{displayName}</h3>
 <p className="text-sm text-zinc-400 font-medium leading-relaxed h-[40px] flex items-center justify-center">
 {displayDesc}
 </p>
 </div>

 {/* Phone Mockup Frame */}
 <div className="relative w-full aspect-[1/2] max-w-full max-w-sm lg:w-[340px] mx-auto bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group mb-6">
 <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />
 
 <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
 {addon.id === "PREMIUM_VIDEO" ? (
  <div className="w-full h-full bg-black flex flex-col p-4 relative z-0">
  {/* 16:9 Media Player Area */}
  <div className="w-full aspect-video rounded-2xl bg-zinc-900 mt-6 relative shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden group">
  {/* Mock Cover Image */}
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
  {/* Glassmorphism Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 transition-all cursor-pointer">
  <span className="text-2xl ml-1">▶</span>
  </div>
  </div>
  </div>
  
  {/* Text Content */}
  <div className="flex flex-col mt-6 flex-1">
  <h1 className="text-xl font-bold text-white tracking-tight mb-2">UI/UX Masterclass Bölüm 1</h1>
  <p className="text-zinc-400 text-sm leading-relaxed mb-6">Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin.</p>
  
  <div className="mt-auto pb-4">
  <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors pointer-events-none">
  Tamamını İzle
  </button>
  </div>
  </div>
  </div>
  ) : addon.id === "SPOTIFY_CLASSIC" ? (
  <div className="w-full h-full bg-zinc-950 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-md overflow-hidden border border-zinc-800 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
      <p className="text-[10px] text-green-500 font-bold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-zinc-900 rounded-2xl p-4 mt-2 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Classic Track</h4>
          <p className="text-[9px] text-zinc-400">Artists & Friends</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-sm cursor-pointer">⏮</span>
          <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(34,197,94,0.4)] cursor-pointer">
            <span className="text-xs ml-0.5">▶</span>
          </button>
          <span className="text-green-500 text-sm cursor-pointer">⏭</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
        </div>
        <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
          <span>1:12</span>
          <span>3:45</span>
        </div>
      </div>
    </div>
  </div>
  ) : addon.id === "VINYL_RETRO" ? (
  <div className="w-full h-full bg-stone-900 flex flex-col p-6 text-orange-400 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-2">
      <span className="text-xs font-bold text-stone-200">{addon.username}</span>
      <p className="text-[9px] text-orange-400/70 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Vinyl Record */}
    <div className="flex justify-center my-2">
      <div className="w-24 h-24 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">
        {/* Record Grooves */}
        <div className="absolute inset-2 rounded-full border border-stone-850"></div>
        <div className="absolute inset-4 rounded-full border border-stone-850"></div>
        {/* Record Label */}
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center p-0.5">
          <div className="w-2 h-2 rounded-full bg-stone-900"></div>
        </div>
      </div>
    </div>
    
    <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800 text-center space-y-2 mt-auto">
      <h4 className="text-[10px] font-bold text-stone-300">Retro Vinyl Selection</h4>
      <div className="flex items-center justify-center gap-4 text-orange-400">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">
          <span className="text-[10px] ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "GLASS_AUDIO" ? (
  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
    </div>
    
    {/* Glassmorphism Player Card */}
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 mt-2 space-y-3 shadow-xl">
      <div className="text-center">
        <h4 className="text-xs font-extrabold text-white">Glass Ambient Track</h4>
        <p className="text-[9px] text-purple-100/80">Lofi & Chillwave</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-white">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-9 h-9 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">
          <span className="text-xs ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "NEON_CYBERPUNK" ? (
  <div className="w-full h-full bg-black flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-widest text-pink-500">{addon.username}</span>
    </div>
    
    {/* Neon Cyberpunk Player Card */}
    <div className="bg-black border border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] rounded-none p-4 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Cyber City Beats</h4>
          <p className="text-[8px] text-pink-400 uppercase">Synthwave mix</p>
        </div>
        <button className="w-9 h-9 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_10px_rgba(236,72,153,0.8)] cursor-pointer">
          <span className="text-xs">▶</span>
        </button>
      </div>
      
      {/* Cyan/Pink neon accent lines */}
      <div className="w-full h-0.5 bg-zinc-900 relative">
        <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
      </div>
    </div>
  </div>
  ) : addon.id === "MINIMAL_LIGHT_AUDIO" ? (
  <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-slate-800">{addon.username}</span>
      <p className="text-[9px] text-slate-500 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Minimalist Light Card */}
    <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-4 mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-800">Clean Acoustic Session</h4>
          <p className="text-[9px] text-slate-500">Live Recording</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border-0 shadow-sm cursor-pointer">
          <span className="text-xs ml-0.5">▶</span>
        </button>
      </div>
      
      {/* Light Progress Bar */}
      <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>
      </div>
    </div>
  </div>
  ) : addon.id === "MUSIC_PODCAST" ? (
  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-purple-300">{addon.username}</span>
      <p className="text-[10px] text-purple-200/60 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Summer Beats 2026</h4>
          <p className="text-[10px] text-purple-300">Podcast & Instrumental</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          <span className="text-xs ml-0.5">▶</span>
        </button>
      </div>
      
      <div className="flex items-end gap-1 justify-center h-8 pt-2">
        <div className="w-1 bg-pink-500 h-3 rounded-full animate-pulse"></div>
        <div className="w-1 bg-pink-500 h-6 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 bg-pink-500 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 bg-pink-500 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 bg-pink-500 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="w-1 bg-pink-500 h-7 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-1 bg-pink-500 h-3 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      </div>
    </div>
  </div>
  ) : addon.id === "PORTFOLIO_GALLERY" ? (
  <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-200 rounded-none overflow-hidden border border-slate-300">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-slate-600">{addon.username}</span>
      <p className="text-[10px] text-slate-400 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
  ) : addon.id === "COUNTDOWN_LAUNCH" ? (
  <div className="w-full h-full bg-orange-500 flex flex-col p-6 text-black relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-wide">{addon.username}</span>
      <p className="text-[10px] text-zinc-900/70 font-semibold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-black text-white rounded-3xl p-4 mt-2 border border-black/10 text-center space-y-3 shadow-lg">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Lansmana Kalan Süre</h4>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">03</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">14</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">59</span>
        </div>
      </div>
    </div>
  </div>
  ) : addon.id === "TESTIMONIALS" ? (
  <div className="w-full h-full bg-teal-50 flex flex-col p-6 text-zinc-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-teal-800">{addon.username}</span>
      <p className="text-[10px] text-teal-650 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-white rounded-2xl p-4 mt-2 border border-zinc-100 shadow-sm space-y-2">
      <div className="flex gap-0.5 text-yellow-400">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <p className="text-[10px] text-zinc-600 italic leading-relaxed">
        "Harika bir ürün, kesinlikle tavsiye ediyorum! Hayatımı çok kolaylaştırdı."
      </p>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-zinc-300 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className="w-full h-full object-cover" />
        </div>
        <span className="text-[9px] font-bold text-zinc-700">Elif Y.</span>
      </div>
    </div>
  </div>
  ) : addon.id === "FAQ" ? (
  <div className="w-full h-full bg-[#fcfcfd] flex flex-col p-6 text-zinc-800 relative z-0">
    <div className="bg-white rounded-2xl p-4 mt-8 border border-zinc-200 shadow-md">
      <h1 className="text-[10px] font-black text-slate-800 tracking-tight text-center mb-3">Sıkça Sorulan Sorular</h1>
      <div className="space-y-2 mb-2 max-h-[140px] overflow-y-auto no-scrollbar">
        <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-2.5 text-left">
          <p className="text-[9px] font-bold text-slate-800">Kargo ne zaman ulaşır?</p>
          <p className="text-[8px] text-slate-600 mt-1">Siparişiniz 2-3 iş günü içinde adresinize teslim edilir.</p>
        </div>
      </div>
      <button className="w-full py-2 rounded-xl bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 transition-colors shadow-sm pointer-events-none">
        İletişim
      </button>
    </div>
  </div>
  ) : addon.id === "WEB3_NFT" ? (
    <div className="w-full h-full bg-[#0B0A10] flex flex-col p-6 text-white relative z-0 shadow-[inset_0_0_50px_rgba(139,92,246,0.2)]">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-purple-500/30">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-bold mt-2 text-purple-400 tracking-wider font-mono">{addon.username}</span>
        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-[#161424]/80 backdrop-blur-md rounded-none p-4 mt-2 border border-purple-500/50 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">Web3 Project alpha</h4>
            <p className="text-[8px] text-purple-300 font-mono">Floor: 1.45 ETH</p>
          </div>
          <div className="w-8 h-8 rounded-none bg-purple-600 flex items-center justify-center text-white cursor-pointer font-bold text-xs">
            ▲
          </div>
        </div>
      </div>
    </div>
  ) : addon.id === "EDITORIAL_LUX" ? (
    <div className="w-full h-full bg-[#FDFBF7] flex flex-col p-6 text-slate-900 relative z-0">
      <div className="flex flex-col items-center mt-8 mb-4">
        <div className="w-20 h-28 bg-zinc-200 rounded-t-full rounded-b-md overflow-hidden border border-slate-200">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-serif italic mt-3 tracking-wide">{addon.username}</span>
        <p className="text-[8px] tracking-[0.2em] text-slate-500 uppercase mt-1">{addon.bio}</p>
      </div>
      
      <div className="border border-slate-900 p-4 mt-auto space-y-2 text-center bg-transparent">
        <h4 className="text-xs font-serif tracking-wide text-slate-800">L'Édition Estivale</h4>
        <button className="w-full py-2 bg-transparent border border-slate-900 text-slate-900 font-serif text-[10px] tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-colors cursor-pointer">
          Découvrir
        </button>
      </div>
    </div>
  ) : addon.id === "GAMER_HUB" ? (
    <div className="w-full h-full bg-zinc-900 flex flex-col p-6 text-white relative z-0">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-xl border-4 border-green-500 overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-black mt-2 text-green-400 tracking-wider uppercase">{addon.username}</span>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-zinc-950 border-2 border-zinc-800 p-4 mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Live Now</span>
          </div>
          <span className="text-[9px] font-bold text-green-400">12,420 Viewers</span>
        </div>
        <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-black font-black uppercase text-[10px] tracking-wider transition-colors border-0 cursor-pointer">
          Watch Stream
        </button>
      </div>
    </div>
  ) : addon.id === "CORP_EXEC" ? (
    <div className="w-full h-full bg-slate-50 flex flex-col relative z-0 text-slate-800 overflow-hidden">
      <div className="bg-slate-900 h-28 w-full flex flex-col justify-end p-4 relative">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded">PRO</div>
      </div>
      
      <div className="flex flex-col items-center -mt-10 px-6 mb-4 relative z-10">
        <div className="w-20 h-20 bg-white rounded-full border-4 border-white overflow-hidden shadow-md">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-extrabold mt-2 text-slate-800">{addon.username}</span>
        <p className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-xl p-4 mx-6 mt-1 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-800">Q3 Executive Briefing</h4>
            <p className="text-[8px] text-slate-400">Corporate & Strategy</p>
          </div>
        </div>
        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg tracking-wide transition-colors border-0 cursor-pointer">
          Schedule Consultation
        </button>
      </div>
    </div>
  ) : addon.id === "COMIC_MANGA" ? (
    <div className="w-full h-full bg-white flex flex-col p-6 text-black relative z-0">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-white rounded-none border-4 border-black overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-extrabold mt-3 tracking-wide uppercase border-2 border-black px-2 py-0.5 bg-yellow-300 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{addon.username}</span>
        <p className="text-[9px] font-semibold text-zinc-650 mt-2">{addon.bio}</p>
      </div>
      
      <div className="bg-white border-2 border-black p-4 mt-2 space-y-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div>
          <h4 className="text-xs font-black uppercase tracking-tight">Episode 4: Inked!</h4>
          <p className="text-[8px] text-zinc-700">Digital Comic Panels</p>
        </div>
        <button className="w-full py-2 bg-white border-2 border-black text-black font-black uppercase text-[10px] tracking-wide shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0px_0px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer">
          Read Chapter
        </button>
      </div>
    </div>
  ) : (
  <StorefrontPreview 
  theme={addon.theme as any} 
  products={displayProducts} 
  storeTitle={addon.name}
  username={addon.username}
  bio={addon.bio}
  avatarUrl={addon.avatarUrl}
  storeCoverUrl={addon.coverUrl}
  />
  )}
 </div>
 </div>

  {/* Buy Section */}
  <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center flex flex-col gap-3">
    <div className="text-2xl font-black text-white">
      {displayPrice === "0" ? (lang === "tr" ? "Ücretsiz" : "Free") : `₺${displayPrice}`}
    </div>
    {isPurchased ? (
      <button disabled className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold flex items-center justify-center gap-2">
        <ShoppingBag className="h-4 w-4" /> Satın Alındı
      </button>
    ) : (
      <button 
        onClick={() => {
          if (displayPrice === "0") {
            if (paymentUrl) {
              window.location.href = paymentUrl;
            } else {
              handlePurchase(addon.id);
            }
          } else {
            if (!userId || !dbUserId) {
              alert(lang === "tr" ? "Satın almak için lütfen önce giriş yapın." : "Please sign in to purchase.");
              window.location.href = "/sign-in";
              return;
            }
            // "Hemen Satın Al" redirect to checkout API route
            window.location.href = `/api/checkout?userId=${dbUserId}&moduleId=${addon.id}`;
          }
        }}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 transition-all border-0 shadow-lg shadow-neon-blue/10 disabled:opacity-50 cursor-pointer"
      >
        {isProcessing 
          ? "İşleniyor..." 
          : displayPrice === "0" 
            ? (lang === "tr" ? "Aktif Et" : "Activate Now") 
            : (lang === "tr" ? "Hemen Satın Al" : "Buy Now")}
      </button>
    )}
    <p className="text-xs text-zinc-500 font-medium">
      {displayPrice === "0" ? (lang === "tr" ? "Sınırsız Kullanım" : "Lifetime Free") : (lang === "tr" ? "Tek Seferlik Ödeme" : "One-Time Payment")}
    </p>
  </div>

 </div>
 );
 })}
 </div>

 {visibleCount < ADDON_TYPES.length && (
 <div className="flex justify-center pt-4 pb-8">
 <button
 onClick={() => setVisibleCount(prev => prev + 4)}
 className="px-4 md:px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-white font-bold transition-all flex items-center gap-2"
 >
 Devamını Gör
 </button>
 </div>
 )}
 </main>
 </div>
 );
}
