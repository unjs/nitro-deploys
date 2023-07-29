import { createRequire } from "node:module";
import { defineNitroConfig } from "nitropack/config";

const require = createRequire(import.meta.url);
const nitroPkg = require("nitropack/package.json");

export default defineNitroConfig({
  renderer: "./renderer",
  runtimeConfig: {
    nitroVersion: nitroPkg.version,
  },
  vercel: {
    functions: {
      supportsResponseStreaming: true
    }
  },
  publicAssets: [
    {
      baseURL: "/_dist",
      dir: "./public/_dist",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
});
