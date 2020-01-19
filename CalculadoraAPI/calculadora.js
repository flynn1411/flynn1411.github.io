function CalculadoraIndice(){
    this.indiceGlobal = 0;
    this.indicePeriodo = 0;

    this.calcularIndicePeriodo = CalculadoraIndiceCalcularIndicePeriodo;
    this.calcularIndiceGlobal = CalculadoraIndiceCalcularIndiceGlobal;
    this.obtenerTotalUV = calcularIndicePeriodoObtenerTotalUV;
}

function CalculadoraIndiceCalcularIndiceGlobal(datos = []){
    sumaIndice = 0;
    totalUV = parseFloat(this.obtenerTotalUV(datos));

    for(i = 0; i<datos.length; i++){
        sumaIndice += parseFloat(datos[i][0])*parseFloat(datos[i][1]);
    }

    this.indiceGlobal = (parseFloat(sumaIndice/totalUV)).toFixed(2);
    return (parseFloat(sumaIndice/totalUV)).toFixed(2);
}


function CalculadoraIndiceCalcularIndicePeriodo(datos = []){
    this.indicePeriodo = this.calcularIndiceGlobal(datos);
    return this.indicePeriodo;
}

function calcularIndicePeriodoObtenerTotalUV(datos = []){
    UV = 0;

    for(i = 0; i<datos.length; i++){
        UV += datos[i][1];
    }

    return UV;
}