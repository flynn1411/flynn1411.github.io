const staticCacheName = 'site-static-v1.4.6';
const dynamicCacheName = 'site-dynamic-v1.4.6';

cacheFiles = [
    './',
    './index.html',
    './periodo.html',
    //'./informacion.html',
    './index.js',
    './offline.html',
    './recursos/fallback.png',
    './recursos/light/fallback.png',
    './recursos/dark/fallback.png',
    './recursos/synthwave/fallback.png',
    './scripts/main.js',
    './scripts/periodo.js',
    './scripts/calculadora.js',
    './scripts/editorDeTabla.js',
    './scripts/extractorDeDatos.js',
    './scripts/traductorCSV.js',
    './recursos/barraNavegacion.css',
    './recursos/estilo.css',
    './recursos/informacion.css',
    './recursos/email.png',
    './recursos/favicon.ico',
    './recursos/github-logo.png',
    './recursos/info.png',
    './recursos/light/info.png',
    './recursos/dark/info.png',
    './recursos/synthwave/info.png',
    //'./recursos/paypal.png',
    //'./recursos/twitter.png',
    'https://fonts.googleapis.com/css?family=Roboto|Ubuntu|Ubuntu+Mono&display=swap',
    'https://cdn.jsdelivr.net/npm/victormono@latest/dist/index.min.css',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js'
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-analytics.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-auth.js',
    //'https://www.gstatic.com/firebasejs/7.7.0/firebase-database.js'
];

const limitCacheSize = (name, size) =>{
  caches.open(name).then( cache => {
    cache.keys().then( keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then( limitCacheSize(name,size) );
      }
    } )
  })
};

self.addEventListener('install', function (event) {
    console.log('SW Installed');
    event.waitUntil(
      caches.open(staticCacheName)
        .then(function (cache) {
          for(i=0; i < cacheFiles.length; i++){
              cache.add(cacheFiles[i]);
          }
        }).then( () => self.skipWaiting() )
    );
  });
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then( cacheNames => {
        console.log(cacheNames);
        return Promise.all(
          cacheNames.filter( cacheName => {
            return ((cacheName !== staticCacheName) && (cacheName !== dynamicCacheName));
          }).map( cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    if( event.request.url.indexOf('firebase.googleapis.com') === -1 ){
      event.respondWith(
        caches.match(event.request)
          .then(function(res) {
            if (res) {
              return res;
            } else {
              return fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                  cache.put(event.request.url, fetchRes.clone());
                  limitCacheSize(dynamicCacheName, 15);
                  return fetchRes;
                })
              });
            }
          }).catch( () => {

            if(event.request.url.indexOf('.html') > -1 ){
              return caches.match('/offline.html');
            }
            
          } )
      );
    }
    
  });
