function generarFactura(
venta
){


let empresa =
getDB()
.empresa;



let ventana =
window.open(
"",
"",
"width=450,height=700"
);



let html=`


<html>

<head>

<title>
Factura SVP ERP
</title>


<style>


body{

font-family:Arial;

padding:20px;

}


h2{

text-align:center;

}



.line{

border-bottom:1px solid #ddd;

padding:5px;

}



.total{

font-size:22px;

font-weight:bold;

}



</style>


</head>



<body>



<h2>
${empresa.nombre}
</h2>



<center>

RIF:
${empresa.rif}

<br>

${empresa.direccion}

</center>



<hr>



Fecha:

${venta.fecha}



<hr>



`;




venta.items.forEach(i=>{


html+=`


<div class="line">


${i.nombre}

<br>

${i.cantidad}

x

$${(i.price || i.precio).toFixed(2)}


</div>


`;


});



html+=`


<hr>


<p>

Subtotal:

$${venta.subtotal.toFixed(2)}

</p>


<p>

IVA:

$${venta.iva.toFixed(2)}

</p>



<p class="total">

TOTAL:

$${venta.total.toFixed(2)}

</p>



<center>

Gracias por su compra

</center>



</body>

</html>


`;



ventana.document.write(
html
);



ventana.print();



}