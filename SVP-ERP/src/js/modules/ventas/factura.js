const db = require("../../database");

function generarFactura(datos) {
  const empresa = db.prepare("SELECT * FROM empresa WHERE id=1").get();

  const html = `
<div style="font-family:Arial; padding: 20px; max-width: 400px; margin: auto;">
  <h2 style="text-align: center; margin-bottom: 5px;">${empresa.nombre}</h2>
  <p style="text-align: center; margin-top: 0; font-size: 12px;">
    RIF: ${empresa.rif || ""}<br>
    ${empresa.direccion || ""}
  </p>
  <hr style="border: 1px dashed #000;">
  <h3 style="text-align: center;">FACTURA Nº ${datos.numero}</h3>
  <p style="font-size: 12px;">Fecha: ${new Date().toLocaleString()}</p>
  <hr style="border: 1px dashed #000;">
  <table width="100%" style="font-size: 14px;">
    <tr>
      <td>Subtotal</td>
      <td style="text-align: right;">$${datos.subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td>IVA</td>
      <td style="text-align: right;">$${datos.iva.toFixed(2)}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 16px;">
      <td>TOTAL</td>
      <td style="text-align: right;">$${datos.total.toFixed(2)}</td>
    </tr>
  </table>
  <br>
  <p style="font-size: 12px;">Pago recibido: <strong>${datos.metodoPago || "Efectivo"}</strong></p>
  <hr style="border: 1px dashed #000;">
  <p style="text-align: center; font-size: 10px; font-style: italic;">Gracias por su compra</p>
</div>
`;

  abrirFactura(html);
}

function abrirFactura(contenido) {
  const ventana = window.open("", "_blank", "width=600,height=800");
  ventana.document.write(`
    <html>
      <head><title>Imprimir Factura</title></head>
      <body>
        ${contenido}
        <script>
          window.onload = function() { 
            window.print(); 
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
    </html>
  `);
  ventana.document.close();
}

// Registro global para acceso desde otros módulos
window.generarFactura = generarFactura;