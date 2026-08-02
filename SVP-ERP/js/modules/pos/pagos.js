function seleccionarPago(
metodo
){


metodoPagoActual =
metodo;


document
.querySelectorAll(
".payment"
)
.forEach(btn=>{


btn.classList.remove(
"active"
);


});



event.target
.classList.add(
"active"
);


}