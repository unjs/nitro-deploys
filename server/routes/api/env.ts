export default eventHandler(() => {
  return {
    "process.env": safeObj(process.env),
    "globalThis['process'].env": safeObj(globalThis["process"].env),
    "globalThis.__env__": safeObj(globalThis.__env__),
    runtimeConfig: safeObj(useRuntimeConfig()),
  };
});

const tokenRe = /password|token|key|secret/i;

function safeObj(env: Record<string, string> = {}) {
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => !tokenRe.test(key)),
  );
}
