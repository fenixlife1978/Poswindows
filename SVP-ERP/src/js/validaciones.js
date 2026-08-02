function campoRequerido(id) {
  const campo = document.getElementById(id);
  if (!campo || campo.value.trim() === "") {
    alert("Complete todos los campos requeridos");
    return false;
  }
  return true;
}

function validarNumero(valor) {
  return !isNaN(Number(valor)) && Number(valor) >= 0;
}

function validarPrecio(valor) {
  if (!validarNumero(valor)) {
    alert("Precio inválido");
    return false;
  }
  return true;
}
