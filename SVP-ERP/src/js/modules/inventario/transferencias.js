
const db = require("../../database");

/**
 * Carga el historial de transferencias realizadas.
 */
function cargarTransferencias() {
  const transferencias = db.prepare(`
    SELECT t.*, 
           so.nombre as origen, 
           sd.nombre as destino,
           u.nombre as usuario
    FROM transferencias t
    JOIN sucursales so ON t.sucursalOrigenId = so.id
    JOIN sucursales sd ON t.sucursalDestinoId = sd.id
    JOIN usuarios u ON t.usuarioId = u.id
    ORDER BY t.id DESC
  `).all();

  const tabla = document.getElementById("tablaTransferencias");
  if (!tabla) return;

  tabla.innerHTML = transferencias.map(t => `
    <tr class="hover:bg-blue-50">
      <td class="border-r border-[#D4D0C8] font-mono text-center">TRF-${t.id}</td>
      <td class="border-r border-[#D4D0C8]">${t.fecha}</td>
      <td class="border-r border-[#D4D0C8] uppercase font-bold">${t.origen}</td>
      <td class="border-r border-[#D4D0C8] uppercase font-bold text-blue-900">→ ${t.destino}</td>
      <td class="border-r border-[#D4D0C8] text-center font-black text-green-700">${t.estado}</td>
      <td class="text-center">
        <button class="action-btn" onclick="verDetalleTransferencia(${t.id})">Ver</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="py-10 text-center text-gray-400 italic">No hay transferencias registradas</td></tr>';
}

/**
 * Despliega el modal para crear una nueva transferencia.
 */
function nuevaTransferencia() {
  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const sucursalActualId = usuario?.sucursalId || 1;
  
  const sucursales = db.prepare("SELECT id, nombre FROM sucursales WHERE id != ?").all(sucursalActualId);
  
  const contenido = `
    <div class="form-group">
      <label>Sucursal Destino:</label>
      <select id="trfDestino">
        ${sucursales.map(s => `<option value="${s.id}">${s.nombre.toUpperCase()}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Producto (ID o Código):</label>
      <input id="trfProducto" placeholder="Código del producto" class="uppercase">
    </div>
    <div class="form-group">
      <label>Cantidad a Transferir:</label>
      <input id="trfCantidad" type="number" step="1" value="1" class="font-mono text-center">
    </div>
    <div class="form-group">
      <label>Observaciones:</label>
      <textarea id="trfObs" class="w-full h-16 border border-gray-400 p-1 text-[10px]"></textarea>
    </div>
  `;

  abrirModal("Nueva Transferencia de Mercancía", contenido, procesarTransferencia);
}

function procesarTransferencia() {
  const destinoId = Number(document.getElementById("trfDestino").value);
  const prodBusqueda = document.getElementById("trfProducto").value;
  const cantidad = Number(document.getElementById("trfCantidad").value);
  const obs = document.getElementById("trfObs").value;

  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const origenId = usuario?.sucursalId || 1;

  if (!prodBusqueda || cantidad <= 0) {
    alert("Datos inválidos");
    return;
  }

  // Buscar producto
  const producto = db.prepare("SELECT id, nombre FROM productos WHERE codigo = ? OR id = ?").get(prodBusqueda, prodBusqueda);
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  // Verificar stock en origen
  const stockOrigen = db.prepare("SELECT cantidad FROM sucursal_stock WHERE sucursalId = ? AND productoId = ?").get(origenId, producto.id);
  if (!stockOrigen || stockOrigen.cantidad < cantidad) {
    alert("Stock insuficiente en la sucursal de origen");
    return;
  }

  try {
    const operacion = db.transaction(() => {
      // 1. Registrar Transferencia
      const trf = db.prepare(`
        INSERT INTO transferencias (fecha, sucursalOrigenId, sucursalDestinoId, usuarioId, observaciones)
        VALUES (datetime('now', 'localtime'), ?, ?, ?, ?)
      `).run(origenId, destinoId, usuario.id, obs);
      
      const trfId = trf.lastInsertRowid;

      // 2. Registrar Detalle
      db.prepare(`INSERT INTO detalle_transferencias (transferenciaId, productoId, cantidad) VALUES (?, ?, ?)`).run(trfId, producto.id, cantidad);

      // 3. Restar Stock Origen
      db.prepare(`UPDATE sucursal_stock SET cantidad = cantidad - ? WHERE sucursalId = ? AND productoId = ?`).run(cantidad, origenId, producto.id);

      // 4. Sumar Stock Destino
      db.prepare(`INSERT OR IGNORE INTO sucursal_stock (sucursalId, productoId, cantidad) VALUES (?, ?, 0)`).run(destinoId, producto.id);
      db.prepare(`UPDATE sucursal_stock SET cantidad = cantidad + ? WHERE sucursalId = ? AND productoId = ?`).run(cantidad, destinoId, producto.id);

      return trfId;
    });

    operacion();
    alert("Transferencia completada exitosamente");
    cerrarModal();
    cargarTransferencias();
    
    if (typeof window.registrarAuditoria === 'function') {
      window.registrarAuditoria(`Transferencia TRF-ID: ${producto.nombre} (${cantidad}) de SUC ${origenId} a SUC ${destinoId}`, "Inventario");
    }

  } catch (error) {
    console.error(error);
    alert("Error procesando la transferencia");
  }
}

function verDetalleTransferencia(id) {
  const detalle = db.prepare(`
    SELECT dt.*, p.nombre
    FROM detalle_transferencias dt
    JOIN productos p ON dt.productoId = p.id
    WHERE dt.transferenciaId = ?
  `).all(id);

  const trf = db.prepare("SELECT observaciones FROM transferencias WHERE id = ?").get(id);

  const html = `
    <div class="bg-white border p-2 font-mono text-[10px]">
      <table class="w-full text-left">
        <thead class="border-b"><tr><th>PRODUCTO</th><th class="text-right">CANT</th></tr></thead>
        <tbody>
          ${detalle.map(d => `<tr><td>${d.nombre}</td><td class="text-right">${d.cantidad}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="mt-4 border-t pt-2 italic text-gray-500">
        Obs: ${trf.observaciones || 'Sin observaciones'}
      </div>
    </div>
  `;
  
  abrirModal(`Detalle TRF-${id}`, html, () => cerrarModal());
}

window.cargarTransferencias = cargarTransferencias;
window.nuevaTransferencia = nuevaTransferencia;
window.verDetalleTransferencia = verDetalleTransferencia;
