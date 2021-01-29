self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      caches.delete("site-dynamic-v1.4.7");
      caches.delete("site-static-v1.4.7");
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});