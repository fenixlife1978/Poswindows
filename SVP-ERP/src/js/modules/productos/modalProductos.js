/**
 * Despliega el formulario industrial para el registro de nuevos productos.
 * Utiliza el motor de modales centralizado de SVP ERP.
 */
function abrirModalProducto() {
  abrirModal(
    "Registro de Nuevo Producto",
    `
    <div class="form-group">
      <label>Código / SKU:</label>
      <input id="prodCodigo" placeholder="EJ: 750100..." class="font-mono">
    </div>
    <div class="form-group">
      <label>Descripción del Producto:</label>
      <input id="prodNombre" placeholder="NOMBRE COMERCIAL" class="uppercase">
    </div>
    <div class="form-group">
      <label>Categoría:</label>
      <input id="prodCategoria" placeholder="ALIMENTOS, REPUESTOS, ETC." class="uppercase">
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="form-group">
        <label>Costo USD:</label>
        <input id="prodCosto" type="number" step="0.01" placeholder="0.00" class="font-mono text-right">
      </div>
      <div class="form-group">
        <label>Precio Venta USD:</label>
        <input id="prodPrecio" type="number" step="0.01" placeholder="0.00" class="font-mono text-right text-blue-800">
      </div>
    </div>
    <div class="form-group">
      <label>Existencia Inicial:</label>
      <input id="prodStock" type="number" placeholder="0" class="font-mono text-center">
    </div>
    `,
    guardarProducto
  );
}
