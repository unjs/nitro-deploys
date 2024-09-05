import { deployments } from "../../deployments";

const { baseURL } = useRuntimeConfig().app;

const getURL = (p) => baseURL + p.replace(/^\//, "");

const routes = ["/api/hello", "/api/env", "/stream"];

export default defineRenderHandler((event) => {
  const url = getRequestURL(event) as URL;
  const currentDeployment =
    deployments.find((d) => d.url.includes(url.host)) ||
    ({} as (typeof deployments)[number]);

  const body = /* html */ `<!doctype html>
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
            <h1 class="text-3xl font-bold mb-4">
              <img src="${getURL("/nitro.svg")}" class="w-8 h-8 inline-block" />
              <a href="${getURL("/")}">Nitro Test Deployment</a>
            </h1>
            <div class="mb-3">
              Current route: ${event.path}
            </div>
            <div class="mb-3">
              <ul class="list-disc">
                ${routes
                  .map(
                    (link) => /* html */ ` <li>
                        <a href="${getURL(link)}" class="underline">${link}</a>
                      </li>`,
                  )
                  .join("\n")}
              </ul>
            </div>
            <div class="mt-3 pt-3 border-t-2">
              Performances:
              <table class="table-auto" id="perf"></table>
            </div>
            <!-- Deployments list -->
            <div class="border-t-2 mt-3 pt-3">
              Current preset: ${currentDeployment?.name || "(custom)"} (<a
                class="underline"
                href="${currentDeployment?.url}"
                >docs</a
              >)
              <br />
              <br />
              ${deployments
                .map((d) =>
                  d.enabled
                    ? /* html */ ` <a
                        href="${d.url}"
                        class="underline ${
                          d.name === currentDeployment.name ? "font-bold" : ""
                        }"
                        >${d.name}</a
                      >`
                    : /* html */ ` <span class="text-gray-200">${d.name}</span>`,
                )
                .join(" | ")}
            </div>
            <!-- Footer -->
            <div class="mt-3 pt-3 border-t-2">
              Generated at ${new Date().toUTCString()} with
              <a
                href="https://nitro.unjs.io/"
                class="underline"
                target="_blank"
                rel="noopener"
                >nitro</a
              ><span class="text-gray-200"
                >@${useRuntimeConfig().nitroVersion}</span
              >
              <a
                href="https://github.com/unjs/nitro-deploys"
                class="underline"
                target="_blank"
                rel="noopener"
                >(source code)</a
              >
            </div>
          </div>
        </div>
        <script>
          const timing = window.performance.timing;
          const measures = {
            "Connection time:": timing.connectEnd - timing.connectStart,
            "DNS lookup:": timing.domainLookupEnd - timing.domainLookupStart,
            "TTFB:": timing.responseStart - timing.requestStart,
            Response: timing.responseEnd - timing.responseStart,
          };
          document.querySelector("#perf").innerHTML = Object.entries(measures)
            .map(
              ([name, value]) =>
                "<tr><td>" + name + "</td><td>" + value + "ms</td></tr>",
            )
            .join("");
        </script>
      </body>
    </html>`;

  return {
    body,
  };
});
