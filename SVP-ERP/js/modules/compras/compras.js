function cargarCompras(){


const db=getDB();



const tabla =
document.getElementById(
"tablaCompras"
);



if(!tabla)
return;



tabla.innerHTML="";



db.compras
.slice()
.reverse()
.forEach(c=>{


tabla.innerHTML+=`

<tr>


<td>
COMP-${c.id}
</td>


<td>
${c.fecha}
</td>


<td>
${c.proveedor}
</td>


<td>
$${c.total}
</td>


<td>
Recibida
</td>


</tr>

`;



});


}






function nuevaCompra(){


const db=getDB();



let proveedor=
prompt(
"Proveedor"
);



let total=
Number(
prompt(
"Total compra"
)
);



if(!proveedor)
return;



db.compras.push({

id:Date.now(),

fecha:
new Date()
.toLocaleString(),

proveedor:proveedor,

total:total

});



saveDB(db);


cargarCompras();


}