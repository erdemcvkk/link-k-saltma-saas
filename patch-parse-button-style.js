const fs = require('fs');

let file = fs.readFileSync('src/lib/parse-button-style.ts', 'utf-8');

const replacement = `
export function parseButtonStyle(buttonStyleStr: string): ParsedButtonStyle {
  let bgColor = "";
  let textColor = "";
  let borderColor = "";
  let borderStyle = "solid";
  let borderWidth = "1px";
  let borderRadius = "12px";
  let shadow = "none";
  let fontWeight = "font-bold";
  let animation = "";

  const unhandledClasses: string[] = [];

  const classes = buttonStyleStr.split(" ");
  for (const cls of classes) {
    const cleanCls = cls.trim();
    if (!cleanCls) continue;

    let handled = false;

    if (cleanCls.startsWith("bg-")) {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        bgColor = hex;
        handled = true;
      } else if (cleanCls === "bg-black/60" || cleanCls === "bg-black/80" || cleanCls === "bg-black/70" || cleanCls === "bg-black/90" || cleanCls === "bg-black") {
        bgColor = "#000000";
        handled = true;
      } else if (cleanCls === "bg-transparent") {
        bgColor = "transparent";
        handled = true;
      } else if (cleanCls.includes("gradient")) {
         handled = true;
      }
    }
    if (cleanCls.startsWith("text-")) {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        textColor = hex;
        handled = true;
      }
    }
    if (cleanCls.startsWith("border-") && !cleanCls.startsWith("border-style") && !/^border-\\d+$/.test(cleanCls) && cleanCls !== "border-none" && cleanCls !== "border") {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        borderColor = hex;
        handled = true;
      }
    }
    if (cleanCls.startsWith("border")) {
      if (cleanCls === "border-2") { borderWidth = "2px"; handled = true; }
      else if (cleanCls === "border-4") { borderWidth = "4px"; handled = true; }
      else if (cleanCls === "border") { borderWidth = "1px"; handled = true; }
      else if (cleanCls === "border-none") {
        borderWidth = "0px";
        borderStyle = "none";
        handled = true;
      }
    }
    if (cleanCls.startsWith("rounded-")) {
      if (cleanCls === "rounded-xl") { borderRadius = "12px"; handled = true; }
      else if (cleanCls === "rounded-2xl") { borderRadius = "16px"; handled = true; }
      else if (cleanCls === "rounded-3xl") { borderRadius = "24px"; handled = true; }
      else if (cleanCls === "rounded-full") { borderRadius = "9999px"; handled = true; }
      else if (cleanCls === "rounded-lg") { borderRadius = "8px"; handled = true; }
      else if (cleanCls === "rounded-md") { borderRadius = "6px"; handled = true; }
      else if (cleanCls === "rounded-sm") { borderRadius = "4px"; handled = true; }
      else if (cleanCls === "rounded-none") { borderRadius = "0px"; handled = true; }
    }
    if (cleanCls.startsWith("shadow-")) {
      if (cleanCls.includes("glow")) {
        if (cleanCls.includes("purple")) shadow = "glow-purple";
        else if (cleanCls.includes("emerald")) shadow = "glow-emerald";
        else shadow = "glow-purple";
        handled = true;
      } else if (cleanCls === "shadow-sm" || cleanCls === "shadow") {
        shadow = "soft";
        handled = true;
      } else if (cleanCls === "shadow-lg" || cleanCls === "shadow-md" || cleanCls === "shadow-2xl") {
        shadow = "soft";
        handled = true;
      } else if (cleanCls.includes("brutal") || cleanCls.includes("0px_rgba(0,0,0,1)")) {
        shadow = "hard-3d";
        handled = true;
      }
    }
    if (cleanCls === "font-normal" || cleanCls === "font-medium" || cleanCls === "font-bold" || cleanCls === "font-black" || cleanCls === "font-extrabold") {
      fontWeight = cleanCls === "font-extrabold" ? "font-black" : cleanCls;
      handled = true;
    }

    if (!handled) {
      unhandledClasses.push(cleanCls);
    }
  }

  animation = unhandledClasses.join(" ");

  if (!bgColor) {
    if (buttonStyleStr.includes("bg-gradient")) bgColor = "linear-gradient(to right, #9333ea, #db2777)";
    else bgColor = "#1f2937";
  }
  if (!textColor) textColor = "#ffffff";
  if (!borderColor) borderColor = "transparent";

  return {
    bgColor,
    textColor,
    borderColor,
    borderStyle,
    borderWidth,
    borderRadius,
    shadow,
    fontWeight,
    animation
  };
}
`;

const originalFunctionRegex = /export function parseButtonStyle\(buttonStyleStr: string\): ParsedButtonStyle \{[\s\S]*?\n\}/;
file = file.replace(originalFunctionRegex, replacement.trim());

fs.writeFileSync('src/lib/parse-button-style.ts', file);
console.log("Patched parse-button-style.ts");
