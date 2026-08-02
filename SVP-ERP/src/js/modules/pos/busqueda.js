const db = require("../../database");

/**
 * Realiza una búsqueda de productos en la base de datos SQLite y renderiza los resultados.
 * @param {string} texto - Criterio de búsqueda (nombre o código).
 */
function buscarProductoPOS(texto) {
  const productos = db.prepare(`
    SELECT *
    FROM productos
    WHERE codigo LIKE ?
    OR nombre LIKE ?
    LIMIT 20
  `).all(
    "%" + texto + "%",
    "%" + texto + "%"
  );

  const tabla = document.getElementById("resultadoProductosPOS");
  if (!tabla) return;

  tabla.innerHTML = "";

  productos.forEach(p => {
    tabla.innerHTML += `
      <tr class="hover:bg-blue-50">
        <td>${p.nombre}</td>
        <td class="text-right font-mono font-bold text-blue-900">$${p.precio.toFixed(2)}</td>
        <td class="text-center font-mono ${p.stock < 10 ? 'text-red-700 font-black' : ''}">${p.stock}</td>
        <td class="text-center">
          <button class="action-btn" onclick="agregarProductoPOS(${p.id})">
            Agregar
          </button>
        </td>
      </tr>
    `;
  });
}

// Registro global para el acceso desde el evento oninput del HTML
window.buscarProductoPOS = buscarProductoPOS;
