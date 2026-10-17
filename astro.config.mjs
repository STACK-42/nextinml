// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://nextinml.stack42.tech",
  // Cloudflare serves pages at their directory URL (/programs/), so links and
  // canonical URLs use the trailing slash to avoid a redirect.
  trailingSlash: "always",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
