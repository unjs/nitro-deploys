import "#internal/nitro/virtual/polyfill";
import { type HttpsOptions, onRequest } from "firebase-functions/v2/https";

// auto imported
// import { toNodeListener } from 'h3'

const nitroApp = useNitroApp();

const onRequestDefaults = {
  memory: "1GiB",
  // TODO: does this change anything?
  invoker: "public",
} satisfies HttpsOptions;

export const serverSecondGen = onRequest(
  {
    ...onRequestDefaults,
  },
  toNodeListener(nitroApp.h3App)
);
