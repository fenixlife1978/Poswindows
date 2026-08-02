/**
 * Punto de entrada de la aplicación en el Renderer Process.
 */
document.addEventListener("DOMContentLoaded", () => {
  const user = obtenerUsuarioActivo();

  if (!user) {
    cargarVista("login");
  } else {
    inicializarEntornoERP(user);
  }
});

function obtenerUsuarioActivo() {
  const data = localStorage.getItem("usuarioSVP");
  return data ? JSON.parse(data) : null;
}

function inicializarEntornoERP(user) {
  // Cargar menú lateral
  const menuContainer = document.getElementById("menu");
  fetch("views/menu.html")
    .then(r => r.text())
    .then(html => {
      menuContainer.innerHTML = html;
      document.getElementById("nombreUsuario").innerText = user.nombre;
      
      // Aplicar filtros de seguridad al menú
      if (typeof aplicarSeguridadInterfaz === 'function') {
        aplicarSeguridadInterfaz();
      }
      
      // Cargar dashboard por defecto
      cargarVista("dashboard");
    });
}

function logout() {
  localStorage.removeItem("usuarioSVP");
  location.reload();
}

window.logout = logout;