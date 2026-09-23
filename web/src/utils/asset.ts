/**
 * Resolve a catalog asset path against the application's base URL.
 *
 * Paths in the generated catalog are root-absolute (for example
 * `/audio/mp3/bronze/jagtbegynd.mp3`). When the site is served from a
 * sub-path — as GitHub Pages does with `/Jagthorn-main/` — a bare-absolute
 * URL points at the domain root and 404s. Prefixing Vite's
 * `import.meta.env.BASE_URL` keeps every asset correct across dev, GitHub
 * Pages (`/Jagthorn-main/`) and a custom domain (`/`).
 *
 * Already-absolute URLs (with a scheme such as `http:`, `https:`, `data:` or
 * `blob:`) are returned untouched, and `undefined` passes through so optional
 * asset fields stay optional.
 */
export function resolveAssetUrl(path: string): string
export function resolveAssetUrl(path: undefined): undefined
export function resolveAssetUrl(path: string | undefined): string | undefined
export function resolveAssetUrl(path: string | undefined): string | undefined {
  if (!path) return path
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path
  const rawBase = import.meta.env.BASE_URL || '/'
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`
  return `${base}${path.replace(/^\/+/, '')}`
}
