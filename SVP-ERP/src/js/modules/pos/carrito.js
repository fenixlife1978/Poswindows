
/**
 * Módulo de gestión de carrito y limpieza de interfaz.
 */
function limpiarPOS() {
  // Reiniciar estado global de la venta
  carritoPOS = [];
  clienteVentaActual = null;
  descuentoVenta = 0;
  
  // Limpiar visualmente el ticket (usando el ID correcto del HTML)
  const ticketEl = document.getElementById("ticketItems");
  if (ticketEl) ticketEl.innerHTML = "";
  
  // Resetear campos de cliente y vuelto en la interfaz
  const clienteEl = document.getElementById("clientePOS");
  if (clienteEl) clienteEl.innerHTML = "Cliente contado";
  
  const inputRecibido = document.getElementById("montoRecibido");
  if (inputRecibido) inputRecibido.value = "";
  
  const vueltoDisplay = document.getElementById("vueltoPOS");
  if (vueltoDisplay) vueltoDisplay.innerHTML = "$0.00";

  // Actualizar totales y estado visual mediante las funciones de pos.js
  if (typeof actualizarTicket === 'function') actualizarTicket();
  if (typeof mostrarProductosPOS === 'function') mostrarProductosPOS();
}

// Registro global para ser accedido por el motor de finalización de ventas
window.limpiarPOS = limpiarPOS;
