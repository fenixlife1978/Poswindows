
const db = require("../../database");
const {
  formatoUSD,
  formatoBS
} = require("../../helpers/moneda");

// Estado global de la venta activa
window.carritoPOS = [];
let metodoPagoActual = "Efectivo";
let clienteVentaActual = null;
let descuentoVenta = 0;

/**
 * Inicializa el Punto de Venta configurando los eventos y cargando productos.
 * Filtra automáticamente por la sucursal del usuario activo.
 */
function iniciarPOS() {
  window.carritoPOS = [];
  mostrarProductosPOS();
  actualizarTicket();

  const buscador = document.getElementById("buscarProductoPOS");
  if (buscador) {
    buscador.oninput = () => {
      mostrarProductosPOS(buscador.value);
    };
  }

  const botonesPago = document.querySelectorAll(".payment");
  botonesPago.forEach(btn => {
    btn.onclick = (e) => {
      botonesPago.forEach(b => b.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");
      metodoPagoActual = target.innerText.replace(/[^\w\sÀ-ÿ]/g, '').trim();
    };
  });

  const btnCobrar = document.querySelector(".checkout");
  if (btnCobrar) {
    btnCobrar.onclick = () => {
      if (typeof finalizarVentaCompleta === 'function') {
        finalizarVentaCompleta();
      }
    };
  }
}

/**
 * Consulta la base de datos y muestra los productos que tienen stock en la SUCURSAL ACTUAL.
 */
function mostrarProductosPOS(busqueda = "") {
  const contenedor = document.getElementById("listaProductosPOS");
  if (!contenedor) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const sucursalId = usuario?.sucursalId || 1;

  // Query que cruza productos con su tabla de stock por sucursal
  const productos = db.prepare(`
    SELECT p.*, IFNULL(s.cantidad, 0) as stock_sucursal
    FROM productos p
    JOIN sucursal_stock s ON s.productoId = p.id
    WHERE s.sucursalId = ?
    AND (p.nombre LIKE ? OR p.codigo LIKE ?)
    AND s.cantidad > 0
    LIMIT 50
  `).all(sucursalId, `%${busqueda}%`, `%${busqueda}%`);

  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = `<div class="col-span-full p-10 text-center text-gray-400 italic font-bold uppercase text-[10px]">No hay productos con existencia en esta sucursal</div>`;
    return;
  }

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="product-card bg-white border border-gray-300 p-3 hover:border-blue-500 cursor-pointer transition-all shadow-sm group" onclick="agregarProductoPOS(${p.id})">
        <h4 class="text-xs font-black uppercase truncate group-hover:text-blue-700">${p.nombre}</h4>
        <p class="text-[9px] text-gray-500 font-mono">#${p.codigo}</p>
        <div class="mt-2 flex justify-between items-end">
          <strong class="text-blue-700 text-sm">$${p.precio.toFixed(2)}</strong>
          <span class="text-[9px] font-bold ${p.stock_sucursal < 10 ? 'text-red-600' : 'text-green-600'}">STK: ${p.stock_sucursal}</span>
        </div>
      </div>
    `;
  });
}

/**
 * Refresca la vista del ticket de venta.
 */
function actualizarTicket() {
  const contenedor = document.getElementById("ticketPOS") || document.getElementById("ticketItems");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  let subtotal = 0;

  window.carritoPOS.forEach(item => {
    let totalLinea = item.precio * item.cantidad;
    subtotal += totalLinea;

    contenedor.innerHTML += `
      <div class="flex justify-between items-start py-1 border-b border-gray-100 group">
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase text-gray-800 leading-tight">${item.nombre}</span>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-bold text-gray-500">$${item.precio.toFixed(2)} x ${item.cantidad}</span>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="bg-gray-200 text-gray-700 w-4 h-4 flex items-center justify-center text-[10px] font-black" onclick="restarItem(${item.id})">-</button>
              <button class="bg-gray-200 text-gray-700 w-4 h-4 flex items-center justify-center text-[10px] font-black" onclick="sumarItem(${item.id})">+</button>
            </div>
          </div>
        </div>
        <strong class="text-[10px] font-mono text-blue-900">$${totalLinea.toFixed(2)}</strong>
      </div>
    `;
  });

  const iva = subtotal * 0.16;
  const total = subtotal + iva;
  window.totalActualPOS = total;

  if (document.getElementById("subtotalPOS")) document.getElementById("subtotalPOS").innerHTML = `${formatoUSD(subtotal)}`;
  if (document.getElementById("ivaPOS")) document.getElementById("ivaPOS").innerHTML = `${formatoUSD(iva)}`;
  
  const totalEl = document.getElementById("totalPOS");
  if (totalEl) totalEl.innerHTML = formatoUSD(total);

  const bsEl = document.getElementById("totalBS");
  if (bsEl) bsEl.innerHTML = "Ref. " + formatoBS(total);
}

function sumarItem(id) {
  const usuario = JSON.parse(localStorage.getItem("usuarioSVP"));
  const sucursalId = usuario?.sucursalId || 1;
  
  const stock = db.prepare("SELECT cantidad FROM sucursal_stock WHERE sucursalId = ? AND productoId = ?").get(sucursalId, id);
  let item = window.carritoPOS.find(x => x.id === id);

  if (item && stock && item.cantidad < stock.cantidad) {
    item.cantidad++;
    actualizarTicket();
  } else {
    alert("Stock máximo alcanzado en esta sucursal");
  }
}

function restarItem(id) {
  let index = window.carritoPOS.findIndex(x => x.id === id);
  if (index < 0) return;
  window.carritoPOS[index].cantidad--;
  if (window.carritoPOS[index].cantidad <= 0) window.carritoPOS.splice(index, 1);
  actualizarTicket();
}

window.iniciarPOS = iniciarPOS;
window.actualizarTicket = actualizarTicket;
window.sumarItem = sumarItem;
window.restarItem = restarItem;
window.mostrarProductosPOS = mostrarProductosPOS;
