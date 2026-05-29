const fs = require('fs');
let code = fs.readFileSync('src/app/actions.ts', 'utf-8');

const oldLogic = `  let defaultTheme = "classic";
  if (addonType === "MINI_STORE") defaultTheme = "vibrant-pop";
  if (addonType === "BOOKING") defaultTheme = "minimalist";
  if (addonType === "NEWSLETTER") defaultTheme = "glassmorphism";
  if (addonType === "QA") defaultTheme = "dark-drill";
  if (addonType === "DONATION") defaultTheme = "classic";`;

const newLogic = `  let defaultTheme = "classic";
  if (addonType === "MINI_STORE") defaultTheme = "vibrant-pop";
  if (addonType === "BOOKING") defaultTheme = "minimalist";
  if (addonType === "NEWSLETTER") defaultTheme = "glassmorphism";
  if (addonType === "QA") defaultTheme = "dark-drill";
  if (addonType === "DONATION") defaultTheme = "classic";
  if (addonType === "NEO_BRUTAL") defaultTheme = "neo-brutalism";
  if (addonType === "ORGANIC") defaultTheme = "organic-earth";
  if (addonType === "RETRO") defaultTheme = "retro-arcade";
  if (addonType === "ACADEMIA") defaultTheme = "dark-academia";
  if (addonType === "Y2K") defaultTheme = "y2k-holographic";`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/app/actions.ts', code, 'utf-8');
  console.log("actions.ts patched successfully!");
} else {
  console.log("Could not find the old logic to replace in actions.ts");
}
