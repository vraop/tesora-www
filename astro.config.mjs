// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
const PREVIEW_SITE = process.env.PUBLIC_SITE;
const PREVIEW_BASE = process.env.PUBLIC_BASE;

export default defineConfig({
  // Public canonical URL. Used for sitemap, canonical tags, og:url, etc.
  // Update when DNS cuts over to this site.
  site: PREVIEW_SITE || "https://tesora.ai",
  base: PREVIEW_BASE || undefined,

  // Directory build (one folder per route) so any static host serves
  // /agents, /customers, etc. without extensionless-URL rewrites.
  trailingSlash: "ignore",
  build: {
    format: "directory",
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
