import { describe, it, expect } from 'vitest'
import { $fetch } from 'ohmyfetch'

const deployments = {
  vercel: 'https://nitro-deployment.vercel.app/',
  netlify: 'https://nitro-deployment.netlify.app/',
  cloudflare: 'https://nitro-deployment.pi0.workers.dev/',
  azure: 'https://icy-pond-008be3f03.1.azurestaticapps.net/',
  'azure-functions': 'https://nitro-deployment.azurewebsites.net/',
  // This is purely client-side
  // github: 'https://unjs.github.io/nitro-deploys/',
}

const behaviour = (url: string) => () => {
  it('should fetch HTML', async () => {
    expect(await $fetch(url)).to.contain('Welcome to nitro')
  })
  it('should fetch API', async () => {
    expect(await $fetch(url + 'api/hello')).to.contain('Hello World!')
  })
}

// CI dispatch to check one URL only
const url = process.env.DEPLOYMENT_URL
if (url) {
  describe(`${url}`, behaviour(url))
} else {
  for (const preset in deployments) {
    describe(preset, behaviour(deployments[preset]))
  }
}
