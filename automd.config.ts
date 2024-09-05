export default {
  input: ["README.md"],
  generators: {
    deployments: {
      async generate() {
        const { results } = await import("./test/tests.ts");
        const mdTable = `
| Deployment | ${results[0][1].map(([name]) => name).join(" | ")} |
| --- | ${results[0][1].map(() => "---").join(" | ")} |
${results.map(([name, tests]) => `| ${name} | ${tests.map(([, fail]) => (fail ? `❌` : "✅")).join(" | ")} |`).join("\n")}
        `;

        return {
          contents: mdTable,
        };
      },
    },
  },
};
