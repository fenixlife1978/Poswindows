function cargarReportes() {
  const db = getDB();

  let total = 0;

  db.ventas.forEach(v => {
    total += v.total;
  });

  let ventasTotal = document.getElementById("repVentasTotal");

  if (ventasTotal)
    ventasTotal.innerHTML = "$" + total.toFixed(2);

  let facturas = document.getElementById("repFacturas");

  if (facturas)
    facturas.innerHTML = db.ventas.length;

  let tabla = document.getElementById("tablaReporteVentas");

  if (tabla) {
    tabla.innerHTML = "";

    db.ventas
      .slice()
      .reverse()
      .forEach(v => {
        tabla.innerHTML += `
<tr>
<td>
${v.fecha}
</td>
<td>
FAC-${v.id}
</td>
<td>
$${v.total.toFixed(2)}
</td>
</tr>
`;
      });
  }
}

function exportarReporte() {
  const db = getDB();

  let texto = "REPORTE SVP ERP\n\n";

  db.ventas.forEach(v => {
    texto += `${v.fecha} - $${v.total}\n`;
  });

  let archivo = new Blob([texto], {
    type: "text/plain"
  });

  let link = document.createElement("a");

  link.href = URL.createObjectURL(archivo);

  link.download = "reporte_svp.txt";

  link.click();
}