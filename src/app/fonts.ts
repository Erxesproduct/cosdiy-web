import { Cormorant_Garamond, Manrope } from "next/font/google";

// Both carry Mongolian Ө ө Ү ү (cyrillic-ext), checked against the Google Fonts cmap.
export const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--nf-serif",
  display: "swap",
});
export const sans = Manrope({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["300", "400", "500", "600", "700"], variable: "--nf-sans", display: "swap" });
