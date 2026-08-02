function cargarConfiguracion() {
  const db = getDB();

  let nombre = document.getElementById("empresaNombre");
  if (nombre) {
    nombre.value = db.empresa.nombre;
  }

  let rif = document.getElementById("empresaRif");
  if (rif) {
    rif.value = db.empresa.rif || "";
  }

  let direccion = document.getElementById("empresaDireccion");
  if (direccion) {
    direccion.value = db.empresa.direccion || "";
  }

  let tasa = document.getElementById("tasaCambio");
  if (tasa) {
    tasa.value = db.empresa.tasa || "";
  }
}

function guardarConfiguracion() {
  const db = getDB();

  db.empresa.nombre = document.getElementById("empresaNombre").value;
  db.empresa.rif = document.getElementById("empresaRif").value;
  db.empresa.direccion = document.getElementById("empresaDireccion").value;
  db.empresa.tasa = Number(document.getElementById("tasaCambio").value);

  saveDB(db);

  alert("Configuración guardada");

  // Actualizar el nombre en el topbar si la función existe
  if (typeof cargarConfig === 'function') {
    cargarConfig();
  }
}
