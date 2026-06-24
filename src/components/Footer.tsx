import { db } from "@/lib/db";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
  </svg>
);

export default async function Footer() {
  let sections = [];
  let appStoreUrl = "";
  let playStoreUrl = "";
  let instagramUrl = "";
  let twitterUrl = "";
  let youtubeUrl = "";
  let siteTitle = "Clinkor";
  let siteLogo = "/clinkor-logo.png";

  try {
    sections = await db.footerSection.findMany({
      include: { links: true },
      orderBy: { order: "asc" },
    });

    if (sections.length === 0) {
      const defaultSections = [
        {
          title: "Kurumsal",
          order: 0,
          links: [
            { label: "Hakkımızda", url: "/hakkimizda", order: 0 },
            { label: "Şablonlar", url: "/sablonlar", order: 1 },
            { label: "Eklentiler", url: "/eklentiler", order: 2 },
          ],
        },
        {
          title: "Topluluk",
          order: 1,
          links: [
            { label: "Keşfet", url: "/discover", order: 0 },
            { label: "Blog", url: "/blog", order: 1 },
            { label: "QR Oluşturucu", url: "/qr-olusturucu", order: 2 },
          ],
        },
        {
          title: "Destek",
          order: 2,
          links: [
            { label: "Yardım Merkezi", url: "/yardim", order: 0 },
            { label: "Özel Tasarlat", url: "/ozel-tasarim", order: 1 },
            { label: "Kullanım Şartları", url: "/kullanim-sartlari", order: 2 },
          ],
        },
      ];

      for (const sec of defaultSections) {
        try {
          await db.footerSection.create({
            data: {
              title: sec.title,
              order: sec.order,
              links: {
                create: sec.links,
              },
            },
          });
        } catch (e) {
          // Ignore unique constraints / concurrency errors
        }
      }

      sections = await db.footerSection.findMany({
        include: { links: true },
        orderBy: { order: "asc" },
      });
    }

    const settings = await db.globalSetting.findMany();
    const serializedSettings = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    appStoreUrl = serializedSettings["app_store_url"] || "";
    playStoreUrl = serializedSettings["play_store_url"] || "";
    instagramUrl = serializedSettings["footer_instagram_url"] || "";
    twitterUrl = serializedSettings["footer_twitter_url"] || "";
    youtubeUrl = serializedSettings["footer_youtube_url"] || "";
    siteTitle = serializedSettings["site_title"] || "Clinkor";
    siteLogo = serializedSettings["site_logo"] || "/clinkor-logo.png";
  } catch (err) {
    console.error("Footer fetch error:", err);
  }

  return (
    <footer className="w-full bg-white border-t border-slate-100 dark:bg-slate-950 dark:border-slate-900 py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pb-12 border-b border-slate-100 dark:border-slate-900">
          {/* Logo & Description */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src={siteLogo} alt={siteTitle} className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-corporate">
              Sosyal medya hesaplarınızı, dijital ürünlerinizi ve bağlantılarınızı tek bir şık biyografi sayfasında toplayın ve analiz edin.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-neon-blue/10 hover:text-neon-blue dark:hover:bg-neon-blue/20 dark:hover:text-neon-blue text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-neon-blue/10 hover:text-neon-blue dark:hover:bg-neon-blue/20 dark:hover:text-neon-blue text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all">
                  <TwitterIcon className="h-4 w-4" />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-neon-blue/10 hover:text-neon-blue dark:hover:bg-neon-blue/20 dark:hover:text-neon-blue text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all">
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Columns */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div key={section.id} className="flex flex-col space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase font-corporate">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links
                    .sort((a, b) => a.order - b.order)
                    .map((link) => {
                      const displayUrl = (link.label === "Hakkımızda" && (link.url === "/" || link.url === "")) ? "/hakkimizda" : link.url;
                      return (
                        <li key={link.id}>
                          <Link
                            href={displayUrl}
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-corporate"
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>

          {/* Apps Download Badge Column */}
          <div className="md:col-span-3 flex flex-col space-y-4 md:items-end">
            {(appStoreUrl || playStoreUrl) && (
              <>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase font-corporate">
                  Mobil Uygulamalar
                </h4>
                <div className="flex flex-row md:flex-col gap-3">
                  {appStoreUrl && (
                    <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="120" height="40" rx="8" fill="#0A0A0A" stroke="#262626" strokeWidth="1"/>
                        <path d="M22.5 16.2c-.1-2.6 2.1-3.9 2.2-4-.1 0-1.7-1.2-3.8-1.4-2.1-.2-4.1 1.2-5.2 1.2-1.1 0-2.8-1.2-4.5-1.2-2.3 0-4.4 1.3-5.6 3.4-2.4 4.1-.6 10.2 1.7 13.5 1.1 1.6 2.4 3.4 4.2 3.3 1.7-.1 2.4-1.1 4.5-1.1 2 0 2.7 1.1 4.4 1.1 1.8 0 3-.1 4.1-1.7 1.3-1.9 1.8-3.7 1.9-3.8-.1 0-3.3-1.3-3.3-5.1" fill="white"/>
                        <path d="M18.8 9.5c.9-1.1 1.5-2.7 1.4-4.2-1.3.1-2.9.9-3.8 2-1 1.1-1.6 2.7-1.4 4.2 1.5.1 3-.9 3.8-2" fill="white"/>
                        <text x="38" y="16" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Download on the</text>
                        <text x="38" y="28" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">App Store</text>
                      </svg>
                    </a>
                  )}
                  {playStoreUrl && (
                    <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="120" height="40" rx="8" fill="#0A0A0A" stroke="#262626" strokeWidth="1"/>
                        <g transform="translate(12, 10) scale(0.8)">
                          <path d="M1 1.9v20.2c0 .8.5 1.2 1.1.9l10.3-10.1L2.1 1c-.6-.3-1.1.1-1.1.9z" fill="#00f0ff"/>
                          <path d="M12.4 12.9L2.1 23c.6.3 1.1-.1 1.1-.9V1.9c0-.8-.5-1.2-1.1-.9l10.3 9.9z" fill="#ff007f"/>
                          <path d="M12.4 12.9L16.2 11c.7-.3.7-.9 0-1.2l-3.8-1.9L9.3 11l3.1 1.9z" fill="#ffaa00"/>
                        </g>
                        <text x="38" y="16" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">GET IT ON</text>
                        <text x="38" y="28" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Google Play</text>
                      </svg>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500 space-y-4 sm:space-y-0">
          <div className="font-corporate">
            © {new Date().getFullYear()} {siteTitle}. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-6 font-corporate">
            <Link href="/gizlilik-politikasi" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Çerez Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
