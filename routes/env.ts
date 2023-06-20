export default eventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  return {
    processEnv: safeObj(process.env),
    runtimeConfig: safeObj(useRuntimeConfig())
  }
})

const tokenRe = /password|token|key|secret/i

function safeObj(env: Record<string, string> = {}) {
  return Object.fromEntries(Object.entries(env).filter(([key]) => !tokenRe.test(key)))
}
