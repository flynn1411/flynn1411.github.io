calculadora = new CalculadoraIndice();
editorDeTabla = new EditorDeTabla();
extractorDeDatos = new ExtractorDeDatos();
traductorCSV = new TraductorDeCSV();
var servidor = new ServidorDeFirebase();

function iniciarPagina(){
    //cargarPWA();
    cambiarTabla();

    editorDeTabla.borrarDatos();
    servidor.inicializar("periodo");

    if(!servidor.usuarioActivo()){
        recargarDatos();
    }

    boton = document.getElementById("botonDeSeleccion");
    boton.value = "Periodo";
    boton.innerHTML = "Periodo";

    //editorDeTabla.agregarFilas(8);
}

function cambiarTabla(){
    editorDeTabla.editarTabla();
}

function calcularIndice(){
    arreglo = extractorDeDatos.extraerDatos();
    crearJSON();

    if(arreglo){
        document.getElementById("indice").value = calculadora.calcularIndicePeriodo(arreglo);
        
        redondeado = (parseFloat(document.getElementById("indice").value)).toFixed(0);
        elemento = document.getElementById("indiceRedondeado");
        elemento.value = redondeado;

        if(redondeado < 65){
            elemento.style = "color: var(--failed)";
            titulo.style = "text-shadow: var(--failed-glow);";
        }
        else{
            elemento.style= "color: var(--passed)";
            titulo.style = "text-shadow: var(--passed-glow);";
        }
        //document.getElementById("resultados").style = "transition: all 1s ease-out;";
        document.getElementById("resultados").style.display = "block";
    }
    
}    

function agregar(){
    elemento = document.getElementById("numeroDeClases");
    valorActual = parseInt(elemento.value);

    if( (valorActual+1) < ( parseInt(elemento.max) + 1 ) ){
        elemento.value = valorActual + 1;
        editorDeTabla.editarTabla();
    }
}

function quitar(){
    elemento = document.getElementById("numeroDeClases");
    valorActual = parseInt(elemento.value);

    if(valorActual > parseInt(elemento.min)){
        elemento.value = valorActual - 1;
        editorDeTabla.editarTabla();
    }
}

function limpiarDatos(elemento){
    if(elemento.value.match(/^(([ A-Za-z0-9áéíóúÁÉÍÓÚÜü])|(\-))+$/gm) == null){
        elemento.value = "";
    }
}

function limitarDatos(elemento){

    if(elemento.value.match(/[0-9]{1,3}/gm)){
        valorActual = parseInt(elemento.value);

        if( valorActual > parseInt(elemento.max) ){
            elemento.value = parseInt(elemento.max);
        }
    }else{
        elemento.value = "";
    }

    cambiarTabla();
}

function crearJSON(razon = "calcular"){
    csv = extractorDeDatos.extraerDatos("guardar");
    json = traductorCSV.csv2json(csv);

    if(servidor.usuarioActivo()){
        servidor.enviarDatos(json, "periodo");
        changeTheme(document.body.className);
    }

    localStorage.setItem("datosPeriodo", JSON.stringify(json))

}

function registrarUsuario(){
    servidor.ingresar("periodo");
}

function quitarUsuarioActual(){
    servidor.logout();
    editorDeTabla.borrarDatos();
    localStorage.setItem("theme", "light");
    localStorage.removeItem("datosPeriodo");
    localStorage.removeItem("datosGlobal");
    localStorage.removeItem("lastModified-periodo");
    localStorage.removeItem("lastModified-global");
    loadTheme();
    checkCurrentTheme();
}

function recargarDatos(){
    //console.log(servidor.periodo);
    if(localStorage.getItem("datosPeriodo")){
        editorDeTabla.llenarDatos( traductorCSV.json2arreglo( JSON.parse( localStorage.getItem("datosPeriodo") ) ) );
    }

    if(localStorage.getItem("lastModified-periodo") || localStorage.getItem("lastModified-periodo") != "undefined"){
        lastChanges.innerHTML = localStorage.getItem("lastModified-periodo");
    }else{
        lastChanges.innerHTML = "N/A";
    }

}

function autoSave(){
    let timeoutId, time = new Date();

    lastChanges.innerHTML = "Guardando...";

    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
        crearJSON("guardar");
        minutes = time.getMinutes();

        if(minutes < 10) minutes = "0" + minutes;

        timeStamp = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
        lastChanges.innerHTML = `${timeStamp}`; 
        localStorage.setItem("lastModified-periodo", timeStamp);
    }, 750);
}