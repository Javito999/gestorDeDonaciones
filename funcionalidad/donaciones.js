let donaciones = [];

let asociaciones = [
    'Love Project',
    'Soleil',
    'Acair',
    'Acción contra el hambre',
    'Acción para el desarr',
    'ACCU',
    'Achalay',
    'A compartir',
    'Adama',
    'Luchemos por la vida'
];

let contarDonaciones = 0;
let contadorAsociaciones = new Array(asociaciones.length).fill(0);

let finalizado = false; 

function anadirDonaciones(aportacion, indice) {
   
    if (finalizado) {
        limpiarProceso();
        document.getElementById("area").value = ""; 
        finalizado = false;
    }

    donaciones.push(aportacion);
    contarDonaciones++;
    contadorAsociaciones[indice]++;
}


function finalizarTramite() {
    let area = document.getElementById("area");

    if (donaciones.length === 0) {
        area.value = "No se han realizado aportaciones.";
        return;
    }

    let salida = "";

    
    let asociacionesOrdenadas = [...asociaciones].map((nombre, i) => ({ 
        nombre, 
        cantidad: contadorAsociaciones[i] 
    }))
    .filter(a => a.cantidad > 0) 
    .sort((a, b) => b.nombre.localeCompare(a.nombre)); 

    
}

