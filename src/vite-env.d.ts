/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCOGS_ACCESS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
