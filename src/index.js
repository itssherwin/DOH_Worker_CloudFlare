/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Forward to Cloudflare's public DoH endpoint
    const target = "https://cloudflare-dns.com/dns-query";

    // Clone headers but allow only required ones
    const headers = new Headers(request.headers);
    headers.set("Host", "cloudflare-dns.com");

    // Forward request
    const response = await fetch(target + url.search, {
      method: request.method,
      headers,
      body: request.method === "POST" ? await request.arrayBuffer() : undefined,
    });

    // Return response with correct content type
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/dns-message",
        "Cache-Control": "no-store",
      },
    });
  },
};
