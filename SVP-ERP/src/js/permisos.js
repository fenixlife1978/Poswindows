
/**
 * Sistema de gestión de permisos de SVP ERP.
 * Verifica los privilegios del usuario activo basándose en su rol o lista de permisos asignados.
 */

function tienePermiso(permiso) {
  const usuario = typeof obtenerUsuario === 'function' ? obtenerUsuario() : null;

  if (!usuario) return false;

  // Los administradores tienen acceso total por defecto
  if (usuario.rol === "Administrador") return true;

  // Si el usuario no tiene la propiedad permisos o está vacía, no tiene acceso
  if (!usuario.permisos) return false;

  // Convertimos la cadena de permisos en array y buscamos el permiso solicitado
  const listaPermisos = usuario.permisos.split(',');
  return listaPermisos.includes(permiso.toLowerCase());
}

/**
 * Valida el acceso a una acción y muestra una alerta si no está permitido.
 */
function validarAcceso(permiso) {
  if (!tienePermiso(permiso)) {
    alert("ACCESO DENEGADO: No tiene privilegios para acceder al módulo de " + permiso.toUpperCase());
    return false;
  }
  return true;
}

/**
 * Filtra los elementos del menú lateral basándose en los permisos del usuario logueado.
 * Se ejecuta después de cargar la vista del menú.
 */
function aplicarSeguridadInterfaz() {
  const modulos = ['pos', 'ventas', 'compras', 'inventario', 'caja', 'reportes', 'configuracion', 'usuarios'];
  
  modulos.forEach(modulo => {
    const btn = document.querySelector(`button[onclick*="cargarVista('${modulo}')"]`);
    if (btn && !tienePermiso(modulo)) {
      btn.style.display = 'none'; // Ocultar si no tiene permiso
    }
  });
}

// Registro global
window.tienePermiso = tienePermiso;
window.validarAcceso = validarAcceso;
window.aplicarSeguridadInterfaz = aplicarSeguridadInterfaz;
