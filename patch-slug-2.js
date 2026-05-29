const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[addonSlug]/page.tsx', 'utf-8');

const oldLogic = `  // The slug is stored in config.customSlug
  const matchingAddon = addons.find(a => {
    try {
      if (!a.config) return false;
      const parsed = JSON.parse(a.config);
      return (parsed.customSlug && parsed.customSlug.toLowerCase() === addonSlug.toLowerCase()) || (addonSlug.toLowerCase() === 'store');
    } catch {
      return false;
    }
  });`;

const newLogic = `  function getDefaultSlug(type: string) {
    if (type === "MINI_STORE" || type === "NEO_BRUTAL" || type === "ORGANIC" || type === "RETRO" || type === "ACADEMIA" || type === "Y2K") return "store";
    if (type === "BOOKING") return "booking";
    if (type === "NEWSLETTER") return "newsletter";
    if (type === "QA") return "qa";
    if (type === "DONATION") return "donation";
    return type.toLowerCase();
  }

  // Find the matching active addon by slug
  const matchingAddon = addons.find(a => {
    if (!a.isActive) return false;
    try {
      const parsed = a.config ? JSON.parse(a.config) : {};
      const cSlug = (parsed.customSlug || getDefaultSlug(a.addonType)).toLowerCase();
      return cSlug === addonSlug.toLowerCase();
    } catch {
      return getDefaultSlug(a.addonType).toLowerCase() === addonSlug.toLowerCase();
    }
  });`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/app/[username]/[addonSlug]/page.tsx', code, 'utf-8');
  console.log("Patched page.tsx logic for exact slug match");
} else {
  console.log("Could not find the old logic");
}
