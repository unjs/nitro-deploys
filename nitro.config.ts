import { defineNitroConfig } from 'nitropack/config'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const nitroPkg = require('nitropack/package.json')

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
