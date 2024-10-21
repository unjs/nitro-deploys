import { deployments as _deployments } from "../../deployments";

const { baseURL } = useRuntimeConfig().app;

const getURL = (p) => baseURL + p.replace(/^\//, "");

const routes = ["/api/hello", "/api/env", "/stream"];

export const deployments = [..._deployments];
if (import.meta.dev) {
  deployments.unshift({
    name: "dev",
    url: "http://localhost:3000",
    dash: "",
    docs: "",
  });
}
export default defineEventHandler((event) => {
  const url = getRequestURL(event) as URL;
  const currentDeployment =
    deployments.find((d) => d.url.includes(url.host)) ||
    ({} as (typeof deployments)[number]);

  const stats = /* html */ `
      <table id="perf" class="table-auto" style="color: white" ></table>
      <script>
      const perfNavTiming = window.performance.getEntriesByType('navigation')[0];
      const renderPerfStats = () => {
        const measure = (end, start) => {
          const diff = end - start;
          return diff >= 0 ? Math.round(diff * 1000) / 1000 + " ms" : "-";
        }
        console.log(perfNavTiming.duration);
        const measures = {
          Protocol: perfNavTiming.nextHopProtocol,
          Transfer: perfNavTiming.transferSize + " bytes",
          Request: measure(perfNavTiming.responseEnd, perfNavTiming.requestStart),
          Duration: measure(perfNavTiming.duration, 0),
        };
        document.querySelector("#perf").innerHTML = Object.entries(measures)
          .map(
            ([name, value]) =>
              "<tr><td>" + name + ": " + "</td><td>" + value + "</td></tr>",
          )
          .join("");
      };
      renderPerfStats();
      const int = setInterval(() => {
        if (perfNavTiming.loadEventEnd) {
          clearInterval(int);
          renderPerfStats();
        }
      });
    </script>
  `;

  if (url.searchParams.has("stats")) {
    return stats;
  }

  return /* html */ `<!doctype html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <title>Nitro Test Deployment</title>
    <link rel="icon" href="/nitro.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="${getURL("/_dist/tailwind@3.4.5.js")}"></script>
  </head>

  <body class="bg-neutral-900">
    <div class="flex justify-center items-center h-screen">
      <div class="border border-gray-200 text-white p-8 rounded-lg max-w-lg">
        <!-- Title -->
        <h1 class="flex items-center mb-4">
          <img src="${getURL("/nitro.svg")}" class="w-8 h-8 mr-4" />
          <div>
            <a class="text-3xl font-bold" href="${currentDeployment.url}">Nitro Test Deployment</a>
            <br>
            <a class="text-xl underline" href="${currentDeployment.docs}">${currentDeployment.name}</a>
          </div>
        </h1>

        <!-- Perf -->
        <div class="mb-3 pt-3">
          ${stats}
        </div>

        <!-- Routes -->
        <div class="mb-3 border-t-1">
          <p>Current route: ${event.path}</p>
          <ul style="list-style: circle">
            ${routes
              .map(
                (link) => /* html */ ` <li>
              <a href="${getURL(link)}" class="underline">${link}</a>
            </li>`,
              )
              .join("\n")}
          </ul>
        </div>

        <!-- Footer -->
        <div class="mt-3 pt-3">
          <!-- Deployment -->
          <div>
            <select onchange="window.location.href=this.value" id="countries"
              class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              ${deployments
                .map((d) =>
                  d.url
                    ? /* html */ ` <option value="${d.url}" ${d.url === currentDeployment.url ? "selected" : ""}>${d.name}</option>`
                    : /* html */ `<option disabled>${d.name}</option>`,
                )
                .join("\n")}
            </select>
          </div>
          <div class="mt-2">
          <p>Generated at ${new Date().toUTCString()}</p>
            <p>
              <a href="https://nitro.unjs.io/" class="underline" target="_blank" rel="noopener">Nitro</a><span
                class="text-gray-200">@${useRuntimeConfig().nitroVersion}</span>
            </p>
            <p class="text-center">
              <a href="https://github.com/unjs/nitro-deploys" class="underline" target="_blank" rel="noopener">source code</a>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

  </body>

  </html>
  `;
});
