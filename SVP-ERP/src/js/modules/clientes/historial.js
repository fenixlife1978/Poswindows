const db =
require(
"../../database"
);







function historialCliente(id){



const ventas =

db.prepare(`


SELECT *

FROM ventas

WHERE clienteId=?

ORDER BY fecha DESC



`)

.all(id);





return ventas;



}









function saldoCliente(id){



const deuda =

db.prepare(`


SELECT SUM(saldo) total

FROM cuentas_cobrar

WHERE clienteId=?



`)

.get(id);





return deuda.total || 0;



}