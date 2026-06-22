// Merkezi Sablon Motoru (Template Engine)
// Tum sablon parse mantigi bu dosyada merkezilesmistir.
// Admin, Dashboard ve Canli Profil ayni fonksiyonu kullanir.
//
// Bu modul saf (pure) fonksiyonlar icerir, React bagimliligi yoktur.
// Hem Server hem Client Component'lardan import edilebilir.

export interface TemplateUserProfile {
  username?: string | null;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface TemplateLink {
  title?: string;
  url?: string;
  animation?: string;
  bgColor?: string | null;
  textColor?: string | null;
  [key: string]: any;
}

/**
 * Dinamik sablon HTML'ini kullanici verileriyle isleyerek nihai HTML ciktisini uretir.
 *
 * Islem adimlari:
 * 1. JSON config ve profil degiskenlerini {{key}} soz dizimi ile eslestirir.
 * 2. [LINK_LOOP]...[/LINK_LOOP] bloklarini kullanicinin link dizisi ile genisletir.
 * 3. Geriye donuk uyumluluk icin indeksli link placeholder'larini ({{link1Title}} vb.) isler.
 * 4. Kullanilmayan indeksli placeholder'lari ve bunlari saran HTML etiketlerini temizler.
 *
 * @param htmlString - Sablonun ham customHtml icerigi
 * @param userProfile - Kullanicinin profil verileri (username, bio, avatarUrl)
 * @param userLinks - Kullanicinin aktif link dizisi
 * @param jsonConfigStr - Sablonun JSON yapilandirma string'i (opsiyonel)
 * @returns Islenmis HTML string'i
 */
export interface TemplateParts {
  customHtml?: string | null;
  masterLayoutHtml?: string | null;
  avatarHtml?: string | null;
  headerHtml?: string | null;
  socialHtml?: string | null;
  linksHtml?: string | null;
  backgroundHtml?: string | null;
  customCss?: string | null;
}

export function renderTemplate(
  templateInput: string | TemplateParts | null | undefined,
  userProfile: TemplateUserProfile,
  userLinks: TemplateLink[],
  jsonConfigStr?: string | null,
  socialLinks?: Record<string, string> | Array<{ socialPlatform: string; socialUrl: string }> | null,
  templateSettings?: Record<string, any> | null
): { html: string; css: string | null } {
  if (!templateInput) return { html: "", css: null };

  const isSlotBased = typeof templateInput === 'object' && templateInput !== null && !!(templateInput.masterLayoutHtml);
  
  let activeSocialLinks = socialLinks;
  if (
    (!activeSocialLinks || 
     (Array.isArray(activeSocialLinks) && activeSocialLinks.length === 0) || 
     (!Array.isArray(activeSocialLinks) && Object.keys(activeSocialLinks).length === 0)) && 
    templateSettings
  ) {
    activeSocialLinks = templateSettings.socialLinks || templateSettings.sociallinks || null;
  }
  
  // JSON config parse
  let parsedConfig: Record<string, any> | null = null;
  if (jsonConfigStr && typeof jsonConfigStr === "string" && jsonConfigStr.trim()) {
    try {
      parsedConfig = JSON.parse(jsonConfigStr);
    } catch (e) {
      // Gecersiz JSON sessizce atlanir
    }
  }

  // Profil degiskenleri haritasi
  const profileReplacements: Record<string, string> = {
    username: userProfile?.username || "",
    displayName: userProfile?.displayName || userProfile?.username || "",
    bio: userProfile?.bio || "",
    avatarUrl: userProfile?.avatarUrl || "",
  };

  // Yardimci fonksiyon: Degiskenleri isler ({{key}})
  const processVariables = (html: string | null | undefined) => {
    if (!html) return "";
    let processed = html.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/gi, (match: string, key: string) => {
      const lowerKey = key.toLowerCase();
      
      // Oncelik 0: Eger global profil verileriyse (avatarUrl, displayName, bio, username), KESINLIKLE userProfile modelinden al!
      if (["avatarurl", "displayname", "bio", "username"].includes(lowerKey)) {
        const matchedProfileKey = Object.keys(profileReplacements).find(k => k.toLowerCase() === lowerKey);
        if (matchedProfileKey) {
          return String(profileReplacements[matchedProfileKey]);
        }
      }

      // Oncelik 1: Kullanicinin dinamik form degerleri (templateSettings)
      if (templateSettings && typeof templateSettings === "object") {
        const matchedSettingsKey = Object.keys(templateSettings).find(k => k.toLowerCase() === lowerKey);
        if (matchedSettingsKey) {
          const val = templateSettings[matchedSettingsKey];
          if (val !== undefined && val !== null) {
            if (typeof val === "object") return JSON.stringify(val);
            return String(val);
          }
        }
      }

      // Oncelik 2: JSON config / Schema varsayilan degerleri (defaultValue)
      if (parsedConfig) {
        if (Array.isArray(parsedConfig)) {
          const foundField = parsedConfig.find(item => item && typeof item === 'object' && item.name && item.name.toLowerCase() === lowerKey);
          if (foundField) {
            return foundField.defaultValue !== undefined && foundField.defaultValue !== null ? String(foundField.defaultValue) : "";
          }
        } else if (typeof parsedConfig === "object") {
          const matchedKey = Object.keys(parsedConfig).find(k => k.toLowerCase() === lowerKey);
          if (matchedKey) {
            const val = parsedConfig[matchedKey];
            if (typeof val === "object") return JSON.stringify(val);
            return val !== undefined && val !== null ? String(val) : "";
          }
        }
      }

      // Oncelik 3: Profil verileri
      const matchedProfileKey = Object.keys(profileReplacements).find(k => k.toLowerCase() === lowerKey);
      if (matchedProfileKey) {
        return String(profileReplacements[matchedProfileKey]);
      }
      return match;
    });
    return processed;
  };

  // Yardimci fonksiyon: Link dongusunu isler
  const processLinkLoop = (html: string | null | undefined) => {
    if (!html) return "";
    return html.replace(/\[LINK_LOOP\]([\s\S]*?)\[\/LINK_LOOP\]/gi, (_match: string, innerHtml: string) => {
      if (!userLinks || !Array.isArray(userLinks) || userLinks.length === 0) return "";
      try {
        return userLinks.map((link) => {
          let linkHtml = innerHtml;
          linkHtml = linkHtml.replace(/\{\{\s*linkTitle\s*\}\}/gi, link.title || "");
          linkHtml = linkHtml.replace(/\{\{\s*linkUrl\s*\}\}/gi, link.url || "");
          linkHtml = linkHtml.replace(/\{\{\s*linkAnimation\s*\}\}/gi, link.animation || "");
          linkHtml = linkHtml.replace(/\{\{\s*linkBgColor\s*\}\}/gi, link.bgColor || "");
          linkHtml = linkHtml.replace(/\{\{\s*linkTextColor\s*\}\}/gi, link.textColor || "");
          return linkHtml;
        }).join("\n");
      } catch (err) {
        return "";
      }
    });
  };

  // Yardimci fonksiyon: Sosyal donguyu isler
  // socialLinks hem Record<string,string> hem de Array<{socialPlatform,socialUrl}> formatini destekler
  const processSocialLoop = (html: string | null | undefined) => {
    if (!html) return "";
    return html.replace(/\[SOCIAL_LOOP\]([\s\S]*?)\[\/SOCIAL_LOOP\]/gi, (_match: string, innerHtml: string) => {
      if (!activeSocialLinks || (Array.isArray(activeSocialLinks) && activeSocialLinks.length === 0) || (!Array.isArray(activeSocialLinks) && Object.keys(activeSocialLinks).length === 0)) return "";
      try {
        // Normalize: convert array format to entries
        let entries: [string, string][] = [];
        if (Array.isArray(activeSocialLinks)) {
          entries = activeSocialLinks
            .filter((item: any) => (item.socialPlatform || item.platform) && (item.socialUrl || item.url) && String(item.socialUrl || item.url).trim() !== "")
            .map((item: any) => [item.socialPlatform || item.platform, item.socialUrl || item.url]);
        } else {
          entries = Object.entries(activeSocialLinks).filter(([, url]) => url && String(url).trim() !== "");
        }
        if (entries.length === 0) return "";
        return entries.map(([platform, url]) => {
          let socHtml = innerHtml;
          socHtml = socHtml.replace(/\{\{\s*socialPlatform\s*\}\}/gi, platform || "");
          socHtml = socHtml.replace(/\{\{\s*socialUrl\s*\}\}/gi, url || "");
          return socHtml;
        }).join("\n");
      } catch (err) {
        return "";
      }
    });
  };

  // A. Eger Slot-Based degilse (Eski Sistem, Custom HTML)
  if (!isSlotBased) {
    let processedHtml = typeof templateInput === 'string' ? templateInput : (templateInput?.customHtml || "");
    processedHtml = processVariables(processedHtml);
    processedHtml = processLinkLoop(processedHtml);
    processedHtml = processSocialLoop(processedHtml);
    
    // Geriye donuk uyumluluk (Indeksli Linkler)
    const indexedReplacements: Record<string, string> = {};
    if (userLinks && Array.isArray(userLinks)) {
      userLinks.forEach((link, idx) => {
        const num = idx + 1;
        indexedReplacements[`link${num}Title`] = link.title || "";
        indexedReplacements[`link${num}Url`] = link.url || "";
      });
    }

    const userLinkCount = userLinks ? userLinks.length : 0;
    const placeholderScanRegex = /\{\{\s*link(\d+)(Title|Url)\s*\}\}/gi;
    let scanMatch;
    const indexesInTemplate: number[] = [];
    while ((scanMatch = placeholderScanRegex.exec(processedHtml)) !== null) {
      indexesInTemplate.push(parseInt(scanMatch[1], 10));
    }
    const maxIndex = indexesInTemplate.length > 0 ? Math.max(...indexesInTemplate) : 0;

    for (let i = userLinkCount + 1; i <= maxIndex; i++) {
      const tags = ["a", "div", "li", "p", "span", "button"];
      tags.forEach((tag) => {
        const tagRegex = new RegExp(`<(${tag})\\b[^>]*>[\\s\\S]*?\\{\\{\\s*link${i}(Title|Url)\\s*\\}\\}[\\s\\S]*?<\\/\\1>`, "gi");
        processedHtml = processedHtml.replace(tagRegex, "");
      });
      const cleanRegex = new RegExp(`\\{\\{\\s*link${i}(Title|Url)\\s*\\}\\}`, "gi");
      processedHtml = processedHtml.replace(cleanRegex, "");
    }

    processedHtml = processedHtml.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/gi, (match: string, key: string) => {
      const lowerKey = key.toLowerCase();
      const matchedKey = Object.keys(indexedReplacements).find((k) => k.toLowerCase() === lowerKey);
      if (matchedKey) return String(indexedReplacements[matchedKey]);
      return "";
    });

    let wrapperStyles = `width: 100%; min-height: 100vh; flex-direction: column; display: flex; align-items: center;`;
    const getGodModeCss = () => {
      const mapNameSize = (size?: string) => {
        switch (size) {
          case "text-sm": return "1.25rem";
          case "text-base": return "1.5rem";
          case "text-lg": return "2rem";
          case "text-xl": return "2.5rem";
          case "text-2xl": return "3rem";
          default: return "2rem";
        }
      };

      const mapBioSize = (size?: string) => {
        switch (size) {
          case "text-[10px]": return "0.75rem";
          case "text-xs": return "0.875rem";
          case "text-sm": return "1rem";
          case "text-base": return "1.25rem";
          default: return "1rem";
        }
      };

      return `
        .clinkor-dynamic-root { 
          font-family: '${templateSettings?.fontStyle || 'Inter'}', sans-serif !important; 
        }
        .clinkor-dynamic-root h1, 
        .clinkor-dynamic-root h2, 
        .clinkor-dynamic-root p, 
        .clinkor-dynamic-root span, 
        .clinkor-dynamic-root a {
          color: ${templateSettings?.globalTextColor || 'inherit'} !important;
        }
        
        .clinkor-dynamic-root h1, 
        .clinkor-dynamic-root h2,
        .clinkor-dynamic-root .v2-name, 
        .clinkor-dynamic-root .v3-name {
          color: ${templateSettings?.usernameColor || templateSettings?.globalTextColor || 'inherit'} !important;
          font-size: ${mapNameSize(templateSettings?.usernameSize)} !important;
        }
        
        .clinkor-dynamic-root p, 
        .clinkor-dynamic-root span, 
        .clinkor-dynamic-root .v2-bio, 
        .clinkor-dynamic-root .v3-bio {
          color: ${templateSettings?.bioColor || templateSettings?.globalTextColor || 'inherit'} !important;
          font-size: ${mapBioSize(templateSettings?.bioSize)} !important;
        }

        ${templateSettings?.socialIconColor ? `
        .clinkor-dynamic-root .v3-social-icon-btn i,
        .clinkor-dynamic-root .v3-social-icon-btn svg,
        .clinkor-dynamic-root .fa-brands,
        .clinkor-dynamic-root [class*="social"] i {
          color: ${templateSettings.socialIconColor} !important;
        }
        ` : ''}
      `;
    };

    processedHtml = `<style>${getGodModeCss()}</style>\n<div class="clinkor-dynamic-root" style="${wrapperStyles.trim()}">\n${processedHtml}\n</div>`;

    const rawCss = typeof templateInput === 'object' && templateInput?.customCss ? templateInput.customCss : null;
    return { 
      html: processedHtml, 
      css: rawCss ? processVariables(rawCss) : null 
    };
  }

  // B. Eger Slot-Based Sistem ise (Yeni Yapi)
  const parts = templateInput as TemplateParts;
  
  // 1. Donguleri coz
  const processedLinks = processLinkLoop(parts.linksHtml);
  const processedSocial = processSocialLoop(parts.socialHtml);

  // 2. Degiskenleri Isle
  const processedAvatar = processVariables(parts.avatarHtml);
  const processedHeader = processVariables(parts.headerHtml);
  const processedBackground = processVariables(parts.backgroundHtml);

  // 3. Master Layout'a Enjekte Et (Slotting)
  let finalHtml = processVariables(parts.masterLayoutHtml || ""); // Master icindeki {{var}}'lari da coz
  finalHtml = finalHtml.replace(/\[BACKGROUND_SECTION\]/g, processedBackground || "");
  finalHtml = finalHtml.replace(/\[AVATAR_SECTION\]/g, processedAvatar || "");
  finalHtml = finalHtml.replace(/\[HEADER_SECTION\]/g, processedHeader || "");
  finalHtml = finalHtml.replace(/\[SOCIAL_ICONS_SECTION\]/g, processedSocial || "");
  finalHtml = finalHtml.replace(/\[LINKS_SECTION\]/g, processedLinks || "");

  let wrapperStyles = `width: 100%; min-height: 100vh; flex-direction: column; display: flex; align-items: center;`;
  const getGodModeCssSlot = () => {
    const mapNameSize = (size?: string) => {
      switch (size) {
        case "text-sm": return "1.25rem";
        case "text-base": return "1.5rem";
        case "text-lg": return "2rem";
        case "text-xl": return "2.5rem";
        case "text-2xl": return "3rem";
        default: return "2rem";
      }
    };

    const mapBioSize = (size?: string) => {
      switch (size) {
        case "text-[10px]": return "0.75rem";
        case "text-xs": return "0.875rem";
        case "text-sm": return "1rem";
        case "text-base": return "1.25rem";
        default: return "1rem";
      }
    };

    return `
      .clinkor-dynamic-root { 
        font-family: '${templateSettings?.fontStyle || 'Inter'}', sans-serif !important; 
      }
      .clinkor-dynamic-root h1, 
      .clinkor-dynamic-root h2, 
      .clinkor-dynamic-root p, 
      .clinkor-dynamic-root span, 
      .clinkor-dynamic-root a {
        color: ${templateSettings?.globalTextColor || 'inherit'} !important;
      }

      .clinkor-dynamic-root h1, 
      .clinkor-dynamic-root h2,
      .clinkor-dynamic-root .v2-name, 
      .clinkor-dynamic-root .v3-name {
        color: ${templateSettings?.usernameColor || templateSettings?.globalTextColor || 'inherit'} !important;
        font-size: ${mapNameSize(templateSettings?.usernameSize)} !important;
      }

      .clinkor-dynamic-root p, 
      .clinkor-dynamic-root span, 
      .clinkor-dynamic-root .v2-bio, 
      .clinkor-dynamic-root .v3-bio {
        color: ${templateSettings?.bioColor || templateSettings?.globalTextColor || 'inherit'} !important;
        font-size: ${mapBioSize(templateSettings?.bioSize)} !important;
      }
    `;
  };

  finalHtml = `<style>${getGodModeCssSlot()}</style>\n<div class="clinkor-dynamic-root" style="${wrapperStyles.trim()}">\n${finalHtml}\n</div>`;

  return { 
    html: finalHtml, 
    css: parts.customCss ? processVariables(parts.customCss) : null 
  };
}

/**
 * HTML icindeki tum suslu parantezli degiskenleri bulur.
 * linkTitle, linkUrl gibi ayrilmis [LINK_LOOP] veya indeksli link anahtar kelimelerini filtreler.
 * Geriye kalan benzersiz degiskenleri bir dizi olarak dondurur.
 */
export function extractTemplateVariables(htmlString: string | null | undefined): string[] {
  if (!htmlString) return [];
  const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(htmlString)) !== null) {
    const varName = match[1];
    matches.add(varName);
  }
  
  const reservedKeys = new Set([
    "displayName",
    "bio",
    "avatarUrl",
    "linkTitle",
    "linkUrl"
  ]);

  const reservedRegex = /^link(?:\d+)?(?:Title|Url|Animation|BgColor|TextColor)$/i;
  
  return Array.from(matches).filter(varName => {
    if (reservedKeys.has(varName) || reservedRegex.test(varName)) {
      return false;
    }
    return true;
  });
}
