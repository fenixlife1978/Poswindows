document.addEventListener(
"keydown",
(e)=>{

// Evitar disparar atajos si el usuario está escribiendo en un input o textarea
if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

if(
e.key==="F2"
){
if (typeof nuevoProducto === 'function') {
  nuevoProducto();
}
}

if(
e.key==="F4"
){
if (typeof cobrarVenta === 'function') {
  cobrarVenta();
}
}

if(
e.key==="Escape"
){
if (typeof carritoPOS !== 'undefined') {
  carritoPOS=[];
  if (typeof actualizarTicket === 'function') {
    actualizarTicket();
  }
}
}

});