let asociaciones = [];
let donaciones = [];
let contadorAsociaciones = [];
let donacionesPorAsociacion = [];
let ultimaActiva = null;


fetch("http://localhost:3000/organizaciones")
  .then(response => response.json())
  .then(datos => {
    asociaciones = datos;
    contadorAsociaciones = new Array(asociaciones.length).fill(0);
    donacionesPorAsociacion = asociaciones.map(() => []);
    console.log("Asociaciones cargadas:", asociaciones);
  })
  .catch(error => console.error(error));


function anadirDonaciones(id, indice) {
  

  let input = document.getElementById("donacion" + indice);
  let valor = parseFloat(input.value);

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
  input.value = "";
}


function mostrarDonacionLateral(donacion) {
  let zona = document.getElementById("resumen");
  let linea = document.createElement("div");
  linea.textContent = donacion.nombre + " — " + donacion.cantidad + "€";
  linea.classList.add("linea-donacion");
  zona.appendChild(linea);

 
  if (ultimaActiva) {
    ultimaActiva.classList.remove("activo");
  }

  
  let lineas = zona.querySelectorAll(".linea-donacion");
  lineas.forEach(elem => {
    if (elem.textContent.startsWith(donacion.nombre)) {
      elem.classList.add("activo");
    } else {
      elem.classList.remove("activo");
    }
  });

  ultimaActiva = linea;
}


function finalizarTramite() {
  let area = document.getElementById("area");
  let ahora = new Date();

  
  let salida = "Fecha de compra: " + ahora + "\n";


  // Calcular media
  const asociacionesConDonaciones = asociaciones.map((asociacion, i) => {
      let lista = donacionesPorAsociacion[i];
      if (lista.length === 0) return null;

      let total = lista.reduce((acc, valor) => acc + valor, 0);
      let media = total / lista.length;

      return {
        id: asociacion.id,
        nombre: asociacion.nombre,
        numDonaciones: lista.length,
        total,
        media
      };
    })
    
    asociacionesConDonaciones.sort((a, b) => b.nombre.localeCompare(a.nombre));

  // Calcular totales  y escribir el texto
  let totalGlobal = 0;
  let numGlobal = 0;

  asociacionesConDonaciones.forEach(a => {
    totalGlobal += a.total;
    numGlobal += a.numDonaciones;
    salida += a.nombre + ": " + a.numDonaciones + " don., " + a.total + "€\n";

  });

  let aporteTotal = totalGlobal;
  let aporteMedio = (totalGlobal / numGlobal);

  salida += "\nAporte total: " + aporteTotal + " €\n";
salida += "Aporte medio: " + aporteMedio + " €/donación";


  // Mostrar resumen en el área de texto
  area.value = salida;

  // Mostrar ventana emergente con resumen de asociaciones
  const nombresAsociaciones = asociacionesConDonaciones.map(a => a.nombre);
  mostrarVentanaEmergente(nombresAsociaciones);

  // objeto de trámite a guardar
  const tramite = {
    fecha: ahora.toLocaleDateString("es-ES", { month: "2-digit", year: "numeric" }),
    donaciones: asociacionesConDonaciones.map(a => ({
      idOrganizacion: a.id,
      importeTotal: parseFloat(a.total),
      numDonaciones: a.numDonaciones
    }))
  };

  // Guardar en el servidor
  guardarTramite(tramite);

  // Limpia
  setTimeout(limpiarProceso, 10000);
}



function guardarTramite(tramite) {
  fetch("http://localhost:3000/tramiteDonacion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tramite)
  })
    .then(response => response.json())
    .then(datos => {
      console.log("Trámite guardado correctamente:", datos);
    })
    .catch(err => console.error("Error al guardar trámite:", err));
}


function mostrarVentanaEmergente(lista) {
  let mensaje = "";

  lista.forEach(nombre => {
    let a = asociaciones.find(elem => elem.nombre === nombre);
    if (!a) return;

    if (a.acogida !== undefined) {
      mensaje += a.nombre + ": trabaja con personas, enfocada en la " + a.rangoEdad + " y " +(a.acogida ? "tramita" : "no tramita") +" acogidas.\n";
    } else {
      mensaje += a.nombre + ": trabaja con animales a nivel " + a.ambito + ".\n";
    }
  });

  alert(mensaje);
}



function limpiarProceso() {
  donaciones = [];
  contadorAsociaciones = new Array(asociaciones.length).fill(0);
  donacionesPorAsociacion = asociaciones.map(() => []);
  document.getElementById("resumen").innerHTML = "";
  document.getElementById("area").value = "";
  finalizado = false;
  ultimaActiva = null;
}