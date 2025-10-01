let donaciones = [];

function anadirDonaciones(aportacion) {
    
    donaciones.push(aportacion);

   
    let suma = donaciones.reduce((total, valor) => total + valor, 0);

   
    alert("Total donado: " + suma + "€");
}
