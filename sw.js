// Service Worker: 为所有响应注入 COOP/COEP 安全头，使 SharedArrayBuffer 可用
// 这是 FFmpeg.wasm 0.12.x 正常运行的必要条件
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response.status === 0) return response;
      var newHeaders = new Headers(response.headers);
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }).catch(function(err) {
      return new Response('Network error: ' + err.message, { status: 503 });
    })
  );
});
