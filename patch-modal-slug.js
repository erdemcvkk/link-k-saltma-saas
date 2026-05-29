const fs = require('fs');

const path = 'src/components/addons/addon-config-modal.tsx';
let code = fs.readFileSync(path, 'utf-8');

const regexGoLink = /href=\{`http:\/\/\$\{domain\}\/\@\$\{username\}\/\$\{configData\.customSlug \|\| ""\}`\}/g;
const regexCopyLink = /navigator\.clipboard\.writeText\(`http:\/\/\$\{domain\}\/\@\$\{username\}\/\$\{configData\.customSlug \|\| ""\}`\)/g;
const regexPlaceholder = /placeholder=\{lang === "tr" \? "magazam" : "store"\}/g;

const slugFunction = `
  const getDefaultSlug = (type: string) => {
    if (!type) return "store";
    if (type === "MINI_STORE") return "store";
    if (type === "NEO_BRUTAL") return "neo-brutal";
    if (type === "ORGANIC") return "organic";
    if (type === "RETRO") return "retro";
    if (type === "ACADEMIA") return "academia";
    if (type === "Y2K") return "y2k";
    if (type === "BOOKING") return "booking";
    if (type === "NEWSLETTER") return "newsletter";
    if (type === "QA") return "qa";
    if (type === "DONATION") return "donation";
    return type.toLowerCase();
  };
  const activeSlug = configData.customSlug || getDefaultSlug(addon?.addonType);
`;

// Insert the slugFunction just inside the renderAddonSettings function
const targetInsertion = `const renderAddonSettings = () => {`;
if (code.includes(targetInsertion)) {
  code = code.replace(targetInsertion, targetInsertion + slugFunction);
} else {
  console.log("Could not find renderAddonSettings function");
}

code = code.replace(regexGoLink, `href={\`http://\${domain}/@\${username}/\${activeSlug}\`}`);
code = code.replace(regexCopyLink, `navigator.clipboard.writeText(\`http://\${domain}/@\${username}/\${activeSlug}\`)`);
code = code.replace(regexPlaceholder, `placeholder={getDefaultSlug(addon?.addonType)}`);

fs.writeFileSync(path, code, 'utf-8');
console.log("Patched addon-config-modal.tsx");
