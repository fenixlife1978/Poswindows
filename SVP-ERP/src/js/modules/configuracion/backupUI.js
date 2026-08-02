function seleccionarBackup() {
  const archivo = document.getElementById("archivoBackup").files[0];

  if (archivo) {
    // En Electron con nodeIntegration: true, el objeto File tiene la propiedad .path
    restaurarBackup(archivo.path);
  } else {
    alert("Por favor, seleccione un archivo de respaldo (.sqlite) primero.");
  }
}
