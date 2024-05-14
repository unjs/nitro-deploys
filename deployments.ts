export const deployments = [
  process.env.NODE_ENV === "development" && {
    name: "Development",
    enabled: true,
    url: "http://localhost:3000",
    docs: "https://nitro.unjs.io/",
  },
  {
    name: "Azure Functions",
    enabled: false,
    url: "https://nitro-deployment.azurewebsites.net/",
    docs: "https://nitro.unjs.io/deploy/providers/azure",
  },
  {
    name: "Azure Static",
    enabled: true,
    url: "https://icy-pond-008be3f03.1.azurestaticapps.net/",
    docs: "https://nitro.unjs.io/deploy/providers/azure",
  },
  {
    name: "Cloudflare Workers - SW",
    enabled: true,
    url: "https://nitro-deployment.pi0.workers.dev/",
    docs: "https://nitro.unjs.io/deploy/providers/cloudflare",
  },
  {
    name: "Cloudflare Workers - Module",
    enabled: true,
    url: "https://nitro-deployment-modules.pi0.workers.dev/",
    docs: "https://nitro.unjs.io/deploy/providers/cloudflare#cloudflare-module-workers",
  },
  {
    name: "DigitalOcean",
    enabled: false,
    url: "https://nitro-app-nom5n.ondigitalocean.app/",
    docs: "https://nitro.unjs.io/deploy/providers/digitalocean",
  },
  {
    name: "Firebase Hosting",
    enabled: false,
    url: "https://nitro-web-app.web.app/",
    docs: "https://nitro.unjs.io/deploy/providers/firebase",
  },
  {
    name: "Github Pages",
    enabled: true,
    test: false,
    url: "https://unjs.github.io/nitro-deploys/",
    docs: "https://nitro.unjs.io/deploy/workers",
  },
  {
    name: "Heroku",
    enabled: false,
    url: "https://nitro-app.herokuapp.com/",
    docs: "https://nitro.unjs.io/deploy/providers/heroku",
  },
  {
    name: "Netlify Functions",
    enabled: true,
    url: "https://nitro-deployment.netlify.app/",
    docs: "https://nitro.unjs.io/deploy/providers/netlify",
  },
  {
    name: "Netflify Edge",
    enabled: true,
    url: "https://nitro-deployment-edge.netlify.app/",
    docs: "https://nitro.unjs.io/deploy/providers/netlify#netlify-edge-functions",
  },
  {
    name: "Render.com",
    enabled: false,
    url: "https://nitro-app.onrender.com/",
    docs: "https://nitro.unjs.io/deploy/providers/render",
  },
  {
    name: "Stormkit",
    enabled: true,
    url: "https://scourgebrick-ppmy24.stormkit.dev/",
    docs: "https://nitro.unjs.io/deploy/providers/stormkit",
  },
  {
    name: "Vercel",
    enabled: true,
    url: "https://nitro-app.vercel.app",
    docs: "https://nitro.unjs.io/deploy/providers/vercel",
  },
  {
    name: "Vercel Edge",
    enabled: true,
    url: "https://nitro-app-edge.vercel.app",
    docs: "https://nitro.unjs.io/deploy/providers/vercel#vercel-edge-functions",
  },
]
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));
