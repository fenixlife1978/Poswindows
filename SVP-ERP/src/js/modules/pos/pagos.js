let metodoPagoActual = "Efectivo";

function seleccionarPago(metodo) {
  metodoPagoActual = metodo;
}

function calcularVuelto(total) {
  const inputRecibido = document.getElementById("montoRecibido");
  const displayVuelto = document.getElementById("vueltoPOS");
  
  if (!inputRecibido || !displayVuelto) return;

  let recibido = Number(inputRecibido.value);
  let vuelto = recibido - total;

  displayVuelto.innerHTML = "$" + (vuelto > 0 ? vuelto.toFixed(2) : "0.00");
}
