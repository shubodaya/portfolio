// Canonical-host middleware: the site lives at https://shubodaya.dev.
// Cloudflare Pages also serves every deployment on *.pages.dev aliases
// (portfolio-6j1.pages.dev plus per-deployment hashes); permanently
// redirect those to the canonical domain, preserving path and query.
export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname.endsWith(".pages.dev")) {
    url.hostname = "shubodaya.dev";
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
