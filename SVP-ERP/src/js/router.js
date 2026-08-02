/**
 * Enrutador modular para SVP ERP.
 * Carga las vistas HTML desde src/views/ y ejecuta los controladores.
 */
function cargarVista(vista) {
  const contenedor = document.getElementById("contenido");
  
  fetch("views/" + vista + ".html")
    .then(r => r.text())
    .then(html => {
      contenedor.innerHTML = html;
      activarLogicaModulo(vista);
    })
    .catch(err => console.error("Error cargando vista:", vista, err));
}

function activarLogicaModulo(vista) {
  switch (vista) {
    case "login":
      // Lógica inicial de login si es necesaria
      break;
    case "dashboard":
      if (typeof cargarDashboard === 'function') cargarDashboard();
      break;
    case "pos":
      if (typeof iniciarPOS === 'function') iniciarPOS();
      break;
    case "productos":
      if (typeof cargarProductos === 'function') cargarProductos();
      break;
    case "clientes":
      if (typeof cargarClientes === 'function') cargarClientes();
      break;
    case "inventario":
      if (typeof cargarInventario === 'function') cargarInventario();
      break;
    case "ventas":
      if (typeof cargarVentas === 'function') cargarVentas();
      break;
    case "caja":
      if (typeof cargarCaja === 'function') cargarCaja();
      break;
    case "reportes":
      if (typeof cargarReportes === 'function') cargarReportes();
      break;
    case "configuracion":
      if (typeof cargarConfiguracion === 'function') cargarConfiguracion();
      break;
  }
}

window.cargarVista = cargarVista;