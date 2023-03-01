import { resolve, relative, dirname } from "pathe";
import { promises as fsp } from "fs";
import { joinURL, withLeadingSlash, withoutLeadingSlash } from "ufo";
import { globby } from "globby";
import { defineNitroPreset } from "nitropack";
import type { Nitro } from "nitropack";


export default defineNitroPreset({
  extends: "cloudflare",
  entry: require.resolve('./preset-entry.ts'),
  commands: {
    preview: "npx wrangler pages dev ./pages",
    deploy: "npx wrangler pages publish ./pages",
  },
  output: {
    publicDir: "{{ output.dir }}/pages",
    serverDir: "{{ output.dir }}/pages",
  },
  alias: {
    // Hotfix: Cloudflare appends /index.html if mime is not found and things like ico are not in standard lite.js!
    // https://github.com/unjs/nitro/pull/933
    _mime: "mime/index.js",
  },
  rollupConfig: {
    output: {
      entryFileNames: "_worker.js",
      format: "esm",
    },
  },
  hooks: {
    async compiled(nitro: Nitro) {
      await linkToDist(nitro)
      await writeCFRoutes(nitro)
    },
  },
});

async function linkToDist(nitro: Nitro) {
  // Make symlink to dist for compatibility with zero config
  const buildDir = nitro.options.output.serverDir
  const distDir = resolve(nitro.options.rootDir, 'dist')
  const distStat = await fsp.lstat(distDir).catch(() => { })
  if (!distStat || distStat.isSymbolicLink()) {
    await fsp.unlink(distDir).catch(() => {})
    await fsp.symlink(
      buildDir, // relative(dirname(distDir), buildDir),
      distDir,
    'junction').catch(() => { })
  }
}

/**
 * https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes
 */
interface CloudflarePagesRoutes {
  version: 1;
  include: string[];
  exclude: string[];
}

async function writeCFRoutes(nitro: Nitro) {
  const routes: CloudflarePagesRoutes = {
    version: 1,
    include: ["/*"],
    exclude: [],
  };

  // Exclude public assets from hitting the worker
  const explicitPublicAssets = nitro.options.publicAssets.filter(
    (i) => !i.fallthrough
  );

  // Explicit prefixes
  routes.exclude.push(
    ...explicitPublicAssets
      .map((dir) => joinURL(dir.baseURL, "*"))
      .sort(comparePaths)
  );

  // Unprefixed assets
  const publicAssetFiles = await globby("**", {
    cwd: nitro.options.output.publicDir,
    absolute: false,
    dot: true,
    ignore: [
      '_worker.js',
      '_worker.js.map',
      ...explicitPublicAssets.map((dir) =>
        withoutLeadingSlash(joinURL(dir.baseURL, "**"))
      ),
    ],
  });
  routes.exclude.push(
    ...publicAssetFiles.map((i) => withLeadingSlash(i)).sort(comparePaths)
  );

  // Only allow 100 rules in total (include + exclude)
  routes.exclude.splice(100 - routes.include.length);

  await fsp.writeFile(
    resolve(nitro.options.output.publicDir, "_routes.json"),
    JSON.stringify(routes, undefined, 2)
  );
}

function comparePaths(a: string, b: string) {
  return a.split("/").length - b.split("/").length || a.localeCompare(b);
}
