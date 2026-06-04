/**
 * Converts Tailwind CSS class names to hex color values.
 * Shared between server (actions.ts) and client (dashboard-client.tsx).
 */
export function tailwindToHex(cls: string): string | null {
  const arbitraryMatch = cls.match(/\[(#?[a-fA-F0-9]{3,8}|[a-zA-Z]+)\]/);
  if (arbitraryMatch) {
    let val = arbitraryMatch[1];
    if (!val.startsWith("#") && /^[a-fA-F0-9]{3,8}$/.test(val)) {
      val = "#" + val;
    }
    return val;
  }

  const colorMap: Record<string, string> = {
    "red-50": "#fef2f2", "red-100": "#fee2e2", "red-200": "#fecaca", "red-300": "#fca5a5", "red-400": "#f87171", "red-500": "#ef4444", "red-600": "#dc2626", "red-700": "#b91c1c", "red-800": "#991b1b", "red-900": "#7f1d1d",
    "pink-50": "#fdf2f8", "pink-100": "#fbcfe8", "pink-200": "#f9a8d4", "pink-300": "#f472b6", "pink-400": "#f06292", "pink-500": "#ec4899", "pink-600": "#d81b60", "pink-700": "#be185d", "pink-800": "#9d174d", "pink-900": "#831843",
    "purple-50": "#faf5ff", "purple-100": "#e9d5ff", "purple-200": "#d8b4fe", "purple-300": "#c084fc", "purple-400": "#a855f7", "purple-500": "#8b5cf6", "purple-600": "#7c3aed", "purple-700": "#6d28d9", "purple-800": "#5b21b6", "purple-900": "#4c1d95",
    "cyan-50": "#ecfeff", "cyan-100": "#cffafe", "cyan-200": "#a5f3fc", "cyan-300": "#67e8f9", "cyan-400": "#22d3ee", "cyan-500": "#06b6d4", "cyan-600": "#0891b2", "cyan-700": "#0e7490", "cyan-800": "#155e75", "cyan-900": "#164e63",
    "emerald-50": "#ecfdf5", "emerald-100": "#d1fae5", "emerald-200": "#a7f3d0", "emerald-300": "#6ee7b7", "emerald-400": "#34d399", "emerald-500": "#10b981", "emerald-600": "#059669", "emerald-700": "#047857", "emerald-800": "#065f46", "emerald-900": "#064e3b", "emerald-950": "#022c22",
    "teal-50": "#f0fdfa", "teal-100": "#ccfbf1", "teal-200": "#99f6e4", "teal-300": "#5eead4", "teal-400": "#2dd4bf", "teal-500": "#14b8a6", "teal-600": "#0d9488", "teal-700": "#0f766e", "teal-800": "#115e59", "teal-900": "#134e4a", "teal-950": "#042f2e",
    "blue-50": "#eff6ff", "blue-100": "#dbeafe", "blue-200": "#bfdbfe", "blue-300": "#93c5fd", "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb", "blue-700": "#1d4ed8", "blue-800": "#1e40af", "blue-900": "#1e3a8a",
    "indigo-50": "#e0e7ff", "indigo-100": "#c7d2fe", "indigo-200": "#a5b4fc", "indigo-300": "#818cf8", "indigo-400": "#6366f1", "indigo-500": "#4f46e5", "indigo-600": "#4338ca", "indigo-700": "#3730a3", "indigo-800": "#312e81", "indigo-900": "#1e1b4b",
    "amber-50": "#fef3c7", "amber-100": "#fde68a", "amber-200": "#fcd34d", "amber-300": "#fbbf24", "amber-400": "#fbbf24", "amber-500": "#f59e0b", "amber-600": "#d97706", "amber-700": "#b45309", "amber-800": "#92400e", "amber-900": "#78350f",
    "fuchsia-50": "#fdf4ff", "fuchsia-100": "#fae8ff", "fuchsia-200": "#f5d0fe", "fuchsia-300": "#f0abfc", "fuchsia-400": "#e879f9", "fuchsia-500": "#d946ef", "fuchsia-600": "#c084fc", "fuchsia-700": "#a21caf", "fuchsia-800": "#86198f", "fuchsia-900": "#701a75",
    "stone-50": "#fafaf9", "stone-100": "#f5f5f4", "stone-200": "#e7e5e4", "stone-300": "#d6d3d1", "stone-400": "#a8a29e", "stone-500": "#78716c", "stone-600": "#57534e", "stone-700": "#44403c", "stone-800": "#292524", "stone-850": "#1c1917", "stone-900": "#1c1917", "stone-950": "#0c0a09",
    "zinc-50": "#fafafa", "zinc-100": "#f4f4f5", "zinc-200": "#e4e4e7", "zinc-300": "#d4d4d8", "zinc-400": "#a1a1aa", "zinc-500": "#71717a", "zinc-600": "#52525b", "zinc-700": "#3f3f46", "zinc-800": "#27272a", "zinc-900": "#18181b", "zinc-950": "#09090b",
    "slate-50": "#f8fafc", "slate-100": "#f1f5f9", "slate-200": "#e2e8f0", "slate-300": "#cbd5e1", "slate-400": "#94a3b8", "slate-500": "#64748b", "slate-600": "#475569", "slate-700": "#334155", "slate-800": "#1e293b", "slate-900": "#0f172a", "slate-950": "#020617",
    "sky-50": "#f0f9ff", "sky-100": "#e0f2fe", "sky-200": "#bae6fd", "sky-300": "#7dd3fc", "sky-400": "#38bdf8", "sky-500": "#0ea5e9", "sky-600": "#0284c7", "sky-700": "#0369a1", "sky-800": "#075985", "sky-900": "#0c4a6e",
    "rose-50": "#fff1f2", "rose-100": "#ffe4e6", "rose-200": "#fecdd3", "rose-300": "#fda4af", "rose-400": "#fb7185", "rose-500": "#f43f5e", "rose-600": "#e11d48", "rose-700": "#be123c", "rose-800": "#9f1239", "rose-900": "#881337",
    "orange-50": "#fff7ed", "orange-100": "#ffedd5", "orange-200": "#fed7aa", "orange-300": "#fdba74", "orange-400": "#fb923c", "orange-500": "#f97316", "orange-600": "#ea580c", "orange-700": "#c2410c", "orange-800": "#9a3412", "orange-900": "#7c2d12",
    "black": "#000000", "white": "#ffffff", "transparent": "transparent"
  };

  const parts = cls.split("-");
  const colorKey = parts.slice(1).join("-").split("/")[0];
  if (colorMap[colorKey]) {
    return colorMap[colorKey];
  }

  for (const [key, hex] of Object.entries(colorMap)) {
    if (colorKey.includes(key)) {
      return hex;
    }
  }

  return null;
}

export interface ParsedButtonStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderStyle: string;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
  fontWeight: string;
  animation: string;
}

export function parseButtonStyle(buttonStyleStr: string): ParsedButtonStyle {
  if (buttonStyleStr && buttonStyleStr.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(buttonStyleStr);
      if (parsed && typeof parsed === "object") {
        return {
          bgColor: parsed.bgColor || "",
          textColor: parsed.textColor || "",
          borderColor: parsed.borderColor || "",
          borderStyle: parsed.borderStyle || "solid",
          borderWidth: parsed.borderWidth || "1px",
          borderRadius: parsed.borderRadius || "12px",
          shadow: parsed.shadow || "none",
          fontWeight: parsed.fontWeight || "font-bold",
          animation: parsed.animation || ""
        };
      }
    } catch (e) {}
  }

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
    if (cls.startsWith("hover:") || cls.startsWith("focus:") || cls.startsWith("active:") || cls.startsWith("disabled:")) {
      continue; // Skip pseudo-classes to avoid overwriting base colors
    }

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
    if (cleanCls.startsWith("border-") && !cleanCls.startsWith("border-style") && !/^border-\d+$/.test(cleanCls) && cleanCls !== "border-none" && cleanCls !== "border") {
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
