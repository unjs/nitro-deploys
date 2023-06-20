import { ok } from "node:assert";
import { $fetch } from "ofetch";
import { info, setFailed } from "@actions/core";
import { joinURL } from "ufo";
import { deployments } from "../deployments";

async function main() {
  // CI dispatch to check one URL only
  const url = process.env.DEPLOYMENT_URL;
  if (url) {
    await testDeployment(url);
  } else {
    for (const deployment of deployments.filter(
      (d) => d.enabled && d.test !== false
    )) {
      await testDeployment(deployment.url);
    }
  }
}

async function testDeployment(url: string) {
  info(`testing ${url}`);
  try {
    ok(
      await $fetch(url).then((r) => r.includes("Nitro Test Deployment")),
      "should fetch HTML"
    );
    ok(
      await $fetch(joinURL(url, "api/hello")).then((r) => r.api === "Works"),
      "should fetch API"
    );
  } catch (error) {
    setFailed(error);
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
