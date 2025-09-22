import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// });

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            "brand-primary": "#00475d",
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: false,
      },
    },
  },
});

// {
//       theme: {
//         extend: {
//           colors: {
//             primary: "var(--e-global-color-primary)",
//             secondary: "var(--e-global-color-secondary)",
//             text: "var(--e-global-color-text)",
//             accent: "var(--e-global-color-accent)",
//             whiteish: "var(--e-global-color-2fa50f9)",
//             lightbg: "var(--e-global-color-2535d5a)",
//             muted: "var(--e-global-color-77a68ad)",
//             transparentWhite: "var(--e-global-color-72d56d3)",
//             panel: "var(--e-global-color-d7fd741)",
//             mutedAlpha: "var(--e-global-color-38e70fe)",
//             linkedin: "var(--e-global-color-18f73ba)",
//             primaryAlpha: "var(--e-global-color-0c342f6)",
//             border: "var(--e-global-color-0d589d3)",
//             whiteSoft: "var(--e-global-color-fd17ce6)",
//             grayish: "var(--e-global-color-afdb1c4)",
//           },
//           fontFamily: {
//             primary: [
//               "var(--e-global-typography-primary-font-family)",
//               "sans-serif",
//             ],
//             secondary: [
//               "var(--e-global-typography-secondary-font-family)",
//               "serif",
//             ],
//             accent: [
//               "var(--e-global-typography-accent-font-family)",
//               "sans-serif",
//             ],
//           },
//           fontWeight: {
//             300: "300",
//             400: "400",
//             500: "500",
//             600: "600",
//           },
//         },
//       },
//     }
