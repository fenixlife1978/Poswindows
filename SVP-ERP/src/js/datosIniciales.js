
const db = require("./database");

/**
 * Carga de registros maestros con soporte Multiempresa / Sucursal.
 */
function cargarDatosIniciales() {
  // 1. EMPRESA PRINCIPAL
  const empresa = db.prepare("SELECT * FROM empresa WHERE id=1").get();
  if (!empresa) {
    db.prepare(`
      INSERT INTO empresa (id, nombre, rif, direccion, telefono)
      VALUES (1, 'SVP Corporativo', 'J00000000-0', 'Sede Central', '0212-0000000')
    `).run();
  }

  // 2. SUCURSALES POR DEFECTO
  const sucursal = db.prepare("SELECT * FROM sucursales WHERE id=1").get();
  if (!sucursal) {
    const insertarSuc = db.prepare(`
      INSERT INTO sucursales (id, empresaId, nombre, codigo, direccion)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertarSuc.run(1, 1, 'Sucursal Principal', 'SUC01', 'Centro');
    insertarSuc.run(2, 1, 'Sucursal Norte', 'SUC02', 'Zona Norte');
    insertarSuc.run(3, 1, 'Sucursal Este', 'SUC03', 'Zona Este');
  }

  // 3. USUARIO ADMIN VINCULADO A SUCURSAL 1
  const usuario = db.prepare("SELECT * FROM usuarios WHERE usuario='admin'").get();
  if (!usuario) {
    const todosPermisos = "pos,ventas,compras,inventario,caja,reportes,configuracion";
    db.prepare(`
      INSERT INTO usuarios (nombre, usuario, clave, rol, permisos, sucursalId)
      VALUES ('Administrador Master', 'admin', '1234', 'Administrador', ?, 1)
    `).run(todosPermisos);
  }

  // 4. CLIENTE PREDETERMINADO
  const cliente = db.prepare("SELECT * FROM clientes WHERE id=1").get();
  if (!cliente) {
    db.prepare(`
      INSERT INTO clientes (id, documento, nombre)
      VALUES (1, 'V00000000', 'Consumidor Final')
    `).run();
  }

  console.log("SVP ERP: Estructura Multiempresa/Sucursales inicializada.");
}

window.cargarDatosIniciales = cargarDatosIniciales;
