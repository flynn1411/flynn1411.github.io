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

function limitarDatos(elemento){
    valorActual = parseInt(elemento.value);

    if( valorActual > parseInt(elemento.max) ){
        elemento.value = parseInt(elemento.max);
    }

    cambiarTabla();
}

function crearJSON(razon = "calcular"){
    csv = extractorDeDatos.extraerDatos("guardar");
    json = traductorCSV.csv2json(csv);

    if(servidor.usuarioActivo()){
        servidor.enviarDatos(json, "periodo");
    }
    else{
        localStorage.setItem("datosPeriodo", JSON.stringify(json))
    }

}

function registrarUsuario(){
    servidor.ingresar();
}

function quitarUsuarioActual(){
    servidor.logout();
    editorDeTabla.borrarDatos();
    localStorage.setItem("theme", "light");
    loadTheme();
    checkCurrentTheme();
}

function recargarDatos(){
    //console.log(servidor.periodo);
    if(navigator.onLine){
        if(servidor.usuarioActivo()){
            editorDeTabla.llenarDatos( traductorCSV.json2arreglo(servidor.periodo) );
        }
        else{
            if(localStorage.getItem("datosPeriodo")){
                editorDeTabla.llenarDatos( traductorCSV.json2arreglo( JSON.parse( localStorage.getItem("datosPeriodo") ) ) );
            }
        }
    }
    else{
        if(localStorage.getItem("datosPeriodo")){
            editorDeTabla.llenarDatos( traductorCSV.json2arreglo( JSON.parse( localStorage.getItem("datosPeriodo") ) ) );
        }
    }

}

//fun