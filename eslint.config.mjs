import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: [
    "**/.nitro",
    "**/.output",
    "**/.vercel",
    "**/.netlify",
    "**/public",
    "**/dist",
    "**/_dist",
  ],
  rules: {},
});
