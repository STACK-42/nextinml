// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://nextinml.stack42.tech",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
