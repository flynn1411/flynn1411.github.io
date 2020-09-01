function ServidorDeFirebase(){
    this.firebaseConfig = {
            apiKey: "AIzaSyCrFbPHJizkQbb3IEPf_DyNjwcwZCD7NpM",
            authDomain: "calculadoradeindice.firebaseapp.com",
            databaseURL: "https://calculadoradeindice.firebaseio.com/",
            projectId: "calculadoradeindice",
            storageBucket: "calculadoradeindice.appspot.com",
            messagingSenderId: "180634225139",
            appId: "1:180634225139:web:c4300eb226ca6f4db46a86",
            measurementId: "G-7DG9TX7RN9"
    };
    this.usuarioActual = null;
    this.datos = null;
    this.periodo = null;
    
    this.inicializar = ServidorDeFirebaseInicializar;
    this.ingresar = ServidorDeFirebaseIngresar;
    this.mostrarPopUp = ServidorDeFirebaseMostrarPopUp;
    this.logout = ServidorDeFirebaseLogout;
    this.enviarDatos = ServidorDeFirebaseEnviarDatos;
    this.traerDatos = ServidorDeFirebaseTraerDatos;
    this.usuarioActivo = ServidorDeFirebaseUsuarioActivo;
    this.mostrarDatos = ServidorDeFirebaseMostrarDatos;
}

function ServidorDeFirebaseInicializar(modo = "global"){
    // Initialize Firebase
    firebase.initializeApp(this.firebaseConfig);

    firebase.firestore().enablePersistence().
    catch( error => {
        if (error.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            console.log('Persistence failed.');

        } else if (error.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            console.log('Persistence not supported by browser.');

        }
    });

    firebase.analytics();

    firebase.auth().onAuthStateChanged( user => {
        
        if(user){
            this.traerDatos(modo, "tema");
            this.mostrarDatos();
            this.traerDatos(modo);
        }
        else{
            //document.getElementById("numeroDeClases").value = 4;
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("salir").style.display = "none";
        }
    });

    //console.log(firebase);
}

function ServidorDeFirebaseIngresar(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    ServidorDeFirebaseMostrarPopUp();
    this.traerDatos(modo, "tema");
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

}

function ServidorDeFirebaseMostrarPopUp(){
    firebase.auth().useDeviceLanguage();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var userLogged = result.user;

        this.usuarioActual = firebase.auth().currentUser;

        if (this.usuarioActual != null) {

            var db = firebase.firestore();

            db.collection("usuarios").doc(this.usuarioActual.uid).set({
                nombre : `${this.usuarioActual.displayName}`,
                correo : `${this.usuarioActual.email}`,
                correoVerificado : `${this.usuarioActual.emailVerified}`,
                id : `${this.usuarioActual.uid}`,
                "visibility" : "public"
                //currentTheme: document.body.className
            }, {merge: true})
            .then( () => {
                console.log("Success");
            } ).catch( error => {
                console.log(error);
            } );
        
        }


    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

}

function ServidorDeFirebaseLogout(){
    firebase.auth().signOut().then( () => {
        console.log("User signed out");

        const div = document.getElementById('logged-in');
        div.style.display = "none";
        document.getElementById("salir").style.display = "none";

        while(div.firstChild){
            div.firstChild.remove();
        }

        document.getElementById("sign-in").style.display = "block";
        this.datos = null;
    });
}

function ServidorDeFirebaseEnviarDatos(datos, rama = "global", collection = "notas"){
    var database = firebase.firestore();

    usuarioActual = firebase.auth().currentUser;

    if(collection === "notas"){
        
        documento = database.collection("notas").doc(usuarioActual.uid);
    
        if(rama == "periodo"){
            documento.set({
                periodo : datos
            }, {merge : true});
        }
        else{
            documento.set({
                global : datos
            }, {merge : true});
        }

    }else{
        
        documentoTema = database.collection("usuarios").doc(usuarioActual.uid);

        documentoTema.set({currentTheme: datos},{merge: true});
    }

    console.log("completado");

}

function ServidorDeFirebaseTraerDatos(rama = "global", dato="notas"){
    var database = firebase.firestore();
    var getOptions = {
        source : 'default'
    };

    usuarioActual = firebase.auth().currentUser;

    if(dato === "notas"){

        var referencia = database.collection("notas").doc(usuarioActual.uid);
    
        referencia.get(getOptions).then( retrieved => {
            if(retrieved.exists) {
                if(rama == "periodo"){
                    this.periodo = retrieved.data()[rama];
                }
                else{
                    this.datos = retrieved.data()[rama];
                }
    
                document.getElementById("recargar").click();
            }
            else{
                console.log("Inexstente");
            }
        } ).catch( error => {
            console.log(error);
        } );

    }
    else{
        var referencia = database.collection("usuarios").doc(usuarioActual.uid);

        referencia.get(getOptions).then( obtenido => {
            if(obtenido.exists) {
                temaActual = obtenido.data()["currentTheme"];
                localStorage.setItem("theme", temaActual);
                loadTheme();
                checkCurrentTheme();
            }
            else{
                console.log("Inexstente");
            }
        }
        ).catch( exception => {
            console.log(exception);
        });
    }


}


function ServidorDeFirebaseUsuarioActivo(){
    usuarioConectado = false;

    if(firebase.auth().currentUser != null){
        usuarioConectado = true;
    }

    return usuarioConectado;
}

function ServidorDeFirebaseMostrarDatos(){
    usuarioActual = firebase.auth().currentUser;

    document.getElementById("sign-in").style.display = "none";

    var perfil = document.createElement("img");
    perfil.src = usuarioActual.photoURL;
    perfil.width = 100;
    perfil.id = "fotoDePerfil";

    var titulo = document.createElement("p");
    titulo.innerHTML += `Usuario actual: ${usuarioActual.displayName}`;
    titulo.id = "usuario";

    div = document.getElementById('logged-in');
    div.appendChild(titulo);
    div.appendChild(perfil);
    //div.innerHTML += `<br><br>Usuario actual: ${usuarioActual.displayName}`;
    div.style.display = "block";

    document.getElementById("salir").style.display = "block";
}
