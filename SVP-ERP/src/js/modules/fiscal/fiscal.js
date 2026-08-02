
const db = require("../../database");

/**
 * Obtiene el porcentaje de IVA configurado en la base de datos.
 * @returns {number} Porcentaje de IVA (por defecto 16).
 */
function obtenerIVA() {
  const iva = db.prepare(
    "SELECT porcentaje FROM impuestos WHERE nombre='IVA' AND activo=1"
  ).get();

  return iva ? iva.porcentaje : 16;
}

/**
 * Obtiene y aumenta el correlativo de la siguiente factura.
 * @returns {number} El número de factura actual.
 */
function siguienteFactura() {
  let numero = db.prepare(
    "SELECT factura FROM numeracion WHERE id=1"
  ).get();

  if (!numero) {
    db.prepare(`
      INSERT INTO numeracion
      (id, factura, nota)
      VALUES
      (1, 1, 1)
    `).run();

    numero = { factura: 1 };
  }

  const actual = numero.factura;

  db.prepare(`
    UPDATE numeracion
    SET factura = factura + 1
    WHERE id = 1
  `).run();

  return actual;
}

/**
 * Calcula el monto del impuesto basado en el subtotal.
 * @param {number} subtotal 
 * @returns {number} Monto del IVA.
 */
function calcularImpuesto(subtotal) {
  const iva = obtenerIVA();
  return subtotal * (iva / 100);
}

// Registro global para acceso desde los módulos de venta y POS
window.obtenerIVA = obtenerIVA;
window.siguienteFactura = siguienteFactura;
window.calcularImpuesto = calcularImpuesto;

module.exports = {
  obtenerIVA,
  siguienteFactura,
  calcularImpuesto
};
