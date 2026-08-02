const db = require("../../database");

function cargarVentas() {
  const ventas = db.prepare(`
SELECT
v.*,
c.nombre AS cliente
FROM ventas v
LEFT JOIN clientes c
ON c.id=v.clienteId
ORDER BY v.id DESC
`).all();

  const tabla = document.getElementById("tablaVentas");

  if (!tabla) return;

  tabla.innerHTML = "";

  ventas.forEach(v => {
    tabla.innerHTML += `
<tr>
<td>
${v.id}
</td>
<td>
${v.fecha}
</td>
<td>
${v.metodoPago || ""}
</td>
<td>
$${Number(v.total).toFixed(2)}
</td>
<td>
<button class="action-btn" onclick="verVenta(${v.id})">
Ver
</button>
<button class="action-btn" onclick="reimprimirFactura(${v.id})">
Reimprimir
</button>
</td>
</tr>
`;
  });
}

function verVenta(id) {
  const venta = db.prepare("SELECT * FROM ventas WHERE id=?").get(id);

  const detalle = db.prepare(`
SELECT
d.*,
p.nombre
FROM detalle_ventas d
JOIN productos p
ON p.id=d.productoId
WHERE d.ventaId=?
`).all(id);

  console.log(venta, detalle);
}

function reimprimirFactura(id) {
  const venta = db.prepare("SELECT * FROM ventas WHERE id=?").get(id);

  if (typeof generarFactura === 'function') {
    generarFactura({
      numero: id,
      subtotal: venta.subtotal,
      iva: venta.iva,
      total: venta.total,
      fecha: venta.fecha
    });
  }
}
