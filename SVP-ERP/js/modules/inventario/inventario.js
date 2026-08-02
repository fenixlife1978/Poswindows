function cargarInventario(){


const db=getDB();



const tabla =
document.getElementById(
"tablaInventario"
);



if(!tabla)
return;



tabla.innerHTML="";



let valorTotal=0;

let bajos=0;



db.productos.forEach(p=>{


let valor =
p.stock *
p.costo;



valorTotal+=valor;



if(p.stock<10)
bajos++;



tabla.innerHTML += `


<tr>

<td>
${p.codigo}
</td>


<td>
${p.nombre}
</td>


<td>
${p.stock}
</td>


<td>
$${p.costo || 0}
</td>


<td>
$${valor.toFixed(2)}
</td>


</tr>


`;



});





document
.getElementById(
"totalProductosInv"
)
.innerHTML=
db.productos.length;



document
.getElementById(
"stockBajoInv"
)
.innerHTML=
bajos;



document
.getElementById(
"valorInventario"
)
.innerHTML=
"$"+valorTotal.toFixed(2);



mostrarMovimientos();



}







function registrarMovimiento(){


const db=getDB();



let codigo =
prompt(
"Código producto"
);



let producto =
db.productos.find(
p=>p.codigo===codigo
);



if(!producto){

alert(
"Producto no encontrado"
);

return;

}



let tipo =
prompt(
"Tipo: ENTRADA / SALIDA"
);



let cantidad =
Number(
prompt(
"Cantidad"
)
);



if(tipo==="ENTRADA"){


producto.stock+=cantidad;


}



if(tipo==="SALIDA"){


producto.stock-=cantidad;


if(producto.stock<0)
producto.stock=0;


}





if(!db.movimientos)
db.movimientos=[];



db.movimientos.push({

id:Date.now(),

fecha:
new Date()
.toLocaleString(),

producto:
producto.nombre,

tipo:tipo,

cantidad:cantidad

});



saveDB(db);


cargarInventario();


}








function mostrarMovimientos(){


const db=getDB();



const tabla =
document.getElementById(
"tablaMovimientos"
);



if(!tabla)
return;



tabla.innerHTML="";



(db.movimientos || [])
.slice(-10)
.reverse()
.forEach(m=>{


tabla.innerHTML+=`

<tr>


<td>
${m.fecha}
</td>


<td>
${m.producto}
</td>


<td>
${m.tipo}
</td>


<td>
${m.cantidad}
</td>


</tr>

`;


});


}