let asociaciones = [];
let donaciones = [];
let contadorAsociaciones = [];
let donacionesPorAsociacion = [];
let finalizado = false;
let ultimaActiva = null;
let contarDonaciones = 0;

fetch("http://localhost:3000/organizaciones")
  .then(res => res.json())
  .then(data => {
    asociaciones = data;
    contadorAsociaciones = new Array(asociaciones.length);
    donacionesPorAsociacion = asociaciones.map(() => []);
    console.log("Asociaciones cargadas:", asociaciones);
  })
  .catch(err => console.error(err));



function anadirDonaciones(id, indice) {
  
    let pulsacion = document.getElementById("donacion" + indice);
  let valor = parseFloat(pulsacion.value);

  if (isNaN(valor) || valor <= 0) return;

  let fecha = new Date();
  let donacion = {
    idOrg: id,
    nombre: asociaciones[indice].nombre,
    cantidad: valor,
    fecha: fecha.toLocaleString()
  };

  donaciones.push(donacion);
  donacionesPorAsociacion[indice].push(valor);
  contadorAsociaciones[indice]++;

  mostrarDonacionLateral(donacion, indice);
  pulsacion.value = "";
}

function mostrarDonacionLateral(donacion, indice) {
  let zona = document.getElementById("resumen");
  let linea = document.createElement("div");
  linea.textContent = donacion.nombre + " — " + donacion.cantidad.toFixed(2) + "€";
  linea.classList.add("linea-donacion");
  zona.appendChild(linea);

  
  if (ultimaActiva) {
    ultimaActiva.classList.remove("activo");
  }
  let lineas = zona.querySelectorAll(".linea-donacion");
  lineas.forEach(l => {
    if (l.textContent.startsWith(donacion.nombre)) {
      l.classList.add("activo");
    } else {
      l.classList.remove("activo");
    }
  });

  ultimaActiva = linea;
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

    
    asociacionesOrdenadas.forEach(a => {
       let texto = a.nombre + "----" + a.cantidad + " ";
       if(a.cantidad === 1){
            texto+= "aportación\n";
       }else {
            texto += "aportaciones\n";
       }
       salida += texto;
    });

   
    let suma = donaciones.reduce((total, valor) => total + valor, 0);
    salida += "Donación final: " + suma + " €\n";

   
    let media = (suma / contarDonaciones).toFixed(2);
    salida += "Donación media: " + media + " €/aportación";

    area.value = salida;

    
    finalizado = true;
}


function limpiarProceso() {
    donaciones = [];
    contarDonaciones = 0;
    contadorAsociaciones = new Array(asociaciones.length).fill(0);
}
