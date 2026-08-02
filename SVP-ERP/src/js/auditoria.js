const db = require("./database");

/**
 * Registra una acción en la bitácora de auditoría del sistema.
 * Captura el usuario activo de la sesión, la acción realizada y el módulo correspondiente.
 * @param {string} accion - Descripción de la actividad realizada.
 * @param {string} modulo - Nombre del módulo donde se ejecutó la acción.
 */
function registrarAuditoria(accion, modulo) {
  const usuarioData = sessionStorage.getItem("usuarioSVP");
  const usuario = usuarioData ? JSON.parse(usuarioData) : null;

  db.prepare(`
    INSERT INTO auditoria
    (usuario, accion, modulo, fecha)
    VALUES (?, ?, ?, datetime('now', 'localtime'))
  `).run(
    usuario?.usuario || "Sistema", 
    accion, 
    modulo
  );
}

// Registro global para acceso desde otros módulos y vistas
window.registrarAuditoria = registrarAuditoria;
