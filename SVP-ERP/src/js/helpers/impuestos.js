const db =
require(
"../database"
);





function obtenerIVA(){



const config=

db.prepare(

"SELECT iva FROM configuracion WHERE id=1"

)

.get();





return config ?

config.iva :

16;



}

module.exports = { obtenerIVA };