
const db = require("../../database");

function cargarConfiguracion() {
  const config = db.prepare("SELECT * FROM configuracion WHERE id=1").get();

  if (!config) return;

  document.getElementById("nombreEmpresa").value = config.nombreEmpresa || "";
  document.getElementById("tasaBCV").value = config.tasaBCV || 0;
  document.getElementById("iva").value = config.iva || 16;
  
  // Cargar datos de sync
  const chkSync = document.getElementById("syncEnabled");
  if (chkSync) chkSync.checked = config.sync_enabled === 1;
  
  const urlSync = document.getElementById("syncApiUrl");
  if (urlSync) urlSync.value = config.sync_api_url || "";
  
  const tokenSync = document.getElementById("syncToken");
  if (tokenSync) tokenSync.value = config.sync_token || "";
}

function guardarConfiguracion() {
  const nombre = document.getElementById("nombreEmpresa").value;
  const tasa = Number(document.getElementById("tasaBCV").value);
  const iva = Number(document.getElementById("iva").value);
  
  const syncEnabled = document.getElementById("syncEnabled").checked ? 1 : 0;
  const syncApiUrl = document.getElementById("syncApiUrl").value;
  const syncToken = document.getElementById("syncToken").value;

  db.prepare(`
    UPDATE configuracion
    SET
      nombreEmpresa=?,
      tasaBCV=?,
      iva=?,
      sync_enabled=?,
      sync_api_url=?,
      sync_token=?
    WHERE id=1
  `).run(
    nombre,
    tasa,
    iva,
    syncEnabled,
    syncApiUrl,
    syncToken
  );

  alert("Configuración guardada exitosamente");
  
  if (syncEnabled && navigator.onLine) {
    if (typeof SyncEngine !== 'undefined') SyncEngine.ejecutarSincronizacion();
  }
}

window.cargarConfiguracion = cargarConfiguracion;
window.guardarConfiguracion = guardarConfiguracion;
