function cargarClientes(){


const db=getDB();



const tabla =
document.getElementById(
"tablaClientes"
);



if(!tabla)
return;



tabla.innerHTML="";



db.clientes.forEach(cliente=>{


let compras =
db.ventas.filter(
v=>v.clienteId===cliente.id
)
.length;



tabla.innerHTML+=`

<tr>


<td>
${cliente.documento || ""}
</td>



<td>
${cliente.nombre}
</td>



<td>
${cliente.telefono || ""}
</td>



<td>
${cliente.correo || ""}
</td>



<td>
${compras}
</td>



<td>


<button 
class="action-btn edit"
onclick="editarCliente(${cliente.id})">

Editar

</button>



<button
class="action-btn delete"
onclick="eliminarCliente(${cliente.id})">

Eliminar

</button>



</td>



</tr>

`;



});


}







function nuevoCliente(){


abrirModal(

"Nuevo Cliente",

`

<input id="cliNombre"
placeholder="Nombre completo">


<input id="cliDocumento"
placeholder="Cédula / RIF">


<input id="cliTelefono"
placeholder="Teléfono">


<input id="cliCorreo"
placeholder="Correo">


`,


()=>{


const db=getDB();



db.clientes.push({


id:Date.now(),


nombre:
document
.getElementById(
"cliNombre"
)
.value,


documento:
document
.getElementById(
"cliDocumento"
)
.value,


telefono:
document
.getElementById(
"cliTelefono"
)
.value,


correo:
document
.getElementById(
"cliCorreo"
)
.value


});



saveDB(db);



cerrarModal();



cargarClientes();



}


);


}







function editarCliente(id){


const db=getDB();



let cliente =
db.clientes.find(
c=>c.id===id
);



if(!cliente)
return;



cliente.telefono =
prompt(
"Nuevo teléfono",
cliente.telefono
);



cliente.correo =
prompt(
"Nuevo correo",
cliente.correo
);



saveDB(db);


cargarClientes();


}







function eliminarCliente(id){


const db=getDB();



db.clientes =
db.clientes.filter(
c=>c.id!==id
);



saveDB(db);


cargarClientes();


}