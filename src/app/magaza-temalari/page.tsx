import React from "react";
import StorefrontPreview, { StoreThemeType, DummyProduct } from "@/components/storefront-preview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Mağaza Temaları Showcase",
};

interface ThemeShowcaseData {
  id: StoreThemeType;
  name: string;
  desc: string;
  color: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  products: DummyProduct[];
}

const THEMES: ThemeShowcaseData[] = [
  // ── Original 5 ──
  {
    id: "dark-drill",
    name: "Dark Drill / Cyberpunk",
    desc: "Beatmaker & Oyuncular İçin",
    color: "bg-red-500",
    username: "@darkbeat_prod",
    bio: "Müzik Prodüktörü & Tasarımcı",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
    products: [
      { id: "dd1", title: "Karanlık Drill Beat Paketi", type: "Beat", price: "499", imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80" },
      { id: "dd2", title: "808 Bass Loop Kit", type: "Müzik", price: "350", imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80" },
      { id: "dd3", title: "Trap Vocal Preset", type: "Preset", price: "200", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
      { id: "dd4", title: "FL Studio Şablon Paketi", type: "Şablon", price: "650", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80" },
    ],
  },
  {
    id: "glassmorphism",
    name: "Premium Glassmorphism",
    desc: "Tasarımcılar & Sanatçılar İçin",
    color: "bg-purple-500",
    username: "@artisan.studio",
    bio: "Dijital Sanatçı & Fotoğrafçı",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
    products: [
      { id: "gm1", title: "Obsidian Lightroom Presetleri", type: "Preset", price: "300", imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80" },
      { id: "gm2", title: "Soyut Sanat Duvar Kağıdı Seti", type: "Tasarım", price: "150", imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80" },
      { id: "gm3", title: "Moody Film LUT Paketi", type: "Video", price: "450", imageUrl: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=500&q=80" },
      { id: "gm4", title: "Minimalist Logo Şablonu", type: "Tasarım", price: "500", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80" },
    ],
  },
  {
    id: "minimalist",
    name: "Minimalist & Clean",
    desc: "Yazarlar & Danışmanlar İçin",
    color: "bg-zinc-800",
    username: "@coach.mehmet",
    bio: "Yazar & Kariyer Danışmanı",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    products: [
      { id: "mn1", title: "1 Saatlik Birebir Danışmanlık", type: "Hizmet", price: "850", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" },
      { id: "mn2", title: "Minimalist Notion Şablonu", type: "Şablon", price: "150", imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=500&q=80" },
      { id: "mn3", title: "E-Kitap: Üretkenlik Rehberi", type: "E-Kitap", price: "120", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80" },
      { id: "mn4", title: "Haftalık Planlayıcı PDF", type: "Şablon", price: "75", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80" },
    ],
  },
  {
    id: "vibrant-pop",
    name: "Vibrant Creator Pop",
    desc: "Influencer'lar & Yayıncılar İçin",
    color: "bg-orange-500",
    username: "@creative.zeynep",
    bio: "İçerik Üreticisi & YouTuber",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    products: [
      { id: "vp1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "750", imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
      { id: "vp2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "200", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
      { id: "vp3", title: "Canva Tasarım Kit'i", type: "Tasarım", price: "350", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80" },
      { id: "vp4", title: "Podcast Intro Müzikleri", type: "Müzik", price: "180", imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80" },
    ],
  },
  {
    id: "classic",
    name: "Classic E-Commerce",
    desc: "Güven Odaklı Satıcılar İçin",
    color: "bg-blue-500",
    username: "@pixelcraft.design",
    bio: "Premium Dijital Ürün Mağazası",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
    products: [
      { id: "cl1", title: "Premium UX/UI Kit", type: "Tasarım", price: "900", imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80" },
      { id: "cl2", title: "E-Ticaret Figma Şablonu", type: "Şablon", price: "600", imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&q=80" },
      { id: "cl3", title: "İkon Paketi (500+ Adet)", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&q=80" },
      { id: "cl4", title: "Web Sitesi Wireframe Seti", type: "Şablon", price: "400", imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80" },
    ],
  },
  // ── NEW 5 THEMES ──
  {
    id: "neo-brutalism",
    name: "Neo-Brutalism Manifesto",
    desc: "Geliştiriciler & Sokak Modası İçin",
    color: "bg-[#caff4a]",
    username: "@dev.manifest",
    bio: "Full-Stack Geliştirici & Tasarımcı",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&q=80",
    products: [
      { id: "nb1", title: "Terminal Temalı VS Code Eklentisi", type: "Eklenti", price: "120", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
      { id: "nb2", title: "Mono CLI Dashboard Kit", type: "Araç", price: "350", imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&q=80" },
      { id: "nb3", title: "Brutalist React Komponent Kiti", type: "Kod", price: "500", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&q=80" },
      { id: "nb4", title: "Neon ASCII Art Paketi", type: "Asset", price: "90", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80" },
    ],
  },
  {
    id: "organic-earth",
    name: "Organic Earth",
    desc: "Sağlık Koçları & El Yapımı Ürünler",
    color: "bg-[#8fbc6a]",
    username: "@naturel.coach",
    bio: "Holistik Sağlık & Beslenme Koçu",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    products: [
      { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "180", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80" },
      { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "450", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
      { id: "oe3", title: "Meditasyon Sesli Rehber", type: "Ses", price: "120", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80" },
      { id: "oe4", title: "El Yapımı Sabun Tarifi PDF", type: "Şablon", price: "75", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
    ],
  },
  {
    id: "retro-arcade",
    name: "Retro 8-Bit Arcade",
    desc: "Indie Geliştiriciler & Çizerler İçin",
    color: "bg-[#00ffc8]",
    username: "@PIXEL_DEV",
    bio: "Indie Oyun Geliştiricisi",
    avatarUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80",
    products: [
      { id: "ra1", title: "16-Bit Karakter Sprite Paketi", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
      { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "200", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
      { id: "ra3", title: "Piksel Sanatı Tileset Seti", type: "Asset", price: "350", imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30d4cd?w=500&q=80" },
      { id: "ra4", title: "Retro UI Kit (Godot)", type: "Eklenti", price: "400", imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
    ],
  },
  {
    id: "dark-academia",
    name: "Dark Academia & Vintage",
    desc: "Yazarlar & Tarih Üreticileri İçin",
    color: "bg-[#b4963c]",
    username: "@the.quill",
    bio: "Yazar & Şair",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    products: [
      { id: "da1", title: "Gotik Şiir Derlemesi (PDF)", type: "E-Kitap", price: "150", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
      { id: "da2", title: "Antik Felsefe Okuma Listesi", type: "Rehber", price: "90", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80" },
      { id: "da3", title: "Daktilo Yazı Fontu Koleksiyonu", type: "Font", price: "200", imageUrl: "https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&q=80" },
      { id: "da4", title: "Vintage Kağıt Dokuları Paketi", type: "Asset", price: "120", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80" },
    ],
  },
  {
    id: "y2k-holographic",
    name: "Y2K Holographic",
    desc: "Moda Influencer'ları & Pop Sanatçıları",
    color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
    username: "@glitter.queen",
    bio: "Moda & Lifestyle Influencer",
    avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
    products: [
      { id: "y1", title: "2000'ler Nostalji Fotoğraf Filtreleri", type: "Filtre", price: "200", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80" },
      { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "120", imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80" },
      { id: "y3", title: "Y2K Aesthetic Preset Seti", type: "Preset", price: "300", imageUrl: "https://images.unsplash.com/photo-1618172193622-10473b66bce1?w=500&q=80" },
      { id: "y4", title: "Candy Pop Müzik Jingle'ları", type: "Müzik", price: "180", imageUrl: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=500&q=80" },
    ],
  },
];

export default function StoreThemesShowcase() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-full md:w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white">
              Vitrin<span className="text-rose-500">.Temaları</span>
            </h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">10 Premium Mağaza Tasarım Konsepti</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Panele Dön
          </Link>
        </div>
      </nav>

      <main className="max-w-full md:w-[1800px] mx-auto px-6 py-12">
        <div className="flex overflow-x-auto pb-12 gap-10 snap-x snap-mandatory no-scrollbar">
          {THEMES.map((theme) => (
            <div key={theme.id} className="snap-center shrink-0 flex flex-col items-center">

              <div className="text-center mb-8 h-20 flex flex-col items-center justify-end">
                <div className={`w-3 h-3 rounded-full mb-3 ${theme.color} animate-pulse`} />
                <h2 className="text-2xl font-black text-white mb-1">{theme.name}</h2>
                <p className="text-sm font-medium text-zinc-400">{theme.desc}</p>
              </div>

              {/* Phone Mockup Frame */}
              <div className="relative w-full max-w-sm lg:w-[340px] h-[680px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group">
                <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />

                <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
                  <StorefrontPreview
                    theme={theme.id}
                    products={theme.products}
                    storeTitle={theme.username}
                    username={theme.username}
                    bio={theme.bio}
                    avatarUrl={theme.avatarUrl}
                    storeCoverUrl={theme.coverUrl}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
