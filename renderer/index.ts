import { withBase } from "ufo";
import { deployments } from "../deployments";
const { baseURL } = useRuntimeConfig().app;
const getURL = (p) => withBase(p, baseURL);

const routes = ["/api/hello", "/env", "/route", "/another/route"];

export default defineRenderHandler((event) => {
  const url = getRequestURL(event) as URL;
  const currentDeployment = deployments.find((d) => d.url.includes(url.host));

  const body = html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Nitro Test Deployment</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="${getURL("/_dist/tailwind@3.2.6.js")}"></script>
      </head>

      <body class="bg-yellow-600">
        <div class="flex justify-center items-center h-screen">
          <div class="bg-yellow-700 text-white p-8 rounded-lg max-w-lg">
            <h1 class="text-4xl font-bold mb-4">
              <a href="${getURL("/")}">🐣 Nitro Test Deployment</a>
            </h1>
            <div class="mb-3">
              Routes: (current route: ${event.path})
              <ul>
                ${routes
                  .map(
                    (link) =>
                      html` <li>
                        <a href="${getURL(link)}" class="underline">${link}</a>
                      </li>`
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
                    ? html` <a
                        href="${d.url}"
                        class="underline ${d.name === currentDeployment.name
                          ? "font-bold"
                          : ""}"
                        >${d.name}</a
                      >`
                    : html` <span class="text-gray-200">${d.name}</span>`
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
                "<tr><td>" + name + "</td><td>" + value + "ms</td></tr>"
            )
            .join("");
        </script>
      </body>
    </html>`;

  return {
    body,
  };
});

// Tip: Use lit-html VSCode extension to get syntax highlighting
function html(strings, ...values) {
  return String.raw(strings, ...values);
}
