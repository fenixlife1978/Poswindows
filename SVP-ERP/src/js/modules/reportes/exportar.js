function exportarReporte(){



const contenido=

document.getElementById(

"resultadoReporte"

)

.innerText;





const archivo=

new Blob(

[contenido],

{

type:"text/plain"

}

);





const enlace=

document.createElement(

"a"

);



enlace.href=

URL.createObjectURL(

archivo

);



enlace.download=

"reporte_svp.txt";



enlace.click();



}