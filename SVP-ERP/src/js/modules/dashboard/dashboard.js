const db = require("../../database");

function cargarDashboard() {
  cargarIndicadores();
}

function cargarIndicadores() {
  // Conteo de registros maestros
  const productos = db.prepare("SELECT COUNT(*) total FROM productos").get();
  const clientes = db.prepare("SELECT COUNT(*) total FROM clientes").get();

  // Ventas del día actual
  const ventas = db.prepare(`
    SELECT SUM(total) total
    FROM ventas
    WHERE date(fecha) = date('now', 'localtime')
    AND estado = 'ACTIVA'
  `).get();

  // Utilidad del día (Precio - Costo)
  const utilidad = db.prepare(`
    SELECT SUM(dv.cantidad * (dv.precio - p.costo)) ganancia
    FROM detalle_ventas dv
    JOIN productos p ON p.id = dv.productoId
    JOIN ventas v ON v.id = dv.ventaId
    WHERE date(v.fecha) = date('now', 'localtime')
    AND v.estado = 'ACTIVA'
  `).get();

  // Alertas de stock bajo
  const stockBajo = db.prepare(`
    SELECT COUNT(*) total
    FROM productos
    WHERE stock <= stockMinimo
  `).get();

  // Actualización de la interfaz
  actualizarTexto("totalProductos", productos.total);
  actualizarTexto("totalClientes", clientes.total);
  actualizarTexto("ventasHoy", "$" + Number(ventas.total || 0).toFixed(2));
  actualizarTexto("utilidadHoy", "$" + Number(utilidad.ganancia || 0).toFixed(2));
  actualizarTexto("alertasStock", stockBajo.total);
}

function actualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.innerHTML = valor;
  }
}

// Registro global para el sistema de enrutado
window.cargarDashboard = cargarDashboard;