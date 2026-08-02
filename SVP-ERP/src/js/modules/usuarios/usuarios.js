
const db = require("../../database");

/**
 * Consulta la base de datos SQLite y renderiza la lista de usuarios.
 */
function cargarUsuarios() {
  if (!validarAcceso('configuracion')) return;

  const usuarios = db.prepare("SELECT id, nombre, usuario, rol FROM usuarios ORDER BY nombre ASC").all();
  const tabla = document.getElementById("tablaUsuarios");

  if (!tabla) return;

  tabla.innerHTML = "";

  usuarios.forEach(u => {
    tabla.innerHTML += `
      <tr>
        <td class="border-r border-[#D4D0C8] uppercase font-bold text-left px-4 h-8">${u.nombre}</td>
        <td class="border-r border-[#D4D0C8] font-mono text-center">${u.usuario}</td>
        <td class="border-r border-[#D4D0C8] text-center">
          <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-sm ${u.rol === 'Administrador' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}">
            ${u.rol}
          </span>
        </td>
        <td class="text-center">
          <button class="action-btn" onclick="eliminarUsuario(${u.id})" style="color: #dc2626;" ${u.usuario === 'admin' ? 'disabled title="No se puede eliminar el admin base"' : ''}>
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

/**
 * Despliega el modal de registro para nuevos operadores con selector de roles y permisos.
 */
function nuevoUsuario() {
  const contenido = `
    <div class="form-group">
      <label>Nombre Completo:</label>
      <input id="userNombre" placeholder="NOMBRE DEL TRABAJADOR" class="uppercase">
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="form-group">
        <label>Usuario (Login):</label>
        <input id="userLogin" placeholder="USUARIO" class="lowercase font-mono">
      </div>
      <div class="form-group">
        <label>Contraseña:</label>
        <input id="userClave" type="password" placeholder="••••••••">
      </div>
    </div>
    <div class="form-group">
      <label>Rol del Sistema:</label>
      <select id="userRol" onchange="preseleccionarPermisosPorRol(this.value)">
        <option value="Vendedor">Vendedor</option>
        <option value="Cajero">Cajero</option>
        <option value="Almacén">Almacén</option>
        <option value="Gerente">Gerente</option>
        <option value="Administrador">Administrador</option>
      </select>
    </div>
    <div class="form-group">
      <label class="mb-2">Permisos de Acceso:</label>
      <div id="checkPermisos" class="grid grid-cols-2 gap-1 bg-white p-2 border border-gray-400 max-h-32 overflow-y-auto">
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="pos"> PUNTO DE VENTA</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="ventas"> VENTAS / FACTURAS</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="compras"> COMPRAS / GASTOS</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="inventario"> INVENTARIO</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="caja"> CONTROL DE CAJA</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="reportes"> REPORTES</label>
        <label class="flex items-center gap-2 text-[9px]"><input type="checkbox" value="configuracion"> CONFIGURACIÓN</label>
      </div>
    </div>
  `;

  abrirModal("Registro de Nuevo Operador", contenido, guardarUsuario);
}

/**
 * Helper para facilitar la creación de usuarios pre-configurando permisos comunes.
 */
function preseleccionarPermisosPorRol(rol) {
  const checks = document.querySelectorAll('#checkPermisos input');
  checks.forEach(c => c.checked = false);

  const presets = {
    'Vendedor': ['pos'],
    'Cajero': ['pos', 'caja', 'ventas'],
    'Almacén': ['inventario', 'compras'],
    'Gerente': ['pos', 'ventas', 'compras', 'inventario', 'caja', 'reportes'],
    'Administrador': ['pos', 'ventas', 'compras', 'inventario', 'caja', 'reportes', 'configuracion']
  };

  (presets[rol] || []).forEach(p => {
    const check = document.querySelector(`#checkPermisos input[value="${p}"]`);
    if (check) check.checked = true;
  });
}

function guardarUsuario() {
  const nombre = document.getElementById("userNombre").value;
  const usuario = document.getElementById("userLogin").value;
  const clave = document.getElementById("userClave").value;
  const rol = document.getElementById("userRol").value;

  const permisosArray = [];
  document.querySelectorAll('#checkPermisos input:checked').forEach(c => permisosArray.push(c.value));
  const permisosStr = permisosArray.join(',');

  if (!nombre || !usuario || !clave) {
    alert("Complete los campos de identificación obligatorios.");
    return;
  }

  try {
    db.prepare(`
      INSERT INTO usuarios (nombre, usuario, clave, rol, permisos) 
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, usuario, clave, rol, permisosStr);
    
    cerrarModal();
    cargarUsuarios();
  } catch (e) {
    alert("Error: El nombre de usuario ya existe en el sistema.");
  }
}

function eliminarUsuario(id) {
  if (!confirm("¿Desea eliminar este acceso de forma permanente?")) return;
  db.prepare("DELETE FROM usuarios WHERE id = ?").run(id);
  cargarUsuarios();
}

window.cargarUsuarios = cargarUsuarios;
window.eliminarUsuario = eliminarUsuario;
window.nuevoUsuario = nuevoUsuario;
window.preseleccionarPermisosPorRol = preseleccionarPermisosPorRol;
