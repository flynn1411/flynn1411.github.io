calculadora = new CalculadoraIndice();
traductorCSV = new TraductorDeCSV();
editorDeTabla = new EditorDeTabla();
extractorDeDatos = new ExtractorDeDatos();
var servidor = new ServidorDeFirebase();

function iniciarPagina(){
    cargarPWA();
    cambiarTabla();
    editorDeTabla.borrarDatos();
    servidor.inicializar();

    if(!servidor.usuarioActivo()){
        recargarDatos();
    }

    boton = document.getElementById("botonDeSeleccion");
    boton.value = "Global";
    boton.innerHTML = "Global";

}

function extraerDeCSV(){
    archivo = document.getElementById("archivo").files[0];

    if((archivo.name).includes(".csv")){
        console.log(archivo.name);
        const lector = new FileReader();

        lector.onload = function(){
        editorDeTabla.llenarDatos(traductorCSV.csv2arreglo(lector.result))
        calcularIndice()

    };

    lector.readAsText(archivo);

    //calcularIndice();
                }
    else{
        alert("Archivo no valido. Por favor ingresar uno con la terminación '.csv'.");
    }

}

function cambiarTabla(){
    editorDeTabla.editarTabla();
}

function calcularIndice(){
    arreglo = extractorDeDatos.extraerDatos();
    crearJSON();

    if(arreglo){
        indice.value = calculadora.calcularIndiceGlobal(arreglo);
                    
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

        resultados.style = "transition: all 1s ease-out;";
        resultados.style.display = "block";
    }
    
}

function guardar(){
    arreglo = extractorDeDatos.extraerDatos("guardar");
    fileName = document.getElementById("fileNameInput").value;

    if(fileName == ""){
        fileName = "notas";
    }

    contenido = traductorCSV.arreglo2csv(arreglo);
    download(`${fileName}.csv`, contenido);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function agregar(){
    elemento = document.getElementById("numeroDeClases");
    valorActual = parseInt(elemento.value);

    if( (valorActual+1) < ( parseInt(elemento.max) + 1 ) ){
        elemento.value = valorActual + 1;
        cambiarTabla();
    }
}

function quitar(){
    elemento = document.getElementById("numeroDeClases");
    valorActual = parseInt(elemento.value);

    if(valorActual > parseInt(elemento.min)){
        elemento.value = valorActual - 1;
        cambiarTabla();
    }
}

function limpiarDatos(elemento){
    if(elemento.value.match(/^(([A-Za-z0-9áéíóúÁÉÍÓÚÜü])|(\-))+$/gm) == null){
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

function crearJSON(){
    csv = extractorDeDatos.extraerDatos("guardar");
    json = traductorCSV.csv2json(csv);

    if(servidor.usuarioActivo()){
        servidor.enviarDatos(json);
    }
    
    localStorage.setItem("datosGlobal", JSON.stringify(json))

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
            if(localStorage.getItem("datosGlobal")){
                editorDeTabla.llenarDatos( traductorCSV.json2arreglo( JSON.parse( localStorage.getItem("datosGlobal") ) ) );
            }
        }
    }
    else{
        if(localStorage.getItem("datosGlobal")){
            editorDeTabla.llenarDatos( traductorCSV.json2arreglo( JSON.parse( localStorage.getItem("datosGlobal") ) ) );
        }
    }

}