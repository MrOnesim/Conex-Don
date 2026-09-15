/**
 * Brand-tailored blur placeholders for Conex & Don visual assets.
 * Uses lightweight inline SVG data URLs with gaussian blur and gradient textures.
 */

export function generateSvgBlurDataUrl(
  startColor = "#1a1508",
  accentColor = "#D6A83A",
  endColor = "#080808",
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${startColor}" />
        <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.25" />
        <stop offset="100%" stop-color="${endColor}" />
      </linearGradient>
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="12" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.9" />
        </feComponentTransfer>
      </filter>
    </defs>
    <rect width="100" height="100" fill="url(#g)" filter="url(#b)" />
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

export const brandBlurPlaceholders = {
  // Gold / amber glow for hero and highlight covers
  gold: generateSvgBlurDataUrl("#1f1707", "#D6A83A", "#080808"),

  // Dark bronze / earth tone for Dessiguimanzanbera and rap projects
  bronze: generateSvgBlurDataUrl("#1e140d", "#6F4A32", "#080808"),

  // Deep emerald tone for Héritage Vivant and live sets
  emerald: generateSvgBlurDataUrl("#0d1e17", "#173F32", "#080808"),

  // Crimson / ruby tone for singles like Mode Avion
  crimson: generateSvgBlurDataUrl("#210f0d", "#9E382C", "#080808"),

  // Subtle dark ink shimmer for general media & press
  ink: generateSvgBlurDataUrl("#141414", "#262626", "#080808"),
};

export function getBlurPlaceholderForAccent(accent?: string | null): string {
  if (!accent) return brandBlurPlaceholders.gold;
  const hex = accent.toUpperCase();
  if (hex.includes("D6A83A") || hex.includes("GOLD")) return brandBlurPlaceholders.gold;
  if (hex.includes("6F4A32") || hex.includes("BROWN") || hex.includes("BRONZE"))
    return brandBlurPlaceholders.bronze;
  if (hex.includes("173F32") || hex.includes("GREEN") || hex.includes("EMERALD"))
    return brandBlurPlaceholders.emerald;
  if (hex.includes("9E382C") || hex.includes("RED") || hex.includes("CRIMSON"))
    return brandBlurPlaceholders.crimson;
  return generateSvgBlurDataUrl("#141414", accent, "#080808");
}
