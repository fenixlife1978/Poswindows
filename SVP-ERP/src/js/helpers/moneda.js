const db =
require(
"../database"
);







function obtenerTasaBCV(){



const config =

db.prepare(

"SELECT tasaBCV FROM configuracion WHERE id=1"

)

.get();



return config ?

config.tasaBCV :

0;



}









function usdABs(

monto

){



return monto *

obtenerTasaBCV();



}









function formatoUSD(

valor

){



return "$"+

Number(valor)

.toFixed(2);



}









function formatoBS(

valor

){



return "Bs "+

Number(valor)

.toFixed(2);



}

module.exports = {
  obtenerTasaBCV,
  usdABs,
  formatoUSD,
  formatoBS
};