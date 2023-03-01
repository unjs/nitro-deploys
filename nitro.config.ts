import { defineNitroConfig } from 'nitropack'
import nitroPkg from 'nitropack/package.json'

export default defineNitroConfig({
  renderer: './renderer',
  preset: 'cloudflare-pages',
  extends: './preset.ts',
  runtimeConfig: {
    nitroVersion: nitroPkg.version
  },
  publicAssets: [
    {
      baseURL: '/assets',
      dir: './public/assets',
      maxAge: 60 * 60 * 24 * 365
    },
    {
      baseURL: '/_dist',
      dir: './public/_dist',
      maxAge: 60 * 60 * 24 * 365
    }
  ]
})
