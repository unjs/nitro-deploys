import "#internal/nitro/virtual/polyfill";
import { type HttpsOptions, onRequest } from "firebase-functions/v2/https";

// auto imported
// import { toNodeListener } from 'h3'

const nitroApp = useNitroApp();

const onRequestDefaults = {
  memory: "1GiB",
} satisfies HttpsOptions;

export const serverSecondGen = onRequest(
  {
    ...onRequestDefaults,
    // must be enforced for google cloud permissions to be set correctly
    invoker: "public",
  },
  toNodeListener(nitroApp.h3App)
);
