import { fileURLToPath } from "node:url";
import type { NitroPreset } from "nitropack";

export default {
  extends: "firebase",
  entry: fileURLToPath(new URL("entry.ts", import.meta.url)),
} satisfies NitroPreset;
