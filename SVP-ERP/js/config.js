function cargarConfiguracion(){
const db=getDB();
const el = document.getElementById("empresaActual");
if(el) el.innerHTML = db.empresa.nombre;
}

function cambiarEmpresa(){
const db=getDB();
let nombre = prompt("Nuevo nombre de empresa", db.empresa.nombre);
if(nombre){
db.empresa.nombre=nombre;
saveDB(db);
cargarConfiguracion();
}
}