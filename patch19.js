const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

const targetStr = `const [btnFontWeight, setBtnFontWeight] = useState(firstLink?.fontWeight || "font-bold");`;
const replacementStr = `const [btnFontWeight, setBtnFontWeight] = useState(firstLink?.fontWeight || "font-bold");
  const [btnIconColor, setBtnIconColor] = useState("");
  const [quickLinkIconColor, setQuickLinkIconColor] = useState("");`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("Added missing state variables for icon color");
