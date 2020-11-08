function TraductorDeCSV(){
    this.arreglo = null;
    
    this.csv2arreglo = TraductorDeCSVcsv2arreglo;
    this.arreglo2csv = TraductorDeCSVarreglo2csv;
    this.csv2json = TraductorDeCSVcsv2json;
    this.json2arreglo = TraductorDeCSVjson2arreglo
}

function TraductorDeCSVcsv2arreglo(csv = ""){
    datosExtraidos = [];

    if(csv.includes("\r")){
        filas = csv.split("\r\n");
    }
    else{
        filas = csv.split("\n");
    }

    for(i = 1; i < filas.length; i++){
        columnas = filas[i].split(",");

        for(j = 1; j < columnas.length; j++){
            columnas[j] = parseInt(columnas[j]);
        }

        datosExtraidos.push(columnas);
    }

    this.arreglo = datosExtraidos;
    return datosExtraidos;
    
}

function TraductorDeCSVarreglo2csv(arreglo){
    csv = "";
    longitud = arreglo.length-1;

    for(i = 0; i < longitud; i++){
        csv += `${arreglo[i][0]},${arreglo[i][1]},${arreglo[i][2]}\n`;
    }

    csv += `${arreglo[longitud][0]},${arreglo[longitud][1]},${arreglo[longitud][2]}`;

    console.log(csv);
    return csv;
}

function TraductorDeCSVcsv2json(arreglo = []){
    json = [];

    primeraFila = arreglo[0];

    for(i = 1; i < arreglo.length; i++){
        var obj = {};

        for( j = 0; j < arreglo[i].length; j++){
            obj[primeraFila[j]] = arreglo[i][j];
        }

        json.push(obj);
    }

    return json;
}

function TraductorDeCSVjson2arreglo(json = []){
    arregloFinal = [];
    ordenDeDatos = ["Clase","Nota","UV"];
    //arregloFinal.push(ordenDeDatos);

    for( i = 0; i < json.length; i++){
        columnas = [];

        for(j = 0; j < ordenDeDatos.length; j++){
            columnas.push(json[i][ordenDeDatos[j]]);
        }
        
        arregloFinal.push(columnas);
    }

    return arregloFinal;
}