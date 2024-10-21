import type { EventHandler } from "h3";

export function defineTestHandler(
  name: string,
  serverHandler: EventHandler,
  clientHandler: (assert: (condition: boolean, message: string) => void) => any,
) {
  return defineEventHandler(async (event) => {
    // Client
    if (getRequestHeader(event, "accept").includes("text/html")) {
      return /* html */ `
        <pre id="logs"></pre>
        <script type="module">
          // Log utils
          const logs = document.getElementById('logs');
          const log = (text) => {
            console.log(text);
            logs.innerHTML += '<div>' + text + '</div>';
          }

          // Assert util
          const assert = (condition, message) => {
            if (!condition) {
              throw new Error(message);
            }
          }

          // Test impl
          const _test = ${clientHandler.toString()};

          // Run test
          log('⏳ Running test: ${name}');
          try {
            await _test(assert);
            log('✅ Test passed');
          } catch (error) {
            log('❌ Test failed' + error.stack);
          }
        </script>
      `;
    }
    // Server
    return serverHandler(event);
  });
}
