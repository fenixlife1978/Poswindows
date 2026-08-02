function cargarDashboard(){


const db=getDB();



let ventas=0;



db.ventas.forEach(v=>{


ventas+=v.total;


});



let a=
document.getElementById(
"ventasDia"
);



if(a)

a.innerHTML=
"$"+ventas.toFixed(2);



let b=
document.getElementById(
"cantidadProductos"
);



if(b)

b.innerHTML=
db.productos.length;



let c=
document.getElementById(
"cantidadClientes"
);



if(c)

c.innerHTML=
db.clientes.length;



let d=
document.getElementById(
"cajaActual"
);



if(d)

d.innerHTML=
"$"+ventas.toFixed(2);



}