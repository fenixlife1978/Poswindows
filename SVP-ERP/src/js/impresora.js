const {
  ipcRenderer
} = require("electron");

/**
 * Módulo de Impresión Térmica Industrial - SVP ERP
 * Formatea ráfagas de texto para papel de 80mm (aprox 42-48 caracteres por línea).
 */

function imprimirTicket80mm(venta, empresa) {
  const anchoPapel = 42;
  const separador = "-".repeat(anchoPapel) + "\n";
  
  let ticket = "";

  // Funciones auxiliares de formateo
  const centrar = (texto) => {
    const espacios = Math.max(0, Math.floor((anchoPapel - texto.length) / 2));
    return " ".repeat(espacios) + texto + "\n";
  };

  const fila = (col1, col2) => {
    const espacios = anchoPapel - col1.length - col2.length;
    return col1 + " ".repeat(Math.max(1, espacios)) + col2 + "\n";
  };

  // 1. Encabezado
  ticket += centrar(empresa.nombre || "SVP ERP");
  ticket += centrar("RIF: " + (empresa.rif || "J-00000000-0"));
  ticket += separador;

  // 2. Cabecera de Columnas
  ticket += fila("PRODUCTO", "TOTAL");
  ticket += separador;

  // 3. Detalle de Items
  venta.items.forEach(item => {
    const nombre = item.nombre.substring(0, 30).toUpperCase();
    const totalItem = (item.precio * item.cantidad).toFixed(2);
    ticket += nombre + "\n";
    ticket += fila(`  ${item.cantidad} x ${item.precio.toFixed(2)}`, totalItem);
  });

  ticket += separador;

  // 4. Totales USD
  ticket += centrar("TOTAL");
  ticket += centrar(venta.total.toFixed(2) + " USD");
  ticket += "\n";

  // 5. Totales Bs (Bimonetario)
  ticket += "Bs:\n";
  ticket += centrar(venta.totalBs || "0.00");
  ticket += centrar("(SEGÚN TASA BCV)");
  ticket += "\n";

  // 6. Pie de página
  ticket += separador;
  ticket += centrar("GRACIAS POR SU COMPRA");
  ticket += "\n\n\n\n\n"; // Espacio para corte manual o automático

  // Envío al proceso principal de Electron
  ipcRenderer.send("imprimir", ticket);
}

// Registro global para el Punto de Venta
window.imprimirTicketFisico80mm = imprimirTicket80mm;
