function calcularIVA(
monto
){


const db=getDB();



let porcentaje =
db.empresa.iva || 16;



return monto *
(porcentaje/100);



}






function convertirBolivares(
dolares
){


const db=getDB();



let tasa =
db.empresa.tasa || 1;



return dolares *
tasa;


}







function formatoMoneda(
monto
){


return new Intl.NumberFormat(
"es-VE",
{

style:"currency",

currency:"USD"

}

)
.format(monto);


}