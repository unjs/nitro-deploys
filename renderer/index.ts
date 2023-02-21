import { withBase } from "ufo"

const { baseURL } = useRuntimeConfig().app
const url = p => withBase(p, baseURL)

const routes = [
  '/route',
  '/another/route',
  '/api/hello'
]

const deployments = [
  { name: 'Azure Functions', url: 'https://nitro-deployment.azurewebsites.net/' },
  { name: 'Azure Static', url: 'https://icy-pond-008be3f03.1.azurestaticapps.net/' },
  { name: 'Cloudflare Workers', url: 'https://nitro-deployment.pi0.workers.dev/' },
  { name: 'DigitalOcean', url: 'https://nitro-deployment-w5dzm.ondigitalocean.app/' },
  { name: 'Firebase Hosting', url: 'https://nitro-deployment.web.app/' },
  { name: 'Github Pages', url: 'https://unjs.github.io/nitro-deploys/' },
  { name: 'Heroku', url: 'https://nitro-deployment.herokuapp.com/' },
  { name: 'Netlify Functions', url: 'https://nitro-deployment.netlify.app/' },
  { name: 'Netflify Edge', url: 'https://nitro-deployment-edge.netlify.app/' },
  { name: 'Render.com', url: 'https://nitro-deployment.onrender.com/' },
  { name: 'Stormkit', url: 'https://chilllunar-mnn7rl.stormkit.dev/' },
  { name: 'Vercel', url: 'https://nitro-deploys.vercel.app' },
].sort((a, b) => a.name.localeCompare(b.name))

export default defineRenderHandler((event) => {


  const body = html`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Nitro Test Deployment</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="${url('/dist/tailwind@3.2.6.js')}"></script>
</head>

<body class="bg-yellow-600">
  <div class="flex justify-center items-center h-screen">
    <div class="bg-yellow-700 text-white p-8 rounded-lg max-w-lg">
      <h1 class="text-4xl font-bold mb-4">
        <a href="${url('/')}">🐣 Nitro Test Deployment</a>
      </h1>
      <div class="mb-3">
        <ul>
          ${routes.map(link => html` <li><a href="${url(link)}" class="underline">${link}</a></li>`).join('\n')}
        </ul>
        Current route: ${ event.path }
      </div>
      <div class="mt-3 pt-3 border-t-2">
        Performances: <table class="table-auto" id="perf"></table>
      </div>
      <div class="mt-3 pt-3 border-t-2">
      Generated at ${new Date().toUTCString()} with <a href="https://nitro.unjs.io/" class="underline" target="_blank" rel="noopener">nitro</a><span class="text-gray-200	">@${useRuntimeConfig().nitroVersion}</span>
        <a href="https://github.com/unjs/nitro-deploys" class="underline" target="_blank" rel="noopener">(source code)</a>
        <br>
        <br>
        ${deployments.map(d => html` <a href="${d.url}" class="underline">${d.name}</a>`).join(' | ')}
      </div>
    </div>
  </div>
<script>
const timing = window.performance.timing
const measures = {
  "Connection time:": timing.connectEnd - timing.connectStart,
  "DNS lookup:": timing.domainLookupEnd - timing.domainLookupStart,
  "TTFB:": timing.responseStart - timing.requestStart,
  "Response": timing.responseEnd - timing.responseStart,
}
document.querySelector('#perf').innerHTML = Object.entries(measures)
  .map(([name, value]) => '<tr><td>' + name + '</td><td>' + value + 'ms</td></tr>')
  .join('')
</script>
</body>
</html>`

return {
  body
}
})

// Tip: Use lit-html VSCode extension to get syntax highlighting
function html(strings, ...values) {
  return String.raw(strings, ...values);
}
