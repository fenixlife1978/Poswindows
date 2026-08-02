const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Asegurar carpeta database
const carpetaDB = path.join(__dirname, "../../database");
if (!fs.existsSync(carpetaDB)) {
  fs.mkdirSync(carpetaDB, { recursive: true });
}

const dbPath = path.join(carpetaDB, "svp.sqlite");
const db = new Database(dbPath);

function iniciarDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS empresa(id INTEGER PRIMARY KEY, nombre TEXT, rif TEXT, direccion TEXT);
    CREATE TABLE IF NOT EXISTS sucursales(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, codigo TEXT);
    CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, usuario TEXT UNIQUE, clave TEXT, rol TEXT, permisos TEXT, sucursalId INTEGER);
    CREATE TABLE IF NOT EXISTS productos(id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT UNIQUE, nombre TEXT, categoria TEXT, costo REAL, precio REAL, stockMinimo REAL);
    CREATE TABLE IF NOT EXISTS sucursal_stock(sucursalId INTEGER, productoId INTEGER, cantidad REAL, PRIMARY KEY(sucursalId, productoId));
    CREATE TABLE IF NOT EXISTS clientes(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, documento TEXT UNIQUE, telefono TEXT, correo TEXT);
    CREATE TABLE IF NOT EXISTS ventas(id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TEXT, subtotal REAL, iva REAL, total REAL, metodoPago TEXT, clienteId INTEGER, sucursalId INTEGER, usuarioId INTEGER, estado TEXT);
    CREATE TABLE IF NOT EXISTS detalle_ventas(id INTEGER PRIMARY KEY AUTOINCREMENT, ventaId INTEGER, productoId INTEGER, cantidad REAL, precio REAL);
    CREATE TABLE IF NOT EXISTS configuracion(id INTEGER PRIMARY KEY, tasa REAL, iva REAL);
  `);

  // Semilla inicial
  const admin = db.prepare("SELECT * FROM usuarios WHERE usuario = 'admin'").get();
  if (!admin) {
    db.prepare("INSERT INTO usuarios (nombre, usuario, clave, rol, permisos, sucursalId) VALUES (?,?,?,?,?,?)")
      .run("Administrador", "admin", "1234", "Administrador", "pos,ventas,compras,inventario,caja,reportes,configuracion", 1);
  }
}

iniciarDB();
module.exports = db;