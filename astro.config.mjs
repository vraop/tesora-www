// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // Public canonical URL. Used for sitemap, canonical tags, og:url, etc.
  // Update when DNS cuts over to this site.
  site: "https://tesora.ai",

  // Force trailing-slash-free URLs for cleaner SEO + LLM citations.
  trailingSlash: "never",
  build: {
    format: "file",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Surface only what we want crawled. Drafts, unfinished pages, and the
      // _internal namespace stay out.
      filter: (page) => !page.includes("/_") && !page.includes("/draft/"),
      changefreq: "weekly",
      priority: 0.7,
    }),
    mdx(),
  ],
});
