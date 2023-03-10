export default eventHandler(() => {
  return {
    processEnv: process?.env || "<no env>"
  }
})
