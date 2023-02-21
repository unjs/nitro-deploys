import { $fetch } from 'ofetch'
import { ok } from 'assert'
import { info, setFailed } from '@actions/core'
import { joinURL } from 'ufo'

const deployments = {
  'azure-functions': 'https://nitro-deployment.azurewebsites.net/',
  azure: 'https://icy-pond-008be3f03.1.azurestaticapps.net/',
  cloudflare: 'https://nitro-deployment.pi0.workers.dev/',
  digitalocean: 'https://nitro-deployment-w5dzm.ondigitalocean.app/',
  firebase: 'https://nitro-deployment.web.app/',
  heroku: 'https://nitro-deployment.herokuapp.com/',
  netlify: 'https://nitro-deployment.netlify.app/',
  'netlify-edge': 'https://nitro-deployment-edge.netlify.app/',
  render: 'https://nitro-deployment.onrender.com/',
  stormkit: 'https://chilllunar-mnn7rl.stormkit.dev/',
  vercel: 'https://nitro-deployment.vercel.app/',
  // This is purely client-side
  // github: 'https://unjs.github.io/nitro-deploys/',
}

const behaviour = async url => {
  info(`testing ${url}`)
  try {
    ok(
      await $fetch(url).then(r => r.includes('Nitro Test Deployment')),
      'should fetch HTML'
    )
    ok(
      await $fetch(joinURL(url, 'api/hello')).then(r => r.api === 'Works'),
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
