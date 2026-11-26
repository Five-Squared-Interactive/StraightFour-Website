// Copyright (c) 2019-2026 Five Squared Interactive
// SPDX-License-Identifier: MIT

/**
 * The import server: answers, from the Cache API, the files of a world the
 * page converted in memory, so the shell can load that world by an address
 * on its own origin and fetch its assets as from any host. The page writes
 * the files into the cache under `<scope>__import/<id>/...`; this worker only
 * answers requests under that folder and lets every other request through
 * untouched. It takes control of open pages at once, so the page that just
 * registered it can use it without a reload.
 *
 * Whatever is in the cache was put there by a page of this origin, from a
 * file a stranger may have made. The worker must not turn it into a page or
 * a script of this origin, so a kept file is only ever data:
 *
 *  - It is answered to a page that fetches it, or draws it as a picture,
 *    and to nothing else: a visit to its address, a frame, a script, a
 *    worker or a stylesheet asking for it gets 404.
 *  - Every answer says its type is not to be guessed, that nothing in it
 *    may run, and that no other site may read it.
 *  - Only under the folder at the top of the worker's own scope, not
 *    wherever those letters appear in a path.
 *
 * It also gives the cross-origin isolation Blender needs, to two pages and
 * no other: the client's own page, by name, and the page kept for a
 * visitor's files when it is opened as a window of its own to convert one.
 * A link cannot isolate a page that frames worlds, which would then load
 * none, nor a page inside a frame.
 */
const CACHE = 'webverse-import';
const SCOPE = new URL(self.registration.scope).pathname.replace(/\/?$/, '/');
const KEPT = `${SCOPE}__import/`;
const RUNTIME = `${SCOPE}blender-runtime/`;
/** The client's own page, the one that converts with Blender: at the top of the scope, by name or as the folder itself. */
const ISOLATED_PAGES = [SCOPE, `${SCOPE}index.html`];
/** The page kept for a visitor's files. As a window of its own, opened to convert a Blender file, it is isolated too. */
const CONVERTER_PAGE = `${SCOPE}import.html`;

/** Whether a visit to `url` is to a page that may be isolated because it asked. */
function mayIsolate(url, request) {
  if (url.searchParams.get('isolate') !== '1') return false;
  if (ISOLATED_PAGES.includes(url.pathname)) return true;
  return url.pathname === CONVERTER_PAGE && url.searchParams.get('blend') === 'convert' && request.destination === 'document';
}
/** Who a kept file is answered to: a fetch, and a picture. Never a page, a frame, a script, a worker or a style. */
const AS_DATA = ['', 'image'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const notFound = () => new Response('not an imported file', { status: 404, headers: { 'content-type': 'text/plain', 'x-content-type-options': 'nosniff' } });

/** A kept file as an answer: its bytes and type, and the headers that keep it from being more than a file. */
function asData(hit) {
  const headers = new Headers();
  headers.set('content-type', hit.headers.get('content-type') || 'application/octet-stream');
  headers.set('cache-control', 'no-store');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('content-security-policy', "sandbox; default-src 'none'");
  headers.set('cross-origin-resource-policy', 'same-origin');
  return new Response(hit.body, { status: 200, headers });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const navigation = event.request.mode === 'navigate';
  // A navigation to the client's own page that asks for it gets the
  // cross-origin isolation headers, which only the page's own response can
  // grant: Blender's threaded build needs them. The page asks by reloading
  // itself with `isolate=1`.
  if (navigation && mayIsolate(url, event.request)) {
    event.respondWith(
      fetch(event.request).then((res) => {
        const headers = new Headers(res.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
      }),
    );
    return;
  }
  // A worker started from an isolated page must itself carry the embedder
  // policy, or the browser refuses its script. The runtime's scripts and
  // files get it here, the same way the page did.
  if (url.pathname.startsWith(RUNTIME)) {
    event.respondWith(
      fetch(event.request).then((res) => {
        const headers = new Headers(res.headers);
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        headers.set('Cross-Origin-Resource-Policy', 'same-origin');
        return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
      }),
    );
    return;
  }
  if (!url.pathname.startsWith(KEPT)) return;
  if (navigation || !AS_DATA.includes(event.request.destination)) {
    event.respondWith(Promise.resolve(notFound()));
    return;
  }
  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(event.request.url, { ignoreSearch: true }).then((hit) => (hit ? asData(hit) : notFound()))),
  );
});
