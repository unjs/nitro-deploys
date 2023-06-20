import { readFile, writeFile } from "node:fs/promises";
import { deployments } from "../deployments";

async function main() {
  const readme = await readFile("README.md", "utf8");
  const newReadme = readme.replace(
    /<!-- DEPLOYMENTS:START -->[\S\s]*<!-- DEPLOYMENTS:END -->/,
    `<!-- DEPLOYMENTS:START -->
${deployments
  .map((d) => {
    if (!d.enabled) {
      return `- **${d.name}**: ~~Deployment~~ | [Docs](${d.docs})`;
    }
    return `- **${d.name}**: [Deployment](${d.url}) | [Docs](${d.docs})`;
  })
  .join("\n")}
<!-- DEPLOYMENTS:END -->`
  );
  await writeFile("README.md", newReadme, "utf8");
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main();
