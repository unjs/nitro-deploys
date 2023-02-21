export default defineRenderHandler((event) => {
  const links = [
    '/route',
    '/another/route',
    '/api/hello'
  ]

  const body = html`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Nitro Test Deployment</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="/dist/tailwind@3.2.6.js"></script>
</head>

<body class="bg-yellow-600">
  <div class="flex justify-center items-center h-screen">
    <div class="bg-yellow-700 text-white p-8 rounded-lg">
      <h1 class="text-4xl font-bold mb-4">
        <a href="/">🐣 Nitro Test Deployment</a>
      </h1>
      <div class="mb-3">
        <ul>
          ${links.map(link => html` <li><a href="${link}" class="underline">${link}</a></li>`).join('\n')}
        </ul>
        Current route: ${ event.path }
      </div>
      <div class="mt-3 pt-3 border-t-2">
        Performances: <table class="table-auto" id="perf"></table>
      </div>
      <div class="mt-3 pt-3 border-t-2">
      Generated at ${new Date().toUTCString()} with <a href="https://nitro.unjs.io/" class="underline" target="_blank" rel="noopener">Nitro</a><span class="text-gray-200	">@${useRuntimeConfig().nitroVersion}</span>
        <br>
        <a href="https://github.com/unjs/nitro-deploys" class="underline" target="_blank" rel="noopener">Source Code</a>
      </div>
    </div>
  </div>
<script>
const timing = window.performance.timing
const measures = {
  connection: timing.connectEnd - timing.connectStart,
  dns: timing.domainLookupEnd - timing.domainLookupStart,
  ttfb: timing.responseStart - timing.requestStart,
  response: timing.responseEnd - timing.responseStart,
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
