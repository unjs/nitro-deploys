import { defineNitroConfig } from 'nitropack'
import nitroPkg from 'nitropack/package.json'

export default defineNitroConfig({
  renderer: './renderer',
  runtimeConfig: {
    nitroVersion: nitroPkg.version
  },
  publicAssets: [
    {
      baseURL: '/_dist',
      dir: './public/_dist',
      maxAge: 60 * 60 * 24 * 365
    }
  ]
})
