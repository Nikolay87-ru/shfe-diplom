interface ImportMetaEnv {
  BASE_URL: string | undefined;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}