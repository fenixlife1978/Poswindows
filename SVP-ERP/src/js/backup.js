const fs = require("fs");
const path = require("path");

/**
 * Módulo de Respaldo Físico SVP ERP
 * Gestiona la duplicación del archivo de base de datos SQLite.
 */

const rutaDB = path.join(
  __dirname, 
  "../../database/svp.sqlite"
);

function crearBackup() {
  try {
    const carpetaBackup = path.join(
      __dirname, 
      "../../backups"
    );

    // Asegurar que la carpeta de destino exista
    if (!fs.existsSync(carpetaBackup)) {
      fs.mkdirSync(carpetaBackup, { recursive: true });
    }

    // Generar nombre de archivo con marca de tiempo ISO segura para Windows
    const fecha = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\./g, "-");

    const destino = path.join(
      carpetaBackup,
      "backup_" + fecha + ".sqlite"
    );

    // Copia binaria síncrona
    fs.copyFileSync(rutaDB, destino);

    alert("Backup creado correctamente en la carpeta /backups");
    
    // Registrar en auditoría si el módulo está disponible
    if (typeof window.registrarAuditoria === 'function') {
      window.registrarAuditoria("Creación de respaldo manual", "Seguridad");
    }

  } catch (error) {
    console.error("Error en backup:", error);
    alert("Error crítico al crear el respaldo: " + error.message);
  }
}

// Registro global para acceso desde la interfaz de usuario
window.crearBackup = crearBackup;
