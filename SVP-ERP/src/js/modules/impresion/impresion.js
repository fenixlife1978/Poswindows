const {
  ipcRenderer
} = require("electron");

/**
 * Envía el contenido del ticket al proceso principal de Electron para su impresión física.
 * @param {Object} venta - Datos de la venta incluyendo items y totales bimonetarios.
 */
function imprimirTicket(venta) {
  const contenido = `
${venta.empresa || "SVP ERP"}
----------------------------
Fecha: ${venta.fecha}

${venta.items.map(
    i =>
    i.nombre +
    " x " +
    i.cantidad +
    "  " +
    "$" +
    (i.precio * i.cantidad).toFixed(2)
  ).join("\n")}

----------------------------

TOTAL USD: $${venta.total.toFixed(2)}
TOTAL BS: Bs ${venta.totalBs || "0.00"}

----------------------------

Gracias por su compra
`;

  ipcRenderer.send("imprimir", contenido);
}

/**
 * Genera una ventana de impresión para una factura detallada.
 * Soporta tanto un objeto de venta como contenido HTML directo.
 * @param {Object} data - Datos de la venta o { contenido: html }.
 */
function imprimirFactura(data) {
  const ventana = window.open("", "", "width=800,height=1000");

  if (!ventana) {
    alert("Por favor permita las ventanas emergentes para imprimir.");
    return;
  }

  // Si viene el contenido ya formateado lo usamos, de lo contrario usamos el generador interno
  const htmlBody = data.contenido ? data.contenido : `
    <h1>FACTURA DE VENTA</h1>
    ${typeof crearHTMLFactura === 'function' ? crearHTMLFactura(data) : '<p>Error cargando detalles</p>'}
  `;

  ventana.document.write(`
    <html>
    <head>
      <title>Factura SVP ERP</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
        h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-top: 0; }
        .factura-box { border: 1px solid #ddd; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f3f4f6; text-align: left; padding: 12px; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
        .total-section { text-align: right; margin-top: 30px; }
        @media print {
          body { padding: 0; }
          .factura-box { border: none; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="factura-box">
        ${htmlBody}
      </div>
      <script>
        window.onload = function() { 
          window.print(); 
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
    </html>
  `);

  ventana.document.close();
}

/**
 * Helper para generar el cuerpo HTML de la factura (Mantenido por compatibilidad).
 */
function crearHTMLFactura(venta) {
  return `
    <div style="margin-bottom: 20px;">
      <strong>Fecha:</strong> ${venta.fecha}<br>
      <strong>Control:</strong> FAC-${venta.numero || venta.id || Date.now()}
    </div>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Cant.</th>
          <th>Precio</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${venta.items ? venta.items.map(i => `
          <tr>
            <td>${i.nombre}</td>
            <td>${i.cantidad}</td>
            <td>$${i.precio.toFixed(2)}</td>
            <td>$${(i.precio * i.cantidad).toFixed(2)}</td>
          </tr>
        `).join('') : '<tr><td colspan="4">Sin items</td></tr>'}
      </tbody>
    </table>
    <div class="total-section">
      <div style="font-size: 18px; font-weight: bold; color: #1e40af;">
        TOTAL A PAGAR: $${venta.total.toFixed(2)}
      </div>
      ${venta.totalBs ? `<small style="color: #666; font-weight: bold;">Ref. Bs: ${venta.totalBs}</small>` : ''}
    </div>
  `;
}

// Registro global para el acceso desde otros módulos
window.imprimirTicket = imprimirTicket;
window.imprimirFactura = imprimirFactura;
