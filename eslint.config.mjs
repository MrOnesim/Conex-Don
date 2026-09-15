import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scripts codemod one-shot historiques (non maintenus) — voir DESIGN-AUDIT.md
    "add-focus.js",
    "add-focus2.js",
    "add-hover.js",
    "enhance-hero.js",
    "fixcss.js",
    "fixcss2.js",
  ]),
]);
