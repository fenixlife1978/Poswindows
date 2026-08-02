const db = require("../../database");

/**
 * Procesa la devolución de una venta.
 * Incrementa el stock de los productos involucrados y marca la venta como DEVUELTA.
 * @param {number} id - El ID de la venta a devolver.
 */
function devolverVenta(id) {
  const detalle = db.prepare(`
    SELECT *
    FROM detalle_ventas
    WHERE ventaId=?
  `).all(id);

  const aumentarStock = db.prepare(`
    UPDATE productos
    SET stock = stock + ?
    WHERE id=?
  `);

  detalle.forEach(item => {
    aumentarStock.run(
      item.cantidad,
      item.productoId
    );
  });

  db.prepare(`
    UPDATE ventas
    SET estado='DEVUELTA'
    WHERE id=?
  `).run(id);

  alert("Venta devuelta correctamente. El inventario ha sido actualizado.");
  
  if (typeof cargarVentas === 'function') {
    cargarVentas();
  }
}

// Registro global para acceso desde las vistas de historial de ventas
window.devolverVenta = devolverVenta;
