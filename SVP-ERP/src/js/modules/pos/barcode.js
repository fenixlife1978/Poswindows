/**
 * Módulo de Automatización de Código de Barras - SVP ERP
 * Procesa la ráfaga del lector USB y agrega productos al POS automáticamente.
 */

const db = require("../../database");

let codigoBuffer = "";
let lastKeyTime = Date.now();

document.addEventListener("keydown", (e) => {
  const currentTime = Date.now();
  
  // Si el tiempo entre teclas es muy alto, asumimos que es escritura manual y reiniciamos
  // Los lectores USB suelen enviar caracteres con menos de 30ms de diferencia
  if (currentTime - lastKeyTime > 100) {
    codigoBuffer = "";
  }
  
  lastKeyTime = currentTime;

  // Evitar capturar si el usuario está escribiendo en campos de texto específicos (excepto el buscador del POS)
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    if (e.target.id !== "buscarProductoPOS") return;
  }

  if (e.key === "Enter") {
    if (codigoBuffer.length > 0) {
      procesarCodigoEscaneado(codigoBuffer);
      codigoBuffer = "";
      
      // Detener propagación para evitar que el Enter envíe formularios accidentalmente
      e.preventDefault();
      e.stopPropagation();
    }
  } else {
    // Solo acumulamos caracteres alfanuméricos legibles
    if (e.key.length === 1) {
      codigoBuffer += e.key;
    }
  }
});

/**
 * Busca el producto por código exacto y lo inyecta en el carrito.
 * @param {string} codigo 
 */
function procesarCodigoEscaneado(codigo) {
  try {
    const producto = db.prepare("SELECT id, nombre FROM productos WHERE codigo = ?").get(codigo);

    if (producto) {
      console.log(`Lector USB: Agregando "${producto.nombre}"`);
      
      if (typeof window.agregarProductoPOS === 'function') {
        window.agregarProductoPOS(producto.id);
        
        // Feedback visual opcional: limpiar el buscador si el código vino de ahí
        const buscador = document.getElementById("buscarProductoPOS");
        if (buscador) buscador.value = "";
      }
    } else {
      console.warn(`Lector USB: Código "${codigo}" no registrado en el inventario.`);
    }
  } catch (error) {
    console.error("Error al procesar código de barras:", error);
  }
}
