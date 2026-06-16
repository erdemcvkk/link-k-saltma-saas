import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses Tailwind background gradient and color classes and returns a valid CSS background property value.
 * This ensures dynamic gradients inputted via admin settings (e.g. Arka Plan Tasarımcısı) render 100% correctly,
 * even if they are not pre-compiled statically by Tailwind CSS at build time.
 */
export function parseTailwindBgToCss(bgString: string): string | null {
  if (!bgString) return null;

  // Split into individual class names
  const classes = bgString.split(/\s+/);

  let direction = "to bottom";
  let fromColor = "";
  let viaColor = "";
  let toColor = "";
  let isRadial = false;
  let isConic = false;
  let customGradientTemplate = "";

  // Helper to map color name to CSS variable or color
  const resolveColor = (name: string): string => {
    if (!name) return "";
    
    // If it's a hex value like [#ff007f] or [rgba(0,0,0,0.5)]
    if (name.startsWith("[") && name.endsWith("]")) {
      const inner = name.slice(1, -1);
      return inner.replace(/_/g, " ");
    }

    // Handle opacity slash, e.g. purple-950/20
    let opacity = "";
    let baseColor = name;
    if (name.includes("/")) {
      const parts = name.split("/");
      baseColor = parts[0];
      opacity = parts[1];
    }

    let finalColor = "";
    // If it's a standard color without shade, e.g. black, white, transparent
    if (["black", "white", "transparent", "current", "inherit"].includes(baseColor)) {
      finalColor = baseColor === "black" ? "#000000" : (baseColor === "white" ? "#ffffff" : baseColor);
    } else {
      // Map to CSS variable of Tailwind v4
      finalColor = `var(--color-${baseColor})`;
    }

    if (opacity) {
      // If opacity is a tailwind class or percent
      const percent = isNaN(Number(opacity)) ? opacity : `${opacity}%`;
      return `color-mix(in srgb, ${finalColor} ${percent}, transparent)`;
    }

    return finalColor;
  };

  for (const cls of classes) {
    // Check direction
    if (cls.startsWith("bg-gradient-to-")) {
      const dir = cls.replace("bg-gradient-to-", "");
      switch (dir) {
        case "t": direction = "to top"; break;
        case "tr": direction = "to top right"; break;
        case "r": direction = "to right"; break;
        case "br": direction = "to bottom right"; break;
        case "b": direction = "to bottom"; break;
        case "bl": direction = "to bottom left"; break;
        case "l": direction = "to left"; break;
        case "tl": direction = "to top left"; break;
      }
    } else if (cls.startsWith("bg-[") && cls.endsWith("]")) {
      const inner = cls.slice(4, -1).replace(/_/g, " ");
      if (inner.includes("gradient")) {
        customGradientTemplate = inner;
        if (inner.includes("radial-gradient")) isRadial = true;
        if (inner.includes("conic-gradient")) isConic = true;
      } else {
        // e.g. color hex like #123456 or url function
        return inner;
      }
    }

    // Check stops
    if (cls.startsWith("from-")) {
      fromColor = resolveColor(cls.replace("from-", ""));
    } else if (cls.startsWith("via-")) {
      viaColor = resolveColor(cls.replace("via-", ""));
    } else if (cls.startsWith("to-")) {
      toColor = resolveColor(cls.replace("to-", ""));
    }
  }

  // If we found color stops, we can build the gradient
  if (fromColor || toColor || viaColor) {
    const stopsList: string[] = [];
    if (fromColor) stopsList.push(fromColor);
    if (viaColor) stopsList.push(viaColor);
    if (toColor) stopsList.push(toColor);
    const stopsStr = stopsList.join(", ");

    if (customGradientTemplate) {
      // If we had a custom template like radial-gradient(circle at center, var(--tw-gradient-stops))
      if (customGradientTemplate.includes("var(--tw-gradient-stops)")) {
        return customGradientTemplate.replace("var(--tw-gradient-stops)", stopsStr);
      }
      return customGradientTemplate;
    }

    if (isRadial) {
      return `radial-gradient(circle, ${stopsStr})`;
    }
    if (isConic) {
      return `conic-gradient(${stopsStr})`;
    }
    return `linear-gradient(${direction}, ${stopsStr})`;
  }

  // If no gradient stops are found, check if there's a simple bg-[color] class
  if (!fromColor && !toColor && !viaColor) {
    for (const cls of classes) {
      if (cls.startsWith("bg-") && !cls.startsWith("bg-gradient-") && !cls.startsWith("bg-[") && cls !== "bg-cover" && cls !== "bg-center") {
        const colorName = cls.replace("bg-", "");
        return resolveColor(colorName);
      }
    }
  }

  return null;
}
