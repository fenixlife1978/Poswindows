
const db = require("../../database");

/**
 * Carga el inventario filtrado por la SUCURSAL ACTUAL del usuario.
 */
function cargarInventario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const sucursalId = usuario?.sucursalId || 1;
  const sucursalNombre = usuario?.sucursalNombre || "Sucursal";

  const productos = db.prepare(`
    SELECT p.*, IFNULL(s.cantidad, 0) as stock_sucursal
    FROM productos p
    LEFT JOIN sucursal_stock s ON s.productoId = p.id AND s.sucursalId = ?
    ORDER BY p.nombre
  `).all(sucursalId);

  const tabla = document.getElementById("tablaInventario");
  if (!tabla) return;

  tabla.innerHTML = "";
  let valorTotal = 0;
  let bajos = 0;

  productos.forEach(p => {
    const valor = (p.stock_sucursal || 0) * (p.costo || 0);
    valorTotal += valor;
    if (p.stock_sucursal <= (p.stockMinimo || 5)) bajos++;

    tabla.innerHTML += `
      <tr>
        <td class="border-r border-[#D4D0C8] font-mono">${p.codigo || "S/C"}</td>
        <td class="border-r border-[#D4D0C8] uppercase font-bold">${p.nombre}</td>
        <td class="border-r border-[#D4D0C8] text-center font-mono ${p.stock_sucursal <= (p.stockMinimo || 5) ? 'text-red-700 font-black' : ''}">${p.stock_sucursal || 0}</td>
        <td class="border-r border-[#D4D0C8] text-right font-mono">$${(p.costo || 0).toFixed(2)}</td>
        <td class="text-right font-mono font-bold text-blue-900">$${valor.toFixed(2)}</td>
      </tr>
    `;
  });

  const totalEl = document.getElementById("valorInventario");
  if (totalEl) totalEl.innerHTML = "$" + valorTotal.toFixed(2);

  const countProd = document.getElementById("totalProductosInv");
  if (countProd) countProd.innerHTML = productos.length;

  const countBajo = document.getElementById("stockBajoInv");
  if (countBajo) countBajo.innerHTML = bajos;

  mostrarMovimientosPorSucursal(sucursalId);
}

/**
 * Registra un ajuste de stock afectando únicamente a la sucursal seleccionada.
 */
function ajustarInventario(productoId, cantidad, tipo) {
  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const sucursalId = usuario?.sucursalId || 1;

  // 1. Asegurar registro en sucursal_stock
  db.prepare(`
    INSERT OR IGNORE INTO sucursal_stock (sucursalId, productoId, cantidad)
    VALUES (?, ?, 0)
  `).run(sucursalId, productoId);

  // 2. Actualizar stock
  db.prepare(`
    UPDATE sucursal_stock
    SET cantidad = cantidad + ?
    WHERE sucursalId = ? AND productoId = ?
  `).run(cantidad, sucursalId, productoId);

  // 3. Registrar movimiento para auditoría
  db.prepare(`
    INSERT INTO movimientos_inventario
    (productoId, tipo, cantidad, fecha, sucursalId)
    VALUES (?,?,?, datetime('now', 'localtime'), ?)
  `).run(productoId, tipo, cantidad, sucursalId);

  if (typeof window.registrarAuditoria === 'function') {
    window.registrarAuditoria(`Ajuste ${tipo}: ${cantidad} unidades`, "Inventario");
  }

  cargarInventario();
}

function entradaMercancia() {
  const id = Number(prompt("ID Producto (Consultar tabla)"));
  const cantidad = Number(prompt("Cantidad entrada"));
  if (id && cantidad) ajustarInventario(id, cantidad, "Entrada");
}

function salidaMercancia() {
  const id = Number(prompt("ID Producto (Consultar tabla)"));
  const cantidad = Number(prompt("Cantidad salida"));
  if (id && cantidad) ajustarInventario(id, -cantidad, "Salida");
}

function mostrarMovimientosPorSucursal(sucursalId) {
  const tabla = document.getElementById("tablaMovimientos");
  if (!tabla) return;

  const movimientos = db.prepare(`
    SELECT m.*, p.nombre
    FROM movimientos_inventario m
    JOIN productos p ON p.id = m.productoId
    WHERE m.sucursalId = ?
    ORDER BY m.id DESC
    LIMIT 10
  `).all(sucursalId);

  tabla.innerHTML = movimientos.map(m => `
    <tr>
      <td class="border-r border-[#D4D0C8]">${m.fecha}</td>
      <td class="border-r border-[#D4D0C8] uppercase font-bold">${m.nombre}</td>
      <td class="border-r border-[#D4D0C8] font-black italic ${m.tipo === 'Entrada' ? 'text-green-700' : 'text-red-700'}">${m.tipo}</td>
      <td class="text-center font-mono font-bold">${Math.abs(m.cantidad)}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="text-center py-4 text-gray-400 italic">No hay movimientos recientes</td></tr>';
}

window.cargarInventario = cargarInventario;
window.entradaMercancia = entradaMercancia;
window.salidaMercancia = salidaMercancia;
