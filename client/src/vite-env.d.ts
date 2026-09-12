/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_MAPS_LIBRARY_URL: string;
  readonly VITE_IMAGE_CDN_BASE: string;
  readonly VITE_STORAGE_PRESET: string;
  readonly VITE_STORAGE_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}