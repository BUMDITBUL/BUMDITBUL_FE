const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") ?? "https://bumditbul-api.com";

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(request: Request, context: ProxyContext) {
  const { path } = await context.params;
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_API_BASE_URL}/${path.join("/")}${url.search}`;
  const headers = new Headers(request.headers);

  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
