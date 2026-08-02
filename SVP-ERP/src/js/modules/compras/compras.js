const db = require("../../database");

function cargarCompras() {
  const compras = db.prepare(`
    SELECT
      c.*,
      p.nombre proveedor
    FROM compras c
    LEFT JOIN proveedores p
    ON p.id=c.proveedorId
    ORDER BY c.id DESC
  `).all();

  const tabla = document.getElementById("tablaCompras");

  if (!tabla) return;

  tabla.innerHTML = "";

  compras.forEach(c => {
    tabla.innerHTML += `
      <tr>
        <td class="border-r border-[#D4D0C8] font-bold text-left px-4">${c.proveedor || "PROVEEDOR DESCONOCIDO"}</td>
        <td class="border-r border-[#D4D0C8] font-mono text-blue-900">$${Number(c.total).toFixed(2)}</td>
        <td class="border-r border-[#D4D0C8] font-black italic text-green-700">${c.estado}</td>
        <td class="font-mono">${c.fecha}</td>
      </tr>
    `;
  });

  // Actualizar contador en la barra de estado
  const countEl = document.getElementById("countCompras");
  if (countEl) countEl.innerText = compras.length;
}

function registrarCompra() {
  const proveedorId = Number(
    prompt("ID proveedor")
  );

  const total = Number(
    prompt("Total compra USD")
  );

  if (isNaN(proveedorId) || isNaN(total)) {
    alert("Datos inválidos");
    return;
  }

  db.prepare(`
    INSERT INTO compras
    (
      proveedorId,
      total,
      estado,
      fecha
    )
    VALUES
    (
      ?,?,?,
      datetime('now', 'localtime')
    )
  `).run(
    proveedorId,
    total,
    "RECIBIDA"
  );

  alert("Compra registrada exitosamente");
  cargarCompras();
}

function recibirMercanciaCompra(compraId) {
  const productos = db.prepare(`
    SELECT *
    FROM detalle_compras
    WHERE compraId=?
  `).all(compraId);

  const actualizar = db.prepare(`
    UPDATE productos
    SET stock = stock + ?
    WHERE id=?
  `);

  productos.forEach(p => {
    actualizar.run(
      p.cantidad,
      p.productoId
    );
  });
  
  console.log("Inventario actualizado para la compra: " + compraId);
}

// Registro global para las vistas
window.cargarCompras = cargarCompras;
window.registrarCompra = registrarCompra;
window.recibirMercanciaCompra = recibirMercanciaCompra;
