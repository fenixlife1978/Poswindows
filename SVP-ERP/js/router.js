const rutas={
dashboard:
"views/dashboard.html",
pos:
"views/pos.html",
ventas:
"views/ventas.html",
compras:
"views/compras.html",
productos:
"views/productos.html",
inventario:
"views/inventario.html",
clientes:
"views/clientes.html",
proveedores:
"views/proveedores.html",
caja:
"views/caja.html",
reportes:
"views/reportes.html",
configuracion:
"views/configuracion.html",
usuarios:
"views/usuarios.html"
};

function cargarRuta(ruta){
fetch(rutas[ruta])
.then(
respuesta=>
respuesta.text()
)
.then(
html=>{
document
.getElementById(
"content"
)
.innerHTML=html;

activarModulo(ruta);
}
);
}

function activarModulo(ruta){
switch(ruta){
case "dashboard":
cargarDashboard();
break;
case "pos":
iniciarPOS();
break;
case "productos":
cargarProductos();
break;
case "clientes":
cargarClientes();
break;
case "inventario":
cargarInventario();
break;
case "ventas":
cargarVentas();
break;
case "compras":
cargarCompras();
break;
case "proveedores":
cargarProveedores();
break;
case "caja":
cargarCaja();
break;
case "reportes":
cargarReportes();
break;
case "configuracion":
cargarConfiguracion();
break;
case "usuarios":
cargarUsuarios();
break;
}
}
