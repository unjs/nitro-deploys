import "#internal/nitro/virtual/polyfill";
import { requestHasBody } from "#internal/nitro/utils";
import { nitroApp } from "#internal/nitro/app";
import { isPublicAssetURL, getPublicAssetMeta } from "#internal/nitro/virtual/public-assets";

/** @see https://developers.cloudflare.com/pages/platform/functions/#writing-your-first-function */
interface CFRequestContext {
  /** same as existing Worker API */
  request: any;
  /** same as existing Worker API */
  env: any;
  /** if filename includes [id] or [[path]] **/
  params: any;
  /** Same as ctx.waitUntil in existing Worker API */
  waitUntil: any;
  /** Used for middleware or to fetch assets */
  next: any;
  /** Arbitrary space for passing data between middlewares */
  data: any;
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    if (url.pathname === '/_info') {
      return new Response(JSON.stringify({
        request: request.toString(),
        env: env.toString(),
        context: context.toString(),
      }, null, 2))
    }

    if (isPublicAssetURL(url.pathname)) {
      return new Response(getPublicAssetMeta(url.pathname))
      // return env.ASSETS.fetch(request);
    }

    let body;
    if (requestHasBody(request)) {
      body = Buffer.from(await request.arrayBuffer());
    }

    const r = await nitroApp.localCall({
      url: url.pathname + url.search,
      method: request.method,
      headers: request.headers,
      host: url.hostname,
      protocol: url.protocol,
      body,
    });

    return new Response(r.body, {
      // @ts-ignore TODO: Should be HeadersInit instead of string[][]
      headers: normalizeOutgoingHeaders(r.headers),
      status: r.status,
      statusText: r.statusText,
    });
  },
}

function normalizeOutgoingHeaders(
  headers: Record<string, string | string[] | undefined>
) {
  return Object.entries(headers).map(([k, v]) => [
    k,
    Array.isArray(v) ? v.join(",") : v,
  ]);
}
