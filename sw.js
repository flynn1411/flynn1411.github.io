self.addEventListener('install', function(event){
    console.log("SW activated");
    event.waitUntil(
        chaches.open('static').then(
            function(cache){
                cache.addAll([
                    '/',
                    '/index.html',
                    '/global.html',
                    '/información.html',
                    '/CalculadoraAPI/calculadora.js',
                    '/CalculadoraAPI/editorDeTabla.js',
                    '/CalculadoraAPI/extractorDeDatos.js',
                    '/CalculadoraAPI/traductor.csv',
                    '/recursos/barraNavegacion.css',
                    '/recursos/estilo.css',
                    '/recursos/informacion.css',
                    '/recursos/email.png',
                    '/recursos/favicon.ico',
                    '/recursos/github-logo.png',
                    '/recursos/info.png',
                    '/recursos/paypal.png',
                    '/recursos/twitter.png',
                    'https://fonts.googleapis.com/css?family=Bitter:400i|Fira+Code|Roboto|Ubuntu|Ubuntu+Mono&display=swap',
                    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
                    'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
                    'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js'
                ]);
            }
        )
    );
        
});

self.addEventListener('install', function(){
    console.log("SW Installed");
});
