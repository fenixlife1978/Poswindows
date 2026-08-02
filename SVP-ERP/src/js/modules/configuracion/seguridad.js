const db = require("../../database");

function cambiarClave() {
  const usuario = document.getElementById("usuarioClave").value;
  const nuevaClave = document.getElementById("nuevaClave").value;

  if (!usuario || !nuevaClave) {
    alert("Usuario y contraseña son obligatorios");
    return;
  }

  db.prepare(`
    UPDATE usuarios
    SET clave=?
    WHERE usuario=?
  `).run(nuevaClave, usuario);

  alert("Contraseña actualizada con éxito para el usuario: " + usuario);
  
  // Limpiar campos
  document.getElementById("nuevaClave").value = "";
}

// Registro global para acceso desde la vista
window.cambiarClave = cambiarClave;
