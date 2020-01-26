const staticCacheName = 'site-static-v3.53';
const dynamicCacheName = 'site-dynamic-v1.3';

cacheFiles = [
    './',
    './index.html',
    './periodo.html',
    //'./informacion.html',
    './index.js',
    './offline.html',
    './recursos/fallback.png',
    './CalculadoraAPI/calculadora.js',
    './CalculadoraAPI/editorDeTabla.js',
    './CalculadoraAPI/extractorDeDatos.js',
    './CalculadoraAPI/traductorCSV.js',
    './recursos/barraNavegacion.css',
    './recursos/estilo.css',
    //'./recursos/informacion.css',
    //'./recursos/email.png',
    './recursos/favicon.ico',
    //'./recursos/github-logo.png',
    './recursos/info.png',
    //'./recursos/paypal.png',
    //'./recursos/twitter.png',
    'https://fonts.googleapis.com/css?family=Bitter:400i|Fira+Code|Roboto|Ubuntu|Ubuntu+Mono&display=swap',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js'
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-analytics.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-auth.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-database.js'
];

self.addEventListener('install', function (event) {
    console.log('SW Installed');
    event.waitUntil(
      caches.open(staticCacheName)
        .then(function (cache) {
          for(i=0; i < cacheFiles.length; i++){
              cache.add(cacheFiles[i]);
          }
        })
    );
  });
  
  // activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(res) {
          if (res) {
            return res;
          } else {
            return fetch(event.request).then(fetchRes => {
              return caches.open(dynamicCacheName).then(cache => {
                cache.put(event.request.url, fetchRes.clone());
                return fetchRes;
              })
            });
          }
        }).catch( () => caches.match('/offline.html') )
    );
  });
