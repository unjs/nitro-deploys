import { deployments } from "../deployments";
import { describe, test, run, assert } from "./_runner";

for (const deployment of deployments) {
  if (!deployment.url) {
    console.warn(`Skipping ${deployment.name}...`);
    continue;
  }
  describe(deployment.name, () => {
    test("index html", async () => {
      const res = await fetch(deployment.url);
      const text = await res.text();
      assert(() => text.includes("Nitro Test Deployment"));
    });
    test("/api/hello", async () => {
      const res = await fetch(deployment.url + "api/hello");
      const json = await res.json();
      assert(() => json.api === "works");
    });
  });
}

export const results = await run();
