/**
 * Motor de diálogos modales para SVP ERP.
 * Genera ventanas emergentes dinámicas con soporte para acciones personalizadas.
 */

function abrirModal(titulo, contenido, accion) {
  let modal = document.getElementById("modalSVP");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalSVP";
    document.body.appendChild(modal);
  }

  // Estructura HTML con clases de estilo industrial Win32
  modal.innerHTML = `
    <div class="modal-fondo">
      <div class="modal-contenido">
        <div class="modal-titulo-bar">
          <span class="modal-titulo">${titulo}</span>
          <button class="modal-close-x" onclick="cerrarModal()">X</button>
        </div>
        <div class="modal-body-content">
          ${contenido}
        </div>
        <div class="modal-footer-btns">
          <button id="guardarModal" class="action-btn">
            Guardar
          </button>
          <button onclick="cerrarModal()" class="action-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "block";

  const btnGuardar = document.getElementById("guardarModal");
  if (btnGuardar) {
    btnGuardar.onclick = () => {
      if (typeof accion === 'function') accion();
    };
  }
}

function cerrarModal() {
  const modal = document.getElementById("modalSVP");
  if (modal) {
    modal.style.display = "none";
  }
}

// Registro global para acceso desde otros módulos
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
