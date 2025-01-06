export default {
  input: ["README.md"],
  generators: {
    deployments: {
      async generate() {
        const { deployments } = await import("./deployments.ts");
        const md = deployments
          .map(
            (d) =>
              `- ${d.name} ([docs](${d.docs}) | ${d.url ? `[${d.broken ? "~~deployment~~" : "deployment"}](${d.url}base/)` : `~~deployment~~`} )`,
          )
          .join("\n");
        return { contents: md };
      },
    },
    tests: {
      async generate() {
        const { results } = await import("./test/tests.ts");
        const md = `
        | Deployment | ${results[0][1].map(([name]) => name).join(" | ")} |
        | --- | ${results[0][1].map(() => "---").join(" | ")} |
        ${results.map(([name, tests]) => `| ${name} | ${tests.map(([, fail]) => (fail ? `❌` : "✅")).join(" | ")} |`).join("\n")}
                `;
        return { contents: md };
      },
    },
  },
};
