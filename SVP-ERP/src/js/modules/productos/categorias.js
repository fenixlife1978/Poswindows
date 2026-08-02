const db = require("../../database");

/**
 * Registra una nueva categoría en el sistema.
 * @param {string} nombre - El nombre de la categoría.
 */
function crearCategoria(nombre) {
  if (!nombre) return;

  try {
    db.prepare(`
      INSERT INTO categorias (nombre)
      VALUES(?)
    `).run(nombre.toUpperCase());
    
    console.log("Categoría creada: " + nombre);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    alert("La categoría ya existe o es inválida.");
  }
}

/**
 * Muestra un prompt al usuario para ingresar el nombre de la nueva categoría.
 */
function crearCategoriaPrompt() {
  const nombre = prompt("Nombre categoría");

  if (nombre && nombre.trim() !== "") {
    crearCategoria(nombre.trim());
    alert("Categoría registrada con éxito.");
  }
}

// Registro global para acceso desde la interfaz
window.crearCategoria = crearCategoria;
window.crearCategoriaPrompt = crearCategoriaPrompt;
