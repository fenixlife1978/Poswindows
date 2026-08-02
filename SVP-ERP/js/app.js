document.addEventListener(
"DOMContentLoaded",
()=>{


const btnLogin =
document.getElementById(
"btnEntrar"
);



if(btnLogin){

btnLogin.onclick =
()=>{

if(loginSistema()){

cargarRuta(
"dashboard"
);

}

};

}





const btnSalir =
document.getElementById(
"btnSalir"
);



if(btnSalir){

btnSalir.onclick =
cerrarSesion;

}





document
.querySelectorAll("[data-route]")
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


cargarRuta(
btn.dataset.route
);


});



});



cargarConfiguracion();



}
);