/**
 * Aplica un descuento porcentual a la venta actual.
 * @param {number|string} valor - El porcentaje de descuento a aplicar.
 */
function aplicarDescuento(valor) {
  // descuentoVenta es una variable global definida en pos.js
  descuentoVenta = Number(valor);

  // Refrescar el ticket para mostrar los nuevos totales con descuento
  if (typeof actualizarTicket === 'function') {
    actualizarTicket();
  }
}

/**
 * Calcula el monto final restando el descuento acumulado.
 * @param {number} total - El monto total antes de descuento.
 * @returns {number} El total neto.
 */
function calcularTotalConDescuento(total) {
  return total - (total * (descuentoVenta / 100));
}
