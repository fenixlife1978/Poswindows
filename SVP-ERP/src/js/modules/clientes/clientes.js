const db =
require(
"../../database"
);







function cargarClientes(){



const clientes =

db.prepare(

"SELECT * FROM clientes ORDER BY nombre"

)

.all();





const tabla =

document.getElementById(
"tablaClientes"
);



if(!tabla)

return;



tabla.innerHTML="";



clientes.forEach(c=>{


tabla.innerHTML += `


<tr>


<td>

${c.documento || ""}

</td>



<td>

${c.nombre}

</td>



<td>

${c.telefono || ""}

</td>



<td>

${c.correo || ""}

</td>



<td>


<button class="action-btn" onclick="editarCliente(${c.id})">

Editar

</button>



<button class="action-btn" onclick="eliminarCliente(${c.id})" style="color: #dc2626;">

Eliminar

</button>



</td>



</tr>


`;



});



}









function guardarCliente(){



const cliente={


documento:

document.getElementById(
"cliDocumento"
).value,


nombre:

document.getElementById(
"cliNombre"
).value,


telefono:

document.getElementById(
"cliTelefono"
).value,


correo:

document.getElementById(
"cliCorreo"
).value



};





db.prepare(`


INSERT INTO clientes

(

documento,

nombre,

telefono,

correo

)


VALUES

(?,?,?,?)



`)

.run(

cliente.documento,

cliente.nombre,

cliente.telefono,

cliente.correo

);





cerrarModal();



cargarClientes();



}









function editarCliente(id){


const cliente=

db.prepare(

"SELECT * FROM clientes WHERE id=?"

)

.get(id);





abrirModal(

"Editar Cliente",

`
<div class="form-group">
  <label>Nombre Completo:</label>
  <input id="editCliNombre" value="${cliente.nombre}" class="uppercase">
</div>
<div class="form-group">
  <label>Teléfono:</label>
  <input id="editCliTelefono" value="${cliente.telefono || ''}" class="font-mono">
</div>
<div class="form-group">
  <label>Correo Electrónico:</label>
  <input id="editCliCorreo" value="${cliente.correo || ''}" class="lowercase">
</div>
`,

()=>{


db.prepare(`


UPDATE clientes

SET

nombre=?,

telefono=?,

correo=?

WHERE id=?



`)

.run(

document.getElementById(
"editCliNombre"
).value,


document.getElementById(
"editCliTelefono"
).value,


document.getElementById(
"editCliCorreo"
).value,


id

);



cerrarModal();



cargarClientes();



}

);



}









function eliminarCliente(id){



if(

!confirm(
"¿Eliminar cliente?"

)

)

return;





db.prepare(

"DELETE FROM clientes WHERE id=?"

)

.run(id);



cargarClientes();



}