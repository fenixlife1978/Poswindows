const db = require("../../database");

/**
 * Añade un producto al carrito de compras del POS.
 * Busca el producto en la base de datos y lo agrega o incrementa su cantidad.
 * @param {number} id - El ID del producto a agregar.
 */
function agregarProductoPOS(id) {
  const producto = db.prepare(
    "SELECT * FROM productos WHERE id=?"
  ).get(id);

  if (!producto) return;

  // Accedemos a la variable global definida en pos.js
  const existe = carritoPOS.find(
    p => p.id === id
  );

  if (existe) {
    existe.cantidad++;
  } else {
    carritoPOS.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  // Refresca la vista del ticket
  if (typeof actualizarTicket === 'function') {
    actualizarTicket();
  }
}

// Exportación global para que sea invocada desde los resultados de búsqueda
window.agregarProductoPOS = agregarProductoPOS;
