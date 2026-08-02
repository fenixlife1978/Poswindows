const db = require("../../database");
const {
  formatoUSD,
  formatoBS,
  obtenerTasaBCV
} = require("../../helpers/moneda");

/**
 * Genera la representación impresa de la factura.
 * @param {Object} venta - Datos de la venta realizada.
 */
function generarFactura(venta) {
  const config = db.prepare("SELECT * FROM configuracion WHERE id=1").get();
  const ventana = window.open("", "", "width=450,height=700");

  if (!ventana) {
    alert("Por favor permita las ventanas emergentes para imprimir la factura.");
    return;
  }

  let html = `
    <html>
      <head>
        <title>Factura SVP ERP</title>
        <style>
          body { 
            font-family: 'Courier New', Courier, monospace; 
            padding: 10px; 
            font-size: 12px; 
            width: 300px;
            margin: auto;
          }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .header h2 { margin: 0; font-size: 16px; }
          .items { margin-bottom: 10px; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
          .item-desc { font-size: 11px; }
          .totals { border-top: 1px dashed #000; padding-top: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          h2 { margin: 10px 0; font-size: 18px; text-align: center; }
          hr { border: none; border-top: 1px dashed #000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${config?.empresa || 'EMPRESA DEMO'}</h2>
          RIF: ${config?.rif || 'J-00000000-0'}<br>
          ${venta.fecha}<br>
          FACTURA: FAC-${venta.id}
        </div>

        <div class="items">
          ${venta.items.map(item => `
            <div class="item-row">
              <span class="item-desc">${item.nombre} x${item.cantidad}</span>
              <span>${formatoUSD(item.precio * item.cantidad)}</span>
            </div>
          `).join('')}
        </div>

        <div class="totals">
          <hr>
          <p>
            Subtotal:
            ${formatoUSD(venta.subtotal)}
            <br>
            ${formatoBS(venta.subtotal)}
          </p>

          <p>
            IVA:
            ${formatoUSD(venta.iva)}
            <br>
            ${formatoBS(venta.iva)}
          </p>

          <h2>
            TOTAL:
            <br>
            ${formatoUSD(venta.total)}
            <br>
            ${formatoBS(venta.total)}
          </h2>

          <p style="text-align: center; font-size: 9px; margin-top: 10px;">
            Tasa BCV utilizada:
            ${obtenerTasaBCV()}
            Bs/USD
          </p>
        </div>

        <div class="footer">
          GRACIAS POR SU COMPRA
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  ventana.document.write(html);
  ventana.document.close();
}

// Registro global para el sistema de enrutado simple
window.generarFactura = generarFactura;
