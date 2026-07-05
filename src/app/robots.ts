import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/admin/",
        "/admin-login/",
        "/super-admin/",
        "/sign-in/",
        "/sign-up/",
      ],
    },
    sitemap: "https://clinkor.com/sitemap.xml",
  };
}
