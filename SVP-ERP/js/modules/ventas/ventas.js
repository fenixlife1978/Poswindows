function cargarVentas(){


const db=getDB();



const tabla =
document.getElementById(
"tablaVentas"
);



if(!tabla)
return;



tabla.innerHTML="";



db.ventas
.slice()
.reverse()
.forEach(v=>{


let cliente =
db.clientes.find(
c=>c.id===v.clienteId
);



tabla.innerHTML+=`

<tr>


<td>
FAC-${v.id}
</td>


<td>
${v.fecha}
</td>


<td>
${cliente ? cliente.nombre : "Consumidor Final"}
</td>


<td>
$${v.total.toFixed(2)}
</td>


<td>
${v.pago || ""}
</td>


<td>


<button class="action-btn edit">

Ver

</button>


</td>


</tr>


`;



});


}