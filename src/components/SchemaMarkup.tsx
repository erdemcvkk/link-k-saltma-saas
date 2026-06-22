import React from "react";

interface SchemaMarkupProps {
  type: "software" | "person" | "faq";
  data?: {
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  };
  faqs?: Array<{ question: string; answer: string }>;
}

export default function SchemaMarkup({ type, data, faqs }: SchemaMarkupProps) {
  const schema = (() => {
    if (type === "software") {
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Clinkor",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "TRY"
        },
        "description": "Clinkor, sosyal medya hesaplarınızı, dijital ürünlerinizi, eklentilerinizi ve bağlantılarınızı tek bir şık biyografi sayfasında toplamanıza ve analiz etmenize imkan tanıyan lider link yönetim platformudur."
      };
    } else if (type === "person" && data) {
      const { username = "", displayName = "", bio = "", avatarUrl = "" } = data;
      const cleanUsername = username.replace("@", "");
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": displayName || cleanUsername,
        "alternateName": cleanUsername,
        "description": bio || "Biyografi ve sosyal medya bağlantıları sayfası.",
        ...(avatarUrl ? { "image": avatarUrl } : {}),
        "url": `https://clinkor.com/${cleanUsername}`
      };
    } else if (type === "faq" && faqs) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      };
    }
    return null;
  })();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
