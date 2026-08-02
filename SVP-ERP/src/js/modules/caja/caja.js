const db = require("../../database");

function abrirCaja() {
  const montoInicial = Number(
    prompt("Monto inicial de caja USD")
  );

  if (isNaN(montoInicial)) {
    alert("Monto inválido");
    return;
  }

  db.prepare(`
    INSERT INTO caja_movimientos
    (tipo, descripcion, monto, fecha)
    VALUES
    ('Apertura', 'Inicio de caja', ?, datetime('now', 'localtime'))
  `).run(montoInicial);

  alert("Caja abierta correctamente");
  cargarCaja();
}

function registrarMovimientoCaja(tipo, descripcion, monto) {
  db.prepare(`
    INSERT INTO caja_movimientos
    (tipo, descripcion, monto, fecha)
    VALUES
    (?,?,?, datetime('now', 'localtime'))
  `).run(tipo, descripcion, monto);
}

function registrarEgreso() {
  const monto = Number(
    prompt("Monto del egreso USD")
  );

  if (isNaN(monto) || monto <= 0) {
    alert("Monto inválido");
    return;
  }

  const motivo = prompt("Motivo del egreso");
  if (!motivo) return;

  registrarMovimientoCaja("Egreso", motivo, -monto);
  cargarCaja();
}

function cargarCaja() {
  const movimientos = db.prepare(`
    SELECT *
    FROM caja_movimientos
    ORDER BY id DESC
  `).all();

  const tabla = document.getElementById("tablaCaja");
  if (!tabla) return;

  tabla.innerHTML = "";
  let saldo = 0;

  movimientos.forEach(m => {
    saldo += m.monto;

    tabla.innerHTML += `
      <tr>
        <td class="border-r border-[#D4D0C8]">${m.fecha}</td>
        <td class="border-r border-[#D4D0C8] font-bold ${m.tipo === 'Egreso' ? 'text-red-700' : 'text-blue-700'}">${m.tipo}</td>
        <td class="border-r border-[#D4D0C8]">${m.descripcion}</td>
        <td class="text-right font-black ${m.monto < 0 ? 'text-red-600' : 'text-green-700'}">$${m.monto.toFixed(2)}</td>
      </tr>
    `;
  });

  const saldoEl = document.getElementById("saldoCaja");
  if (saldoEl) {
    saldoEl.innerHTML = "$" + saldo.toFixed(2);
  }
}

function cierreCaja() {
  const saldoEl = document.getElementById("saldoCaja");
  const saldo = saldoEl ? saldoEl.innerText : "$0.00";

  if (!confirm("¿Desea realizar el cierre de caja?\nSaldo actual: " + saldo)) {
    return;
  }

  alert("Cierre de caja realizado\nSaldo: " + saldo);

  registrarMovimientoCaja("Cierre", "Cierre diario", 0);
  cargarCaja();
}

// Registro global para las vistas
window.abrirCaja = abrirCaja;
window.registrarEgreso = registrarEgreso;
window.cierreCaja = cierreCaja;
window.cargarCaja = cargarCaja;
