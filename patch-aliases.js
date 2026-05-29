const fs = require('fs');

// Patch AddonConfigModal.tsx
let modalCode = fs.readFileSync('src/components/addons/addon-config-modal.tsx', 'utf-8');

const isStoreThemeCondition = `case "MINI_STORE":
      case "NEO_BRUTAL":
      case "ORGANIC":
      case "RETRO":
      case "ACADEMIA":
      case "Y2K":`;
      
modalCode = modalCode.replace(/case "MINI_STORE":/g, isStoreThemeCondition);

const defaultThemeLogic = `  const getDefaultTheme = (type: string) => {
    switch (type) {
      case "NEO_BRUTAL": return "neo-brutalism";
      case "ORGANIC": return "organic-earth";
      case "RETRO": return "retro-arcade";
      case "ACADEMIA": return "dark-academia";
      case "Y2K": return "y2k-holographic";
      default: return "classic";
    }
  };`;

if (!modalCode.includes("getDefaultTheme")) {
  modalCode = modalCode.replace(
    `const [configData, setConfigData] = useState<any>`, 
    `${defaultThemeLogic}\n  const [configData, setConfigData] = useState<any>`
  );
}

// Replace theme={configData.theme || "classic"} with default theme logic
modalCode = modalCode.replace(
  `theme={configData.theme || "classic"}`,
  `theme={configData.theme || getDefaultTheme(addon.addonType)}`
);

fs.writeFileSync('src/components/addons/addon-config-modal.tsx', modalCode, 'utf-8');

// Patch page.tsx
let pageCode = fs.readFileSync('src/app/[username]/[addonSlug]/page.tsx', 'utf-8');
const pageStoreThemeCondition = `if (matchingAddon.addonType === "MINI_STORE" || 
      matchingAddon.addonType === "NEO_BRUTAL" || 
      matchingAddon.addonType === "ORGANIC" || 
      matchingAddon.addonType === "RETRO" || 
      matchingAddon.addonType === "ACADEMIA" || 
      matchingAddon.addonType === "Y2K") {`;

pageCode = pageCode.replace(/if \(matchingAddon\.addonType === "MINI_STORE"\) \{/, pageStoreThemeCondition);

const pageDefaultThemeLogic = `  const getDefaultTheme = (type: string) => {
    switch (type) {
      case "NEO_BRUTAL": return "neo-brutalism";
      case "ORGANIC": return "organic-earth";
      case "RETRO": return "retro-arcade";
      case "ACADEMIA": return "dark-academia";
      case "Y2K": return "y2k-holographic";
      default: return "classic";
    }
  };`;

if (!pageCode.includes("getDefaultTheme")) {
  pageCode = pageCode.replace(
    `let parsedConfig: any =`,
    `${pageDefaultThemeLogic}\n  let parsedConfig: any =`
  );
}

pageCode = pageCode.replace(
  `theme={parsedConfig.theme as any}`,
  `theme={parsedConfig.theme || getDefaultTheme(matchingAddon.addonType)}`
);

fs.writeFileSync('src/app/[username]/[addonSlug]/page.tsx', pageCode, 'utf-8');

console.log("Aliases patched successfully!");
