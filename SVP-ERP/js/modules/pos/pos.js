let carritoPOS = [];
let metodoPagoActual = "Efectivo";

function iniciarPOS() {
  carritoPOS = [];
  mostrarProductosPOS();
  actualizarTicket();

  // Configurar buscador
  const buscador = document.getElementById("buscarProductoPOS");
  if (buscador) {
    buscador.addEventListener("input", () => {
      mostrarProductosPOS(buscador.value);
    });
  }

  // Configurar botones de método de pago
  const botonesPago = document.querySelectorAll(".payment");
  botonesPago.forEach(btn => {
    btn.onclick = () => {
      botonesPago.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      metodoPagoActual = btn.innerText.replace(/[^\w\sÀ-ÿ]/g, '').trim();
    };
  });

  // Configurar botón de cobro
  const btnCobrar = document.querySelector(".checkout");
  if (btnCobrar) {
    btnCobrar.onclick = cobrarVenta;
  }
}

function mostrarProductosPOS(busqueda = "") {
  const db = getDB();
  const contenedor = document.getElementById("listaProductosPOS");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  db.productos
    .filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.includes(busqueda)
    )
    .forEach(p => {
      contenedor.innerHTML += `
        <div class="product-card" onclick="agregarProductoPOS(${p.id})">
          <h4>${p.nombre}</h4>
          <p>Código: ${p.codigo}</p>
          <strong>$${p.precio.toFixed(2)}</strong>
          <div style="font-size: 0.8em; margin-top: 5px;">
            Stock: <span class="${p.stock < 10 ? 'text-danger font-bold' : ''}">${p.stock}</span>
          </div>
        </div>
      `;
    });
}

function agregarProductoPOS(id) {
  const db = getDB();
  let producto = db.productos.find(p => p.id === id);

  if (!producto) return;

  if (producto.stock <= 0) {
    alert("Producto sin existencia");
    return;
  }

  let item = carritoPOS.find(x => x.id === id);

  if (item) {
    if (item.cantidad < producto.stock) {
      item.cantidad++;
    } else {
      alert("No hay más stock disponible");
      return;
    }
  } else {
    carritoPOS.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  actualizarTicket();
}

function actualizarTicket() {
  const tabla = document.getElementById("ticketItems");
  if (!tabla) return;

  tabla.innerHTML = "";
  let subtotal = 0;

  carritoPOS.forEach(item => {
    let totalLinea = item.precio * item.cantidad;
    subtotal += totalLinea;

    tabla.innerHTML += `
      <div class="ticket-row">
        <span>
          ${item.nombre}
          <br>
          <small>$${item.precio.toFixed(2)} x ${item.cantidad}</small>
          <div class="mt-1">
            <button class="action-btn delete" style="padding: 2px 8px;" onclick="restarItem(${item.id})">-</button>
            <button class="action-btn edit" style="padding: 2px 8px;" onclick="sumarItem(${item.id})">+</button>
          </div>
        </span>
        <strong>$${totalLinea.toFixed(2)}</strong>
      </div>
    `;
  });

  let iva = subtotal * 0.16;
  let total = subtotal + iva;

  if (document.getElementById("subtotalPOS"))
    document.getElementById("subtotalPOS").innerHTML = "$" + subtotal.toFixed(2);

  if (document.getElementById("ivaPOS"))
    document.getElementById("ivaPOS").innerHTML = "$" + iva.toFixed(2);

  if (document.getElementById("totalPOS"))
    document.getElementById("totalPOS").innerHTML = "$" + total.toFixed(2);
}

function sumarItem(id) {
  const db = getDB();
  const producto = db.productos.find(p => p.id === id);
  let item = carritoPOS.find(x => x.id === id);

  if (item && producto && item.cantidad < producto.stock) {
    item.cantidad++;
    actualizarTicket();
  } else {
    alert("Stock máximo alcanzado");
  }
}

function restarItem(id) {
  let index = carritoPOS.findIndex(x => x.id === id);
  if (index < 0) return;

  carritoPOS[index].cantidad--;

  if (carritoPOS[index].cantidad <= 0) {
    carritoPOS.splice(index, 1);
  }

  actualizarTicket();
}

function cobrarVenta() {
  if (carritoPOS.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }

  const db = getDB();
  let subtotal = 0;

  // Actualizar stock y calcular total
  carritoPOS.forEach(item => {
    let producto = db.productos.find(p => p.id === item.id);
    if (producto) {
      producto.stock -= item.cantidad;
    }
    subtotal += item.precio * item.cantidad;
  });

  let iva = subtotal * 0.16;
  let total = subtotal + iva;

  let venta = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    items: JSON.parse(JSON.stringify(carritoPOS)),
    subtotal: subtotal,
    iva: iva,
    total: total,
    pago: metodoPagoActual
  };

  db.ventas.push(venta);
  saveDB(db);

  // Generar factura (PDF o Impresión)
  if (typeof generarFactura === 'function') {
    generarFactura(venta);
  }

  alert("Venta registrada con éxito");

  carritoPOS = [];
  actualizarTicket();
  mostrarProductosPOS();
}
