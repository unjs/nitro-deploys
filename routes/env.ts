export default eventHandler(() => {
  return {
    processEnv: safeEnv(process.env)
  }
})

const tokenRe = /password|token|key|secret/i

function safeEnv(env: Record<string, string> = {}) {
  return Object.fromEntries(Object.entries(env).filter(([key]) => !tokenRe.test(key)))
}
