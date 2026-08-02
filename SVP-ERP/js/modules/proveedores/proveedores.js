function cargarProveedores(){
const db=getDB();
const tabla =
document.getElementById(
"tablaProveedores"
);
if(!tabla)
return;
tabla.innerHTML="";
db.proveedores.forEach(p=>{
tabla.innerHTML+=`
<tr>
<td>
${p.rif || ""}
</td>
<td>
${p.nombre}
</td>
<td>
${p.contacto || ""}
</td>
<td>
${p.telefono || ""}
</td>
<td>
<button class="action-btn edit"
onclick="editarProveedor(${p.id})">
Editar
</button>
</td>
</tr>
`;
});
}

function nuevoProveedor(){
abrirModal(
"Nuevo Proveedor",
`
<input id="provNombre"
placeholder="Empresa">
<input id="provRif"
placeholder="RIF">
<input id="provContacto"
placeholder="Contacto">
<input id="provTelefono"
placeholder="Teléfono">
`,
()=>{
const db=getDB();
db.proveedores.push({
id:Date.now(),
nombre:
document
.getElementById(
"provNombre"
)
.value,
rif:
document
.getElementById(
"provRif"
)
.value,
contacto:
document
.getElementById(
"provContacto"
)
.value,
telefono:
document
.getElementById(
"provTelefono"
)
.value
});
saveDB(db);
cerrarModal();
cargarProveedores();
}
);
}

function editarProveedor(id){
const db=getDB();
let p =
db.proveedores.find(
x=>x.id===id
);
if(!p)
return;
p.telefono=
prompt(
"Nuevo teléfono",
p.telefono
);
saveDB(db);
cargarProveedores();
}