export default defineEventHandler(() => {
  const links = [
    '/api/hello'
  ]
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <link rel="icon" type="image/x-icon" href="/favicon.ico">
      <title>nitro deployments playground</title>
    </head>

    <body>
      <h1>Welcome to nitro!</h1>
      <ul>
${links.map(link => `        <li><a href="${link}">${link}</a></li>`).join('\n')}
      </ul>
    </body>

</html>`
})
