function abrirModal(
  titulo,
  contenido,
  accion
) {
  const modal = document.getElementById("modalContainer");

  document.getElementById("modalTitle").innerHTML = titulo;
  document.getElementById("modalBody").innerHTML = contenido;
  document.getElementById("modalGuardar").onclick = accion;

  modal.classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("modalContainer").classList.add("hidden");
}
