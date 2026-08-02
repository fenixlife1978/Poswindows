const db = require("../../database");

/**
 * Busca clientes en la base de datos SQLite por nombre o documento.
 * @param {string} texto - Criterio de búsqueda.
 */
function buscarClientePOS(texto) {
  const clientes = db.prepare(`
    SELECT *
    FROM clientes
    WHERE nombre LIKE ?
    OR documento LIKE ?
    LIMIT 10
  `).all("%" + texto + "%", "%" + texto + "%");

  // Se asume que la función de renderizado mostrarClientesPOS será definida en la vista del POS
  if (typeof mostrarClientesPOS === 'function') {
    mostrarClientesPOS(clientes);
  }
}

/**
 * Selecciona un cliente para la venta actual y actualiza la interfaz.
 * @param {number} id - ID del cliente seleccionado.
 */
function seleccionarClientePOS(id) {
  // clienteVentaActual es una variable global definida en pos.js
  clienteVentaActual = db.prepare(
    "SELECT * FROM clientes WHERE id=?"
  ).get(id);

  const elemento = document.getElementById("clientePOS");

  if (elemento && clienteVentaActual) {
    elemento.innerHTML = clienteVentaActual.nombre;
  }
}
