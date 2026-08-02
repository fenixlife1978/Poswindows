const db = require("../../database");

function cargarReportes() {
  const contenedor = document.getElementById("resultadoReporte");
  if (contenedor) contenedor.innerHTML = ""; // Limpiar antes de cargar
  reporteVentas();
  reporteInventario();
  reporteUtilidad();
}

function reporteVentas() {
  const ventas = db.prepare(`
    SELECT 
      COUNT(*) cantidad,
      SUM(total) total
    FROM ventas
    WHERE estado = 'ACTIVA'
  `).get();

  mostrarResultadoReporte("Resumen de Ventas", ventas);
}

function reporteInventario() {
  const inventario = db.prepare(`
    SELECT 
      COUNT(*) productos,
      SUM(stock * costo) valor
    FROM productos
  `).get();

  mostrarResultadoReporte("Valorización de Inventario", inventario);
}

function reporteUtilidad() {
  const utilidad = db.prepare(`
    SELECT 
      SUM(dv.cantidad * (dv.precio - p.costo)) total
    FROM detalle_ventas dv
    JOIN productos p ON p.id = dv.productoId
    JOIN ventas v ON v.id = dv.ventaId
    WHERE v.estado = 'ACTIVA'
  `).get();

  mostrarResultadoReporte("Utilidad Neta Estimada", utilidad);
}

function mostrarResultadoReporte(tipo, datos) {
  const contenedor = document.getElementById("resultadoReporte");

  if (!contenedor) return;

  contenedor.innerHTML += `
    <div class="card bg-white border-2 border-[#808080] p-4 mb-4 shadow-sm">
      <h3 class="text-[#000080] font-black uppercase text-[11px] border-b border-gray-200 pb-2 mb-3 italic">
        ${tipo}
      </h3>
      <div class="font-mono text-[10px] bg-gray-50 p-2 border border-gray-300">
        <table class="w-full">
          <tbody>
            ${Object.entries(datos).map(([key, val]) => `
              <tr class="border-b border-gray-200 last:border-0">
                <td class="py-1 font-bold text-gray-500 uppercase">${key}:</td>
                <td class="py-1 text-right font-black text-blue-900">
                  ${typeof val === 'number' ? (val % 1 !== 0 ? '$ ' + val.toFixed(2) : val) : val}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Registro global para el sistema de enrutado
window.cargarReportes = cargarReportes;
window.reporteVentas = reporteVentas;
window.reporteInventario = reporteInventario;
window.reporteUtilidad = reporteUtilidad;
