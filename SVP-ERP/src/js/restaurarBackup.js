const fs = require("fs");
const path = require("path");

/**
 * Módulo de Restauración de Base de Datos SVP ERP.
 * Gestiona el reemplazo del archivo físico SQLite por una copia previa.
 */

const rutaDB = path.join(
  __dirname,
  "../../database/svp.sqlite"
);

/**
 * Reemplaza el archivo de base de datos actual por el archivo especificado.
 * @param {string} archivo - Ruta absoluta al archivo .sqlite de respaldo.
 */
function restaurarBackup(archivo) {
  if (!fs.existsSync(archivo)) {
    alert("Error: El archivo de origen no se encuentra en el disco.");
    return;
  }

  const confirmacion = confirm(
    "¡ADVERTENCIA CRÍTICA!\n\n" +
    "Está a punto de sobreescribir la base de datos actual.\n" +
    "Todos los cambios realizados desde el último respaldo se perderán.\n\n" +
    "¿Desea continuar con la restauración?"
  );

  if (!confirmacion) return;

  try {
    // Realizamos la copia física
    fs.copyFileSync(archivo, rutaDB);

    alert("Restauración completada con éxito. El sistema se reiniciará para aplicar los cambios.");
    
    // Forzamos el reinicio de la aplicación Electron
    location.reload();
  } catch (error) {
    console.error("Error crítico en restauración:", error);
    alert("Error durante la restauración: " + error.message);
  }
}

// Registro global para el acceso desde otros módulos
window.restaurarBackup = restaurarBackup;
