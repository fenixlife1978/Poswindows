const db = require("./database");

let usuarioActual = null;

/**
 * Procesa el inicio de sesión consultando la tabla de usuarios.
 * Valida credenciales, persiste la sesión en localStorage y activa la vista del sistema.
 */
function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const sucursalId = Number(document.getElementById("sucursalLogin").value);

  const encontrado = db.prepare(`
    SELECT *
    FROM usuarios
    WHERE usuario = ?
    AND clave = ?
  `).get(usuario, clave);

  if (!encontrado) {
    alert("Usuario o clave incorrectos");
    return;
  }

  // Vincular la sucursal seleccionada a la sesión
  encontrado.sucursalId = sucursalId;
  const sucursalNombre = db.prepare("SELECT nombre FROM sucursales WHERE id = ?").get(sucursalId)?.nombre || "Sucursal";
  encontrado.sucursalNombre = sucursalNombre;

  usuarioActual = encontrado;

  localStorage.setItem(
    "usuarioSVP",
    JSON.stringify(encontrado)
  );

  // Ejecuta la transición visual y carga el tablero inicial
  location.reload(); // Recargamos para que el SystemShell tome los nuevos datos
}

/**
 * Popula el select de sucursales en la pantalla de login.
 */
function cargarSucursalesLogin() {
  const sucursales = db.prepare("SELECT id, nombre FROM sucursales ORDER BY id ASC").all();
  const select = document.getElementById("sucursalLogin");
  
  if (!select) return;

  select.innerHTML = sucursales.map(s => `
    <option value="${s.id}">${s.nombre}</option>
  `).join('');
}

/**
 * Retorna los datos del usuario en sesión desde la memoria o el almacenamiento local.
 */
function obtenerUsuario() {
  if (usuarioActual) return usuarioActual;
  
  const guardado = localStorage.getItem("usuarioSVP");
  return guardado ? JSON.parse(guardado) : null;
}

/**
 * Finaliza la sesión actual limpiando el almacenamiento y recargando la aplicación.
 */
function cerrarSesion() {
  localStorage.removeItem("usuarioSVP");
  location.reload();
}

// Registro global para acceso desde los eventos de la interfaz (onclick)
window.iniciarSesion = iniciarSesion;
window.obtenerUsuario = obtenerUsuario;
window.cerrarSesion = cerrarSesion;
window.cargarSucursalesLogin = cargarSucursalesLogin;