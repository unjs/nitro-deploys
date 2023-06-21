import { H3Event } from "h3";

// Tracker issue: https://github.com/unjs/nitro/issues/1327

export default eventHandler((event) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const write = (chunk: string) => {
        controller.enqueue(encoder.encode(chunk));
      };

      write(
        html`<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Streaming</title>
              <style>
                body {
                  font-family: sans-serif;
                  background: #eee;
                  font-size: 1.5em;
                  padding: 2em;
                }
              </style>
            </head>
            <body>
              <h1>Nitro Streaming Demo</h1>
              <br />
              <a
                href="https://github.com/unjs/nitro-deploys/blob/main/routes/stream.ts"
                >Source Code</a
              ><br /><br />
            </body>
          </html>`
      );

      for (let i = 1; i <= 10; i++) {
        write(html`Chunk ${i}<br />`);
        await waitFor(100);
      }
      write("Bye!");

      controller.close();
    },
  });

  return sendStream(event, stream);
});

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendStream(event: H3Event, stream: ReadableStream) {
  // Mark to prevent h3 handling response
  event._handled = true;

  if ("_data" in event.node.res) {
    // Workers (unenv)
    (event.node.res as unknown as { _data: BodyInit })._data = stream;
  } else {
    // Node.js
    stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        },
        close() {
          event.node.res.end();
        },
      })
    );
  }
}
