function cargarCaja(){
const db=getDB();

let saldo=0;

db.ventas.forEach(v=>{
saldo+=v.total;
});

let saldoElemento =
document.getElementById(
"saldoCaja"
);

if(saldoElemento)
saldoElemento.innerHTML=
"$"+saldo.toFixed(2);

let ventasElemento =
document.getElementById(
"ventasCaja"
);

if(ventasElemento)
ventasElemento.innerHTML=
db.ventas.length;

const tabla =
document.getElementById(
"tablaCaja"
);

if(!tabla)
return;

tabla.innerHTML="";

db.ventas
.slice()
.reverse()
.forEach(v=>{

tabla.innerHTML+=`
<tr>
<td>
${v.fecha}
</td>
<td>
Venta
</td>
<td>
$${v.total.toFixed(2)}
</td>
</tr>
`;

});
}