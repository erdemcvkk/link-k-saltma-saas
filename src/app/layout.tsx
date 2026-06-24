import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { trTR } from "@clerk/localizations";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Footer from "@/components/Footer";
import GlobalHeader from "@/components/GlobalHeader";
import { auth } from "@clerk/nextjs/server";
import "./globals.css";
import "./theme/theme.css";
import ThemeInitializer from "./theme/ThemeInitializer";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinkor | Biyografi ve Link Yönetimi",
  description: "Clinkor, sosyal medya hesaplarınızı, dijital ürünlerinizi, eklentilerinizi ve bağlantılarınızı tek bir şık biyografi sayfasında toplamanıza ve analiz etmenize imkan tanıyan lider link yönetim platformudur.",
};

const DEFAULT_FONTS = [
  { name: "Inter", value: "Inter", tier: "FREE" },
  { name: "Roboto", value: "Roboto", tier: "FREE" },
  { name: "Outfit", value: "Outfit", tier: "FREE" },
  { name: "Playfair Display", value: "Playfair Display", tier: "FREE" },
  { name: "Courier Prime", value: "Courier Prime", tier: "FREE" },
  { name: "Fira Sans", value: "Fira Sans", tier: "FREE" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", tier: "FREE" },
  { name: "Merriweather", value: "Merriweather", tier: "FREE" },
  { name: "Lora", value: "Lora", tier: "FREE" },
  { name: "Montserrat", value: "Montserrat", tier: "FREE" },
  { name: "Poppins", value: "Poppins", tier: "FREE" },
  { name: "Open Sans", value: "Open Sans", tier: "FREE" },
  { name: "Lato", value: "Lato", tier: "FREE" },
  { name: "Oswald", value: "Oswald", tier: "FREE" },
  { name: "Raleway", value: "Raleway", tier: "FREE" },
  { name: "Nunito", value: "Nunito", tier: "FREE" },
  { name: "Rubik", value: "Rubik", tier: "FREE" },
  { name: "Quicksand", value: "Quicksand", tier: "FREE" },
  { name: "Kanit", value: "Kanit", tier: "FREE" },
  { name: "Ubuntu", value: "Ubuntu", tier: "FREE" },
  { name: "Manrope", value: "Manrope", tier: "FREE" },
  { name: "Syne", value: "Syne", tier: "STARTER" },
  { name: "Space Grotesk", value: "Space Grotesk", tier: "STARTER" },
  { name: "DM Sans", value: "DM Sans", tier: "STARTER" },
  { name: "Cormorant Garamond", value: "Cormorant Garamond", tier: "STARTER" },
  { name: "Cinzel", value: "Cinzel", tier: "STARTER" },
  { name: "Bebas Neue", value: "Bebas Neue", tier: "STARTER" },
  { name: "Sora", value: "Sora", tier: "STARTER" },
  { name: "Cabinet Grotesk", value: "Cabinet Grotesk", tier: "STARTER" },
  { name: "Clash Display", value: "Clash Display", tier: "STARTER" },
  { name: "Cabinet", value: "Cabinet", tier: "STARTER" },
  { name: "Josefin Sans", value: "Josefin Sans", tier: "STARTER" },
  { name: "Comfortaa", value: "Comfortaa", tier: "STARTER" },
  { name: "Fredoka", value: "Fredoka", tier: "STARTER" },
  { name: "Syncopate", value: "Syncopate", tier: "STARTER" },
  { name: "Calistoga", value: "Calistoga", tier: "CREATOR" },
  { name: "Lexend", value: "Lexend", tier: "CREATOR" },
  { name: "Archivo Black", value: "Archivo Black", tier: "CREATOR" },
  { name: "Pacifico", value: "Pacifico", tier: "CREATOR" },
  { name: "Lobster", value: "Lobster", tier: "CREATOR" },
  { name: "Permanent Marker", value: "Permanent Marker", tier: "CREATOR" },
  { name: "Righteous", value: "Righteous", tier: "CREATOR" },
  { name: "Satisfy", value: "Satisfy", tier: "CREATOR" },
  { name: "Unbounded", value: "Unbounded", tier: "CREATOR" },
  { name: "Dela Gothic One", value: "Dela Gothic One", tier: "CREATOR" },
  { name: "Italiana", value: "Italiana", tier: "CREATOR" },
  { name: "Cabinet Display", value: "Cabinet Display", tier: "CREATOR" },
  { name: "Rowdy", value: "Rowdy", tier: "CREATOR" },
  { name: "Space Mono", value: "Space Mono", tier: "CREATOR" },
  { name: "Cinzel Decorative", value: "Cinzel Decorative", tier: "CREATOR" }
];

const PUBLIC_SAAS_ROUTES = [
  "/",
  "/blog",
  "/sablonlar",
  "/eklentiler",
  "/qr-olusturucu",
  "/ozel-tasarim",
  "/yardim",
  "/sartlar",
  "/kullanim-sartlari",
  "/gizlilik",
  "/cookies",
  "/gizlilik-politikasi",
  "/cerez-politikasi",
  "/hakkimizda",
  "/hakkımızda",
  "/discover",
  "/kesfet"
];

function isPublicSaaSPage(path: string): boolean {
  if (PUBLIC_SAAS_ROUTES.includes(path)) return true;
  if (path.startsWith("/blog/")) return true;
  return false;
}

export default async function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
  // Fetch site settings for favicon and title dynamically
  let faviconUrl = "/clinkor-fav-icon.png";
  let siteTitle = "Clinkor - Lider Profil ve Link Yönetimi";
  let siteLogo = "";
  let googleFontsUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@400;750;900&display=swap";
  let footerVisibilityMode = "ALL_PAGES";
  let userId: string | null = null;

  try {
    const session = await auth();
    userId = session?.userId || null;
  } catch (e) {
    // Suppress Clerk auth load errors during build
  }

  try {
    const settings = await db.globalSetting.findMany();
    const serializedSettings = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    if (serializedSettings["site_favicon"]) {
      faviconUrl = serializedSettings["site_favicon"];
    }

    if (serializedSettings["site_logo"]) {
      siteLogo = serializedSettings["site_logo"];
    }

    if (serializedSettings["site_title"]) {
      siteTitle = serializedSettings["site_title"].toLowerCase().includes("clinkor")
        ? serializedSettings["site_title"]
        : `Clinkor | ${serializedSettings["site_title"]}`;
    } else {
      siteTitle = "Clinkor | Biyografi ve Link Yönetimi";
    }

    if (serializedSettings["footer_visibility_mode"]) {
      footerVisibilityMode = serializedSettings["footer_visibility_mode"];
    }

    // Dynamic fonts loading & auto-seeding
    let dbFonts = await db.managedFont.findMany();
    if (dbFonts.length < DEFAULT_FONTS.length) {
      for (const font of DEFAULT_FONTS) {
        try {
          await db.managedFont.upsert({
            where: { name: font.name },
            update: {},
            create: font
          });
        } catch (err) {
          // Ignore unique constraint concurrency errors during build
        }
      }
      dbFonts = await db.managedFont.findMany();
    }

    if (dbFonts.length > 0) {
      const families = dbFonts.map(f => `family=${f.value.replace(/ /g, "+")}`).join("&");
      googleFontsUrl = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    }
  } catch (e) {
    // Suppress db not ready warnings
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const showHeader = isPublicSaaSPage(pathname);

  let showFooter = false;
  if (footerVisibilityMode === "ALL_PAGES") {
    showFooter = isPublicSaaSPage(pathname);
  } else if (footerVisibilityMode === "HOMEPAGE_ONLY") {
    showFooter = pathname === "/";
  } else {
    showFooter = isPublicSaaSPage(pathname);
  }

  return (
    <ClerkProvider localization={trTR}>
      <html
        lang="tr"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <title>{siteTitle}</title>
          <meta name="59957dc67acb43a2825d3417d139f8dcb0d66a47" content="59957dc67acb43a2825d3417d139f8dcb0d66a47" />
          <link rel="icon" href={faviconUrl} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={googleFontsUrl} rel="stylesheet" />
          <ThemeInitializer />
        </head>
        <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
          {showHeader && <GlobalHeader siteLogo={siteLogo} siteTitle={siteTitle} userId={userId} />}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          {showFooter && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}
