const db = require("../../database");

/**
 * Inicializa los impuestos base del sistema en la base de datos SQLite.
 * Asegura que el registro del IVA exista con el valor estándar del 16%.
 */
function cargarImpuestos() {
  let iva = db.prepare(
    "SELECT * FROM impuestos WHERE nombre='IVA'"
  ).get();

  if (!iva) {
    db.prepare(`
      INSERT INTO impuestos
      (nombre, porcentaje, activo)
      VALUES ('IVA', 16, 1)
    `).run();
    console.log("Impuesto IVA inicializado correctamente.");
  }
}

// Ejecución automática al cargar el módulo
cargarImpuestos();
