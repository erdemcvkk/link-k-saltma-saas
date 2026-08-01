import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin-login/",
        "/super-admin/",
        "/panel/",
        "/dashboard/",
        "/api/",
        "/auth/",
        "/sign-in/",
        "/sign-up/",
        "/login/",
        "/register/",
        "/checkout-success/",
        "/click/",
      ],
    },
    sitemap: "https://www.clinkor.com/sitemap.xml",
  };
}
