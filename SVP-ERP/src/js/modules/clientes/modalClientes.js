/**
 * Despliega el formulario industrial para el registro de nuevos clientes.
 * Utiliza el motor de modales centralizado de SVP ERP.
 */
function abrirModalCliente() {
  abrirModal(
    "Registro de Nuevo Cliente",
    `
    <div class="form-group">
      <label>Documento de Identidad / R.I.F.:</label>
      <input id="cliDocumento" placeholder="EJ: V-12345678-0" class="font-mono uppercase">
    </div>
    <div class="form-group">
      <label>Nombre Completo / Razón Social:</label>
      <input id="cliNombre" placeholder="NOMBRE DEL CLIENTE" class="uppercase">
    </div>
    <div class="form-group">
      <label>Teléfono de Contacto:</label>
      <input id="cliTelefono" placeholder="0414-0000000" class="font-mono">
    </div>
    <div class="form-group">
      <label>Correo Electrónico:</label>
      <input id="cliCorreo" type="email" placeholder="cliente@ejemplo.com" class="lowercase">
    </div>
    `,
    guardarCliente
  );
}
