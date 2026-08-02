const fs = require("fs");
const path = require("path");

const carpetaLogs = path.join(__dirname, "../../logs");
const archivoLog = path.join(carpetaLogs, "svp.log");

/**
 * Registra un evento con sello de tiempo en el archivo de log físico.
 * @param {string} texto - Mensaje o descripción de la actividad.
 */
function registrarEvento(texto) {
  try {
    if (!fs.existsSync(carpetaLogs)) {
      fs.mkdirSync(carpetaLogs, { recursive: true });
    }
    const fecha = new Date().toISOString();
    fs.appendFileSync(archivoLog, `${fecha} - ${texto}\n`);
  } catch (err) {
    console.error("Error crítico al escribir en el registro de eventos:", err);
  }
}

window.registrarEvento = registrarEvento;
