function parseButtonStyle(buttonStyleStr) {
  if (!buttonStyleStr) return {};
  const classes = buttonStyleStr.split(/\s+/);
  let bgColor = null;
  let textColor = null;
  let borderColor = null;
  let borderWidth = null;
  let borderStyle = null;
  let borderRadius = null;
  let shadow = null;
  let fontWeight = null;

  const tailwindToHex = (cls) => {
    const colorMap = {
      "black": "#000000", "white": "#ffffff", "transparent": "transparent"
    };
    const parts = cls.split("-");
    const colorKey = parts.slice(1).join("-").split("/")[0];
    if (colorMap[colorKey]) return colorMap[colorKey];
    return null; // Simplified for test
  };

  for (const cls of classes) {
    let cleanCls = cls;
    if (cleanCls.startsWith("hover:") || cleanCls.startsWith("focus:") || cleanCls.startsWith("active:") || cleanCls.startsWith("disabled:")) {
      const parts = cleanCls.split(":");
      cleanCls = parts[parts.length - 1];
    }
    let handled = false;
    if (cleanCls.startsWith("bg-")) {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        bgColor = hex;
        handled = true;
      } else if (cleanCls === "bg-transparent") {
        bgColor = "transparent";
        handled = true;
      }
    }
    if (!handled && cleanCls.startsWith("text-")) {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        textColor = hex;
        handled = true;
      }
    }
    if (!handled && cleanCls.startsWith("border-") && !cleanCls.match(/border-(solid|dashed|dotted|double|none|0|2|4|8)/)) {
      const hex = tailwindToHex(cleanCls);
      if (hex) {
        borderColor = hex;
        handled = true;
      }
    }
    if (!handled && cleanCls.match(/^border-(0|2|4|8)$/)) {
      const w = cleanCls.replace("border-", "");
      borderWidth = w + "px";
      handled = true;
    }
    if (!handled && cleanCls.match(/^border-(solid|dashed|dotted|double|none)$/)) {
      borderStyle = cleanCls.replace("border-", "");
      handled = true;
    }
    if (!handled && cleanCls.startsWith("rounded")) {
      if (cleanCls === "rounded-none") borderRadius = "0px";
      else if (cleanCls === "rounded-sm") borderRadius = "2px";
      else if (cleanCls === "rounded-md") borderRadius = "6px";
      else if (cleanCls === "rounded-lg") borderRadius = "8px";
      else if (cleanCls === "rounded-xl") borderRadius = "12px";
      else if (cleanCls === "rounded-2xl") borderRadius = "16px";
      else if (cleanCls === "rounded-3xl") borderRadius = "24px";
      else if (cleanCls === "rounded-full") borderRadius = "9999px";
      else borderRadius = "4px";
      handled = true;
    }
    if (!handled && cleanCls.startsWith("shadow")) {
      if (cleanCls.includes("purple")) shadow = "glow-purple";
      else if (cleanCls.includes("emerald")) shadow = "glow-emerald";
      else if (cleanCls.includes("hard")) shadow = "hard-3d";
      else if (cleanCls === "shadow-none") shadow = "none";
      else shadow = "soft";
      handled = true;
    }
    if (!handled && (cleanCls.startsWith("font-") || cleanCls === "italic")) {
      fontWeight = cleanCls;
      handled = true;
    }
  }

  if (borderWidth && !borderStyle) borderStyle = "solid";
  if (!bgColor) {
    bgColor = "#1f2937";
  }
  if (!textColor) textColor = "#ffffff";
  if (!borderColor) borderColor = "transparent";

  return {
    bgColor,
    textColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    shadow,
    fontWeight
  };
}

const res = parseButtonStyle("bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0b2240] transition-all duration-300 rounded-none uppercase tracking-widest font-bold");
console.log(res);
