import { createRequire } from "node:module";
import { defineNitroConfig } from "nitropack/config";

const nitroPkg = createRequire(import.meta.url)("nitropack/package.json");

export default defineNitroConfig({
  compatibilityDate: "2024-10-21",
  srcDir: "./server",
  baseURL: "/base/",
  runtimeConfig: {
    nitroVersion: nitroPkg.version,
  },
  output: {
    publicDir: "{{ rootDir }}/.stormkit/public/{{ baseURL }}",
  },
  publicAssets: [
    {
      baseURL: "/_dist",
      dir: "./public/_dist",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
});
