function EditorDeTabla(numeroDeFilasActual = 1){
    this.numeroDeFilasActual = numeroDeFilasActual;

    this.editarTabla = EditorDeTablaEditarTabla;
    this.agregarFilas = EditorDeTablaAgregarFilas;
    this.quitarFilas = EditorDeTablaQuitarFilas;
    this.llenarDatos = EditorDeTablaLlenarDatos;
    this.borrarDatos = EditorDeTablaBorrarDatos;
}

function EditorDeTablaEditarTabla(n = parseInt(document.getElementById("numeroDeClases").value)){
    //n = parseInt(n);

    if( (n > 0 ) && (n <= (parseInt(document.getElementById("numeroDeClases").max) + 1) ) ){
         if(this.numeroDeFilasActual < n){
            this.agregarFilas(n-this.numeroDeFilasActual);
            this.numeroDeFilasActual = n;
        }
        else if(this.numeroDeFilasActual > n){
            this.quitarFilas(this.numeroDeFilasActual-n);
            this.numeroDeFilasActual = n;
        }
    }
    
}

function EditorDeTablaAgregarFilas(n){
    
    cuerpoDeTabla= document.getElementById("datos");

    
    
    for(i=0; i<n; i++){
        filaNueva = cuerpoDeTabla.insertRow(-1);

        numeroClase = parseInt(this.numeroDeFilasActual) + (i + 1);
        claseInput = document.createElement("input");
        claseInput.type = "text";
        claseInput.className = "form-control";
        claseInput.placeholder = `Clase${numeroClase}`;
        claseInput.style = "font-style: italic;";

        notaInput = document.createElement("input");
        notaInput.type = "number";
        notaInput.className = "form-control";
        notaInput.min = "0";
        notaInput.max = "100";
        notaInput.setAttribute('oninput', 'limitarDatos(this)');

        uvInput = document.createElement("input");
        uvInput.type = "number";
        uvInput.className = "form-control";
        uvInput.min = "1";
        uvInput.max = "8";
        uvInput.setAttribute('oninput', 'limitarDatos(this)');
        
        celdaClase = filaNueva.insertCell(0);
        celdaNota = filaNueva.insertCell(1);
        celdaUV = filaNueva.insertCell(2);

        celdaClase.appendChild(claseInput);
        celdaNota.appendChild(notaInput);
        celdaUV.appendChild(uvInput);
    }
}

function EditorDeTablaQuitarFilas(n){
    
    cuerpoDeTabla= document.getElementById("datos");
    
    for(i=0; i<n; i++){
        cuerpoDeTabla.deleteRow(-1);
    }
}

function TraductorDeCSVcsv2arreglo(csv = ""){
    datosExtraidos = [];

    filas = csv.split("\r\n");

    for(i = 0; i < filas.length; i++){
        columnas = filas[i].split(",");

        for(j = 1; j < columnas.length; j++){
            columnas[j] = parseInt(columnas[j]);
        }

        datosExtraidos.push(columnas);
    }

    this.arreglo = datosExtraidos;
    
}

function EditorDeTablaLlenarDatos(arreglo){
    this.editarTabla(arreglo.length);
    document.getElementById("numeroDeClases").value = this.numeroDeFilasActual;
    tabla = document.getElementById("datos");
    numeroDeFilas = tabla.rows.length;

    for(i = 0; i < numeroDeFilas; i++){
        for(j = 0; j < 3; j++){
            if( (j==0) && ( (arreglo[i][j]=="") || (arreglo[i][j]==" ") ) ){
                tabla.rows[i].cells[j].children[0].value = `Clase${i+1}`;
            }
            tabla.rows[i].cells[j].children[0].value = `${arreglo[i][j]}`;
        }
    }
        
}

function EditorDeTablaBorrarDatos(){
    this.editarTabla(20);
    document.getElementById("numeroDeClases").value = this.numeroDeFilasActual;
    tabla = document.getElementById("datos");
    numeroDeFilas = tabla.rows.length;

    for(i = 0; i < numeroDeFilas; i++){
        for(j = 0; j < 3; j++){
            if( j == 0 ){
                tabla.rows[i].cells[j].children[0].value = `Clase${i+1}`;
            }
            tabla.rows[i].cells[j].children[0].value = ``;
        }
    }
}