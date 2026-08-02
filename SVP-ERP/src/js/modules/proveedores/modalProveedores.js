/**
 * Despliega el formulario industrial para el registro de nuevos proveedores.
 * Utiliza el motor de modales centralizado de SVP ERP.
 */
function abrirModalProveedor() {
  abrirModal(
    "Registro de Nuevo Proveedor",
    `
    <div class="form-group">
      <label>Razón Social / Nombre de la Empresa:</label>
      <input id="provNombre" placeholder="NOMBRE DEL PROVEEDOR" class="uppercase">
    </div>
    <div class="form-group">
      <label>Registro de Información Fiscal (R.I.F.):</label>
      <input id="provRif" placeholder="EJ: J-00000000-0" class="font-mono uppercase">
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="form-group">
        <label>Teléfono de Contacto:</label>
        <input id="provTelefono" placeholder="0212-0000000" class="font-mono">
      </div>
      <div class="form-group">
        <label>Correo Electrónico:</label>
        <input id="provCorreo" type="email" placeholder="proveedor@ejemplo.com" class="lowercase">
      </div>
    </div>
    `,
    guardarProveedor
  );
}
