import { $fetch } from 'ohmyfetch'
import { ok } from 'assert'
import { info, setFailed } from '@actions/core'
import { joinURL } from 'ufo'

const deployments = {
  vercel: 'https://nitro-deployment.vercel.app/',
  netlify: 'https://nitro-deployment.netlify.app/',
  cloudflare: 'https://nitro-deployment.pi0.workers.dev/',
  azure: 'https://icy-pond-008be3f03.1.azurestaticapps.net/',
  'azure-functions': 'https://nitro-deployment.azurewebsites.net/',
  firebase: 'https://nitro-deployment.web.app/',
  render: 'https://nitro-deployment.onrender.com/',
  // This is purely client-side
  // github: 'https://unjs.github.io/nitro-deploys/',
}

const behaviour = async url => {
  info(`testing ${url}`)
  try {
    ok(
      await $fetch(url).then(r => r.includes('Welcome to nitro')),
      'should fetch HTML'
    )
    ok(
      await $fetch(joinURL(url, 'api/hello')).then(r =>
        r.includes('Hello World!')
      ),
      'should fetch API'
    )
  } catch (e) {
    setFailed(e)
  }
}

// CI dispatch to check one URL only
const url = process.env.DEPLOYMENT_URL
if (url) {
  await behaviour(url)
} else {
  for (const preset in deployments) {
    await behaviour(deployments[preset])
  }
}
