const db = require("../../database");

/**
 * Registra una línea de detalle para una factura de compra.
 * @param {number} compraId - ID de la cabecera de compra.
 * @param {number} productoId - ID del producto adquirido.
 * @param {number} cantidad - Unidades compradas.
 * @param {number} costo - Costo unitario de la compra.
 */
function agregarDetalleCompra(
  compraId,
  productoId,
  cantidad,
  costo
) {
  db.prepare(`
    INSERT INTO detalle_compras
    (compraId, productoId, cantidad, costo)
    VALUES (?,?,?,?)
  `).run(
    compraId,
    productoId,
    cantidad,
    costo
  );
}

// Registro global para ser utilizado en el proceso de registro de compras
window.agregarDetalleCompra = agregarDetalleCompra;
