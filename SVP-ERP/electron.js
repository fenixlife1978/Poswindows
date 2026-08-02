const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: "SVP ERP - Sistema Administrativo Profesional",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carga el archivo principal desde la carpeta src
  ventana.loadFile(path.join(__dirname, "src/index.html"));

  // Manejo de impresión física
  ipcMain.on("imprimir", (event, datos) => {
    console.log("Enviando a cola de impresión:", datos);
    // Aquí se integraría con librerías como 'pdf-to-printer' o 'escpos'
  });
}

app.whenReady().then(() => {
  crearVentana();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
