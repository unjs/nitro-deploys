import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  renderer: './renderer',
  publicAssets: [
    {
      baseURL: '/dist',
      dir: './public/dist',
      maxAge: 60 * 60 * 24 * 365
    }
  ]
})
