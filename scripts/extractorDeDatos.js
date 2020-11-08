function ExtractorDeDatos(){
    this.extraerDatos = ExtractorDeDatosExtraerDatos;
    this.verificarDatos = ExtractorDeDatosVerificarDatos;
}

function ExtractorDeDatosVerificarDatos(filas, resultado = "calcular"){
    tabla = document.getElementById("datos");
    datosSonValidos = true;

    for(i = 0; i < filas; i++){
        for(j = 1; j < 3; j++){

            if(resultado === "calcular"){
                if(tabla.rows[i].cells[j].children[0].value == ""){
                    datosSonValidos = false;
                    break;
                }
            }
        }
    }

    return datosSonValidos;
}

function ExtractorDeDatosExtraerDatos(razon = "calcular"){
    tabla = document.getElementById("datos");
    datos = [];
    numeroDeFilas = tabla.rows.length;

    if(this.verificarDatos(numeroDeFilas, razon) && (razon == "calcular")){
        for(i = 0; i < numeroDeFilas; i++){

            if( (parseInt(tabla.rows[i].cells[1].children[0].value)) != 0 ){
                columnas = [];
                columnas.push(parseInt(tabla.rows[i].cells[1].children[0].value));
                columnas.push(parseInt(tabla.rows[i].cells[2].children[0].value));

                datos.push(columnas);
            }
            
        }

        return datos;
    }

    else if(this.verificarDatos(numeroDeFilas, razon) && (razon == "guardar")){
        datos.push(["Clase","Nota","UV"]);
        for(i = 0; i < numeroDeFilas; i++){
            columnas = [];
            columnas.push(tabla.rows[i].cells[0].children[0].value);

            if(tabla.rows[i].cells[1].children[0].value == ""){
                columnas.push(0);
            }else{
                columnas.push(parseInt(tabla.rows[i].cells[1].children[0].value));
            }

            if(tabla.rows[i].cells[2].children[0].value == ""){
                columnas.push(0);
            }else{
                columnas.push(parseInt(tabla.rows[i].cells[2].children[0].value));
            }

            datos.push(columnas);
        }

        return datos;
    }

    else{
        alert("Necesita llenar todas las casillas de notas y de UV para poder calulcar el indice. No es necesario llenar las casillas de 'Clase'.")
    }
    
}