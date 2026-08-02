function cargarProductos() {
  const db = getDB();
  const tabla = document.getElementById("tablaProductos");

  if (!tabla) return;

  tabla.innerHTML = "";

  db.productos.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria || "General"}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <button class="action-btn edit" onclick="editarProducto(${p.id})">
            Editar
          </button>
          <button class="action-btn delete" onclick="eliminarProducto(${p.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

function nuevoProducto() {
  abrirModal(
    "Nuevo Producto",
    `
    <div class="form-group">
      <label>Nombre del Producto</label>
      <input id="prodNombre" placeholder="Ej: Harina PAN">
    </div>
    <div class="form-group">
      <label>Código / SKU</label>
      <input id="prodCodigo" placeholder="Código">
    </div>
    <div class="form-group">
      <label>Costo ($)</label>
      <input id="prodCosto" type="number" placeholder="0.00">
    </div>
    <div class="form-group">
      <label>Precio de Venta ($)</label>
      <input id="prodPrecio" type="number" placeholder="0.00">
    </div>
    <div class="form-group">
      <label>Stock Inicial</label>
      <input id="prodStock" type="number" placeholder="0">
    </div>
    `,
    () => {
      const db = getDB();
      const nombre = document.getElementById("prodNombre").value;
      const codigo = document.getElementById("prodCodigo").value;
      const costo = Number(document.getElementById("prodCosto").value);
      const precio = Number(document.getElementById("prodPrecio").value);
      const stock = Number(document.getElementById("prodStock").value);

      if (!nombre || !codigo) {
        alert("El nombre y código son obligatorios");
        return;
      }

      db.productos.push({
        id: Date.now(),
        codigo: codigo,
        nombre: nombre,
        categoria: "General",
        costo: costo,
        precio: precio,
        stock: stock
      });

      saveDB(db);
      cerrarModal();
      cargarProductos();
    }
  );
}

function editarProducto(id) {
  const db = getDB();
  const producto = db.productos.find(p => p.id === id);

  if (!producto) return;

  abrirModal(
    "Editar Producto",
    `
    <div class="form-group">
      <label>Nombre: <strong>${producto.nombre}</strong></label>
    </div>
    <div class="form-group">
      <label>Precio de Venta ($)</label>
      <input id="editPrecio" type="number" value="${producto.precio}">
    </div>
    <div class="form-group">
      <label>Stock Actual</label>
      <input id="editStock" type="number" value="${producto.stock}">
    </div>
    `,
    () => {
      producto.precio = Number(document.getElementById("editPrecio").value);
      producto.stock = Number(document.getElementById("editStock").value);

      saveDB(db);
      cerrarModal();
      cargarProductos();
    }
  );
}

function eliminarProducto(id) {
  if (!confirm("¿Está seguro de eliminar este producto?")) return;
  
  const db = getDB();
  db.productos = db.productos.filter(p => p.id !== id);
  saveDB(db);
  cargarProductos();
}
