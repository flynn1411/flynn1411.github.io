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
    firebase.analytics();

    firebase.auth().onAuthStateChanged( user => {
        
        if(user){
            this.mostrarDatos();
            this.traerDatos(modo);
        }
        else{
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("logout").style.display = "none";
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
    return ServidorDeFirebaseMostrarPopUp();
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
            var database = firebase.database();
        
            database.ref('users/' + this.usuarioActual.uid).set({
                nombre : `${this.usuarioActual.displayName}`,
                correo : `${this.usuarioActual.email}`,
                correoVerificado : `${this.usuarioActual.emailVerified}`
            });

            //ServidorDeFirebaseMostrarDatos();
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
        document.getElementById("logout").style.display = "none";

        while(div.firstChild){
            div.firstChild.remove();
        }

        document.getElementById("sign-in").style.display = "block";
        this.datos = null;
    });
}

function ServidorDeFirebaseEnviarDatos(datos, rama = "global"){
    var database = firebase.database();

    usuarioActual = firebase.auth().currentUser;

    if(rama == "periodo"){
        database.ref('notas/' + usuarioActual.uid + '/periodo').set({
            json : datos
        });
    }
    else{
        database.ref('notas/' + usuarioActual.uid).set({
            global : datos
        });
    }

    console.log("completado");

}

function ServidorDeFirebaseTraerDatos(rama = "global"){
    var database = firebase.database();

    usuarioActual = firebase.auth().currentUser;
    var referencia = database.ref('notas/' + usuarioActual.uid);

    if(rama == "periodo"){
        referencia = database.ref('notas/' + usuarioActual.uid + '/periodo');
    }

    referencia.on('value', (data) => {
    
        if(rama == "periodo"){
            this.periodo = data.val()['json'];
        }
        else{
            this.datos = data.val()['global'];
        }

        document.getElementById("recargar").click();
    });

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
    perfil.border_radius = 20;

    var titulo = document.createElement("p");
    titulo.innerHTML += `<br><br>Usuario actual: ${usuarioActual.displayName}`;

    div = document.getElementById('logged-in');
    div.appendChild(titulo);
    div.appendChild(perfil);
    //div.innerHTML += `<br><br>Usuario actual: ${usuarioActual.displayName}`;
    div.style.display = "block";

    document.getElementById("logout").style.display = "block";
}