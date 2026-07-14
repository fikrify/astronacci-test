/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin the Laravel API is served from, e.g. http://localhost:8000 */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
