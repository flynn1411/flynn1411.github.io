function TraductorDeCSV(){
    this.arreglo = null;
    
    this.csv2arreglo = TraductorDeCSVcsv2arreglo;
    this.arreglo2csv = TraductorDeCSVarreglo2csv;
}

function TraductorDeCSVcsv2arreglo(csv = ""){
    datosExtraidos = [];

    if(csv.includes("\r")){
        filas = csv.split("\r\n");
    }
    else{
        filas = csv.split("\n");
    }

    for(i = 0; i < filas.length; i++){
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