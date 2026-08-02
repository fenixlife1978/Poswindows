let codigoEscaneado = "";

document.addEventListener(
  "keydown",
  (e) => {
    // Evitar capturar si el usuario está escribiendo en un campo de entrada
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.key === "Enter") {
      if (codigoEscaneado.length > 0) {
        buscarCodigoBarras(codigoEscaneado);
        codigoEscaneado = "";
      }
      return;
    }

    // Solo capturar caracteres legibles (evitar Shift, Ctrl, etc.)
    if (e.key.length === 1) {
      codigoEscaneado += e.key;
    }
  }
);

function buscarCodigoBarras(codigo) {
  const db = getDB();
  const producto = db.productos.find(p => p.codigo === codigo);

  if (producto) {
    if (typeof agregarProductoPOS === 'function') {
      agregarProductoPOS(producto.id);
    }
  } else {
    console.log("Código no encontrado: " + codigo);
  }
}