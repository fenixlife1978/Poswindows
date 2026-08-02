function exportarBackup(){
const db=getDB();

let archivo =
new Blob(
[
JSON.stringify(
db,
null,
2
)
],
{
type:
"application/json"
}
);

let link =
document.createElement(
"a"
);

link.href =
URL.createObjectURL(
archivo
);

link.download =
"SVP_ERP_BACKUP.json";

link.click();
}

function importarBackup(event){
let archivo =
event.target.files[0];

if(!archivo) return;

let lector =
new FileReader();

lector.onload=function(){
try {
  JSON.parse(lector.result); // Validar formato JSON
  localStorage.setItem(
    "SVP_ERP_DATABASE",
    lector.result
  );

  alert(
    "Backup restaurado con éxito. El sistema se reiniciará."
  );

  location.reload();
} catch (e) {
  alert("El archivo no es un backup válido de SVP ERP");
}
};

lector.readAsText(
archivo
);
}