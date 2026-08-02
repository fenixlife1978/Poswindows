
const db = require("../../database");

/**
 * Procesa el cierre de la venta afectando el stock de la sucursal específica.
 */
function finalizarVentaCompleta() {
  if (!window.carritoPOS || window.carritoPOS.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const usuarioRaw = localStorage.getItem("usuarioSVP");
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : { id: 1, sucursalId: 1 };

  const subtotal = window.carritoPOS.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const porcentajeIVA = typeof window.obtenerIVA === 'function' ? window.obtenerIVA() : 16;
  const iva = subtotal * (porcentajeIVA / 100);
  const total = subtotal + iva;
  const metodoPago = document.getElementById("metodoPago")?.value || "Efectivo";

  try {
    const registrarVenta = db.transaction(() => {
      // 1. Registrar Cabecera
      const queryVenta = db.prepare(`
        INSERT INTO ventas
        (fecha, subtotal, iva, total, metodoPago, clienteId, cajaId, empresaId, sucursalId, usuarioId, estado)
        VALUES
        (datetime('now', 'localtime'), ?, ?, ?, ?, 1, 1, 1, ?, ?, 'ACTIVA')
      `);

      const resultado = queryVenta.run(subtotal, iva, total, metodoPago, usuario.sucursalId, usuario.id);
      const ventaId = resultado.lastInsertRowid;

      // 2. Detalle e Impacto en Stock de la SUCURSAL
      const queryDetalle = db.prepare(`INSERT INTO detalle_ventas (ventaId, productoId, cantidad, precio) VALUES (?, ?, ?, ?)`);
      const queryStockSucursal = db.prepare(`
        UPDATE sucursal_stock 
        SET cantidad = cantidad - ? 
        WHERE sucursalId = ? AND productoId = ?
      `);

      window.carritoPOS.forEach(item => {
        queryDetalle.run(ventaId, item.id, item.cantidad, item.precio);
        queryStockSucursal.run(item.cantidad, usuario.sucursalId, item.id);
      });

      return ventaId;
    });

    const ticketId = registrarVenta();

    // 3. Generar Impresión
    if (typeof window.generarFactura === 'function') {
      window.generarFactura({
        id: ticketId,
        items: window.carritoPOS,
        subtotal: subtotal,
        iva: iva,
        total: total,
        fecha: new Date().toLocaleString(),
        metodoPago: metodoPago
      });
    }

    // 4. Limpiar
    if (typeof window.limpiarPOS === 'function') window.limpiarPOS();
    
    alert(`Venta finalizada con éxito. Ticket: FAC-${ticketId}`);
    console.log(`SVP ERP: Venta registrada en Sucursal ${usuario.sucursalId}. Ticket: ${ticketId}`);

  } catch (error) {
    console.error("Error al finalizar venta:", error);
    alert("Error crítico al procesar el pago. Verifique stock.");
  }
}

window.finalizarVentaCompleta = finalizarVentaCompleta;
