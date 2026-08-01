import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://www.clinkor.com";

// Admin, panel, auth ve dahili rotalari filtreleyen kara liste
const BLACKLIST_PATTERNS = [
  /\/admin/,
  /\/panel/,
  /\/dashboard/,
  /\/login/,
  /\/register/,
  /\/auth/,
  /\/sign-in/,
  /\/sign-up/,
  /\/super-admin/,
  /\/api/,
  /\/checkout-success/,
  /\/click/,
];

function isBlacklisted(path: string): boolean {
  return BLACKLIST_PATTERNS.some((pattern) => pattern.test(path));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statik public rotalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sablonlar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/eklentiler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kesfet`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/yardim`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/qr-olusturucu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ozel-tasarim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/magaza-temalari`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/discover`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cerez-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/gizlilik-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/gizlilik`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/kullanim-sartlari`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sartlar`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dinamik kullanici profil rotalari
  try {
    const users = await db.user.findMany({
      where: {
        isBanned: false,
        username: { not: null },
      },
      select: {
        username: true,
        updatedAt: true,
      },
    });

    const userRoutes: MetadataRoute.Sitemap = users
      .filter((user) => user.username && !isBlacklisted(`/${user.username}`))
      .map((user) => ({
        url: `${BASE_URL}/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));

    // Blog yazilarini da ekle
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
      const posts = await db.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      });
      blogRoutes = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    } catch {
      // BlogPost modeli yoksa veya hata olusursa sessizce gec
    }

    return [...staticRoutes, ...userRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Sitemap: Veriler alinamadi:", error);
    return staticRoutes;
  }
}
