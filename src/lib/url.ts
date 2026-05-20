// Prefix internal paths with the configured base URL so the site works
// both at the root domain (tesora.ai) and at a sub-path (vraop.github.io/tesora-www-preview).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function u(path: string): string {
  if (!path) return BASE || "/";
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${clean}`;
}
