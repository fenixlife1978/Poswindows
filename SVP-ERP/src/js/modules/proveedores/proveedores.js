const db = require("../../database");

/**
 * Consulta la base de datos SQLite y renderiza la lista de proveedores en la tabla correspondiente.
 */
function cargarProveedores() {
  const tabla = document.getElementById("tablaProveedores");

  if (!tabla) return;

  const proveedores = db.prepare(
    "SELECT * FROM proveedores ORDER BY nombre ASC"
  ).all();

  tabla.innerHTML = "";

  proveedores.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.rif || ""}</td>
        <td>${p.telefono || ""}</td>
        <td>
          <button class="action-btn delete" onclick="eliminarProveedor(${p.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

/**
 * Captura los datos del formulario y los persiste en la tabla de proveedores de SQLite.
 */
function guardarProveedor() {
  const nombreInput = document.getElementById("provNombre");
  const rifInput = document.getElementById("provRif");
  const telefonoInput = document.getElementById("provTelefono");
  const correoInput = document.getElementById("provCorreo");

  if (!nombreInput) return;

  const nombre = nombreInput.value;
  const rif = rifInput ? rifInput.value : "";
  const telefono = telefonoInput ? telefonoInput.value : "";
  const correo = correoInput ? correoInput.value : "";

  if (!nombre) {
    alert("El nombre del proveedor es obligatorio");
    return;
  }

  db.prepare(`
    INSERT INTO proveedores
    (nombre, rif, telefono, correo)
    VALUES (?,?,?,?)
  `).run(nombre, rif, telefono, correo);

  // Cerrar el modal utilizando la utilidad global
  if (typeof cerrarModal === 'function') {
    cerrarModal();
  }

  cargarProveedores();
}

/**
 * Elimina un proveedor de la base de datos previa confirmación del usuario.
 * @param {number} id - El ID del proveedor a eliminar.
 */
function eliminarProveedor(id) {
  if (!confirm("¿Está seguro de eliminar este proveedor?")) return;

  db.prepare("DELETE FROM proveedores WHERE id=?").run(id);
  cargarProveedores();
}
