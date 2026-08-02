const db = require("../../database");

/**
 * Consulta la base de datos y renderiza la lista de productos en la tabla principal.
 */
function cargarProductos() {
  const productos = db.prepare(
    "SELECT * FROM productos ORDER BY nombre"
  ).all();

  const tabla = document.getElementById("tablaProductos");

  if (!tabla) return;

  tabla.innerHTML = "";

  productos.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td class="border-r border-[#D4D0C8] font-mono">${p.codigo}</td>
        <td class="border-r border-[#D4D0C8] uppercase font-bold">${p.nombre}</td>
        <td class="border-r border-[#D4D0C8] uppercase text-[9px]">${p.categoria || "GENERAL"}</td>
        <td class="border-r border-[#D4D0C8] text-right font-mono font-bold text-blue-900">$${Number(p.precio).toFixed(2)}</td>
        <td class="border-r border-[#D4D0C8] text-center font-mono ${p.stock <= (p.stockMinimo || 5) ? 'text-red-700 font-black' : ''}">${p.stock}</td>
        <td class="text-center">
          <button class="action-btn" onclick="editarProducto(${p.id})">
            Editar
          </button>
          <button class="action-btn" onclick="eliminarProducto(${p.id})" style="color: #dc2626;">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });

  // Actualizar contadores en la barra de estado si existen
  const countEl = document.getElementById("countProductos");
  if (countEl) countEl.innerText = productos.length;
}

/**
 * Procesa el guardado de un nuevo producto capturando los datos del modal.
 */
function guardarProducto() {
  const datos = {
    codigo: document.getElementById("prodCodigo").value,
    nombre: document.getElementById("prodNombre").value,
    categoria: document.getElementById("prodCategoria").value,
    costo: Number(document.getElementById("prodCosto").value),
    precio: Number(document.getElementById("prodPrecio").value),
    stock: Number(document.getElementById("prodStock").value)
  };

  if (!datos.codigo || !datos.nombre) {
    alert("Código y Nombre son campos obligatorios.");
    return;
  }

  try {
    db.prepare(`
      INSERT INTO productos 
      (codigo, nombre, categoria, costo, precio, stock)
      VALUES (?,?,?,?,?,?)
    `).run(
      datos.codigo,
      datos.nombre,
      datos.categoria,
      datos.costo,
      datos.precio,
      datos.stock
    );

    cerrarModal();
    cargarProductos();
  } catch (error) {
    console.error("Error al guardar producto:", error);
    alert("Error: El código del producto ya existe o los datos son inválidos.");
  }
}

/**
 * Elimina un producto por ID previa confirmación.
 */
function eliminarProducto(id) {
  if (!confirm("¿Está seguro de eliminar este producto del inventario? Esta acción no se puede deshacer.")) {
    return;
  }

  db.prepare("DELETE FROM productos WHERE id=?").run(id);
  cargarProductos();
}

/**
 * Despliega el modal de edición para actualizar precio y existencia de un producto.
 */
function editarProducto(id) {
  const producto = db.prepare("SELECT * FROM productos WHERE id=?").get(id);

  if (!producto) return;

  abrirModal(
    "Editar Producto: " + producto.nombre,
    `
    <div class="form-group">
      <label>Precio de Venta USD:</label>
      <input id="editPrecio" value="${producto.precio}" type="number" step="0.01" class="font-mono text-right text-blue-900">
    </div>
    <div class="form-group">
      <label>Existencia Actual (Stock):</label>
      <input id="editStock" value="${producto.stock}" type="number" class="font-mono text-center">
    </div>
    `,
    () => {
      const nuevoPrecio = Number(document.getElementById("editPrecio").value);
      const nuevoStock = Number(document.getElementById("editStock").value);

      db.prepare(`
        UPDATE productos 
        SET precio=?, stock=? 
        WHERE id=?
      `).run(nuevoPrecio, nuevoStock, id);

      cerrarModal();
      cargarProductos();
    }
  );
}

// Registro global de funciones operativas
window.cargarProductos = cargarProductos;
window.guardarProducto = guardarProducto;
window.eliminarProducto = eliminarProducto;
window.editarProducto = editarProducto;
