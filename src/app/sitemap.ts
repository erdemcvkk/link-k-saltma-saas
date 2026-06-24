import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://clinkor.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik rotalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ozellikler`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fiyatlandirma`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sss`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dinamik kullanici rotalari
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
      .filter((user) => user.username)
      .map((user) => ({
        url: `${BASE_URL}/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));

    return [...staticRoutes, ...userRoutes];
  } catch (error) {
    // Veritabani hatasi durumunda sadece statik rotalari dondur
    console.error("Sitemap: Kullanici verileri alinamadi:", error);
    return staticRoutes;
  }
}
